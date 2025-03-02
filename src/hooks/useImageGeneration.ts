
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HF_API_KEY, models, styles, aspectRatios } from "@/constants/imageGeneratorConstants";

export const useImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("sdxl-turbo");
  const [selectedStyle, setSelectedStyle] = useState("hyper-realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState([75]);
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState("");
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

  // Get the model endpoint based on selected model
  const getModelEndpoint = () => {
    const model = models.find(m => m.value === selectedModel);
    return model ? model.endpoint : "stabilityai/stable-diffusion-xl-base-1.0";
  };

  // Get dimensions based on selected aspect ratio
  const getDimensions = () => {
    const ratio = aspectRatios.find(r => r.value === aspectRatio);
    return ratio ? { width: ratio.width, height: ratio.height } : { width: 512, height: 512 };
  };

  // Function to generate image using Hugging Face API
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast("Please enter a prompt - Your prompt will guide the AI to create your image");
      return;
    }

    setIsGenerating(true);
    setImageLoaded(false);
    setError("");
    
    // Build the complete prompt with style
    const styleInfo = styles.find(s => s.value === selectedStyle);
    const styleName = styleInfo ? styleInfo.label : "Hyper-Realistic";
    const completePrompt = `${prompt}, ${styleName} style, highly detailed, professional quality`;
    
    try {
      const modelEndpoint = getModelEndpoint();
      const dimensions = getDimensions();
      
      console.log("Generating image with parameters:", {
        model: modelEndpoint,
        prompt: completePrompt,
        dimensions,
        steps: Math.floor(detailLevel[0] / 10) + 25
      });
      
      // Make the actual API call to Hugging Face
      const response = await fetch(`https://api-inference.huggingface.co/models/${modelEndpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: completePrompt,
          parameters: {
            width: dimensions.width,
            height: dimensions.height,
            num_inference_steps: Math.floor(detailLevel[0] / 10) + 25,
            guidance_scale: 7.5,
            negative_prompt: "low quality, worst quality, bad anatomy, bad composition, poor, low effort"
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText);
        
        let errorMessage = "Failed to generate image";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch (e) {
          // If it's not JSON, use the error text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
      
      toast("Image generated successfully! Your AI artwork is ready to view.");
    } catch (error) {
      console.error("Error generating image:", error);
      
      setError(error instanceof Error ? error.message : "Connection to AI service failed. Please try again.");
      setIsGenerating(false);
      
      toast("Error generating image - " + (error instanceof Error ? error.message : "Connection to AI service failed. Please try again."));
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast("Prompt copied to clipboard");
  };

  const handleSaveImage = () => {
    // In a real implementation, you would save the image to the user's gallery
    toast("Image saved to your gallery");
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast("Image downloaded successfully");
    }
  };

  return {
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    selectedStyle,
    setSelectedStyle,
    aspectRatio,
    setAspectRatio,
    detailLevel,
    setDetailLevel,
    generatedImage,
    isGenerating,
    imageLoaded,
    error,
    apiStatus,
    generateImage,
    handleImageLoad,
    handleCopyPrompt,
    handleSaveImage,
    handleDownloadImage
  };
};
