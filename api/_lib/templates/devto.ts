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

    const author = 'Gabriel Lazcano';
    const date = 'Mar 3';

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
        .container {
            width: 100%;
            line-height: 3.5rem;
            background: white;
            margin: 0px 2rem;
            border-radius: 1rem 1rem 0 0;
            border: 2px solid black;
            border-bottom: 5px solid black;
        }
        .title {
            font-family: 'Inter';
            text-align: left;
            padding: 1rem;
            padding-left: 2rem;
            font-size: 58px;
        }
        .title p {
            margin-top: 1rem;
        }
        .author {
            margin-left: 2rem;
            display: flex;
            font-family: 'Inter';
        }
        .author div {
            display: inline-block;
        }
        .author img {
            border: 2px solid black;
            border-radius: 50px;
            margin-left: 0px;
            margin-right: 1rem;
            margin-top: 3px;
            width: 40px;
            height: 40px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
        }
        .footer .images {
            margin-top: auto;
            margin-bottom: auto;
            margin-left: auto;
            margin-right: 2rem;
        }
        .footer .images img {
            margin: 0px;
            height: 50px;
            width: 50px;
        }
    </style>
    <body>
        <div class="container">
            <div class="title">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}</div>
            <div class="footer">
                <div class="author">
                    ${getImage(images[0], widths[0], heights[0])}
                    <div>${author}</div>
                    ${date ? `&nbsp;·&nbsp;<div>${date}</div>` : ''}
                </div>
                <div class="images">
                ${images
                    .map(
                        (img, i) =>
                            getPlusSign(i) +
                            getImage(img, widths[i], heights[i])
                    )
                    .join('')}
                </div>
            <div>
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
