
// API Key for Hugging Face
export const HF_API_KEY = "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";

// Model options with their corresponding API endpoints
export const models = [
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
export const styles = [
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
export const aspectRatios = [
  { value: "1:1", label: "Square (1:1)", width: 512, height: 512 },
  { value: "16:9", label: "Landscape (16:9)", width: 640, height: 360 },
  { value: "9:16", label: "Portrait (9:16)", width: 360, height: 640 },
  { value: "4:5", label: "Instagram (4:5)", width: 432, height: 540 },
  { value: "3:2", label: "Standard (3:2)", width: 512, height: 342 },
  { value: "21:9", label: "Ultrawide (21:9)", width: 672, height: 288 },
  { value: "2:3", label: "Portrait (2:3)", width: 342, height: 512 },
  { value: "4:3", label: "Classic (4:3)", width: 512, height: 384 },
];

export const promptSuggestions = [
  "A serene Japanese garden with cherry blossoms and a small pond",
  "Futuristic cityscape with flying vehicles and neon lights",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater city with bioluminescent architecture",
  "A cozy cabin in the mountains during autumn",
  "A portrait of a cyberpunk character with neon accents",
];
