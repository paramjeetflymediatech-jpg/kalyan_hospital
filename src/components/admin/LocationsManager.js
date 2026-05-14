'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, MapPin, Activity } from 'lucide-react';

export default function LocationsManager() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    is_active: true
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/admin/locations');
      const data = await res.json();
      if (data.success) setLocations(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData)
      });
      const data = await res.json();
      if (data.success) {
        fetchLocations();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This will disable all service pages for this location.')) return;
    try {
      await fetch(`/api/admin/locations?id=${id}`, { method: 'DELETE' });
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (loc) => {
    setEditingId(loc.id);
    setFormData({
      name: loc.name,
      slug: loc.slug,
      is_active: loc.is_active
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', is_active: true });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <MapPin className="text-primary" size={24} />
          </div>
          <h2 className="font-orbitron font-black text-3xl tracking-tight">LOCATION MASTER</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-[32px] border border-white/10 sticky top-8">
            <h3 className="font-orbitron font-bold text-lg mb-8 text-primary">
              {editingId ? 'EDIT LOCATION' : 'REGISTER NEW CITY'}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-2">City Name</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ludhiana"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-black ml-2">Slug</label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input
                    required
                    type="text"
                    placeholder="ludhiana"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all text-sm"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center gap-2">
                  {editingId ? <Check size={18} /> : <Plus size={18} />}
                  <span className="font-orbitron font-bold text-xs uppercase">{editingId ? 'Update' : 'Register'}</span>
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-white/20 font-orbitron uppercase tracking-widest">Scanning Grid...</div>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="glassmorphism p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-orbitron font-bold text-lg">{loc.name}</h4>
                    <p className="text-[10px] text-white/40 font-space tracking-widest uppercase mt-1">/{loc.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(loc)} className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(loc.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
