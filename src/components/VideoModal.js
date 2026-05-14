'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0  0 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(255,0,51,0.2)] animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5"
        >
          <X size={24} />
        </button>

        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
