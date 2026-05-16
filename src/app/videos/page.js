import Navbar from '@/components/Navbar';
export const dynamic = 'force-dynamic';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import { Play, Film, Video } from 'lucide-react';
import VideoModel from '@/models/Video';
import VideoGallery from '@/components/VideoGallery';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/videos');
  return metadata || {
    title: "Video Gallery | Kalyan Robotic Hospital Punjab",
    description: "Watch real patient transformations and advanced robotic surgery demonstrations at Kalyan Robotic Hospital.",
  };
}

export default async function VideosPage() {
  const videos = await VideoModel.findAll({ order: [['published_at', 'DESC']] });

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-3 py-2 px-5 mb-8 rounded-full glassmorphism border border-primary/40">
            <Film size={16} className="text-primary" />
            <span className="text-white text-[10px] uppercase tracking-widest font-bold">Clinical Media Hub</span>
          </div>
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
            VISUALIZING <br/><span className="text-primary metallic-text">EXCELLENCE</span>
          </h1>
          <p className="font-inter text-xl text-white/40 leading-relaxed max-w-2xl mx-auto">
            Witness the future of surgery through our high-definition clinical demonstrations and heartfelt patient journeys.
          </p>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          {videos.length === 0 ? (
            <div className="py-32 text-center glassmorphism rounded-[40px] border border-white/5">
              <Video size={64} className="mx-auto mb-6 text-white/10" />
              <p className="font-orbitron text-white/20 text-xl uppercase tracking-[0.3em]">Archive Currently Offline</p>
            </div>
          ) : (
            <VideoGallery initialVideos={JSON.parse(JSON.stringify(videos))} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
