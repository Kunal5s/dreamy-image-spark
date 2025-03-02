
import { toast } from "sonner";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

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

export class RunwareService {
  private _apiKey: string;
  private ws: WebSocket | null = null;
  private connectionSessionUUID: string | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(apiKey: string) {
    this._apiKey = apiKey;
    this.connectionPromise = this.connect();
  }

  // Getter for apiKey to allow comparison but not direct access
  get apiKey(): string {
    return this._apiKey;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(API_ENDPOINT);
      
      this.ws.onopen = () => {
        console.log("WebSocket connected to Runware");
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const response = JSON.parse(event.data);
        
        if (response.error || response.errors) {
          console.error("WebSocket error response:", response);
          const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
          toast.error(errorMessage);
          return;
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              console.log("Authentication successful, session UUID:", item.connectionSessionUUID);
              this.connectionSessionUUID = item.connectionSessionUUID;
              this.isAuthenticated = true;
            } else {
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
              }
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Connection error with Runware API. Please try again.");
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        this.isAuthenticated = false;
        setTimeout(() => {
          this.connectionPromise = this.connect();
        }, 1000);
      };
    });
  }

  private authenticate(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this._apiKey,
        ...(this.connectionSessionUUID && { connectionSessionUUID: this.connectionSessionUUID }),
      }];
      
      console.log("Sending authentication message to Runware");
      
      // Set up a one-time authentication callback
      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage[]> {
    // Wait for connection and authentication before proceeding
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

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

      this.messageCallbacks.set(taskUUID, (data) => {
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

      this.ws.send(JSON.stringify(message));
    });
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
