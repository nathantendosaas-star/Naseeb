import type { Property } from '@/data/properties';
import { useState } from 'react';
import { submitInquiry } from '@/hooks/useRealtimeDB';
import { motion } from 'motion/react';
import OptimizedImage from './OptimizedImage';

export default function PropertyModalContent({ property }: { property: Property }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const tabs = ['overview', 'gallery', 'inquire'];

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

  return (
    <div className="p-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase">{property.name}</h1>
          <h2 className="text-2xl text-gray-500 font-medium">{property.location}</h2>
        </div>
        <div className="text-right mt-6 md:mt-0">
          <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Starting Price</p>
          <p className="text-3xl font-mono font-bold text-yellow-600">{property.price}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold tracking-widest uppercase whitespace-nowrap transition-colors relative ${
              activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTabProperty" className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Property Overview</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover luxury living at {property.name}. This stunning {property.type} offers {property.bedrooms > 0 ? `${property.bedrooms} bedrooms and ` : ''}{property.area} of living space.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Type</p>
                <p className="text-2xl font-bold">{property.type}</p>
              </div>
              {property.bedrooms > 0 && (
                <div>
                  <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Bedrooms</p>
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Area</p>
                <p className="text-2xl font-bold">{property.area}</p>
              </div>
              <div>
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Status</p>
                <p className="text-2xl font-bold">{property.completionDate}</p>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'gallery' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {property.gallery?.map((img: string, i: number) => (
              <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <OptimizedImage 
                  src={img} 
                  alt={`${property.name} gallery ${i + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            ))}
          </motion.div>
        )}
        {activeTab === 'inquire' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-widest">Inquire About This Property</h3>
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
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">First Name</label>
                    <input type="text" name="firstName" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-yellow-600 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Last Name</label>
                    <input type="text" name="lastName" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-yellow-600 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Email Address</label>
                  <input type="email" name="email" required className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-yellow-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Phone Number</label>
                  <input type="tel" name="phone" className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-yellow-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-gray-400">Message</label>
                  <textarea name="message" rows={4} defaultValue={`I am interested in ${property.name}. Please contact me with more information.`} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:outline-none focus:border-yellow-600 transition-colors resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-yellow-600 text-white font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
