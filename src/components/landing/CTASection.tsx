import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* CTA Card */}
          <div className="glass-card rounded-3xl p-8 md:p-16 text-center border border-white/10 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-50" />
            
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Star className="w-6 h-6 fill-mood-happy text-mood-happy" />
                  </motion.div>
                ))}
              </div>

              <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                Ready to Transform Your
                <span className="text-gradient-aurora"> Creative Journey?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of dreamers who are already creating, sharing, 
                and connecting in a space that truly understands them.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button variant="dream" size="xl" className="group">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/studio">
                  <Button variant="glass" size="xl">
                    Explore AI Studio
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
