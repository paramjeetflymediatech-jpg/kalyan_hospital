'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, MessageSquare, Loader2, RefreshCw } from 'lucide-react';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={24} />
          <h2 className="font-orbitron font-bold text-2xl">Appointment Requests</h2>
        </div>
        <button 
          onClick={fetchAppointments}
          className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white/60 hover:text-white"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/40 font-orbitron">No appointment requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appt) => (
            <div 
              key={appt.id}
              className="glassmorphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-orbitron font-bold text-white uppercase tracking-tight">{appt.name}</p>
                      <p className="text-[10px] text-white/40 font-space tracking-widest">{appt.service}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <Phone size={14} className="text-primary" />
                      <span>{appt.phone}</span>
                    </div>
                    {appt.email && (
                      <div className="flex items-center gap-2 text-white/60">
                        <Mail size={14} className="text-primary" />
                        <span>{appt.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <p className="text-[10px] text-white/30 font-space uppercase">
                    {new Date(appt.created_at).toLocaleString()}
                  </p>
                  {appt.message && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 max-w-md">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={14} className="text-primary mt-1" />
                        <p className="text-xs text-white/60 leading-relaxed italic">{appt.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
