/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from 'lenis';

// Scroll to Top behavior for React Router + Lenis
function ScrollToTop({ lenisRef }: { lenisRef: React.MutableRefObject<Lenis | null> }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset browser scroll
    window.scrollTo(0, 0);
    
    // Reset Lenis scroll if instance exists
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenisRef]);

  return null;
}

import ZeroPage from './pages/ZeroPage';
import CarLandingPage from './pages/cars/CarLandingPage';
import PropertyLandingPage from './pages/property/PropertyLandingPage';
import ShowroomPage from './pages/cars/ShowroomPage';

import InventoryPage from './pages/cars/InventoryPage';
import CarDetailPage from './pages/cars/CarDetailPage';
import WorkshopPage from './pages/cars/WorkshopPage';
import ImportPage from './pages/cars/ImportPage';
import ProjectsPage from './pages/property/ProjectsPage';
import PropertyDetailPage from './pages/property/PropertyDetailPage';
import LuxuryResidentialPage from './pages/property/LuxuryResidentialPage';
import OngoingDevelopmentsPage from './pages/property/OngoingDevelopmentsPage';
import CommercialPlazaPage from './pages/property/CommercialPlazaPage';
import FutureConceptsPage from './pages/property/FutureConceptsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

import GlobalHeader from './components/GlobalHeader';
import WhatsAppCTA from './components/WhatsAppCTA';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><ZeroPage /></PageTransition>} />
        <Route path="/cars" element={<PageTransition><CarLandingPage /></PageTransition>} />
        <Route path="/cars/showroom" element={<PageTransition><ShowroomPage /></PageTransition>} />
        <Route path="/cars/inventory" element={<PageTransition><InventoryPage /></PageTransition>} />
        <Route path="/cars/inventory/:id" element={<PageTransition><CarDetailPage /></PageTransition>} />
        <Route path="/cars/workshop" element={<PageTransition><WorkshopPage /></PageTransition>} />
        <Route path="/cars/import" element={<PageTransition><ImportPage /></PageTransition>} />
        <Route path="/property" element={<PageTransition><PropertyLandingPage /></PageTransition>} />
        <Route path="/property/projects" element={<PageTransition><ProjectsPage /></PageTransition>} />
        <Route path="/property/luxury" element={<PageTransition><LuxuryResidentialPage /></PageTransition>} />
        <Route path="/property/ongoing" element={<PageTransition><OngoingDevelopmentsPage /></PageTransition>} />
        <Route path="/property/commercial" element={<PageTransition><CommercialPlazaPage /></PageTransition>} />
        <Route path="/property/future" element={<PageTransition><FutureConceptsPage /></PageTransition>} />
        <Route path="/property/detail/:id" element={<PageTransition><PropertyDetailPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route
          path="/admin"
          element={<PageTransition><AdminPage /></PageTransition>}
        />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  const isAuto = location.pathname.startsWith('/cars');
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isContact = location.pathname === '/contact';

  useEffect(() => {
    if (isHome) {
      document.body.className = 'bg-black text-white';
    } else if (isAbout || isContact) {
      document.body.className = 'bg-black text-[#f5f5dc]'; // Neutral theme
    } else if (isAuto) {
      document.body.className = 'theme-auto';
    } else {
      document.body.className = 'theme-re';
    }
  }, [isAuto, isHome, isAbout, isContact]);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      orientation: 'vertical',
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop lenisRef={lenisRef} />
      <GlobalHeader />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
      <WhatsAppCTA />
    </ErrorBoundary>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <AppContent />
      )}
    </Router>
  );
}
