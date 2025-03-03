import { useState } from "react";
import { toast } from "sonner";
import { styles, HF_API_KEY } from "@/constants/imageGeneratorConstants";
import { getDimensions, enhancePrompt } from "./utils";
import { getRunwareService, GeneratedImage } from "@/services/runwareService";

interface ImageActionsProps {
  prompt: string;
  selectedModel: string;
  selectedStyle: string;
  aspectRatio: string;
  detailLevel: number[];
  generatedImages: string[];
  setGeneratedImages: (urls: string[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setImagesLoaded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setError: (error: string) => void;
  numberOfImages: number;
  setSelectedImageIndex: (index: number) => void;
}

export const useImageActions = ({
  prompt,
  selectedModel,
  selectedStyle,
  aspectRatio,
  detailLevel,
  generatedImages = [],
  setGeneratedImages,
  setIsGenerating,
  setImagesLoaded,
  setError,
  numberOfImages,
  setSelectedImageIndex
}: ImageActionsProps) => {
  // Function to generate image using Runware API
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast("Please enter a prompt - Your prompt will guide the AI to create your image");
      return;
    }

    setIsGenerating(true);
    setImagesLoaded({});
    setError("");
    setSelectedImageIndex(0);
    
    // Build the complete prompt with style using the new enhancer
    const styleInfo = styles.find(s => s.value === selectedStyle);
    const styleName = styleInfo ? styleInfo.label : "Hyper-Realistic";
    const completePrompt = enhancePrompt(prompt, styleName);
    
    try {
      const dimensions = getDimensions(aspectRatio);
      
      console.log("Generating images with parameters:", {
        model: selectedModel,
        prompt: completePrompt,
        dimensions,
        numberOfImages
      });
      
      // Using the fixed API key from constants
      const runwareService = getRunwareService(HF_API_KEY);
      
      const generatedImages = await runwareService.generateImage({
        positivePrompt: completePrompt,
        model: selectedModel,
        width: dimensions.width,
        height: dimensions.height,
        numberResults: numberOfImages,
        CFGScale: detailLevel[0] / 10, // Convert detail level to CFG scale
      });
      
      console.log("Generated images:", generatedImages);
      
      // Extract image URLs from the response
      const imageUrls = generatedImages.map((img: GeneratedImage) => img.imageURL);
      
      setGeneratedImages(imageUrls);
      setIsGenerating(false);
      
      toast("Images generated successfully! Your AI artwork is ready to view.");
    } catch (error) {
      console.error("Error generating image:", error);
      
      setError(error instanceof Error ? error.message : "Connection to AI service failed. Please try again.");
      setIsGenerating(false);
      
      toast("Error generating image - " + (error instanceof Error ? error.message : "Connection to AI service failed. Please try again."));
    }
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prevState: Record<number, boolean>) => {
      return { ...prevState, [index]: true };
    });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast("Prompt copied to clipboard");
  };

  const handleSaveImage = (index: number = 0) => {
    // In a real implementation, you would save the image to the user's gallery
    toast("Image saved to your gallery");
  };

  const handleDownloadImage = (index: number = 0) => {
    if (generatedImages.length > 0 && generatedImages[index]) {
      const link = document.createElement('a');
      link.href = generatedImages[index];
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast("Image downloaded successfully");
    }
  };

  return {
    generateImage,
    handleImageLoad,
    handleCopyPrompt,
    handleSaveImage,
    handleDownloadImage
  };
};
