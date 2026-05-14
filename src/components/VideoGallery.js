'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from './VideoModal';

export default function VideoGallery({ initialVideos }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {initialVideos.map((vid) => (
          <div 
            key={vid.id} 
            onClick={() => setSelectedVideo(vid.youtube_id)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-[32px] overflow-hidden glassmorphism border border-white/10 p-1 mb-8">
              <img 
                src={vid.thumbnail} 
                alt={vid.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] group-hover:scale-125 transition-all duration-500">
                  <Play size={24} fill="white" className="ml-1" />
                </div>
              </div>
            </div>
            <h3 className="font-orbitron font-bold text-lg px-2 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
              {vid.title}
            </h3>
            <div className="flex items-center gap-4 px-2 mt-4">
              <span className="text-primary text-[10px] font-black uppercase tracking-widest">{vid.category}</span>
              <span className="text-white/20 text-[10px] uppercase tracking-widest">
                {isMounted ? new Date(vid.published_at).toLocaleDateString() : '...'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <VideoModal 
        videoId={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    </>
  );
}
