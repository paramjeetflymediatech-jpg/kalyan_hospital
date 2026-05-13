'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Users, Award } from 'lucide-react';

const stats = [
  {
    icon: <Target className="text-primary" size={32} />,
    value: "99.9%",
    label: "Surgical Precision",
    description: "Sub-millimeter accuracy using AI mapping"
  },
  {
    icon: <Activity className="text-primary" size={32} />,
    value: "24h",
    label: "Recovery Path",
    description: "Patients walking within 24 hours of surgery"
  },
  {
    icon: <Users className="text-primary" size={32} />,
    value: "10K+",
    label: "Lives Restored",
    description: "Successful robotic procedures completed"
  },
  {
    icon: <Award className="text-primary" size={32} />,
    value: "#1",
    label: "AI Hospital",
    description: "Leading robotic facility in North India"
  }
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all border border-white/10 group-hover:border-primary/40">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-outfit font-black text-white mb-2 tracking-tighter group-hover:neon-text transition-all">
                {stat.value}
              </h3>
              <p className="text-primary font-space font-black uppercase tracking-[0.3em] text-xs mb-4">
                {stat.label}
              </p>
              <p className="text-white/40 text-sm font-inter leading-relaxed group-hover:text-white/60 transition-all">
                {stat.description}
              </p>
              
              <div className="mt-6 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
