import { IncomingMessage } from 'http';
import { parse } from 'url';

import resolveImage from './resolveImage';
import { NO_IMAGE, ParsedRequest, Theme } from './types';

const THEMES: { [key: string]: ParsedRequest['theme'] } = {
    light: 'light',
    dark: 'dark',
    dimmed: 'dimmed',
    custom: 'custom',
};

const DEFAULT_TEMPLATE = 'default';

const DEFAULT_THEME: ParsedRequest['theme'] = 'dark';

export async function parseRequest(req: IncomingMessage) {
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
        subheader,
        subheaderColor,
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

    // Resolve background image
    let { backgroundImage } = query;
    if (backgroundImage) {
        backgroundImage = await resolveImage(backgroundImage as string);
    }

    const template = (query.template as string)?.trim() || DEFAULT_TEMPLATE;

    // Template props
    let { authorImage, authorName, date } = query;

    // Resolve author image
    if (authorImage) {
        authorImage = await resolveImage(authorImage as string);
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        template: template as string,
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

        // Template props: devto
        authorImage: authorImage as string,
        authorName: authorName as string,
        date: date as string,

        // Template props: article
        subheader: subheader as string,
        subheaderColor: subheaderColor as string,
    };

    parsedRequest.images = await getDefaultImages(
        parsedRequest.images,
        parsedRequest.theme
    );

    // Remove first image if user selected the "No image" option
    if (parsedRequest.images[0] === NO_IMAGE) {
        parsedRequest.images = parsedRequest.images.slice(1);
    }

    if (process.env.NODE_ENV === 'development') {
        console.debug('[DEBUG] parsedRequest:', parsedRequest);
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

async function getDefaultImages(
    images: string[],
    theme: Theme
): Promise<string[]> {
    const defaultImage =
        theme === 'light'
            ? 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg'
            : 'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg';

    // Use default image for first image
    if (!images[0]) {
        images[0] = defaultImage;
    }

    await Promise.all(
        images.map(async (image, i) => {
            images[i] = await resolveImage(image);
        })
    );

    return images;
}
