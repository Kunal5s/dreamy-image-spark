
import { useState } from "react";

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
  const [apiKey, setApiKey] = useState("");
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
