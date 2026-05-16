import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import Service from '@/models/Service';
import Link from 'next/link';
import { Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import RenderTags from '@/components/RenderTags';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/services');
  return metadata || {
    title: "Robotic Surgery Services | Kalyan Robotic Hospital Punjab",
    description: "Explore our range of AI-powered robotic surgery services including Knee Replacement, Hip Replacement, and Spine Surgery in Punjab.",
  };
}

export default async function ServicesPage() {
  const services = await Service.findAll({ order: [['name', 'ASC']] });
  const seoData = await getPageMetadata('/services');

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Page-specific Scripts (SSR / View Source) */}
      <RenderTags tags={seoData?.page_header_tags} useStandardTags={true} />

      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40">
            <Stethoscope size={16} className="text-primary" />
            <span className="text-white text-[10px] uppercase tracking-widest font-bold">Advanced Surgical Modules</span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
            OUR ROBOTIC <br/><span className="text-primary metallic-text">SPECIALTIES</span>
          </h1>
          <p className="font-inter text-xl text-white/40 leading-relaxed max-w-2xl mx-auto">
            Combining artificial intelligence with human mastery to deliver surgical outcomes with sub-millimeter precision.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <div key={svc.id} className="glassmorphism p-10 rounded-[40px] border border-white/10 hover:border-primary/40 transition-all group relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Stethoscope size={200} className="text-primary" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Stethoscope size={32} className="text-primary" />
                  </div>
                  
                  <h3 className="font-orbitron font-bold text-3xl mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {svc.name}
                  </h3>
                  
                  <p className="text-white/40 text-lg leading-relaxed mb-10 line-clamp-3">
                    {svc.description || "Cutting-edge robotic-assisted procedure designed for maximum precision, minimal blood loss, and accelerated patient recovery."}
                  </p>
 
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {[
                      "AI Alignment",
                      "3D Planning",
                      "Minimally Invasive",
                      "Fast Recovery"
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-space uppercase tracking-widest text-white/20">
                        <CheckCircle2 size={14} className="text-primary/40" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
 
                  <Link 
                    href="/locations"
                    className="inline-flex items-center gap-3 py-4 px-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-primary/10 hover:border-primary/40 transition-all font-orbitron font-bold text-xs uppercase tracking-widest"
                  >
                    <span>Check Availability in Punjab</span>
                    <ArrowRight size={16} className="text-primary" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      <Footer />

      {/* Page-specific Footer Scripts (SSR / View Source) */}
      <RenderTags tags={seoData?.page_footer_tags} useStandardTags={true} />
    </main>
  );
}
