import marked from 'marked';
import { ParsedRequest } from '../types';
import { sanitizeHtml } from '../sanitizer';
import { getCss } from './utils';

const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const DEFAULT_FONT_SIZE = '150px';
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
        authorName = 'John Doe',
        date,
    } = parsedReq;

    let authorImage = parsedReq.authorImage;

    // Use initial if author image is not provided
    if (!authorImage) {
        authorImage = `https://ui-avatars.com/api/?name=${authorName}&format=svg`;
    }

    const footerImages = images
        .map((img, i) => getImage(img, widths[i], heights[i]))
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
            backgroundImage
        )}
        .container {
            width: 85%;
            height: 80%;
            background: white;
            margin: 2rem 2rem;
            margin-bottom: 3rem;
            border-radius: 2rem 2rem 0 0;
            border: 4px solid black;
            border-bottom: 10px solid black;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .container > .container-shadow {
            position: absolute;
            background: #565656;
            opacity: 0.85;
            width: 84%;
            height: 80%;
            top: 140px;
            margin-left: 23px;
            z-index: -1;
            border-top-right-radius: 1rem;
        }
        .title {
            text-align: left;
            padding-top: 4rem;
            padding-left: 4rem;
            padding-right: 4rem;
            line-height: 1;
            color: ${customForeground};
        }
        .title p {
            margin-top: 1rem;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4rem;
        }
        .footer .images img {
            margin: 0px;
            margin-right: 4rem;
            max-height: 6rem;
        }
        .author {
            display: flex;
            align-items: center;
            margin-left: 3rem;
            font-family: 'Inter';
            font-size: 3rem;
        }
        .author .author-name {
            margin-left: 0.5rem;
        }
        .author div {
            display: inline-block;
        }
        .author img {
            border: 3px solid black;
            border-radius: 50px;
            padding: 4px;
            margin-left: 1rem;
            margin-right: 1rem;
            width: 4.5rem;
            height: 4.5rem;
        }
    </style>
    <body>
        <div class="container">
            <div class="heading title">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}</div>
            <div class="footer">
                <div class="author">
                    <img src="${sanitizeHtml(authorImage as string)}"/>
                    <div class="author-name">${authorName}</div>
                    ${date ? `&nbsp;·&nbsp;<div>${date}</div>` : ''}
                </div>
                <div class="images">
                ${footerImages}
                </div>
            </div>
            <div class="container-shadow"></div>
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
