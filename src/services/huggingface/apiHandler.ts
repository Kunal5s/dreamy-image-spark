
import { GeneratedImage } from "./types";

export class HuggingFaceApiHandler {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Handles a single image generation request to Hugging Face API with ultra-optimized settings
   */
  async generateSingleImage(
    model: string, 
    prompt: string, 
    width: number, 
    height: number, 
    guidance_scale: number = 5.0, // Further reduced for maximum speed
    num_inference_steps: number = 20, // Minimum steps for faster generation
    seed: number = Math.floor(Math.random() * 2147483647)
  ): Promise<GeneratedImage> {
    try {
      // Ultra-optimized parameters for fastest possible generation
      const payload = {
        inputs: prompt,
        parameters: {
          width: Math.min(width, 512), // Force smaller dimensions for speed
          height: Math.min(height, 512), // Force smaller dimensions for speed
          guidance_scale,
          num_inference_steps,
          seed,
          negative_prompt: "low quality", // Simplified negative prompt
          scheduler: "DPMSolverMultistepScheduler" // Fastest scheduler available
        }
      };

      // Make the API request with an even shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      console.log(`Speed-optimized image generation for model: ${model}, prompt: ${prompt.substring(0, 30)}...`);
      
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

      // Quick error handling
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error(`Hugging Face API error (${response.status}):`, error);
        throw new Error(`API error: ${error.error || response.statusText}`);
      }

      // Get the image blob from the response
      const imageBlob = await response.blob();
      const imageURL = URL.createObjectURL(imageBlob);

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
}
