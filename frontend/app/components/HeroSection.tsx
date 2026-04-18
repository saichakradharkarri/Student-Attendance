"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Camera, Shield, Clock, Zap, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = ["Real-time Recognition", "Enterprise Bio-Security", "Instant Integration", "99.9% Precision"];
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left Content */}
          <div className="space-y-10">
            {/* Premium Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-primary border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">AttendEase Bio-Metric Engine</span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-6">
              <motion.h1 
                variants={itemVariants}
                className="text-6xl sm:text-7xl lg:text-8xl font-black font-outfit leading-[1.1] tracking-tight"
              >
                <span className="text-gradient">The Future</span>
                <br />
                <span className="text-primary relative inline-block">
                  of Presence
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 1, ease: "circOut" }}
                    className="absolute -bottom-2 left-0 w-full h-2 bg-primary/30 rounded-full origin-left"
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-medium"
              >
                Automate attendance with military-grade 
                <span className="text-foreground"> face recognition</span>. 
                Experience a system that works as fast as you do.
              </motion.p>
            </div>

            {/* Dynamic Feature Display */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative glass-card rounded-2xl p-6 flex items-center gap-6">
                <div className="p-4 bg-primary/10 rounded-xl text-primary">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 mb-1">Actively Analyzing</p>
                  <p className="text-2xl font-black font-outfit text-foreground tracking-tight">
                    {features[currentFeature]}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/signup"
                className="group relative px-8 py-5 bg-primary rounded-2xl flex items-center justify-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="text-lg font-black text-white relative z-10 transition-transform group-hover:-translate-x-1">Start Free Now</span>
                <ArrowRight className="w-6 h-6 text-white relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/signin"
                className="px-8 py-5 glass border-white/5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg text-foreground hover:bg-white/5 transition-all"
              >
                <Camera className="w-6 h-6 text-primary" />
                Live Demo
              </Link>
            </motion.div>
          </div>

          {/* Right Visual Element */}
          <motion.div 
            variants={itemVariants}
            className="relative lg:h-[700px] flex items-center justify-center"
          >
            {/* Main Visual Composition */}
            <div className="relative w-full aspect-square max-w-[500px]">
              {/* Floating Stat Card 1 */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 -right-4 z-20 glass-card p-5 rounded-2xl border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground/60">System Security</p>
                    <p className="text-lg font-black text-emerald-400 font-outfit leading-none mt-1">100% Secure</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stat Card 2 */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 -left-10 z-20 glass-card p-5 rounded-2xl border-white/10 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground/60">Response Time</p>
                    <p className="text-lg font-black text-primary font-outfit leading-none mt-1">&lt; 200ms</p>
                  </div>
                </div>
              </motion.div>

              {/* Central AI Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[300px] h-[300px]">
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-[-20px] border border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  
                  {/* Glowing Core */}
                  <div className="absolute inset-4 bg-primary/5 rounded-full flex items-center justify-center backdrop-blur-3xl overflow-hidden shadow-[inset_0_0_50px_rgba(139,92,246,0.3)]">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-10 bg-primary rounded-full blur-[60px]"
                    />
                    <Camera className="w-32 h-32 text-primary drop-shadow-[0_0_20px_rgba(139,92,246,0.8)] relative z-10" />
                  </div>
                </div>
              </div>

              {/* Orbiting Points */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-12 border-2 border-white/10 rounded-full flex items-start justify-center p-2">
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}