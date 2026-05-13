'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Send, Cpu, Globe, MapPin, Phone, Share2, Camera, Play } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] relative pt-24 pb-6 overflow-hidden">
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
              <div className="relative w-16 h-16 transition-all duration-500 overflow-hidden">
                <Image 
                  src="/logo/kalyan-2.png" 
                  alt="Kalyan Robotic Hospital Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-black text-2xl tracking-tighter text-white metallic-text">KALYAN</span>
                <span className="text-[11px] uppercase font-space font-bold text-primary tracking-[0.4em] -mt-1">Robotic Hospital</span>
              </div>
            </Link>
            
            <p className="font-inter text-sm text-white/70 leading-relaxed max-w-xs">
              Kalyan Hospital is India’s premier destination for AI-powered orthopedics, offering world-class robotic knee replacements led by the renowned Dr. Rajinder Singh.
            </p>
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
                  <p className="text-sm text-white/60 font-inter">B-6/1153, Taj Ganj, Samrala Road,<br />Ludhiana, Punjab - 141008</p>
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
            <h4 className="font-orbitron font-bold text-white uppercase tracking-[0.3em] text-xs mb-10 metallic-text">Social Links</h4>
            
        
            <div className="flex gap-4 mt-8 flex-wrap">
              {[
                { 
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  ), 
                  href: 'https://www.facebook.com/kalyanhospitalludhiana/', 
                  label: 'Facebook' 
                },
                { 
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  ), 
                  href: 'https://www.instagram.com/kalyanhospitalludhiana/', 
                  label: 'Instagram' 
                },
                { 
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z"/>
                      <path d="m10 15 5-3-5-3z"/>
                    </svg>
                  ), 
                  href: 'https://www.youtube.com/channel/UCJc7TIqstFWlLXPZnYr5eoA?view_as=subscriber', 
                  label: 'YouTube' 
                }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 glassmorphism rounded-lg flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-all border border-white/5"
                  title={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex mx-auto flex-col md:flex-row justify-around items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/50 font-bold">
              © 2026 KALYAN ROBOTIC HOSPITAL.
            </p>

          </div>

          <div className="flex items-center gap-3 glassmorphism px-4 py-2 rounded-full border border-white/5">
            <Globe size={12} className="text-primary animate-spin-slow" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/70 font-black">India's Future of Healthcare</span>
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
