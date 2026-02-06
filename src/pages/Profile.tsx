import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useUserActivity } from "@/hooks/useUserActivity";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useFollows } from "@/hooks/useFollows";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { 
  User, 
  Camera, 
  Save, 
  Loader2, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Share2, 
  Target,
  Sparkles,
  RefreshCw,
  Users
} from "lucide-react";

const moodOptions = [
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "peaceful", label: "Peaceful", emoji: "🌿" },
  { value: "excited", label: "Excited", emoji: "🔥" },
];

const interestOptions = [
  "Art", "Music", "Nature", "Travel", "Wellness", 
  "Technology", "Photography", "Writing", "Meditation", "Gaming"
];

const Profile = () => {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const { likedPosts, savedPosts, commentedPosts, sharedPosts, dreams, loading: activityLoading, refresh } = useUserActivity();
  const { uploadAvatar, uploading: avatarUploading } = useMediaUpload();
  const { followers, following } = useFollows();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [moodPreference, setMoodPreference] = useState("calm");
  const [interests, setInterests] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setMoodPreference(profile.mood_preference || "calm");
      setInterests(profile.interests || []);
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadAvatar(file);
    if (url) {
      setAvatarUrl(url);
      await updateProfile({ avatar_url: url });
      toast({ title: "Profile photo updated! 📸" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      display_name: displayName,
      bio,
      mood_preference: moodPreference,
      interests,
      avatar_url: avatarUrl,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated! ✨" });
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const PostCard = ({ post, type }: { post: any; type: string }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg overflow-hidden">
          {post.author_avatar?.startsWith("http") ? (
            <img src={post.author_avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            post.author_avatar
          )}
        </div>
        <span className="font-medium">{post.author_name}</span>
      </div>
      {post.media_url ? (
        post.media_type === "video" ? (
          <video src={post.media_url} className="w-full rounded-lg aspect-video object-cover mb-3" />
        ) : (
          <img src={post.media_url} alt="" className="w-full rounded-lg aspect-video object-cover mb-3" />
        )
      ) : post.image_gradient && post.image_emoji ? (
        <div className={`aspect-video rounded-lg bg-gradient-to-br ${post.image_gradient} flex items-center justify-center mb-3`}>
          <span className="text-4xl">{post.image_emoji}</span>
        </div>
      ) : null}
      <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
      {type === "commented" && post.myComment && (
        <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary">Your comment: "{post.myComment}"</p>
        </div>
      )}
    </motion.div>
  );

  const DreamCard = ({ dream }: { dream: any }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dream.color} flex items-center justify-center text-xl`}>
          {dream.emoji}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{dream.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${dream.color}`}
                style={{ width: `${dream.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{dream.progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Customize your DreamSphere experience</p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                My Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/10 space-y-6"
              >
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <button 
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50"
                    >
                      {avatarUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  
                  {/* Follower Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xl font-bold">{followers.length}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold">{following.length}</p>
                      <p className="text-xs text-muted-foreground">Following</p>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    className="bg-muted/50 border-white/10"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-muted/50 border-white/10 min-h-[100px] resize-none"
                  />
                </div>

                {/* Mood Preference */}
                <div>
                  <label className="block text-sm font-medium mb-3">Default Mood</label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((mood) => (
                      <motion.button
                        key={mood.value}
                        type="button"
                        onClick={() => setMoodPreference(mood.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                          moodPreference === mood.value
                            ? "bg-primary/20 border-2 border-primary"
                            : "bg-muted/50 border-2 border-transparent hover:border-primary/30"
                        }`}
                      >
                        <span>{mood.emoji}</span>
                        <span className="text-sm">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium mb-3">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <motion.button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          interests.includes(interest)
                            ? "bg-primary/20 border-2 border-primary"
                            : "bg-muted/50 border-2 border-transparent hover:border-primary/30"
                        }`}
                      >
                        {interest}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  variant="dream"
                  size="lg"
                  className="w-full"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="activity">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Refresh Button */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refresh}
                    disabled={activityLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${activityLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {activityLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Liked Posts */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5 text-accent" />
                        <h3 className="font-serif text-lg font-semibold">Liked Posts</h3>
                        <span className="text-sm text-muted-foreground ml-auto">{likedPosts.length}</span>
                      </div>
                      {likedPosts.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {likedPosts.map((post) => (
                            <PostCard key={post.id} post={post} type="liked" />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No liked posts yet. Start exploring the feed! 💜</p>
                      )}
                    </div>

                    {/* Saved Posts */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <Bookmark className="w-5 h-5 text-primary" />
                        <h3 className="font-serif text-lg font-semibold">Saved Posts</h3>
                        <span className="text-sm text-muted-foreground ml-auto">{savedPosts.length}</span>
                      </div>
                      {savedPosts.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {savedPosts.map((post) => (
                            <PostCard key={post.id} post={post} type="saved" />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No saved posts yet. Bookmark posts to find them here! 📌</p>
                      )}
                    </div>

                    {/* Commented Posts */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-secondary" />
                        <h3 className="font-serif text-lg font-semibold">Commented Posts</h3>
                        <span className="text-sm text-muted-foreground ml-auto">{commentedPosts.length}</span>
                      </div>
                      {commentedPosts.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {commentedPosts.map((post) => (
                            <PostCard key={post.id} post={post} type="commented" />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No commented posts yet. Join the conversation! 💬</p>
                      )}
                    </div>

                    {/* Shared Posts */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <Share2 className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-serif text-lg font-semibold">Shared Posts</h3>
                        <span className="text-sm text-muted-foreground ml-auto">{sharedPosts.length}</span>
                      </div>
                      {sharedPosts.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {sharedPosts.map((post) => (
                            <PostCard key={post.id} post={post} type="shared" />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No shared posts yet. Share something inspiring! 🔗</p>
                      )}
                    </div>

                    {/* My Dreams */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-amber-500" />
                        <h3 className="font-serif text-lg font-semibold">My Dreams</h3>
                        <span className="text-sm text-muted-foreground ml-auto">{dreams.length}</span>
                      </div>
                      {dreams.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dreams.map((dream) => (
                            <DreamCard key={dream.id} dream={dream} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No dreams added yet. Create your first dream on the DreamBoard! 🎯</p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
