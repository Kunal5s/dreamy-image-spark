
import { useState } from "react";

export const useImageState = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("sdxl-turbo");
  const [selectedStyle, setSelectedStyle] = useState("hyper-realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState([75]);
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState("");

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
    setGeneratedImage,
    isGenerating,
    setIsGenerating,
    imageLoaded,
    setImageLoaded,
    error,
    setError
  };
};
