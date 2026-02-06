import { motion } from "framer-motion";
import { 
  Palette, 
  BookHeart, 
  Target, 
  Users, 
  Brain, 
  Shield,
  Sparkles,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "AI Creation Studio",
    description: "Generate stunning visuals from your mood and imagination. Our AI understands your emotions and creates art that resonates.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BookHeart,
    title: "Emotional Journal",
    description: "A therapy-style digital journal where AI guides you with reflective questions and calming visuals.",
    gradient: "from-pink-500 to-orange-400",
  },
  {
    icon: Target,
    title: "DreamBoard",
    description: "Build visual goal boards with AI-generated imagery. Track your emotional growth and manifest your dreams.",
    gradient: "from-teal-400 to-emerald-500",
  },
  {
    icon: Users,
    title: "Community Feed",
    description: "Connect with fellow dreamers. Share your creations, discover inspiration, and build meaningful connections.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: Brain,
    title: "Mood Intelligence",
    description: "Our AI learns your emotional patterns and personalizes your entire experience based on how you feel.",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Private Sanctuary",
    description: "Your emotional space, your rules. Full control over privacy with encrypted, secure content.",
    gradient: "from-emerald-400 to-teal-500",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-medium">
              Features
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="text-gradient-aurora"> Dream Big</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete creative ecosystem designed around your emotional wellbeing
            and self-expression.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 h-full border border-white/10 hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
