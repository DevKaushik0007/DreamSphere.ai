import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

/* -----------------------------
   Types
----------------------------- */
interface JobDetail {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
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
const CareerDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();

  /* Static job data (replace with API later) */
  const jobs: JobDetail[] = useMemo(
    () => [
      {
        id: "senior-frontend-engineer",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description:
          "As a Senior Frontend Engineer, you will build high-quality, scalable interfaces for DreamSphere using modern web technologies.",
        responsibilities: [
          "Develop responsive and accessible UI components",
          "Collaborate with designers and backend engineers",
          "Optimize applications for performance",
          "Maintain clean and reusable code",
        ],
        requirements: [
          "Strong experience with React and TypeScript",
          "Solid understanding of modern CSS and UI patterns",
          "Experience with REST APIs",
          "Good problem-solving skills",
        ],
      },
      {
        id: "backend-engineer",
        title: "Backend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description:
          "You will design and scale backend services that power DreamSphere’s core features.",
        responsibilities: [
          "Build RESTful APIs using Node.js",
          "Design scalable database schemas",
          "Ensure application security and performance",
          "Collaborate with frontend engineers",
        ],
        requirements: [
          "Experience with Node.js and Express",
          "Knowledge of MongoDB or similar databases",
          "Understanding of authentication systems (JWT)",
          "Familiarity with cloud deployment",
        ],
      },
      {
        id: "ai-ml-engineer",
        title: "AI/ML Engineer",
        department: "AI",
        location: "Remote",
        type: "Full-time",
        description:
          "Work on intelligent systems that personalize dream insights and visualizations.",
        responsibilities: [
          "Develop and improve ML models",
          "Analyze user data for personalization",
          "Integrate AI models into production systems",
        ],
        requirements: [
          "Strong background in machine learning",
          "Experience with Python and ML libraries",
          "Understanding of data pipelines",
        ],
      },
    ],
    []
  );

  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Job not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back */}
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.type}
              </span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 rounded-2xl mb-8"
          >
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </motion.div>

          {/* Responsibilities */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-8 rounded-2xl mb-8"
          >
            <h2 className="text-xl font-serif font-semibold mb-4">
              Responsibilities
            </h2>

            <ul className="space-y-2">
              {job.responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-primary mt-1" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Requirements */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="glass-card p-6 md:p-8 rounded-2xl mb-8"
          >
            <h2 className="text-xl font-serif font-semibold mb-4">
              Requirements
            </h2>

            <ul className="space-y-2">
              {job.requirements.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-primary mt-1" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Apply */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="text-center glass-card p-8 rounded-2xl"
          >
            <h3 className="text-xl font-serif font-semibold mb-4">
              Ready to apply?
            </h3>
            <p className="text-muted-foreground mb-6">
              Send us your resume and let us know why you’d be a great fit.
            </p>

            <Button
              className="glow-primary"
              asChild
            >
              <a href="mailto:careers@dreamsphere.ai">
                Apply Now
              </a>
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerDetail;
