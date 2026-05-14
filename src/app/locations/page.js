import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import LocationExplorer from '@/components/LocationExplorer';
import { MapPin } from 'lucide-react';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/locations');
  return metadata || {
    title: "Best Robotic Surgery in India | Our Service Locations",
    description: "Explore the best robotic knee and spine surgery services available across India. Find the nearest Kalyan Robotic Hospital hub.",
  };
}

export default async function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40">
            <MapPin size={16} className="text-primary" />
            <span className="text-white text-[10px] uppercase tracking-widest font-bold">Nationwide Network</span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
            DISCOVER <br/><span className="text-primary metallic-text">LOCATIONS</span>
          </h1>
          <p className="font-inter text-xl text-white/40 leading-relaxed max-w-2xl mx-auto">
            Choose your region to explore precision robotic healthcare services. 
            We are expanding across India to bring world-class AI surgery to your doorstep.
          </p>
        </div>
      </section>

      {/* Dynamic Location Explorer */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <LocationExplorer />
        </div>
      </section>

      <Footer />
    </main>
  );
}
