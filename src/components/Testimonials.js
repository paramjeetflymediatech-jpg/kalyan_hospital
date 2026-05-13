'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: "Satinder Kaur",
    location: "Ludhiana, Punjab",
    text: "I visited Kalyan Hospital a few months back for my knee replacement surgery, and I am sure I have forgotten what pain felt like. The surgeons worked with perfection, ensuring that I was comfortable throughout the whole procedure. The active guidance of the surgeons regarding the recovery has made it possible for me to walk freely and confidently.",
    image: "/patient1.png",
    score: "99.8%",
    recovery: "15 Days"
  },
  {
    name: "Harpal Singh",
    location: "Amritsar, Punjab",
    text: "I can’t believe that I can finally walk on my knees without feeling any pain, all because of the professionals at Kalyan Hospital. The staff members, surgeons, were all so polite and actively listened to and answered all my concerns before the surgical procedure. Due to advancements in the surgical procedure, I didn’t feel any pain or discomfort during the process; all credit goes to the experts at Kalyan Hospital.",
    image: "/patient2.png",
    score: "99.5%",
    recovery: "12 Days"
  },
  {
    name: "Seema Kureshi",
    location: "Jalandhar, Punjab",
    text: "Thank God I chose Klayan Hospital for my knee replacement surgery; the professionals are well-trained, so I didn’t feel any problems during the surgical process. I highly recommend this hospital for any orthopaedic surgery for improved and better results.",
    image: "/patient3.png",
    score: "99.9%",
    recovery: "10 Days"
  }
];

const Testimonials = () => {
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setDynamicTestimonials(data.reviews);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Use dynamic testimonials if available, otherwise fallback to hardcoded ones
  const displayTestimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : testimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(3);
      else setItemsToShow(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(displayTestimonials[(currentIndex + i) % displayTestimonials.length]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
              <span className="text-white   text-sm">
                PATIENT SUCCESS STORIES
              </span>
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-black  mb-6  tracking-tight bg-gradient-to-r from-white  to-[#ff0033] bg-clip-text text-transparent">Life-Changing Results</h2>
            <p className="font-inter text-white/70 max-w-2xl mx-auto">
              Real stories from patients who regained their mobility with our AI-powered robotic surgery
            </p>
          </motion.div>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full glassmorphism border border-white/10 text-white/50 hover:text-primary hover:border-primary/50 transition-all group"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute top-1/2 right-0 -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="p-3 rounded-full glassmorphism border border-white/10 text-white/50 hover:text-primary hover:border-primary/50 transition-all group"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex gap-4 transition-all duration-500 ease-out py-10 px-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {getVisibleTestimonials().map((item, idx) => (
                <motion.div
                  key={`${item.name}-${currentIndex}-${idx}`}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="flex-none"
                  style={{ width: `calc((100% - ${(itemsToShow - 1) * 16}px) / ${itemsToShow})` }}
                >
                  <div className="glassmorphism p-6 rounded-2xl border border-white/10 relative group overflow-hidden h-[400px] flex flex-col justify-between hover:border-primary/30 transition-all">
                    {/* Background Glow */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                    
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/30 flex-none">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.src = '/patient-placeholder.png';
                            }}
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-orbitron font-bold text-xs text-white uppercase truncate">{item.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={8} className={i < (item.rating || 5) ? "fill-primary text-primary" : "text-white/20"} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative mb-6">
                        <Quote className="absolute -top-3 -left-3 text-primary/10" size={30} />
                        <p className="font-inter text-sm text-white/70 italic relative z-10 leading-relaxed line-clamp-6">
                          "{item.text}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[7px] uppercase tracking-[0.2em] text-white/40 mb-1">Score</p>
                          <span className="text-sm font-orbitron font-black text-primary">
                            {item.rating ? `${(item.rating * 20).toFixed(0)}%` : item.score}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] uppercase tracking-[0.2em] text-white/40 mb-1">Recovery</p>
                          <span className="text-xs font-orbitron font-bold text-white/80">
                            {item.time || item.recovery}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {displayTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
