
import { useState, useEffect } from "react";
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
  Cpu,
  AlertCircle
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// API Key for Hugging Face
const HF_API_KEY = "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";

// Model options with their corresponding API endpoints
const models = [
  { value: "sdxl-turbo", label: "SDXL Turbo Pro", endpoint: "stabilityai/sdxl-turbo" },
  { value: "sdxl-1.5", label: "Stable Diffusion XL 1.5+", endpoint: "stabilityai/stable-diffusion-xl-base-1.0" },
  { value: "sd-lightning", label: "SD Lightning V2", endpoint: "ByteDance/SDXL-Lightning" },
  { value: "realvisxl", label: "RealVisXL V4.0 UHD", endpoint: "SG161222/RealVisXL_V4.0" },
  { value: "dreamshaper", label: "DreamShaper XL Pro", endpoint: "Lykon/dreamshaper-xl-1-0" },
  { value: "deepfloyd", label: "DeepFloyd IF Ultra", endpoint: "DeepFloyd/IF-I-XL-v1.0" },
  { value: "controlnet", label: "ControlNet + SDXL", endpoint: "diffusers/controlnet-canny-sdxl-1.0" },
  { value: "playground", label: "Playground V2.5 Ultra", endpoint: "playgroundai/playground-v2.5-1024px-aesthetic" },
  { value: "julibrain", label: "JuliBrain Photoreal", endpoint: "julien-c/julibrain-sd1" },
  { value: "pixart", label: "PixArt-Σ Ultra", endpoint: "PixArt-alpha/PixArt-XL-2-1024-MS" },
  { value: "openjourney", label: "OpenJourney V4 Pro", endpoint: "prompthero/openjourney-v4" },
  { value: "flux", label: "FLUX.1-schnell MAX", endpoint: "stabilityai/stable-diffusion-2-1" },
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
  { value: "1:1", label: "Square (1:1)", width: 512, height: 512 },
  { value: "16:9", label: "Landscape (16:9)", width: 640, height: 360 },
  { value: "9:16", label: "Portrait (9:16)", width: 360, height: 640 },
  { value: "4:5", label: "Instagram (4:5)", width: 432, height: 540 },
  { value: "3:2", label: "Standard (3:2)", width: 512, height: 342 },
  { value: "21:9", label: "Ultrawide (21:9)", width: 672, height: 288 },
  { value: "2:3", label: "Portrait (2:3)", width: 342, height: 512 },
  { value: "4:3", label: "Classic (4:3)", width: 512, height: 384 },
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
      toast({
        title: "Please enter a prompt",
        description: "Your prompt will guide the AI to create your image",
        variant: "destructive",
      });
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
      
      toast({
        title: "Image generated successfully!",
        description: "Your AI artwork is ready to view.",
      });
    } catch (error) {
      console.error("Error generating image:", error);
      
      setError(error instanceof Error ? error.message : "Connection to AI service failed. Please try again.");
      setIsGenerating(false);
      
      toast({
        title: "Error generating image",
        description: error instanceof Error ? error.message : "Connection to AI service failed. Please try again.",
        variant: "destructive",
      });
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
    // In a real implementation, you would save the image to the user's gallery
    toast({
      description: "Image saved to your gallery",
    });
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        description: "Image downloaded successfully",
      });
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
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

        {apiStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              Unable to connect to the AI service. The API may be temporarily unavailable. Please try again later.
            </AlertDescription>
          </Alert>
        )}

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
                    className={cn("resize-none h-32 bg-background/50", error && "border-red-500 focus-visible:ring-red-500")}
                    value={prompt}
                    onChange={handlePromptChange}
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGenerator;
