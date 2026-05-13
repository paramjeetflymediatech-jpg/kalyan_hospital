'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Share2 } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Map Visual (Futuristic placeholder) */}
          <div className="flex-1 min-h-[500px] relative rounded-[32px] overflow-hidden border-2 border-primary/20 group shadow-[0_0_50px_rgba(255,0,0,0.1)]">
            <div className="absolute inset-0 z-20 pointer-events-none border-[12px] border-[#050505]"></div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3421.907133930144054!2d75.57738981045227!3d30.914912700000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a831483116d0d%3A0x9ab7534b9f5700bb!2s%E2%9C%85%20Kalyan%20Hospital%20-%20Best%20Orthopedic%20Specialist%2C%20Spine%20Surgeon%2C%20%26%20Back%20Pain%20Treatment%20in%20Ludhiana!5e0!3m2!1sen!2sin!4v1778668721070!5m2!1sen!2sin" 
              className="absolute inset-0 w-full h-full     opacity-80 contrast-125  hover:opacity-100 transition-all duration-700"
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div className="absolute top-6 left-6 z-30 flex items-center gap-3 glassmorphism px-4 py-2 rounded-full border border-primary/30">
              <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
              <span className="text-[10px] font-orbitron font-black text-white uppercase tracking-widest">Live Location System</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8 z-30 glassmorphism p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
              <h4 className="font-orbitron font-black text-white text-xl mb-3 uppercase tracking-tighter flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                Kalyan Robotic Hospital
              </h4>
              <p className="font-inter text-white/80 text-base leading-relaxed">
                B-6/1153, Taj Ganj, Samrala Road,<br />
                Ludhiana, Punjab - 141001
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-orbitron text-5xl font-black text-white mb-10 uppercase tracking-tighter leading-tight">
                GET IN <span className="text-primary">TOUCH</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <Phone />, title: "Emergency Helpline", value: "+91 98765 43210" },
                  { icon: <Mail />, title: "Official Email", value: "info@kalyanhospital.com" },
                  { icon: <Clock />, title: "Hospital Hours", value: "Open 24/7" },
                  { icon: <Share2 />, title: "Social Media", value: "@kalyanhospital" }
                ].map((item, i) => (
                  <div key={i} className="glassmorphism p-8 rounded-3xl border border-white/10 group hover:border-primary/40 transition-all duration-500 bg-white/5">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <h5 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black mb-3 font-space">{item.title}</h5>
                    <p className="font-orbitron font-bold text-white text-lg tracking-tight group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-10 glassmorphism rounded-[32px] border border-primary/30 bg-primary/5 relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.4)] group-hover:rotate-[360deg] transition-transform duration-1000">
                    <Phone className="text-white" size={32} />
                  </div>
                  <div>
                    <h4 className="font-orbitron font-black text-white uppercase tracking-tighter text-2xl">24/7 Emergency</h4>
                    <p className="text-primary font-space font-black uppercase tracking-[0.2em] text-[10px]">Critical Care Unit</p>
                  </div>
                </div>
                <p className="font-inter text-white/70 text-lg leading-relaxed relative z-10">
                  Our advanced trauma team and robotic specialists are available around the clock for immediate surgical interventions and critical care.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
