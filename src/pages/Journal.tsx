import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  BookHeart, 
  Plus, 
  Calendar, 
  Heart,
  Sparkles,
  ChevronRight,
  Lock,
  Trash2
} from "lucide-react";

const moods = [
  { name: "Happy", emoji: "😊", color: "bg-mood-happy" },
  { name: "Calm", emoji: "😌", color: "bg-mood-calm" },
  { name: "Sad", emoji: "😢", color: "bg-mood-sad" },
  { name: "Anxious", emoji: "😰", color: "bg-mood-anxious" },
  { name: "Creative", emoji: "🎨", color: "bg-mood-creative" },
  { name: "Peaceful", emoji: "🌿", color: "bg-mood-peaceful" },
];

const reflectivePrompts = [
  "What are you grateful for today?",
  "How did you take care of yourself?",
  "What moment made you smile?",
  "What challenge did you overcome?",
  "What are you looking forward to?",
];

interface JournalEntry {
  id: number;
  date: string;
  mood: typeof moods[0];
  title: string;
  content: string;
  isPrivate: boolean;
}

const initialEntries: JournalEntry[] = [
  {
    id: 1,
    date: "Today",
    mood: { name: "Calm", emoji: "😌", color: "bg-mood-calm" },
    title: "Finding peace in small moments",
    content: "Today I took a walk in the park and noticed the way sunlight filtered through the leaves. It reminded me how beautiful simple moments can be.",
    isPrivate: true,
  },
  {
    id: 2,
    date: "Yesterday",
    mood: { name: "Creative", emoji: "🎨", color: "bg-mood-creative" },
    title: "Inspiration struck!",
    content: "Had an amazing idea for a new project. The creativity just flowed naturally and I felt so alive.",
    isPrivate: false,
  },
  {
    id: 3,
    date: "3 days ago",
    mood: { name: "Happy", emoji: "😊", color: "bg-mood-happy" },
    title: "Celebrating small wins",
    content: "Finally completed that goal I've been working on for weeks. Feels incredible to see progress.",
    isPrivate: true,
  },
];

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [isWriting, setIsWriting] = useState(false);
  const [currentMood, setCurrentMood] = useState(moods[0]);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(reflectivePrompts[0]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const getNewPrompt = () => {
    const randomIndex = Math.floor(Math.random() * reflectivePrompts.length);
    setCurrentPrompt(reflectivePrompts[randomIndex]);
  };

  const handleSaveEntry = () => {
    if (!journalContent.trim()) {
      toast.error("Please write something before saving");
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now(),
      date: "Today",
      mood: currentMood,
      title: journalTitle.trim() || "Untitled Entry",
      content: journalContent,
      isPrivate: isPrivate,
    };

    setEntries([newEntry, ...entries]);
    setJournalTitle("");
    setJournalContent("");
    setIsPrivate(false);
    setIsWriting(false);
    setCurrentMood(moods[0]);
    toast.success(isPrivate ? "Entry saved privately! 🔒" : "Entry saved! 💜");
  };

  const handleDeleteEntry = (entryId: number) => {
    setEntries(entries.filter(e => e.id !== entryId));
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null);
    }
    toast.success("Entry deleted");
  };

  const handleCancel = () => {
    setIsWriting(false);
    setJournalTitle("");
    setJournalContent("");
    setIsPrivate(false);
    setSelectedEntry(null);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <BookHeart className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Emotional Journal</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Your Safe <span className="text-gradient-sunset">Space</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A therapy-style journal where AI guides you with reflective questions and calming visuals
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Journal Entries */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-semibold">Your Entries</h2>
                <Button 
                  variant="dream" 
                  size="sm"
                  onClick={() => {
                    setIsWriting(true);
                    setSelectedEntry(null);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  New Entry
                </Button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ scale: 1.02 }}
                    className={`glass-card rounded-xl p-4 border cursor-pointer transition-all group ${
                      selectedEntry?.id === entry.id 
                        ? "border-primary/50 bg-primary/5" 
                        : "border-white/10 hover:border-primary/30"
                    }`}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setIsWriting(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${entry.mood.color}`} />
                        <span className="text-sm text-muted-foreground">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                        {entry.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                        <span className="text-lg">{entry.mood.emoji}</span>
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Writing Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass-card rounded-2xl p-6 border border-white/10 min-h-[600px]">
                <AnimatePresence mode="wait">
                  {isWriting ? (
                    <motion.div
                      key="writing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Mood Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-3">How are you feeling?</label>
                        <div className="flex flex-wrap gap-2">
                          {moods.map((mood) => (
                            <motion.button
                              key={mood.name}
                              onClick={() => setCurrentMood(mood)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                                currentMood.name === mood.name
                                  ? "bg-primary/20 border-2 border-primary"
                                  : "bg-muted/50 border-2 border-transparent hover:border-primary/30"
                              }`}
                            >
                              <span className="text-lg">{mood.emoji}</span>
                              <span className="text-sm">{mood.name}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* AI Prompt */}
                      <motion.div 
                        className="p-4 rounded-xl bg-primary/10 border border-primary/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">AI Reflection Prompt</span>
                        </div>
                        <p className="text-foreground italic">{currentPrompt}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={getNewPrompt}
                        >
                          Try another prompt <ChevronRight className="w-4 h-4" />
                        </Button>
                      </motion.div>

                      {/* Title Input */}
                      <Input
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        placeholder="Entry title (optional)"
                        className="bg-muted/30 border-white/10 focus:border-primary/50"
                      />

                      {/* Journal Input */}
                      <Textarea
                        value={journalContent}
                        onChange={(e) => setJournalContent(e.target.value)}
                        placeholder="Start writing your thoughts..."
                        className="min-h-[250px] bg-muted/30 border-white/10 focus:border-primary/50 resize-none text-lg"
                      />

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant={isPrivate ? "default" : "outline"}
                            onClick={() => setIsPrivate(!isPrivate)}
                          >
                            <Lock className="w-4 h-4" />
                            {isPrivate ? "Private" : "Keep Private"}
                          </Button>
                          <Button variant="dream" onClick={handleSaveEntry}>
                            <Heart className="w-4 h-4" />
                            Save Entry
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : selectedEntry ? (
                    <motion.div
                      key="viewing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${selectedEntry.mood.color} flex items-center justify-center text-2xl`}>
                            {selectedEntry.mood.emoji}
                          </div>
                          <div>
                            <h2 className="font-serif text-2xl font-semibold">{selectedEntry.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{selectedEntry.date}</span>
                              {selectedEntry.isPrivate && (
                                <>
                                  <span>•</span>
                                  <Lock className="w-3 h-3" />
                                  <span>Private</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 rounded-xl bg-muted/20 border border-white/10">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">{selectedEntry.content}</p>
                      </div>
                      <Button variant="ghost" onClick={() => setSelectedEntry(null)}>
                        ← Back to entries
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full min-h-[500px] text-center"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <BookHeart className="w-20 h-20 text-muted-foreground/30 mb-6" />
                      </motion.div>
                      <h3 className="font-serif text-2xl font-semibold mb-2">
                        Start Your Journal Entry
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Take a moment to reflect on your day. Writing helps process emotions
                        and gain clarity.
                      </p>
                      <Button variant="dream" size="lg" onClick={() => setIsWriting(true)}>
                        <Plus className="w-5 h-5" />
                        Begin Writing
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;