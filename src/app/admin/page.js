'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Database, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/testimonials/sync', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus({ type: 'success', message: data.message });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error occurred during sync.' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter">
      {/* Sidebar-ish Top Nav */}
      <nav className="border-b border-white/5 bg-[#0f0f0f] px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutDashboard size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-orbitron font-black text-xl tracking-tighter">ADMIN PANEL</h1>
            <p className="text-[10px] text-white/40 tracking-[0.3em] font-space">HOSPITAL MANAGEMENT SYSTEM</p>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="glassmorphism p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <Database className="text-primary" size={20} />
              <h2 className="font-orbitron font-bold text-2xl">Testimonials Management</h2>
            </div>

            <p className="text-white/60 mb-10 leading-relaxed max-w-xl">
              Use this tool to synchronize patient reviews from your Google Business profile. 
              The system will fetch the latest reviews and store them in the local database for high-performance delivery on the landing page.
            </p>

            <div className="flex flex-col gap-6">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="group relative flex items-center justify-center gap-4 py-6 px-10 bg-primary hover:bg-primary-hover rounded-2xl transition-all disabled:opacity-50 overflow-hidden"
              >
                <div className={`transition-transform duration-700 ${syncing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                  <RefreshCw size={24} />
                </div>
                <span className="font-orbitron font-black text-lg tracking-wider">
                  {syncing ? 'SYNCHRONIZING...' : 'SYNC FROM GOOGLE'}
                </span>
                
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>

              {status && (
                <div className={`flex items-center gap-4 p-6 rounded-2xl border ${
                  status.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                } animate-in fade-in slide-in-from-top-4 duration-500`}>
                  {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                  <p className="font-medium">{status.message}</p>
                </div>
              )}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 tracking-widest uppercase mb-2 font-space">Configuration Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-orbitron font-bold text-sm">Database Connected</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 tracking-widest uppercase mb-2 font-space">Cache Strategy</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="font-orbitron font-bold text-sm">Manual Sync Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
