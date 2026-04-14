import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { submitInquiry } from '@/hooks/useRealtimeDB';
import SEO from '../components/SEO';

const gridIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #dc2626; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(220, 38, 38, 0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const reIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #d4af37; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export default function ContactPage() {
  const [department, setDepartment] = useState<'auto' | 're'>('auto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end start"]
  });

  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Name is required';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
    } else if (name === 'email') {
      if (!value.trim()) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
    } else if (name === 'message') {
      if (!value.trim()) error = 'Message is required';
      else if (value.trim().length < 10) error = 'Message must be at least 10 characters';
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });
    
    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }

    setIsSubmitting(true);
    
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Unknown';

    const data = {
      firstName,
      lastName,
      email: formData.email,
      phone: '',
      message: formData.message,
      itemType: department === 'auto' ? 'car' : 'property',
      itemId: 'general-contact',
      itemName: `General Inquiry - ${department === 'auto' ? 'Grid Motors' : 'Masembe RE'}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await submitInquiry(data);
      setSubmitSuccess(true);
      form.reset();
    } catch (error: any) {
      console.error("Error submitting inquiry: ", error);
      let errorMessage = "There was an error submitting your message. ";
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
    <div ref={pageRef} className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-black text-[#f5f5dc]">
      <SEO 
        title="Contact Us"
        description="Get in touch with Masembe Group for real estate inquiries or Grid Motors for luxury automotive services in Kampala, Uganda."
        canonical="/contact"
      />
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: yTitle }}
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-16 text-center"
        >
          Contact Us
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setDepartment('auto')}
                className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase border transition-colors ${
                  department === 'auto' ? 'bg-[#dc2626] border-[#dc2626] text-white' : 'border-white/20 hover:border-white/50'
                }`}
              >
                Grid Motors
              </button>
              <button 
                onClick={() => setDepartment('re')}
                className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase border transition-colors ${
                  department === 're' ? 'bg-[#d4af37] border-[#d4af37] text-black' : 'border-white/20 hover:border-white/50'
                }`}
              >
                Real Estate
              </button>
            </div>

            {submitSuccess ? (
              <div className="bg-white/10 p-8 border border-white/20 text-center">
                <h3 className="text-xl font-bold mb-2">Message Sent Successfully</h3>
                <p className="opacity-70 mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
                <button 
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({ name: '', email: '', message: '' });
                    setTouched({ name: false, email: false, message: false });
                  }}
                  className="text-sm font-bold tracking-widest uppercase hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 opacity-70">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-transparent border-b pb-2 focus:outline-none transition-colors ${errors.name && touched.name ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#f5f5dc]'}`} 
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-xs mt-2">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 opacity-70">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-transparent border-b pb-2 focus:outline-none transition-colors ${errors.email && touched.email ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#f5f5dc]'}`} 
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 opacity-70">Message</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-transparent border-b pb-2 focus:outline-none transition-colors resize-none ${errors.message && touched.message ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#f5f5dc]'}`}
                  ></textarea>
                  {errors.message && touched.message && (
                    <p className="text-red-500 text-xs mt-2">{errors.message}</p>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                    department === 'auto' ? 'bg-[#dc2626] text-white hover:bg-white hover:text-black' : 'bg-[#d4af37] text-black hover:bg-white hover:text-black'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Map & Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="flex-grow bg-white/5 border border-white/10 rounded min-h-[300px] mb-8 relative overflow-hidden z-0">
              <style>{`
                .leaflet-popup-content-wrapper, .leaflet-popup-tip {
                  background: #1a1a1a;
                  color: #f5f5dc;
                  border: 1px solid rgba(255,255,255,0.1);
                }
                .leaflet-popup-content {
                  margin: 12px;
                }
                .leaflet-container {
                  background: #0a0a0a;
                  font-family: inherit;
                }
              `}</style>
              <MapContainer 
                center={[0.3168, 32.5855]} 
                zoom={14} 
                scrollWheelZoom={false}
                className="absolute inset-0 w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={[0.3168, 32.5855]} icon={gridIcon}>
                  <Popup>
                    <div className="font-bold uppercase tracking-widest text-[#dc2626] text-xs mb-1">Grid Motors</div>
                    <div className="text-xs opacity-80">Plot 30 Jinja Road, Conrad House</div>
                  </Popup>
                </Marker>
                <Marker position={[0.3170, 32.5850]} icon={reIcon}>
                  <Popup>
                    <div className="font-bold uppercase tracking-widest text-[#d4af37] text-xs mb-1">Masembe RE</div>
                    <div className="text-xs opacity-80">Plot 30 Jinja Road, Conrad House</div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-bold tracking-widest uppercase mb-2 text-[#dc2626]">Grid Motors</h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Plot 30 Jinja Road, Conrad House<br/>
                  Kampala, Uganda<br/>
                  +256 750 508 658
                </p>
              </div>
              <div>
                <h3 className="font-bold tracking-widest uppercase mb-2 text-[#d4af37]">Masembe RE</h3>
                <p className="text-sm opacity-70 leading-relaxed">
                  Plot 30 Jinja Road, Conrad House<br/>
                  Kampala, Uganda<br/>
                  +256 750 508 658
                </p>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/5 rounded">
                <h3 className="text-xs font-black tracking-[0.4em] uppercase mb-4 text-[#d4af37]">Our Vision</h3>
                <p className="text-sm opacity-80 leading-relaxed italic">
                    "Uganda’s land isn't growing, but our economy is. Every square meter of Ugandan soil must contribute to the nation's wealth and the well-being of its citizens."
                </p>
                <p className="text-[10px] font-bold tracking-widest uppercase mt-4 opacity-50">— Masembe Group of Companies</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
