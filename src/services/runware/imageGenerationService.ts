
import { toast } from "sonner";
import { getWebSocketService } from "../websocket/websocketService";
import { getAuthService } from "../websocket/authService";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds" | "none";
  seed?: number | string;
  width?: number;
  height?: number;
  lora?: string[];
}

export interface RunwareMessage {
  taskType: string;
  taskUUID: `${string}-${string}-${string}-${string}-${string}`;
  model: string;
  width: number;
  height: number;
  numberResults: number;
  outputFormat: string;
  steps: number;
  CFGScale: number;
  scheduler: string;
  strength: number;
  lora: string[];
  positivePrompt: string;
  seed?: number | string;
  promptWeighting?: "compel" | "sdEmbeds" | "none";
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class ImageGenerationService {
  private websocketService = getWebSocketService();
  private authService: ReturnType<typeof getAuthService>;

  constructor(apiKey: string) {
    this.authService = getAuthService(apiKey);
  }

  get apiKey(): string {
    return this.authService.apiKey;
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
    // Ensure we're authenticated before proceeding
    await this.authService.ensureAuthentication();
    
    const taskUUID = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      const message: RunwareMessage[] = [{
        taskType: "imageInference",
        taskUUID,
        model: params.model || "runware:100@1",
        width: params.width || 1024,
        height: params.height || 1024,
        numberResults: params.numberResults || 1,
        outputFormat: params.outputFormat || "WEBP",
        steps: 4,
        CFGScale: params.CFGScale || 1,
        scheduler: params.scheduler || "FlowMatchEulerDiscreteScheduler",
        strength: params.strength || 0.8,
        lora: params.lora || [],
        positivePrompt: params.positivePrompt,
      }];

      if (params.seed) {
        message[0].seed = params.seed;
      }

      if (params.promptWeighting && message[0].model !== "runware:100@1") {
        message[0].promptWeighting = params.promptWeighting;
      }

      console.log("Sending image generation message:", message);

      this.websocketService.registerCallback(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          // If multiple results, they'll be in an array
          if (Array.isArray(data)) {
            resolve(data);
          } else {
            // If single result, wrap it in an array
            resolve([data]);
          }
        }
      });

      try {
        this.websocketService.sendMessage(message);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Singleton instance with cache by API key
const imageGenerationInstances = new Map<string, ImageGenerationService>();

export const getImageGenerationService = (apiKey: string): ImageGenerationService => {
  if (!imageGenerationInstances.has(apiKey)) {
    imageGenerationInstances.set(apiKey, new ImageGenerationService(apiKey));
  }
  return imageGenerationInstances.get(apiKey) as ImageGenerationService;
};
