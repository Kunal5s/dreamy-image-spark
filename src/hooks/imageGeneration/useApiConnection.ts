
import { useState, useEffect } from "react";

export const useApiConnection = () => {
  const [apiStatus, setApiStatus] = useState("connected"); 

  // Always set to connected status without any tests
  useEffect(() => {
    setApiStatus("connected");
  }, []);

  return { apiStatus };
};
