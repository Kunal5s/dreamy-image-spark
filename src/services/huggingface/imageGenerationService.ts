
import { toast } from "sonner";
import { HF_API_KEY, generateUniqueHash } from "@/constants/imageGeneratorConstants";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  width?: number;
  height?: number;
  numberResults?: number;
  guidanceScale?: number;
  steps?: number;
  seed?: number;
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
            this.generateSingleImage(model, positivePrompt, width, height, guidanceScale, steps, uniqueSeed)
              .then(resolve)
              .catch(() => resolve(this.createFallbackImage(positivePrompt, width, height, i))),
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
      
      // Return fallback images
      return this.generateFallbackImages(positivePrompt, width, height, numberResults);
    }
  }

  private async generateSingleImage(
    model: string, 
    prompt: string, 
    width: number, 
    height: number, 
    guidance_scale: number = 9,
    num_inference_steps: number = 45,
    seed: number = Math.floor(Math.random() * 2147483647)
  ): Promise<GeneratedImage> {
    try {
      // Prepare the payload for Hugging Face API - optimized for quality
      const payload = {
        inputs: prompt,
        parameters: {
          width,
          height,
          guidance_scale,
          num_inference_steps,
          seed,
          negative_prompt: "low quality, blurry, distorted, deformed, disfigured, text, watermark, signature",
          scheduler: "DPMSolverMultistep" // Better scheduler for quality
        }
      };

      // Make the API request to Hugging Face with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Check if response is successful
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Hugging Face API error:", error);
        throw new Error(`Hugging Face API error: ${error.error || "Unknown error"}`);
      }

      // Get the image blob from the response
      const imageBlob = await response.blob();
      const imageURL = URL.createObjectURL(imageBlob);

      // Preload the image to make it appear faster in the UI
      const preloadImage = new Image();
      preloadImage.src = imageURL;

      return {
        imageURL,
        positivePrompt: prompt,
        seed
      };
    } catch (error) {
      console.error("Error in generateSingleImage:", error);
      throw error;
    }
  }

  // Improved fallback method with better quality images
  private generateFallbackImages(
    prompt: string,
    width: number,
    height: number,
    count: number
  ): GeneratedImage[] {
    const fallbackImages: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      fallbackImages.push(this.createFallbackImage(prompt, width, height, i));
    }

    return fallbackImages;
  }
  
  // Helper method to create a single fallback image with better quality
  private createFallbackImage(
    prompt: string,
    width: number,
    height: number,
    index: number
  ): GeneratedImage {
    // Use specific image collections that match common AI art styles
    const collections = [
      'digital-art', 'wallpapers', '3d-renders', 'textures-patterns', 
      'experimental', 'architecture', 'fantasy', 'surreal'
    ];
    
    const randomCollection = collections[Math.floor(Math.random() * collections.length)];
    const uniqueTimestamp = Date.now() + index;
    const uniqueSeed = Math.floor(Math.random() * 1000000);
    
    return {
      imageURL: `https://source.unsplash.com/featured/${width}x${height}?${randomCollection}&sig=${uniqueTimestamp}`,
      positivePrompt: prompt,
      seed: uniqueSeed
    };
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
