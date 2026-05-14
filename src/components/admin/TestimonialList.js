'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Star, Trash2, Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function TestimonialList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testimonials/all');
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setTestimonials(testimonials.map(t => 
          t.id === id ? { ...t, is_active: !currentStatus } : t
        ));
      }
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-primary" size={24} />
          <h2 className="font-orbitron font-bold text-2xl">Stored Testimonials</h2>
        </div>
        <button 
          onClick={fetchTestimonials}
          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white/60 hover:text-white"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/40 font-orbitron">No testimonials stored in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div 
              key={t.id}
              className={`glassmorphism p-6 rounded-2xl border transition-all ${
                t.is_active ? 'border-white/10' : 'border-red-500/20 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <img 
                      src={t.image || '/patient-placeholder.png'} 
                      alt={t.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-orbitron font-bold text-sm text-white uppercase">{t.name}</p>
                    <p className="text-[10px] text-white/40 font-space tracking-widest">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleStatus(t.id, t.is_active)}
                    className={`p-2 rounded-lg transition-all ${
                      t.is_active ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white/40'
                    }`}
                    title={t.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {t.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </button>
                  <button 
                    onClick={() => deleteTestimonial(t.id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < (t.rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'} 
                  />
                ))}
                <span className="text-[10px] text-white/40 ml-2 font-space">{t.time}</span>
              </div>

              <p className="text-xs text-white/70 leading-relaxed italic line-clamp-3">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
