
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
  return Math.floor(sliderValue / 10) + 25;
};

// Test API connection and return status
export const testApiConnection = async (apiKey: string) => {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo", {
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
