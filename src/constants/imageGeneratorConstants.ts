
// API Key for Hugging Face - This is a placeholder, will be replaced by Runware API
export const HF_API_KEY = "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";

// Model options with their corresponding values for Runware API
export const models = [
  { value: "runware:100@1", label: "SDXL Turbo Pro", endpoint: "runware:100@1" },
  { value: "runware:110@1", label: "Stable Diffusion XL 1.5+", endpoint: "runware:110@1" },
  { value: "runware:120@1", label: "SD Lightning V2", endpoint: "runware:120@1" },
  { value: "runware:130@1", label: "RealVisXL V4.0 UHD", endpoint: "runware:130@1" },
  { value: "runware:140@1", label: "DreamShaper XL Pro", endpoint: "runware:140@1" },
  { value: "runware:150@1", label: "DeepFloyd IF Ultra", endpoint: "runware:150@1" },
  { value: "runware:160@1", label: "ControlNet + SDXL", endpoint: "runware:160@1" },
  { value: "runware:200@1", label: "Playground V2.5 Ultra", endpoint: "runware:200@1" },
  { value: "runware:210@1", label: "JuliBrain Photoreal", endpoint: "runware:210@1" },
  { value: "runware:220@1", label: "PixArt-Σ Ultra", endpoint: "runware:220@1" },
  { value: "runware:230@1", label: "OpenJourney V4 Pro", endpoint: "runware:230@1" },
  { value: "runware:240@1", label: "FLUX.1-schnell MAX", endpoint: "runware:240@1" },
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
  { value: "1:1", label: "Square (1:1)", width: 1024, height: 1024 },
  { value: "16:9", label: "Landscape (16:9)", width: 1024, height: 576 },
  { value: "9:16", label: "Portrait (9:16)", width: 576, height: 1024 },
  { value: "4:5", label: "Instagram (4:5)", width: 820, height: 1024 },
  { value: "3:2", label: "Standard (3:2)", width: 1024, height: 683 },
  { value: "21:9", label: "Ultrawide (21:9)", width: 1024, height: 439 },
  { value: "2:3", label: "Portrait (2:3)", width: 683, height: 1024 },
  { value: "4:3", label: "Classic (4:3)", width: 1024, height: 768 },
];

export const promptSuggestions = [
  "A serene Japanese garden with cherry blossoms and a small pond",
  "Futuristic cityscape with flying vehicles and neon lights",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater city with bioluminescent architecture",
  "A cozy cabin in the mountains during autumn",
  "A portrait of a cyberpunk character with neon accents",
];

// Number of images to generate options
export const numberOptions = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 4, label: "4 Images" },
  { value: 6, label: "6 Images" },
  { value: 9, label: "9 Images" },
];

// Default Runware API Key - this should be replaced by user input
export const DEFAULT_RUNWARE_API_KEY = "";
