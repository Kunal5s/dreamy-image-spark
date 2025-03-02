
import { getWebSocketService } from "./websocketService";

export class AuthService {
  private _apiKey: string;
  private isAuthenticated: boolean = false;
  private websocketService = getWebSocketService();

  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  // Getter for apiKey to allow comparison but not direct access
  get apiKey(): string {
    return this._apiKey;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticated = value;
  }

  async authenticate(): Promise<void> {
    await this.websocketService.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const taskUUID = crypto.randomUUID();
      const authMessage = [{
        taskType: "authentication",
        taskUUID,
        apiKey: this._apiKey,
        ...(this.websocketService.getConnectionSessionUUID() && { 
          connectionSessionUUID: this.websocketService.getConnectionSessionUUID() 
        }),
      }];
      
      console.log("Sending authentication message to Runware");
      
      this.websocketService.registerCallback(taskUUID, (data) => {
        if (data.taskType === "authentication") {
          console.log("Authentication successful, session UUID:", data.connectionSessionUUID);
          this.websocketService.setConnectionSessionUUID(data.connectionSessionUUID);
          this.isAuthenticated = true;
          resolve();
        }
      });
      
      try {
        this.websocketService.sendMessage(authMessage);
      } catch (error) {
        reject(error);
      }
    });
  }

  async ensureAuthentication(): Promise<void> {
    if (!this.isAuthenticated) {
      return this.authenticate();
    }
    return Promise.resolve();
  }
}

// Singleton instance with cache by API key
const authServiceInstances = new Map<string, AuthService>();

export const getAuthService = (apiKey: string): AuthService => {
  if (!authServiceInstances.has(apiKey)) {
    authServiceInstances.set(apiKey, new AuthService(apiKey));
  }
  return authServiceInstances.get(apiKey) as AuthService;
};
