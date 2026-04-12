import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { format } from 'date-fns';
import { 
  Trash2, 
  CheckCircle, 
  Circle, 
  Car, 
  Home, 
  LogOut, 
  AlertCircle, 
  LayoutDashboard, 
  Database, 
  MessageSquare,
  Plus,
  Save,
  X,
  Edit2
} from 'lucide-react';
import { useFirestoreCollection, useFirestoreDoc } from '@/hooks/useFirestore';
import { useRealtimeDB, updateInquiryStatus, deleteInquiryFromRTDB } from '@/hooks/useRealtimeDB';
import type { Car as CarType } from '@/data/cars';
import type { Property as PropertyType } from '@/data/properties';

// --- Types ---

interface Inquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  itemType: 'car' | 'property' | 'general';
  itemId: string;
  itemName: string;
  createdAt: string;
  status: 'new' | 'read' | 'archived';
}

interface HomepageSection {
  title: string;
  desc: string;
  accent?: string;
}

interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  reSections: HomepageSection[];
  autoSections: HomepageSection[];
  reVideoUrl: string;
  autoVideoUrl: string;
}

type Tab = 'inquiries' | 'homepage' | 'inventory';
type InventoryType = 'cars' | 'properties';

// --- Main Component ---

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('inquiries');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message || "An error occurred during sign in.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 md:px-12 flex justify-center items-center">
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center max-w-lg w-full shadow-sm">
          <h1 className="text-3xl font-black uppercase mb-4 tracking-tighter">Admin Access</h1>
          <p className="text-gray-500 mb-8 uppercase text-[10px] font-bold tracking-[0.2em]">Masembe Management System</p>
          
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-left">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800">{authError}</p>
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-gray-800 transition-colors rounded-none"
          >
            Authenticate via Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/5 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">CMS Dashboard</h1>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === 'inquiries' ? 'text-black' : 'text-black/30 hover:text-black'}`}
              >
                <MessageSquare size={14} />
                Inquiries
              </button>
              <button 
                onClick={() => setActiveTab('homepage')}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === 'homepage' ? 'text-black' : 'text-black/30 hover:text-black'}`}
              >
                <LayoutDashboard size={14} />
                Homepage
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === 'inventory' ? 'text-black' : 'text-black/30 hover:text-black'}`}
              >
                <Database size={14} />
                Inventory
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 hover:text-black transition-colors mt-6 md:mt-0"
          >
            <LogOut size={14} />
            Secure Exit
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'inquiries' && <InquiriesTab />}
          {activeTab === 'homepage' && <HomepageTab />}
          {activeTab === 'inventory' && <InventoryTab />}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function InquiriesTab() {
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');
  
  const { data: inquiries, loading, error } = useRealtimeDB<Inquiry>('inquiries', 50);

  const filteredInquiries = inquiries.filter(i => {
    if (filter === 'all') return i.status !== 'archived';
    return i.status === filter;
  });

  const markAsRead = async (id: string, currentStatus: string) => {
    if (currentStatus === 'read') return;
    try {
      await updateInquiryStatus(id, 'read');
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (window.confirm('Delete this inquiry permanently?')) {
      try {
        await deleteInquiryFromRTDB(id);
      } catch (error) {
        console.error("Error deleting inquiry:", error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 text-center rounded-lg">
        <AlertCircle className="text-red-600 mx-auto mb-4" size={32} />
        <h3 className="text-lg font-bold text-red-900 mb-2">Sync Error</h3>
        <p className="text-red-700 text-sm mb-4">{error.message}</p>
        <p className="text-xs text-red-600 uppercase tracking-widest font-bold">
          Check your Realtime Database security rules in the Firebase Console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b border-black/5 pb-6">
        {['all', 'new', 'read'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors ${filter === f ? 'bg-black text-white' : 'bg-white text-black border border-black/5 hover:border-black'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredInquiries.length === 0 ? (
        <EmptyState message="No inquiries matching your filter." />
      ) : (
        <div className="grid gap-6">
          {filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className={`bg-white p-8 rounded-none border border-black/5 transition-all ${inquiry.status === 'new' ? 'border-l-4 border-l-black shadow-sm' : 'opacity-60'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {inquiry.itemType === 'car' ? (
                      <span className="bg-black text-white p-2"><Car size={14} /></span>
                    ) : inquiry.itemType === 'property' ? (
                      <span className="bg-black text-white p-2"><Home size={14} /></span>
                    ) : (
                      <span className="bg-gray-100 text-black p-2"><MessageSquare size={14} /></span>
                    )}
                    <span className="font-bold uppercase tracking-[0.2em] text-[10px]">{inquiry.itemName}</span>
                    {inquiry.status === 'new' && (
                      <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-[0.2em]">New</span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-black uppercase tracking-tight">{inquiry.firstName} {inquiry.lastName}</h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
                    <a href={`mailto:${inquiry.email}`} className="hover:text-black">{inquiry.email}</a>
                    {inquiry.phone && <a href={`tel:${inquiry.phone}`} className="hover:text-black">{inquiry.phone}</a>}
                    <span>{format(new Date(inquiry.createdAt), 'MMM d, yyyy // HH:mm')}</span>
                  </div>
                  
                  <div className="mt-6 p-6 bg-[#F7F7F5] border border-black/5">
                    <p className="text-sm leading-relaxed text-black/70 whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col justify-end gap-3 md:pl-8 md:border-l border-black/5">
                  <button 
                    onClick={() => markAsRead(inquiry.id, inquiry.status)}
                    disabled={inquiry.status === 'read'}
                    className={`flex items-center justify-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${inquiry.status === 'read' ? 'bg-gray-100 text-black/20 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    {inquiry.status === 'read' ? <CheckCircle size={14} /> : <Circle size={14} />}
                    {inquiry.status === 'read' ? 'Archived' : 'Archive'}
                  </button>
                  <button 
                    onClick={() => deleteInquiry(inquiry.id)}
                    className="flex items-center justify-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 border border-red-100 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_CONTENT: HomepageContent = {
  heroTitle: "Masembe\nCompanies",
  heroSubtitle: "The Collective Intelligence",
  reVideoUrl: "/re-bg.mp4",
  autoVideoUrl: "/videoplayback.webm",
  reSections: [
    { title: "Architectural Vision", desc: "We define the East African skyline through uncompromised precision and visionary property management.", accent: "#d4af37" },
    { title: "Strategic Portfolios", desc: "Curating a collection of the region's most prestigious addresses.", accent: "#d4af37" },
    { title: "Bespoke Management", desc: "A white-glove approach to asset preservation.", accent: "#d4af37" }
  ],
  autoSections: [
    { title: "Engineering Prowess", desc: "Where bespoke craftsmanship meets raw, high-performance power.", accent: "#dc2626" },
    { title: "Global Sourcing", desc: "Our network spans continents, providing you direct access to limited-run exotics.", accent: "#dc2626" },
    { title: "The Commission", desc: "Every vehicle is a journey. From personalized configurations to door-to-door delivery.", accent: "#dc2626" }
  ]
};

function HomepageTab() {
  const { data: content, loading } = useFirestoreDoc<HomepageContent>('content', 'homepage');
  const [formData, setFormData] = useState<HomepageContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData(content);
    } else if (loading === false) {
      setFormData(DEFAULT_CONTENT);
    }
  }, [content, loading]);

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'content', 'homepage'), formData);
      alert('Homepage updated successfully.');
    } catch (error) {
      console.error("Error updating homepage:", error);
      alert('Failed to update homepage.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = (type: 're' | 'auto', index: number, field: keyof HomepageSection, value: string) => {
    if (!formData) return;
    const newSections = type === 're' ? [...formData.reSections] : [...formData.autoSections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ 
      ...formData, 
      [type === 're' ? 'reSections' : 'autoSections']: newSections 
    });
  };

  if (loading && !formData) return <LoadingSpinner />;
  if (!formData) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl space-y-12">
      <div className="grid gap-8 bg-white p-10 border border-black/5 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-4">Hero Configuration</h2>
        <div className="grid gap-6">
          <FormField 
            label="Hero Title" 
            value={formData.heroTitle} 
            onChange={(v: string) => setFormData({ ...formData, heroTitle: v })}
            multiline
          />
          <FormField 
            label="Hero Subtitle" 
            value={formData.heroSubtitle} 
            onChange={(v: string) => setFormData({ ...formData, heroSubtitle: v })}
          />
        </div>
      </div>

      <div className="grid gap-8 bg-white p-10 border border-black/5 shadow-sm">
        <h2 className="text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-4">Media Assets</h2>
        <div className="grid gap-6">
          <FormField 
            label="Real Estate Video URL" 
            value={formData.reVideoUrl} 
            onChange={(v: string) => setFormData({ ...formData, reVideoUrl: v })}
          />
          <FormField 
            label="Automotive Video URL" 
            value={formData.autoVideoUrl} 
            onChange={(v: string) => setFormData({ ...formData, autoVideoUrl: v })}
          />
        </div>
      </div>

      <SectionEditor 
        title="Real Estate Sections" 
        sections={formData.reSections} 
        onChange={(idx, field, val) => updateSection('re', idx, field, val)}
      />

      <SectionEditor 
        title="Automotive Sections" 
        sections={formData.autoSections} 
        onChange={(idx, field, val) => updateSection('auto', idx, field, val)}
      />

      <div className="sticky bottom-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-gray-800 transition-all flex items-center gap-4 disabled:opacity-50"
        >
          {isSaving ? 'Processing...' : (
            <>
              <Save size={14} />
              Publish Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SectionEditor({ title, sections, onChange }: { 
  title: string, 
  sections: HomepageSection[], 
  onChange: (idx: number, field: keyof HomepageSection, val: string) => void 
}) {
  return (
    <div className="grid gap-8 bg-white p-10 border border-black/5 shadow-sm">
      <h2 className="text-2xl font-black uppercase tracking-tighter border-b border-black/5 pb-4">{title}</h2>
      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className="grid gap-6 p-6 bg-[#F7F7F5] relative">
            <span className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 flex items-center justify-center text-[10px] font-bold">0{idx + 1}</span>
            <FormField 
              label="Section Title" 
              value={section.title} 
              onChange={(v) => onChange(idx, 'title', v)}
            />
            <FormField 
              label="Description" 
              value={section.desc} 
              onChange={(v) => onChange(idx, 'desc', v)}
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryTab() {
  const [type, setType] = useState<InventoryType>('cars');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CarType | PropertyType | null>(null);

  const { data: cars, loading: carsLoading } = useFirestoreCollection<CarType>('cars');
  const { data: properties, loading: propsLoading } = useFirestoreCollection<PropertyType>('properties');

  const handleDelete = async (id: string) => {
    if (window.confirm(`Permanently remove this item from ${type}?`)) {
      try {
        await deleteDoc(doc(db, type, id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (carsLoading || propsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-black/5 pb-8">
        <div className="flex gap-4">
          <button 
            onClick={() => setType('cars')}
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${type === 'cars' ? 'bg-black text-white' : 'bg-white text-black border border-black/5 hover:border-black'}`}
          >
            Showroom
          </button>
          <button 
            onClick={() => setType('properties')}
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${type === 'properties' ? 'bg-black text-white' : 'bg-white text-black border border-black/5 hover:border-black'}`}
          >
            Portfolio
          </button>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} />
          Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(type === 'cars' ? cars : properties).map((item: any) => (
          <div key={item.id} className="group bg-white border border-black/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="aspect-[16/10] overflow-hidden bg-gray-100">
              <img src={item.image} alt={item.model || item.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-none">{item.model || item.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mt-2">{item.make || item.location}</p>
                </div>
                <span className="text-[10px] font-black tracking-widest">{item.price}</span>
              </div>
              
              <div className="flex gap-3 pt-6 border-t border-black/5">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-black/5 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 border border-black/5 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || editingItem) && (
        <InventoryModal 
          type={type} 
          item={editingItem} 
          onClose={() => {
            setIsAdding(false);
            setEditingItem(null);
          }} 
        />
      )}
    </div>
  );
}

function InventoryModal({ type, item, onClose }: { type: InventoryType, item?: CarType | PropertyType | null, onClose: () => void }) {
  const [formData, setFormData] = useState<any>(item || {
    id: '',
    make: '',
    model: '',
    year: 2024,
    hp: 0,
    price: '',
    status: 'Available',
    watermarkText: '',
    image: '',
    gallery: [],
    // Property specific
    name: '',
    location: '',
    type: 'Villa',
    bedrooms: 0,
    area: '',
    completionDate: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Ensure numeric values are numbers and handle NaN
      const finalData = { ...formData };
      if (type === 'cars') {
        finalData.year = parseInt(formData.year.toString()) || new Date().getFullYear();
        finalData.hp = parseInt(formData.hp.toString()) || 0;
      } else {
        finalData.bedrooms = parseInt(formData.bedrooms.toString()) || 0;
      }

      if (item) {
        await updateDoc(doc(db, type, item.id), finalData);
      } else {
        const id = finalData.id || (finalData.model || finalData.name).toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, type, id), { ...finalData, id });
      }
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving asset.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-black/40 hover:text-black transition-colors">
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b border-black/5 pb-6">
          {item ? 'Modify Asset' : 'New Asset Entry'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {type === 'cars' ? (
              <>
                <FormField label="Identifier (slug)" value={formData.id} onChange={(v) => setFormData({...formData, id: v})} placeholder="e.g. g63-amg" disabled={!!item} />
                <FormField label="Manufacturer" value={formData.make} onChange={(v) => setFormData({...formData, make: v})} />
                <FormField label="Model Designation" value={formData.model} onChange={(v) => setFormData({...formData, model: v})} />
                <FormField label="Model Year" type="number" value={formData.year} onChange={(v) => setFormData({...formData, year: parseInt(v)})} />
                <FormField label="Horsepower" type="number" value={formData.hp} onChange={(v) => setFormData({...formData, hp: parseInt(v)})} />
              </>
            ) : (
              <>
                <FormField label="Identifier (slug)" value={formData.id} onChange={(v) => setFormData({...formData, id: v})} placeholder="e.g. kololo-mansion" disabled={!!item} />
                <FormField label="Property Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                <FormField label="Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
                <FormField label="Asset Type" value={formData.type} onChange={(v) => setFormData({...formData, type: v})} />
                <FormField label="Bedrooms" type="number" value={formData.bedrooms} onChange={(v) => setFormData({...formData, bedrooms: parseInt(v)})} />
                <FormField label="Square Footage" value={formData.area} onChange={(v) => setFormData({...formData, area: v})} />
              </>
            )}
            
            <FormField label="Valuation" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} placeholder="$ 000,000" />
            <FormField label="Asset Status" value={formData.status || formData.completionDate} onChange={(v) => setFormData({...formData, [type === 'cars' ? 'status' : 'completionDate']: v})} />
            <FormField label="Watermark Text" value={formData.watermarkText} onChange={(v) => setFormData({...formData, watermarkText: v})} />
            <div className="md:col-span-2">
              <FormField label="Primary Image URL" value={formData.image} onChange={(v) => setFormData({...formData, image: v})} />
            </div>
          </div>

          <div className="flex justify-end gap-6 pt-8 border-t border-black/5">
            <button 
              type="button"
              onClick={onClose}
              className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest border border-black/5 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Synchronizing...' : 'Save Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- UI Components ---

interface FormFieldProps {
  label: string;
  value: any;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

function FormField({ label, value, onChange, type = 'text', multiline = false, placeholder = '', disabled = false }: FormFieldProps) {
  return (
    <div className="grid gap-3">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">{label}</label>
      {multiline ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-white border border-black/10 p-5 text-lg font-medium text-black focus:border-black outline-none transition-colors min-h-[150px] resize-none shadow-sm"
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-white border border-black/10 p-5 text-lg font-medium text-black focus:border-black outline-none transition-colors shadow-sm"
        />
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white p-16 text-center border border-black/5">
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">{message}</p>
    </div>
  );
}
