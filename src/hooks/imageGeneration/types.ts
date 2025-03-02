
export interface ImageGenerationHook {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  detailLevel: number[];
  setDetailLevel: (level: number[]) => void;
  generatedImages: string[];
  isGenerating: boolean;
  imagesLoaded: Record<number, boolean>;
  error: string;
  apiStatus: string;
  apiKey: string;
  setApiKey: (key: string) => void;
  numberOfImages: number;
  setNumberOfImages: (num: number) => void;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  generateImage: () => Promise<void>;
  handleImageLoad: (index: number) => void;
  handleCopyPrompt: () => void;
  handleSaveImage: (index?: number) => void;
  handleDownloadImage: (index?: number) => void;
}
