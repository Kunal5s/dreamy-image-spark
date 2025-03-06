
import { GeneratedImage } from "./types";

export class FallbackImageService {
  /**
   * Generates multiple fallback images when API calls fail
   */
  generateFallbackImages(
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
  
  /**
   * Creates a single fallback image with quality that mimics AI-generated art
   */
  createFallbackImage(
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

// Export a singleton instance
export const fallbackImageService = new FallbackImageService();
