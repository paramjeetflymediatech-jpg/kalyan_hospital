import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import Location from '@/models/Location';
import Service from '@/models/Service';
import State from '@/models/State';
import ServiceLocation from '@/models/ServiceLocation';
import Link from 'next/link';
import { ArrowRight, Globe, Layers, MapPin, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import HeadScript from '@/components/Seo/HeadScript';

export async function generateMetadata() {
  const seoData = await getPageMetadata('/sitemap');
  return {
    title: seoData?.title || 'Sitemap | Kalyan Robotic Hospital',
    description: seoData?.description || 'Browse all active robotic surgery services, location-specific surgical centers, and pages at Kalyan Robotic Hospital.',
    alternates: seoData?.alternates,
    openGraph: seoData?.openGraph,
    twitter: seoData?.twitter,
  };
}

export default async function SitemapPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));
  const limit = 30;
  const offset = (currentPage - 1) * limit;

  const seoData = await getPageMetadata('/sitemap');

  // 1. Static Pages list
  const staticPages = [
    { name: 'Home Node', href: '/' },
    { name: 'About Dr. Rajinder & Kalyan', href: '/about' },
    { name: 'Robotic Surgery Videos', href: '/videos' },
    { name: 'Blogs & Medical Insights', href: '/blogs' },
    { name: 'Robotic Center Locations', href: '/locations' },
    { name: 'Book Robotic Consultation', href: '/book-appointment' },
  ];

  // 2. Fetch States & Services
  const [states, services] = await Promise.all([
    State.findAll({ where: { is_active: true } }),
    Service.findAll()
  ]);

  // 3. Fetch Paginated Service Locations (Junctions)
  const { count, rows: junctions } = await ServiceLocation.findAndCountAll({
    limit,
    offset,
    distinct: true,
    include: [
      { model: Service },
      { 
        model: Location,
        include: [{ model: State }]
      }
    ]
  });

  const totalPages = Math.ceil(count / limit);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {seoData?.page_header && <HeadScript html={seoData.page_header} />}
      
      <Navbar />

      {/* Hero / Header Section */}
      <section className="pt-40 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-1 px-3 mb-6 rounded-full bg-primary/10 border border-primary/30">
            <Activity size={14} className="text-primary animate-pulse" />
            <span className="text-primary text-[10px] uppercase tracking-[0.2em] font-bold">System Navigation Map</span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-[0.9]">
            SYSTEM <span className="text-primary metallic-text">SITEMAP</span>
          </h1>
          <p className="font-inter text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
            Comprehensive index of Kalyan Robotic Hospital's digital nodes, clinical services, and active regional centers.
          </p>
        </div>
      </section>

      {/* Main Sitemap Content */}
      <section className="pb-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Static & Main Nodes */}
            <div className="space-y-8">
              <div className="glassmorphism p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <Globe size={80} />
                </div>
                <h3 className="font-orbitron font-black text-xl mb-6 text-primary tracking-tight uppercase flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Static Nodes
                </h3>
                <ul className="space-y-4">
                  {staticPages.map((page, idx) => (
                    <li key={idx}>
                      <Link 
                        href={page.href} 
                        className="group flex items-center justify-between py-2 px-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all"
                      >
                        <span className="font-space text-sm font-bold text-white/80 group-hover:text-white transition-colors">{page.name}</span>
                        <ArrowRight size={14} className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services List grouped by States */}
              <div className="glassmorphism p-8 rounded-[32px] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  {/* <Layers size={80} /> */}
                </div>
                <h3 className="font-orbitron font-black text-xl mb-6 text-primary tracking-tight uppercase flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  {/* Services by State */}
                </h3>
                
                <div className="space-y-8">
                  {[].map((state) => (
                    <div key={state.id} className="space-y-3">
                      <h4 className="font-orbitron font-bold text-sm uppercase tracking-wider text-white/40 border-b border-white/5 pb-2">
                        {state.name}
                      </h4>
                      <ul className="space-y-2 pl-2">
                        {services.map((service) => (
                          <li key={service.id}>
                            <Link 
                              href={`/${state.slug}/${service.slug}`}
                              className="group flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors py-1"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-all"></div>
                              <span className="font-space text-xs font-bold uppercase tracking-wide">{service.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 Columns: Paginated Service Locations */}
            <div className="lg:col-span-2">
              <div className="glassmorphism p-8 rounded-[32px] border border-white/5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h3 className="font-orbitron font-black text-xl text-primary tracking-tight uppercase flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      Robotic Surgery Locations
                    </h3>
                    <span className="font-space text-xs font-bold text-white/40 uppercase tracking-widest bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                      Total Locations: {count}
                    </span>
                  </div>

                  {junctions.length === 0 ? (
                    <div className="text-center py-16 text-white/40 font-space">
                      No active location nodes found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {junctions
                        .filter(j => j.Location && j.Location.State && j.Service)
                        .map((j) => {
                          const stateSlug = j.Location.State.slug;
                          const serviceSlug = j.Service.slug;
                          const locationSlug = j.Location.slug;
                          const targetUrl = `/${stateSlug}/${serviceSlug}-in-${locationSlug}`;
                          return (
                            <Link 
                              key={j.id} 
                              href={targetUrl}
                              className="p-5 rounded-2xl border border-white/5 hover:border-primary/30 bg-white/[0.01] hover:bg-white/[0.03] transition-all group flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                                  <MapPin size={12} className="text-primary" />
                                  <span className="font-orbitron font-bold text-xs uppercase tracking-wide">
                                    {j.Location.name} Center
                                  </span>
                                </div>
                                <span className="block font-space text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                                  {j.Service.name}
                                </span>
                              </div>
                              <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all mt-1" />
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between gap-4 flex-wrap">
                    <span className="font-space text-xs font-bold text-white/40 uppercase tracking-widest">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {currentPage > 1 ? (
                        <Link 
                          href={`/sitemap?page=${currentPage - 1}`}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-white transition-all"
                          title="Previous Page"
                        >
                          <ChevronLeft size={18} />
                        </Link>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 cursor-not-allowed">
                          <ChevronLeft size={18} />
                        </div>
                      )}

                      {/* Display brief page indicator list if appropriate */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Keep pagination around current page
                        let pageNum = i + 1;
                        if (currentPage > 3) {
                          pageNum = currentPage - 3 + i;
                        }
                        if (pageNum + (5 - i - 1) > totalPages) {
                          pageNum = Math.max(1, totalPages - 4 + i);
                        }

                        if (pageNum <= totalPages) {
                          const isActive = pageNum === currentPage;
                          return (
                            <Link
                              key={pageNum}
                              href={`/sitemap?page=${pageNum}`}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs transition-all border ${
                                isActive 
                                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]' 
                                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70 hover:text-white'
                              }`}
                            >
                              {pageNum}
                            </Link>
                          );
                        }
                        return null;
                      })}

                      {currentPage < totalPages ? (
                        <Link 
                          href={`/sitemap?page=${currentPage + 1}`}
                          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 flex items-center justify-center text-white transition-all"
                          title="Next Page"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 cursor-not-allowed">
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      {seoData?.page_footer && (
        <div dangerouslySetInnerHTML={{ __html: seoData.page_footer }} />
      )}
    </main>
  );
}
