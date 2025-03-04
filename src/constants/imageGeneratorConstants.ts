// API Key for Hugging Face - Updated with new key for high quality image generation
export const HF_API_KEY = "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";

// Model options with their corresponding values for Hugging Face API
export const models = [
  { value: "stabilityai/stable-diffusion-xl-base-1.0", label: "Stable Diffusion XL", endpoint: "stabilityai/stable-diffusion-xl-base-1.0" },
  { value: "stabilityai/sdxl-turbo", label: "SDXL Turbo", endpoint: "stabilityai/sdxl-turbo" },
  { value: "runwayml/stable-diffusion-v1-5", label: "Stable Diffusion 1.5", endpoint: "runwayml/stable-diffusion-v1-5" },
  { value: "dreamlike-art/dreamlike-photoreal-2.0", label: "Dreamlike Photoreal", endpoint: "dreamlike-art/dreamlike-photoreal-2.0" },
  { value: "CompVis/stable-diffusion-v1-4", label: "Stable Diffusion 1.4", endpoint: "CompVis/stable-diffusion-v1-4" },
  { value: "prompthero/openjourney", label: "OpenJourney", endpoint: "prompthero/openjourney" },
  { value: "stablediffusionapi/realistic-vision-v51", label: "Realistic Vision 5.1", endpoint: "stablediffusionapi/realistic-vision-v51" },
  { value: "timbrooks/instruct-pix2pix", label: "Instruct Pix2Pix", endpoint: "timbrooks/instruct-pix2pix" },
  { value: "stabilityai/stable-diffusion-2-1", label: "Stable Diffusion 2.1", endpoint: "stabilityai/stable-diffusion-2-1" },
];

// Artistic styles options - Extended with more options
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
  { value: "neon", label: "Neon Futuristic" },
  { value: "vintage", label: "Vintage Photography" },
  { value: "polaroid", label: "Polaroid Style" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "studio-ghibli", label: "Studio Ghibli" },
  { value: "vector", label: "Vector Art" },
  { value: "gothic", label: "Gothic Art" },
  { value: "pencil-sketch", label: "Pencil Sketch" },
  { value: "stained-glass", label: "Stained Glass" },
  { value: "impressionist", label: "Impressionist" },
  { value: "mosaic", label: "Digital Mosaic" },
  { value: "ukiyo-e", label: "Ukiyo-e Japanese" },
  { value: "graffiti", label: "Urban Graffiti" },
  { value: "noir", label: "Film Noir" },
  { value: "holographic", label: "Holographic" },
  { value: "synthwave", label: "Synthwave" },
  { value: "dieselpunk", label: "Dieselpunk" },
  { value: "brutalist", label: "Brutalist" },
  { value: "fractal", label: "Fractal Art" },
  { value: "bauhaus", label: "Bauhaus" },
  { value: "glitch", label: "Digital Glitch" },
  { value: "deco", label: "Art Deco" },
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

// Extended prompt suggestions for better user guidance
export const promptSuggestions = [
  "A serene Japanese garden with cherry blossoms and a small pond",
  "Futuristic cityscape with flying vehicles and neon lights",
  "A magical forest with glowing plants and mythical creatures",
  "An underwater city with bioluminescent architecture",
  "A cozy cabin in the mountains during autumn",
  "A portrait of a cyberpunk character with neon accents",
  "Ancient temple ruins overgrown with luminescent vines",
  "A steampunk airship hovering over Victorian London",
  "Crystalline palace with rainbow light reflections",
  "Desert oasis with impossibly tall palm trees at sunset",
  "A cosmic space station orbiting a multicolored nebula",
  "Floating islands with waterfalls cascading into the sky",
  "A dreamlike surrealist landscape with melting clocks",
];

// Number of images to generate options - Extended with more options
export const numberOptions = [
  { value: 1, label: "1 Image" },
  { value: 2, label: "2 Images" },
  { value: 4, label: "4 Images" },
  { value: 6, label: "6 Images" },
  { value: 9, label: "9 Images" },
  { value: 12, label: "12 Images" },
];

// Default Hugging Face API Key
export const DEFAULT_HF_API_KEY = "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";
