import { useParams } from 'react-router-dom';
import { cars as staticCars } from '../../data/cars';
import type { Car } from '../../data/cars';
import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { useFirestoreDoc } from '../../hooks/useFirestore';
import { submitInquiry } from '../../hooks/useRealtimeDB';
import OptimizedImage from '../../components/OptimizedImage';
import SEO from '../../components/SEO';

export default function CarDetailPage() {
  const { id } = useParams();
  const { data: firestoreCar } = useFirestoreDoc<Car>('cars', id || '');
  
  const car = firestoreCar || staticCars.find(c => c.id === id) || staticCars[0];
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const tabs = ['overview', 'gallery', 'specs', 'tax & financing', 'inquire'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    
    const formData = new FormData(form);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      itemType: 'car',
      itemId: car.id,
      itemName: `${car.make} ${car.model}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await submitInquiry(data);
      setSubmitSuccess(true);

      form.reset();
    } catch (error) {
      console.error("Error submitting inquiry: ", error);
      alert(error instanceof Error ? error.message : "There was an error submitting your inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-bg text-auto-text pt-24">
      <SEO 
        title={`${car.make} ${car.model} | Grid Motors`}
        description={`Experience the ${car.make} ${car.model}. ${car.hp} HP of pure performance. Available at Grid Motors Kla.`}
        canonical={`/cars/inventory/${car.id}`}
        ogImage={car.image}
      />
      {/* Hero Pratap */}
      <div ref={heroRef} className="h-[60vh] relative flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ x: 300, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: yImage }}
          className="relative z-10 w-full max-w-4xl h-full"
        >
          <OptimizedImage 
            src={car.image} 
            alt={car.model} 
            priority
            className="w-full h-full bg-transparent"
            style={{ objectFit: 'contain' }}
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Below-the-fold Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase">{car.make}</h1>
            <h2 className="text-2xl md:text-4xl text-gray-500 font-medium">{car.model}</h2>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <p className="text-sm font-bold tracking-widest text-auto-gray uppercase">Starting Price</p>
            <p className="text-3xl md:text-5xl font-mono font-bold text-auto-accent">{car.price}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-12 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-auto-text' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-auto-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">The Pinnacle of Luxury</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience the ultimate driving machine. The {car.make} {car.model} combines breathtaking performance with unparalleled comfort. 
                  Available now at Grid Motors Kla.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-bold tracking-widest text-auto-gray uppercase">Year</p>
                  <p className="text-2xl font-mono font-bold">{car.year}</p>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-auto-gray uppercase">Power</p>
                  <p className="text-2xl font-mono font-bold">{car.hp} HP</p>
                </div>
                <div>
                  <p className="text-sm font-bold tracking-widest text-auto-gray uppercase">Status</p>
                  <p className="text-2xl font-bold">{car.status}</p>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {car.gallery?.map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <OptimizedImage 
                    src={img} 
                    alt={`${car.model} gallery ${i + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              ))}
            </motion.div>
          )}
          {activeTab === 'specs' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] p-8 rounded-xl border border-gray-800 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
              <h3 className="text-2xl font-black mb-8 uppercase tracking-widest text-white">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Engine</span>
                  <span className="font-mono text-auto-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">V8 Twin-Turbo</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">0-100 km/h</span>
                  <span className="font-mono text-auto-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">3.2s</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Top Speed</span>
                  <span className="font-mono text-auto-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">315 km/h</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Drivetrain</span>
                  <span className="font-mono text-auto-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">AWD</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Transmission</span>
                  <span className="font-mono text-auto-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">8-Speed Auto</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Torque</span>
                  <span className="font-mono text-auto-accent drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">850 Nm</span>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'tax & financing' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest">Tax & Import Calculator</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-auto-gray">Vehicle CIF Value (USD)</label>
                  <input type="text" disabled value={car.price} className="w-full bg-white border border-gray-300 p-3 rounded-md text-gray-500 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Import Duty (25%)</p>
                    <p className="font-mono font-bold text-lg">Est. $45,000</p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">VAT (18%)</p>
                    <p className="font-mono font-bold text-lg">Est. $32,400</p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Withholding Tax (6%)</p>
                    <p className="font-mono font-bold text-lg">Est. $10,800</p>
                  </div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Infrastructure Levy (1.5%)</p>
                    <p className="font-mono font-bold text-lg">Est. $2,700</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-widest">Estimated Total Landed Cost</span>
                    <span className="font-mono text-2xl font-black text-auto-accent">Est. $340,900</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">* Estimates are for illustrative purposes only. Contact us for an exact quote.</p>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'inquire' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest">Inquire About This Vehicle</h3>
              {submitSuccess ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200">
                  <h4 className="font-bold text-lg mb-2">Inquiry Sent Successfully!</h4>
                  <p>Thank you for your interest. A member of our team will contact you shortly.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 text-sm font-bold uppercase tracking-widest text-green-600 hover:text-green-800"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-auto-gray">First Name</label>
                      <input type="text" name="firstName" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-auto-accent transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-auto-gray">Last Name</label>
                      <input type="text" name="lastName" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-auto-accent transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-auto-gray">Email Address</label>
                    <input type="email" name="email" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-auto-accent transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-auto-gray">Phone Number</label>
                    <input type="tel" name="phone" className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-auto-accent transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-auto-gray">Message</label>
                    <textarea name="message" rows={4} defaultValue={`I am interested in the ${car.year} ${car.make} ${car.model}. Please contact me with more information.`} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-auto-accent transition-colors resize-none"></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-auto-accent text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
