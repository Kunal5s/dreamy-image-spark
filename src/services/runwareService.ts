
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";
import { getHuggingFaceService, GenerateImageParams, GeneratedImage } from "./huggingface/imageGenerationService";

export type { GenerateImageParams, GeneratedImage } from "./huggingface/imageGenerationService";

export class RunwareService {
  private imageGenerationService: ReturnType<typeof getHuggingFaceService>;

  constructor() {
    this.imageGenerationService = getHuggingFaceService(HF_API_KEY);
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
