import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, Cookie } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Cookies = () => {
  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions you take, such as logging in or filling in forms.",
      required: true
    },
    {
      name: "Performance Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.",
      required: false
    },
    {
      name: "Functional Cookies",
      description: "These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.",
      required: false
    },
    {
      name: "Targeting Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant ads on other sites.",
      required: false
    }
  ];

  const sections = [
    {
      title: "What Are Cookies?",
      content: `Cookies are small text files that are placed on your device when you visit a website. 
      They are widely used to make websites work more efficiently, provide a better user experience, 
      and give website owners information about how users interact with their site.`
    },
    {
      title: "How We Use Cookies",
      content: `DreamSphere.AI uses cookies to:
      • Keep you signed in to your account
      • Remember your preferences and settings
      • Understand how you use our website
      • Improve our services based on usage data
      • Provide personalized content and recommendations`
    },
    {
      title: "Third-Party Cookies",
      content: `We may also use cookies from third-party services, such as analytics providers 
      and social media platforms. These cookies are subject to the respective third parties' 
      privacy policies.`
    },
    {
      title: "Managing Cookies",
      content: `You can control and manage cookies in various ways:
      • Browser settings: Most browsers allow you to refuse or accept cookies
      • Cookie preferences: Use our cookie preference center (coming soon)
      • Third-party tools: Various browser extensions can help manage cookies
      
      Note that disabling certain cookies may affect the functionality of our website.`
    },
    {
      title: "Cookie Retention",
      content: `Session cookies are deleted when you close your browser. Persistent cookies 
      remain on your device until they expire or you delete them. The retention period varies 
      depending on the cookie's purpose, ranging from a few hours to several years.`
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
              <Cookie className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Cookie Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Cookie Policy
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
              This Cookie Policy explains how DreamSphere.AI uses cookies and similar technologies 
              to recognize you when you visit our website. It explains what these technologies are, 
              why we use them, and your rights to control our use of them.
            </p>
          </motion.div>

          {/* Cookie Types */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Types of Cookies We Use
            </h2>
            <div className="space-y-4">
              {cookieTypes.map((cookie, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{cookie.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      cookie.required 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {cookie.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cookie.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
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

          {/* Cookie Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 rounded-2xl mt-8 text-center"
          >
            <div className="text-4xl mb-4">🍪</div>
            <h3 className="font-serif font-semibold mb-4">Manage Your Cookie Preferences</h3>
            <p className="text-muted-foreground mb-6">
              You can adjust your cookie preferences at any time using the button below.
            </p>
            <Button className="glow-primary">
              Cookie Settings
            </Button>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-8 rounded-2xl mt-8 text-center"
          >
            <h3 className="font-serif font-semibold mb-4">Questions About Cookies?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our use of cookies, please contact us at:
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

export default Cookies;
