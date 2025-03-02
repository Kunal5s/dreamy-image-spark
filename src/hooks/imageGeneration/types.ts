
// Types for image generation functionality
export interface ImageGenerationState {
  prompt: string;
  selectedModel: string;
  selectedStyle: string;
  aspectRatio: string;
  detailLevel: number[];
  generatedImage: string;
  isGenerating: boolean;
  imageLoaded: boolean;
  error: string;
  apiStatus: string;
}

export interface ImageGenerationActions {
  setPrompt: (prompt: string) => void;
  setSelectedModel: (model: string) => void;
  setSelectedStyle: (style: string) => void;
  setAspectRatio: (ratio: string) => void;
  setDetailLevel: (level: number[]) => void;
  generateImage: () => Promise<void>;
  handleImageLoad: () => void;
  handleCopyPrompt: () => void;
  handleSaveImage: () => void;
  handleDownloadImage: () => void;
}

export type ImageGenerationHook = ImageGenerationState & ImageGenerationActions;
