
import { GeneratedImage } from "./types";

export class HuggingFaceApiHandler {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Handles a single image generation request to Hugging Face API
   */
  async generateSingleImage(
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
}
