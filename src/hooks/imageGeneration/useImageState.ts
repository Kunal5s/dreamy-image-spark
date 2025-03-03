
import { useState } from "react";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";

export const useImageState = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("runware:100@1");
  const [selectedStyle, setSelectedStyle] = useState("hyper-realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState([75]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");
  // Initialize with the Hugging Face API key for easier user experience
  const [apiKey, setApiKey] = useState(HF_API_KEY);
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    setGeneratedImages,
    isGenerating,
    setIsGenerating,
    imagesLoaded,
    setImagesLoaded,
    error,
    setError,
    apiKey,
    setApiKey,
    numberOfImages,
    setNumberOfImages,
    selectedImageIndex,
    setSelectedImageIndex
  };
};
