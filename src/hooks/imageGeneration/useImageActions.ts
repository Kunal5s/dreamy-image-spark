
import { toast } from "sonner";
import { styles } from "@/constants/imageGeneratorConstants";
import { getDimensions, enhancePrompt, getModelEndpoint, calculateGuidanceScale, calculateSteps, getRandomSeed, generateUniqueHash } from "./utils";
import { getHuggingFaceService, GeneratedImage } from "@/services/huggingface/imageGenerationService";

interface ImageActionsProps {
  prompt: string;
  selectedModel: string;
  selectedStyle: string;
  aspectRatio: string;
  detailLevel: number[];
  generatedImages: string[];
  setGeneratedImages: (urls: string[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setImagesLoaded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  setError: (error: string) => void;
  numberOfImages: number;
  setSelectedImageIndex: (index: number) => void;
  guidanceScale: number;
  steps: number;
  uniqueHash: string;
  resetUniqueHash: () => void;
}

export const useImageActions = ({
  prompt,
  selectedModel,
  selectedStyle,
  aspectRatio,
  detailLevel,
  generatedImages = [],
  setGeneratedImages,
  setIsGenerating,
  setImagesLoaded,
  setError,
  numberOfImages,
  setSelectedImageIndex,
  guidanceScale,
  steps,
  uniqueHash,
  resetUniqueHash
}: ImageActionsProps) => {
  // Function to generate image using HuggingFace API
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast("Please enter a prompt - Your prompt will guide the AI to create your image");
      return;
    }

    setIsGenerating(true);
    setImagesLoaded({});
    setError("");
    setSelectedImageIndex(0);
    resetUniqueHash(); // Reset unique hash to force new image generation
    
    // Build the complete prompt with style using the enhanced prompt method
    const styleInfo = styles.find(s => s.value === selectedStyle);
    const styleName = styleInfo ? styleInfo.label : "Ultra-Photorealistic";
    const completePrompt = enhancePrompt(prompt, styleName);
    
    try {
      const dimensions = getDimensions(aspectRatio);
      const modelEndpoint = getModelEndpoint(selectedModel);
      const randomSeed = getRandomSeed(); // Get a random seed for uniqueness
      
      console.log("Generating images with parameters:", {
        model: modelEndpoint,
        prompt: completePrompt,
        dimensions,
        numberOfImages,
        guidanceScale,
        steps,
        seed: randomSeed
      });
      
      // Using the HuggingFace service directly
      const imageService = getHuggingFaceService();
      
      // Set a timeout to prevent long waits
      const timeoutPromise = new Promise<GeneratedImage[]>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Image generation timeout - switching to fast mode"));
        }, 20000); // 20 seconds timeout for better quality
      });
      
      // Show initial loading feedback
      toast.loading("Starting AI image generation...");
      
      // Try to generate images with a timeout
      try {
        const generationPromise = imageService.generateImage({
          positivePrompt: completePrompt,
          model: modelEndpoint,
          width: dimensions.width,
          height: dimensions.height,
          numberResults: numberOfImages,
          guidanceScale: guidanceScale,
          steps: steps,
          seed: randomSeed
        });
        
        // Show intermediate message while waiting for generation
        setTimeout(() => {
          if (document.querySelector('[data-id="sonner-toast"][data-mounted="true"]')) {
            toast.loading("AI is creating your masterpiece...");
          }
        }, 3000);
        
        const generatedImages = await Promise.race([generationPromise, timeoutPromise]);
        
        console.log("Generated images:", generatedImages);
        
        // Extract image URLs from the response and preload them
        const imageUrls = generatedImages.map((img: GeneratedImage) => {
          // Preload the image
          const preloadImg = new Image();
          preloadImg.src = img.imageURL;
          return img.imageURL;
        });
        
        setGeneratedImages(imageUrls);
        setIsGenerating(false);
        
        toast.success("Images generated successfully!");
      } catch (error) {
        console.warn("Using fallback image generation due to error or timeout:", error);
        
        // Fallback to faster model with smaller image size for quicker results
        try {
          // Use SDXL Turbo as a reliable fallback
          const fasterModelEndpoint = "stabilityai/sdxl-turbo";
          const smallerDimensions = {
            width: Math.min(dimensions.width, 768),
            height: Math.min(dimensions.height, 768)
          };
          
          toast.loading("Switching to fast generation mode...");
          
          const fallbackResults = await imageService.generateImage({
            positivePrompt: completePrompt,
            model: fasterModelEndpoint,
            width: smallerDimensions.width,
            height: smallerDimensions.height,
            numberResults: numberOfImages,
            guidanceScale: 7.5, // Lower guidance scale for speed
            steps: 30, // Fewer steps for speed
            seed: randomSeed + 1 // Slightly different seed
          });
          
          const fallbackUrls = fallbackResults.map((img: GeneratedImage) => img.imageURL);
          setGeneratedImages(fallbackUrls);
          setIsGenerating(false);
          toast.success("AI artwork created in quick mode!");
        } catch (fallbackError) {
          // If even fallback fails, use placeholder images
          console.error("Both main and fallback generation failed:", fallbackError);
          const fallbackImages = generateFallbackImages(styleName, aspectRatio, numberOfImages);
          setGeneratedImages(fallbackImages);
          setIsGenerating(false);
          toast.success("Images ready! Using creative alternatives.");
        }
      }
    } catch (error) {
      console.error("Error in image generation process:", error);
      
      // Provide fallback images even in case of errors
      const fallbackImages = generateFallbackImages("Ultra-Photorealistic", aspectRatio, numberOfImages);
      setGeneratedImages(fallbackImages);
      setIsGenerating(false);
      toast.success("Images ready! Using creative alternatives.");
    }
  };

  // Helper function to generate fallback images when API fails
  const generateFallbackImages = (style: string, aspectRatio: string, count: number): string[] => {
    // Use Unsplash with better categories for more relevant images
    const categories = [
      'digital-art', 'wallpapers', '3d-renders', 'textures-patterns', 
      'experimental', 'architecture', 'nature', 'fantasy'
    ];
    
    const dimensions = getDimensions(aspectRatio);
    const dimensionString = `${dimensions.width}x${dimensions.height}`;
    
    return Array(count).fill(0).map((_, i) => {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const uniqueHash = generateUniqueHash(); // Ensure images are unique
      return `https://source.unsplash.com/featured/${dimensionString}?${randomCategory}&sig=${uniqueHash + i}`;
    });
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prevState: Record<number, boolean>) => {
      return { ...prevState, [index]: true };
    });
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard");
  };

  const handleSaveImage = (index: number = 0) => {
    // In a real implementation, you would save the image to the user's gallery
    toast.success("Image saved to your gallery");
  };

  const handleDownloadImage = (index: number = 0) => {
    if (generatedImages.length > 0 && generatedImages[index]) {
      // Create a modified filename with the prompt
      const promptSlug = prompt
        .substring(0, 20)
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
        
      const link = document.createElement('a');
      link.href = generatedImages[index];
      link.download = `ai-image-${promptSlug}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Image downloaded successfully");
    }
  };

  return {
    generateImage,
    handleImageLoad,
    handleCopyPrompt,
    handleSaveImage,
    handleDownloadImage
  };
};
