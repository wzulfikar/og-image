export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark' | 'dimmed' | 'custom';

// Determine if user wants no image (used for image #0).
export const NO_IMAGE = 'NO_IMAGE';

export interface ParsedRequest {
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
