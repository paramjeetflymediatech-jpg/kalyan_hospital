'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How long does the robotic surgery take?",
    answer: "The procedure typically takes 60-90 minutes. Our AI systems pre-plan the entire surgery, which reduces actual operative time while increasing precision."
  },
  {
    question: "Is robotic knee replacement safer than traditional surgery?",
    answer: "Yes. Robotic systems provide real-time haptic feedback that prevents the surgeon from moving outside pre-planned boundaries, significantly reducing risk to surrounding tissues."
  },
  {
    question: "What is the typical recovery time?",
    answer: "Most patients are able to walk with assistance within 24 hours. Full return to normal daily activities usually occurs within 3-4 weeks, much faster than traditional methods."
  },
  {
    question: "Does insurance cover robotic surgery?",
    answer: "Most major insurance providers now cover robotic knee replacement. Our team can help you verify your coverage and provide all necessary digital documentation."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-secondary/10">
      <div className="container mx-auto px-6 px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
              AI <span className="neon-text">KNOWLEDGE</span> BASE
            </h2>
            <p className="font-inter text-white/70">
              Find answers to common questions about our robotic orthopedic ecosystem.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism rounded-2xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    activeIndex === index ? 'bg-primary text-white' : 'bg-white/5 text-primary'
                  }`}>
                    <HelpCircle size={18} />
                  </div>
                  <span className="font-orbitron font-bold text-white tracking-wider text-sm uppercase">
                    {faq.question}
                  </span>
                </div>
                <div className="text-primary group-hover:scale-110 transition-transform">
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 font-inter text-white/50 text-sm leading-relaxed border-t border-white/5">
                      <p className="bg-primary/5 p-4 rounded-xl border border-primary/10 italic">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
