
import {
  Cpu,
  Maximize,
  Settings,
  Grid
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { models, aspectRatios, numberOptions } from "@/constants/imageGeneratorConstants";

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
    </div>
  );
};

export default SettingsTab;
