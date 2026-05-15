import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import Location from '@/models/Location';
import Service from '@/models/Service';
import State from '@/models/State';
import ServiceLocation from '@/models/ServiceLocation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck, Layout, Stethoscope, Check, HelpCircle, ChevronDown } from 'lucide-react';
import Image from 'next/image';
export async function generateMetadata({ params }) {
  const { state, slug } = await params;
  const metadata = await getPageMetadata(`/${state}/${slug}`);
  return metadata;
}

export default async function DynamicPage({ params }) {
  const { state, slug } = await params;
  
  // 0. Verify State exists
  const stateDoc = await State.findOne({ where: { slug: state } });
  if (!stateDoc) return notFound();

  // 1. Handle Location-Specific Service Page (e.g. robotic-knee-surgery-in-ludhiana)
  if (slug.includes('-in-')) {
    const parts = slug.split('-in-'); 
    const serviceSlug = parts[0];
    const locationSlug = parts[1];

    const [service, location] = await Promise.all([
      Service.findOne({ where: { slug: serviceSlug } }),
      Location.findOne({ 
        where: { slug: locationSlug, state_id: stateDoc.id },
        include: [{ model: State, attributes: ['slug'] }]
      })
    ]);

     

    if (service && location) {
      const junction = await ServiceLocation.findOne({ 
        where: { service_id: service.id, location_id: location.id } 
      });
      
      return <ServiceInLocationPage service={service} location={location} junction={junction} />;
    }
  }

  // 2. Handle Standalone Service Page (e.g. robotic-knee-surgery)
  const service = await Service.findOne({ where: { slug } });
  if (service) {
    return <ServiceDetailPage service={service} state={stateDoc} />;
  }

  // 3. Handle Standalone Location Page (e.g. ludhiana)
  const location = await Location.findOne({ 
    where: { slug, state_id: stateDoc.id },
    include: [{ model: State, attributes: ['slug'] }]
  });
  if (location) {
    return <LocationDetailPage location={location} />;
  }

  return notFound();
}

// --- SUB-COMPONENTS ---

async function ServiceInLocationPage({ service, location, junction }) {
  let faqs = [];
  try {
    const localFaqs = JSON.parse(junction?.faqs || '[]');
    const masterFaqs = JSON.parse(service.faqs || '[]');
    faqs = localFaqs.length > 0 ? localFaqs : masterFaqs;
  } catch (e) {
    faqs = [];
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  // Fetch page-specific scripts from SEO table
  const seoData = await getPageMetadata(`/${location.State.slug}/${service.slug}-in-${location.slug}`);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Dynamic FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Database-stored Scripts (from Admin) */}
      {seoData?.header_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.header_scripts }} />
      )}

      <Navbar />
      <Hero service={service} location={location} junction={junction} />
      
      <div className="container mx-auto py-6 px-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
             <div className="prose prose-invert prose-primary max-w-none">
                <h2 className="font-orbitron text-3xl font-black mb-8 uppercase tracking-tighter">PROCEDURE OVERVIEW</h2>
                <div 
                  className="rich-content text-white/60 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: junction?.content || service.description || `Advanced ${service.name} using AI-powered robotic precision.` }}
                />
             </div>

             <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <ShieldCheck size={80} />
                </div>
                <h3 className="font-orbitron font-bold text-xl mb-6 text-primary uppercase">CLINICAL ADVANTAGES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     "Sub-millimeter Surgical Precision",
                     "Minimally Invasive Techniques",
                     "Reduced Post-operative Pain",
                     "Faster Return to Daily Activities"
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                           <Check size={16} className="text-primary" />
                        </div>
                        <span className="text-sm font-space text-white/80">{item}</span>
                     </div>
                   ))}
                </div>
             </div>

             {faqs.length > 0 && (
               <div className="space-y-8 pt-12">
                  <h2 className="font-orbitron text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                     <HelpCircle className="text-primary" size={32} />
                     Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                     {faqs.map((faq, index) => (
                       <div key={index} className="glassmorphism p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all">
                          <h4 className="font-orbitron font-bold text-sm uppercase tracking-wide text-white mb-4 flex items-center gap-3 text-left">
                             <div className="w-6 h-6 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px]">Q</div>
                             {faq.q}
                          </h4>
                          <div 
                             className="rich-content text-sm text-white/40 leading-relaxed pl-9 font-space border-l border-primary/20"
                             dangerouslySetInnerHTML={{ __html: faq.a }}
                          />
                       </div>
                     ))}
                  </div>
               </div>
             )}
          </div>

          <div className="space-y-8">
             <div className="glassmorphism p-8 rounded-[40px] border border-primary/20 bg-primary/5 sticky top-32">
                <h4 className="font-orbitron font-bold text-lg mb-6 uppercase tracking-wider">SECURE APPOINTMENT</h4>
                <p className="text-sm text-white/40 mb-8 leading-relaxed">Book your robotic consultation in {location.name} today.</p>
                <div className="space-y-4">
                   <Link href="/book-appointment" className="w-full btn-primary flex items-center justify-center gap-3">
                      <Calendar size={18} />
                      <span>Book in {location.name}</span>
                   </Link>
                   <a href="tel:+919915048877" className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 font-orbitron font-bold text-xs tracking-widest hover:bg-white/5 transition-all">
                      <Phone size={16} className="text-primary" />
                      <span>+91 99150-48877</span>
                   </a>
                </div>
             </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

async function ServiceDetailPage({ service, state }) {
  const locations = await Location.findAll({ 
    where: { state_id: state.id },
    limit: 12,
    include: [{ model: State, attributes: ['slug'] }]
  });

  let faqs = [];
  try {
    faqs = JSON.parse(service.faqs || '[]');
  } catch (e) {
    faqs = [];
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Navbar />
      <section className="pt-40 pb-24 px-6  relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-1 px-3 mb-6 rounded-full bg-primary/10 border border-primary/30">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-primary text-[10px] uppercase tracking-widest font-bold">Clinical Masterclass</span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-8xl font-black mb-8 uppercase tracking-tighter leading-[0.8] italic">
            {service.name}
          </h1>
          <p className="font-inter text-xl text-white/40 leading-relaxed mb-16 max-w-3xl mx-auto">
            {service.description || `Experience the pinnacle of robotic surgery with Kalyan's AI-driven technology.`}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {locations.map(loc => (
              <Link key={loc.id} href={`/${loc.State.slug}/${service.slug}-in-${loc.slug}`} className="p-8 rounded-[32px] glassmorphism border border-white/10 hover:border-primary/40 transition-all group">
                <span className="block font-orbitron font-bold text-sm uppercase mb-2 group-hover:text-primary transition-colors">{loc.name} Center</span>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/20 uppercase tracking-widest">Active Robotic Node</span>
                  <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

async function LocationDetailPage({ location }) {
  const services = await Service.findAll({ limit: 12 });
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
            KALYAN <span className="text-primary metallic-text">{location.name}</span>
          </h1>
          <p className="font-inter text-xl text-white/40 leading-relaxed mb-16">
            Our specialized robotic surgical center in {location.name} provides advanced AI-driven treatments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {services.map(svc => (
              <Link key={svc.id} href={`/${location.State.slug}/${svc.slug}-in-${location.slug}`} className="p-8 rounded-[32px] glassmorphism border border-white/10 hover:border-primary/40 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-orbitron font-bold text-lg uppercase mb-1">{svc.name}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Available in {location.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Hero({ service, location, junction }) {
  return (
    <section className="pt-40 pb-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="container mx-auto max-w-6xl relative z-10 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-3/5">
            <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
              {service.name} <br/>
              <span className="text-white/60">IN</span> <span className="text-primary metallic-text">{location.name}</span>
            </h1>
            <p className="font-inter text-xl text-white/40 leading-relaxed mb-10 max-w-2xl">
              {junction?.description || `Advanced robotic surgery in ${location.name}.`}
            </p>
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <Link href="/book-appointment" className="btn-primary flex items-center gap-3">
                <Calendar size={18} />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
          <div className="relative h-[500px] w-[500px]">
            <Image src={'/kalyan_Images/robo.png'} fill/>
          </div>
        </div>
      </div>
    </section>
  );
}
