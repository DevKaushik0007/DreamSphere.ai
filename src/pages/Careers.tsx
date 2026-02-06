import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import {
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Heart,
  Zap,
  Coffee,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMemo } from "react";

/* -----------------------------
   Types
----------------------------- */
interface Perk {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
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
const Careers = () => {
  const perks: Perk[] = useMemo(
    () => [
      { icon: Heart, title: "Health & Wellness", description: "Comprehensive health coverage" },
      { icon: Zap, title: "Remote First", description: "Work from anywhere in the world" },
      { icon: Coffee, title: "Unlimited PTO", description: "Take the time you need" },
      { icon: Sparkles, title: "Equity", description: "Own a piece of the dream" },
    ],
    []
  );

  const jobs: Job[] = useMemo(
    () => [
      {
        id: "senior-frontend-engineer",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description:
          "Build beautiful, performant interfaces for our dream visualization platform.",
      },
      {
        id: "ai-ml-engineer",
        title: "AI/ML Engineer",
        department: "AI",
        location: "Remote",
        type: "Full-time",
        description:
          "Develop and improve our AI models for image generation and personalization.",
      },
      {
        id: "product-designer",
        title: "Product Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        description:
          "Design intuitive experiences that help users visualize and achieve their dreams.",
      },
      {
        id: "community-manager",
        title: "Community Manager",
        department: "Community",
        location: "Remote",
        type: "Full-time",
        description:
          "Build and nurture our growing community of dreamers worldwide.",
      },
      {
        id: "backend-engineer",
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description:
          "Scale our infrastructure to support millions of dreamers.",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Careers</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Join the Dream Team
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              We're on a mission to help millions of people visualize and achieve their dreams.
              Want to be part of something magical?
            </p>
          </motion.div>

          {/* Perks */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif font-semibold text-center mb-8">
              Why Join Us?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {perks.map((perk, index) => (
                <div key={index} className="glass-card p-6 rounded-xl text-center">
                  <perk.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Open Positions */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-serif font-semibold text-center mb-8">
              Open Positions
            </h2>

            <div className="space-y-4 max-w-3xl mx-auto">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/careers/${job.id}`}
                  className="block"
                >
                  <div className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all cursor-pointer group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      >
                        Apply <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="text-center mt-16 glass-card p-8 rounded-2xl max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-serif font-semibold mb-4">
              Don't see the right role?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented people. Send us your resume and
              tell us how you'd like to contribute.
            </p>

            <Button className="glow-primary">
              Send Open Application
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
