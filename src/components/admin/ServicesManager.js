'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Plus, Trash2, Edit2, Check, X, Stethoscope, Link as LinkIcon, FileText, HelpCircle, MessageSquare, Save } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Stethoscope',
    faqs: [] // Array of { q: '', a: '' }
  });

  const quillModules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  }), []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        faqs: JSON.stringify(formData.faqs)
      };
      
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload)
      });
      const data = await res.json();
      if (data.success) {
        fetchServices();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This will affect all location-based pages for this service.')) return;
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (svc) => {
    setEditingId(svc.id);
    let parsedFaqs = [];
    try {
      parsedFaqs = JSON.parse(svc.faqs || '[]');
    } catch (e) {
      parsedFaqs = [];
    }
    
    setFormData({
      name: svc.name,
      slug: svc.slug,
      description: svc.description || '',
      icon: svc.icon || 'Stethoscope',
      faqs: parsedFaqs
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', icon: 'Stethoscope', faqs: [] });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { q: '', a: '' }]
    });
  };

  const removeFaq = (index) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index)
    });
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Stethoscope className="text-primary" size={24} />
          </div>
          <h2 className="font-orbitron font-black text-3xl tracking-tight uppercase">SERVICES ARCHITECTURE</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Column */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-[40px] border border-white/10 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="font-orbitron font-bold text-lg text-primary uppercase tracking-widest">
                 {editingId ? 'Modify Service' : 'Initialize Service'}
               </h3>
               {editingId && (
                 <button type="button" onClick={resetForm} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                   <X size={18} />
                 </button>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">Procedure Name</label>
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all text-sm uppercase font-orbitron"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                    setFormData({ ...formData, name, slug });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">URL Slug</label>
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-primary outline-none transition-all text-sm font-space"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-2">Master Description</label>
              <textarea
                rows="3"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/60 focus:border-primary outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            {/* FAQ BUILDER */}
            <div className="space-y-6 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                   <h4 className="font-orbitron font-bold text-xs tracking-widest flex items-center gap-2 text-primary">
                     <HelpCircle size={14} /> PROCEDURAL FAQS
                   </h4>
                   <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">Rich HTML Support Enabled for Answers</p>
                </div>
                <button type="button" onClick={addFaq} className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary transition-all">
                   <Plus size={16} />
                </button>
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="p-8 bg-white/5 rounded-[32px] border border-white/5 relative group/faq">
                    <button type="button" onClick={() => removeFaq(index)} className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white opacity-0 group-hover/faq:opacity-100 transition-all scale-75 group-hover:scale-100">
                      <Trash2 size={12} />
                    </button>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Question</label>
                        <input 
                          placeholder="What is the recovery time?"
                          className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-xs font-bold uppercase tracking-wide pb-2"
                          value={faq.q}
                          onChange={(e) => updateFaq(index, 'q', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 faq-rich-editor">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Detailed Answer (Rich Text)</label>
                        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                           <ReactQuill 
                             theme="snow"
                             modules={quillModules}
                             value={faq.a}
                             onChange={(val) => updateFaq(index, 'a', val)}
                             placeholder="Provide a detailed clinical answer..."
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {formData.faqs.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[40px]">
                     <HelpCircle size={40} className="mx-auto text-white/5 mb-4" />
                     <p className="text-[10px] text-white/20 uppercase tracking-widest font-space">No FAQs initialized for this service.</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-5 rounded-3xl shadow-[0_10px_40px_rgba(255,0,51,0.3)]">
               <span className="font-orbitron font-bold text-xs uppercase tracking-[0.3em]">{editingId ? 'Update Master Record' : 'Initialize Procedure'}</span>
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-white/20 font-orbitron uppercase tracking-widest">Synchronizing Master Records...</div>
          ) : (
            services.map((svc) => (
              <div key={svc.id} className="glassmorphism p-8 rounded-[40px] border border-white/5 flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform border border-primary/20">
                    <Stethoscope size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-orbitron font-bold text-lg uppercase tracking-tight">{svc.name}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] text-white/20 font-space tracking-widest uppercase">/{svc.slug}</span>
                      <div className="px-2 py-0.5 bg-primary/10 rounded-md flex items-center gap-1 text-primary text-[8px] font-black uppercase tracking-widest">
                         <MessageSquare size={8} />
                         <span>{JSON.parse(svc.faqs || '[]').length} FAQS</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEdit(svc)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/60 hover:text-white transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(svc.id)} className="p-4 bg-red-500/10 hover:bg-red-500 rounded-2xl text-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        .faq-rich-editor .ql-toolbar {
          border: none !important;
          background: rgba(255,255,255,0.02) !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .faq-rich-editor .ql-container {
          border: none !important;
          min-height: 100px;
        }
        .faq-rich-editor .ql-editor {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 11px !important;
          color: rgba(255,255,255,0.5) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
