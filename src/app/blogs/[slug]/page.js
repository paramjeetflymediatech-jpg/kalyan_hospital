import Navbar from '@/components/Navbar';
export const dynamic = 'force-dynamic';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import { Calendar, User, ArrowLeft, Share2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SidebarContactForm from '@/components/SidebarContactForm';

import Blog from '@/models/Blog';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await Blog.findOne({ where: { slug, status: 'published' } });
  
  if (!blog) return { title: "Blog Post | Kalyan Hospital" };

  const dbSeo = await getPageMetadata(`/blogs/${slug}`);

  return {
    title: dbSeo?.title || `${blog.title} | Kalyan Robotic Hospital`,
    description: dbSeo?.description || blog.excerpt || blog.title,
    keywords: dbSeo?.keywords,
    alternates: {
      canonical: dbSeo?.canonical_url || `https://kalyanrobotics.com/blogs/${slug}`,
    },
    openGraph: {
      title: dbSeo?.og_title || blog.title,
      description: dbSeo?.og_description || blog.excerpt,
      images: [dbSeo?.og_image || blog.image],
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: [blog.author],
    },
  };
}

async function getBlog(slug) {
  try {
    const blog = await Blog.findOne({
      where: { slug, status: 'published' }
    });
    return blog;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const seoData = await getPageMetadata(`/blogs/${slug}`);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.image,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kalyan Robotic Hospital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kalyanrobotics.com/logo/kalyan-2.png"
      }
    },
    "datePublished": blog.publishedAt || blog.createdAt,
    "description": blog.excerpt || blog.title
  };

  let faqs = [];
  try {
    faqs = JSON.parse(blog.faqs || '[]');
  } catch (e) {
    faqs = [];
  }

  const faqSchema = faqs.length > 0 ? {
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
  } : null;

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {seoData?.header_scripts && (
        <div dangerouslySetInnerHTML={{ __html: seoData.header_scripts }} />
      )}

      <Navbar />
      
      <article className="pt-32 pb-32">
        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 space-y-8 text-center">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all text-[10px] uppercase tracking-widest font-orbitron">
            <ArrowLeft size={14} /> BACK TO ARCHIVE
          </Link>

          <div className="space-y-4">
            <div className="flex justify-center">
               <span className="px-4 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                 Intelligence Report
               </span>
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-6xl tracking-tight uppercase leading-tight">
              {blog.title}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-8 text-[12px] text-white/40 uppercase tracking-[0.2em] font-space border-y border-white/5 py-6">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(blog.published_at || blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><User size={14} className="text-primary" /> {blog.author}</span>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Featured Image */}
              <div className="aspect-[2/1] rounded-[40px] overflow-hidden border border-white/10 relative">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
              </div>

              {/* Blog content */}
              <div 
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <div className="space-y-8 pt-12 border-t border-white/5">
                  <h2 className="font-orbitron text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                    <HelpCircle className="text-primary" size={32} />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((f, i) => (
                      <div key={i} className="glassmorphism p-8 rounded-[32px] border border-white/5 space-y-4">
                        <h3 className="font-orbitron font-bold text-lg text-white uppercase tracking-tight">{f.q}</h3>
                        <p className="text-white/60 font-space leading-relaxed">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            
            {/* Sidebar Column */}
            <aside className="lg:col-span-4">
              <SidebarContactForm />
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
