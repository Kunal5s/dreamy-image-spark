
import { cn } from "@/lib/utils";
import { Download, ImageIcon, Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  generatedImage: string;
  isGenerating: boolean;
  imageLoaded: boolean;
  aspectRatio: string;
  selectedStyle: string;
  handleImageLoad: () => void;
  handleSaveImage: () => void;
  handleDownloadImage: () => void;
  generateImage: () => void;
}

const ImagePreview = ({
  generatedImage,
  isGenerating,
  imageLoaded,
  aspectRatio,
  selectedStyle,
  handleImageLoad,
  handleSaveImage,
  handleDownloadImage,
  generateImage
}: ImagePreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Image Preview</h3>
        {generatedImage && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveImage} className="bg-background/50">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadImage} className="bg-background/50">
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
        {!generatedImage && !isGenerating ? (
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
            <img
              src={generatedImage}
              alt="Generated AI art"
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                !imageLoaded ? "opacity-0" : "opacity-100"
              )}
              onLoad={handleImageLoad}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </>
        )}
      </div>

      {generatedImage && (
        <Button
          variant="outline"
          className="w-full bg-background/50"
          onClick={generateImage}
          disabled={isGenerating}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate with Same Settings
        </Button>
      )}
    </div>
  );
};

export default ImagePreview;
