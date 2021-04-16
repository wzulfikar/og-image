import marked from 'marked';
import { ParsedRequest } from '../types';
import { sanitizeHtml } from '../sanitizer';
import { getCss } from './utils';

const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const DEFAULT_FONT_SIZE = '75px';
const DEFAULT_FOREGROUND = 'black';

export function getHtml(parsedReq: ParsedRequest) {
    const {
        text,
        theme,
        md,
        fontSize = DEFAULT_FONT_SIZE,
        images,
        widths,
        heights,
        customBackground,
        customForeground = DEFAULT_FOREGROUND,
        customRadial,
        backgroundImage,
        subheader = 'VOL 1: Acme Blog',
        subheaderColor = '#ff8502',
    } = parsedReq;

    const direction = 'row'; // Can be row or row-reverse

    const withRadial = false;

    const titleColor = ['dark', 'dimmed'].includes(theme)
        ? 'white'
        : customForeground;

    const mainImage = getImage(images[0], widths[0], heights[0]);

    const footerImages = images
        .splice(1)
        .map((img, i) => getImage(img, widths[i + 1], heights[i + 1]))
        .join('');

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
            backgroundImage,
            withRadial
        )}
        .container {
            display: flex;
            flex-direction: ${direction};
            justify-content: space-between;
            width: 100%;
            height: 80%;
            margin: 2rem 2rem;
            margin-bottom: 3rem;
        }
        .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: 4rem;
            padding-right: 4rem;
            width: 50%;
        }
        .subheader {
            text-align: left;
            font-size: 2.5rem;
            font-weight: 600;
            font-family: 'Inter';
            color: ${subheaderColor};
        }
        .main-image {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50%;
        }
        .title {
            text-align: left;
            padding-top: 4rem;
            color: ${titleColor};
            line-height: 1;
        }
        .title p {
            margin-top: 1rem;
        }
        .footer {
            display: flex;
            justify-content: space-between;
        }
        .footer .images {
            margin-left: 0.5rem;
        }
        .footer .images img {
            margin: 0px;
            margin-right: 2rem;
            max-height: 6rem;
        }
    </style>
    <body>
        <div class="container">
            <div class="content">
                <div class="subheader">
                    ${subheader}
                </div>
                <div class="heading title">${emojify(
                    md ? marked(text) : sanitizeHtml(text)
                )}</div>
                <div class="footer">
                    <div class="images">
                    ${footerImages}
                    </div>
                </div>
            </div>
            <div class="main-image">
                ${mainImage}
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
