import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, 
      use our services, or communicate with us. This includes:
      • Account information (name, email, password)
      • Profile information (avatar, bio, interests)
      • Content you create (dreams, journal entries, generated images)
      • Communications with us`
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:
      • Provide, maintain, and improve our services
      • Personalize your experience
      • Process transactions and send related information
      • Send you technical notices and support messages
      • Respond to your comments and questions`
    },
    {
      title: "Information Sharing",
      content: `We do not sell your personal information. We may share your information in the following circumstances:
      • With your consent or at your direction
      • With service providers who assist in our operations
      • To comply with legal obligations
      • To protect our rights and the safety of others`
    },
    {
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal 
      information against unauthorized access, alteration, disclosure, or destruction. This includes 
      encryption, secure servers, and regular security assessments.`
    },
    {
      title: "Your Rights",
      content: `You have the right to:
      • Access your personal information
      • Correct inaccurate data
      • Delete your account and data
      • Export your data
      • Opt out of marketing communications`
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar technologies to enhance your experience, analyze usage, 
      and deliver personalized content. You can control cookie preferences through your browser settings.`
    },
    {
      title: "Children's Privacy",
      content: `Our services are not intended for children under 13. We do not knowingly collect 
      personal information from children under 13. If we learn we have collected such information, 
      we will delete it promptly.`
    },
    {
      title: "Changes to This Policy",
      content: `We may update this privacy policy from time to time. We will notify you of any 
      material changes by posting the new policy on this page and updating the "Last Updated" date.`
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
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Your Privacy Matters
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
              At DreamSphere.AI, we are committed to protecting your privacy and ensuring the 
              security of your personal information. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our services.
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
            transition={{ delay: 0.5 }}
            className="glass-card p-8 rounded-2xl mt-8 text-center"
          >
            <h3 className="font-serif font-semibold mb-4">Questions About Privacy?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <a href="mailto:privacy@dreamsphere.ai" className="text-primary hover:underline">
              privacy@dreamsphere.ai
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
