import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPageMetadata } from '@/lib/seo';
import { ShieldCheck, Target, Users, Zap } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata() {
  const metadata = await getPageMetadata('/about');
  return metadata || {
    title: "About Us | Kalyan Robotic Hospital Punjab",
    description: "Learn about the legacy and futuristic vision of Kalyan Robotic Hospital, the leaders in AI-powered robotic knee replacement in Punjab.",
  };
}

export default function AboutPage() {
  const coreValues = [
    { icon: <Target className="text-primary" />, title: "Precision", desc: "Sub-millimeter accuracy in every robotic procedure." },
    { icon: <ShieldCheck className="text-primary" />, title: "Trust", desc: "NABH accredited care with a legacy of surgical excellence." },
    { icon: <Zap className="text-primary" />, title: "Innovation", desc: "Leading the AI revolution in North India's healthcare." },
    { icon: <Users className="text-primary" />, title: "Patient-First", desc: "Tailored recovery plans for every unique anatomy." }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter leading-[0.9]">
              THE FUTURE OF <br/><span className="text-primary metallic-text">SURGERY</span> IS HERE
            </h1>
            <p className="font-inter text-xl text-white/60 leading-relaxed mb-12">
              Kalyan Robotic Hospital represents a paradigm shift in orthopedic care. By combining decades of surgical expertise with cutting-edge AI robotics, we are redefining what's possible in human mobility.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 px-6 bg-black/40 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="glassmorphism p-10 rounded-[32px] border border-white/10 hover:border-primary/40 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="font-orbitron font-bold text-xl mb-4 uppercase tracking-tight">{value.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <div className="relative aspect-video w-full glassmorphism rounded-[40px] overflow-hidden border border-white/10 p-2">
               <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <Image src="/aboutH.png" className='object-contain' alt="Hospital Vision" fill />
               </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="font-orbitron text-4xl font-black mb-8 uppercase tracking-tighter">OUR LEGACY</h2>
            <div className="space-y-6 text-white/60 font-inter text-lg leading-relaxed">
              <p>
                Founded on the principles of excellence and integrity, Kalyan Hospital has served the community of Punjab for over two decades. Today, we stand as a beacon of advanced medical technology.
              </p>
              <p>
                Our NABH accreditation is a testament to our commitment to international safety standards. With the integration of AI-powered robotics, we continue to lead North India into a new era of precision medicine.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
