import { motion } from "framer-motion";
import { useState } from "react";

const moods = [
  { name: "Happy", color: "bg-mood-happy", emoji: "😊", description: "Bright, warm, and uplifting visuals" },
  { name: "Calm", color: "bg-mood-calm", emoji: "😌", description: "Serene blues and gentle gradients" },
  { name: "Creative", color: "bg-mood-creative", emoji: "🎨", description: "Bold colors and abstract patterns" },
  { name: "Peaceful", color: "bg-mood-peaceful", emoji: "🌿", description: "Nature-inspired tranquil scenes" },
  { name: "Romantic", color: "bg-mood-romantic", emoji: "💕", description: "Soft pinks and dreamy aesthetics" },
  { name: "Excited", color: "bg-mood-excited", emoji: "🔥", description: "Vibrant energy and dynamic forms" },
];

export const MoodShowcase = () => {
  const [selectedMood, setSelectedMood] = useState(moods[0]);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              AI That Understands
              <span className="text-gradient-sunset"> How You Feel</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Select your mood, and watch DreamSphere.AI adapt. Our intelligent 
              system creates personalized visuals, content, and experiences that 
              resonate with your emotional state.
            </p>

            {/* Mood Selector */}
            <div className="flex flex-wrap gap-3 mb-8">
              {moods.map((mood) => (
                <motion.button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    selectedMood.name === mood.name
                      ? "bg-primary/20 border-2 border-primary"
                      : "bg-muted/50 border-2 border-transparent hover:border-primary/30"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`w-3 h-3 rounded-full ${mood.color}`} />
                  <span className="text-sm font-medium">{mood.name}</span>
                  <span>{mood.emoji}</span>
                </motion.button>
              ))}
            </div>

            {/* Selected Mood Info */}
            <motion.div
              key={selectedMood.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-4 h-4 rounded-full ${selectedMood.color}`} />
                <span className="font-serif text-xl font-semibold">{selectedMood.name}</span>
                <span className="text-2xl">{selectedMood.emoji}</span>
              </div>
              <p className="text-muted-foreground">{selectedMood.description}</p>
            </motion.div>
          </motion.div>

          {/* Right - Visual Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Animated mood preview */}
              <motion.div
                key={selectedMood.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 rounded-3xl ${selectedMood.color} opacity-20 blur-3xl`}
              />
              <div className="relative glass-card rounded-3xl p-8 h-full flex flex-col items-center justify-center border border-white/20">
                <motion.span
                  key={selectedMood.emoji}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-8xl mb-6"
                >
                  {selectedMood.emoji}
                </motion.span>
                <motion.div
                  key={`${selectedMood.name}-bar`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`w-32 h-2 rounded-full ${selectedMood.color}`}
                />
                <p className="mt-4 text-lg font-serif">{selectedMood.name} Mood</p>
                <p className="text-sm text-muted-foreground mt-2">AI-generated content adapts to you</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
