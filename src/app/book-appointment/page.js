'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, MessageSquare, Send, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Robotic Knee Replacement',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    'Robotic Knee Replacement',
    'AI-Assisted Spine Surgery',
    'Robotic Trauma Care',
    'Advanced Diagnostics',
    'General Consultation'
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glassmorphism p-12 rounded-[32px] border border-primary/30 text-center"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h2 className="font-orbitron font-black text-3xl text-white mb-4 uppercase tracking-tighter">Request Received</h2>
          <p className="font-inter text-white/60 mb-8 leading-relaxed">
            Your appointment request has been successfully transmitted to our AI hubs. Our triage team will contact you within 2-4 hours.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary font-orbitron font-bold uppercase tracking-widest hover:gap-4 transition-all"
          >
            <ChevronLeft size={20} /> Back to Hub
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/40 font-orbitron font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors mb-12"
        >
          <ChevronLeft size={16} /> Return to Home
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
              <span className="text-white text-[10px] uppercase tracking-widest font-bold">
                Direct Triage Access
              </span>
            </div>
            
            <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
              BOOK YOUR <span className="text-primary">PROCEDURE</span>
            </h1>
            
            <p className="font-inter text-white/60 text-xl font-light leading-relaxed mb-10">
              Initiate your journey toward robotic precision and rapid recovery. Fill out the secure form to schedule your consultation.
            </p>

            <div className="space-y-6">
              {[
                { icon: <ShieldCheck className="text-primary" />, text: "HIPAA Compliant Data Handling" },
                { icon: <Calendar className="text-primary" />, text: "Real-time Triage Priority" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/40">
                  {item.icon}
                  <span className="font-space text-xs uppercase tracking-widest">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="glassmorphism p-10 rounded-[40px] border border-white/10 relative overflow-hidden group">
              {/* Form Background Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-700"></div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white placeholder:text-white/10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Phone Network</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        required
                        type="tel"
                        placeholder="+91 00000-00000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white placeholder:text-white/10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input
                        type="email"
                        placeholder="patient@hub.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white placeholder:text-white/10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Select Procedure</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white appearance-none cursor-pointer"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    >
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Additional Intel</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-6 text-white/20" size={18} />
                    <textarea
                      rows="4"
                      placeholder="Describe your condition..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white placeholder:text-white/10 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                {error && (
                  <p className="text-primary text-xs font-space font-bold uppercase tracking-widest text-center animate-pulse">
                    Error: {error}
                  </p>
                )}

                <button
                  disabled={isSubmitting}
                  className="w-full py-6 bg-primary hover:bg-primary-hover rounded-2xl font-orbitron font-black text-lg tracking-[0.2em] transition-all disabled:opacity-50 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE REQUEST'}
                    {!isSubmitting && <Send size={20} className="group-hover:translate-x-2 transition-transform" />}
                  </span>
                  
                  {/* Button Glow */}
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
