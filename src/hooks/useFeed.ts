import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

interface FeedPost {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  author_mood: string;
  content: string;
  image_gradient: string | null;
  image_emoji: string | null;
  media_url: string | null;
  media_type: string | null;
  created_at: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isSaved: boolean;
}

// Sample posts for demo (will be shown alongside real posts)
const samplePosts = [
  {
    id: "sample-1",
    user_id: "demo",
    author_name: "Luna Dreams",
    author_avatar: "🌙",
    author_mood: "Creative",
    content: "Just created this amazing sunset visualization! AI helped me turn my feelings into art. The process was so therapeutic 💜",
    image_gradient: "from-orange-400 via-pink-500 to-purple-600",
    image_emoji: "🌅",
    media_url: null,
    media_type: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-2",
    user_id: "demo",
    author_name: "Starlight Soul",
    author_avatar: "⭐",
    author_mood: "Peaceful",
    content: "Finding peace in the small moments. Today's journal entry was all about gratitude and mindfulness. 🧘‍♀️",
    image_gradient: "from-teal-400 via-blue-500 to-purple-500",
    image_emoji: "🧘",
    media_url: null,
    media_type: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-3",
    user_id: "demo",
    author_name: "Cosmic Creator",
    author_avatar: "🌌",
    author_mood: "Excited",
    content: "My DreamBoard is coming to life! Already achieved 3 goals this month. Never thought visualization could be this powerful! 🚀",
    image_gradient: "from-purple-500 via-pink-500 to-red-500",
    image_emoji: "🎯",
    media_url: null,
    media_type: null,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

export const useFeed = () => {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      // Fetch posts from database
      const { data: dbPosts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch likes counts
      const { data: likesData } = await supabase
        .from("post_likes")
        .select("post_id");

      // Fetch user's likes
      let userLikes: string[] = [];
      if (user) {
        const { data: userLikesData } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id);
        userLikes = userLikesData?.map((l) => l.post_id) || [];
      }

      // Fetch user's saves
      let userSaves: string[] = [];
      if (user) {
        const { data: userSavesData } = await supabase
          .from("post_saves")
          .select("post_id")
          .eq("user_id", user.id);
        userSaves = userSavesData?.map((s) => s.post_id) || [];
      }

      // Fetch comments for each post
      const { data: allComments } = await supabase
        .from("post_comments")
        .select("*")
        .order("created_at", { ascending: true });

      // Count likes per post
      const likeCounts: Record<string, number> = {};
      likesData?.forEach((like) => {
        likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1;
      });

      // Group comments by post
      const commentsByPost: Record<string, Comment[]> = {};
      allComments?.forEach((comment) => {
        if (!commentsByPost[comment.post_id]) {
          commentsByPost[comment.post_id] = [];
        }
        commentsByPost[comment.post_id].push(comment as Comment);
      });

      // Transform database posts
      const transformedPosts: FeedPost[] = (dbPosts || []).map((post) => ({
        ...post,
        likes: likeCounts[post.id] || 0,
        comments: commentsByPost[post.id] || [],
        isLiked: userLikes.includes(post.id),
        isSaved: userSaves.includes(post.id),
      }));

      // Add sample posts if no real posts exist
      const sampleFeedPosts: FeedPost[] = samplePosts.map((post) => ({
        ...post,
        likes: Math.floor(Math.random() * 300) + 50,
        comments: [],
        isLiked: false,
        isSaved: false,
      }));

      // Combine real posts with sample posts
      setPosts([...transformedPosts, ...sampleFeedPosts]);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Fall back to sample posts on error
      setPosts(
        samplePosts.map((post) => ({
          ...post,
          likes: Math.floor(Math.random() * 300) + 50,
          comments: [],
          isLiked: false,
          isSaved: false,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post || postId.startsWith("sample-")) {
      toast.info("This is a demo post");
      return;
    }

    const isLiked = post.isLiked;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !isLiked, likes: isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

    try {
      if (isLiked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
      } else {
        await supabase
          .from("post_likes")
          .insert({ user_id: user.id, post_id: postId });
        toast.success("Added to favorites! 💜");
      }
    } catch (error) {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked: isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 }
            : p
        )
      );
      console.error("Error toggling like:", error);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) {
      toast.error("Please sign in to save posts");
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post || postId.startsWith("sample-")) {
      toast.info("This is a demo post");
      return;
    }

    const isSaved = post.isSaved;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !isSaved } : p))
    );

    try {
      if (isSaved) {
        await supabase
          .from("post_saves")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
        toast.success("Post removed from saved");
      } else {
        await supabase
          .from("post_saves")
          .insert({ user_id: user.id, post_id: postId });
        toast.success("Post saved! 📌");
      }
    } catch (error) {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isSaved: isSaved } : p))
      );
      console.error("Error toggling save:", error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user || !profile) {
      toast.error("Please sign in to comment");
      return;
    }

    if (postId.startsWith("sample-")) {
      toast.info("This is a demo post");
      return;
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      user_id: user.id,
      post_id: postId,
      author_name: profile.display_name || "You",
      author_avatar: "🌟",
      content,
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );

    try {
      await supabase.from("post_comments").insert({
        user_id: user.id,
        post_id: postId,
        author_name: profile.display_name || "You",
        author_avatar: "🌟",
        content,
      });
      toast.success("Comment added! 💬");
    } catch (error) {
      // Revert on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.filter((c) => c.id !== newComment.id) }
            : p
        )
      );
      console.error("Error adding comment:", error);
    }
  };

  const sharePost = async (postId: string) => {
    if (!user) {
      navigator.clipboard.writeText(`https://dreamsphere.ai/post/${postId}`);
      toast.success("Link copied to clipboard! 🔗");
      return;
    }

    if (postId.startsWith("sample-")) {
      navigator.clipboard.writeText(`https://dreamsphere.ai/post/${postId}`);
      toast.success("Link copied to clipboard! 🔗");
      return;
    }

    try {
      await supabase
        .from("post_shares")
        .insert({ user_id: user.id, post_id: postId });
      navigator.clipboard.writeText(`https://dreamsphere.ai/post/${postId}`);
      toast.success("Link copied to clipboard! 🔗");
    } catch (error) {
      console.error("Error sharing post:", error);
      navigator.clipboard.writeText(`https://dreamsphere.ai/post/${postId}`);
      toast.success("Link copied to clipboard! 🔗");
    }
  };

  const createPost = async (
    content: string,
    mediaUrl?: string | null,
    mediaType?: string | null
  ) => {
    if (!user || !profile) {
      toast.error("Please sign in to create a post");
      return;
    }

    const gradients = [
      "from-purple-500 via-pink-500 to-rose-500",
      "from-blue-500 via-purple-500 to-pink-500",
      "from-green-500 via-teal-500 to-blue-500",
      "from-orange-500 via-red-500 to-pink-500",
    ];

    const emojis = ["✨", "🌟", "💫", "🎯", "🚀"];

    // Only use gradient/emoji if no media is uploaded
    const hasMedia = mediaUrl && mediaType;

    const newPost = {
      user_id: user.id,
      author_name: profile.display_name || "You",
      author_avatar: profile.avatar_url || "🌟",
      author_mood: profile.mood_preference || "Creative",
      content,
      image_gradient: hasMedia ? null : gradients[Math.floor(Math.random() * gradients.length)],
      image_emoji: hasMedia ? null : emojis[Math.floor(Math.random() * emojis.length)],
      media_url: mediaUrl || null,
      media_type: mediaType || null,
    };

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert(newPost)
        .select()
        .single();

      if (error) throw error;

      const fullPost: FeedPost = {
        ...data,
        likes: 0,
        comments: [],
        isLiked: false,
        isSaved: false,
      };

      setPosts((prev) => [fullPost, ...prev]);
      toast.success("Your dream has been shared! 🌟");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  return {
    posts,
    loading,
    toggleLike,
    toggleSave,
    addComment,
    sharePost,
    createPost,
    refresh: fetchPosts,
  };
};
