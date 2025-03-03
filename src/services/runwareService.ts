
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";
import { getImageGenerationService, GenerateImageParams, GeneratedImage } from "./runware/imageGenerationService";

export type { GenerateImageParams, GeneratedImage } from "./runware/imageGenerationService";

export class RunwareService {
  private imageGenerationService: ReturnType<typeof getImageGenerationService>;

  constructor() {
    this.imageGenerationService = getImageGenerationService(HF_API_KEY);
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
    return this.imageGenerationService.generateImage(params);
  }
}

// Singleton instance
let runwareServiceInstance: RunwareService | null = null;

export const getRunwareService = (): RunwareService => {
  if (!runwareServiceInstance) {
    runwareServiceInstance = new RunwareService();
  }
  return runwareServiceInstance;
};
