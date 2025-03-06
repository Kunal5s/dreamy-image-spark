
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
    generatedImages,
    setGeneratedImages,
    isGenerating,
    setIsGenerating,
    imagesLoaded,
    setImagesLoaded,
    error,
    setError,
    numberOfImages,
    setNumberOfImages,
    selectedImageIndex,
    setSelectedImageIndex,
    guidanceScale,
    setGuidanceScale,
    steps,
    setSteps,
    uniqueHash,
    resetUniqueHash
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
    generatedImages,
    setGeneratedImages,
    setIsGenerating,
    setImagesLoaded,
    setError,
    numberOfImages,
    setSelectedImageIndex,
    guidanceScale,
    steps,
    uniqueHash,
    resetUniqueHash
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
    generatedImages,
    isGenerating,
    imagesLoaded,
    error,
    apiStatus,
    numberOfImages,
    setNumberOfImages,
    selectedImageIndex,
    setSelectedImageIndex,
    guidanceScale,
    setGuidanceScale,
    steps, 
    setSteps,
    generateImage,
    handleImageLoad,
    handleCopyPrompt,
    handleSaveImage,
    handleDownloadImage
  };
};
