// Url to current deployment
const localProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const localUrl = `${localProtocol}://${process.env.VERCEL_URL}`;

const unavatarBaseUrl = 'https://unavatar.vercel.app';

// Mapping of prefix and image resolver.
// Resolver can be plain string template or async function.
const rules = [
    // Resolve svg from svgporn
    ['svgporn/', `https://cdn.svgporn.com/logos/{img}.svg`],
    ['svg/', `https://cdn.svgporn.com/logos/{img}.svg`],

    // Resolve github from github
    ['github/', `https://github.com/{img}.png`],
    ['gh/', `https://github.com/{img}.png`],

    // Resolve random user
    ['randomuser/men/', `https://randomuser.me/portraits/men/{img}.jpg`],
    ['randomuser/women/', `https://randomuser.me/portraits/women/{img}.jpg`],
    ['randomuser/lego/', `https://randomuser.me/portraits/lego/{img}.jpg`],

    // Resolve webshot
    ['webshot/', resolveWebshot],

    // Resolve hashvatar
    ['hashvatar/', `https://hashvatar.vercel.app/{img}`],

    // Resolve providers using unavatar (https://unavatar.vercel.app).
    // Some providers no longer support public api. We only resolve
    // providers that still support it.
    ['clearbit/', `${unavatarBaseUrl}/clearbit/{img}`],
    ['deviantart/', `${unavatarBaseUrl}/deviantart/{img}`],
    ['dribbble/', `${unavatarBaseUrl}/dribbble/{img}`],
    ['duckduckgo/', `${unavatarBaseUrl}/duckduckgo/{img}`],
    ['facebook/', `${unavatarBaseUrl}/facebook/{img}`],
    ['fb/', `${unavatarBaseUrl}/facebook/{img}`],
    ['gravatar/', `${unavatarBaseUrl}/gravatar/{img}`],
    ['reddit/', `${unavatarBaseUrl}/reddit/{img}`],
    ['soundcloud/', `${unavatarBaseUrl}/soundcloud/{img}`],
    ['substack/', `${unavatarBaseUrl}/substack/{img}`],
    ['telegram/', `${unavatarBaseUrl}/telegram/{img}`],
    ['tg/', `${unavatarBaseUrl}/telegram/{img}`],

    // For those who like it verbose, use "unavatar/reddit/{somename}"
    ['unavatar/', `${unavatarBaseUrl}/{img_raw}`],
];

function resolveWebshot(img: string) {
    try {
        new URL(img);
        return `${localUrl}/i/${encodeURIComponent(img)}.png?template=webshot`;
    } catch (e) {
        return '';
    }
}

export default async function resolveImage(image: string): Promise<string> {
    // Return early if image is absolute url
    if (image.startsWith('http')) return image;

    for (let i = 0; i < rules.length; i++) {
        const [prefix, target] = rules[i];
        if (image.startsWith(prefix as string)) {
            const img = image.replace(prefix as string, '');
            if (typeof target === 'string') {
                return (target as string)
                    .replace('{img_raw}', decodeURIComponent(img))
                    .replace('{img}', encodeURIComponent(img));
            } else {
                return await target(img);
            }
        }
    }

    return image;
}
