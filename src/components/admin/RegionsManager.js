'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { MapPin, Plus, Trash2, Edit2, Check, X, ChevronRight, Map, Building2, Stethoscope, Save, FileText, Layout, HelpCircle, MessageSquare, Search } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function RegionsManager() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [allServices, setAllServices] = useState([]);
  
  const [activeState, setActiveState] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [activeCity, setActiveCity] = useState(null);
  
  const [activeCityServices, setActiveCityServices] = useState([]);
  const [selectedServiceForContent, setSelectedServiceForContent] = useState(null);

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [searchState, setSearchState] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchCity, setSearchCity] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [savingServices, setSavingServices] = useState(false);
  const [newItem, setNewItem] = useState({ type: null, name: '', slug: '' });

    const [editingItem, setEditingItem] = useState({ type: null, id: null, name: '', slug: '' });

  const quillModules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  }), []);

  useEffect(() => {
    fetchStates();
    fetchAllServices();
  }, []);

  useEffect(() => {
    if (activeState) {
      fetchDistricts(activeState.id);
      setLocations([]);
      setActiveDistrict(null);
      setActiveCity(null);
    }
  }, [activeState]);

  useEffect(() => {
    if (activeDistrict) {
      fetchLocations(activeDistrict.id);
      setActiveCity(null);
    }
  }, [activeDistrict]);

  useEffect(() => {
    if (activeCity) {
      fetchActiveCityServices(activeCity.id);
    }
  }, [activeCity]);

  const fetchStates = async () => {
    const res = await fetch('/api/admin/states');
    const data = await res.json();
    if (data.success) setStates(data.data);
    setLoading(false);
  };

  const fetchDistricts = async (stateId) => {
    const res = await fetch(`/api/admin/districts?stateId=${stateId}`);
    const data = await res.json();
    if (data.success) setDistricts(data.data);
  };

  const fetchLocations = async (districtId) => {
    const res = await fetch(`/api/admin/locations?districtId=${districtId}`);
    const data = await res.json();
    if (data.success) setLocations(data.data);
  };

  const fetchAllServices = async () => {
    const res = await fetch('/api/admin/services');
    const data = await res.json();
    if (data.success) setAllServices(data.data);
  };

  const fetchActiveCityServices = async (locationId) => {
    const res = await fetch(`/api/admin/locations/services?locationId=${locationId}`);
    const data = await res.json();
    if (data.success) {
      const formatted = data.data.map(s => ({
        ...s,
        faqs: typeof s.faqs === 'string' ? JSON.parse(s.faqs || '[]') : (s.faqs || [])
      }));
      setActiveCityServices(formatted);
    }
  };

  const handleSave = async (type, payload) => {
    const endpoint = type === 'state' ? '/api/admin/states' : type === 'district' ? '/api/admin/districts' : '/api/admin/locations';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      if (type === 'state') fetchStates();
      else if (type === 'district') fetchDistricts(activeState.id);
      else fetchLocations(activeDistrict.id);
      setNewItem({ type: null, name: '', slug: '' });
      setEditingItem({ type: null, id: null, name: '', slug: '' });
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure? This will remove all nested regions/cities.')) return;
    const endpoint = type === 'state' ? '/api/admin/states' : type === 'district' ? '/api/admin/districts' : '/api/admin/locations';
    await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
    if (type === 'state') {
        fetchStates();
        setActiveState(null);
    }
    else if (type === 'district') {
        fetchDistricts(activeState.id);
        setActiveDistrict(null);
    }
    else {
        fetchLocations(activeDistrict.id);
        setActiveCity(null);
    }
  };

  const handleToggleService = (serviceId) => {
    const ids = activeCityServices.map(s => s.service_id);
    if (ids.includes(serviceId)) {
      setActiveCityServices(prev => prev.filter(s => s.service_id !== serviceId));
    } else {
      setActiveCityServices(prev => [...prev, { service_id: serviceId, description: '', content: '', faqs: [] }]);
    }
  };

  const handleSaveCityServices = async () => {
    setSavingServices(true);
    await fetch('/api/admin/locations/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: activeCity.id,
        services: activeCityServices.map(s => s.service_id)
      })
    });
    setSavingServices(false);
    alert('Services updated for ' + activeCity.name);
  };

  const updateServiceDetail = (serviceId, field, value) => {
    setActiveCityServices(prev => prev.map(s => 
      s.service_id === serviceId ? { ...s, [field]: value } : s
    ));
  };

  const saveServiceDetail = async (serviceId) => {
    const service = activeCityServices.find(s => s.service_id === serviceId);
    setSavingServices(true);
    await fetch('/api/admin/locations/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId: activeCity.id,
        services: [service]
      })
    });
    setSavingServices(false);
    setSelectedServiceForContent(null);
    alert('Local content updated!');
  };

  // Local FAQ Handlers
  const addLocalFaq = (serviceId) => {
    setActiveCityServices(prev => prev.map(s => 
      s.service_id === serviceId ? { ...s, faqs: [...s.faqs, { q: '', a: '' }] } : s
    ));
  };

  const removeLocalFaq = (serviceId, index) => {
    setActiveCityServices(prev => prev.map(s => 
      s.service_id === serviceId ? { ...s, faqs: s.faqs.filter((_, i) => i !== index) } : s
    ));
  };

  const updateLocalFaq = (serviceId, index, field, value) => {
    setActiveCityServices(prev => prev.map(s => {
      if (s.service_id === serviceId) {
        const newFaqs = [...s.faqs];
        newFaqs[index][field] = value;
        return { ...s, faqs: newFaqs };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Map className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="font-orbitron font-black text-3xl tracking-tight uppercase">GEOGRAPHICAL ARCHITECTURE</h2>
          <p className="text-[10px] text-white/40 tracking-[0.3em] font-space uppercase">Manage Regions, Centers & Localized Content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* State Selector */}
        <div className="relative z-[40]">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-2 mb-2 block">State / Province</label>
          <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden">
            <div 
              onClick={() => setShowStateDropdown(!showStateDropdown)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-primary" />
                <span className="font-orbitron font-bold text-xs uppercase tracking-wider">
                  {activeState ? activeState.name : 'Select State'}
                </span>
              </div>
              <ChevronRight className={`transition-transform duration-300 ${showStateDropdown ? 'rotate-90' : ''}`} size={16} />
            </div>

            {showStateDropdown && (
              <div className="border-t border-white/5 p-2 space-y-2 max-h-[300px] overflow-y-auto">
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-[10px] outline-none focus:border-primary"
                    placeholder="Filter States..."
                    value={searchState}
                    onChange={(e) => setSearchState(e.target.value)}
                  />
                </div>
                {states.filter(s => s.name.toLowerCase().includes(searchState.toLowerCase())).map(state => (
                  <div key={state.id} className="flex items-center justify-between group">
                    {editingItem.type === 'state' && editingItem.id === state.id ? (
                      <div className="flex-1 flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-primary/30">
                        <input autoFocus className="bg-transparent border-none focus:ring-0 text-[10px] font-bold w-full uppercase px-2 py-1" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                        <button onClick={() => handleSave('state', { id: state.id, name: editingItem.name })} className="p-1 text-green-500 hover:scale-110 transition-transform"><Check size={14} /></button>
                        <button onClick={() => setEditingItem({ type: null, id: null })} className="p-1 text-red-500 hover:scale-110 transition-transform"><X size={14} /></button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setActiveState(state); setShowStateDropdown(false); }}
                          className={`flex-1 text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeState?.id === state.id ? 'bg-primary text-white' : 'hover:bg-white/10 text-white/60'}`}
                        >
                          {state.name}
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 px-2 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); setEditingItem({ type: 'state', id: state.id, name: state.name }); }} className="p-1 hover:text-primary"><Edit2 size={10} /></button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete('state', state.id); }} className="p-1 hover:text-primary"><Trash2 size={10} /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <button 
                  onClick={() => setNewItem({ type: 'state', name: '' })}
                  className="w-full py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <Plus size={12} /> Add State
                </button>
              </div>
            )}
          </div>
          {newItem.type === 'state' && (
             <div className="mt-2 p-3 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-2">
               <input autoFocus className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase" placeholder="NEW STATE NAME" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
               <button onClick={() => handleSave('state', { name: newItem.name })} className="p-1 text-green-500"><Check size={16} /></button>
               <button onClick={() => setNewItem({ type: null })} className="p-1 text-red-500"><X size={16} /></button>
             </div>
          )}
        </div>

        {/* District Selector */}
        <div className={`relative z-[30] ${!activeState ? 'opacity-20 pointer-events-none' : ''}`}>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-2 mb-2 block">District / Region</label>
          <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden">
            <div 
              onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-primary" />
                <span className="font-orbitron font-bold text-xs uppercase tracking-wider">
                  {activeDistrict ? activeDistrict.name : 'Select District'}
                </span>
              </div>
              <ChevronRight className={`transition-transform duration-300 ${showDistrictDropdown ? 'rotate-90' : ''}`} size={16} />
            </div>

            {showDistrictDropdown && (
              <div className="border-t border-white/5 p-2 space-y-2 max-h-[300px] overflow-y-auto">
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-[10px] outline-none focus:border-primary"
                    placeholder="Filter Districts..."
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                  />
                </div>
                {districts.filter(d => d.name.toLowerCase().includes(searchDistrict.toLowerCase())).map(district => (
                  <div key={district.id} className="flex items-center justify-between group">
                    {editingItem.type === 'district' && editingItem.id === district.id ? (
                      <div className="flex-1 flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-primary/30">
                        <input autoFocus className="bg-transparent border-none focus:ring-0 text-[10px] font-bold w-full uppercase px-2 py-1" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                        <button onClick={() => handleSave('district', { id: district.id, name: editingItem.name, state_id: activeState.id })} className="p-1 text-green-500 hover:scale-110 transition-transform"><Check size={14} /></button>
                        <button onClick={() => setEditingItem({ type: null, id: null })} className="p-1 text-red-500 hover:scale-110 transition-transform"><X size={14} /></button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setActiveDistrict(district); setShowDistrictDropdown(false); }}
                          className={`flex-1 text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeDistrict?.id === district.id ? 'bg-primary text-white' : 'hover:bg-white/10 text-white/60'}`}
                        >
                          {district.name}
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 px-2 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); setEditingItem({ type: 'district', id: district.id, name: district.name }); }} className="p-1 hover:text-primary"><Edit2 size={10} /></button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete('district', district.id); }} className="p-1 hover:text-primary"><Trash2 size={10} /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <button 
                  onClick={() => setNewItem({ type: 'district', name: '' })}
                  className="w-full py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <Plus size={12} /> Add District
                </button>
              </div>
            )}
          </div>
          {newItem.type === 'district' && (
             <div className="mt-2 p-3 bg-primary/5 rounded-2xl border border-primary/20 flex items-center gap-2">
               <input autoFocus className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full uppercase" placeholder="NEW DISTRICT NAME" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
               <button onClick={() => handleSave('district', { name: newItem.name, state_id: activeState.id })} className="p-1 text-green-500"><Check size={16} /></button>
               <button onClick={() => setNewItem({ type: null })} className="p-1 text-red-500"><X size={16} /></button>
             </div>
          )}
        </div>

        {/* City Selector */}
        <div className={`relative z-[20] ${!activeDistrict ? 'opacity-20 pointer-events-none' : ''}`}>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-2 mb-2 block">City / Center</label>
          <div className="glassmorphism rounded-2xl border border-white/10 overflow-hidden">
            <div 
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-primary" />
                <span className="font-orbitron font-bold text-xs uppercase tracking-wider">
                  {activeCity ? activeCity.name : 'Select City'}
                </span>
              </div>
              <ChevronRight className={`transition-transform duration-300 ${showCityDropdown ? 'rotate-90' : ''}`} size={16} />
            </div>

            {showCityDropdown && (
              <div className="border-t border-white/5 p-2 space-y-2 max-h-[300px] overflow-y-auto">
                <div className="relative mb-2">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-[10px] outline-none focus:border-primary"
                    placeholder="Filter Cities..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                </div>
                {locations.filter(c => c.name.toLowerCase().includes(searchCity.toLowerCase())).map(city => (
                  <div key={city.id} className="flex items-center justify-between group">
                    {editingItem.type === 'city' && editingItem.id === city.id ? (
                      <div className="flex-1 flex flex-col gap-2 p-2 bg-white/5 rounded-lg border border-primary/30">
                        <input autoFocus className="bg-transparent border-b border-white/10 focus:ring-0 text-[10px] font-bold w-full uppercase py-1" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} />
                        <input className="bg-transparent border-none focus:ring-0 text-[8px] w-full text-white/40" value={editingItem.slug} onChange={(e) => setEditingItem({...editingItem, slug: e.target.value})} />
                        <div className="flex justify-end gap-2">
                           <button onClick={() => handleSave('city', { id: city.id, name: editingItem.name, slug: editingItem.slug, state_id: activeState.id, district_id: activeDistrict.id })} className="p-1 text-green-500 hover:scale-110 transition-transform"><Check size={14} /></button>
                           <button onClick={() => setEditingItem({ type: null, id: null })} className="p-1 text-red-500 hover:scale-110 transition-transform"><X size={14} /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setActiveCity(city); setShowCityDropdown(false); }}
                          className={`flex-1 text-left px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${activeCity?.id === city.id ? 'bg-primary text-white' : 'hover:bg-white/10 text-white/60'}`}
                        >
                          <div className="flex flex-col">
                            <span>{city.name}</span>
                            <span className="text-[8px] opacity-40 lowercase tracking-normal">/{city.slug}</span>
                          </div>
                        </button>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 px-2 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); setEditingItem({ type: 'city', id: city.id, name: city.name, slug: city.slug }); }} className="p-1 hover:text-primary"><Edit2 size={10} /></button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete('city', city.id); }} className="p-1 hover:text-primary"><Trash2 size={10} /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <button 
                  onClick={() => setNewItem({ type: 'city', name: '', slug: '' })}
                  className="w-full py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <Plus size={12} /> Add City
                </button>
              </div>
            )}
          </div>
          {newItem.type === 'city' && (
             <div className="mt-2 p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
               <input autoFocus className="bg-transparent border-b border-primary/20 focus:ring-0 text-xs font-bold w-full uppercase" placeholder="CITY NAME" value={newItem.name} onChange={(e) => { const n = e.target.value; setNewItem({...newItem, name: n, slug: n.toLowerCase().replace(/ /g, '-')}); }} />
               <div className="flex justify-end gap-2">
                 <button onClick={() => handleSave('city', { name: newItem.name, slug: newItem.slug, state_id: activeState.id, district_id: activeDistrict.id })} className="px-3 py-1 bg-primary rounded-lg text-[10px] font-bold uppercase">Save</button>
                 <button onClick={() => setNewItem({ type: null })} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase">Cancel</button>
               </div>
             </div>
          )}
        </div>

        {/* Column 4: Local Services */}
        <div className={`glassmorphism rounded-[40px] border border-white/5 overflow-hidden flex flex-col min-h-[600px] transition-all ${!activeCity ? 'opacity-20 grayscale' : ''}`}>
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/10">
            <h3 className="font-orbitron font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 text-primary">
               Services Hub
            </h3>
            {activeCity && (
              <button onClick={handleSaveCityServices} disabled={savingServices} className="p-2 bg-primary rounded-lg text-white hover:shadow-[0_0_15px_rgba(255,0,51,0.5)] transition-all">
                <Save size={14} />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
             {allServices.map(svc => {
               const isActive = activeCityServices.some(s => s.service_id === svc.id);
               return (
                 <div key={svc.id} className="relative group/svc">
                   <label className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 cursor-pointer transition-all ${isActive ? 'bg-primary/5' : ''}`}>
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-white shadow-[0_0_10px_rgba(255,0,51,0.3)]' : 'bg-white/5 text-white/20'}`}>
                          <Stethoscope size={12} />
                        </div>
                        <span className={`font-orbitron font-bold text-[9px] uppercase tracking-wider ${isActive ? 'text-white' : 'text-white/40'}`}>
                          {svc.name}
                        </span>
                     </div>
                     <input type="checkbox" checked={isActive} onChange={() => handleToggleService(svc.id)} className="w-3 h-3 rounded border-white/10 bg-white/5 text-primary focus:ring-0" />
                   </label>
                   
                   {isActive && (
                     <button onClick={() => setSelectedServiceForContent(svc)} className="absolute right-10 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-primary hover:text-white rounded-lg text-white/40 transition-all opacity-0 group-hover/svc:opacity-100">
                       <FileText size={12} />
                     </button>
                   )}
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* Local Content Editor Modal */}
      {selectedServiceForContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedServiceForContent(null)}></div>
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(255,0,51,0.2)] max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-2xl text-white">
                  <Layout size={20} />
                </div>
                <div>
                   <h3 className="font-orbitron font-bold text-lg uppercase tracking-tight">{selectedServiceForContent.name}</h3>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest font-space">Localized Clinical Narrative for {activeCity.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedServiceForContent(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-2">Localized Description</label>
                 <textarea 
                   rows="2"
                   className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/60 focus:border-primary outline-none transition-all resize-none"
                   value={activeCityServices.find(s => s.service_id === selectedServiceForContent.id)?.description || ''}
                   onChange={(e) => updateServiceDetail(selectedServiceForContent.id, 'description', e.target.value)}
                 ></textarea>
               </div>

               <div className="space-y-3 rich-editor-container">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-2">Rich Content (HTML Enabled)</label>
                 <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                   <ReactQuill theme="snow" modules={quillModules} value={activeCityServices.find(s => s.service_id === selectedServiceForContent.id)?.content || ''} onChange={(val) => updateServiceDetail(selectedServiceForContent.id, 'content', val)} />
                 </div>
               </div>

               {/* LOCAL FAQ BUILDER */}
               <div className="space-y-6 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                     <h4 className="font-orbitron font-bold text-xs tracking-widest flex items-center gap-2 text-primary uppercase">
                        <HelpCircle size={14} /> City-Specific FAQs
                     </h4>
                     <button onClick={() => addLocalFaq(selectedServiceForContent.id)} className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary transition-all">
                        <Plus size={16} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     {activeCityServices.find(s => s.service_id === selectedServiceForContent.id)?.faqs.map((faq, index) => (
                        <div key={index} className="p-6 bg-white/5 rounded-3xl border border-white/5 relative group/faq">
                           <button onClick={() => removeLocalFaq(selectedServiceForContent.id, index)} className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all">
                              <Trash2 size={12} />
                           </button>
                           <div className="space-y-4">
                              <input placeholder="LOCAL QUESTION" className="w-full bg-transparent border-b border-white/10 focus:border-primary outline-none text-xs font-bold uppercase tracking-wide pb-2" value={faq.q} onChange={(e) => updateLocalFaq(selectedServiceForContent.id, index, 'q', e.target.value)} />
                              <div className="rich-editor-container mini-quill">
                                 <ReactQuill theme="snow" modules={{ toolbar: [['bold', 'italic', 'link']] }} value={faq.a} onChange={(val) => updateLocalFaq(selectedServiceForContent.id, index, 'a', val)} placeholder="Local answer..." />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white/5 border-t border-white/5">
               <button onClick={() => saveServiceDetail(selectedServiceForContent.id)} disabled={savingServices} className="w-full py-5 bg-primary hover:bg-red-600 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(255,0,51,0.3)]">
                 <Save size={18} />
                 <span className="font-orbitron font-bold text-xs uppercase tracking-widest">Deploy Local Narrative</span>
               </button>
            </div>
          </div>
          
          <style jsx global>{`
            .rich-editor-container .ql-toolbar { border: none !important; background: rgba(255,255,255,0.02) !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; padding: 1rem !important; }
            .rich-editor-container .ql-container { border: none !important; min-height: 200px; font-family: 'Space Grotesk', sans-serif !important; }
            .rich-editor-container .ql-editor { color: rgba(255,255,255,0.6) !important; padding: 1.5rem !important; }
            .mini-quill .ql-container { min-height: 80px !important; }
            .mini-quill .ql-editor { padding: 1rem !important; font-size: 11px !important; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          `}</style>
        </div>
      )}
    </div>
  );
}
