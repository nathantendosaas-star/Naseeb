import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageSquare, X, Send, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import IdentitySwitcher from '../components/IdentitySwitcher';
import WatermarkLayer from '../components/WatermarkLayer';
import SEO from '../components/SEO';
import { useFirestoreDoc } from '../hooks/useFirestore';
import { submitInquiry } from '../hooks/useRealtimeDB';
import { toast } from 'react-hot-toast';

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
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '', preferredContact: 'whatsapp' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // Use Firestore content or defaults

  const autoSections = cmsContent?.autoSections || DEFAULT_AUTO_SECTIONS;
  const heroTitle = cmsContent?.heroTitle || "MASEMBE\nCOMPANIES";
  const heroSubtitle = cmsContent?.heroSubtitle || "The Collective Intelligence";

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const honeypot = (e.currentTarget as HTMLFormElement).elements.namedItem('website') as HTMLInputElement;
    if (honeypot?.value) {
      // Bot filled in the hidden field — silently reject
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowInquiry(false);
      }, 3000);
      return;
    }

    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone || !inquiryForm.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Phone validation
    if (!/^[+\d\s\-().]{7,20}$/.test(inquiryForm.phone.trim())) {
      toast.error("Please enter a valid phone number.");
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
      phone: inquiryForm.phone,
      message: inquiryForm.message,
      preferredContact: inquiryForm.preferredContact,
      itemType: 'general',
      itemId: 'zero-page-inquiry',
      itemName: 'Zero Page Inquiry',
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await submitInquiry(data);
      setSubmitSuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', message: '', preferredContact: 'whatsapp' });
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
      toast.error(errorMessage);
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
      desc: "Redefining Uganda's landscape through vertical integration. We maximize small plots (e.g. 100x100) with 4-story commercial hubs and 12-unit apartment blocks to increase people-per-acre efficiency.",
      accent: "#d4af37"
    },
    {
      title: "Eco-Density",
      desc: "Sustainable infrastructure meets green urbanism. We integrate LED lighting and modern glass holdings into high-density designs, ensuring our vertical cities remain breathable and aesthetic.",
      accent: "#d4af37"
    },
    {
      title: "The Strategy",
      desc: "Uganda's land isn't growing, but our economy is. We utilize precision engineering to turn underutilized parcels into profitable hospitality and commercial hubs with 3x-5x traditional ROI.",
      accent: "#d4af37"
    }
  ];

  return (
    <>
      <SEO 
        title="Collective Intelligence"
        description="Masembe Group - Innovating Urban Density and Sustainable Growth in Uganda. Integrated platform for Real Estate and Automotive excellence."
        canonical="/"
      />
      <div ref={containerRef} className="relative w-full bg-[#F7F7F5] text-black min-h-[800vh] font-sans selection:bg-black selection:text-white">
        {/* Floating rounded header pills matching image.png */}
        <header className="fixed top-6 left-0 w-full z-[100] px-4 md:px-12 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-[#121216]/80 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-xl shadow-2xl flex items-center gap-6 text-xs md:text-sm text-white/90">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity">
              <span className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center text-[11px] font-black">
                ❖
              </span>
            </Link>
            <nav className="flex items-center gap-4 md:gap-6 font-medium text-white/80">
              <Link to="/" className="text-white hover:text-white transition-colors">Home</Link>
              <Link to="/property" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/cars" className="hover:text-white transition-colors">Motors</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="pointer-events-auto hidden sm:flex items-center gap-3 bg-[#121216]/80 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-xl shadow-2xl text-white/80">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="hover:text-white transition-colors p-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors p-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white transition-colors p-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </header>

      {/* --- HERO CHAPTER --- */}
      <section className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10 bg-[#070709] text-white">
        {/* Ambient Radial Lighting Effects matching image.png */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-blue-900/20 via-slate-800/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-blue-950/30 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-10 -right-20 w-[450px] h-[450px] bg-slate-700/10 rounded-full blur-[130px] pointer-events-none" />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center px-6 relative z-20 max-w-5xl mx-auto flex flex-col items-center justify-center pt-10">
          {/* Top Pill Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-[#121216]/90 border border-white/15 px-4 py-1.5 rounded-full text-xs text-white/90 backdrop-blur-md shadow-2xl inline-flex items-center gap-3 hover:border-white/30 transition-all cursor-pointer">
              <span className="bg-[#2563eb] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                New
              </span>
              <span className="text-white/90 font-medium tracking-wide">
                {heroSubtitle}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1 pl-1 border-l border-white/10">
                Explore ↗
              </span>
            </div>
          </motion.div>

          {/* Main Display Serif Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-serif font-normal tracking-tight leading-[1.02] text-[#f8f8f8] mb-6 max-w-5xl"
          >
            {heroTitle.split('\n').map((line: string, i: number) => (
              <React.Fragment key={i}>
                {line}
                {i < heroTitle.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </motion.h1>

          {/* Subtitle / Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-sans leading-relaxed font-light tracking-wide mb-10 text-center"
          >
            We turn ideas into unforgettable visuals that captivate and convert. Your brand's next chapter starts here.
          </motion.p>

          {/* Action Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/property"
              className="bg-[#2563eb] hover:bg-blue-600 text-white font-medium px-8 py-3.5 rounded-full text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Property
            </Link>
            <Link
              to="/cars"
              className="bg-[#222226]/90 hover:bg-[#2d2d33] border border-white/10 text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Motors
            </Link>
          </motion.div>

          {/* Scroll Down Hint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-14 flex flex-col items-center gap-2"
          >
            <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/30">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
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
              {DEFAULT_RE_SECTIONS.map((section: any, idx: number) => (
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
              {DEFAULT_RE_SECTIONS.map((_: any, i: number) => (
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
          <video src={reVideoUrl} autoPlay loop muted playsInline preload="metadata" onCanPlay={(e) => (e.target as HTMLVideoElement).play()} className="absolute inset-0 w-full h-full object-cover" />
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
              <video src={autoVideoUrl} preload="metadata" autoPlay loop muted playsInline onCanPlay={(e) => (e.target as HTMLVideoElement).play()} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]" />
            </motion.div>
            <div className="absolute inset-0 bg-black/5" />
            <div className="hidden md:block absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />
          </motion.div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center px-8 md:px-24 z-10 bg-white relative">
            <WatermarkLayer text="MOTORS" theme="auto" />
            <div className="max-w-md w-full relative h-[400px] z-20">
              {autoSections.map((section: any, idx: number) => (
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
              {autoSections.map((_: any, i: number) => (
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
                  {/* Honeypot — hidden from real users, bots fill it in */}
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                    aria-hidden="true"
                  />
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
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-black/10 py-2 text-sm focus:border-black outline-none transition-colors" 
                    required
                  />
                  <div>
                    <label className="block text-[8px] font-bold tracking-widest uppercase mb-2 opacity-50">Preferred Contact</label>
                    <div className="flex gap-4">
                      {['whatsapp', 'phone', 'email'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setInquiryForm({ ...inquiryForm, preferredContact: method })}
                          className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-3 py-1 border transition-all",
                            inquiryForm.preferredContact === method 
                              ? "bg-black text-white border-black" 
                              : "border-black/10 text-black/40 hover:border-black/30"
                          )}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
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
