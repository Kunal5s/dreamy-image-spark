
import { cn } from "@/lib/utils";
import { Download, ImageIcon, Loader2, RefreshCw, Save, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface ImagePreviewProps {
  generatedImages: string[];
  isGenerating: boolean;
  imagesLoaded: Record<number, boolean>;
  aspectRatio: string;
  selectedStyle: string;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  handleImageLoad: (index: number) => void;
  handleSaveImage: (index?: number) => void;
  handleDownloadImage: (index?: number) => void;
  generateImage: () => void;
}

const ImagePreview = ({
  generatedImages,
  isGenerating,
  imagesLoaded,
  aspectRatio,
  selectedStyle,
  selectedImageIndex,
  setSelectedImageIndex,
  handleImageLoad,
  handleSaveImage,
  handleDownloadImage,
  generateImage
}: ImagePreviewProps) => {
  const hasMultipleImages = generatedImages.length > 1;
  const preloadedImagesRef = useRef<Record<string, boolean>>({});
  
  // Preload images to make switching faster
  useEffect(() => {
    if (generatedImages.length > 0) {
      generatedImages.forEach((src, index) => {
        if (index !== selectedImageIndex && !preloadedImagesRef.current[src]) {
          const img = new Image();
          img.src = src;
          preloadedImagesRef.current[src] = true;
        }
      });
    }
  }, [generatedImages, selectedImageIndex]);
  
  const navigatePrevious = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else {
      // Loop to the last image
      setSelectedImageIndex(generatedImages.length - 1);
    }
  };
  
  const navigateNext = () => {
    if (selectedImageIndex < generatedImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      // Loop to the first image
      setSelectedImageIndex(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Image Preview</h3>
        {generatedImages.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSaveImage(selectedImageIndex)} className="bg-background/50">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownloadImage(selectedImageIndex)} className="bg-background/50">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative flex items-center justify-center bg-background rounded-lg border border-border/40 overflow-hidden",
          aspectRatio === "1:1" && "aspect-square",
          aspectRatio === "16:9" && "aspect-video",
          aspectRatio === "9:16" && "aspect-[9/16]",
          aspectRatio === "4:5" && "aspect-[4/5]",
          aspectRatio === "3:2" && "aspect-[3/2]",
          aspectRatio === "21:9" && "aspect-[21/9]",
          aspectRatio === "2:3" && "aspect-[2/3]",
          aspectRatio === "4:3" && "aspect-[4/3]"
        )}
      >
        {generatedImages.length === 0 && !isGenerating ? (
          <div className="text-center space-y-3 p-8">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">
              Enter a prompt and click generate to create an image
            </p>
          </div>
        ) : isGenerating ? (
          <div className="text-center space-y-5">
            <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
            <div className="space-y-2">
              <p className="font-medium">AI Magic in Progress</p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Creating your masterpiece using {selectedStyle.toLowerCase()} style
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Left navigation button for multi-image */}
            {hasMultipleImages && (
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-2 z-10 h-8 w-8 bg-background/70 hover:bg-background/90"
                onClick={navigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            {/* Current Image with optimized loading */}
            <div className="w-full h-full relative">
              {generatedImages.map((imgSrc, index) => (
                <img
                  key={imgSrc}
                  src={imgSrc}
                  alt={`Generated AI art ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300 absolute top-0 left-0",
                    index === selectedImageIndex 
                      ? (!imagesLoaded[index] ? "opacity-0" : "opacity-100") 
                      : "opacity-0 pointer-events-none"
                  )}
                  style={{ 
                    display: index === selectedImageIndex ? 'block' : 'none'
                  }}
                  onLoad={() => handleImageLoad(index)}
                  loading="eager"
                  decoding="async"
                />
              ))}
            </div>
            
            {!imagesLoaded[selectedImageIndex] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {/* Right navigation button for multi-image */}
            {hasMultipleImages && (
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute right-2 z-10 h-8 w-8 bg-background/70 hover:bg-background/90"
                onClick={navigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            
            {/* Image indicator dots for multi-image */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {generatedImages.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      index === selectedImageIndex 
                        ? "bg-primary" 
                        : "bg-background/50 hover:bg-background/80"
                    )}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {generatedImages.length > 0 && (
        <Button
          variant="outline"
          className="w-full bg-background/50"
          onClick={generateImage}
          disabled={isGenerating}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New Images
        </Button>
      )}
    </div>
  );
};

export default ImagePreview;
