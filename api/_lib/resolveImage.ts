import fetch from 'node-fetch';

// Mapping of prefix and image resolver.
// Resolver can be plain string template or async function.
const rules = [
    // Resolve svg from svgporn
    ['svgporn/', `https://cdn.svgporn.com/logos/{img}.svg`],
    ['svg/', `https://cdn.svgporn.com/logos/{img}.svg`],

    // Resolve github from github
    ['github/', `https://github.com/{img}.png`],
    ['gh/', `https://github.com/{img}.png`],

    // Resolve instagram from instagram
    ['instagram/', resolveInstagram],
    ['ig/', resolveInstagram],
];

async function resolveInstagram(img: string): Promise<string | null> {
    const endpoint = `https://www.instagram.com/${img}/?__a=1`;

    const { data, error } = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async (res: any) => ({
            data: await res.json(),
            error: null,
        }))
        .catch((e: Error) => {
            return { data: null, error: e.message };
        });

    if (error) {
        console.log('[ERROR] resolveInstagram failed:', error);
        return null;
    }

    return data?.graphql?.user?.profile_pic_url || null;
}

export default async function resolveImage(image: string): Promise<string> {
    // Return early if image is absolute url
    if (image.startsWith('http')) return image;

    for (let i = 0; i < rules.length; i++) {
        const [prefix, target] = rules[i];
        if (image.startsWith(prefix as string)) {
            const img = image.replace(prefix as string, '');
            if (typeof target === 'string') {
                return (target as string).replace('{img}', img);
            }

            // Return resolved image or raw image string (eg. image not found)
            const resolvedImg = await target(img);
            return resolvedImg || image;
        }
    }

    return image;
}
