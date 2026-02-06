import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserWithFollowStatus {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  isFollowing: boolean;
}

export const useFollows = () => {
  const { user } = useAuth();
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserWithFollowStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollows = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch who the user is following
      const { data: followingData } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followingIds = followingData?.map((f) => f.following_id) || [];
      setFollowing(followingIds);

      // Fetch user's followers
      const { data: followersData } = await supabase
        .from("user_follows")
        .select("follower_id")
        .eq("following_id", user.id);

      const followerIds = followersData?.map((f) => f.follower_id) || [];
      setFollowers(followerIds);

      // Fetch suggested users (public profiles the user isn't following)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_public", true)
        .neq("user_id", user.id)
        .limit(10);

      const usersWithStatus: UserWithFollowStatus[] = (profiles || []).map((profile) => ({
        ...profile,
        isFollowing: followingIds.includes(profile.user_id),
      }));

      setSuggestedUsers(usersWithStatus);
    } catch (error) {
      console.error("Error fetching follows:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollows();
  }, [fetchFollows]);

  const toggleFollow = async (targetUserId: string) => {
    if (!user) {
      toast.error("Please sign in to follow users");
      return;
    }

    const isCurrentlyFollowing = following.includes(targetUserId);

    // Optimistic update
    if (isCurrentlyFollowing) {
      setFollowing((prev) => prev.filter((id) => id !== targetUserId));
      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u.user_id === targetUserId ? { ...u, isFollowing: false } : u
        )
      );
    } else {
      setFollowing((prev) => [...prev, targetUserId]);
      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u.user_id === targetUserId ? { ...u, isFollowing: true } : u
        )
      );
    }

    try {
      if (isCurrentlyFollowing) {
        await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId);
        toast.success("Unfollowed successfully");
      } else {
        await supabase
          .from("user_follows")
          .insert({ follower_id: user.id, following_id: targetUserId });
        toast.success("Now following! 🎉");
      }
    } catch (error) {
      // Revert on error
      if (isCurrentlyFollowing) {
        setFollowing((prev) => [...prev, targetUserId]);
        setSuggestedUsers((prev) =>
          prev.map((u) =>
            u.user_id === targetUserId ? { ...u, isFollowing: true } : u
          )
        );
      } else {
        setFollowing((prev) => prev.filter((id) => id !== targetUserId));
        setSuggestedUsers((prev) =>
          prev.map((u) =>
            u.user_id === targetUserId ? { ...u, isFollowing: false } : u
          )
        );
      }
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    }
  };

  const isFollowing = (userId: string) => following.includes(userId);

  return {
    following,
    followers,
    suggestedUsers,
    loading,
    toggleFollow,
    isFollowing,
    refresh: fetchFollows,
  };
};
