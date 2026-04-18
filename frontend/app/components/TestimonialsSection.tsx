"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Principal, Westfield Academy",
    avatar: "SJ",
    rating: 5,
    content: "The accuracy is incredible and students love how quick it is. No more paper registers!",
    company: "Westfield Academy"
  },
  {
    name: "Prof. Michael Chen",
    role: "Head of IT, Tech University",
    avatar: "MC",
    rating: 5,
    content: "Implementation was seamless. Our attendance rates have improved by 40% since deployment.",
    company: "Tech University"
  },
  {
    name: "Lisa Rodriguez",
    role: "Administrative Manager",
    avatar: "LR",
    rating: 5,
    content: "The real-time analytics and reporting features are outstanding. Patterns are clear now.",
    company: "Central High School"
  }
];

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="relative">
      <div className="text-center mb-20 space-y-4">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary font-black tracking-[0.2em] uppercase text-xs"
        >
          Institutional Success
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black font-outfit text-gradient"
        >
          Voices of Innovation
        </motion.h2>
      </div>

      <div className="max-w-5xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="glass-card rounded-[2.5rem] p-10 sm:p-20 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              {/* Author Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-primary/20 flex items-center justify-center text-primary text-4xl font-black font-outfit shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="absolute -bottom-4 -right-4 p-3 glass rounded-2xl text-primary shadow-xl">
                  <Quote className="w-6 h-6 fill-current" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow space-y-8">
                <div className="flex gap-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>

                <p className="text-2xl sm:text-3xl font-bold font-outfit text-foreground leading-[1.4]">
                  &quot;{testimonials[activeTestimonial].content}&quot;
                </p>

                <div>
                  <h4 className="text-xl font-black text-foreground">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-muted-foreground font-bold text-sm tracking-wide">{testimonials[activeTestimonial].role} @ {testimonials[activeTestimonial].company}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 hidden md:block">
          <button 
            onClick={prevTestimonial}
            className="p-4 glass rounded-2xl hover:bg-white/10 transition-all text-primary border border-white/5 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 hidden md:block">
          <button 
            onClick={nextTestimonial}
            className="p-4 glass rounded-2xl hover:bg-white/10 transition-all text-primary border border-white/5 active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`h-2 transition-all duration-500 rounded-full ${i === activeTestimonial ? "w-12 bg-primary" : "w-2 bg-white/10"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}