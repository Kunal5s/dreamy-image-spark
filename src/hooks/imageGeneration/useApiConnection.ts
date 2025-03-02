
import { useState, useEffect } from "react";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";

export const useApiConnection = () => {
  const [apiStatus, setApiStatus] = useState("");

  // Test API connectivity on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo", {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${HF_API_KEY}`
          }
        });
        
        if (response.ok) {
          setApiStatus("connected");
        } else {
          setApiStatus("error");
          console.log("API connection test failed:", response.status);
        }
      } catch (err) {
        setApiStatus("error");
        console.error("API connection test error:", err);
      }
    };
    
    testApiConnection();
  }, []);

  return { apiStatus };
};
