'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Target, Users } from 'lucide-react';
import Image from 'next/image';

const doctors = [
  {
    name: "Dr. Rajinder Singh",
    title: "Pioneer Robotic Knee Replacement Doctor in India",
    specialty: "Robotic Joint Replacement",
    experience: "30+ Years",
    surgeries: "30,000+",
    image: "/doctors/pp.png",
    description: "With over three decades of clinical mastery, Dr. Rajinder Singh is a trailblazer in orthopedic innovation. As the leading Robotic Knee Replacement Doctor in India, he has dedicated his career to refining minimally invasive techniques, ensuring every patient regains independence through world-class surgical precision and compassionate care."
  } 
];

const DoctorSection = () => {
  return (
    <section id="doctors" className="relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-space font-black text-xs uppercase tracking-[0.5em] mb-4 block">Redefining Mobility</span>
            <h2 className="font-outfit text-3xl md:text-6xl  bg-gradient-to-r from-white  to-[#ff0033] bg-clip-text text-transparent font-black  mb-8 ">
              Leading Robotic Knee Replacement Hospital in India
            </h2>
            <p className="font-inter text-white/60 max-w-3xl mx-auto text-xl font-light leading-relaxed">
              At Kalyan Hospital, we blend human expertise with artificial intelligence to offer the most sophisticated Robotic Knee Replacement in India. Our center utilizes real-time 3D mapping to preserve natural bone and ligaments, drastically reducing human error and ensuring a knee that feels more natural than ever before.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col xl:flex-row justify-around gap-12 ">
          {doctors.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex-1  group"
            >
              <div className="py-12 relative glassmorphism-premium rounded-[32px] overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:border-primary/40 transition-all duration-500">
                {/* Doctor Image with Scan Overlay */}
                <div className="w-full md:w-5/12 h-80 md:h-auto relative overflow-hidden">
                  <Image 
                    src={doc.image} 
                    alt={doc.name} 
                    fill 
                    className="object-contain group-hover:scale-110 transition-transform duration-[2s]   group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10"></div>
                  
                  {/* Digital Biometric Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="scanning-line"></div>
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#ff0000]"></div>
                    <span className="text-xs uppercase font-space font-black text-primary tracking-[0.4em]">ROBOTIC LEAD SURGEON</span>
                  </div>
                  
                  <h3 className="font-outfit text-3xl font-black text-white mb-2 uppercase tracking-tighter">{doc.name}</h3>
                  <p className="text-white/50 font-space text-xs mb-8 tracking-[0.2em]">{doc.specialty}</p>
                  
                  <p className="font-inter text-white/60 text-lg mb-10 leading-relaxed font-light italic">
                    "{doc.description}"
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <Award size={16} className="text-primary" />
                        <span className="text-[10px] uppercase text-white/40 tracking-[0.3em] font-black">Experience</span>
                      </div>
                      <p className="text-2xl font-outfit font-black text-white">{doc.experience}</p>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <Target size={16} className="text-primary" />
                        <span className="text-[10px] uppercase text-white/40 tracking-[0.3em] font-black">Surgeries</span>
                      </div>
                      <p className="text-2xl font-outfit font-black text-white">{doc.surgeries}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
