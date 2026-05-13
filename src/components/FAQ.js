'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is the average Robotic Knee Replacement Cost in India at Kalyan Hospital?",
    answer: "The Robotic Knee Replacement Cost in India typically ranges between ₹2,50,000 to ₹4,50,000 per knee, depending on the specific implant technology and room category chosen. At Kalyan Hospital, we pride ourselves on transparency; our packages are all-inclusive, covering the surgery, robotic console fees, implant costs, and initial physiotherapy. Compared to Western countries, where the same procedure can cost upwards of $30,000, India offers a significant cost advantage while maintaining—or often exceeding—the same technological standards."
  },
  {
    question: "How does robotic surgery differ from traditional knee replacement?",
    answer: "Traditional surgery relies on the surgeon's 'best guess' using manual jigs and visual alignment. In contrast, Robotic Knee Replacement in India at our center uses a computer-assisted arm that follows a 3D digital blueprint of your specific knee. This removes the 'human error' factor. The robot provides haptic boundaries, meaning it literally won't allow the tool to move outside the pre-planned area. This level of precision leads to better implant survival and a more natural feeling when walking."
  },
  {
    question: "Who is the best Robotic Knee Replacement Doctor in India for complex cases?",
    answer: "Dr. Rajinder Singh is widely regarded as a leading Robotic Knee Replacement Doctor in India. His expertise stems from over 30 years of orthopedic experience and a track record of 30,000+ successful surgeries. He specializes in complex primary and revision knee replacements where robotic precision is critical for success. His reputation for excellence attracts patients from across the globe seeking the highest level of surgical skill and AI-driven accuracy."
  },
  {
    question: "What is the recovery timeline after a robotic knee procedure?",
    answer: "Recovery after a robotic procedure is significantly faster than traditional surgery. Most patients at Kalyan Hospital are encouraged to stand and take their first steps within 4 to 6 hours after the operation. You can typically return home within 2-3 days. By the end of the second week, most patients are walking comfortably with minimal support. Full activities, including driving and light exercise, usually resume within 4 to 6 weeks."
  },
  {
    question: "Is the robotic surgery safe for elderly patients?",
    answer: "Yes, robotic surgery is exceptionally safe for elderly patients. In fact, it is often the preferred method because it is less invasive. Because the robotic system allows for smaller incisions and results in less blood loss, it puts significantly less strain on the patient's cardiovascular system. Our advanced anesthesia protocols, combined with the precision of the robotic arm, minimize the risks of complications, making it a viable and safe option for patients well into their 80s."
  },
  {
    question: "Does insurance cover the cost of robotic knee replacement in India?",
    answer: "Most modern health insurance policies in India now cover robotic-assisted surgeries, especially when they are deemed medically necessary for better patient outcomes. Kalyan Hospital has a dedicated TPA (Third Party Administrator) desk that assists patients with the paperwork and pre-authorization process. We recommend checking your specific policy sub-limits, but our team is here to help you navigate the financial aspects."
  },
  {
    question: "Why is Kalyan Hospital considered a top Robotic Knee Replacement Hospital in India?",
    answer: "Kalyan Hospital stands out because it was one of the early adopters of AI-powered orthopedic technology in the country. Our 'Center of Excellence' combines the latest robotic platforms with a team of veteran surgeons led by Dr. Rajinder Singh. Our success rates consistently exceed 99%, and our infection control protocols are world-class. You get a comprehensive care ecosystem that includes advanced diagnostics, precision surgery, and expert rehabilitation."
  },
  {
    question: "Will I feel any pain during or after the robotic surgery?",
    answer: "During the surgery, you will be under anesthesia, so you will feel absolutely no pain. Post-operatively, robotic surgery is known for being much less painful than traditional methods. Because the AI ensures we don't disturb unnecessary soft tissues, the inflammatory response is lower. We also utilize 'Multimodal Analgesia,' which targets pain through different pathways, ensuring you remain comfortable."
  },
  {
    question: "How long do the robotic-aligned knee implants last?",
    answer: "When a knee is aligned with sub-millimeter precision, the weight distribution is perfectly balanced. This prevents the 'un-even wear' that often causes traditional implants to fail early. Current data suggests that robotically placed implants can last 25 to 30 years, or even longer, depending on the patient's lifestyle. This makes it an ideal choice for younger, active patients who want a permanent solution."
  },
  {
    question: "Do I need a CT scan before my robotic surgery at Kalyan Hospital?",
    answer: "Our advanced robotic system uses 'Image-Free' or 'Intra-operative Mapping' technology. Unlike older systems that require a high-radiation CT scan weeks in advance, our system creates a 3D model of your knee in real-time during the surgery. This saves you the cost and radiation exposure of a CT scan. The surgeon uses a specialized probe to 'paint' the surface of your bone, and the AI instantly generates a digital twin of your knee joint."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-secondary/10">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
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
                className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    activeIndex === index ? 'bg-primary text-white' : 'bg-white text-primary'
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
                    <div className="px-4 md:px-6 pb-6 pt-2 font-inter text-white text-md leading-relaxed border-t border-white/5">
                      <p className="bg-primary/5 p-4 rounded-xl border border-primary/10">
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
