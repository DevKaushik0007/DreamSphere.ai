import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  await fetch("http://localhost:5000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  toast({
    title: "Message sent! ✨",
    description: "We'll get back to you as soon as possible.",
  });

  setFormData({ name: "", email: "", subject: "", message: "" });
  setIsSubmitting(false);
};


  const contactInfo = [
    { icon: Mail, title: "Email", value: "hello@dreamsphere.ai" },
    { icon: MessageSquare, title: "Support", value: "support@dreamsphere.ai" },
    { icon: MapPin, title: "Location", value: "India" }
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
              <span className="text-sm text-primary">Contact</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gradient-aurora">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, feedback, or just want to say hi? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-xl font-serif font-semibold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    required
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more..."
                    rows={5}
                    required
                    className="bg-background/50 resize-none"
                  />
                </div>
                <Button type="submit" className="w-full glow-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-serif font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{info.title}</h3>
                        <p className="text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-xl font-serif font-semibold mb-4">FAQ</h2>
                <p className="text-muted-foreground mb-4">
                  Looking for quick answers? Check out our frequently asked questions.
                </p>
                <Button variant="outline" className="w-full">
                  View FAQ
                </Button>
              </div>

              <div className="glass-card p-8 rounded-2xl text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Need immediate help? Chat with our support team.
                </p>
                <Button variant="secondary" size="sm">
                  Start Chat
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
