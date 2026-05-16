'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

export default function BlogInfiniteList({ initialBlogs, total }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [offset, setOffset] = useState(initialBlogs.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBlogs.length < total);
  
  const loaderRef = useRef(null);

  const fetchMoreBlogs = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?limit=6&offset=${offset}`);
      const data = await res.json();
      
      if (data.success) {
        setBlogs(prev => [...prev, ...data.data]);
        setOffset(prev => prev + data.data.length);
        setHasMore(offset + data.data.length < data.total);
      }
    } catch (err) {
      console.error('Error fetching more blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreBlogs();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, offset, loading]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link 
            key={blog.id} 
            href={`/blogs/${blog.slug}`}
            className="group glassmorphism rounded-[40px] border border-white/5 overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500"
          >
            {/* Image Container */}
            <div className="aspect-[16/10] overflow-hidden relative">
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <span className="font-orbitron text-white/10 text-xs tracking-widest">NO VISUAL DATA</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow space-y-4">
              <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-space">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {new Date(blog.published_at || blog.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User size={12} /> {blog.author}
                </span>
              </div>

              <h3 className="font-orbitron font-bold text-xl uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                {blog.title}
              </h3>

              <p className="text-sm text-white/40 line-clamp-3 font-space leading-relaxed">
                {blog.excerpt || 'Read our latest insights into clinical excellence and robotic precision...'}
              </p>

              <div className="pt-4 mt-auto flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                READ TRANSMISSION <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading Trigger */}
      <div ref={loaderRef} className="py-20 flex flex-col items-center justify-center gap-4">
        {loading && (
          <>
            <Loader2 className="animate-spin text-primary" size={32} />
            <span className="font-orbitron text-[10px] text-white/20 tracking-[0.3em] uppercase">Decrypting Next Layer...</span>
          </>
        )}
        {!hasMore && blogs.length > 0 && (
          <span className="font-orbitron text-[10px] text-white/10 tracking-[0.3em] uppercase">End of Transmission</span>
        )}
      </div>
    </>
  );
}
