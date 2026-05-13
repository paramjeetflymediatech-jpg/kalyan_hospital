'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Eye, Shield, Gauge, Binary, Cog } from 'lucide-react';

const technologies = [
  {
    title: "AI Mapping Engine",
    description: "Analyzes patient-specific anatomy to create a digital twin for precise planning.",
    icon: <Binary className="text-primary" size={24} />,
  },
  {
    title: "Haptic Guidance",
    description: "Prevents the surgeon from moving outside the pre-planned boundaries for safety.",
    icon: <Shield className="text-primary" size={24} />,
  },
  {
    title: "Optical Tracking",
    description: "Real-time 3D tracking ensures the robot and patient are always perfectly aligned.",
    icon: <Eye className="text-primary" size={24} />,
  },
  {
    title: "Quantum Processing",
    description: "Processes thousands of data points per second for instantaneous adjustments.",
    icon: <Cpu className="text-primary" size={24} />,
  },
  {
    title: "Smart Sensors",
    description: "Monitors ligament tension and joint stability throughout the procedure.",
    icon: <Gauge className="text-primary" size={24} />,
  },
  {
    title: "Robotic Precision",
    description: "Execution of bone cuts with sub-millimeter accuracy for the best implant fit.",
    icon: <Cog className="text-primary" size={24} />,
  },
];

const nodePositions = [
  { top: '25%', left: '30%' },
  { top: '70%', left: '40%' },
  { top: '45%', left: '75%' },
  { top: '35%', left: '20%' },
  { top: '80%', left: '60%' },
  { top: '20%', left: '70%' },
];

const TechnologyShowcase = () => {
  return (
    <section id="technology" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Enhanced Holographic Central Visual */}
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              {/* Animated Rings */}
              <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-10 border border-primary/30 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed"></div>
              <div className="absolute inset-24 border border-primary/40 rounded-full animate-[spin_10s_linear_infinite]"></div>
              
              {/* Central AI Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 glassmorphism rounded-full border border-primary/50 flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.4)]">
                <Cpu size={64} className="text-primary animate-pulse" />
              </div>

              {/* Data Nodes */}
              {[
                { x: '10%', y: '20%', label: 'SENSORY-SYNC' },
                { x: '85%', y: '15%', label: 'NEURAL-MAPPING' },
                { x: '5%', y: '80%', label: 'HAPTIC-FEEDBACK' },
                { x: '90%', y: '75%', label: 'QUANTUM-CALC' }
              ].map((node, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#ff0000] mb-2"></div>
                  <div className="px-3 py-1 glassmorphism border border-primary/40 rounded-lg">
                    <span className="text-[10px] font-space font-black text-white tracking-[0.2em]">{node.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-primary font-space font-black text-xs uppercase tracking-[0.5em] mb-4 block">The Ecosystem</span>
              <h2 className="font-outfit text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                NEURAL <span className="neon-text metallic-text">ARCH</span> PROTOCOL
              </h2>
              <p className="font-inter text-white/60 mb-12 text-xl font-light leading-relaxed">
                Our proprietary AI-robotic ecosystem integrates advanced computer vision, haptic feedback, and predictive analytics to achieve results that surpass human capability.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technologies.map((tech, index) => (
                  <motion.div 
                    key={index} 
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="flex gap-5 p-6 glassmorphism rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-default group"
                  >
                    <div className="mt-1 p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 transition-all">
                      {tech.icon}
                    </div>
                    <div>
                      <h4 className="font-outfit font-black text-white text-lg mb-2 uppercase tracking-tighter group-hover:text-primary transition-colors">
                        {tech.title}
                      </h4>
                      <p className="font-inter text-sm text-white/70 leading-relaxed group-hover:text-white transition-all">
                        {tech.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
