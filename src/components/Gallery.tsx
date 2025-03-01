
import { useState, useEffect } from "react";
import { 
  Filter, 
  Download,
  Heart,
  Share2,
  Loader2,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock gallery data - in a real app this would come from an API
const mockGalleryData = [
  {
    id: 1,
    title: "Cosmic Dreamscape",
    style: "fantasy",
    aspectRatio: "16:9",
    likes: 248,
    image: placeholderImageUrl(),
  },
  {
    id: 2,
    title: "Urban Reflections",
    style: "realistic",
    aspectRatio: "1:1",
    likes: 315,
    image: placeholderImageUrl(),
  },
  {
    id: 3,
    title: "Neon Future",
    style: "cyberpunk",
    aspectRatio: "9:16",
    likes: 186,
    image: placeholderImageUrl(),
  },
  {
    id: 4,
    title: "Misty Mountains",
    style: "watercolor",
    aspectRatio: "3:2",
    likes: 297,
    image: placeholderImageUrl(),
  },
  {
    id: 5,
    title: "Enchanted Forest",
    style: "anime",
    aspectRatio: "4:5",
    likes: 162,
    image: placeholderImageUrl(),
  },
  {
    id: 6,
    title: "Abstract Emotions",
    style: "abstract",
    aspectRatio: "1:1",
    likes: 224,
    image: placeholderImageUrl(),
  },
];

// Helper function to generate a placeholder image URL with a random color
function placeholderImageUrl() {
  return "/placeholder.svg";
}

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [images, setImages] = useState(mockGalleryData);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle filtering
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setLoading(true);
    
    setTimeout(() => {
      if (filter === "all") {
        setImages(mockGalleryData);
      } else {
        setImages(mockGalleryData.filter(item => item.style === filter));
      }
      setLoading(false);
    }, 800);
  };
  
  // Handle image load event
  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  // Mocked actions
  const handleLike = (id: number) => {
    setImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, likes: img.likes + 1 } : img
      )
    );
    toast("Added to favorites");
  };
  
  const handleDownload = () => {
    toast("Image downloaded successfully");
  };
  
  const handleShare = () => {
    toast("Sharing options opened");
  };
  
  // Get unique styles for filtering
  const styles = ["all", ...Array.from(new Set(mockGalleryData.map(item => item.style)))];

  return (
    <section id="gallery" className="section-padding">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-1 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Gallery</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore a collection of AI-generated artworks across various styles and themes
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {styles.map(style => (
              <Button
                key={style}
                variant={activeFilter === style ? "default" : "outline"}
                size="sm"
                className={cn(
                  "capitalize transition-all",
                  activeFilter === style &&
                    "shadow-sm"
                )}
                onClick={() => handleFilterChange(style)}
              >
                {style === "all" && <Filter className="mr-1 h-4 w-4" />}
                {style}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">No images found</h3>
            <p className="text-muted-foreground">
              No images match your selected filter. Try another category or generate new images.
            </p>
            <Button className="mt-4" onClick={() => handleFilterChange("all")}>
              Show All Images
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl bg-card shadow-sm border border-border transition-all duration-300 hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${item.id * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <div 
                    className={cn(
                      "relative",
                      item.aspectRatio === "1:1" && "aspect-square",
                      item.aspectRatio === "16:9" && "aspect-video",
                      item.aspectRatio === "9:16" && "aspect-[9/16]",
                      item.aspectRatio === "4:5" && "aspect-[4/5]",
                      item.aspectRatio === "3:2" && "aspect-[3/2]"
                    )}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
                        !loadedImages[item.id] ? "img-loading" : "img-loaded"
                      )}
                      onLoad={() => handleImageLoad(item.id)}
                    />
                    
                    {!loadedImages[item.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={() => handleLike(item.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.style} Style
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 fill-current" />
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
