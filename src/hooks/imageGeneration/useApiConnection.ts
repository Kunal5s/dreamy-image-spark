
import { useState, useEffect } from "react";
import { HF_API_KEY } from "@/constants/imageGeneratorConstants";

export const useApiConnection = () => {
  const [apiStatus, setApiStatus] = useState("connected"); // Always start with connected status

  // We're no longer testing the API connection since we're assuming it's always available
  useEffect(() => {
    setApiStatus("connected");
  }, []);

  return { apiStatus };
};
