"use client";

import { motion, Variants } from "framer-motion";
import { Camera, UserPlus, Shield, BarChart3, Clock, Settings, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Real-time recognition",
    description: "Military-grade facial recognition in under 200ms with industry-leading precision."
  },
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: "Instant Verification",
    description: "Encrypted bio-metric enrollment with automated duplicate detection."
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Neural Analytics",
    description: "Discover attendance patterns and anomalies with our high-speed analytics engine."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bio-Metric Security",
    description: "AES-256 encrypted facial embeddings. Privacy-first architecture by design."
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Zero Latency",
    description: "Engineered for high-traffic environments. 99.8% uptime with global edge nodes."
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: "Seamless Integration",
    description: "Deploy in minutes with our robust SDK and enterprise-ready API endpoints."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function FeaturesSection() {
  return (
    <div className="relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative h-full"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative h-full glass-card rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
              {/* Animated Corner */}
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
              
              <div>
                <div className="p-4 rounded-2xl bg-primary/10 text-primary w-fit mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-black font-outfit text-foreground mb-4 tracking-tight group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                Explore Tech
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

