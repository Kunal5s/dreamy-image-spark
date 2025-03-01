
import { useState } from "react";
import { 
  Wand2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { styles } from "@/constants/imageGeneratorConstants";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import PromptTab from "@/components/ImageGenerator/PromptTab";
import SettingsTab from "@/components/ImageGenerator/SettingsTab";
import ImagePreview from "@/components/ImageGenerator/ImagePreview";

const ImageGenerator = () => {
  const [currentTab, setCurrentTab] = useState("prompt");
  
  const {
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
  } = useImageGeneration();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Clear error when user starts typing
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
              
              <TabsContent value="prompt">
                <PromptTab 
                  prompt={prompt}
                  error={error}
                  selectedStyle={selectedStyle}
                  handlePromptChange={handlePromptChange}
                  handleCopyPrompt={handleCopyPrompt}
                  handleStyleChange={handleStyleChange}
                  handlePromptSuggestion={handlePromptSuggestion}
                />
              </TabsContent>
              
              <TabsContent value="settings">
                <SettingsTab 
                  selectedModel={selectedModel}
                  aspectRatio={aspectRatio}
                  detailLevel={detailLevel}
                  handleModelChange={handleModelChange}
                  handleAspectRatioChange={handleAspectRatioChange}
                  handleDetailLevelChange={handleDetailLevelChange}
                />
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
            <ImagePreview 
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              imageLoaded={imageLoaded}
              aspectRatio={aspectRatio}
              selectedStyle={styles.find(s => s.value === selectedStyle)?.label || ""}
              handleImageLoad={handleImageLoad}
              handleSaveImage={handleSaveImage}
              handleDownloadImage={handleDownloadImage}
              generateImage={generateImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGenerator;
