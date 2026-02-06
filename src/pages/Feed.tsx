import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFeed } from "@/hooks/useFeed";
import { useFollows } from "@/hooks/useFollows";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  Bookmark,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  Send,
  UserPlus,
  Check,
  Loader2,
  Image,
  Video,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const trendingTopics = [
  { name: "Mindfulness", count: "2.4k posts" },
  { name: "AI Art", count: "1.8k posts" },
  { name: "Gratitude", count: "1.2k posts" },
  { name: "Dreams", count: "980 posts" },
];

const Feed = () => {
  const { user } = useAuth();
  const { posts, loading, toggleLike, toggleSave, addComment, sharePost, createPost } = useFeed();
  const { suggestedUsers, toggleFollow, loading: followsLoading } = useFollows();
  const { uploading, uploadPostMedia } = useMediaUpload();
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ file: File; preview: string; type: "image" | "video" } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const postToShare = posts.find((p) => p.id === sharePostId);

  const handleShare = (postId: string) => {
    setSharePostId(postId);
    setShareDialogOpen(true);
  };

  const copyShareLink = () => {
    if (sharePostId) {
      sharePost(sharePostId);
    }
    setShareDialogOpen(false);
  };

  const openComments = (postId: string) => {
    setSelectedPostId(postId);
    setCommentText("");
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPostId) return;
    addComment(selectedPostId, commentText);
    setCommentText("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Please select an image or video file");
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedMedia({
      file,
      preview,
      type: isVideo ? "video" : "image",
    });
  };

  const removeSelectedMedia = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.preview);
      setSelectedMedia(null);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedMedia) {
      toast.error("Please write something or add media to share");
      return;
    }

    setIsCreating(true);

    try {
      let mediaUrl: string | null = null;
      let mediaType: string | null = null;

      if (selectedMedia) {
        const result = await uploadPostMedia(selectedMedia.file);
        if (result) {
          mediaUrl = result.url;
          mediaType = result.type;
        }
      }

      await createPost(newPostContent, mediaUrl, mediaType);
      setNewPostContent("");
      removeSelectedMedia();
      setCreatePostOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <BackgroundOrbs />
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Community Feed</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Discover <span className="text-gradient-aurora">Dreams</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow dreamers, share your creations, and find inspiration
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * Math.min(index, 5) }}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl overflow-hidden">
                        {post.author_avatar?.startsWith("http") ? (
                          <img src={post.author_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          post.author_avatar
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{post.author_name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatTimestamp(post.created_at)}</span>
                          <span>•</span>
                          <span className="text-primary">{post.author_mood}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Media - prioritize uploaded media */}
                  {post.media_url ? (
                    post.media_type === "video" ? (
                      <video 
                        src={post.media_url} 
                        controls 
                        className="w-full max-h-[500px] object-contain bg-black/20"
                      />
                    ) : (
                      <img 
                        src={post.media_url} 
                        alt="Post media" 
                        className="w-full max-h-[500px] object-contain bg-black/10"
                      />
                    )
                  ) : post.image_gradient && post.image_emoji ? (
                    <div className={`aspect-video bg-gradient-to-br ${post.image_gradient} flex items-center justify-center`}>
                      <motion.span 
                        className="text-8xl"
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        {post.image_emoji}
                      </motion.span>
                    </div>
                  ) : null}

                  {/* Post Actions */}
                  <div className="p-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-accent' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </motion.button>
                      <button 
                        onClick={() => openComments(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments.length}</span>
                      </button>
                      <button 
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleSave(post.id)}
                      className={`transition-colors ${post.isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-primary' : ''}`} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Trending Topics */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-lg font-semibold">Trending</h3>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div key={topic.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <span className="font-medium">#{topic.name}</span>
                      <span className="text-sm text-muted-foreground">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Creators / People to Follow */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-serif text-lg font-semibold">People to Follow</h3>
                </div>
                <div className="space-y-4">
                  {followsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : suggestedUsers.length > 0 ? (
                    suggestedUsers.slice(0, 5).map((suggestedUser) => (
                      <div key={suggestedUser.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-lg overflow-hidden">
                            {suggestedUser.avatar_url ? (
                              <img src={suggestedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              suggestedUser.display_name?.[0]?.toUpperCase() || "?"
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block">
                              {suggestedUser.display_name || "Dreamer"}
                            </span>
                            {suggestedUser.bio && (
                              <span className="text-xs text-muted-foreground truncate block">
                                {suggestedUser.bio.slice(0, 30)}...
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant={suggestedUser.isFollowing ? "default" : "outline"} 
                          size="sm"
                          onClick={() => toggleFollow(suggestedUser.user_id)}
                        >
                          {suggestedUser.isFollowing ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No suggestions yet. Invite friends to join!
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Create */}
              <div className="glass-card rounded-2xl p-6 border border-primary/30 bg-primary/5">
                <h3 className="font-serif text-lg font-semibold mb-2">Share Your Dream</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create something beautiful and share it with the community.
                </p>
                <Button 
                  variant="dream" 
                  className="w-full" 
                  onClick={() => {
                    if (!user) {
                      toast.error("Please sign in to create a post");
                      return;
                    }
                    setCreatePostOpen(true);
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Create Post
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Comments Dialog */}
      <Dialog open={!!selectedPostId} onOpenChange={() => setSelectedPostId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({selectedPost?.comments.length || 0})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedPost?.comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
            ) : (
              selectedPost?.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm">
                    {comment.author_avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(comment.created_at)}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Post
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm line-clamp-2">{postToShare?.content}</p>
            </div>
            <Button onClick={copyShareLink} className="w-full">
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog with Media Upload */}
      <Dialog open={createPostOpen} onOpenChange={(open) => {
        if (!open) {
          removeSelectedMedia();
        }
        setCreatePostOpen(open);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Share Your Dream
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? Share your dreams, thoughts, or creations..."
              className="min-h-[120px] resize-none"
            />

            {/* Media Preview */}
            {selectedMedia && (
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                {selectedMedia.type === "video" ? (
                  <video 
                    src={selectedMedia.preview} 
                    controls 
                    className="w-full max-h-[200px] object-contain bg-black/20"
                  />
                ) : (
                  <img 
                    src={selectedMedia.preview} 
                    alt="Preview" 
                    className="w-full max-h-[200px] object-contain bg-black/10"
                  />
                )}
                <button
                  onClick={removeSelectedMedia}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Media Upload Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Image className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
            </div>

            <Button 
              onClick={handleCreatePost} 
              className="w-full" 
              disabled={isCreating || uploading}
            >
              {isCreating || uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? "Uploading..." : "Sharing..."}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Share Dream
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feed;
