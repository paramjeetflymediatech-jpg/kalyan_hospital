import Navbar from '@/components/Navbar';
export const dynamic = 'force-dynamic';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

import Blog from '@/models/Blog';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/blogs');
  return metadata || {
    title: "Medical Insights & Robotic Advancements | Kalyan Hospital Blog",
    description: "Stay updated with the latest in robotic surgery, orthopedic care, and medical innovations from our experts.",
  };
}

async function getBlogs() {
  try {
    const blogs = await Blog.findAll({
      where: { status: 'published' },
      order: [['published_at', 'DESC']],
      limit: 12
    });
    return blogs;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function BlogListPage() {
  const blogs = await getBlogs();
  const seoData = await getPageMetadata('/blogs');

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {seoData?.header_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.header_scripts }} />
      )}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,51,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <h1 className="font-orbitron font-black text-5xl md:text-7xl tracking-tighter uppercase">
            MEDICAL <span className="text-primary">INSIGHTS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 font-space text-lg uppercase tracking-widest">
            EXPLORING THE FRONTIERS OF ROBOTIC MEDICINE & PATIENT CARE
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blogs/${blog.slug}`}
              className="group glassmorphism rounded-[40px] border border-white/5 overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] overflow-hidden relative">
                {blog.image ? (
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="font-orbitron text-white/10 text-xs tracking-widest">NO VISUAL DATA</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                 
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest font-space">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.published_at || blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                </div>

                <h3 className="font-orbitron font-bold text-xl uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>

                <p className="text-sm text-white/40 line-clamp-3 font-space leading-relaxed">
                  {blog.excerpt || 'Read our latest insights into clinical excellence and robotic precision...'}
                </p>

                <div className="pt-4 mt-auto flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                   READ TRANSMISSION <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">📡</span>
            </div>
            <p className="font-orbitron text-white/20 uppercase tracking-widest">No transmissions active at this moment.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
