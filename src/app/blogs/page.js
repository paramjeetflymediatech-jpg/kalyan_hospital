import Navbar from '@/components/Navbar';
export const dynamic = 'force-dynamic';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

import Blog from '@/models/Blog';
import BlogInfiniteList from '@/components/BlogInfiniteList';

// Metadata and Scripts are now handled universally in layout.js

async function getBlogs() {
  try {
    const { rows, count } = await Blog.findAndCountAll({
      where: { status: 'published' },
      order: [['published_at', 'DESC']],
      limit: 12
    });
    return { rows: JSON.parse(JSON.stringify(rows)), count };
  } catch (err) {
    console.error(err);
    return { rows: [], count: 0 };
  }
}

export default async function BlogListPage() {
  const { rows, count } = await getBlogs();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
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

      {/* Blog Grid with Infinite Scroll */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <BlogInfiniteList initialBlogs={rows} total={count} />

        {rows.length === 0 && (
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
