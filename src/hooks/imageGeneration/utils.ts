
import { models, aspectRatios } from "@/constants/imageGeneratorConstants";

// Get the model endpoint based on selected model
export const getModelEndpoint = (selectedModel: string) => {
  const model = models.find(m => m.value === selectedModel);
  return model ? model.endpoint : "stabilityai/stable-diffusion-xl-base-1.0";
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

// Test API connection and return status with enhanced error handling
export const testApiConnection = async (apiKey: string) => {
  try {
    // Updated endpoint to the newer SDXL model for better performance
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-1.0", {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.ok ? "connected" : "error";
  } catch (err) {
    console.error("API connection test error:", err);
    return "error";
  }
};

// New utility function to enhance prompt with AI-friendly terms
export const enhancePrompt = (prompt: string, style: string): string => {
  const enhancers = [
    "highly detailed",
    "professional lighting",
    "sharp focus",
    "8k resolution",
    "masterpiece quality"
  ];
  
  const randomEnhancers = enhancers
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .join(", ");
    
  return `${prompt}, ${style} style, ${randomEnhancers}`;
};
