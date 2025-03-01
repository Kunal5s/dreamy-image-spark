
import { useState } from "react";
import { 
  Wand2,
  Image as ImageIcon,
  Save,
  Download,
  RefreshCw,
  Copy,
  Sparkles,
  Loader2,
  Palette,
  Maximize,
  Settings,
  Cpu 
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

const placeholderImage = "/placeholder.svg";

// API Key for Hugging Face
const HF_API_KEY = "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";

// Model options
const models = [
  { value: "sdxl-turbo", label: "SDXL Turbo Pro" },
  { value: "sdxl-1.5", label: "Stable Diffusion XL 1.5+" },
  { value: "sd-lightning", label: "SD Lightning V2" },
  { value: "realvisxl", label: "RealVisXL V4.0 UHD" },
  { value: "dreamshaper", label: "DreamShaper XL Pro" },
  { value: "deepfloyd", label: "DeepFloyd IF Ultra" },
  { value: "controlnet", label: "ControlNet + SDXL" },
  { value: "playground", label: "Playground V2.5 Ultra" },
  { value: "julibrain", label: "JuliBrain Photoreal" },
  { value: "pixart", label: "PixArt-Σ Ultra" },
  { value: "openjourney", label: "OpenJourney V4 Pro" },
  { value: "flux", label: "FLUX.1-schnell MAX" },
];

// Artistic styles options
const styles = [
  { value: "hyper-realistic", label: "Hyper-Realistic" },
  { value: "abstract", label: "Abstract Art" },
  { value: "modern-digital", label: "Modern Digital Art" },
  { value: "painterly", label: "Painterly" },
  { value: "anime", label: "Advanced Anime" },
  { value: "scifi", label: "Sci-Fi Concept" },
  { value: "fantasy", label: "Fantasy Epic" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "hyper3d", label: "Hyper-Realistic 3D" },
  { value: "anime-cyberpunk", label: "Anime Cyberpunk" },
  { value: "pixel", label: "Pixel Art" },
  { value: "watercolor", label: "Watercolor" },
  { value: "concept", label: "Concept Art" },
  { value: "ink", label: "Detailed Ink Sketch" },
  { value: "surrealism", label: "AI Surrealism" },
  { value: "dark-fantasy", label: "Dark Fantasy" },
  { value: "minimalist", label: "Minimalist Line Art" },
  { value: "retro-future", label: "Retro Futurism" },
  { value: "renaissance", label: "Renaissance Oil" },
  { value: "comic", label: "Comic Book" },
  { value: "isometric", label: "3D Isometric" },
  { value: "lowpoly", label: "Low Poly 3D" },
  { value: "pop-art", label: "Pop Art" },
  { value: "steampunk", label: "Steampunk" },
  { value: "cinematic", label: "Cinematic" },
  { value: "vaporwave", label: "Vaporwave" },
  { value: "portrait", label: "Portrait Photography" },
  { value: "architectural", label: "Architectural Visualization" },
  { value: "nature", label: "Nature Photography" },
  { value: "baroque", label: "Baroque" },
];

// Aspect ratio options
const aspectRatios = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:5", label: "Instagram (4:5)" },
  { value: "3:2", label: "Standard (3:2)" },
  { value: "21:9", label: "Ultrawide (21:9)" },
  { value: "2:3", label: "Portrait (2:3)" },
  { value: "4:3", label: "Classic (4:3)" },
];

const promptSuggestions = [
  "A serene Japanese garden with cherry blossoms and a small pond",
  "Futuristic cityscape with flying vehicles and neon lights",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater city with bioluminescent architecture",
  "A cozy cabin in the mountains during autumn",
  "A portrait of a cyberpunk character with neon accents",
];

const ImageGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("sdxl-turbo");
  const [selectedStyle, setSelectedStyle] = useState("hyper-realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [detailLevel, setDetailLevel] = useState([75]);
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState("prompt");

  // Function to generate image using Hugging Face API
  const generateImage = async () => {
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
    
    // Build the complete prompt with style
    const styleInfo = styles.find(s => s.value === selectedStyle);
    const styleName = styleInfo ? styleInfo.label : "Hyper-Realistic";
    const completePrompt = `${prompt}, ${styleName} style, highly detailed, professional quality`;
    
    try {
      // For now, we'll use a mock API call since we don't have the actual endpoint
      // In a real implementation, you would make an API call to Hugging Face
      /*
      const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: completePrompt,
          parameters: {
            width: aspectRatio === "1:1" ? 1024 : 1280,
            height: aspectRatio === "1:1" ? 1024 : aspectRatio === "16:9" ? 720 : 1024,
            num_inference_steps: Math.floor(detailLevel[0] / 10) + 25,
          }
        })
      });
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImage(imageUrl);
      */
      
      // Mock API call for demonstration
      setTimeout(() => {
        setGeneratedImage(placeholderImage);
        setIsGenerating(false);
        
        toast({
          title: "Image generated successfully!",
          description: "Your AI artwork is ready to view.",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error generating image",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
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
    <section id="generate" className="section-padding bg-background border-y border-border/30">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-1 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Create with AI</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Describe the image you want to create, select your preferences, and watch as AI brings your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-6 bg-card p-6 rounded-xl shadow-sm">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="prompt" className="text-sm">
                  Prompt
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-sm">
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompt" className="space-y-4 mt-2">
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
                    className="resize-none h-32 bg-background/50"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Prompt Suggestions</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {promptSuggestions.slice(0, 3).map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary transition-colors text-xs py-1"
                        onClick={() => handlePromptSuggestion(suggestion)}
                      >
                        {suggestion.length > 25 ? `${suggestion.substring(0, 25)}...` : suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Art Style</label>
                  </div>
                  <Select value={selectedStyle} onValueChange={handleStyleChange}>
                    <SelectTrigger className="bg-background/50">
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
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4 mt-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">AI Model</label>
                  </div>
                  <Select value={selectedModel} onValueChange={handleModelChange}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Aspect Ratio</label>
                  </div>
                  <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                    <SelectTrigger className="bg-background/50">
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Detail Level</label>
                    </div>
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
              </TabsContent>
            </Tabs>

            <Button
              className="w-full py-6 rounded-lg text-base font-medium transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground"
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
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Image Preview */}
          <div className="lg:col-span-3 bg-card p-6 rounded-xl shadow-sm">
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
                  className="w-full bg-background/50"
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
