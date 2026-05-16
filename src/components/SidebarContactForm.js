'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2, User, Phone, MessageSquare } from 'lucide-react';

const SidebarContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: 'Blog Inquiry',
          email: 'not-provided@kalyan.com'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', phone: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="glassmorphism p-8 rounded-[32px] border border-white/10 sticky top-32">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-orbitron font-black text-xl uppercase tracking-tight text-white">
            QUICK <span className="text-primary">CONSULT</span>
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-space leading-relaxed">
            Get professional medical advice regarding your robotic surgery needs.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-widest">Inquiry Received</h4>
              <p className="text-[10px] text-white/40 font-space uppercase tracking-widest">Our experts will contact you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white focus:border-primary transition-all outline-none font-space"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white focus:border-primary transition-all outline-none font-space"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-primary" size={16} />
                <textarea
                  rows="3"
                  placeholder="Your Question..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white focus:border-primary transition-all outline-none resize-none font-space"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {status === 'error' && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">
                  Error. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 !text-[10px]"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>SEND TRANSMISSION</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </AnimatePresence>

        <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
          <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black">Emergency Assistance</p>
          <a href="tel:+919915048877" className="flex items-center gap-3 text-white hover:text-primary transition-colors">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone size={14} className="text-primary" />
            </div>
            <span className="font-orbitron font-bold text-xs">+91 99150 48877</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SidebarContactForm;
