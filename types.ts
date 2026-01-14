export interface UploadedFile {
  file: File | null; // Can be null if using a preset
  previewUrl: string;
  base64: string | null;
  mimeType: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  description: string;
  visualPrompt: string; // The text description for Gemini if no image is uploaded
  icon: string; // Icon or preview image URL
  quote: string;
}

export interface ModelStyle {
  id: string;
  name: string;
  title: string;
  description: string;
  imagePath: string; // Path to the full-size model style image
  thumbPath?: string; // Path to optimized thumbnail for grid display
  visualPrompt: string;
  characterCount: 1 | 2; // Number of characters in this model (1=single, 2=couple)
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum AIProvider {
  GEMINI = 'gemini',
  NKG = 'nkg',
}

export interface GeneratedImage {
  url: string;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}