'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Activity, Target, Clock, Heart, Award, CheckCircle } from 'lucide-react';

const benefits = [
  {
    title: "Sub-millimeter Precision",
    description: "Achieves exact implant positioning tailored to your unique anatomy for a perfect fit.",
    icon: <Target className="text-primary" size={32} />,
  },
  {
    title: "Minimal Bloodloss",
    description: "Advanced AI-guided incisions ensure minimal disruption to surrounding tissues and vascular structures.",
    icon: <Activity className="text-primary" size={32} />,
  },
  {
    title: "Bone Preservation",
    description: "The robot removes only the damaged portion, sparing healthy bone for better long-term outcomes.",
    icon: <Shield className="text-primary" size={32} />,
  },
  {
    title: "Ligament Balance",
    description: "Real-time data allows for perfect ligament tensioning, providing a more stable and natural feel.",
    icon: <Zap className="text-primary" size={32} />,
  },
  {
    title: "Reduced Pain",
    description: "Smaller incisions and less tissue trauma lead to significantly lower post-operative discomfort for patients.",
    icon: <Heart className="text-primary" size={32} />,
  },
  {
    title: "Faster Discharge",
    description: "Most patients are able to walk within hours and return home much sooner than traditional surgery.",
    icon: <Clock className="text-primary" size={32} />,
  },
  {
    title: "Enhanced Longevity",
    description: "Precise alignment reduces wear and tear on the implant, extending its lifespan for several decades.",
    icon: <Award className="text-primary" size={32} />,
  },
  {
    title: "No Scars",
    description: "Minimally invasive techniques result in smaller, cosmetic-friendly scars and a much neater healing process.",
    icon: <CheckCircle className="text-primary" size={32} />,
  },
];

const Benefits = () => {
  return (
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
               THE ROBOTIC EDGE
              </span>
            </div>
            <h2 className="font-outfit text-3xl md:text-7xl font-black mb-6 uppercase tracking-tighter bg-gradient-to-r from-white  to-[#ff0033] bg-clip-text text-transparent">
              Transforming Lives Through Precision Engineering
            </h2>
            <p className="font-inter text-white/60 max-w-3xl mx-auto text-xl font-light leading-relaxed">
              Robotic-assisted surgery is the gold standard for joint restoration, offering unmatched accuracy that traditional methods simply cannot replicate.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-around px-6 md:px-20">
          {benefits.map((benefit, index) => (
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
              className="glassmorphism p-6 md:p-10 rounded-[32px] border-2 border-primary transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center justify-around"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all"></div>
              
              <div className="mb-8 p-6 bg-white/5 border rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-white/10 group-hover:border-transparent group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] relative z-10">
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
      </div>
    </section>
  );
};

export default Benefits;
