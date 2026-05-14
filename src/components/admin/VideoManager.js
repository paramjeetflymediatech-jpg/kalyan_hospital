'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, ExternalLink, Play, CheckCircle, AlertCircle, Video } from 'lucide-react';
import VideoModal from '../VideoModal';

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos/sync');
      const data = await res.json();
      if (data.success) setVideos(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setStatus(null);
    try {
      const res = await fetch('/api/admin/videos/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: data.message });
        fetchVideos();
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Sync failed: Network error' });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this video from website gallery?')) return;
    try {
      await fetch(`/api/admin/videos/sync?id=${id}`, { method: 'DELETE' });
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-2xl">
            <Video className="text-red-500" size={24} />
          </div>
          <h2 className="font-orbitron font-black text-3xl tracking-tight uppercase">MEDIA REPOSITORY</h2>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="group relative flex items-center justify-center gap-3 py-4 px-8 bg-red-500 hover:bg-red-600 rounded-xl transition-all disabled:opacity-50 overflow-hidden"
        >
          <RefreshCw size={20} className={syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
          <span className="font-orbitron font-bold text-xs tracking-widest uppercase">
            {syncing ? 'SYNCING...' : 'SYNC FROM YOUTUBE'}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
        </button>
      </div>

      {status && (
        <div className={`flex items-center gap-4 p-6 rounded-2xl border ${
          status.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse text-white/20 font-orbitron uppercase tracking-widest">Accessing Neural Archive...</div>
        ) : videos.length === 0 ? (
          <div className="col-span-full py-20 text-center glassmorphism rounded-[40px] border border-white/5">
             <Video size={48} className="mx-auto mb-6 text-white/10" />
             <p className="font-orbitron text-white/20 uppercase tracking-widest">No local videos found. Initiate sync.</p>
          </div>
        ) : (
          videos.map((vid) => (
            <div 
              key={vid.id} 
              onClick={() => setSelectedVideo(vid.youtube_id)}
              className="glassmorphism rounded-[32px] overflow-hidden border border-white/10 group hover:border-red-500/40 transition-all flex flex-col cursor-pointer"
            >
              <div className="relative aspect-video">
                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <Play size={20} fill="white" className="ml-1" />
                   </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-sm mb-3 line-clamp-2 uppercase tracking-tight">{vid.title}</h3>
                  <p className="text-[10px] text-white/40 font-space tracking-widest uppercase">{new Date(vid.published_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                  <a 
                    href={`https://youtube.com/watch?v=${vid.youtube_id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(vid.id); }}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <VideoModal 
        videoId={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    </div>
  );
}
