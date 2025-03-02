
import { useImageState } from "./imageGeneration/useImageState";
import { useApiConnection } from "./imageGeneration/useApiConnection";
import { useImageActions } from "./imageGeneration/useImageActions";
import { ImageGenerationHook } from "./imageGeneration/types";

export const useImageGeneration = (): ImageGenerationHook => {
  const { apiStatus } = useApiConnection();
  
  const {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    selectedStyle,
    setSelectedStyle,
    aspectRatio,
    setAspectRatio,
    detailLevel,
    setDetailLevel,
    generatedImage,
    setGeneratedImage,
    isGenerating,
    setIsGenerating,
    imageLoaded,
    setImageLoaded,
    error,
    setError
  } = useImageState();

  const {
    generateImage,
    handleImageLoad,
    handleCopyPrompt,
    handleSaveImage,
    handleDownloadImage
  } = useImageActions({
    prompt,
    selectedModel,
    selectedStyle,
    aspectRatio,
    detailLevel,
    generatedImage,
    setGeneratedImage,
    setIsGenerating,
    setImageLoaded,
    setError
  });

  return {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    selectedStyle,
    setSelectedStyle,
    aspectRatio,
    setAspectRatio,
    detailLevel,
    setDetailLevel,
    generatedImage,
    isGenerating,
    imageLoaded,
    error,
    apiStatus,
    generateImage,
    handleImageLoad,
    handleCopyPrompt,
    handleSaveImage,
    handleDownloadImage
  };
};
