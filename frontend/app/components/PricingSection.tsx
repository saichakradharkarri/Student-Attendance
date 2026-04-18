"use client";

import { Check, Star, Zap, Shield, Users, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Ideal for small programs",
      monthlyPrice: 49,
      annualPrice: 39,
      icon: <Users className="w-6 h-6" />,
      popular: false,
      features: [
        "Up to 100 students",
        "Standard Recognition",
        "Mobile App Access",
        "Email Support"
      ]
    },
    {
      name: "Professional",
      description: "Best for growing labs",
      monthlyPrice: 99,
      annualPrice: 79,
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      features: [
        "Up to 500 students",
        "Advanced AI Engine",
        "Real-time Analytics",
        "Priority Support",
        "Full API Access"
      ]
    },
    {
      name: "Enterprise",
      description: "Unlimited institutional scale",
      monthlyPrice: 199,
      annualPrice: 159,
      icon: <Shield className="w-6 h-6" />,
      popular: false,
      features: [
        "Unlimited students",
        "Multi-campus support",
        "Custom SLAM Support",
        "Dedicated Manager",
        "Zero-Lag Guarantee"
      ]
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

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-20 space-y-4">
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="px-4 py-1.5 glass rounded-full text-xs font-black uppercase tracking-widest text-primary border border-primary/20"
        >
          Investment Options
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black font-outfit text-gradient"
        >
          Institutional Scale Pricing
        </motion.h2>
        
        {/* Toggle */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center justify-center pt-8"
        >
          <div className="p-1 glass rounded-2xl flex items-center gap-1 border border-white/5">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
                !isAnnual ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                isAnnual ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={itemVariants}
            className={`group relative ${plan.popular ? "md:-translate-y-4" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                <div className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2">
                  <Star className="w-3 h-3 fill-current" />
                  Most Advanced
                </div>
              </div>
            )}
            
            <div className={`h-full glass-card rounded-3xl p-8 flex flex-col transition-all duration-500 border border-white/5 hover:border-primary/30 ${plan.popular ? "shadow-[0_0_40px_rgba(139,92,246,0.1)]" : ""}`}>
              <div className="mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit mb-6">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-black font-outfit mb-2 tracking-tight">{plan.name}</h3>
                <p className="text-muted-foreground text-sm font-medium">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black font-outfit text-white tracking-tight">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground font-bold">/m</span>
                </div>
                {isAnnual && (
                  <p className="mt-2 text-primary font-black text-xs uppercase tracking-wider">billed annually</p>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 group/feature">
                    <div className="p-1 rounded-full bg-primary/20 text-primary group-hover/feature:bg-primary group-hover/feature:text-white transition-colors">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground group-hover/feature:text-foreground transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all ${
                  plan.popular 
                    ? "bg-primary text-white hover:shadow-lg hover:shadow-primary/20 hover:scale-105" 
                    : "glass border-white/5 text-foreground hover:bg-white/5"
                }`}
              >
                {plan.popular ? "Secure Access Now" : "Get Started"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-16 text-center space-y-6"
      >
        <p className="text-muted-foreground/60 text-sm font-medium flex items-center justify-center gap-4">
          <Shield className="w-4 h-4" />
          Enterprise-ready. SOC2 Compliant. GDPR Ready.
        </p>
        <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale contrast-125">
          <span className="font-outfit font-black text-2xl">ACME UNIV</span>
          <span className="font-outfit font-black text-2xl">TECH INST</span>
          <span className="font-outfit font-black text-2xl">EDU FLOW</span>
          <span className="font-outfit font-black text-2xl">GLOBAL ACAD</span>
        </div>
      </motion.div>
    </div>
  );
}