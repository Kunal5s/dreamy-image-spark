
import { toast } from "sonner";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

export interface WebSocketMessageCallback {
  (data: any): void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private connectionSessionUUID: string | null = null;
  private messageCallbacks: Map<string, WebSocketMessageCallback> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.connectionPromise = this.connect();
  }

  isWebSocketOpen(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN && this.isConnected;
  }

  getConnectionSessionUUID(): string | null {
    return this.connectionSessionUUID;
  }

  setConnectionSessionUUID(uuid: string): void {
    this.connectionSessionUUID = uuid;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(API_ENDPOINT);
      
      this.ws.onopen = () => {
        console.log("WebSocket connected to Runware");
        this.isConnected = true;
        resolve();
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
            const callback = this.messageCallbacks.get(item.taskUUID);
            if (callback) {
              callback(item);
              // Only remove the callback if it's not an authentication callback
              if (item.taskType !== "authentication") {
                this.messageCallbacks.delete(item.taskUUID);
              }
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Connection error with Runware API. Please try again.");
        this.isConnected = false;
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        this.isConnected = false;
        setTimeout(() => {
          this.connectionPromise = this.connect();
        }, 1000);
      };
    });
  }

  async ensureConnection(): Promise<void> {
    if (!this.isWebSocketOpen()) {
      this.connectionPromise = this.connect();
    }
    return this.connectionPromise as Promise<void>;
  }

  registerCallback(taskUUID: string, callback: WebSocketMessageCallback): void {
    this.messageCallbacks.set(taskUUID, callback);
  }

  sendMessage(message: any[]): void {
    if (!this.isWebSocketOpen()) {
      throw new Error("WebSocket not ready for sending message");
    }
    
    console.log("Sending message:", message);
    this.ws?.send(JSON.stringify(message));
  }
}

// Singleton instance
let websocketServiceInstance: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!websocketServiceInstance) {
    websocketServiceInstance = new WebSocketService();
  }
  return websocketServiceInstance;
};
