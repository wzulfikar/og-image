export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark' | 'dimmed' | 'custom';
export type Template = 'default' | 'devto';

// Determine if user wants no image (used for image #0).
export const NO_IMAGE = 'NO_IMAGE';

// Optional props that activate based on template
export interface TemplateProps {
    authorImage?: string;
    authorName?: string;
    date?: string;
}

export interface ParsedRequest extends TemplateProps {
    fileType: FileType;
    text: string;
    template: string;
    theme: Theme;
    md: boolean;
    fontSize: string;
    images: string[];
    widths: string[];
    heights: string[];
    customBackground?: string;
    customForeground?: string;
    customRadial?: string;
    backgroundImage?: string;
}
