"use client";

import { motion, Variants } from "framer-motion";
import { Mail, Phone, MapPin, Send, Globe } from "lucide-react";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "circOut" }
  }
};

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for backend
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, title: "Email", detail: "saichakradharkarri@gmail.com" },
    { icon: <Phone className="w-5 h-5" />, title: "Phone", detail: "+91-7981318144" },
    { icon: <MapPin className="w-5 h-5" />, title: "Location", detail: "Kakinada, Andhra Pradesh" }
  ];

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 gap-20">
        {/* Left Side: Intel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs">Direct Interface</span>
            <h2 className="text-4xl sm:text-6xl font-black font-outfit text-gradient leading-[1.1]">
              Initiate Deployment Protocol.
            </h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-md">
              Synchronize with our technical team to architect a custom recognition gateway for your infrastructure.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="flex items-center gap-6 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl glass border border-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{info.title}</h4>
                  <p className="text-foreground font-bold group-hover:text-primary transition-colors">{info.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social / Extra Info */}
          <div className="pt-8 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-muted-foreground/40 text-xs font-black uppercase tracking-widest">
              <Globe className="w-4 h-4" />
              Active Nodes: SF / LON / TYO / BLR
            </div>
            
            {/* Secondary Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-4"
            >
              <img 
                src="/attendease_secondary_logo.png" 
                alt="System Logo" 
                className="h-24 w-auto object-contain rounded-2xl border border-white/5 shadow-2xl glass-card/50 p-2"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side: Data Input */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl"></div>
          <div className="relative glass-card rounded-[2.5rem] p-8 sm:p-12 border border-white/5 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTER FULL NAME"
                    className="w-full glass-input rounded-2xl px-6 py-4 text-foreground font-bold tracking-wide placeholder:text-muted-foreground/30 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Neural Address</label>
                  <input
                    type="email"
                    required
                    placeholder="EMAIL@INSTITUTE.EDU"
                    className="w-full glass-input rounded-2xl px-6 py-4 text-foreground font-bold tracking-wide placeholder:text-muted-foreground/30 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-4">Encrypted Memo</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="BRIEF YOUR REQUIREMENTS..."
                    className="w-full glass-input rounded-2xl px-6 py-4 text-foreground font-bold tracking-wide placeholder:text-muted-foreground/30 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
                ESTABLISH CONNECTION
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
