'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Trash2, Edit2, Check, X, FileText, Image as ImageIcon, Save, ArrowLeft, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogManager({ blogId = null }) {
  const [loading, setLoading] = useState(blogId ? true : false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'Admin',
    status: 'draft',
    publishedAt: '',
    faqs: '[]'
  });

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    if (formData.faqs) {
      try {
        setFaqs(JSON.parse(formData.faqs));
      } catch (e) {
        setFaqs([]);
      }
    }
  }, [formData.faqs]);

  const addFaq = () => {
    const newFaqs = [...faqs, { q: '', a: '' }];
    setFaqs(newFaqs);
    setFormData(prev => ({ ...prev, faqs: JSON.stringify(newFaqs) }));
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
    setFormData(prev => ({ ...prev, faqs: JSON.stringify(newFaqs) }));
  };

  const removeFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
    setFormData(prev => ({ ...prev, faqs: JSON.stringify(newFaqs) }));
  };

  const quillRef = useRef(null);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`);
      const data = await res.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, isFeatured = true) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        if (isFeatured) {
          setFormData({ ...formData, image: data.url });
        } else {
          // Insert into Quill
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', data.url);
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = (e) => handleImageUpload(e, false);
  };

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(blogId ? `/api/admin/blogs/${blogId}` : '/api/admin/blogs', {
        method: blogId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast(blogId ? 'Transmission updated successfully' : 'New post initialized successfully');
        if (!blogId) {
          setTimeout(() => {
            window.location.href = '/admin?tab=blogs';
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Emergency: Data synchronization failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      
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

      <div className="flex items-center justify-between">
        <Link href="/admin?tab=blogs" className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-xs uppercase tracking-widest font-orbitron">
          <ArrowLeft size={16} /> BACK TO ARCHIVE
        </Link>
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary/10 rounded-2xl">
             <FileText className="text-primary" size={24} />
           </div>
           <h2 className="font-orbitron font-black text-3xl tracking-tight uppercase">BLOG EDITOR</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glassmorphism p-8 rounded-[40px] border border-white/10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">Post Title</label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:border-primary outline-none transition-all text-xl font-orbitron font-bold"
                placeholder="ENTER MAGNIFICENT TITLE..."
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                  setFormData({ ...formData, title, slug });
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">Slug</label>
              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 focus:border-primary outline-none transition-all text-sm font-space text-white/60"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">Excerpt</label>
              <textarea
                rows="3"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/60 focus:border-primary outline-none transition-all resize-none font-space"
                placeholder="Brief summary for listings..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-2 blog-rich-editor">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">Content</label>
              <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  modules={quillModules}
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  className="min-h-[500px]"
                />
              </div>
            </div>
          </div>

          {/* FAQ Manager */}
          <div className="glassmorphism p-8 rounded-[40px] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-primary" size={20} />
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-widest text-white">FAQ Section</h3>
              </div>
              <button 
                type="button"
                onClick={addFaq}
                className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              >
                <Plus size={14} /> Add Question
              </button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 relative group">
                  <button 
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-white/20 ml-2">Question</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-space outline-none focus:border-primary"
                      placeholder="What is..."
                      value={faq.q}
                      onChange={(e) => updateFaq(index, 'q', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-white/20 ml-2">Answer</label>
                    <textarea 
                      rows="2"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-space outline-none focus:border-primary resize-none"
                      placeholder="Explain concisely..."
                      value={faq.a}
                      onChange={(e) => updateFaq(index, 'a', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              {faqs.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">No FAQs defined for this report.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Status & Actions */}
          <div className="glassmorphism p-8 rounded-[40px] border border-white/10 space-y-6">
            <h3 className="font-orbitron font-bold text-xs text-primary uppercase tracking-widest">Publishing</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Status</span>
                <select 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-orbitron outline-none focus:border-primary"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">DRAFT</option>
                  <option value="published">PUBLISHED</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Author</span>
                <input 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-orbitron outline-none focus:border-primary w-32 text-right"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span className="font-orbitron font-bold text-xs uppercase tracking-widest">{blogId ? 'UPDATE POST' : 'PUBLISH POST'}</span>
            </button>
          </div>

          {/* Featured Image */}
          <div className="glassmorphism p-8 rounded-[40px] border border-white/10 space-y-6">
            <h3 className="font-orbitron font-bold text-xs text-primary uppercase tracking-widest">Featured Image</h3>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center group">
              {formData.image ? (
                <>
                  <img src={formData.image} alt="Featured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="p-3 bg-red-500 rounded-full text-white"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-white/5 rounded-full inline-block">
                    <ImageIcon size={32} className="text-white/20" />
                  </div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">No Image Selected</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="file"
                id="featured-image"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
              />
              <label 
                htmlFor="featured-image"
                className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all"
              >
                {uploading ? <Loader2 className="animate-spin text-primary" size={18} /> : <Plus size={18} className="text-primary" />}
                <span className="text-[10px] font-orbitron font-bold uppercase tracking-widest">{uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}</span>
              </label>
              
              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-widest text-white/20 ml-2">OR IMAGE URL</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-space outline-none focus:border-primary"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <style jsx global>{`
        .blog-rich-editor .ql-toolbar {
          border: none !important;
          background: rgba(255,255,255,0.02) !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          padding: 1rem !important;
        }
        .blog-rich-editor .ql-container {
          border: none !important;
        }
        .blog-rich-editor .ql-editor {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 16px !important;
          line-height: 1.8 !important;
          color: rgba(255,255,255,0.8) !important;
          padding: 2rem !important;
          min-height: 500px;
        }
        .blog-rich-editor .ql-editor p {
          margin-bottom: 1.5rem;
        }
        .blog-rich-editor .ql-stroke {
          stroke: rgba(255,255,255,0.5) !important;
        }
        .blog-rich-editor .ql-fill {
          fill: rgba(255,255,255,0.5) !important;
        }
        .blog-rich-editor .ql-picker {
          color: rgba(255,255,255,0.5) !important;
        }
        .blog-rich-editor .ql-picker-options {
          background-color: #0a0a0a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </div>
  );
}
