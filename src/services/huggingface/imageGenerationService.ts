
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
      model = "stabilityai/sdxl-turbo", // Using SDXL Turbo as default
      width = 1024, 
      height = 1024, 
      numberResults = 1,
      guidanceScale = 9,
      steps = 45,
      seed = Math.floor(Math.random() * 2147483647)
    } = params;

    console.log("Generating images with HuggingFace API:", {
      model,
      prompt: positivePrompt,
      dimensions: { width, height },
      numberResults,
      guidanceScale,
      steps,
      seed
    });

    try {
      // Create array to hold all image generation promises
      const generationPromises: Promise<GeneratedImage>[] = [];

      // Create multiple image requests based on numberResults
      for (let i = 0; i < numberResults; i++) {
        // Add unique seed for each image to ensure they're different
        const uniqueSeed = seed + i;
        
        // Add a small delay between requests to prevent rate limiting
        const delay = i * 50; // Reduced delay for faster generation
        generationPromises.push(
          new Promise(resolve => setTimeout(() => 
            this.apiHandler.generateSingleImage(model, positivePrompt, width, height, guidanceScale, steps, uniqueSeed)
              .then(resolve)
              .catch(() => resolve(fallbackImageService.createFallbackImage(positivePrompt, width, height, i))),
            delay
          ))
        );
      }

      // Execute all image generation requests with proper handling
      const results = await Promise.all(generationPromises);
      return results;
    } catch (error) {
      console.error("Error generating images with HuggingFace API:", error);
      toast.error("Using optimized fallback images instead.");
      
      // Return fallback images using the dedicated service
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
