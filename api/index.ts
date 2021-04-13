import { FileType } from './_lib/types';
import { IncomingMessage, ServerResponse } from 'http';
import { parseRequest } from './_lib/parser';
import { getScreenshot, getWebScreenshot } from './_lib/chromium';
import templates from './_lib/templates';

const isDev = !process.env.AWS_REGION;
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1';

function sendFile(res: ServerResponse, file: Buffer, fileType: FileType) {
    res.statusCode = 200;
    res.setHeader('Content-Type', `image/${fileType}`);
    res.setHeader(
        'Cache-Control',
        `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.end(file);
}

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse
) {
    try {
        const parsedReq = await parseRequest(req);

        const { template, fileType } = parsedReq;

        // Handle web screenshot
        if (template === 'webscreenshot') {
            // Do nothing if `text` is non url
            if (!parsedReq.text.startsWith('http')) return;

            const file = await getWebScreenshot(
                parsedReq.text,
                fileType,
                isDev
            );
            sendFile(res, file, fileType);
            return;
        }

        const getHtml = templates[template];

        const html = getHtml(parsedReq);
        if (isHtmlDebug) {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
            return;
        }
        const file = await getScreenshot(html, fileType, isDev);
        sendFile(res, file, fileType);
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>');
        console.error(e);
    }
}
