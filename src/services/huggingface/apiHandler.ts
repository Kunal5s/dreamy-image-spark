
import { GeneratedImage } from "./types";

export class HuggingFaceApiHandler {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Handles a single image generation request to Hugging Face API with optimized settings
   */
  async generateSingleImage(
    model: string, 
    prompt: string, 
    width: number, 
    height: number, 
    guidance_scale: number = 7.5, // Reduced for faster generation
    num_inference_steps: number = 30, // Reduced for faster generation
    seed: number = Math.floor(Math.random() * 2147483647)
  ): Promise<GeneratedImage> {
    try {
      // Prepare the payload with optimized parameters for faster generation
      const payload = {
        inputs: prompt,
        parameters: {
          width,
          height,
          guidance_scale,
          num_inference_steps,
          seed,
          negative_prompt: "low quality, blurry, distorted",
          scheduler: "EulerAncestralDiscreteScheduler" // Faster scheduler
        }
      };

      // Make the API request with a shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      console.log(`Generating image for model: ${model}, with prompt: ${prompt.substring(0, 50)}...`);
      
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
