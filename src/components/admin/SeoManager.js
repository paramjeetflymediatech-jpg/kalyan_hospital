'use client';
import React, { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Globe, Loader2, CheckCircle, AlertCircle, Plus, Search, Trash2 } from 'lucide-react';

export default function SeoManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pages, setPages] = useState([]);

  const selectedPath = searchParams.get('path') || 'GLOBAL';

  const setSelectedPath = (path) => {
    const params = new URLSearchParams(searchParams);
    params.set('path', path);
    router.push(`/admin?${params.toString()}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPath, setNewPath] = useState('');
  const [oldPath, setOldPath] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    og_image: '',
    og_title: '',
    og_description: '',
    header_scripts: '',
    footer_scripts: '',
    canonical_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    fetchSeoData();
    setOldPath(selectedPath);
  }, [selectedPath]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/seo?list=true');
      const result = await response.json();
      if (result.success) {
        setPages(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/seo?path=${selectedPath}`);
      const result = await response.json();
      if (result.success && result.data) {
        setFormData({
          title: result.data.title || '',
          description: result.data.description || '',
          keywords: result.data.keywords || '',
          og_image: result.data.og_image || '',
          og_title: result.data.og_title || '',
          og_description: result.data.og_description || '',
          header_scripts: result.data.header_scripts || '',
          footer_scripts: result.data.footer_scripts || '',
          canonical_url: result.data.canonical_url || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          keywords: '',
          og_image: '',
          og_title: '',
          og_description: '',
          header_scripts: '',
          footer_scripts: '',
          canonical_url: ''
        });
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    if (!newPath) return;

    const formattedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;

    // Check if exists
    if (pages.some(p => p.page_path === formattedPath)) {
      alert('This page already exists in the list.');
      return;
    }

    setSaving(true);
    try {
      // Immediately create the entry in DB
      await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: formattedPath,
          title: 'New Page',
          description: '',
          keywords: ''
        }),
      });

      setSelectedPath(formattedPath);
      setNewPath('');
      setShowAddModal(false);
      fetchPages(); // Refresh the sidebar list from DB
    } catch (error) {
      console.error('Error adding new page:', error);
      alert('Failed to save new page to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: selectedPath,
          old_path: oldPath, // Send the original path to handle renames
          ...formData
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus({ type: 'success', message: 'SEO metadata updated successfully!' });
        setOldPath(selectedPath); // Update oldPath to current after success
        fetchPages();
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to update SEO metadata.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (path) => {
    if (path === 'GLOBAL' || path === '/') {
      alert('Cannot delete Global or Home Page settings.');
      return;
    }

    if (!confirm(`Are you sure you want to delete SEO settings for ${path}?`)) return;

    try {
      const response = await fetch(`/api/seo?path=${path}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setPages(pages.filter(p => p.page_path !== path));
        setSelectedPath('GLOBAL');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleUpdatePath = (e) => {
    e.preventDefault();
    if (!newPath) return;
    const formattedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;

    // Check if new path already exists
    if (pages.some(p => p.page_path === formattedPath && p.page_path !== selectedPath)) {
      alert('This URL already exists.');
      return;
    }

    // Logic: If it's an existing page, we'll save it to the NEW path on next submit
    // For now, just update the selected path reference
    setSelectedPath(formattedPath);
    setPages(pages.map(p => p.page_path === selectedPath ? { ...p, page_path: formattedPath } : p));
    setShowAddModal(false);
  };

  const filteredPages = pages.filter(p =>
    p.page_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="text-primary" size={24} />
          <h2 className="font-orbitron font-bold text-2xl">SEO Management</h2>
        </div>
        <button
          onClick={() => {
            setNewPath('');
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-all text-sm font-bold uppercase tracking-wider"
        >
          <Plus size={18} />
          Add Page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Page Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
            {filteredPages.map((page) => (
              <div key={page.page_path} className="group relative">
                <button
                  onClick={() => setSelectedPath(page.page_path)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${selectedPath === page.page_path
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(255,0,51,0.1)]'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                  <span className="font-orbitron font-bold text-[10px] tracking-wider uppercase block truncate pr-6">
                    {page.page_path === 'GLOBAL' ? '🌍 Global Settings' : page.title || 'Untitled Page'}
                  </span>
                  <p className="text-[9px] opacity-40 mt-1 font-space truncate pr-6">{page.page_path}</p>
                </button>

                {page.page_path !== 'GLOBAL' && page.page_path !== '/' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(page.page_path);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:text-primary transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SEO Form */}
        <div className="lg:col-span-3">
          <div className="glassmorphism p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {selectedPath !== 'GLOBAL' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-primary font-space font-bold">Page URL (Path)</label>
                    <input
                      type="text"
                      value={selectedPath}
                      onChange={(e) => setSelectedPath(e.target.value)}
                      className="w-full bg-white/10 border border-primary/30 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none font-mono"
                      placeholder="/new-page-path"
                    />
                    <p className="text-[10px] text-white/40 px-2 italic">Changing this will move the SEO data to the new URL.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-space">
                    {selectedPath === 'GLOBAL' ? 'Site Name / Suffix' : 'Meta Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                    placeholder={selectedPath === 'GLOBAL' ? 'Kalyan Robotic Hospital' : 'Enter page title'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-space">
                    {selectedPath === 'GLOBAL' ? 'Default Description' : 'Meta Description'}
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none resize-none"
                    placeholder={selectedPath === 'GLOBAL' ? 'Default site description used when page-specific is missing' : 'Enter meta description'}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-space">
                    {selectedPath === 'GLOBAL' ? 'Global Keywords' : 'Keywords (Comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                    placeholder="robotic surgery, knee replacement, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-space">Canonical URL</label>
                  <input
                    type="text"
                    value={formData.canonical_url}
                    onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                    placeholder="https://example.com/page-url"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-space">OG Image URL</label>
                  <input
                    type="text"
                    value={formData.og_image}
                    onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-space">OG Title</label>
                    <input
                      type="text"
                      value={formData.og_title}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                      placeholder="Social media title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-space">OG Description</label>
                    <input
                      type="text"
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                      placeholder="Social media description"
                    />
                  </div>
                </div>

                {selectedPath === 'GLOBAL' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-primary font-space">Header Scripts (GTM, Analytics, etc.)</label>
                      <textarea
                        rows="6"
                        value={formData.header_scripts}
                        onChange={(e) => setFormData({ ...formData, header_scripts: e.target.value })}
                        className="w-full bg-white/5 border border-primary/20 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none font-mono text-[10px]"
                        placeholder="<!-- Paste scripts for <head> here -->"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-primary font-space">Footer Scripts (Pixels, Chat, etc.)</label>
                      <textarea
                        rows="6"
                        value={formData.footer_scripts}
                        onChange={(e) => setFormData({ ...formData, footer_scripts: e.target.value })}
                        className="w-full bg-white/5 border border-primary/20 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none font-mono text-[10px]"
                        placeholder="<!-- Paste scripts for end of <body> here -->"
                      ></textarea>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary w-full flex items-center justify-center gap-3 py-4"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save SEO Settings</span>
                      </>
                    )}
                  </button>
                </div>

                {status && (
                  <div className={`flex items-center gap-4 p-4 rounded-xl border ${status.type === 'success'
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                    } animate-in fade-in slide-in-from-top-2`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-medium">{status.message}</p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Add Page Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glassmorphism w-full max-w-md p-8 rounded-3xl border border-white/20 animate-in zoom-in-95 duration-200">
            <h3 className="font-orbitron font-bold text-xl mb-6">Add New Page</h3>
            <form onSubmit={handleAddPage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-space">Page Path (URL)</label>
                <input
                  autoFocus
                  type="text"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-primary transition-all outline-none"
                  placeholder="/our-team or /services/knee-surgery"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-all font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3"
                >
                  Add Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
