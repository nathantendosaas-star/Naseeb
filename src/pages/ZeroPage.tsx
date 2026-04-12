import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageSquare, X, Send, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import IdentitySwitcher from '../components/IdentitySwitcher';
import WatermarkLayer from '../components/WatermarkLayer';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { submitInquiry } from '../hooks/useRealtimeDB';

const ProgressDot = ({ progress, start, end, color }: { progress: any, start: number, end: number, color: string }) => {
  const height = useTransform(progress, [start, end], ["0%", "100%"]);
  return (
    <motion.div className="w-1 h-8 bg-black/5 rounded-full overflow-hidden">
      <motion.div className="w-full" style={{ height, backgroundColor: color }} />
    </motion.div>
  );
};

const ContentSection = ({ progress, start, end, index, title, desc, linkText, linkTo, isAuto }: any) => {
  const opacity = useTransform(progress, [start - 0.05, start, end - 0.02, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.05, start, end - 0.02, end], [40, 0, 0, -40]);

  return (
    <motion.div 
      style={{ opacity, y, position: 'absolute', top: 0, left: 0 }}
      className="w-full"
    >
      <span className={cn(
        "text-[10px] font-black tracking-[0.4em] uppercase mb-6 block",
        isAuto ? "text-black/40 font-sans" : "text-[#d4af37] font-serif italic"
      )}>
        0{index + 1} // {isAuto ? 'Automotive' : 'Portfolio'}
      </span>
      <h2 className={cn(
        "text-4xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-none",
        isAuto ? "font-sans" : "md:text-6xl font-light font-serif italic tracking-tight"
      )}>
        {title}
      </h2>
      <p className={cn(
        "text-base md:text-lg text-black/60 leading-relaxed font-light tracking-wide",
        isAuto ? "font-sans" : ""
      )}>
        {desc}
      </p>
      {linkText && (
        <Link to={linkTo} className="inline-flex items-center gap-6 group mt-12">
          {!isAuto && (
            <>
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase border-b border-black/10 pb-2 group-hover:border-black transition-colors">{linkText}</span>
              <ChevronDown size={16} className="-rotate-90 group-hover:translate-x-2 transition-transform" />
            </>
          )}
          {isAuto && (
            <>
              <ChevronDown size={16} className="rotate-90 group-hover:-translate-x-2 transition-transform" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase border-b border-black/10 pb-2 group-hover:border-black transition-colors">{linkText}</span>
            </>
          )}
        </Link>
      )}
    </motion.div>
  );
};



const DEFAULT_AUTO_SECTIONS = [
  {
    title: "Engineering Prowess",
    desc: "Where bespoke craftsmanship meets raw, high-performance power. We source only the world's most exclusive automotive masterpieces.",
    accent: "#dc2626"
  },
  {
    title: "Global Sourcing",
    desc: "Our network spans continents, providing you direct access to limited-run exotics and classic icons that never hit the public market.",
    accent: "#dc2626"
  },
  {
    title: "The Commission",
    desc: "Every vehicle is a journey. From personalized configurations to door-to-door delivery, we handle the complexity of luxury automotive ownership.",
    accent: "#dc2626"
  }
];

interface HomepageContent {
  heroTitle?: string;
  heroSubtitle?: string;

  autoSections?: typeof DEFAULT_AUTO_SECTIONS;

}

export default function ZeroPage() {
  const { data: cmsContent } = useFirestoreDoc<HomepageContent>('content', 'homepage');
  const [isMobile, setIsMobile] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Use Firestore content or defaults

  const autoSections = cmsContent?.autoSections || DEFAULT_AUTO_SECTIONS;
  const heroTitle = cmsContent?.heroTitle || "Masembe\nCompanies";
  const heroSubtitle = cmsContent?.heroSubtitle || "The Collective Intelligence";

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    
    const nameParts = inquiryForm.name.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Unknown';

    const data = {
      firstName,
      lastName,
      email: inquiryForm.email,
      phone: '',
      message: inquiryForm.message,
      itemType: 'general',
      itemId: 'zero-page-inquiry',
      itemName: 'Zero Page Inquiry',
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await submitInquiry(data);
      setSubmitSuccess(true);
      setInquiryForm({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowInquiry(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting inquiry: ", error);
      let errorMessage = "There was an error submitting your request. ";
      if (error.code === 'permission-denied') {
        errorMessage += "Access denied. Please ensure Firestore rules allow public submissions.";
      } else {
        errorMessage += error.message || "Please try again.";
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth Scroll Physics
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // 1. Hero Section (0 - 0.15)
  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.12], [1, 0.9]);

  // 2. Real Estate Section (0.15 - 0.5)
  const reVideoScale = useTransform(smoothProgress, [0.15, 0.22, 0.45, 0.5], [1.2, 1, 1, 1.2]);
  const reVideoFilter = useTransform(smoothProgress, [0.15, 0.17, 0.45, 0.5], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const reVideoX = useTransform(smoothProgress, [0.15, 0.22, 0.45, 0.5], ["100%", "0%", "0%", "100%"]);

  // 3. Auto Section (0.5 - 0.85)
  const autoVideoScale = useTransform(smoothProgress, [0.5, 0.57, 0.8, 0.85], [1.2, 1, 1, 1.2]);
  const autoVideoFilter = useTransform(smoothProgress, [0.5, 0.52, 0.8, 0.85], ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const autoVideoX = useTransform(smoothProgress, [0.5, 0.57, 0.8, 0.85], ["-100%", "0%", "0%", "-100%"]);

  const reVideoUrl = "/assets/re-bg.mp4";
  const autoVideoUrl = "/assets/zero_grid.mp4"; 

  const DEFAULT_RE_SECTIONS = [
    {
      title: "Smart Density",
      desc: "Innovating urban density through vertical integration. We transform limited land into high-efficiency ecosystems, maximizing value while minimizing footprint.",
      accent: "#d4af37"
    },
    {
      title: "Eco-Density",
      desc: "Sustainable infrastructure meets green urbanism. Our developments integrate renewable energy, water harvesting, and biophilic design for enduring resilience.",
      accent: "#d4af37"
    },
    {
      title: "The Advantage",
      desc: "The Masembe method delivers 3x-5x traditional ROI through intelligent planning, premium materials, and community-centric mixed-use architecture.",
      accent: "#d4af37"
    }
  ];

  return (
    <>
      <div ref={containerRef} className="relative w-full bg-[#F7F7F5] text-black min-h-[800vh] font-sans selection:bg-black selection:text-white">
        {/* ... navbar ... */}
        <nav className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between p-6 md:px-12 mix-blend-difference">
        <Link to="/" className="text-xl font-black tracking-tighter text-white">MASEMBE</Link>
        <div className="flex items-center gap-12 text-[10px] font-bold tracking-[0.3em] uppercase text-white">
          <Link to="/about" className="hover:opacity-60 transition-opacity">About</Link>
          <Link to="/contact" className="hover:opacity-60 transition-opacity">Contact</Link>
        </div>
      </nav>

      {/* --- HERO CHAPTER --- */}
      <section className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 bg-black">
        <WatermarkLayer text="COLLECTIVE" theme="re" />
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center px-6 relative z-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-[10px] md:text-xs font-black tracking-[0.8em] uppercase text-[#d4af37] mb-12 italic"
          >
            {heroSubtitle}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl lg:text-[12rem] font-black tracking-tighter uppercase leading-[0.8] text-white"
          >
            {heroTitle.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < heroTitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-white/20">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4af37] to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- REAL ESTATE CHAPTER --- */}
      <div className="relative h-[300vh] w-full z-20">
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center overflow-hidden">
          {/* Content Side */}
          <div className="w-full md:w-[60%] h-full flex flex-col items-center justify-center px-8 md:px-24 z-10 bg-[#F7F7F5] relative">
            <WatermarkLayer text="ESTATE" theme="re" />
            <div className="max-w-md w-full relative h-[400px] z-20">
              {DEFAULT_RE_SECTIONS.map((section, idx) => (
                <ContentSection
                  key={`re-${idx}`}
                  progress={smoothProgress}
                  start={0.18 + (idx * 0.1)}
                  end={0.18 + ((idx + 1) * 0.1)}
                  index={idx}
                  title={section.title}
                  desc={section.desc}
                  linkText={idx === DEFAULT_RE_SECTIONS.length - 1 ? "Enter Real Estate" : null}
                  linkTo="/property"
                  isAuto={false}
                />
              ))}
            </div>
            
            {/* Scroll Progress Tracker */}
            <div className="absolute left-12 bottom-24 hidden md:flex flex-col gap-4">
              {DEFAULT_RE_SECTIONS.map((_, i) => (
                <ProgressDot 
                  key={`dot-re-${i}`} 
                  progress={smoothProgress} 
                  start={0.18 + (i * 0.1)} 
                  end={0.18 + ((i + 1) * 0.1)} 
                  color="#d4af37" 
                />
              ))}
            </div>
          </div>

          {/* Sticky Video Side */}
          <motion.div style={{ x: isMobile ? 0 : reVideoX }} className="w-full md:w-[40%] h-1/2 md:h-full relative overflow-hidden">
            <motion.div style={{ scale: reVideoScale, filter: reVideoFilter }} className="w-full h-full">
          <video src={reVideoUrl} autoPlay loop muted playsInline preload="auto" onCanPlay={(e) => (e.target as HTMLVideoElement).play()} className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-black/10" />
            <div className="hidden md:block absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#F7F7F5] to-transparent z-10" />
          </motion.div>
        </div>
      </div>



      {/* --- GRID MOTORS CHAPTER --- */}
      <div className="relative h-[300vh] w-full z-30">
        <div className="sticky top-0 h-screen w-full flex flex-col-reverse md:flex-row items-center overflow-hidden bg-white">
          {/* Sticky Video Side */}
          <motion.div style={{ x: isMobile ? 0 : autoVideoX }} className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
            <motion.div style={{ scale: autoVideoScale, filter: autoVideoFilter }} className="w-full h-full">
              <video src={autoVideoUrl} preload="auto" autoPlay loop muted playsInline onCanPlay={(e) => (e.target as HTMLVideoElement).play()} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]" />
            </motion.div>
            <div className="absolute inset-0 bg-black/5" />
            <div className="hidden md:block absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />
          </motion.div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-8 md:px-24 z-10 bg-white relative">
            <WatermarkLayer text="MOTORS" theme="auto" />
            <div className="max-w-md w-full relative h-[400px] z-20">
              {autoSections.map((section, idx) => (
                <ContentSection
                  key={`auto-${idx}`}
                  progress={smoothProgress}
                  start={0.55 + (idx * 0.08)}
                  end={0.55 + ((idx + 1) * 0.08)}
                  index={idx}
                  title={section.title}
                  desc={section.desc}
                  linkText={idx === autoSections.length - 1 ? "Enter Grid Motors" : null}
                  linkTo="/cars"
                  isAuto={true}
                />
              ))}
            </div>

            {/* Scroll Progress Tracker */}
            <div className="absolute right-12 bottom-24 hidden md:flex flex-col gap-4">
              {autoSections.map((_, i) => (
                <ProgressDot 
                  key={`dot-auto-${i}`} 
                  progress={smoothProgress} 
                  start={0.55 + (i * 0.08)} 
                  end={0.55 + ((i + 1) * 0.08)} 
                  color="#dc2626" 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MANIFESTO --- */}
      <section className="relative h-screen w-full flex items-center justify-center bg-[#F7F7F5] z-40 px-6 overflow-hidden">
        <WatermarkLayer text="MASEMBE" theme="re" />
        <div className="max-w-4xl text-center relative z-20">
          <span className="text-[10px] font-bold tracking-[0.8em] uppercase text-[#d4af37] mb-12 block italic">Est. 2024</span>
          <h2 className="text-4xl md:text-7xl font-light font-serif italic tracking-tight mb-16 leading-tight">Innovating Urban Density.<br /><span className="font-sans not-italic font-black text-black">Sustainable Growth.</span></h2>
          <Link to="/about" className="group relative inline-flex items-center gap-8 px-16 py-6 border border-black/10 text-[10px] font-bold tracking-[0.5em] uppercase overflow-hidden transition-colors hover:border-black">
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Discover Our Legacy</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]" />
          </Link>
        </div>
      </section>

      {/* --- INQUIRY CTA --- */}
      <div className="fixed bottom-8 right-8 z-[110]">
        <AnimatePresence>
          {showInquiry && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="absolute bottom-20 right-0 w-[320px] bg-white/90 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-black/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black tracking-widest uppercase">Direct Inquiry</h3>
                <button onClick={() => setShowInquiry(false)} className="opacity-40 hover:opacity-100 transition-opacity"><X size={16} /></button>
              </div>
              
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <Send size={20} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Request Sent</h4>
                  <p className="text-xs text-black/50">Our team will be in touch shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full bg-transparent border-b border-black/10 py-2 text-sm focus:border-black outline-none transition-colors" 
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full bg-transparent border-b border-black/10 py-2 text-sm focus:border-black outline-none transition-colors" 
                    required
                  />
                  <textarea 
                    placeholder="Your request..." 
                    rows={3} 
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full bg-transparent border-b border-black/10 py-2 text-sm focus:border-black outline-none transition-colors resize-none" 
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white text-[10px] font-bold tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Request'}
                    {!isSubmitting && <Send size={12} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setShowInquiry(!showInquiry)} className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform">
          <span className="text-[10px] font-bold tracking-widest uppercase">{showInquiry ? 'Close' : 'Inquire'}</span>
          <MessageSquare size={16} />
        </button>
      </div>

      {/* Identity Switcher */}
      <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50">
        <IdentitySwitcher />
      </div>

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
    </>
  );
}
