
import { toast } from "sonner";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";
import { GenerateImageParams, GeneratedImage } from "./types";
import { fallbackImageService } from "./fallbackService";
import { HuggingFaceApiHandler } from "./apiHandler";

export class HuggingFaceImageService {
  private apiKey: string;
  private apiHandler: HuggingFaceApiHandler;

  constructor(apiKey: string = HF_API_KEY) {
    this.apiKey = apiKey;
    this.apiHandler = new HuggingFaceApiHandler(apiKey);
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
    const { 
      positivePrompt, 
      model = "stabilityai/sdxl-turbo", // Using SDXL Turbo for faster generation
      width = 768, // Reduced size for faster generation
      height = 768, // Reduced size for faster generation
      numberResults = 1,
      guidanceScale = 7.5, // Reduced for speed
      steps = 30, // Reduced for speed
      seed = Math.floor(Math.random() * 2147483647)
    } = params;

    console.log("Starting image generation with optimized parameters:", {
      model,
      prompt: positivePrompt.substring(0, 50) + "...",
      dimensions: { width, height },
      numberResults,
      guidanceScale,
      steps
    });

    toast.loading("Generating image...", { id: "generation-toast" });

    try {
      // Create array to hold all image generation promises
      const generationPromises: Promise<GeneratedImage>[] = [];

      // Create multiple image requests based on numberResults
      for (let i = 0; i < numberResults; i++) {
        // Add unique seed for each image
        const uniqueSeed = seed + i;
        
        // Reduced delay between requests
        const delay = i * 20;
        generationPromises.push(
          new Promise(resolve => setTimeout(() => 
            this.apiHandler.generateSingleImage(model, positivePrompt, width, height, guidanceScale, steps, uniqueSeed)
              .then(resolve)
              .catch((error) => {
                console.warn(`Error generating image ${i+1}:`, error);
                resolve(fallbackImageService.createFallbackImage(positivePrompt, width, height, i));
              }),
            delay
          ))
        );
      }

      // Execute all image generation requests
      const results = await Promise.all(generationPromises);
      toast.dismiss("generation-toast");
      toast.success("Images created successfully!");
      return results;
    } catch (error) {
      console.error("Error generating images:", error);
      toast.dismiss("generation-toast");
      toast.error("Using optimized fallback images");
      
      // Return fallback images on error
      return fallbackImageService.generateFallbackImages(positivePrompt, width, height, numberResults);
    }
  }
}

// Singleton instance with cache by API key
const imageGenerationInstances = new Map<string, HuggingFaceImageService>();

export const getHuggingFaceService = (apiKey: string = HF_API_KEY): HuggingFaceImageService => {
  if (!imageGenerationInstances.has(apiKey)) {
    imageGenerationInstances.set(apiKey, new HuggingFaceImageService(apiKey));
  }
  return imageGenerationInstances.get(apiKey) as HuggingFaceImageService;
};

// Re-export types for easier imports
export type { GenerateImageParams, GeneratedImage };
