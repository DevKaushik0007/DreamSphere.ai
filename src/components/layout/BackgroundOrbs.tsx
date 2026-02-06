import { motion } from "framer-motion";

export const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - top left */}
      <motion.div
        className="orb orb-primary w-[600px] h-[600px] -top-48 -left-48"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Accent orb - bottom right */}
      <motion.div
        className="orb orb-accent w-[500px] h-[500px] -bottom-32 -right-32"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Secondary orb - center */}
      <motion.div
        className="orb orb-secondary w-[400px] h-[400px] top-1/3 left-1/2 -translate-x-1/2"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Small floating orbs */}
      <motion.div
        className="orb orb-primary w-32 h-32 top-1/4 right-1/4"
        animate={{
          y: [0, -40, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="orb orb-accent w-24 h-24 bottom-1/4 left-1/4"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
};
