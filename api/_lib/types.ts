export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark' | 'dimmed' | 'custom';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
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
