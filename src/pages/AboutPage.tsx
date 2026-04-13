import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current && scrollRef.current) {
        const sections = gsap.utils.toArray('.timeline-section');
        
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + (scrollRef.current?.offsetWidth || 0)
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const timelineSections = [
    {
      title: "The Legacy",
      content: "Masembe Group of Companies is at the forefront of redefining Uganda's real estate landscape. By recognizing that land is a finite resource while the economy continues to expand, we focus on Smart Density Development—maximizing the utility of small land parcels to create high-value, sustainable urban environments.",
      image: '/assets/new_re/IMG-20260408-WA0010.jpg'
    },
    {
      title: "Smart Density",
      content: "We increase the 'people-per-acre' ratio through vertical integration. Our designs, including 4-story commercial hubs and 12-unit apartment blocks, accommodate more people comfortably within smaller footprints without sacrificing quality of life.",
      image: '/assets/new_re/IMG-20260408-WA0011.jpg'
    },
    {
      title: "Eco-Density",
      content: "Integrating environmental stewardship with high-density construction. Through LED lighting systems, modern glass holdings, and green urbanism, we ensure high-density areas remain breathable, aesthetic, and environmentally responsible.",
      image: '/assets/new_re/IMG-20260408-WA0012.jpg'
    },
    {
      title: "Fixed Land Strategy",
      content: "Uganda’s land isn't growing, but our economy is. We utilize precision engineering to maximize structural integrity on standard plots (e.g., 100x100), turning underutilized land into profitable commercial centers and hospitality hubs.",
      image: '/assets/new_re/IMG-20260408-WA0013.jpg'
    },
    {
      title: "The Masembe Advantage",
      isComparison: true
    },
    {
      title: "Future Outlook",
      content: "As Uganda moves toward further urbanization, Masembe Group remains committed to being the lead developer in 'Smart Cities' concepts—ensuring every square meter of Ugandan soil contributes to the nation's wealth and well-being.",
      image: '/assets/new_re/IMG-20260408-WA0004.jpg'
    }
  ];

  return (
    <div className="relative bg-[#0C0C0C] text-[#f5f5dc] overflow-hidden">
      {/* Noise Texture & Theme */}
      <div 
        className="fixed inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-0"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', }}
      />
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-orange-900/40 blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Intro */}
        <div className="h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6"
          >
            Masembe Group
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-light tracking-widest uppercase opacity-80"
          >
            Innovating Urban Density & Sustainable Growth
          </motion.p>
        </div>

        {/* Horizontal Timeline */}
        <div ref={containerRef} className="h-screen flex items-center">
          <div ref={scrollRef} className="flex w-[600vw] h-full">
            
            {timelineSections.map((section, idx) => (
              <div key={idx} className="timeline-section w-screen h-full flex flex-col md:flex-row items-center justify-center px-12 md:px-24 gap-12">
                {section.image && (
                    <div className="w-full md:w-1/2 h-[400px] overflow-hidden rounded-sm">
                        <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="max-w-2xl w-full">
                  <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">{section.title}</h2>
                  {section.isComparison ? (
                    <div className="overflow-x-auto text-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#d4af37]/30">
                            <th className="py-4 pr-8 uppercase text-[#d4af37]">Feature</th>
                            <th className="py-4 px-8 uppercase text-white/60">Traditional</th>
                            <th className="py-4 pl-8 uppercase text-[#d4af37]">Masembe</th>
                          </tr>
                        </thead>
                        <tbody className="text-base">
                          <tr className="border-b border-white/10">
                            <td className="py-4 pr-8 font-medium">Land Use</td>
                            <td className="py-4 px-8 text-white/60">Horizontal Sprawl</td>
                            <td className="py-4 pl-8 text-[#d4af37]">Vertical Optimization</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-4 pr-8 font-medium">Aesthetic</td>
                            <td className="py-4 px-8 text-white/60">Standard / Functional</td>
                            <td className="py-4 pl-8 text-[#d4af37]">Cinematic, Modern & Futuristic</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-4 pr-8 font-medium">Sustainability</td>
                            <td className="py-4 px-8 text-white/60">Low Priority</td>
                            <td className="py-4 pl-8 text-[#d4af37]">Eco-Density Focused</td>
                          </tr>
                          <tr className="border-b border-white/10">
                            <td className="py-4 pr-8 font-medium">Economic Yield</td>
                            <td className="py-4 px-8 text-white/60">Single-Stream</td>
                            <td className="py-4 pl-8 text-[#d4af37]">Multi-Unit/Mixed-Use Revenue</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xl leading-relaxed opacity-80">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
