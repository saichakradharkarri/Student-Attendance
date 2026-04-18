"use client";

import { motion, Variants } from "framer-motion";
import { Camera, Database, Brain, Monitor, Zap } from "lucide-react";

const steps = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Neural Capture",
    description: "High-precision face detection using ultra-fast edge processing.",
    step: "01"
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Vector Encoding",
    description: "Deep learning models transform facial features into 512-dimensional vector math.",
    step: "02"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Secure Vaulting",
    description: "AES-256 encrypted embeddings stored in our secure bio-metric ledger.",
    step: "03"
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "Live Analysis",
    description: "Sub-200ms verification against millions of records with 99.9% accuracy.",
    step: "04"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "circOut" }
  }
};

export default function HowItWorksSection() {
  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-20 space-y-4">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary font-black tracking-[0.2em] uppercase text-xs"
        >
          The Pipeline
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black font-outfit text-gradient"
        >
          Surgical Precision Logic
        </motion.h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
      >
        {/* Connection Line (Desktop) */}
        <div className="hidden lg:block absolute top-[100px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative group"
          >
            {/* Step Card */}
            <div className="flex flex-col items-center">
              {/* Icon / Number Hexagon */}
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-[2rem] rotate-45 group-hover:rotate-90 group-hover:bg-primary group-hover:text-white transition-all duration-700"></div>
                <div className="relative z-10 text-primary group-hover:text-white transition-colors">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 glass rounded-xl flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                  {step.step}
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-black font-outfit text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Visual Continuity Arrow (Mobile/Tablet) */}
            {index < steps.length - 1 && (
              <div className="lg:hidden flex justify-center py-6 text-primary/30">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Integration */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-24 p-8 sm:p-12 glass-card rounded-[3rem] text-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center -space-x-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-xs font-black shadow-xl">
                U{i}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xs font-black text-white shadow-xl">
              +5k
            </div>
          </div>
          <h3 className="text-3xl font-black font-outfit max-w-xl mx-auto">
            Ready to implement the future of identity?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2">
              Get Instant Access
              <Zap className="w-4 h-4 fill-current" />
            </button>
            <button className="px-10 py-4 glass text-foreground font-black rounded-2xl hover:bg-white/5 transition-all border border-white/5">
              Watch Tech Deep-dive
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
