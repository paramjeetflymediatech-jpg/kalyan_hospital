'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' }, 
    { name: 'Locations', href: '/locations' },
    { name: 'Videos', href: '/videos' },
    { name: 'Blog', href: '/blogs' },
  ];

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-500 ${
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
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative flex items-center gap-3">
            <div className="relative w-14 h-14 transition-transform duration-500 group-hover:scale-110">
              <Image 
                src="/logo/kalyan-2.png" 
                alt="Kalyan Robotic Hospital Logo" 
                fill
                sizes="56px"
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              />
            </div>
            <div className="h-10 w-px bg-white/20 hidden md:block"></div>
            <div className="relative w-12 h-12 hidden md:block opacity-80 hover:opacity-100 transition-opacity">
              <Image 
                src="/logo/nabh.png" 
                alt="NABH Accredited" 
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-black text-2xl tracking-tighter text-white metallic-text">KALYAN</span>
            <span className="text-[11px] uppercase font-space font-bold text-primary tracking-[0.4em] -mt-1">Hospital</span>
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
          <a href="tel:+919915048877" className="glassmorphism border-3  border-[#ff0033] rounded-lg text-white flex items-center gap-2 !py-2.5 !px-6 !text-xs group font-rajdhani">
            <PhoneCall size={14} className="group-hover:rotate-12 transition-transform" />
            <span className='text-white text-md'>Call Now</span>
          </a>
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 py-8 px-6 flex flex-col gap-6 shadow-2xl"
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
          <Link href="/book-appointment"> <button className="btn-primary w-full flex items-center justify-center gap-3">
            <PhoneCall size={20} />
            <span>Book Appointment</span>
          </button></Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
