import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const isAuto = location.pathname.startsWith('/cars');
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isContact = location.pathname === '/contact';

  // Determine theme colors based on route
  let themeClasses = "bg-white text-black border-t border-gray-200";
  if (isHome || isAbout || isContact) {
    themeClasses = "bg-[#050505] text-white border-t border-white/10";
  } else if (isAuto) {
    themeClasses = "bg-auto-bg text-auto-text border-t border-auto-text/10";
  } else {
    themeClasses = "bg-re-bg text-re-text border-t border-re-text/10";
  }

  return (
    <footer className={cn("py-16 px-6 md:px-12", themeClasses)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-black tracking-tighter">M</div>
              <div>
                <div className="font-bold uppercase tracking-widest text-sm">Masembe Group</div>
                <div className="text-xs opacity-60">Integrated Platform</div>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">
              Real Estate Developer. Automotive Dealership. Real Estate Title & Development.
            </p>
            <div className="flex gap-4 mt-2">
              <a href={isAuto ? "https://www.instagram.com/gridmotors.kla/" : "https://www.instagram.com/masembe.naseeb/"} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
              <a href="https://www.tiktok.com/@masembe.naseeb" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mt-0.5">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.84 1.34-.02 2.62-.96 3.03-2.22.12-.49.19-1 .19-1.51.03-4.42.01-8.84.02-13.26z"/>
                </svg>
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><Twitter size={20} /></a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Grid Motors Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold uppercase tracking-widest text-xs mb-2 opacity-50">Grid Motors</h3>
            <Link to="/cars" className="text-sm hover:opacity-70 transition-opacity">Showroom</Link>
            <Link to="/cars/inventory" className="text-sm hover:opacity-70 transition-opacity">Inventory</Link>
            <Link to="/cars/workshop" className="text-sm hover:opacity-70 transition-opacity">Workshop & Service</Link>
            <Link to="/cars/import" className="text-sm hover:opacity-70 transition-opacity">Import Advisory</Link>
          </div>

          {/* Real Estate Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold uppercase tracking-widest text-xs mb-2 opacity-50">Real Estate</h3>
            <Link to="/property" className="text-sm hover:opacity-70 transition-opacity">Portfolio</Link>
            <Link to="/property/portfolio" className="text-sm hover:opacity-70 transition-opacity">Current Listings</Link>
            <Link to="/property/projects" className="text-sm hover:opacity-70 transition-opacity">Projects</Link>
            <Link to="/about" className="text-sm hover:opacity-70 transition-opacity">Our Legacy</Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold uppercase tracking-widest text-xs mb-2 opacity-50">Contact</h3>
            <div className="flex items-start gap-3 text-sm opacity-80">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>Plot 30 Jinja Road, Conrad House<br/>Kampala, Uganda</span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-80">
              <Phone size={16} className="shrink-0" />
              <span>+256750508658</span>
            </div>
            <div className="flex items-center gap-3 text-sm opacity-80">
              <Mail size={16} className="shrink-0" />
              <span>naseebmasembe10@gmail.com</span>
            </div>
            <Link to="/contact" className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-current self-start pb-1 hover:opacity-70 transition-opacity">
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-current/10 text-xs opacity-50 font-medium">
          <div>
            &copy; {new Date().getFullYear()} Masembe Group. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="#" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
            <Link to="/admin" className="hover:opacity-100 transition-opacity">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
