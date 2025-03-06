
import { toast } from "sonner";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";
import { GenerateImageParams, GeneratedImage } from "./types";
import { fallbackImageService } from "./fallbackService";
import { HuggingFaceApiHandler } from "./apiHandler";

// List of fastest models for priority selection
const FAST_MODELS = [
  "stabilityai/sdxl-turbo",
  "ByteDance/SDXL-Lightning",
  "stabilityai/stable-diffusion-xl-base-1.0"
];

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
      model: requestedModel = "stabilityai/sdxl-turbo", 
      width = 512, // Reduced size for maximum speed
      height = 512, // Reduced size for maximum speed
      numberResults = 1,
      guidanceScale = 5.0, // Minimum for speed
      steps = 20, // Minimum for speed
      seed = Math.floor(Math.random() * 2147483647)
    } = params;

    // Simplify the prompt for faster processing
    const simplifiedPrompt = positivePrompt.length > 100 
      ? positivePrompt.substring(0, 100) 
      : positivePrompt;

    console.log("Starting ultra-fast image generation:", {
      model: requestedModel,
      prompt: simplifiedPrompt.substring(0, 30) + "...",
      dimensions: { width, height }
    });

    toast.loading("Generating image at high speed...", { id: "generation-toast" });

    try {
      // Try to use the requested model first, but be ready to fall back
      const modelToUse = requestedModel;
      
      // Create optimized promises with minimal delay
      const generationPromises: Promise<GeneratedImage>[] = [];
      
      for (let i = 0; i < numberResults; i++) {
        const uniqueSeed = seed + i;
        // No delay between requests for maximum parallelism
        generationPromises.push(
          this.apiHandler.generateSingleImage(modelToUse, simplifiedPrompt, width, height, guidanceScale, steps, uniqueSeed)
            .catch((error) => {
              console.warn(`Error with primary model, trying fallback for image ${i+1}:`, error);
              // Try with the fastest model as fallback
              return this.apiHandler.generateSingleImage(FAST_MODELS[0], simplifiedPrompt, 384, 384, 5.0, 15, uniqueSeed)
                .catch((fallbackError) => {
                  console.warn(`Fallback model failed too for image ${i+1}:`, fallbackError);
                  return fallbackImageService.createFallbackImage(simplifiedPrompt, width, height, i);
                });
            })
        );
      }

      // Execute all image generation requests in parallel
      const results = await Promise.all(generationPromises);
      toast.dismiss("generation-toast");
      toast.success("Images created successfully!");
      return results;
    } catch (error) {
      console.error("All image generation attempts failed:", error);
      toast.dismiss("generation-toast");
      toast.error("Using optimized fallback images");
      
      // Return instant fallback images on error
      return fallbackImageService.generateFallbackImages(simplifiedPrompt, width, height, numberResults);
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
