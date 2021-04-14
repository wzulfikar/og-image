import fetch from 'node-fetch';
import FileType from 'file-type';
import { parse } from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import resolveImage from './_lib/resolveImage';

type DownloadImageResult = {
    file?: Buffer;
    fileType?: string;
};

const localProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const localUrl = `${localProtocol}://${process.env.VERCEL_URL}`;

const fallbackImg = `${localUrl}/unavatar-fallback.png`;

async function downloadImage(url: string): Promise<DownloadImageResult> {
    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await FileType.fromBuffer(buffer);
    if (fileType?.ext) {
        return { file: buffer, fileType: fileType.ext };
    }

    console.log('[ERROR] downloadImage failed:', url);
    return {};
}

export default async function handler(
    req: IncomingMessage,
    res: ServerResponse
) {
    try {
        const { pathname } = parse(req.url as string);
        const img = pathname!.replace('/r/', '');
        const imgUrl = await resolveImage(img);

        let { file, fileType } = await downloadImage(imgUrl);

        // Use fallback image if not found
        let isFallback = false;
        if (!file) {
            const fallback = await downloadImage(fallbackImg);
            isFallback = true;

            file = fallback.file;
            fileType = fallback.fileType;
        }

        res.statusCode = isFallback ? 404 : 200;
        res.setHeader('Content-Type', `image/${fileType}`);
        res.setHeader(
            'Cache-Control',
            `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
        );
        res.end(file);
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>');
        console.error(e);
    }
}
