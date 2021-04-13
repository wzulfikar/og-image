// Mapping of prefix and url template
const rules = [
    ['svgporn/', `https://cdn.svgporn.com/logos/{img}.svg`],
    ['github/', `https://github.com/{img}.png`],
];

export default function resolveImage(image: string): string {
    // Return early if image is absolute url
    if (image.startsWith('http')) return image;

    for (let i = 0; i < rules.length; i++) {
        const [prefix, target] = rules[i];
        if (image.startsWith(prefix as string)) {
            const img = image.replace(prefix, '')
            return target.replace('{img}', img);
        }
    }

    return image;
}
