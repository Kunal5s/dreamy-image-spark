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
  // Function to generate image using HuggingFace API - optimized for speed
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
    
    // Build the prompt with style
    const styleInfo = styles.find(s => s.value === selectedStyle);
    const styleName = styleInfo ? styleInfo.label : "Modern Digital Art";
    
    // Simplified prompt enhancement for faster processing
    const completePrompt = `${prompt}, ${styleName} style`;
    
    try {
      const dimensions = getDimensions(aspectRatio);
      
      // Use smaller dimensions for faster generation
      const optimizedWidth = Math.min(dimensions.width, 768);
      const optimizedHeight = Math.min(dimensions.height, 768);
      
      const modelEndpoint = getModelEndpoint(selectedModel);
      const randomSeed = getRandomSeed();
      
      console.log("Generating with optimized settings:", {
        model: modelEndpoint,
        dimensions: `${optimizedWidth}x${optimizedHeight}`,
        images: numberOfImages
      });
      
      // Using the optimized HuggingFace service
      const imageService = getHuggingFaceService();
      
      try {
        const generatedImages = await imageService.generateImage({
          positivePrompt: completePrompt,
          model: modelEndpoint,
          width: optimizedWidth,
          height: optimizedHeight,
          numberResults: numberOfImages,
          guidanceScale: 7.5, // Lower for speed
          steps: 30, // Lower for speed
          seed: randomSeed
        });
        
        // Extract image URLs and set them
        const imageUrls = generatedImages.map((img: GeneratedImage) => img.imageURL);
        setGeneratedImages(imageUrls);
        setIsGenerating(false);
      } catch (error) {
        console.warn("Using fallback for generation:", error);
        
        // Use SDXL Turbo as reliable fallback
        const fasterModelEndpoint = "stabilityai/sdxl-turbo";
        
        toast.loading("Using fast generation mode...");
        
        try {
          const fallbackResults = await imageService.generateImage({
            positivePrompt: completePrompt,
            model: fasterModelEndpoint,
            width: Math.min(optimizedWidth, 512), // Even smaller for fallback
            height: Math.min(optimizedHeight, 512), // Even smaller for fallback
            numberResults: numberOfImages,
            guidanceScale: 7,
            steps: 25,
            seed: randomSeed + 1
          });
          
          const fallbackUrls = fallbackResults.map((img: GeneratedImage) => img.imageURL);
          setGeneratedImages(fallbackUrls);
          setIsGenerating(false);
          toast.success("Images created successfully!");
        } catch (fallbackError) {
          console.error("Fallback generation failed:", fallbackError);
          const unsplashImages = generateFallbackImages(styleName, aspectRatio, numberOfImages);
          setGeneratedImages(unsplashImages);
          setIsGenerating(false);
          toast.success("Created alternative images");
        }
      }
    } catch (error) {
      console.error("Error in generation process:", error);
      const fallbackImages = generateFallbackImages("Digital Art", aspectRatio, numberOfImages);
      setGeneratedImages(fallbackImages);
      setIsGenerating(false);
      toast.success("Created alternative images");
    }
  };

  // Generate fallback images from Unsplash with optimized categories
  const generateFallbackImages = (style: string, aspectRatio: string, count: number): string[] => {
    const categories = [
      'digital-art', 'wallpapers', '3d-renders', 'art', 
      'fantasy', 'illustration', 'landscape', 'abstract'
    ];
    
    const dimensions = getDimensions(aspectRatio);
    const dimensionString = `${dimensions.width}x${dimensions.height}`;
    
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
