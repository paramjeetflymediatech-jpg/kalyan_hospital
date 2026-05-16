'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, FileText, Calendar, User, Eye, Search, Loader2, Check, X, AlertCircle } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    fetchBlogs(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && !search) {
          fetchBlogs(false);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, loadingMore, search, offset]);

  const fetchBlogs = async (initial = false) => {
    if (initial) setLoading(true);
    else setLoadingMore(true);

    try {
      const currentOffset = initial ? 0 : offset;
      const res = await fetch(`/api/admin/blogs?limit=10&offset=${currentOffset}`);
      const data = await res.json();
      
      if (data.success) {
        if (initial) {
          setBlogs(data.data);
          setOffset(data.data.length);
        } else {
          setBlogs(prev => [...prev, ...data.data]);
          setOffset(prev => prev + data.data.length);
        }
        setHasMore(offset + data.data.length < data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter(b => b.id !== id));
        showToast('Post purged from archives successfully');
      }
    } catch (err) {
      console.error(err);
      showToast('Error: Could not delete transmission', 'error');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-4 px-8 py-5 glassmorphism-premium rounded-[30px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Notification</p>
              <p className="font-orbitron font-bold text-xs uppercase tracking-widest">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={14} className="text-white/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <FileText className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="font-orbitron font-black text-3xl tracking-tight uppercase">BLOG ARCHIVE</h2>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black mt-1">Intelligence Distribution Center</p>
          </div>
        </div>

        <Link href="/admin/blogs/new" className="btn-primary py-4 px-8 rounded-2xl flex items-center gap-3">
          <Plus size={18} />
          <span className="font-orbitron font-bold text-xs uppercase tracking-widest">Create New Post</span>
        </Link>
      </div>

      <div className="glassmorphism p-8 rounded-[40px] border border-white/10 space-y-8">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 focus:border-primary outline-none transition-all text-sm font-space"
            placeholder="Search within the archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="group glassmorphism p-6 rounded-[32px] border border-white/5 flex items-center justify-between hover:border-primary/40 transition-all">
                <div className="flex items-center gap-8">
                  <div className="w-24 aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={20} className="text-white/10" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${blog.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                         {blog.status}
                       </span>
                       <h3 className="font-orbitron font-bold text-lg uppercase tracking-tight group-hover:text-primary transition-colors">{blog.title}</h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-space">
                        <Calendar size={12} className="text-primary" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-space">
                        <User size={12} className="text-primary" />
                        <span>{blog.author}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <a href={`/blogs/${blog.slug}`} target="_blank" className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all">
                    <Eye size={18} />
                  </a>
                  <Link href={`/admin/blogs/${blog.id}`} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={() => handleDelete(blog.id)} className="p-4 bg-red-500/10 hover:bg-red-500 rounded-2xl text-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && !loading && (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                <FileText size={48} className="mx-auto text-white/5 mb-4" />
                <p className="text-sm text-white/20 uppercase tracking-widest font-orbitron">No transmissions found in this sector.</p>
              </div>
            )}
            
            {/* Infinite Scroll Trigger */}
            <div ref={loaderRef} className="py-10 flex flex-col items-center justify-center gap-4">
               {loadingMore && (
                 <>
                   <Loader2 className="animate-spin text-primary" size={24} />
                   <span className="font-orbitron text-[8px] text-white/20 tracking-[0.3em] uppercase">Fetching Archives...</span>
                 </>
               )}
               {!hasMore && blogs.length > 0 && !search && (
                 <span className="font-orbitron text-[8px] text-white/10 tracking-[0.3em] uppercase">End of Archive</span>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
