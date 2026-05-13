'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Share2, Send, Camera, Briefcase, Heart, ShieldCheck, Cpu, Globe, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] relative pt-24 pb-12 overflow-hidden">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      {/* Background Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & AI Status */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-black border border-primary/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                <span className="font-orbitron font-black text-2xl text-white relative z-10">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-black text-2xl tracking-tighter text-white metallic-text">KALYAN</span>
                <span className="text-[11px] uppercase font-space font-bold text-primary tracking-[0.4em] -mt-1">Robotic Hospital</span>
              </div>
            </Link>
            
            <p className="font-inter text-sm text-white/70 leading-relaxed max-w-xs">
              Redefining orthopedic excellence through quantum-grade robotic precision and AI-driven surgical mapping.
            </p>

            <div className="glassmorphism p-4 rounded-xl border border-white/5 inline-block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-orbitron font-bold text-white uppercase tracking-widest">AI Core Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-primary" />
                <span className="text-xs text-primary font-space font-black uppercase tracking-widest">Operational | v4.2.0</span>
              </div>
            </div>
          </div>

          {/* Cyber Navigation */}
          <div>
            <h4 className="font-orbitron font-bold text-white uppercase tracking-[0.3em] text-xs mb-10 metallic-text">System Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: 'AI Technology', href: '#technology' },
                { name: 'Robotic Benefits', href: '#benefits' },
                { name: 'Cyber Surgeons', href: '#doctors' },
                { name: 'Patient Portal', href: '#testimonials' },
                { name: 'Consultation', href: '#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all">
                    <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                    <span className="font-space font-bold uppercase tracking-widest">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Node */}
          <div>
            <h4 className="font-orbitron font-bold text-white uppercase tracking-[0.3em] text-xs mb-10 metallic-text">Contact Node</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/10">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs uppercase text-white/60 tracking-widest mb-1 font-bold">Location</p>
                  <p className="text-sm text-white/60 font-inter">G.T. Road, Ludhiana,<br />Punjab, India - 141001</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/10">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs uppercase text-white/60 tracking-widest mb-1 font-bold">24/7 Hotline</p>
                  <p className="text-sm text-white/60 font-orbitron font-bold">+91 98765-43210</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quantum Newsletter */}
          <div>
            <h4 className="font-orbitron font-bold text-white uppercase tracking-[0.3em] text-xs mb-10 metallic-text">Neural Updates</h4>
            <p className="text-sm text-white/70 mb-6 font-inter">Subscribe to receive real-time updates on AI medical advancements.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Secure Email Access" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white outline-none focus:border-primary/50 transition-all font-inter pr-14"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                <Send size={18} />
              </button>
            </div>
            
            <div className="flex gap-4 mt-8">
              {[
                { icon: <Share2 size={18} />, href: '#' },
                { icon: <Send size={18} />, href: '#' },
                { icon: <Camera size={18} />, href: '#' },
                { icon: <Briefcase size={18} />, href: '#' }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 glassmorphism rounded-lg flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-all border border-white/5"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 font-bold">
              © 2026 KALYAN ROBOTIC HOSPITAL. SYSTEM STATUS: <span className="text-green-500/50">ENCRYPTED</span>
            </p>
            <Link href="#" className="text-[11px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors font-bold">Privacy Protocol</Link>
            <Link href="#" className="text-[11px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors font-bold">Legal Terms</Link>
          </div>
          
          <div className="flex items-center gap-3 glassmorphism px-4 py-2 rounded-full border border-white/5">
            <Globe size={12} className="text-primary animate-spin-slow" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/70 font-black">Punjab's Future of Healthcare</span>
          </div>
        </div>
      </div>

      {/* Decorative Scan Line Animation */}
      <motion.div 
        animate={{ left: ['-100%', '100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />
    </footer>
  );
};

export default Footer;
