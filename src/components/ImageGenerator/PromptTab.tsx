
import { 
  Copy,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { styles, promptSuggestions } from "@/constants/imageGeneratorConstants";

interface PromptTabProps {
  prompt: string;
  error: string;
  selectedStyle: string;
  handlePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCopyPrompt: () => void;
  handleStyleChange: (value: string) => void;
  handlePromptSuggestion: (suggestion: string) => void;
}

const PromptTab = ({
  prompt,
  error,
  selectedStyle,
  handlePromptChange,
  handleCopyPrompt,
  handleStyleChange,
  handlePromptSuggestion
}: PromptTabProps) => {
  // Group styles by category
  const basicStyles = styles.filter(style => style.category === "basic");
  const advancedStyles = styles.filter(style => style.category === "advanced");

  return (
    <div className="space-y-4 mt-2">
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
          <SelectContent className="max-h-80">
            <SelectGroup>
              <SelectLabel>Basic Styles</SelectLabel>
              {basicStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Advanced & Photorealistic</SelectLabel>
              {advancedStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PromptTab;
