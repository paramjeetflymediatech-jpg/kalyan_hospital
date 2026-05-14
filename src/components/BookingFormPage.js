'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, MessageSquare, Send, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function BookingFormPage() {
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
    <div className="min-h-screen bg-[#050505] text-white py-20 px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/40 font-orbitron font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors mb-8 ml-4"
        >
          <ChevronLeft size={16} /> Return to Home
        </Link>

        <div className="glassmorphism rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(255,0,51,0.15)] border border-white/10">
          
          {/* Contact Info Sidebar (Red Gradient) */}
          <div className="lg:w-2/5 bg-gradient-to-br from-primary to-[#cc0029] p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-futuristic-grid opacity-10"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 py-1 px-3 mb-6 rounded-full bg-white/10 border border-white/20">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span className="text-white text-[8px] uppercase tracking-[0.3em] font-bold">Secure Node</span>
              </div>
              
              <h1 className="font-orbitron text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
                BOOK YOUR <br/><span className="text-white/80">PROCEDURE</span>
              </h1>
              
              <p className="font-inter text-white/80 text-lg font-light leading-relaxed mb-12">
                Initiate your journey toward robotic precision and rapid recovery. Fill out the secure form to schedule your consultation.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/60 font-black">24/7 Helpline</p>
                    <p className="font-orbitron font-bold text-lg">+91 99150-48877</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/60 font-black">Email Hub</p>
                    <p className="font-orbitron font-bold text-lg lowercase">kalyanhospitalhelpline@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/20 relative z-10">
              {/* <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-white/60" />
                <p className="font-space text-[10px] uppercase tracking-[0.2em] text-white/60"> </p>
              </div> */}
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:w-3/5 p-12 bg-black/40 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Full Name</label>
                <div className="relative group/input">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within/input:scale-110 transition-transform" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full bg-transparent border border-white/20 rounded-[24px] py-5 pl-16 pr-8 focus:border-primary focus:outline-none focus:bg-white/[0.05] transition-all font-inter text-white placeholder:text-white/20"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Phone</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within/input:scale-110 transition-transform" size={20} />
                    <input
                      required
                      type="tel"
                      placeholder="+91 00000-00000"
                      className="w-full bg-transparent border border-white/20 rounded-[24px] py-5 pl-16 pr-8 focus:border-primary focus:outline-none focus:bg-white/[0.05] transition-all font-inter text-white placeholder:text-white/20"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Email Channel</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within/input:scale-110 transition-transform" size={20} />
                    <input
                      type="email"
                      placeholder="patient@hub.com"
                      className="w-full bg-transparent border border-white/20 rounded-[24px] py-5 pl-16 pr-8 focus:border-primary focus:outline-none focus:bg-white/[0.05] transition-all font-inter text-white placeholder:text-white/20"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Medical Situation Intel</label>
                <div className="relative group/input">
                  <MessageSquare className="absolute left-6 top-7 text-primary group-focus-within/input:scale-110 transition-transform" size={20} />
                  <textarea
                    rows="5"
                    placeholder="Describe your condition for triage analysis..."
                    className="w-full bg-transparent border border-white/20 rounded-[24px] py-6 pl-16 pr-8 focus:border-primary focus:outline-none focus:bg-white/[0.05] transition-all font-inter text-white placeholder:text-white/20 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-space text-xs uppercase tracking-widest">
                  <AlertCircle size={18} />
                  <span>Transmission Error: {error}</span>
                </div>
              )}

              <button
                disabled={isSubmitting}
                className="w-full py-6 bg-primary hover:bg-primary-hover rounded-[24px] font-orbitron font-black text-lg tracking-[0.2em] transition-all disabled:opacity-50 relative overflow-hidden group/btn shadow-[0_10px_30px_rgba(255,0,51,0.2)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE BOOKING SEQUENCE'}
                  {!isSubmitting && <Send size={22} className="group-hover:translate-x-2 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
