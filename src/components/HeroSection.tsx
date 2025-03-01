
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);

  // Smooth parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const opacity = 1 - Math.min(1, scrollY / 700);
        const transform = `translateY(${scrollY * 0.3}px)`;
        
        heroRef.current.style.opacity = opacity.toString();
        heroRef.current.style.transform = transform;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0"></div>
      
      {/* Hero content */}
      <div className="container relative z-10 px-4 animate-fade-up">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Create Stunning Imagery with<br />
            <span className="text-primary">AI-Powered Generation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into beautiful artwork through the power of artificial intelligence.
            Simple, fast, and endlessly creative.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              size="lg"
              className="w-full sm:w-auto text-md font-medium px-8 py-6 rounded-full shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90 hover:shadow-xl hover:scale-105"
            >
              Generate AI Art
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-md font-medium px-8 py-6 rounded-full hover:bg-secondary/50"
            >
              Explore Gallery
            </Button>
          </div>
        </div>
        
        {/* Floating features badges */}
        <div className="hidden md:flex justify-center mt-16 gap-6">
          {["Hyper-Realistic", "Abstract Art", "Digital Painting", "Anime", "Fantasy"].map((style, index) => (
            <div 
              key={style} 
              className={cn(
                "glass px-4 py-2 rounded-full text-sm font-medium text-foreground/90 animate-fade-in",
                index % 2 === 0 ? "animate-pulse-gentle" : ""
              )}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {style}
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-foreground/70" />
      </div>
    </section>
  );
};

export default HeroSection;
