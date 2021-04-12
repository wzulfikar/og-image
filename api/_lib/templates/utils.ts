import { readFileSync } from 'fs';

import { sanitizeHtml } from '../sanitizer';

const rglr = readFileSync(
    `${__dirname}/../../_fonts/Inter-Regular.woff2`
).toString('base64');

const bold = readFileSync(
    `${__dirname}/../../_fonts/Inter-Bold.woff2`
).toString('base64');

const mono = readFileSync(`${__dirname}/../../_fonts/Vera-Mono.woff2`).toString(
    'base64'
);

const defaultBackgroundImage = (radial: string) =>
    `radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%)`;

export function getCss(
    theme: string,
    fontSize: string,
    customBackground?: string,
    customForeground?: string,
    customRadial?: string,
    customBackgroundImage?: string
) {
    let radial = 'lightgray';
    let background = 'white';
    let backgroundImage = defaultBackgroundImage(radial);
    let foreground = 'black';

    switch (theme) {
        case 'dark':
            radial = '#313131';
            background = 'black';
            backgroundImage = defaultBackgroundImage(radial);
            foreground = 'white';
            break;
        case 'dimmed':
            radial = '#4a4a4a';
            background = '#1e2228';
            backgroundImage = defaultBackgroundImage(radial);
            foreground = 'white';
            break;
        case 'custom':
            radial = customRadial as string;
            background = customBackground as string;
            backgroundImage = (customBackgroundImage?.startsWith('http')
                ? `url(${customBackgroundImage})`
                : defaultBackgroundImage(radial)) as string;
            foreground = customForeground as string;
            break;
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-image: ${backgroundImage};
        background-size: 100px 100px;
        ${
            backgroundImage.startsWith('url(')
                ? `
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        `
                : ''
        }
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }
    .heading.no-image {
        margin-top: -125px;
    }`;
}
