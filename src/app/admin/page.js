'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  LayoutDashboard, 
  Calendar, 
  Globe, 
  MessageSquare,
  Settings,
  LogOut,
  Stethoscope,
  MapPin,
  Video,
  Map as MapIcon
} from 'lucide-react';
import SeoManager from '@/components/admin/SeoManager';
import AppointmentList from '@/components/admin/AppointmentList';
import TestimonialList from '@/components/admin/TestimonialList';
import ServicesManager from '@/components/admin/ServicesManager';
import RegionsManager from '@/components/admin/RegionsManager';
import VideoManager from '@/components/admin/VideoManager';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'appointments';

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`/admin?${params.toString()}`);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
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

  const navItems = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'services', label: 'Master Services', icon: Stethoscope },
    { id: 'locations', label: 'Regional Network', icon: MapIcon },
    { id: 'videos', label: 'Video Gallery', icon: Video },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-orbitron font-black text-lg tracking-tighter">ADMIN</h1>
              <p className="text-[8px] text-white/40 tracking-[0.3em] font-space">HOSPITAL OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(255,0,51,0.1)]'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-orbitron font-bold text-xs tracking-widest uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={18} />
            <span className="font-orbitron font-bold text-xs tracking-widest uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === 'appointments' && <AppointmentList />}

          {activeTab === 'services' && <ServicesManager />}

          {activeTab === 'locations' && <RegionsManager />}

          {activeTab === 'videos' && <VideoManager />}

          {activeTab === 'seo' && <SeoManager />}

          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-primary" size={24} />
                <h2 className="font-orbitron font-bold text-2xl">Testimonials Sync</h2>
              </div>

              <div className="glassmorphism p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Database className="text-primary" size={20} />
                    <h3 className="font-orbitron font-bold text-xl tracking-tight">Sync from Google Business</h3>
                  </div>

                  <p className="text-white/60 mb-10 leading-relaxed max-w-xl">
                    Maintain high-fidelity reviews by synchronizing directly from Google. 
                    The system stores reviews in Supabase for optimal load speeds.
                  </p>

                  <div className="flex flex-col gap-6">
                    <button
                      onClick={handleSync}
                      disabled={syncing}
                      className="group relative flex items-center justify-center gap-4 py-6 px-10 bg-primary hover:bg-primary-hover rounded-2xl transition-all disabled:opacity-50 overflow-hidden max-w-md"
                    >
                      <div className={`transition-transform duration-700 ${syncing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                        <RefreshCw size={24} />
                      </div>
                      <span className="font-orbitron font-black text-lg tracking-wider">
                        {syncing ? 'SYNCHRONIZING...' : 'SYNC FROM GOOGLE'}
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>

                    {status && (
                      <div className={`flex items-center gap-4 p-6 rounded-2xl border max-w-md ${
                        status.type === 'success' 
                          ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        <p className="font-medium">{status.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-12">
                <TestimonialList />
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary font-orbitron tracking-widest uppercase">
        Initializing Hospital OS...
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
