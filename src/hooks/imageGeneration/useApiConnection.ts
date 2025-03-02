
import { useState, useEffect } from "react";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";
import { testApiConnection } from "./utils";

export const useApiConnection = () => {
  const [apiStatus, setApiStatus] = useState("");

  // Test API connectivity on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      const status = await testApiConnection(HF_API_KEY);
      setApiStatus(status);
    };
    
    checkApiConnection();
  }, []);

  return { apiStatus };
};
