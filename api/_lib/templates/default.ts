import marked from 'marked';
import { ParsedRequest } from '../types';
import { sanitizeHtml } from '../sanitizer';
import { getCss } from './utils';

const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

export function getHtml(parsedReq: ParsedRequest) {
    const {
        text,
        theme,
        md,
        fontSize,
        images,
        widths,
        heights,
        customBackground,
        customForeground,
        customRadial,
        backgroundImage,
    } = parsedReq;

    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image – Default Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(
            theme,
            fontSize,
            customBackground,
            customForeground,
            customRadial,
            backgroundImage
        )}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
                    .map(
                        (img, i) =>
                            getPlusSign(i) +
                            getImage(img, widths[i], heights[i])
                    )
                    .join('')}
            </div>
            <div class="spacer">
            <div style="line-height: 1" class="${
                images.length ? 'heading' : 'heading no-image'
            }">${emojify(md ? marked(text) : sanitizeHtml(text))}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = 'auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
