import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      title: "Introducing AI-Powered Dream Visualization",
      excerpt: "Discover how our new AI features can help you visualize your dreams like never before.",
      date: "Jan 10, 2025",
      readTime: "5 min read",
      category: "Product",
      emoji: "🎨"
    },
    {
      title: "The Science Behind Dream Tracking",
      excerpt: "Learn about the psychology and benefits of tracking your dreams and aspirations.",
      date: "Jan 8, 2025",
      readTime: "8 min read",
      category: "Research",
      emoji: "🧠"
    },
    {
      title: "Building a Community of Dreamers",
      excerpt: "How DreamSphere.AI is creating meaningful connections between like-minded individuals.",
      date: "Jan 5, 2025",
      readTime: "4 min read",
      category: "Community",
      emoji: "🤝"
    },
    {
      title: "Tips for Setting Achievable Goals",
      excerpt: "Practical advice on how to set and achieve your personal and professional goals.",
      date: "Jan 3, 2025",
      readTime: "6 min read",
      category: "Tips",
      emoji: "🎯"
    },
    {
      title: "Our 2025 Roadmap: What's Coming Next",
      excerpt: "A sneak peek into the exciting features and improvements we're planning for this year.",
      date: "Jan 1, 2025",
      readTime: "7 min read",
      category: "Updates",
      emoji: "🚀"
    },
    {
      title: "How Mood Tracking Improves Well-being",
      excerpt: "Understanding the connection between mood awareness and personal growth.",
      date: "Dec 28, 2024",
      readTime: "5 min read",
      category: "Wellness",
      emoji: "💫"
    }
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
              <span className="text-sm text-primary">Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Insights & Stories
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our latest thoughts on AI, creativity, personal growth, and the 
              future of dream visualization.
            </p>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-6xl">{post.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
