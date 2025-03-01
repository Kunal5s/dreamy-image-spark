
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 flex items-center justify-between transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium tracking-tight">
          Artify<span className="text-primary font-semibold">AI</span>
        </h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
          Home
        </a>
        <a href="#generate" className="text-sm font-medium hover:text-primary transition-colors">
          Create
        </a>
        <a href="#gallery" className="text-sm font-medium hover:text-primary transition-colors">
          Gallery
        </a>
        <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
          About
        </a>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4 md:hidden">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            <a
              href="#home"
              className="text-xl font-medium hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              Home
            </a>
            <a
              href="#generate"
              className="text-xl font-medium hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              Create
            </a>
            <a
              href="#gallery"
              className="text-xl font-medium hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              Gallery
            </a>
            <a
              href="#about"
              className="text-xl font-medium hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              About
            </a>
            <Button size="lg" className="mt-4 w-40 bg-primary text-primary-foreground hover:bg-primary/90">
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
