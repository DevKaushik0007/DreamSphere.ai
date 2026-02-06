import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Plus, 
  Check,
  Trash2,
  Wand2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Loader2
} from "lucide-react";

interface DreamGoal {
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

// Sample goals for demo users
const sampleGoals = [
  { id: "sample-1", title: "Learn to meditate daily", category: "Wellness", progress: 75, emoji: "🧘", color: "from-teal-500 to-emerald-500" },
  { id: "sample-2", title: "Write 1000 journal entries", category: "Growth", progress: 40, emoji: "📝", color: "from-purple-500 to-pink-500" },
  { id: "sample-3", title: "Create 100 AI artworks", category: "Creativity", progress: 90, emoji: "🎨", color: "from-orange-400 to-pink-500" },
];

const colorOptions = [
  "from-teal-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-orange-400 to-pink-500",
  "from-blue-500 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-pink-500 to-rose-500",
];

const emojiOptions = ["🧘", "📝", "🎨", "🤝", "📚", "🙏", "✨", "🎯", "🚀", "💪"];

const DreamBoard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<DreamGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDreams = useCallback(async () => {
    if (!user) {
      // Show sample goals for demo
      setGoals(sampleGoals.map((g) => ({
        ...g,
        user_id: "demo",
        description: null,
        target_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching dreams:", error);
      toast.error("Failed to load dreams");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDreams();
  }, [fetchDreams]);

  const completedCount = goals.filter((g) => g.progress === 100).length;
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
    : 0;

  const updateProgress = async (goalId: string, change: number) => {
    if (!user || goalId.startsWith("sample-")) {
      toast.info("Please sign in to track your progress");
      return;
    }

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newProgress = Math.max(0, Math.min(100, goal.progress + change));

    // Optimistic update
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress: newProgress } : g))
    );

    try {
      const { error } = await supabase
        .from("dreams")
        .update({ progress: newProgress })
        .eq("id", goalId);

      if (error) throw error;

      if (newProgress === 100 && goal.progress < 100) {
        toast.success(`🎉 Congratulations! "${goal.title}" achieved!`);
      }
    } catch (error) {
      // Revert on error
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, progress: goal.progress } : g))
      );
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const resetProgress = async (goalId: string) => {
    if (!user || goalId.startsWith("sample-")) {
      toast.info("Please sign in to track your progress");
      return;
    }

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    // Optimistic update
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress: 0 } : g))
    );

    try {
      const { error } = await supabase
        .from("dreams")
        .update({ progress: 0 })
        .eq("id", goalId);

      if (error) throw error;
      toast.info("Progress reset to 0%");
    } catch (error) {
      // Revert on error
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, progress: goal.progress } : g))
      );
      console.error("Error resetting progress:", error);
      toast.error("Failed to reset progress");
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user || goalId.startsWith("sample-")) {
      toast.info("Please sign in to manage your dreams");
      return;
    }

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    // Optimistic update
    setGoals((prev) => prev.filter((g) => g.id !== goalId));

    try {
      const { error } = await supabase.from("dreams").delete().eq("id", goalId);

      if (error) throw error;
      toast.success("Dream removed");
    } catch (error) {
      // Revert on error
      setGoals((prev) => [...prev, goal]);
      console.error("Error deleting dream:", error);
      toast.error("Failed to delete dream");
    }
  };

  const addNewGoal = async () => {
    if (!newGoal.trim()) return;

    if (!user) {
      toast.error("Please sign in to add dreams");
      return;
    }

    setSaving(true);
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];

    const newDream = {
      user_id: user.id,
      title: newGoal,
      emoji: randomEmoji,
      color: randomColor,
      progress: 0,
    };

    try {
      const { data, error } = await supabase
        .from("dreams")
        .insert(newDream)
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => [data, ...prev]);
      setNewGoal("");
      setIsAddingGoal(false);
      toast.success("New dream added! 🌟");
    } catch (error) {
      console.error("Error adding dream:", error);
      toast.error("Failed to add dream");
    } finally {
      setSaving(false);
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6">
              <Target className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-medium">DreamBoard</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Manifest Your <span className="text-gradient-aurora">Dreams</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build visual goal boards, track your emotional growth, and turn dreams into reality
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="glass-card rounded-xl p-4 border border-white/10 text-center">
              <div className="font-serif text-3xl font-bold text-gradient-aurora">{goals.length}</div>
              <div className="text-sm text-muted-foreground">Total Dreams</div>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/10 text-center">
              <div className="font-serif text-3xl font-bold text-gradient-sunset">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Achieved</div>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/10 text-center">
              <div className="font-serif text-3xl font-bold text-primary">{totalProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
          </motion.div>

          {/* Add Goal Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end mb-8"
          >
            <Button 
              variant="aurora" 
              size="sm"
              onClick={() => {
                if (!user) {
                  toast.error("Please sign in to add dreams");
                  return;
                }
                setIsAddingGoal(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Dream
            </Button>
          </motion.div>

          {/* Add Goal Form */}
          {isAddingGoal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-6 border border-white/10 mb-8"
            >
              <div className="flex items-center gap-4">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="What's your next dream?"
                  className="flex-1 bg-muted/50 border-white/10"
                  onKeyDown={(e) => e.key === "Enter" && addNewGoal()}
                  disabled={saving}
                />
                <Button variant="dream" onClick={addNewGoal} disabled={saving}>
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  Create
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingGoal(false)} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Goals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(index, 5) }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className={`glass-card rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all relative overflow-hidden ${goal.progress === 100 ? 'opacity-75' : ''}`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-2xl`}>
                        {goal.emoji}
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.progress === 100 && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-lg font-semibold mt-1 mb-4">{goal.title}</h3>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 * Math.min(index, 5) }}
                          className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                        />
                      </div>
                    </div>

                    {/* Progress Controls */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateProgress(goal.id, -10)}
                          disabled={goal.progress === 0}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground px-2">-10%</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => resetProgress(goal.id)}
                        title="Reset progress"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground px-2">+10%</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateProgress(goal.id, 10)}
                          disabled={goal.progress === 100}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (!user) {
                  toast.error("Please sign in to add dreams");
                  return;
                }
                setIsAddingGoal(true);
              }}
              className="cursor-pointer"
            >
              <div className="glass-card rounded-2xl p-6 border-2 border-dashed border-white/20 hover:border-primary/50 transition-all h-full min-h-[200px] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-1">Add New Dream</h3>
                <p className="text-sm text-muted-foreground">Set a new goal and track your progress</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DreamBoard;
