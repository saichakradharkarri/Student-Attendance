"use client";

import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  MapPin,
  Camera,
  Zap,
  Globe,
  Github
} from "lucide-react";
import Link from "next/link";


export default function Footer() {
  const footerLinks = {
    intelligence: [
      { name: "Neural Features", href: "#" },
      { name: "Vector Search", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Security Audit", href: "#" }
    ],
    ecosystem: [
      { name: "Whitepapers", href: "#" },
      { name: "Open Source", href: "#" },
      { name: "Community", href: "#" },
      { name: "Global Partners", href: "#" }
    ],
    governance: [
      { name: "Privacy Protocol", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "GDPR Shield", href: "#" },
      { name: "AI Ethics", href: "#" }
    ]
  };

  return (
    <footer className="relative pt-32 pb-12 overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Branding & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-20 pb-20 border-b border-white/5">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black font-outfit text-white tracking-tight">AttendEase</span>
            </div>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-sm">
              Engineering the next generation of biometric infrastructure for global institutions.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <Zap className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-black font-outfit text-white mb-4">Join the Neural Network</h3>
            <p className="text-muted-foreground text-sm font-bold mb-8">Get bi-weekly updates on AI recognition and security protocols.</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="flex-grow glass-input rounded-2xl px-6 py-4 text-xs font-black tracking-widest outline-none border border-white/5 focus:border-primary/50"
              />
              <button className="px-8 py-4 bg-primary text-white font-black text-xs tracking-widest rounded-2xl shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all">
                SYNCHRONIZE
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20">
          <div className="col-span-1 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Location Nodes</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors cursor-default">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-bold">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors cursor-default">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold">Global Distributed</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm font-bold text-muted-foreground hover:text-white hover:translate-x-1 transition-all inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/40 font-black text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span>© 2026 ATTENDEASE SOLUTIONS</span>
            <span>All rights encrypted</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support Node</Link>
            <div className="flex items-center gap-2 text-emerald-500/50">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              SYSTEM NOMINAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}