import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { MoodShowcase } from "@/components/landing/MoodShowcase";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MoodShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
