'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Heart, Globe, Cpu, Clock, ArrowRight, Scan, ShieldCheck, Activity, Monitor, Stethoscope } from 'lucide-react';
import Image from 'next/image';

const reasons = [
  {
    icon: <Target className="text-primary" />,
    title: "Sub-Millimeter Precision",
    description: "Our robotic systems eliminate human error, ensuring implant placement accuracy within 0.5mm."
  },
  {
    icon: <Clock className="text-primary" />,
    title: "24h Recovery Protocol",
    description: "Most patients are able to walk and begin physical therapy within 24 hours of the procedure."
  },
  {
    icon: <Cpu className="text-primary" />,
    title: "Smart AI Diagnostics",
    description: "Predictive analytics analyze your specific anatomy to create a personalized surgical plan."
  },
  {
    icon: <Globe className="text-primary" />,
    title: "Global Standards",
    description: "The same robotic technology used in top hospitals in New York, London, and Tokyo."
  }
];

const technology = [
  {
    icon: <Cpu className="text-primary" />,
    title: 'Robotic Surgical Systems', description: 'Advanced robotic arms with 7 degrees of freedom and sub-millimeter precision',
    image: "/technology/robotic-arm.png",
  },
  {
    title: 'AI Precision Mapping', description: 'Real-time 3D imaging and AI-powered anatomical mapping for perfect surgical planning',
    icon: <Scan className="text-primary" />,
    image: "/technology/ai-mapping.png",
  },
  {
    icon: <ShieldCheck className="text-primary" />,
    title: 'Smart Implants', description: 'Next-generation biocompatible implants with optimized wear resistance',
    image: "/technology/smart-implant.png",
  },
  {
    icon: <Activity className="text-primary" />,
    title: 'Digital Diagnostics', description: 'AI-powered diagnostic systems analyzing thousands of patient data points',
    image: "/technology/diagnostics.png",
  },
  {
    icon: <Monitor className="text-primary" />,
    title: '3D Operation Planning', description: 'Virtual surgery simulation and planning for optimal outcomes',
    image: "/technology/planning.png",
  },
  {
    icon: <Stethoscope className="text-primary" />,
    title: 'Advanced Operation Theatre', description: 'State-of-the-art surgical suites with integrated AI monitoring systems',
    image: "/technology/theatre.png",
  },
]

const WhyChoose = () => {
  return (<>
    <section id="benefits" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >


            <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
              <span className="text-white   text-sm">
                EXCELLENCE IN ROBOTIC SURGERY
              </span>
            </div>
            <h2 className="font-outfit text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter bg-gradient-to-r from-white  to-[#ff0033] bg-clip-text text-transparent">
              Why Choose Kalyan Hospital?
            </h2>
            <p className="font-inter text-white/60 max-w-3xl mx-auto text-xl font-light leading-relaxed">
              North India's most advanced robotic knee replacement center combining cutting-edge technology with compassionate care  </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-around px-20">
          {reasons.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -15,
                borderColor: 'rgba(255,0,0,0.5)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}
              className="glassmorphism p-10 rounded-[32px] border-2 border-primary transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center justify-around"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all"></div>

              <div className="mb-8 p-6 bg-white/5 border rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-all duration-700 border border-white/10 group-hover:border-transparent group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] relative z-10 group-hover:rotate-[360deg]">
                {React.cloneElement(benefit.icon, { className: "group-hover:text-white transition-colors" })}
              </div>
              <h3 className="font-outfit font-black text-white text-xl mb-4 uppercase tracking-tighter relative z-10 group-hover:neon-text transition-all">
                {benefit.title}
              </h3>
              <p className="font-inter text-sm text-white/50 leading-relaxed relative z-10 group-hover:text-white/80 transition-all font-light">
                {benefit.description}
              </p>

              {/* Bottom Decorative Element */}
              <div className="mt-8 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-[2px] bg-primary"></div>
                <div className="w-2 h-[2px] bg-primary"></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 px-20 py-12   pt-10">
          {[
            { val: "15+", label: "Years Of Experience" },
            { val: "10,000+", label: "Successful Surgeries" },
            { val: "25+", label: "Expert Surgeons" },
            { val: "#1", label: "in Punjab" }
          ].map((stat, i) => (
            <div key={i} className="glassmorphism border-1 border-[#ff0033]  py-6 px-2 text-white flex flex-col items-center hover:scale-105 hover:border-[#ff0033] hover:shadow-[0_0_20px_rgba(255,0,0,0.15)] transition-all duration-300">
              <span className="text-4xl font-orbitron font-black text-[#ff0033] tracking-[0.1em]">{stat.val}</span>
              <span className="text-[9px] uppercase tracking-[0.4em]  font-black mt-2">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
    <section id="technology" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >


            <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
              <span className="text-white   text-sm">
                CUTTING-EDGE INNOVATION
              </span>
            </div>
            <h2 className="font-outfit text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter bg-gradient-to-r from-white  to-[#ff0033] bg-clip-text text-transparent">
              Advanced Technology Suite
            </h2>
            <p className="font-inter text-white/60 max-w-3xl mx-auto text-xl font-light leading-relaxed">
              Explore the revolutionary technologies powering Punjab's most advanced robotic knee replacement center </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-around px-20">
          {technology.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -15,
                borderColor: 'rgba(255,0,0,0.5)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
              }}
              className="glassmorphism p-10 rounded-[32px] border-2 border-primary transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center justify-around"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all"></div>
              <div className='relative w-full aspect-square mb-8 group/img'>
                <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl z-0 blur-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-500'></div>
                <div className='relative w-full h-full z-10 rounded-2xl overflow-hidden border border-white/10 glassmorphism'>
                  <Image 
                    src={benefit.image} 
                    alt={benefit.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary flex items-center justify-center rounded-xl z-30 shadow-[0_0_20px_rgba(255,0,0,0.4)] border border-white/20 group-hover:rotate-[360deg] transition-transform duration-700">
                  {React.cloneElement(benefit.icon, { size: 24, className: "text-white" })}
                </div>
              </div>
              <h3 className="font-outfit font-black text-white text-xl mb-4 uppercase tracking-tighter relative z-10 group-hover:neon-text transition-all">
                {benefit.title}
              </h3>
              <p className="font-inter text-sm text-white/50 leading-relaxed relative z-10 group-hover:text-white/80 transition-all font-light">
                {benefit.description}
              </p>

              {/* Bottom Decorative Element */}
              <div className="mt-8 flex gap-1   group-hover:opacity-100 transition-opacity text-[#ff0033]  font-bold text-[12px]">EXPLORE TECHNOLOGY <ArrowRight className="group-hover:translate-x-3 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  </>
  );
};

export default WhyChoose;
