import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  author_mood: string;
  content: string;
  image_gradient: string | null;
  image_emoji: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

interface Dream {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  emoji: string;
  color: string;
  progress: number;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

interface ActivityPost extends Post {
  myComment?: string;
}

export const useUserActivity = () => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<ActivityPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<ActivityPost[]>([]);
  const [commentedPosts, setCommentedPosts] = useState<ActivityPost[]>([]);
  const [sharedPosts, setSharedPosts] = useState<ActivityPost[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserActivity = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch liked posts
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", user.id);

      if (likes && likes.length > 0) {
        const postIds = likes.map((l) => l.post_id);
        const { data: likedPostsData } = await supabase
          .from("posts")
          .select("*")
          .in("id", postIds);
        setLikedPosts((likedPostsData as ActivityPost[]) || []);
      } else {
        setLikedPosts([]);
      }

      // Fetch saved posts
      const { data: saves } = await supabase
        .from("post_saves")
        .select("post_id")
        .eq("user_id", user.id);

      if (saves && saves.length > 0) {
        const postIds = saves.map((s) => s.post_id);
        const { data: savedPostsData } = await supabase
          .from("posts")
          .select("*")
          .in("id", postIds);
        setSavedPosts((savedPostsData as ActivityPost[]) || []);
      } else {
        setSavedPosts([]);
      }

      // Fetch commented posts with comments
      const { data: comments } = await supabase
        .from("post_comments")
        .select("post_id, content")
        .eq("user_id", user.id);

      if (comments && comments.length > 0) {
        const postIds = [...new Set(comments.map((c) => c.post_id))];
        const { data: commentedPostsData } = await supabase
          .from("posts")
          .select("*")
          .in("id", postIds);

        const postsWithComments = (commentedPostsData || []).map((post) => ({
          ...post,
          myComment: comments.find((c) => c.post_id === post.id)?.content,
        }));
        setCommentedPosts(postsWithComments as ActivityPost[]);
      } else {
        setCommentedPosts([]);
      }

      // Fetch shared posts
      const { data: shares } = await supabase
        .from("post_shares")
        .select("post_id")
        .eq("user_id", user.id);

      if (shares && shares.length > 0) {
        const postIds = shares.map((s) => s.post_id);
        const { data: sharedPostsData } = await supabase
          .from("posts")
          .select("*")
          .in("id", postIds);
        setSharedPosts((sharedPostsData as ActivityPost[]) || []);
      } else {
        setSharedPosts([]);
      }

      // Fetch dreams
      const { data: dreamsData } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setDreams((dreamsData as Dream[]) || []);
    } catch (error) {
      console.error("Error fetching user activity:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserActivity();
  }, [fetchUserActivity]);

  return {
    likedPosts,
    savedPosts,
    commentedPosts,
    sharedPosts,
    dreams,
    loading,
    refresh: fetchUserActivity,
  };
};
