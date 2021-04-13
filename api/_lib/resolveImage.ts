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
];

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
        }
    }

    return image;
}
