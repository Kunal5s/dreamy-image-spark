
import { Star, Heart, Twitter, Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container max-w-6xl py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">
              Artify<span className="text-primary font-semibold">AI</span>
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Transform your ideas into stunning artwork with our AI-powered image generator. Simple, fast, and endlessly creative.
            </p>
            <div className="flex space-x-4 pt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="#generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Art</a>
              <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Join our newsletter for the latest features and updates.</p>
            <div className="flex gap-2">
              <Button>Subscribe</Button>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm pt-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@artifyai.com" className="hover:text-foreground transition-colors">
                support@artifyai.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ArtifyAI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
