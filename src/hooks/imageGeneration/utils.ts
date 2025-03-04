
import { models, aspectRatios } from "@/constants/imageGeneratorConstants";

// Get the model endpoint based on selected model
export const getModelEndpoint = (selectedModel: string) => {
  const model = models.find(m => m.value === selectedModel);
  return model ? model.endpoint : "CompVis/stable-diffusion-v1-4"; // Default to a faster model
};

// Get dimensions based on selected aspect ratio
export const getDimensions = (aspectRatio: string) => {
  const ratio = aspectRatios.find(r => r.value === aspectRatio);
  return ratio ? { width: ratio.width, height: ratio.height } : { width: 512, height: 512 };
};

export const calculateDetailLevel = (sliderValue: number) => {
  // Enhanced detail level calculation for better image quality
  return Math.floor(sliderValue / 10) + 25;
};

// Enhanced utility function to create more effective prompts
export const enhancePrompt = (prompt: string, style: string): string => {
  // High-quality prompt enhancers that work well with most models
  const enhancers = [
    "highly detailed",
    "professional lighting",
    "sharp focus",
    "8k resolution",
    "masterpiece quality",
    "vivid colors",
    "best quality",
    "intricate details"
  ];
  
  // Select 2-3 random enhancers
  const numEnhancers = Math.floor(Math.random() * 2) + 2; // 2-3 enhancers
  const randomEnhancers = enhancers
    .sort(() => Math.random() - 0.5)
    .slice(0, numEnhancers)
    .join(", ");
    
  return `${prompt}, ${style} style, ${randomEnhancers}`;
};
