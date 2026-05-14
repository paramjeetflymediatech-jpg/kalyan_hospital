'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ChevronRight, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse delay-700"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Image 
              src="/logo/kalyan-2.png" 
              alt="Logo" 
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-orbitron font-black text-3xl text-white tracking-tighter uppercase mb-2">
            ADMIN <span className="text-primary">PORTAL</span>
          </h1>
          <p className="text-[10px] font-space font-black text-white/40 uppercase tracking-[0.4em]">
            Secure Biometric Override Required
          </p>
        </div>

        <div className="glassmorphism p-10 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(255,0,0,0.1)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Access Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="email"
                  placeholder="admin@hospital.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white placeholder:text-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black ml-4">Security Cipher</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:border-primary/50 focus:outline-none focus:bg-white/10 transition-all font-inter text-white placeholder:text-white/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <ShieldAlert className="text-red-500 shrink-0" size={18} />
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-5 bg-primary hover:bg-primary-hover rounded-2xl font-orbitron font-black text-sm tracking-[0.2em] transition-all disabled:opacity-50 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? 'AUTHENTICATING...' : 'INITIALIZE LOGIN'}
                {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-white/20 uppercase tracking-[0.2em]">
          Authorized Personnel Only • Monitoring Active
        </p>
      </div>
    </div>
  );
}
