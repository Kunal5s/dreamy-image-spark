
import { useState } from "react";
import { 
  Wand2,
  Image as ImageIcon,
  Save,
  Download,
  RefreshCw,
  Copy,
  Sparkles,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

const placeholderImage = "/placeholder.svg";

// Artistic styles options
const styles = [
  { value: "realistic", label: "Hyper-Realistic" },
  { value: "abstract", label: "Abstract Art" },
  { value: "digital", label: "Digital Painting" },
  { value: "anime", label: "Anime Style" },
  { value: "fantasy", label: "Fantasy Art" },
  { value: "watercolor", label: "Watercolor" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "oil", label: "Oil Painting" },
];

// Aspect ratio options
const aspectRatios = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:5", label: "Instagram (4:5)" },
  { value: "3:2", label: "Standard (3:2)" },
];

const promptSuggestions = [
  "A serene landscape with mountains at sunset",
  "A futuristic cityscape with flying vehicles",
  "A magical forest with glowing plants and creatures",
  "An underwater scene with vibrant coral and exotic fish",
  "A cosmic scene with galaxies and nebulae",
  "A cozy cabin in a snowy forest at night",
];

const ImageGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState([75]);
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Function to generate image (mock for now)
  const generateImage = () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Your prompt will guide the AI to create your image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setImageLoaded(false);
    
    // Mock API call
    setTimeout(() => {
      // For now, we'll use a mock image - in real implementation this would be the API response
      setGeneratedImage(placeholderImage);
      setIsGenerating(false);
      
      toast({
        title: "Image generated successfully!",
        description: "Your AI artwork is ready to view.",
      });
    }, 2000);
  };

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
  };

  const handleDetailLevelChange = (values: number[]) => {
    setDetailLevel(values);
  };

  const handlePromptSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      description: "Prompt copied to clipboard",
    });
  };

  const handleSaveImage = () => {
    toast({
      description: "Image saved to your gallery",
    });
  };

  const handleDownloadImage = () => {
    toast({
      description: "Image downloaded successfully",
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section id="generate" className="section-padding bg-muted/30">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-1 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Create with AI</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Describe the image you want to create, select your preferences, and watch as AI brings your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6 bg-card p-6 rounded-xl shadow-sm animate-fade-up">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none">Your Prompt</label>
                {prompt && (
                  <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Copy</span>
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Describe the image you want to generate in detail..."
                className="resize-none h-32"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Prompt Suggestions</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {promptSuggestions.slice(0, 4).map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => handlePromptSuggestion(suggestion)}
                  >
                    {suggestion.length > 25 ? `${suggestion.substring(0, 25)}...` : suggestion}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Art Style</label>
                <Select value={selectedStyle} onValueChange={handleStyleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {styles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Aspect Ratio</label>
                <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none">Detail Level</label>
                <span className="text-xs text-muted-foreground">{detailLevel[0]}%</span>
              </div>
              <Slider
                value={detailLevel}
                onValueChange={handleDetailLevelChange}
                max={100}
                step={1}
                className="py-2"
              />
            </div>

            <Button
              className="w-full py-6 rounded-lg text-base font-medium transition-all duration-300 group"
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Image Preview */}
          <div className="bg-card p-6 rounded-xl shadow-sm animate-fade-up delay-150">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Image Preview</h3>
                {generatedImage && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSaveImage}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadImage}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "relative flex items-center justify-center bg-muted/50 rounded-lg border border-border overflow-hidden",
                  aspectRatio === "1:1" && "aspect-square",
                  aspectRatio === "16:9" && "aspect-video",
                  aspectRatio === "9:16" && "aspect-[9/16]",
                  aspectRatio === "4:5" && "aspect-[4/5]",
                  aspectRatio === "3:2" && "aspect-[3/2]"
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
                        Creating your masterpiece using {styles.find(s => s.value === selectedStyle)?.label.toLowerCase()} style
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
                        !imageLoaded ? "img-loading" : "img-loaded"
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
                  className="w-full"
                  onClick={generateImage}
                  disabled={isGenerating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate with Same Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGenerator;
