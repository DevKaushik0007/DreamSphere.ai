import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, Download, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface GeneratedImage {
  id: string;
  image_url: string;
  prompt: string;
  mood: string | null;
  style: string | null;
  created_at: string;
}

export const ImageGallery = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchImages();
    }

    const handleRefresh = () => fetchImages();
    window.addEventListener("gallery-refresh", handleRefresh);
    return () => window.removeEventListener("gallery-refresh", handleRefresh);
  }, [user, fetchImages]);

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      const urlParts = imageUrl.split("/generated-images/");
      if (urlParts.length > 1) {
        const filePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from("generated-images").remove([filePath]);
      }

      const { error } = await supabase
        .from("generated_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setImages(images.filter((img) => img.id !== id));
      setSelectedImage(null);
      toast({ title: "Image deleted" });
    } catch (err) {
      console.error("Delete error:", err);
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `dreamsphere-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Downloaded!" });
    } catch (err) {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  if (!user) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-white/10 text-center">
        <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Sign in to save and view your gallery</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-white/10 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Your Gallery ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No saved images yet. Generate and save your first creation!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white px-2 text-center line-clamp-2">
                    {image.prompt}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-card rounded-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  className="w-full aspect-square object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4">
                <p className="text-sm mb-2">{selectedImage.prompt}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {selectedImage.mood} • {selectedImage.style} •{" "}
                  {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(selectedImage.image_url)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedImage.id, selectedImage.image_url)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
