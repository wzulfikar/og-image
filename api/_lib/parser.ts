import { IncomingMessage } from 'http';
import { parse } from 'url';
import { NO_IMAGE, ParsedRequest, Theme } from './types';

const THEMES: { [key: string]: ParsedRequest['theme'] } = {
    light: 'light',
    dark: 'dark',
    dimmed: 'dimmed',
    custom: 'custom',
};

const DEFAULT_THEME: ParsedRequest['theme'] = 'light';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname: rawPathname, query } = parse(req.url || '/', true);
    const {
        fontSize,
        images,
        widths,
        heights,
        theme = DEFAULT_THEME,
        md,
        customBackground,
        customForeground,
        customRadial,
        backgroundImage,
    } = query || {};

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }

    // Remove image path from raw path
    const pathname = rawPathname?.replace('/i/', '/');

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: THEMES[theme] || DEFAULT_THEME, // Fallback to default theme if theme is invalid
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
        customBackground: customBackground as string | undefined,
        customForeground: customForeground as string | undefined,
        customRadial: customRadial as string | undefined,
        backgroundImage: backgroundImage as string | undefined,
    };
    parsedRequest.images = getDefaultImages(
        parsedRequest.images,
        parsedRequest.theme
    );

    // Remove first image if user selected the "No image" option
    if (parsedRequest.images[0] === NO_IMAGE) {
        parsedRequest.images = parsedRequest.images.slice(1);
    }

    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
    const defaultImage =
        theme === 'light'
            ? 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg'
            : 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg';

    if (!images || !images[0]) {
        return [defaultImage];
    }

    // Resolve svgporn images to the actual url
    const svgpornBaseUrl = 'https://cdn.svgporn.com/logos';
    images.forEach((image, i) => {
        if (image.startsWith('svgporn/')) {
            const logo = image.replace('svgporn/', '');
            images[i] = `${svgpornBaseUrl}/${logo}.svg`;
        }
    });

    return images;
}
