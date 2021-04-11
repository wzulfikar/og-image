import { ParsedRequest, Theme, FileType } from '../api/_lib/types';

// TODO: fix non-types import so we can just import this from api/_lib/types
const NO_IMAGE = 'NO_IMAGE';

const { H, R, copee, fathom } = window as any;
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onclick: () => void;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const EVENTS = {
    copyImageUrl: 'QIRAPKU6',
    downloadImage: 'TIGSZB4E',
    fields_selectNoImage: 'K7K0U6WF',
    fields_selectCustomTheme: 'FTLQFX1M',
    fields_insertBackgroundImage: 'TRQT6IPC',
    fields_addImage: 'IYZUFBCY',
};

// Register events that should only be tracked once per page view
const trackOnce: { [key: string]: boolean } = {
    fields_selectNoImage: false,
    fields_selectCustomTheme: false,
    fields_insertBackgroundImage: false,
};

function trackEvent(event: keyof typeof EVENTS, centValue?: number) {
    if (trackOnce[event] === undefined || trackOnce[event] === false) {
        fathom.trackGoal(EVENTS[event], centValue);
        trackOnce[event] = true; // Mark event as tracked
    }
}

const ImagePreview = ({
    src,
    onclick,
    onload,
    onerror,
    loading,
}: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
        borderRadius: '5px',
    };
    const title = 'Click to copy image URL to clipboard';
    return H(
        'a',
        { className: 'image-wrapper', href: src, onclick },
        H('img', { src, onload, onerror, style, title })
    );
};

interface DropdownOption {
    text: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({ options, value, onchange, small }: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H(
        'div',
        { className: wrapper },
        H(
            'select',
            { onchange: (e: any) => onchange(e.target.value) },
            options.map((o) =>
                H(
                    'option',
                    { value: o.value, selected: value === o.value },
                    o.text
                )
            )
        ),
        H('div', { className: arrow }, '▼')
    );
};

interface TextInputProps {
    value: string;
    type?: string;
    placeholder?: string;
    oninput: (val: string) => void;
}

const TextInput = ({
    value,
    oninput,
    type = 'text',
    placeholder = '',
}: TextInputProps) => {
    return H(
        'div',
        { className: 'input-outer-wrapper' },
        H(
            'div',
            {
                className: `${
                    type === 'color' ? 'color-hint' : ''
                } input-inner-wrapper`,
            },
            H('input', {
                type: type,
                value,
                placeholder,
                oninput: (e: any) => oninput(e.target.value),
            })
        ),
        H(
            'span',
            {
                className: type === 'color' ? 'color-hint' : undefined,
            },
            type === 'color' ? value : '' // Show color-hint only for input type "color"
        )
    );
};

interface ButtonProps {
    label: string;
    onclick: () => void;
    className?: string;
    style?: object;
}

const Button = ({
    label,
    onclick,
    className = '',
    style = {},
}: ButtonProps) => {
    return H('button', { onclick, className, style }, label);
};

interface FieldProps {
    label: string;
    input: any;
    style?: object;
    extendClass?: string;
}

const Field = ({ label, input, extendClass = '', style = {} }: FieldProps) => {
    return H(
        'div',
        { className: `field ${extendClass}`, style },
        H(
            'label',
            H('div', { className: 'field-label' }, label),
            H('div', { className: 'field-value' }, input)
        )
    );
};

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({ show, message }: ToastProps) => {
    const style = {
        transform: show ? 'translate3d(0,-0px,-0px) scale(1)' : '',
    };
    return H(
        'div',
        { className: 'toast-area' },
        H(
            'div',
            { className: 'toast-outer', style },
            H(
                'div',
                { className: 'toast-inner' },
                H('div', { className: 'toast-message' }, message)
            )
        )
    );
};

const themeOptions: DropdownOption[] = [
    { text: 'Light', value: 'light' },
    { text: 'Dark', value: 'dark' },
    { text: 'Dimmed', value: 'dimmed' },
    { text: 'Custom', value: 'custom' },
];

const fileTypeOptions: DropdownOption[] = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
];

const fontSizeOptions: DropdownOption[] = Array.from({ length: 10 })
    .map((_, i) => i * 25)
    .filter((n) => n > 0)
    .map((n) => ({ text: n + 'px', value: n + 'px' }));

const markdownOptions: DropdownOption[] = [
    { text: 'Plain Text', value: '0' },
    { text: 'Markdown', value: '1' },
];

const imageLightOptions: DropdownOption[] = [
    {
        text: 'Vercel',
        value:
            'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg',
    },
    {
        text: 'Next.js',
        value:
            'https://assets.vercel.com/image/upload/front/assets/design/nextjs-black-logo.svg',
    },
    {
        text: 'Hyper',
        value:
            'https://assets.vercel.com/image/upload/front/assets/design/hyper-color-logo.svg',
    },
    { text: 'No image', value: NO_IMAGE },
];

const imageDarkOptions: DropdownOption[] = [
    {
        text: 'Vercel',
        value:
            'https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg',
    },
    {
        text: 'Next.js',
        value:
            'https://assets.vercel.com/image/upload/front/assets/design/nextjs-white-logo.svg',
    },
    {
        text: 'Hyper',
        value:
            'https://assets.vercel.com/image/upload/front/assets/design/hyper-bw-logo.svg',
    },
    { text: 'No image', value: NO_IMAGE },
];

const widthOptions = [
    { text: 'width', value: 'auto' },
    { text: '50', value: '50' },
    { text: '100', value: '100' },
    { text: '150', value: '150' },
    { text: '200', value: '200' },
    { text: '250', value: '250' },
    { text: '300', value: '300' },
    { text: '350', value: '350' },
];

const heightOptions = [
    { text: 'height', value: 'auto' },
    { text: '50', value: '50' },
    { text: '100', value: '100' },
    { text: '150', value: '150' },
    { text: '200', value: '200' },
    { text: '250', value: '250' },
    { text: '300', value: '300' },
    { text: '350', value: '350' },
];

interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    selectedImageIndex: number;
    widths: string[];
    heights: string[];
    hideFirstImage: boolean;
    overrideUrl: URL | null;
    customBackground?: string;
    customForeground?: string;
    customRadial?: string;
    backgroundImage?: string;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(
                () => setState({ overrideUrl: null }),
                200
            );
        }

        setState({ ...newState, loading: true });
    };
    const {
        fileType = 'png',
        fontSize = '100px',
        theme = 'light',
        md = true,
        text = '**Hello** World',
        images = [imageLightOptions[0].value],
        widths = [],
        heights = [],
        showToast = false,
        messageToast = '',
        loading = true,
        selectedImageIndex = 0,
        overrideUrl = null,
        customBackground = '#000',
        customForeground = '#fff',
        customRadial = 'dimgray',
        backgroundImage = null,
    } = state;
    const mdValue = md ? '1' : '0';
    const imageOptions =
        theme === 'light' ? imageLightOptions : imageDarkOptions;
    const url = new URL(window.location.origin);
    url.pathname = `${encodeURIComponent(text)}.${fileType}`;
    url.searchParams.append('theme', theme);
    url.searchParams.append('md', mdValue);
    url.searchParams.append('fontSize', fontSize);

    // Add custom theme properties
    if (theme === 'custom') {
        url.searchParams.append('customBackground', customBackground);
        url.searchParams.append('customForeground', customForeground);
        url.searchParams.append('customRadial', customRadial);
        if (backgroundImage?.startsWith('http')) {
            url.searchParams.append('backgroundImage', backgroundImage);
        }
    }

    for (let i = 0; i < images.length; i++) {
        if (state.hideFirstImage && i === 0) {
            continue;
        }
        const image = images[i];
        url.searchParams.append('images', image);
    }
    for (let width of widths) {
        url.searchParams.append('widths', width);
    }
    for (let height of heights) {
        url.searchParams.append('heights', height);
    }

    function copyImageUrl() {
        trackEvent('copyImageUrl');
        const success = copee.toClipboard(url.href);
        if (success) {
            setState({
                showToast: true,
                messageToast: 'Copied image URL to clipboard',
            });
            setTimeout(() => setState({ showToast: false }), 3000);
        } else {
            window.open(url.href, '_blank');
        }
    }

    return H(
        'div',
        { className: 'split' },
        H(
            'div',
            {
                className: 'pull-left image-preview-container',
            },
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({ loading: false }),
                onerror: () => {
                    setState({
                        showToast: true,
                        messageToast: 'Oops, an error occurred',
                    });
                    setTimeout(() => setState({ showToast: false }), 2000);
                },
                onclick: (e: Event) => {
                    e.preventDefault();
                    copyImageUrl();
                    return false;
                },
            }),
            H(
                'div',
                { className: 'image-preview-actions' },
                H(Button, {
                    className: 'btn-cta',
                    label: 'Copy image URL',
                    onclick: () => {
                        copyImageUrl();
                    },
                }),
                H(Button, {
                    label: 'Download',
                    style: { marginLeft: '0.5rem' },
                    className: 'btn-cta',
                    onclick: () => {
                        trackEvent('downloadImage');
                        window.open(url.href, '_blank');
                    },
                })
            )
        ),
        H(
            'div',
            {
                className: 'pull-right',
                style: { marginTop: '1rem', minWidth: '30%' },
            },
            H(
                'div',
                H(Field, {
                    label: 'Theme',
                    input: H(Dropdown, {
                        options: themeOptions,
                        value: theme,
                        onchange: (val: Theme) => {
                            const options =
                                val === 'light'
                                    ? imageLightOptions
                                    : imageDarkOptions;
                            let clone = [...images];

                            if (val === 'custom') {
                                trackEvent('fields_selectCustomTheme');
                            }

                            clone[0] = options[selectedImageIndex].value;
                            setLoadingState({ theme: val, images: clone });
                        },
                    }),
                }),
                H(Field, {
                    label: 'Background image',
                    extendClass: 'field-custom',
                    style: {
                        display: state.theme === 'custom' ? 'block' : 'none',
                        borderTopRightRadius: '10px',
                    },
                    input: H(TextInput, {
                        value: backgroundImage,
                        placeholder: 'Insert image url (optional)',
                        title: 'test',
                        oninput: (val: string) => {
                            setLoadingState({ backgroundImage: val });
                        },
                    }),
                }),
                H(Field, {
                    label: 'Custom Background',
                    extendClass: 'field-custom',
                    style: {
                        display: state.theme === 'custom' ? 'block' : 'none',
                    },
                    input: H(TextInput, {
                        type: 'color',
                        value: customBackground,
                        oninput: (val: string) => {
                            setLoadingState({ customBackground: val });
                        },
                    }),
                }),
                H(Field, {
                    label: 'Custom Radial',
                    extendClass: 'field-custom',
                    style: {
                        display: state.theme === 'custom' ? 'block' : 'none',
                    },
                    input: H(TextInput, {
                        type: 'color',
                        value: customRadial,
                        oninput: (val: string) => {
                            setLoadingState({ customRadial: val });
                        },
                    }),
                }),
                H(Field, {
                    label: 'Font Color',
                    extendClass: 'field-custom',
                    style: {
                        display: state.theme === 'custom' ? 'block' : 'none',
                        borderBottomRightRadius: '10px',
                    },
                    input: H(TextInput, {
                        type: 'color',
                        value: customForeground,
                        oninput: (val: string) => {
                            setLoadingState({ customForeground: val });
                        },
                    }),
                }),
                H(Field, {
                    label: 'File Type',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) =>
                            setLoadingState({ fileType: val }),
                    }),
                }),
                H(Field, {
                    label: 'Font Size',
                    input: H(Dropdown, {
                        options: fontSizeOptions,
                        value: fontSize,
                        onchange: (val: string) =>
                            setLoadingState({ fontSize: val }),
                    }),
                }),
                H(Field, {
                    label: 'Text Type',
                    input: H(Dropdown, {
                        options: markdownOptions,
                        value: mdValue,
                        onchange: (val: string) =>
                            setLoadingState({ md: val === '1' }),
                    }),
                }),
                H(Field, {
                    label: 'Text Input',
                    input: H(TextInput, {
                        value: text,
                        oninput: (val: string) => {
                            console.log('oninput ' + val);
                            setLoadingState({ text: val, overrideUrl: url });
                        },
                    }),
                }),
                H(Field, {
                    label: 'Image 1',
                    input: H(
                        'div',
                        H(Dropdown, {
                            options: imageOptions,
                            value: imageOptions[selectedImageIndex].value,
                            onchange: (val: string) => {
                                let clone = [...images];
                                clone[0] = val;
                                const selected = imageOptions
                                    .map((o) => o.value)
                                    .indexOf(val);

                                if (val === NO_IMAGE) {
                                    trackEvent('fields_selectNoImage');
                                }

                                setLoadingState({
                                    images: clone,
                                    selectedImageIndex: selected,
                                });
                            },
                        }),
                        H(
                            'div',
                            { className: 'field-flex' },
                            H(Dropdown, {
                                options: widthOptions,
                                value: widths[0],
                                small: true,
                                onchange: (val: string) => {
                                    let clone = [...widths];
                                    clone[0] = val;
                                    setLoadingState({ widths: clone });
                                },
                            }),
                            H(Dropdown, {
                                options: heightOptions,
                                value: heights[0],
                                small: true,
                                onchange: (val: string) => {
                                    let clone = [...heights];
                                    clone[0] = val;
                                    setLoadingState({ heights: clone });
                                },
                            })
                        )
                    ),
                }),
                ...images.slice(1).map((image, i) =>
                    H(Field, {
                        label: `Image ${i + 2}`,
                        input: H(
                            'div',
                            H(TextInput, {
                                value: image,
                                oninput: (val: string) => {
                                    let clone = [...images];
                                    clone[i + 1] = val;
                                    setLoadingState({
                                        images: clone,
                                        overrideUrl: url,
                                    });
                                },
                            }),
                            H(
                                'div',
                                { className: 'field-flex' },
                                H(Dropdown, {
                                    options: widthOptions,
                                    value: widths[i + 1],
                                    small: true,
                                    onchange: (val: string) => {
                                        let clone = [...widths];
                                        clone[i + 1] = val;
                                        setLoadingState({ widths: clone });
                                    },
                                }),
                                H(Dropdown, {
                                    options: heightOptions,
                                    value: heights[i + 1],
                                    small: true,
                                    onchange: (val: string) => {
                                        let clone = [...heights];
                                        clone[i + 1] = val;
                                        setLoadingState({ heights: clone });
                                    },
                                })
                            ),
                            H(
                                'div',
                                { className: 'field-flex' },
                                H(Button, {
                                    label: `Remove Image ${i + 2}`,
                                    onclick: (e: MouseEvent) => {
                                        e.preventDefault();
                                        const filter = (arr: any[]) =>
                                            [...arr].filter(
                                                (_, n) => n !== i + 1
                                            );
                                        const imagesClone = filter(images);
                                        const widthsClone = filter(widths);
                                        const heightsClone = filter(heights);
                                        setLoadingState({
                                            images: imagesClone,
                                            widths: widthsClone,
                                            heights: heightsClone,
                                        });
                                    },
                                })
                            )
                        ),
                    })
                ),
                H(Field, {
                    label: `Image ${images.length + 1}`,
                    input: H(Button, {
                        label: `Add Image ${images.length + 1}`,
                        onclick: () => {
                            trackEvent('fields_addImage');
                            const nextImage =
                                images.length === 1
                                    ? 'https://cdn.jsdelivr.net/gh/remojansen/logo.ts@master/ts.svg'
                                    : '';
                            setLoadingState({ images: [...images, nextImage] });
                        },
                    }),
                })
            )
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
