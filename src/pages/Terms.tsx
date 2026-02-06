import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using DreamSphere.AI, you agree to be bound by these Terms of Service 
      and all applicable laws and regulations. If you do not agree with any of these terms, you are 
      prohibited from using or accessing this site.`
    },
    {
      title: "Use License",
      content: `Permission is granted to temporarily access and use DreamSphere.AI for personal, 
      non-commercial purposes. This license does not include:
      • Modifying or copying the materials
      • Using the materials for commercial purposes
      • Attempting to reverse engineer any software
      • Removing any copyright or proprietary notations
      • Transferring the materials to another person`
    },
    {
      title: "User Accounts",
      content: `When you create an account with us, you must provide accurate and complete information. 
      You are responsible for:
      • Maintaining the security of your account
      • All activities that occur under your account
      • Notifying us immediately of any unauthorized use`
    },
    {
      title: "User Content",
      content: `You retain ownership of content you create on DreamSphere.AI. By posting content, 
      you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute 
      your content in connection with our services. You are responsible for ensuring your content 
      does not violate any laws or third-party rights.`
    },
    {
      title: "Prohibited Activities",
      content: `You may not use our services to:
      • Violate any applicable laws or regulations
      • Infringe on the rights of others
      • Upload malicious code or attempt to hack our systems
      • Harass, abuse, or harm other users
      • Create fake accounts or impersonate others
      • Scrape or collect user data without permission`
    },
    {
      title: "AI-Generated Content",
      content: `Our AI features generate content based on your inputs. While we strive for accuracy, 
      we do not guarantee that AI-generated content will be accurate, appropriate, or suitable for 
      any particular purpose. You are responsible for reviewing and using AI-generated content 
      appropriately.`
    },
    {
      title: "Intellectual Property",
      content: `DreamSphere.AI and its original content, features, and functionality are owned by 
      DreamSphere.AI and are protected by international copyright, trademark, patent, trade secret, 
      and other intellectual property laws.`
    },
    {
      title: "Limitation of Liability",
      content: `DreamSphere.AI shall not be liable for any indirect, incidental, special, consequential, 
      or punitive damages resulting from your use of or inability to use the service. Our total 
      liability shall not exceed the amount you paid us in the past twelve months.`
    },
    {
      title: "Termination",
      content: `We may terminate or suspend your account and access to our services immediately, 
      without prior notice, for conduct that we believe violates these Terms or is harmful to other 
      users, us, or third parties.`
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right to modify these terms at any time. We will notify users of any 
      material changes. Your continued use of the service after such modifications constitutes 
      acceptance of the updated terms.`
    }
  ];

  return (
    <div className="min-h-screen relative">
      <BackgroundOrbs />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Terms of Service</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-2xl mb-8"
          >
            <p className="text-muted-foreground leading-relaxed">
              Welcome to DreamSphere.AI. These Terms of Service govern your use of our website, 
              products, and services. Please read these terms carefully before using our platform.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card p-6 rounded-xl"
              >
                <h2 className="text-lg font-serif font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-8 rounded-2xl mt-8 text-center"
          >
            <h3 className="font-serif font-semibold mb-4">Questions?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <a href="mailto:legal@dreamsphere.ai" className="text-primary hover:underline">
              legal@dreamsphere.ai
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
