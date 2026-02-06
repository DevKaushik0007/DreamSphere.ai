import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, Heart, Users, Zap, Target, Globe } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Empathy First",
      description: "We believe in understanding and supporting every dreamer's unique journey."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Pushing boundaries with AI to create magical experiences."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building meaningful connections between dreamers worldwide."
    },
    {
      icon: Target,
      title: "Purpose",
      description: "Every feature we build serves to help you achieve your dreams."
    }
  ];

  const team = [
    { name: "Alex Chen", role: "CEO & Founder", emoji: "👨‍💻" },
    { name: "Sarah Johnson", role: "CTO", emoji: "👩‍💻" },
    { name: "Mike Williams", role: "Head of AI", emoji: "🤖" },
    { name: "Emily Davis", role: "Head of Design", emoji: "🎨" }
  ];

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Where Dreams Meet Reality
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              DreamSphere.AI was born from a simple idea: what if we could use AI to help people 
              visualize, track, and achieve their dreams? Today, we're building the future of 
              personal growth and creative expression.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-12 rounded-2xl mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-serif font-semibold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To empower every individual to explore their creativity, connect with like-minded 
              dreamers, and turn their aspirations into reality through the power of AI. We believe 
              that everyone has a dream worth pursuing, and we're here to help make that journey 
              beautiful and achievable.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif font-semibold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="glass-card p-6 rounded-xl text-center">
                  <value.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-serif font-semibold text-center mb-8">Meet the Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="glass-card p-6 rounded-xl text-center">
                  <div className="text-5xl mb-4">{member.emoji}</div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
