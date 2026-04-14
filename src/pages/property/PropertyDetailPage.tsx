import { useParams } from 'react-router-dom';
import { properties } from '@/data/properties';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { submitInquiry } from '@/hooks/useRealtimeDB';
import SEO from '@/components/SEO';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id) || properties[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const data = {
      firstName,
      lastName,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      itemType: 'property',
      itemId: property.id,
      itemName: property.name,
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
    <div className="min-h-screen bg-re-bg text-re-text pt-24">
      <SEO 
        title={`${property.name} | Masembe Real Estate`}
        description={`${property.name} in ${property.location}. A masterpiece of modern architecture by Masembe Group.`}
        canonical={`/property/portfolio/${property.id}`}
        ogImage={property.image}
      />
      {/* Hero Pratap */}
      <div ref={heroRef} className="h-[60vh] relative flex items-center justify-center overflow-hidden">
        <motion.img
          src={property.image}
          alt={property.name}
          initial={{ x: 300, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: yImage }}
          className="relative z-10 w-full max-w-4xl object-contain drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Below-the-fold Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <p className="text-re-accent font-bold tracking-widest uppercase mb-2">{property.location}</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase">{property.name}</h1>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <p className="text-sm font-bold tracking-widest text-re-gray uppercase">Investment</p>
            <p className="text-3xl md:text-5xl font-mono font-bold text-white">{property.price}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Col: Details */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Overview</h2>
            <p className="text-gray-400 leading-relaxed mb-12 text-lg">
              A masterpiece of modern architecture located in the prestigious {property.location}. 
              This {property.type.toLowerCase()} offers unparalleled luxury, breathtaking views, and world-class amenities.
            </p>

            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6">Floor Plan Viewer</h2>
            <div className="bg-white/5 border border-white/10 rounded-sm p-8 flex items-center justify-center h-[400px]">
              <p className="text-gray-500 uppercase tracking-widest">Interactive Floor Plan Coming Soon</p>
            </div>
          </div>

          {/* Right Col: ROI Snapshot */}
          <div>
            <div className="bg-re-accent/10 border border-re-accent/30 rounded-sm p-8">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-re-accent">ROI Snapshot</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-re-gray uppercase tracking-widest mb-1">Projected Yield</p>
                  <p className="font-mono text-2xl font-bold text-white">8.5% - 12%</p>
                </div>
                <div>
                  <p className="text-xs text-re-gray uppercase tracking-widest mb-1">Capital Appreciation</p>
                  <p className="font-mono text-2xl font-bold text-white">~15% p.a.</p>
                </div>
                <div>
                  <p className="text-xs text-re-gray uppercase tracking-widest mb-1">Occupancy Rate</p>
                  <p className="font-mono text-2xl font-bold text-white">92%</p>
                </div>
                <div className="pt-6 border-t border-re-accent/20">
                  <button className="w-full py-4 bg-re-accent text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Request Brochure
                  </button>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="mt-12 bg-white/5 border border-white/10 rounded-sm p-8">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-white">Inquire Now</h2>
              {submitSuccess ? (
                <div className="bg-green-900/30 text-green-400 p-6 rounded-lg border border-green-800/50">
                  <h4 className="font-bold text-lg mb-2">Inquiry Sent Successfully!</h4>
                  <p>Thank you for your interest. A member of our team will contact you shortly.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 text-sm font-bold uppercase tracking-widest text-re-accent hover:text-white transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-re-gray">Full Name</label>
                    <input type="text" name="fullName" required className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-re-accent transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-re-gray">Email Address</label>
                    <input type="email" name="email" required className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-re-accent transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-re-gray">Phone Number</label>
                    <input type="tel" name="phone" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-re-accent transition-colors text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-re-gray">Message</label>
                    <textarea name="message" rows={3} defaultValue={`I am interested in ${property.name}. Please contact me with more information.`} className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-re-accent transition-colors resize-none text-white"></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-transparent border border-re-accent text-re-accent font-bold uppercase tracking-widest hover:bg-re-accent hover:text-black transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
