'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Activity, Cpu, Target, PhoneCall, Whatsapp, ChatBubble, ChartArea, MessageCircle } from 'lucide-react';
import Image from 'next/image';

const particlePositions = [
  { left: '10%', delay: 0 }, { left: '20%', delay: 2 }, { left: '30%', delay: 4 },
  { left: '40%', delay: 1 }, { left: '50%', delay: 3 }, { left: '60%', delay: 5 },
  { left: '70%', delay: 0.5 }, { left: '80%', delay: 2.5 }, { left: '90%', delay: 4.5 },
  { left: '15%', delay: 1.5 }, { left: '25%', delay: 3.5 }, { left: '35%', delay: 5.5 },
  { left: '45%', delay: 0.2 }, { left: '55%', delay: 2.2 }, { left: '65%', delay: 4.2 },
  { left: '75%', delay: 1.2 }, { left: '85%', delay: 3.2 }, { left: '95%', delay: 5.2 },
  { left: '5%', delay: 0.8 }, { left: '98%', delay: 3.8 }
];

const Hero = () => {
  return (
    <section className="relative min-h-screen py-16 md:py-24 flex items-center pt-24 md:pt-20 overflow-hidden bg-[#00000]">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-[url('/kalyan_Images/MISSO_4.jpg')] bg-contain bg-center bg-no-repeat opacity-40 scale-110"
        style={{ filter: 'grayscale(100%) brightness(1)' }}
      ></div>

      {/* Advanced Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>

      {/* Floating Particle System */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 1000 }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [null, -200],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: pos.delay
          }}
          className="absolute w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"
          style={{ left: pos.left, top: '100%' }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10 flex justify-center text-center">
        {/* Text Content */}
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
              <span className="text-white text-[10px] md:text-sm">
                INDIA'S FIRST AI-POWERED ROBOTIC SURGERY CENTER
              </span>
            </div>

            <h1 className="font-orbitron text-3xl sm:text-5xl md:text-7xl font-black leading-[1.2] md:leading-[1.3] mb-6 md:mb-8 tracking-tighter bg-gradient-to-r from-white via-gray-100 to-[#ff0033] bg-clip-text text-transparent">
              India's Future Of <br />
              <span className="text-[#ff0033] font-orbitron drop-shadow-[0_0_20px_rgba(255,0,51,0.6)] md:drop-shadow-[0_0_30px_rgba(255,0,51,0.8)]">Ai Robotic Knee Replacement</span>
            </h1>

            <p className="font-inter text-base md:text-lg text-white/80 mb-8 md:text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Experience precision-led healing with India’s most advanced AI-integrated surgical systems, ensuring sub-millimeter accuracy and personalized joint alignment for life-long mobility.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              <a href="/book-appointment" className="btn-primary group !px-10 !py-4 text-sm">
                <span className='text-white text-[14px]'>Book AI CONSULTATION</span>
                <ArrowRight className="group-hover:translate-x-3 transition-transform" />
              </a>
              <a href="tel:+919915048877" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 glassmorphism border-3 border-[#ff0033] rounded-lg hover:scale-105 transition-all font-outfit font-black uppercase tracking-[0.3em] text-white hover:bg-white/5 hover:border-primary/50 transition-all text-[10px] flex gap-2 items-center">
                <span className='text-white text-[14px]'>Talk to Expert</span>
              </a>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-20 max-w-8xl mx-auto border-t border-white/10 pt-10">
              {[
                { val: "5,000+", label: "AI-Assisted Surgeries" },
                { val: "99.2%", label: "Success Rate" },
                { val: "2-3 Days", label: "Average Recovery" }
              ].map((stat, i) => (
                <div key={i} className="glassmorphism border-1 border-[#ff0033] py-4 md:py-6 px-2 text-white flex flex-col items-center hover:scale-105 hover:border-[#ff0033] hover:shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-all duration-300">
                  <span className="text-3xl md:text-4xl font-orbitron font-black text-[#ff0033] tracking-[0.1em]">{stat.val}</span>
                  <span className="text-[10px] md:text-[9px] uppercase tracking-[0.4em] font-black mt-2">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
