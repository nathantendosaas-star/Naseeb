import type { Car } from '@/data/cars';
import { useState } from 'react';
import { motion } from 'motion/react';
import { submitInquiry } from '@/hooks/useRealtimeDB';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaGallery from './MediaGallery';

interface CarModalContentProps {
  car: Car;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function CarModalContent({ car, onNext, onPrev }: CarModalContentProps) {
  const [activeTab, setActiveTab] = useState('gallery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [preferredContact, setPreferredContact] = useState('whatsapp');
  const tabs = ['overview', 'gallery', 'specs', 'tax & financing', 'inquire'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value;
    if (honeypot) {
      // Bot filled in the hidden field — silently reject
      setSubmitSuccess(true);
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(form);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      preferredContact,
      itemType: 'car',
      itemId: car.id,
      itemName: `${car.year} ${car.make} ${car.model}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await submitInquiry(data);
      setSubmitSuccess(true);
      form.reset();
    } catch (error: any) {
      console.error("Error submitting inquiry: ", error);
      let errorMessage = "There was an error submitting your inquiry. ";
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

  const SpecRow = ({ label, value }: { label: string; value?: string | number }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between border-b border-gray-800 pb-2">
        <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">{label}</span>
        <span className="font-mono text-red-500">{value}</span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-200 pb-8 relative">
        {/* Navigation Arrows */}
        {(onPrev || onNext) && (
          <div className="absolute -top-4 right-12 md:right-16 flex gap-2">
            {onPrev && (
              <button 
                onClick={onPrev}
                className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
                title="Previous Car"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {onNext && (
              <button 
                onClick={onNext}
                className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
                title="Next Car"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}
        
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase leading-none">{car.make}</h1>
          <h2 className="text-lg md:text-2xl text-gray-500 font-medium mt-1">{car.model}</h2>
        </div>
        <div className="text-left md:text-right mt-4 md:mt-0">
          <p className="text-[10px] md:text-sm font-bold tracking-widest text-gray-400 uppercase">Starting Price</p>
          <p className="text-2xl md:text-3xl font-mono font-bold text-red-600">{car.price}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 md:gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] md:text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-colors relative ${
              activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">The Pinnacle of Luxury</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Experience the ultimate driving machine. The {car.make} {car.model} combines breathtaking performance with unparalleled comfort. 
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-[10px] md:text-sm font-bold tracking-widest text-gray-400 uppercase">Year</p>
                <p className="text-lg md:text-2xl font-mono font-bold">{car.year}</p>
              </div>
              <div>
                <p className="text-[10px] md:text-sm font-bold tracking-widest text-gray-400 uppercase">Power</p>
                <p className="text-lg md:text-2xl font-mono font-bold">{car.specs?.hp || car.hp} HP</p>
              </div>
              <div>
                <p className="text-[10px] md:text-sm font-bold tracking-widest text-gray-400 uppercase">Status</p>
                <p className="text-lg md:text-2xl font-bold">{car.status}</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'gallery' && (
          <div className="w-full">
            <MediaGallery 
              images={car.gallery?.length > 0 ? car.gallery : [car.image]} 
              alt={`${car.make} ${car.model}`}
            />
          </div>
        )}
        {activeTab === 'specs' && (
          <div className="bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-800">
            <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 uppercase tracking-widest text-white">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-6">
              <SpecRow label="Engine" value={car.specs?.engine} />
              <SpecRow label="0-100 km/h" value={car.specs?.acceleration} />
              <SpecRow label="Top Speed" value={car.specs?.topSpeed} />
              <SpecRow label="Drivetrain" value={car.specs?.driveType} />
              <SpecRow label="Transmission" value={car.specs?.transmission} />
              <SpecRow label="Torque" value={car.specs?.torque} />
              <SpecRow label="Power" value={car.specs?.hp ? `${car.specs.hp} HP` : undefined} />
            </div>
            {!car.specs && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest">Detailed specifications available upon request</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'tax & financing' && (
          <div className="max-w-2xl bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200">
            <h3 className="text-xl md:text-2xl font-bold mb-6 uppercase tracking-widest">Tax & Import</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase mb-2 text-gray-400">Vehicle CIF (USD)</label>
                <input type="text" disabled value={car.price} className="w-full bg-white border border-gray-300 p-3 rounded-md text-gray-500 font-mono text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Import Duty (25%)</p>
                  <p className="font-mono font-bold text-base md:text-lg">Est. {car.price !== 'Contact for Price' ? `$${(parseFloat(car.price.replace(/[$,]/g, '')) * 0.25).toLocaleString()}` : '---'}</p>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">VAT (18%)</p>
                  <p className="font-mono font-bold text-base md:text-lg">Est. {car.price !== 'Contact for Price' ? `$${(parseFloat(car.price.replace(/[$,]/g, '')) * 0.18).toLocaleString()}` : '---'}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <span className="font-bold uppercase tracking-widest text-xs">Total Landed Cost</span>
                  <span className="font-mono text-xl md:text-2xl font-black text-red-600">
                    {car.price !== 'Contact for Price' 
                      ? `Est. $${(parseFloat(car.price.replace(/[$,]/g, '')) * 1.505).toLocaleString()}` 
                      : 'Request Quote'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'inquire' && (
          <div className="max-w-2xl">
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
                {/* Honeypot — hidden from real users, bots fill it in */}
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  tabIndex={-1}
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">First Name</label>
                    <input type="text" name="firstName" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-red-600 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Last Name</label>
                    <input type="text" name="lastName" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-red-600 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Email Address</label>
                  <input type="email" name="email" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Phone Number</label>
                  <input type="tel" name="phone" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Preferred Contact Method</label>
                  <div className="flex gap-4">
                    {['whatsapp', 'phone', 'email'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPreferredContact(method)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          preferredContact === method 
                            ? 'bg-red-600 border-red-600 text-white' 
                            : 'border-gray-600 text-gray-400 hover:border-gray-400'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Message</label>
                  <textarea name="message" rows={4} defaultValue={`I am interested in the ${car.year} ${car.make} ${car.model}. Please contact me with more information.`} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-red-600 transition-colors resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-red-600 text-white font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
