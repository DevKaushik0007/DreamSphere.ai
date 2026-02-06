import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UploadResult {
  url: string;
  type: "image" | "video";
}

export const useMediaUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadPostMedia = async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      toast.error("Please sign in to upload media");
      return null;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 50MB");
      return null;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM)");
      return null;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("post-media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("post-media")
        .getPublicUrl(fileName);

      const mediaType = file.type.startsWith("video/") ? "video" : "image";

      return { url: publicUrl, type: mediaType };
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload media");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error("Please sign in to upload avatar");
      return null;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Avatar must be less than 5MB");
      return null;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image (JPEG, PNG, GIF, WebP)");
      return null;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      await supabase.storage.from("avatars").remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Add cache buster
      return `${publicUrl}?t=${Date.now()}`;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadPostMedia,
    uploadAvatar,
  };
};
