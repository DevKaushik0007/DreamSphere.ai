import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

/* -----------------------------
   Types
----------------------------- */
interface BlogPost {
  title: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  emoji: string;
  slug: string;
}

/* -----------------------------
   Animation
----------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* -----------------------------
   Component
----------------------------- */
const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  /* Static blog data (can be replaced with API later) */
  const posts: BlogPost[] = useMemo(
    () => [
      {
        title: "Introducing AI-Powered Dream Visualization",
        slug: "ai-powered-dream-visualization",
        emoji: "🎨",
        category: "Product",
        date: "Jan 10, 2025",
        readTime: "5 min read",
        content:
          "Dream visualization powered by AI allows users to transform abstract thoughts into meaningful visuals. By combining machine learning with creativity, DreamSphere helps users better understand their aspirations and emotional patterns.\n\nThis feature empowers users to reflect, track progress, and build clarity around personal goals.",
      },
      {
        title: "The Science Behind Dream Tracking",
        slug: "science-behind-dream-tracking",
        emoji: "🧠",
        category: "Research",
        date: "Jan 8, 2025",
        readTime: "8 min read",
        content:
          "Dream tracking is rooted in cognitive psychology. Writing down dreams improves memory, emotional awareness, and self-reflection.\n\nDreamSphere applies these principles to provide a structured, digital way of understanding recurring themes and mental patterns.",
      },
      {
        title: "Building a Community of Dreamers",
        slug: "building-a-community-of-dreamers",
        emoji: "🤝",
        category: "Community",
        date: "Jan 5, 2025",
        readTime: "4 min read",
        content:
          "A strong community fosters accountability and inspiration. DreamSphere connects users who share similar goals and visions.\n\nThrough shared insights and collaboration, users grow together while pursuing their dreams.",
      },
    ],
    []
  );

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{post.emoji}</span>
              <span className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 rounded-2xl leading-relaxed text-muted-foreground space-y-4"
          >
            {post.content.split("\n\n").map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
