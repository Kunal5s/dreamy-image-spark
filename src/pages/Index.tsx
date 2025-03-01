
import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ImageGenerator from "@/components/ImageGenerator";
import Gallery from "@/components/Gallery";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ImageGenerator />
        <Gallery />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
