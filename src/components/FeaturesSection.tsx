
import {
  Zap,
  PaintBucket,
  Share2,
  Download,
  Lock,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => (
  <Card className={cn("border border-border hover:shadow-md transition-shadow", className)}>
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-sm text-muted-foreground">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

const FeaturesSection = () => {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container max-w-6xl">
        <div className="flex flex-col gap-1 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose ArtifyAI</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful features that make our AI art generator stand out
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Instant Generation"
            description="Create beautiful AI-generated imagery in seconds with simple text prompts. No artistic skills required."
            icon={<Zap className="h-5 w-5 text-primary" />}
            className="animate-fade-up"
          />
          
          <FeatureCard
            title="Multiple Art Styles"
            description="Choose from a wide range of artistic styles, from hyper-realistic to abstract and everything in between."
            icon={<PaintBucket className="h-5 w-5 text-primary" />}
            className="animate-fade-up delay-100"
          />
          
          <FeatureCard
            title="Easy Sharing"
            description="Share your creations directly to social media or download them in high resolution for any purpose."
            icon={<Share2 className="h-5 w-5 text-primary" />}
            className="animate-fade-up delay-200"
          />
          
          <FeatureCard
            title="High-Resolution Downloads"
            description="Get access to high-quality, detailed images perfect for printing, digital art, or personal projects."
            icon={<Download className="h-5 w-5 text-primary" />}
            className="animate-fade-up delay-300"
          />
          
          <FeatureCard
            title="Secure Storage"
            description="All your generated images are safely stored in your personal gallery for future access and downloads."
            icon={<Lock className="h-5 w-5 text-primary" />}
            className="animate-fade-up delay-400"
          />
          
          <FeatureCard
            title="Continuous Improvements"
            description="Our AI models are constantly trained and updated to provide even better results with each generation."
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            className="animate-fade-up delay-500"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
