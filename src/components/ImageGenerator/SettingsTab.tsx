
import {
  Cpu,
  Maximize,
  Settings,
  Grid,
  Wand2,
  Clock
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { models, aspectRatios, numberOptions, getSupportedRatios } from "@/constants/imageGeneratorConstants";

interface SettingsTabProps {
  selectedModel: string;
  aspectRatio: string;
  detailLevel: number[];
  numberOfImages: number;
  handleModelChange: (value: string) => void;
  handleAspectRatioChange: (value: string) => void;
  handleDetailLevelChange: (values: number[]) => void;
  handleNumberOfImagesChange: (value: number) => void;
}

const SettingsTab = ({
  selectedModel,
  aspectRatio,
  detailLevel,
  numberOfImages,
  handleModelChange,
  handleAspectRatioChange,
  handleDetailLevelChange,
  handleNumberOfImagesChange
}: SettingsTabProps) => {
  // Get supported aspect ratios for the selected model
  const supportedRatioValues = getSupportedRatios(selectedModel);
  
  // Filter aspect ratios to only show supported ones
  const filteredRatios = aspectRatios.filter(ratio => 
    supportedRatioValues.includes(ratio.value)
  );

  return (
    <div className="space-y-4 mt-2">
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
          <Grid className="h-4 w-4 text-muted-foreground" />
          <label className="text-sm font-medium">Number of Images</label>
        </div>
        <Select 
          value={numberOfImages.toString()} 
          onValueChange={(value) => handleNumberOfImagesChange(parseInt(value))}
        >
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select Number" />
          </SelectTrigger>
          <SelectContent>
            {numberOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
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
            {filteredRatios.map((ratio) => (
              <SelectItem key={ratio.value} value={ratio.value}>
                {ratio.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Available ratios depend on the selected model
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-muted-foreground" />
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
        <p className="text-xs text-muted-foreground">
          Higher values produce more detailed images
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
