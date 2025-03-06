
import { useState } from "react";
import { HF_API_KEY, getSupportedRatios } from "@/constants/imageGeneratorConstants";

export const useImageState = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("stabilityai/sdxl-turbo"); // Set SDXL Turbo as default
  const [selectedStyle, setSelectedStyle] = useState("ultra-photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState([75]); // Higher default for better quality
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");
  const [numberOfImages, setNumberOfImages] = useState(4); // Default to 4 images
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [guidanceScale, setGuidanceScale] = useState(9); // Default guidance scale
  const [steps, setSteps] = useState(45); // Default steps (higher for quality)
  const [uniqueHash, setUniqueHash] = useState(Date.now().toString());

  // Handle model change and ensure the aspect ratio is supported
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    
    // Get supported ratios for this model
    const supportedRatios = getSupportedRatios(model);
    
    // If current aspect ratio is not supported by the new model, switch to a supported one
    if (!supportedRatios.includes(aspectRatio)) {
      setAspectRatio(supportedRatios[0]); // Use the first supported ratio
    }
  };

  // Reset unique hash to force new images on each generation
  const resetUniqueHash = () => {
    setUniqueHash(Date.now().toString() + Math.random().toString(16).slice(2));
  };

  return {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel: handleModelChange,
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
  };
};
