
import { getImageGenerationService, GenerateImageParams, GeneratedImage } from "./runware/imageGenerationService";

export type { GenerateImageParams, GeneratedImage } from "./runware/imageGenerationService";

export class RunwareService {
  private imageGenerationService: ReturnType<typeof getImageGenerationService>;

  constructor(apiKey: string) {
    this.imageGenerationService = getImageGenerationService(apiKey);
  }

  get apiKey(): string {
    return this.imageGenerationService.apiKey;
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
    return this.imageGenerationService.generateImage(params);
  }
}

// Singleton instance
let runwareServiceInstance: RunwareService | null = null;

export const getRunwareService = (apiKey: string): RunwareService => {
  if (!runwareServiceInstance || runwareServiceInstance.apiKey !== apiKey) {
    runwareServiceInstance = new RunwareService(apiKey);
  }
  return runwareServiceInstance;
};
