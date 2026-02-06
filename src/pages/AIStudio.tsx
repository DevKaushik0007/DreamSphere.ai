import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ImageGallery } from "@/components/studio/ImageGallery";
import { 
  Sparkles, 
  Wand2, 
  Download, 
  Share2, 
  Save,
  RefreshCw,
  Palette,
  AlertCircle,
  Loader2
} from "lucide-react";

const moods = [
  { name: "Happy", emoji: "😊", color: "bg-mood-happy" },
  { name: "Calm", emoji: "😌", color: "bg-mood-calm" },
  { name: "Creative", emoji: "🎨", color: "bg-mood-creative" },
  { name: "Peaceful", emoji: "🌿", color: "bg-mood-peaceful" },
  { name: "Romantic", emoji: "💕", color: "bg-mood-romantic" },
  { name: "Excited", emoji: "🔥", color: "bg-mood-excited" },
  { name: "Sad", emoji: "😢", color: "bg-mood-sad" },
  { name: "Anxious", emoji: "😰", color: "bg-mood-anxious" },
];

const stylePresets = [
  { name: "Dreamy", icon: "🌙" },
  { name: "Surreal", icon: "🎭" },
  { name: "Minimal", icon: "⬜" },
  { name: "Vibrant", icon: "🌈" },
  { name: "Dark", icon: "🖤" },
  { name: "Nature", icon: "🌿" },
];

const AIStudio = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [selectedStyle, setSelectedStyle] = useState(stylePresets[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const galleryRef = useRef<{ refresh: () => void }>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe what you want to create",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-image", {
        body: {
          prompt: prompt.trim(),
          mood: selectedMood.name,
          style: selectedStyle.name,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to generate image");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setCurrentPrompt(prompt.trim());
        toast({
          title: "Image created! ✨",
          description: user ? "Click save to add to your gallery" : "Sign in to save to your gallery",
        });
      } else {
        throw new Error("No image was generated");
      }
    } catch (err: unknown) {
      console.error("Generation error:", err);
      const errorMessage = "Something went wrong while generating your image. Please try again.";
      setError(errorMessage);
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `dreamsphere-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Downloaded!",
        description: "Your artwork has been saved",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Could not download the image",
        variant: "destructive",
      });
    }
  };

  const handleSaveToGallery = async () => {
    if (!generatedImage || !user) return;

    setIsSaving(true);
    try {
      // Convert base64 to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const fileName = `${user.id}/${Date.now()}.png`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("generated-images")
        .upload(fileName, blob, { contentType: "image/png" });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("generated-images")
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase.from("generated_images").insert({
        user_id: user.id,
        image_url: urlData.publicUrl,
        prompt: currentPrompt,
        mood: selectedMood.name,
        style: selectedStyle.name,
      });

      if (dbError) throw dbError;

      toast({ title: "Saved to gallery! ✨" });
      
      // Trigger gallery refresh
      window.dispatchEvent(new CustomEvent("gallery-refresh"));
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI Creation Studio</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Create Visual <span className="text-gradient-aurora">Magic</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Describe your vision, select your mood, and let AI bring your dreams to life
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Prompt Input */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <label className="block text-sm font-medium mb-3">Your Vision</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create... A serene forest at sunset with floating lanterns..."
                  className="min-h-[120px] bg-muted/50 border-white/10 focus:border-primary/50 resize-none"
                />
              </div>

              {/* Mood Selection */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <label className="block text-sm font-medium mb-3">Current Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.name}
                      onClick={() => setSelectedMood(mood)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                        selectedMood.name === mood.name
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-muted/50 border-2 border-transparent hover:border-primary/30"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${mood.color}`} />
                      <span className="text-sm">{mood.emoji}</span>
                      <span className="text-sm">{mood.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Style Presets */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <label className="block text-sm font-medium mb-3">Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {stylePresets.map((style) => (
                    <motion.button
                      key={style.name}
                      onClick={() => setSelectedStyle(style)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                        selectedStyle.name === style.name
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-muted/50 border-2 border-transparent hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl">{style.icon}</span>
                      <span className="text-xs">{style.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                variant="dream" 
                size="xl" 
                className="w-full"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Creation
                  </>
                )}
              </Button>
            </motion.div>

            {/* Right - Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card rounded-2xl p-6 border border-white/10 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Preview</span>
                  {generatedImage && (
                    <div className="flex items-center gap-2">
                      {user && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleSaveToGallery}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={handleDownload}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="aspect-square rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center p-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-16 h-16 text-primary" />
                      </motion.div>
                      <p className="mt-4 text-muted-foreground">Creating your masterpiece...</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">This may take a few seconds</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-8">
                      <AlertCircle className="w-16 h-16 text-destructive/50 mx-auto mb-4" />
                      <p className="text-destructive">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={handleGenerate}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : generatedImage ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={generatedImage}
                      alt="Generated artwork"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Your creation will appear here
                      </p>
                      <p className="text-sm text-muted-foreground/60 mt-2">
                        Enter a prompt and click generate
                      </p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Prompt:</span> {prompt}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">Mood:</span> {selectedMood.name} • 
                      <span className="font-medium text-foreground ml-2">Style:</span> {selectedStyle.name}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <ImageGallery />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AIStudio;
