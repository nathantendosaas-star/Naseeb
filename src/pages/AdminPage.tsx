import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { Helmet } from 'react-helmet-async';
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
  Edit2,
  Moon,
  Sun
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
type Theme = 'light' | 'dark';

// --- Main Component ---

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('inquiries');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('admin-theme') as Theme) || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${theme === 'dark' ? 'bg-zinc-950' : 'bg-gray-50'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-black'}`}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen pt-24 pb-12 px-6 md:px-12 flex justify-center items-center transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'}`}>
        <div className={`p-12 rounded-xl border text-center max-w-lg w-full shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
          <h1 className="text-3xl font-black uppercase mb-4 tracking-tighter">Admin Access</h1>
          <p className={`mb-8 uppercase text-[10px] font-bold tracking-[0.2em] ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>Masembe Management System</p>
          
          {authError && (
            <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 text-left ${theme === 'dark' ? 'bg-red-950/30 border-red-900 text-red-200' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm">{authError}</p>
            </div>
          )}

          <button 
            onClick={handleLogin}
            className={`w-full py-4 font-bold uppercase tracking-[0.3em] text-[10px] transition-colors rounded-none ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            Authenticate via Google
          </button>

          <button 
            onClick={toggleTheme}
            className={`mt-8 p-3 rounded-full border transition-colors ${theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-100'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    );
  }

  const themeClasses = theme === 'dark' 
    ? 'bg-zinc-950 text-white selection:bg-white selection:text-black' 
    : 'bg-[#F7F7F5] text-black selection:bg-black selection:text-white';

  return (
    <div className={`min-h-screen pt-24 pb-12 px-6 md:px-12 transition-colors duration-300 ${themeClasses}`}>
      <Helmet>
        <title>Admin Dashboard | Masembe Group</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between items-end mb-12 border-b pb-8 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">CMS Dashboard</h1>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === 'inquiries' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/30 hover:text-black')}`}
              >
                <MessageSquare size={14} />
                Inquiries
              </button>
              <button 
                onClick={() => setActiveTab('homepage')}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === 'homepage' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/30 hover:text-black')}`}
              >
                <LayoutDashboard size={14} />
                Homepage
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeTab === 'inventory' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/30 hover:text-black')}`}
              >
                <Database size={14} />
                Inventory
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6 md:mt-0">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400' : 'border-black/5 hover:bg-black/5 text-black/40'}`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors ${theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/40 hover:text-black'}`}
            >
              <LogOut size={14} />
              Secure Exit
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'inquiries' && <InquiriesTab theme={theme} />}
          {activeTab === 'homepage' && <HomepageTab theme={theme} />}
          {activeTab === 'inventory' && <InventoryTab theme={theme} />}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function InquiriesTab({ theme }: { theme: Theme }) {
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

  if (loading) return <LoadingSpinner theme={theme} />;

  if (error) {
    return (
      <div className={`border p-8 text-center rounded-lg ${theme === 'dark' ? 'bg-red-950/20 border-red-900/50' : 'bg-red-50 border-red-200'}`}>
        <AlertCircle className="text-red-600 mx-auto mb-4" size={32} />
        <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-red-200' : 'text-red-900'}`}>Sync Error</h3>
        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>{error.message}</p>
        <p className="text-xs text-red-600 uppercase tracking-widest font-bold">
          Check your Realtime Database security rules in the Firebase Console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={`flex gap-4 border-b pb-6 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
        {['all', 'new', 'read'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 text-[10px] font-bold tracking-[0.3em] uppercase transition-all ${
              filter === f 
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
                : (theme === 'dark' ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600' : 'bg-white text-black border border-black/5 hover:border-black')
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredInquiries.length === 0 ? (
        <EmptyState theme={theme} message="No inquiries matching your filter." />
      ) : (
        <div className="grid gap-6">
          {filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className={`p-8 rounded-none border transition-all duration-300 ${
                theme === 'dark' 
                  ? `bg-zinc-900/50 border-zinc-800 ${inquiry.status === 'new' ? 'border-l-4 border-l-white bg-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.03)]' : 'opacity-50'}` 
                  : `bg-white border-black/5 ${inquiry.status === 'new' ? 'border-l-4 border-l-black shadow-sm' : 'opacity-60'}`
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {inquiry.itemType === 'car' ? (
                      <span className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} p-2 transition-colors`}><Car size={14} /></span>
                    ) : inquiry.itemType === 'property' ? (
                      <span className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} p-2 transition-colors`}><Home size={14} /></span>
                    ) : (
                      <span className={`${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-black'} p-2 transition-colors`}><MessageSquare size={14} /></span>
                    )}
                    <span className={`font-bold uppercase tracking-[0.2em] text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-black/60'}`}>{inquiry.itemName}</span>
                    {inquiry.status === 'new' && (
                      <span className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} text-[8px] font-bold px-2 py-0.5 uppercase tracking-[0.2em] transition-colors`}>New</span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase tracking-tight">{inquiry.firstName} {inquiry.lastName}</h3>
                  <div className={`flex flex-wrap gap-x-8 gap-y-2 mt-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-black/40'}`}>
                    <a href={`mailto:${inquiry.email}`} className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{inquiry.email}</a>
                    {inquiry.phone && <a href={`tel:${inquiry.phone}`} className={`transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>{inquiry.phone}</a>}
                    <span>{format(new Date(inquiry.createdAt), 'MMM d, yyyy // HH:mm')}</span>
                  </div>
                  
                  <div className={`mt-6 p-8 border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800' : 'bg-[#F7F7F5] border-black/5'}`}>
                    <p className={`text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap transition-colors duration-300 ${theme === 'dark' ? 'text-zinc-200' : 'text-black/90'}`}>{inquiry.message}</p>
                  </div>
                </div>
                
                <div className={`flex flex-row md:flex-col justify-end gap-3 md:pl-8 md:border-l transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
                  <button 
                    onClick={() => markAsRead(inquiry.id, inquiry.status)}
                    disabled={inquiry.status === 'read'}
                    className={`flex items-center justify-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                      inquiry.status === 'read' 
                        ? (theme === 'dark' ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gray-100 text-black/20 cursor-not-allowed') 
                        : (theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800')
                    }`}
                  >
                    {inquiry.status === 'read' ? <CheckCircle size={14} /> : <Circle size={14} />}
                    {inquiry.status === 'read' ? 'Archived' : 'Archive'}
                  </button>
                  <button 
                    onClick={() => deleteInquiry(inquiry.id)}
                    className={`flex items-center justify-center gap-3 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all ${
                      theme === 'dark'
                        ? 'text-red-400 border-red-900/50 hover:bg-red-950/30'
                        : 'text-red-600 border-red-100 hover:bg-red-50'
                    }`}
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

function HomepageTab({ theme }: { theme: Theme }) {
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

  if (loading && !formData) return <LoadingSpinner theme={theme} />;
  if (!formData) return <LoadingSpinner theme={theme} />;

  return (
    <div className="max-w-4xl space-y-12">
      <div className={`grid gap-8 p-10 border shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
        <h2 className={`text-2xl font-black uppercase tracking-tighter border-b pb-4 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>Hero Configuration</h2>
        <div className="grid gap-6">
          <FormField 
            theme={theme}
            label="Hero Title" 
            value={formData.heroTitle} 
            onChange={(v: string) => setFormData({ ...formData, heroTitle: v })}
            multiline
          />
          <FormField 
            theme={theme}
            label="Hero Subtitle" 
            value={formData.heroSubtitle} 
            onChange={(v: string) => setFormData({ ...formData, heroSubtitle: v })}
          />
        </div>
      </div>

      <div className={`grid gap-8 p-10 border shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
        <h2 className={`text-2xl font-black uppercase tracking-tighter border-b pb-4 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>Media Assets</h2>
        <div className="grid gap-6">
          <FormField 
            theme={theme}
            label="Real Estate Video URL" 
            value={formData.reVideoUrl} 
            onChange={(v: string) => setFormData({ ...formData, reVideoUrl: v })}
          />
          <FormField 
            theme={theme}
            label="Automotive Video URL" 
            value={formData.autoVideoUrl} 
            onChange={(v: string) => setFormData({ ...formData, autoVideoUrl: v })}
          />
        </div>
      </div>

      <SectionEditor 
        theme={theme}
        title="Real Estate Sections" 
        sections={formData.reSections} 
        onChange={(idx, field, val) => updateSection('re', idx, field, val)}
      />

      <SectionEditor 
        theme={theme}
        title="Automotive Sections" 
        sections={formData.autoSections} 
        onChange={(idx, field, val) => updateSection('auto', idx, field, val)}
      />

      <div className="sticky bottom-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center gap-4 disabled:opacity-50 ${
            theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'
          }`}
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

function SectionEditor({ title, sections, onChange, theme }: { 
  title: string, 
  sections: HomepageSection[], 
  onChange: (idx: number, field: keyof HomepageSection, val: string) => void,
  theme: Theme
}) {
  return (
    <div className={`grid gap-8 p-10 border shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
      <h2 className={`text-2xl font-black uppercase tracking-tighter border-b pb-4 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>{title}</h2>
      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className={`grid gap-6 p-6 relative transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950/50' : 'bg-[#F7F7F5]'}`}>
            <span className={`absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center text-[10px] font-bold transition-colors ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>0{idx + 1}</span>
            <FormField 
              theme={theme}
              label="Section Title" 
              value={section.title} 
              onChange={(v) => onChange(idx, 'title', v)}
            />
            <FormField 
              theme={theme}
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

function InventoryTab({ theme }: { theme: Theme }) {
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

  if (carsLoading || propsLoading) return <LoadingSpinner theme={theme} />;

  return (
    <div className="space-y-8">
      <div className={`flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-8 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
        <div className="flex gap-4">
          <button 
            onClick={() => setType('cars')}
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
              type === 'cars' 
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
                : (theme === 'dark' ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600' : 'bg-white text-black border border-black/5 hover:border-black')
            }`}
          >
            Showroom
          </button>
          <button 
            onClick={() => setType('properties')}
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
              type === 'properties' 
                ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
                : (theme === 'dark' ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600' : 'bg-white text-black border border-black/5 hover:border-black')
            }`}
          >
            Portfolio
          </button>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className={`flex items-center gap-3 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
            theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          <Plus size={14} />
          Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(type === 'cars' ? cars : properties).map((item: any) => (
          <div key={item.id} className={`group border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 hover:shadow-white/5' : 'bg-white border-black/5'}`}>
            <div className="aspect-[16/10] overflow-hidden bg-gray-100">
              <img src={item.image} alt={item.model || item.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-none">{item.model || item.name}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-2 transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-black/40'}`}>{item.make || item.location}</p>
                </div>
                <span className={`text-[10px] font-black tracking-widest ${theme === 'dark' ? 'text-zinc-400' : 'text-black'}`}>{item.price}</span>
              </div>
              
              <div className={`flex gap-3 pt-6 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
                <button 
                  onClick={() => setEditingItem(item)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    theme === 'dark' 
                      ? 'border-zinc-800 text-zinc-400 hover:bg-white hover:text-black hover:border-white' 
                      : 'border-black/5 text-black hover:bg-black hover:text-white'
                  }`}
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className={`p-3 border transition-colors ${
                    theme === 'dark' ? 'border-zinc-800 text-red-400 hover:bg-red-950/30' : 'border-black/5 text-red-600 hover:bg-red-50'
                  }`}
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
          theme={theme}
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

function InventoryModal({ type, item, onClose, theme }: { type: InventoryType, item?: CarType | PropertyType | null, onClose: () => void, theme: Theme }) {
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
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 relative shadow-2xl transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
        <button onClick={onClose} className={`absolute top-8 right-8 transition-colors ${theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/40 hover:text-black'}`}>
          <X size={24} />
        </button>
        
        <h2 className={`text-3xl font-black uppercase tracking-tighter mb-12 border-b pb-6 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
          {item ? 'Modify Asset' : 'New Asset Entry'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {type === 'cars' ? (
              <>
                <FormField theme={theme} label="Identifier (slug)" value={formData.id} onChange={(v) => setFormData({...formData, id: v})} placeholder="e.g. g63-amg" disabled={!!item} />
                <FormField theme={theme} label="Manufacturer" value={formData.make} onChange={(v) => setFormData({...formData, make: v})} />
                <FormField theme={theme} label="Model Designation" value={formData.model} onChange={(v) => setFormData({...formData, model: v})} />
                <FormField theme={theme} label="Model Year" type="number" value={formData.year} onChange={(v) => setFormData({...formData, year: parseInt(v)})} />
                <FormField theme={theme} label="Horsepower" type="number" value={formData.hp} onChange={(v) => setFormData({...formData, hp: parseInt(v)})} />
              </>
            ) : (
              <>
                <FormField theme={theme} label="Identifier (slug)" value={formData.id} onChange={(v) => setFormData({...formData, id: v})} placeholder="e.g. kololo-mansion" disabled={!!item} />
                <FormField theme={theme} label="Property Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                <FormField theme={theme} label="Location" value={formData.location} onChange={(v) => setFormData({...formData, location: v})} />
                <FormField theme={theme} label="Asset Type" value={formData.type} onChange={(v) => setFormData({...formData, type: v})} />
                <FormField theme={theme} label="Bedrooms" type="number" value={formData.bedrooms} onChange={(v) => setFormData({...formData, bedrooms: parseInt(v)})} />
                <FormField theme={theme} label="Square Footage" value={formData.area} onChange={(v) => setFormData({...formData, area: v})} />
              </>
            )}
            
            <FormField theme={theme} label="Valuation" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} placeholder="$ 000,000" />
            <FormField theme={theme} label="Asset Status" value={formData.status || formData.completionDate} onChange={(v) => setFormData({...formData, [type === 'cars' ? 'status' : 'completionDate']: v})} />
            <FormField theme={theme} label="Watermark Text" value={formData.watermarkText} onChange={(v) => setFormData({...formData, watermarkText: v})} />
            <div className="md:col-span-2">
              <FormField theme={theme} label="Primary Image URL" value={formData.image} onChange={(v) => setFormData({...formData, image: v})} />
            </div>
          </div>

          <div className={`flex justify-end gap-6 pt-8 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
            <button 
              type="button"
              onClick={onClose}
              className={`px-10 py-4 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                theme === 'dark' ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-black/5 text-black hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className={`px-12 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all disabled:opacity-50 ${
                theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'
              }`}
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
  theme: Theme;
}

function FormField({ label, value, onChange, theme, type = 'text', multiline = false, placeholder = '', disabled = false }: FormFieldProps) {
  const inputClasses = `w-full border p-5 text-lg font-medium outline-none transition-all shadow-sm ${
    theme === 'dark' 
      ? 'bg-zinc-950 border-zinc-800 text-white focus:border-white placeholder:text-zinc-700' 
      : 'bg-white border-black/10 text-black focus:border-black placeholder:text-gray-300'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className="grid gap-3">
      <label className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-black/40'}`}>{label}</label>
      {multiline ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClasses} min-h-[150px] resize-none`}
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}
    </div>
  );
}

function LoadingSpinner({ theme }: { theme: Theme }) {
  return (
    <div className="flex justify-center items-center py-24">
      <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-black'}`}></div>
    </div>
  );
}

function EmptyState({ message, theme }: { message: string, theme: Theme }) {
  return (
    <div className={`p-16 text-center border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.4em] transition-colors ${theme === 'dark' ? 'text-zinc-600' : 'text-black/30'}`}>{message}</p>
    </div>
  );
}
