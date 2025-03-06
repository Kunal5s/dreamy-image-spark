
import { models, aspectRatios, styles, getSupportedRatios, generateUniqueHash } from "@/constants/imageGeneratorConstants";

// Get the model endpoint based on selected model
export const getModelEndpoint = (selectedModel: string) => {
  const model = models.find(m => m.value === selectedModel);
  return model ? model.endpoint : "stabilityai/sdxl-turbo"; // Default to SDXL Turbo
};

// Get dimensions based on selected aspect ratio
export const getDimensions = (aspectRatio: string) => {
  const ratio = aspectRatios.find(r => r.value === aspectRatio);
  return ratio ? { width: ratio.width, height: ratio.height } : { width: 1024, height: 1024 };
};

// Enhanced detail level calculation (guidance scale)
export const calculateGuidanceScale = (sliderValue: number) => {
  // Convert slider value (0-100) to guidance scale range (5-15)
  const min = 5;
  const max = 15;
  return min + (sliderValue / 100) * (max - min);
};

// Calculate steps based on detail level
export const calculateSteps = (detailLevel: number) => {
  // Higher detail = more steps, range 25-50
  return Math.floor(25 + (detailLevel / 100) * 25);
};

// Get a random seed to ensure unique image generation
export const getRandomSeed = () => {
  return Math.floor(Math.random() * 2147483647);
};

// Enhanced utility function to create more effective prompts
export const enhancePrompt = (prompt: string, style: string): string => {
  // Quality enhancers that work well with most models
  const qualityEnhancers = [
    "masterpiece",
    "highly detailed",
    "professional lighting",
    "sharp focus",
    "high resolution",
    "8k uhd",
    "best quality",
    "intricate details"
  ];
  
  // Select 2-3 random enhancers to avoid repetition
  const numEnhancers = Math.floor(Math.random() * 2) + 2; // 2-3 enhancers
  const selectedEnhancers = qualityEnhancers
    .sort(() => Math.random() - 0.5)
    .slice(0, numEnhancers)
    .join(", ");
  
  // Find the style label from the value
  const styleObj = styles.find(s => s.value === style);
  const styleLabel = styleObj ? styleObj.label : style;
    
  return `${prompt}, ${styleLabel} style, ${selectedEnhancers}, trending on artstation, award-winning`;
};
