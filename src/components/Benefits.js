'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Activity, Target, Clock, Heart, Award, CheckCircle } from 'lucide-react';

const benefits = [
  {
    title: "Unmatched Precision",
    description: "AI-driven mapping ensures sub-millimeter accuracy for perfect implant placement.",
    icon: <Target className="text-primary" size={32} />,
  },
  {
    title: "Rapid Recovery",
    description: "Patients can often walk within 24 hours due to minimally invasive techniques.",
    icon: <Clock className="text-primary" size={32} />,
  },
  {
    title: "Minimal Pain",
    description: "Advanced robotic guidance reduces tissue trauma and post-operative discomfort.",
    icon: <Heart className="text-primary" size={32} />,
  },
  {
    title: "Personalized Mapping",
    description: "3D virtual models of your knee are created for a truly customized surgical plan.",
    icon: <Activity className="text-primary" size={32} />,
  },
  {
    title: "Longevity",
    description: "Precise alignment significantly increases the lifespan of the knee implant.",
    icon: <Shield className="text-primary" size={32} />,
  },
  {
    title: "AI Analysis",
    description: "Real-time intraoperative data analysis for optimal clinical decision making.",
    icon: <Zap className="text-primary" size={32} />,
  },
  {
    title: "Certified Experts",
    description: "Performed by world-renowned robotic surgeons with thousands of successful cases.",
    icon: <Award className="text-primary" size={32} />,
  },
  {
    title: "Proven Results",
    description: "98% patient satisfaction rate with life-changing mobility outcomes.",
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
               REVOLUTIONARY ADVANTAGES
              </span>
            </div>
            <h2 className="font-outfit text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter bg-gradient-to-r from-white  to-[#ff0033] bg-clip-text text-transparent">
           Why Choose Robotic Surgery?
            </h2>
            <p className="font-inter text-white/60 max-w-3xl mx-auto text-xl font-light leading-relaxed">
              Experience the future of knee replacement with AI-powered precision and superior outcomes
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-around px-20">
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
              className="glassmorphism p-10 rounded-[32px] border-2 border-primary transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center justify-around"
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
