"use client";

import { motion, Variants } from "framer-motion";
import { Code, Shield, Users, Award } from "lucide-react";

const highlights = [
  {
    icon: <Code className="w-5 h-5" />,
    title: "Neural Architecture",
    description: "Multi-layered CNN optimized for real-time facial feature extraction."
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Zero-Trust Security",
    description: "End-to-end encryption for biometric data with periodic key rotation."
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Global Scale",
    description: "Engineered to support millions of concurrent identity verifications."
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Ethical AI",
    description: "Strict adherence to privacy protocols and unbiased recognition models."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "circOut" }
  }
};

export default function AboutSection() {
  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Manifest */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Technological Manifest</span>
            <h2 className="text-4xl sm:text-6xl font-black font-outfit text-gradient leading-[1.1]">
              Redefining Identity for the Neural Age.
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              We&apos;ve engineered a paradigm shift in biometric identification. By leveraging the latest breakthroughs in 
              <span className="text-foreground"> deep learning </span> and <span className="text-foreground"> high-performance computing</span>, 
              we&apos;ve created a system that isn&apos;t just fast—it&apos;s predictive and secure by design.
            </p>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Our core mission is to bridge the gap between complex neural networks and seamless user experiences, 
              ensuring that security never comes at the cost of friction.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {['Next.js 15', 'Flask Pro', 'Vector DB', 'PyTorch', 'Rust Core'].map((tech) => (
              <div key={tech} className="px-5 py-2 glass rounded-2xl border border-white/5 text-sm font-black text-primary hover:bg-white/5 transition-all cursor-crosshair">
                {tech}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Highlights Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card rounded-[2rem] p-8 border border-white/5 hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h4 className="text-lg font-black font-outfit text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-muted-foreground text-sm font-bold leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Counter (Abstract) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-32 p-1 glass rounded-[3rem] border border-white/5"
      >
        <div className="glass-card rounded-[2.9rem] py-12 px-8 flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="text-center group cursor-default">
            <div className="text-4xl md:text-6xl font-black font-outfit text-gradient mb-2 group-hover:scale-110 transition-transform">99.9%</div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Verification Accuracy</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-4xl md:text-6xl font-black font-outfit text-gradient mb-2 group-hover:scale-110 transition-transform">0.12s</div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Average Latency</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-4xl md:text-6xl font-black font-outfit text-gradient mb-2 group-hover:scale-110 transition-transform">10M+</div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Face Encodings</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
