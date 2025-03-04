
import { toast } from "sonner";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  width?: number;
  height?: number;
  numberResults?: number;
  detailLevel?: number;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed?: number;
  NSFWContent?: boolean;
}

export class HuggingFaceImageService {
  private apiKey: string;

  constructor(apiKey: string = HF_API_KEY) {
    this.apiKey = apiKey;
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
    const { 
      positivePrompt, 
      model = "stabilityai/stable-diffusion-xl-base-1.0", 
      width = 512, 
      height = 512, 
      numberResults = 1,
      detailLevel = 7.5 
    } = params;

    console.log("Generating images with HuggingFace API:", {
      model,
      prompt: positivePrompt,
      dimensions: { width, height },
      numberResults
    });

    try {
      // Create array to hold all image generation promises
      const generationPromises: Promise<GeneratedImage>[] = [];

      // Create multiple image requests based on numberResults
      for (let i = 0; i < numberResults; i++) {
        generationPromises.push(this.generateSingleImage(model, positivePrompt, width, height, detailLevel));
      }

      // Execute all image generation requests in parallel
      const results = await Promise.all(generationPromises);
      return results;
    } catch (error) {
      console.error("Error generating images with HuggingFace API:", error);
      toast.error("Failed to generate images. Using fallback images instead.");
      
      // Return fallback images
      return this.generateFallbackImages(positivePrompt, width, height, numberResults);
    }
  }

  private async generateSingleImage(
    model: string, 
    prompt: string, 
    width: number, 
    height: number, 
    guidance_scale: number = 7.5
  ): Promise<GeneratedImage> {
    try {
      // Prepare the payload for Hugging Face API
      const payload = {
        inputs: prompt,
        parameters: {
          width,
          height,
          guidance_scale,
          num_inference_steps: 25
        }
      };

      // Make the API request to Hugging Face
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      // Check if response is successful
      if (!response.ok) {
        const error = await response.json();
        console.error("Hugging Face API error:", error);
        throw new Error(`Hugging Face API error: ${error.error || "Unknown error"}`);
      }

      // Get the image blob from the response
      const imageBlob = await response.blob();
      const imageURL = URL.createObjectURL(imageBlob);

      return {
        imageURL,
        positivePrompt: prompt,
        seed: Math.floor(Math.random() * 1000000) // Random seed for tracking
      };
    } catch (error) {
      console.error("Error in generateSingleImage:", error);
      throw error;
    }
  }

  // Fallback method to generate placeholder images
  private generateFallbackImages(
    prompt: string,
    width: number,
    height: number,
    count: number
  ): GeneratedImage[] {
    const fallbackImages: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      fallbackImages.push({
        imageURL: `https://source.unsplash.com/random/${width}x${height}?sig=${Date.now() + i}`,
        positivePrompt: prompt,
        seed: Math.floor(Math.random() * 1000000)
      });
    }

    return fallbackImages;
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
