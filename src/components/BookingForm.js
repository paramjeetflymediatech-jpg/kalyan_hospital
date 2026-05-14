'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, Phone, Mail, User, MessageSquare, ClipboardList } from 'lucide-react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Robotic Knee Replacement',
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', service: 'Robotic Knee Replacement', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-futuristic-grid opacity-5 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto glassmorphism rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(255,0,0,0.1)]">
          
          {/* Contact Info Sidebar */}
          <div className="lg:w-2/5 bg-gradient-to-r from-[#ff0033] to-[#cc0029] p-6 md:p-12 text-white flex flex-col justify-between">
            <div>
              <h2 className="font-orbitron text-3xl font-black mb-6 uppercase tracking-tighter">SECURE YOUR CONSULTATION</h2>
              <p className="font-inter text-white/80 mb-12">
                Join the future of healthcare. Fill out the form and our specialist team will contact you within 2 hours.
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10   rounded-full flex items-center justify-start">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">Emergency Hotline</p>
                    <p className="font-bold">+91 99150-48877</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10   rounded-full flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div className='pt-2'>
                    <p className="text-xs uppercase tracking-widest text-white/60">Email Address</p>
                    <p className="font-bold">kalyanhospitalhelpline@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/20">
              <p className="font-orbitron font-bold text-sm tracking-widest">KALYAN ROBOTIC HOSPITAL</p>
              <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">Ludhiana, Punjab, India</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:w-2/3 p-6 md:p-12 bg-black/40">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h3 className="font-orbitron text-3xl font-bold text-white mb-4">REQUEST RECEIVED</h3>
                <p className="font-inter text-white/60 mb-8 max-w-sm">
                  Our robotic specialists are reviewing your case. Expect a call shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="btn-primary"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid   ">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
               
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-primary" size={18} />
                  <textarea
                    rows="4"
                    placeholder="Tell us about your condition..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary transition-all outline-none resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm font-bold animate-pulse">
                    Error connecting to our systems. Please try again or call us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4"
                >
                  {status === 'loading' ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Initialize Booking Sequence</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
