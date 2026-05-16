'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, ChevronRight, Building2, Phone, ArrowRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function LocationExplorer() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  
  const [loading, setLoading] = useState({ states: true, districts: false, cities: false, services: false });

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
      setSelectedDistrict('');
      setSelectedCityId('');
      setCities([]);
      setServices([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchCities(selectedDistrict);
      setSelectedCityId('');
      setServices([]);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedCityId) {
      fetchServices(selectedCityId);
    } else {
      setServices([]);
    }
  }, [selectedCityId]);

  const fetchStates = async () => {
    try {
      const res = await fetch('/api/states');
      const data = await res.json(); 
      if (data.success) setStates(data.data.filter((state) => state.name === "Punjab" || state.name === "Haryana" || state.name === "Jammu and Kashmir" || state.name === "Himachal Pradesh"));
    } catch (e) { console.error(e); }
    setLoading(prev => ({ ...prev, states: false }));
  };

  const fetchDistricts = async (stateId) => {
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const res = await fetch(`/api/districts?stateId=${stateId}`);
      const data = await res.json();
      if (data.success) setDistricts(data.data);
    } catch (e) { console.error(e); }
    setLoading(prev => ({ ...prev, districts: false }));
  };

  const fetchCities = async (districtId) => {
    setLoading(prev => ({ ...prev, cities: true }));
    try {
      const res = await fetch(`/api/locations?districtId=${districtId}`);
      const data = await res.json();
      if (data.success) setCities(data.data);
    } catch (e) { console.error(e); }
    setLoading(prev => ({ ...prev, cities: false }));
  };

  const fetchServices = async (locationId) => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      const res = await fetch(`/api/locations/services?locationId=${locationId}`);
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (e) { console.error(e); }
    setLoading(prev => ({ ...prev, services: false }));
  };

  const currentCity = cities.find(c => c.id == selectedCityId);

  return (
    <div className="w-full space-y-12">
      {/* Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 glassmorphism rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(255,0,51,0.1)]">
        
        {/* State Select */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary px-2">Select State</label>
          <div className="relative">
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white appearance-none focus:border-primary transition-all font-orbitron text-sm uppercase tracking-wider"
            >
              <option value="" className="bg-black">Choose State...</option>
              {states.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
            </select>
            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 rotate-90" size={20} />
          </div>
        </div>

        {/* District Select */}
        <div className={`space-y-3 transition-all duration-500 ${!selectedState ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary px-2">Select District</label>
          <div className="relative">
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white appearance-none focus:border-primary transition-all font-orbitron text-sm uppercase tracking-wider"
            >
              <option value="" className="bg-black">Choose District...</option>
              {districts.map(d => <option key={d.id} value={d.id} className="bg-black">{d.name}</option>)}
            </select>
            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 rotate-90" size={20} />
          </div>
        </div>

        {/* City Select */}
        <div className={`space-y-3 transition-all duration-500 ${!selectedDistrict ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary px-2">Select City</label>
          <div className="relative">
            <select 
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white appearance-none focus:border-primary transition-all font-orbitron text-sm uppercase tracking-wider"
            >
              <option value="" className="bg-black">Choose City...</option>
              {cities.map(c => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
            </select>
            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 rotate-90" size={20} />
          </div>
        </div>

        {/* Status Display */}
        <div className="flex items-end">
          <div className="w-full bg-primary/10 rounded-2xl p-5 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary rounded-lg text-white">
                <Search size={18} />
              </div>
              <div>
                <span className="block text-[10px] text-white/40 uppercase tracking-widest leading-none mb-1">Available</span>
                <span className="block font-orbitron font-bold text-lg text-white leading-none">
                  {selectedCityId ? `${services.length} SERVICES` : `${cities.length} CITIES`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!selectedCityId ? (
          <div className="col-span-full py-32 text-center glassmorphism rounded-[60px] border border-white/5 space-y-6">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
              <MapPin size={40} className="text-white/10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-orbitron text-2xl font-black uppercase tracking-tighter text-white/40">Initiate Scanner</h3>
              <p className="text-sm text-white/20 uppercase tracking-[0.2em] font-space">
                {!selectedState ? 'Select State' : !selectedDistrict ? 'Select District' : 'Select City'} to continue
              </p>
            </div>
          </div>
        ) : (
          services.length === 0 ? (
            <div className="col-span-full py-32 text-center glassmorphism rounded-[60px] border border-white/5 space-y-6">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                <Stethoscope size={40} className="text-white/10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-orbitron text-2xl font-black uppercase tracking-tighter text-white/40">No Services</h3>
                <p className="text-sm text-white/20 uppercase tracking-[0.2em] font-space">No specialized services currently mapped for this city</p>
              </div>
            </div>
          ) : (
            services.map((svc) => (
              <Link 
                key={svc.id} 
                href={`/${currentCity.State.slug}/${svc.slug}-in-${currentCity.slug}`}
                className="group relative glassmorphism rounded-[40px] p-8 border border-white/10 hover:border-primary/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Stethoscope size={24} />
                      </div>
                      <span className="text-[10px] font-space font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">Specialized Procedure</span>
                    </div>
                    <h3 className="font-orbitron font-black text-2xl uppercase tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors">
                      {svc.name}
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Available in {currentCity.name}</p>
                  </div>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      View Details <ArrowRight size={14} />
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )
        )}
      </div>
    </div>
  );
}
