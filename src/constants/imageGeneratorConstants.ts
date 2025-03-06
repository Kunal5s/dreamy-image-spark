
// API Key for Hugging Face - Updated with new key for high quality image generation
export const HF_API_KEY = "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";

// Model options with their corresponding endpoints and supported aspect ratios
export const models = [
  { 
    value: "stabilityai/sdxl-turbo", 
    label: "SDXL Turbo Pro", 
    endpoint: "stabilityai/sdxl-turbo",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "4:5"]
  },
  { 
    value: "stabilityai/stable-diffusion-xl-base-1.0", 
    label: "Stable Diffusion XL 1.5+", 
    endpoint: "stabilityai/stable-diffusion-xl-base-1.0",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "4:5"]
  },
  { 
    value: "ByteDance/SDXL-Lightning", 
    label: "SD Lightning V2", 
    endpoint: "ByteDance/SDXL-Lightning",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"]
  },
  { 
    value: "fluxmodels/flux.1-schnell", 
    label: "FLUX.1-schnell MAX", 
    endpoint: "fluxmodels/flux.1-schnell",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:4"]
  },
  { 
    value: "stablediffusionapi/realvisxl-v4", 
    label: "RealVisXL V4.0 UHD", 
    endpoint: "stablediffusionapi/realvisxl-v4",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:2"]
  },
  { 
    value: "lykon/dreamshaper-xl", 
    label: "DreamShaper XL Pro", 
    endpoint: "lykon/dreamshaper-xl",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "4:5"]
  },
  { 
    value: "DeepFloyd/IF-I-XL-v1.0", 
    label: "DeepFloyd IF Ultra", 
    endpoint: "DeepFloyd/IF-I-XL-v1.0",
    supportedRatios: ["1:1", "16:9", "9:16", "4:3", "3:2"]
  },
  { 
    value: "prompthero/openjourney-v4", 
    label: "OpenJourney V4 Pro", 
    endpoint: "prompthero/openjourney-v4",
    supportedRatios: ["1:1", "16:9", "4:3", "3:2", "9:16"]
  },
  { 
    value: "lllyasviel/sd-controlnet-depth", 
    label: "ControlNet + SDXL", 
    endpoint: "lllyasviel/sd-controlnet-depth",
    supportedRatios: ["1:1", "16:9", "4:3", "3:2", "9:16"]
  },
  { 
    value: "playgroundai/playground-v2.5-1024px-aesthetic", 
    label: "Playground V2.5 Ultra", 
    endpoint: "playgroundai/playground-v2.5-1024px-aesthetic",
    supportedRatios: ["1:1", "16:9", "4:3", "3:2", "9:16"]
  },
  { 
    value: "julibrain/julibrain-photoreal", 
    label: "JuliBrain Photoreal", 
    endpoint: "julibrain/julibrain-photoreal",
    supportedRatios: ["1:1", "16:9", "4:3", "3:2", "9:16"]
  },
  { 
    value: "stabilityai/pixart-sigma", 
    label: "PixArt-Σ Ultra", 
    endpoint: "stabilityai/pixart-sigma",
    supportedRatios: ["1:1", "16:9", "4:3", "3:2", "9:16"]
  }
];

// Artistic styles options - Updated categories
export const styles = [
  // Modern Digital Art Category
  { value: "modern-digital", label: "Modern Digital Art", category: "basic" },
  { value: "painterly", label: "Painterly", category: "basic" },
  { value: "abstract", label: "Abstract Art", category: "basic" },
  { value: "watercolor", label: "Watercolor", category: "basic" },
  { value: "minimalist", label: "Minimalist Line Art", category: "basic" },
  { value: "lowpoly", label: "3D Low Poly", category: "basic" },
  { value: "comic", label: "Comic Book", category: "basic" },
  { value: "vector", label: "Vector Art", category: "basic" },
  
  // Ultra-Photorealistic & Advanced Styles
  { value: "hyper3d", label: "Hyper-Realistic 3D", category: "advanced" },
  { value: "ultra-photorealistic", label: "Ultra-Photorealistic", category: "advanced" },
  { value: "cinematic-8k", label: "Cinematic 8K", category: "advanced" },
  { value: "concept", label: "Professional Concept Art", category: "advanced" },
  { value: "anime", label: "Advanced Anime", category: "advanced" },
  { value: "anime-cyberpunk", label: "Anime Cyberpunk", category: "advanced" },
  { value: "professional-manga", label: "Professional Manga", category: "advanced" },
  { value: "scifi", label: "Sci-Fi Concept", category: "advanced" },
  { value: "fantasy", label: "Fantasy Epic", category: "advanced" },
  { value: "cyberpunk", label: "Cyberpunk", category: "advanced" },
  { value: "dark-fantasy", label: "Dark Fantasy", category: "advanced" },
  { value: "surrealism", label: "AI Surrealism", category: "advanced" },
  { value: "renaissance", label: "Renaissance Oil", category: "advanced" },
  { value: "pixel", label: "Pixel Art", category: "advanced" },
  { value: "ink", label: "Detailed Ink Sketch", category: "advanced" },
  { value: "isometric", label: "3D Isometric", category: "advanced" },
  { value: "neon", label: "Neon Glow", category: "advanced" },
  { value: "holographic", label: "Holographic", category: "advanced" },
  { value: "retro-future", label: "Retro Futurism", category: "advanced" }
];

// Aspect ratio options
export const aspectRatios = [
  { value: "1:1", label: "Square (1:1)", width: 1024, height: 1024 },
  { value: "16:9", label: "Landscape (16:9)", width: 1024, height: 576 },
  { value: "9:16", label: "Portrait (9:16)", width: 576, height: 1024 },
  { value: "4:3", label: "Classic (4:3)", width: 1024, height: 768 },
  { value: "3:4", label: "Portrait (3:4)", width: 768, height: 1024 },
  { value: "3:2", label: "Standard (3:2)", width: 1024, height: 683 },
  { value: "2:3", label: "Portrait (2:3)", width: 683, height: 1024 },
  { value: "4:5", label: "Instagram (4:5)", width: 820, height: 1024 },
];

// Image generation parameters
export const generationParams = {
  defaultGuidanceScale: 9,
  defaultSteps: 45,
  maxBatchSize: 10
};

// Extended prompt suggestions for better user guidance
export const promptSuggestions = [
  "A serene Japanese garden with cherry blossoms and a small pond",
  "Futuristic cityscape with flying vehicles and neon lights",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater city with bioluminescent architecture",
  "A portrait of a cyberpunk character with neon accents",
  "Ancient temple ruins overgrown with luminescent vines",
  "A steampunk airship hovering over Victorian London",
  "Crystalline palace with rainbow light reflections",
  "Cosmic space station orbiting a multicolored nebula",
  "Floating islands with waterfalls cascading into the sky",
  "Dreamlike surrealist landscape with melting clocks",
  "Professional portrait of a futuristic character in 8K",
  "Hyperrealistic fantasy landscape with dragons"
];

// Number of images to generate options - Extended with more options
export const numberOptions = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 4, label: "4 Images" },
  { value: 6, label: "6 Images" },
  { value: 8, label: "8 Images" },
  { value: 10, label: "10 Images" },
];

// Default Hugging Face API Key
export const DEFAULT_HF_API_KEY = "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";

// Add the missing functions that are being imported

/**
 * Gets the supported aspect ratios for a specific model
 */
export const getSupportedRatios = (selectedModel: string): string[] => {
  const model = models.find(m => m.value === selectedModel);
  return model ? model.supportedRatios : ["1:1"]; // Default to square if model not found
};

/**
 * Generates a unique hash for image generation requests
 */
export const generateUniqueHash = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
