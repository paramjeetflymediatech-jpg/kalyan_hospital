'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, PhoneCall, ShieldCheck, Calendar } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Surgeons', href: '#doctors' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Technology', href: '#technology' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 overflow-hidden ${
        isScrolled ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
      }`}
    >
      {isScrolled && (
        <motion.div 
          animate={{ left: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      )}
      <div className="container mx-auto px-6 flex justify-around items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff0033] to-[#8b0000] bg-black border border-primary/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.3)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              <span className="font-orbitron font-black text-2xl text-white relative z-10">K</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-black"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-black text-2xl tracking-tighter text-white metallic-text">KALYAN</span>
            <span className="text-[11px] uppercase font-space font-bold text-primary tracking-[0.4em] -mt-1">Robotic Hospital</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative font-space font-bold text-white  hover:text-white transition-all uppercase tracking-[0.2em] text-xs group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <div className='flex gap-6'>
          <button className="glassmorphism border-3  border-[#ff0033] rounded-lg text-white flex items-center gap-2 !py-2.5 !px-6 !text-xs group font-rajdhani">
            <PhoneCall size={14} className="group-hover:rotate-12 transition-transform" />
            <span className='text-white text-md'>Call Now</span>
          </button>
          <Link href="/book-appointment">
            <button className="flex btn-primary px-6 py-2.5 items-center gap-2 !py-2.5 !px-6 !text-xs group font-rajdhani">
              <Calendar size={14} className="group-hover:rotate-12 transition-transform" />
              <span>Book Appointment</span>
            </button>
          </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white w-10 h-10 flex items-center justify-center glassmorphism rounded-lg border border-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 py-8 px-6 flex flex-col gap-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-orbitron font-bold text-white text-lg uppercase tracking-widest flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
              <div className="w-2 h-2 rounded-full bg-primary/20"></div>
            </Link>
          ))}
          <button className="btn-primary w-full flex items-center justify-center gap-3">
            <PhoneCall size={20} />
            <span>Consult AI</span>
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
