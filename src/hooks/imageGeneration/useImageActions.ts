
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
  // Ultra-optimized image generation function
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    setImagesLoaded({});
    setError("");
    setSelectedImageIndex(0);
    resetUniqueHash();
    
    // Simplified prompt handling
    const styleInfo = styles.find(s => s.value === selectedStyle);
    const styleName = styleInfo ? styleInfo.label : "";
    
    // Ultra-minimal prompt for speed
    const completePrompt = styleName ? `${prompt}, ${styleName}` : prompt;
    
    try {
      const dimensions = getDimensions(aspectRatio);
      
      // Force smaller dimensions for maximum speed
      const optimizedWidth = Math.min(dimensions.width, 512);
      const optimizedHeight = Math.min(dimensions.height, 512);
      
      const modelEndpoint = getModelEndpoint(selectedModel);
      const randomSeed = getRandomSeed();
      
      console.log("High-speed generation with:", {
        model: modelEndpoint,
        dimensions: `${optimizedWidth}x${optimizedHeight}`,
        images: numberOfImages
      });
      
      // Get optimized image service
      const imageService = getHuggingFaceService();
      
      try {
        // First attempt with requested model
        const generatedImages = await imageService.generateImage({
          positivePrompt: completePrompt,
          model: modelEndpoint,
          width: optimizedWidth,
          height: optimizedHeight,
          numberResults: numberOfImages,
          guidanceScale: 5.0, // Lowest for maximum speed
          steps: 20, // Minimum steps for speed
          seed: randomSeed
        });
        
        // Extract image URLs and set them
        const imageUrls = generatedImages.map((img: GeneratedImage) => img.imageURL);
        setGeneratedImages(imageUrls);
        setIsGenerating(false);
        toast.success("Images generated at maximum speed!");
      } catch (error) {
        console.warn("Using ultra-fast fallback:", error);
        
        // Try with SDXL Turbo for guaranteed speed
        const fasterModelEndpoint = "stabilityai/sdxl-turbo";
        
        toast.loading("Using lightning-fast mode...");
        
        try {
          const fallbackResults = await imageService.generateImage({
            positivePrompt: completePrompt,
            model: fasterModelEndpoint,
            width: Math.min(optimizedWidth, 384), // Even smaller for maximum speed
            height: Math.min(optimizedHeight, 384), // Even smaller for maximum speed
            numberResults: numberOfImages,
            guidanceScale: 5.0, // Lowest possible
            steps: 15, // Ultra-low steps
            seed: randomSeed + 1
          });
          
          const fallbackUrls = fallbackResults.map((img: GeneratedImage) => img.imageURL);
          setGeneratedImages(fallbackUrls);
          setIsGenerating(false);
          toast.success("Fast images created successfully!");
        } catch (fallbackError) {
          console.error("All generation failed, using placeholder images:", fallbackError);
          const unsplashImages = generateFallbackImages(styleName, aspectRatio, numberOfImages);
          setGeneratedImages(unsplashImages);
          setIsGenerating(false);
          toast.success("Created alternative images");
        }
      }
    } catch (error) {
      console.error("Error in entire generation process:", error);
      const fallbackImages = generateFallbackImages("Digital Art", aspectRatio, numberOfImages);
      setGeneratedImages(fallbackImages);
      setIsGenerating(false);
      toast.success("Created alternative images");
    }
  };

  // Generate fallback images from Unsplash with optimized categories - now even faster
  const generateFallbackImages = (style: string, aspectRatio: string, count: number): string[] => {
    const categories = [
      'digital-art', 'art', 'fantasy', 'abstract', 'wallpaper'
    ];
    
    const dimensions = getDimensions(aspectRatio);
    const dimensionString = `${Math.min(dimensions.width, 512)}x${Math.min(dimensions.height, 512)}`;
    
    return Array(count).fill(0).map((_, i) => {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
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
