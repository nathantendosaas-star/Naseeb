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
import OptimizedImage from '@/components/OptimizedImage';
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
  Sun,
  Search,
  Phone,
  MessageCircle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useFirestoreCollection, useFirestoreDoc } from '@/hooks/useFirestore';
import { useRealtimeDB, updateInquiryStatus, deleteInquiryFromRTDB } from '@/hooks/useRealtimeDB';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import { ref, get } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
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
  heroTitle: string; heroSubtitle: string;
  reSections: HomepageSection[];
  autoSections: HomepageSection[];
  reVideoUrl: string;
  autoVideoUrl: string;
}

type Tab = 'inquiries' | 'homepage' | 'inventory' | 'analytics' | 'customers' | 'sales';
type InventoryType = 'cars' | 'properties';
type Theme = 'light' | 'dark';

// --- Constants ---

const ALLOWED_EMAILS = [
  'nathan@masembe.com',
  'nathantendo.saas@gmail.com'
];

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
      if (currentUser && ALLOWED_EMAILS.includes(currentUser.email || '')) {
        setUser(currentUser);
        setAuthError(null);
      } else if (currentUser) {
        // Logged in but not authorized
        signOut(auth);
        setUser(null);
        setAuthError("This account is not authorized to access the Masembe Admin Dashboard. Please contact the system administrator.");
      } else {
        setUser(null);
      }
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
      <div className={`min-h-screen pt-24 pb-12 px-6 md:px-12 flex justify-center items-center transition-all duration-700 ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900 via-purple-950 to-slate-950 text-white' 
          : 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-100 via-violet-50 to-fuchsia-100 text-slate-900'
      }`}>
        <div className={`p-12 rounded-3xl border text-center max-w-lg w-full shadow-2xl backdrop-blur-2xl transition-all duration-700 ${
          theme === 'dark' 
            ? 'bg-white/5 border-white/10 shadow-black/50' 
            : 'bg-white/40 border-white/40 shadow-indigo-900/10'
        }`}>
          <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter">Admin Access</h1>
          <p className={`mb-10 uppercase text-[10px] font-bold tracking-[0.3em] ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600/60'}`}>Masembe Management System</p>
          
          {authError && (
            <div className={`mb-8 p-5 border rounded-2xl flex items-start gap-4 text-left ${
              theme === 'dark' 
                ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                : 'bg-red-50/50 border-red-200 text-red-600'
            }`}>
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium">{authError}</p>
            </div>
          )}

          <button 
            onClick={handleLogin}
            className={`w-full py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-300 rounded-2xl shadow-xl hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-white text-indigo-950 hover:shadow-white/20 hover:bg-indigo-50' 
                : 'bg-indigo-600 text-white hover:shadow-indigo-600/20 hover:bg-indigo-700'
            }`}
          >
            Authenticate via Google
          </button>

          <button 
            onClick={toggleTheme}
            className={`mt-10 p-4 rounded-full border transition-all duration-300 hover:scale-110 ${
              theme === 'dark' 
                ? 'border-white/10 hover:bg-white/10 text-white' 
                : 'border-indigo-900/10 hover:bg-white/50 text-indigo-900'
            }`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    );
  }

  const themeClasses = theme === 'dark' 
    ? 'bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900 via-purple-950 to-slate-950 text-white selection:bg-white selection:text-indigo-900' 
    : 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-100 via-violet-50 to-fuchsia-100 text-slate-900 selection:bg-indigo-600 selection:text-white';

  return (
    <div className={`min-h-screen flex transition-all duration-700 ${themeClasses}`}>
      <Helmet>
        <title>Admin Dashboard | Masembe Group</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar Navigation */}
      <aside className={`w-72 fixed inset-y-6 left-6 z-50 rounded-3xl border backdrop-blur-2xl transition-all duration-500 shadow-2xl flex flex-col ${
        theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white/60 border-white/60 shadow-indigo-900/10'
      }`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${theme === 'dark' ? 'bg-white text-indigo-900 shadow-white/10' : 'bg-indigo-600 text-white shadow-indigo-600/20'}`}>
              <Database size={20} />
            </div>
            <h1 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Masembe.</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'inquiries', icon: <MessageSquare size={18} />, label: 'Inquiries' },
              { id: 'analytics', icon: <TrendingUp size={18} />, label: 'Analytics' },
              { id: 'inventory', icon: <Database size={18} />, label: 'Inventory' },
              { id: 'homepage', icon: <LayoutDashboard size={18} />, label: 'Content' },
              { id: 'customers', icon: <Users size={18} />, label: 'CRM' },
              { id: 'sales', icon: <DollarSign size={18} />, label: 'Revenue' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl ${
                  activeTab === tab.id 
                    ? (theme === 'dark' ? 'bg-white text-indigo-950 shadow-xl shadow-white/10' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20') 
                    : (theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50')
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
              {user.displayName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black uppercase truncate">{user.displayName || 'Admin'}</p>
              <p className="text-[9px] font-bold text-white/40 truncate opacity-60">Operations Manager</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-black tracking-[0.3em] uppercase transition-all rounded-2xl border ${
              theme === 'dark' ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 mr-6 my-6 flex flex-col gap-6 h-[calc(100vh-3rem)]">
        {/* Top Floating Bar */}
        <header className={`p-6 rounded-3xl border backdrop-blur-2xl transition-all duration-500 shadow-2xl flex justify-between items-center ${
          theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white/60 border-white/60 shadow-indigo-900/10'
        }`}>
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40">Dashboard /</h2>
            <span className="text-sm font-black uppercase tracking-widest">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                theme === 'dark' ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-indigo-900/10 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className={`h-10 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-indigo-900/10'}`} />
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase">{format(new Date(), 'EEEE, MMMM do')}</p>
              <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">System Status: Optimal</p>
            </div>
          </div>
        </header>

        {/* Tab Content Panel */}
        <div className={`flex-1 overflow-y-auto p-10 rounded-3xl border backdrop-blur-2xl transition-all duration-500 shadow-2xl custom-scrollbar ${
          theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white/40 border-white/40 shadow-indigo-900/10'
        }`}>
          {activeTab === 'inquiries' && <InquiriesTab theme={theme} />}
          {activeTab === 'homepage' && <HomepageTab theme={theme} />}
          {activeTab === 'inventory' && <InventoryTab theme={theme} />}
          {activeTab === 'analytics' && <AnalyticsTab theme={theme} />}
          {activeTab === 'customers' && <CustomersTab theme={theme} />}
          {activeTab === 'sales' && <SalesTab theme={theme} />}
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function InquiriesTab({ theme }: { theme: Theme }) {
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [typeFilter, setTypeFilter] = useState<'all' | 'car' | 'property' | 'general'>('all');
  
  const { data: inquiries = [], isLoading: loading, error } = useRealtimeDB<Inquiry>('inquiries', 100);

  const filteredInquiries = inquiries.filter((i: Inquiry) => {
    // Status filter
    if (filter === 'all') {
      if (i.status === 'archived') return false;
    } else {
      if (i.status !== filter) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && i.itemType !== typeFilter) return false;

    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesName = `${i.firstName} ${i.lastName}`.toLowerCase().includes(searchLower);
      const matchesEmail = i.email.toLowerCase().includes(searchLower);
      const matchesPhone = i.phone?.toLowerCase().includes(searchLower);
      const matchesItem = i.itemName.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesEmail && !matchesPhone && !matchesItem) return false;
    }

    return true;
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
    <div className="space-y-10">
      {/* Search & Filters */}
      <div className={`p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500 shadow-xl ${
        theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white/60 border-white/60 shadow-indigo-900/10'
      }`}>
        <div className="relative mb-8">
          <Search className={`absolute left-6 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`} size={20} />
          <input 
            type="text" 
            placeholder="Search leads by name, email, phone or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-16 pr-6 py-5 text-sm font-black tracking-widest uppercase outline-none rounded-2xl transition-all ${
              theme === 'dark' 
                ? 'bg-black/20 border border-white/5 focus:border-white/20 text-white placeholder:text-white/20' 
                : 'bg-indigo-50/50 border border-indigo-100 focus:border-indigo-300 text-slate-900 placeholder:text-slate-300'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Status:</span>
            <div className="flex gap-2 p-1 rounded-xl bg-black/10">
              {['all', 'new', 'read'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-6 py-2.5 text-[9px] font-black tracking-[0.2em] uppercase transition-all rounded-lg ${
                    filter === f 
                      ? (theme === 'dark' ? 'bg-white text-indigo-950 shadow-lg' : 'bg-indigo-600 text-white shadow-lg') 
                      : (theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900')
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Category:</span>
            <div className="flex gap-2 p-1 rounded-xl bg-black/10">
              {['all', 'car', 'property', 'general'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setTypeFilter(t as any)}
                  className={`px-6 py-2.5 text-[9px] font-black tracking-[0.2em] uppercase transition-all rounded-lg ${
                    typeFilter === t 
                      ? (theme === 'dark' ? 'bg-white text-indigo-950 shadow-lg' : 'bg-indigo-600 text-white shadow-lg') 
                      : (theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-900')
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <EmptyState theme={theme} message="No inquiries matching your search and filters." />
      ) : (
        <div className="grid gap-6">
          {filteredInquiries.map((inquiry: any) => (
            <div 
              key={inquiry.id} 
              className={`p-10 rounded-3xl border transition-all duration-500 shadow-xl ${
                theme === 'dark' 
                  ? `bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40 hover:bg-white/10 ${inquiry.status === 'new' ? 'border-l-4 border-l-white bg-white/[0.08]' : 'opacity-70'}` 
                  : `bg-white border-black/5 shadow-gray-200/50 hover:shadow-gray-200 ${inquiry.status === 'new' ? 'border-l-4 border-l-black bg-white shadow-lg' : 'opacity-80'}`
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-10">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    {inquiry.itemType === 'car' ? (
                      <span className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} p-2.5 rounded-xl shadow-lg transition-all`}><Car size={16} /></span>
                    ) : inquiry.itemType === 'property' ? (
                      <span className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} p-2.5 rounded-xl shadow-lg transition-all`}><Home size={16} /></span>
                    ) : (
                      <span className={`${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-black'} p-2.5 rounded-xl transition-all`}><MessageSquare size={16} /></span>
                    )}
                    <span className={`font-black uppercase tracking-[0.3em] text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-black/60'}`}>{inquiry.itemName}</span>
                    {inquiry.status === 'new' && (
                      <span className={`${theme === 'dark' ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-black text-white shadow-lg shadow-black/10'} text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] transition-all`}>New</span>
                    )}
                    {inquiry.preferredContact && (
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border transition-all ${
                        inquiry.preferredContact === 'whatsapp' ? 'text-green-500 border-green-500/30 bg-green-500/5' : 
                        inquiry.preferredContact === 'phone' ? 'text-blue-500 border-blue-500/30 bg-blue-500/5' : 'text-zinc-500 border-zinc-500/30 bg-zinc-500/5'
                      }`}>
                        {inquiry.preferredContact}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-4xl font-black uppercase tracking-tight mb-3">{inquiry.firstName} {inquiry.lastName}</h3>
                  <div className={`flex flex-wrap items-center gap-x-10 gap-y-4 text-xs font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-black/50'}`}>
                    <a href={`mailto:${inquiry.email}`} className={`flex items-center gap-2 transition-colors ${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'}`}>
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a href={`tel:${inquiry.phone}`} className={`flex items-center gap-2 text-lg font-mono tracking-tighter transition-colors ${theme === 'dark' ? 'text-white hover:text-white' : 'text-black hover:text-black'}`}>
                        <Phone size={14} className="opacity-40" />
                        {inquiry.phone}
                      </a>
                    )}
                    <span className="opacity-30">{format(new Date(inquiry.createdAt), 'MMM d, yyyy // HH:mm')}</span>
                  </div>
                  
                  <div className={`mt-8 p-10 rounded-2xl border transition-all duration-500 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-black/5 border-black/5'}`}>
                    <p className={`text-base md:text-xl leading-relaxed font-medium whitespace-pre-wrap transition-all ${theme === 'dark' ? 'text-zinc-300' : 'text-black/80'}`}>{inquiry.message}</p>
                  </div>
                </div>
                
                <div className={`flex flex-row lg:flex-col justify-end gap-3 lg:pl-10 lg:border-l transition-all duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                  {inquiry.phone && (
                    <>
                      <a 
                        href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}?text=Hello ${inquiry.firstName}, this is from Masembe Group regarding your inquiry for ${inquiry.itemName}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-green-600 text-white hover:bg-green-700 transition-all rounded-xl shadow-xl shadow-green-600/20"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                      <a 
                        href={`tel:${inquiry.phone}`}
                        className={`flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] border transition-all rounded-xl ${
                          theme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'
                        }`}
                      >
                        <Phone size={14} />
                        Call
                      </a>
                    </>
                  )}
                  <div className={`h-px w-full my-4 hidden lg:block ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
                  <button 
                    onClick={() => markAsRead(inquiry.id, inquiry.status)}
                    disabled={inquiry.status === 'read'}
                    className={`flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl ${
                      inquiry.status === 'read' 
                        ? (theme === 'dark' ? 'bg-white/5 text-zinc-600 cursor-not-allowed' : 'bg-black/5 text-black/20 cursor-not-allowed') 
                        : (theme === 'dark' ? 'bg-white text-black shadow-xl shadow-white/10 hover:bg-zinc-200' : 'bg-black text-white shadow-xl shadow-black/10 hover:bg-gray-800')
                    }`}
                  >
                    {inquiry.status === 'read' ? <CheckCircle size={14} /> : <Circle size={14} />}
                    {inquiry.status === 'read' ? 'Archived' : 'Archive'}
                  </button>
                  <button 
                    onClick={() => deleteInquiry(inquiry.id)}
                    className={`flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] border transition-all rounded-xl ${
                      theme === 'dark'
                        ? 'text-red-400 border-red-500/20 hover:bg-red-500/10'
                        : 'text-red-600 border-red-200 hover:bg-red-50'
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
  const { data: content, isLoading: loading } = useFirestoreDoc<HomepageContent>('content', 'homepage');
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
      toast.success('Homepage updated successfully.');
    } catch (error) {
      console.error("Error updating homepage:", error);
      toast.error('Failed to update homepage.');
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
    <div className="max-w-4xl space-y-12 pb-24">
      <div className={`grid gap-8 p-12 rounded-3xl border shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
        <h2 className={`text-2xl font-black uppercase tracking-tighter border-b pb-6 transition-all duration-500 ${theme === 'dark' ? 'border-white/10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40' : 'border-black/5'}`}>Hero Configuration</h2>
        <div className="grid gap-8">
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

      <div className={`grid gap-8 p-12 rounded-3xl border shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
        <h2 className={`text-2xl font-black uppercase tracking-tighter border-b pb-6 transition-all duration-500 ${theme === 'dark' ? 'border-white/10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40' : 'border-black/5'}`}>Media Assets</h2>
        <div className="grid gap-8">
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

      <div className="sticky bottom-10 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl transition-all flex items-center gap-4 disabled:opacity-50 ${
            theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/20'
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
    <div className={`grid gap-8 p-12 rounded-3xl border shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
      <h2 className={`text-2xl font-black uppercase tracking-tighter border-b pb-6 transition-all duration-500 ${theme === 'dark' ? 'border-white/10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40' : 'border-black/5'}`}>{title}</h2>
      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className={`grid gap-8 p-8 relative rounded-2xl transition-all duration-500 border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-black/5 border-black/5'}`}>
            <span className={`absolute -top-3 -left-3 w-10 h-10 flex items-center justify-center text-xs font-black rounded-xl shadow-lg transition-all ${theme === 'dark' ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/10'}`}>0{idx + 1}</span>
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

  const { data: cars = [], isLoading: carsLoading } = useFirestoreCollection<CarType>('cars');
  const { data: properties = [], isLoading: propsLoading } = useFirestoreCollection<PropertyType>('properties');

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
        {(type === 'cars' ? cars : properties).map((item: any, index: number) => (
          <div 
            key={item.id} 
            className={`group rounded-3xl border overflow-hidden transition-all duration-500 shadow-xl ${
              theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40 hover:bg-white/10' : 'bg-white border-black/5 shadow-gray-200/50'
            }`}
          >
            <div className="aspect-[16/10] overflow-hidden bg-black/20">
              <OptimizedImage 
                src={item.image} 
                alt={item.model || item.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                priority={index < 3}
              />
            </div>
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{item.model || item.name}</h3>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-3 transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-black/40'}`}>{item.make || item.location}</p>
                </div>
                <span className={`text-[11px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full ${theme === 'dark' ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-black text-white shadow-lg shadow-black/10'}`}>{item.price}</span>
              </div>
              
              <div className={`flex gap-3 pt-8 border-t transition-all duration-500 ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                <button 
                  onClick={() => setEditingItem(item)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    theme === 'dark' 
                      ? 'border-white/10 text-white hover:bg-white hover:text-black hover:border-white shadow-lg shadow-white/5' 
                      : 'border-black/10 text-black hover:bg-black hover:text-white shadow-lg shadow-black/5'
                  }`}
                >
                  <Edit2 size={12} />
                  Modify
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    theme === 'dark' ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-red-100 text-red-600 hover:bg-red-50'
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
      toast.success("Asset saved successfully.");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving asset.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-12 relative rounded-3xl border transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'bg-zinc-900/90 border-white/10 text-white shadow-black/60' : 'bg-white/95 border-black/5 text-black shadow-gray-400/20'}`}>
        <button onClick={onClose} className={`absolute top-10 right-10 transition-colors p-2 rounded-full hover:bg-white/5 ${theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/40 hover:text-black'}`}>
          <X size={24} />
        </button>
        
        <h2 className={`text-4xl font-black uppercase tracking-tighter mb-12 border-b pb-8 transition-colors duration-300 ${theme === 'dark' ? 'border-white/10 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40' : 'border-black/5 text-black'}`}>
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
            <div className="md:col-span-2">
              <FormField 
                theme={theme} 
                label="Gallery Image URLs (Comma separated)" 
                value={formData.gallery ? formData.gallery.join(', ') : ''} 
                onChange={(v) => setFormData({...formData, gallery: v.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                multiline
                placeholder="https://image1.jpg, https://image2.jpg, ..."
              />
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
    <div className="flex flex-col items-center justify-center py-32 space-y-6">
      <div className="relative">
        <div className={`w-16 h-16 rounded-full border-4 ${theme === 'dark' ? 'border-white/5' : 'border-indigo-100'}`} />
        <div className={`absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-transparent animate-spin ${theme === 'dark' ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]'}`} />
      </div>
      <p className={`text-[10px] font-black uppercase tracking-[0.4em] animate-pulse ${theme === 'dark' ? 'text-white/40' : 'text-indigo-900/40'}`}>Synchronizing System...</p>
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

// --- Analytics Tab ---

function AnalyticsTab({ theme }: { theme: Theme }) {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [topPages, setTopPages] = useState<{path: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analyticsRef = ref(rtdb, 'analytics/visits');
        const snapshot = await get(analyticsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dailyCounts: { [key: string]: number } = {};
          const pageCounts: { [key: string]: number } = {};
          let total = 0;

          // Process data
          Object.entries(data).forEach(([date, visits]: [string, any]) => {
            if (!visits || typeof visits !== 'object') return;
            
            const visitArray = Object.values(visits);
            dailyCounts[date] = (dailyCounts[date] || 0) + visitArray.length;
            total += visitArray.length;

            visitArray.forEach((visit: any) => {
              if (visit && visit.path) {
                pageCounts[visit.path] = (pageCounts[visit.path] || 0) + 1;
              }
            });
          });

          // Format for Recharts
          const chartData = Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

          const sortedPages = Object.entries(pageCounts)
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setAnalyticsData(chartData);
          setTotalViews(total);
          setTopPages(sortedPages);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner theme={theme} />;

  return (
    <div className="space-y-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Page Views', value: totalViews, sub: 'All-time' },
          { label: 'Active Sessions', value: analyticsData.length > 0 ? analyticsData[analyticsData.length - 1].count : 0, sub: 'Today' },
          { label: 'Conversion Rate', value: '--', sub: 'Target: 3.5%' }
        ].map((stat) => (
          <div key={stat.label} className={`p-10 rounded-3xl border transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-6">{stat.label}</span>
            <h3 className="text-6xl font-black tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-40">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className={`p-12 rounded-3xl border transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
        <h2 className="text-xl font-black uppercase tracking-tighter mb-12">Traffic Overview</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#10b981' : '#6366f1'} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={theme === 'dark' ? '#10b981' : '#6366f1'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => format(new Date(val), 'MMM d')}
              />
              <YAxis 
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                  border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(12px)',
                  padding: '12px',
                  fontSize: '10px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke={theme === 'dark' ? '#10b981' : '#6366f1'} 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Pages */}
      <div className={`p-12 rounded-3xl border transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
        <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Popular Destinations</h2>
        <div className="space-y-2">
          {topPages.map((page, idx) => (
            <div key={page.path} className={`flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}>
              <div className="flex items-center gap-6">
                <span className={`text-[10px] font-black opacity-20 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>0{idx + 1}</span>
                <span className="text-sm font-bold tracking-widest uppercase">{page.path}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`h-1 w-24 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                  <div 
                    className={`h-full rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} 
                    style={{ width: `${(page.count / (topPages[0]?.count || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-bold">{page.count} views</span>
              </div>
            </div>
          ))}
          {topPages.length === 0 && (
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-center py-12">Waiting for more visitor data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- CRM / Customers Tab ---

function CustomersTab({ theme }: { theme: Theme }) {
  const { data: customers = [], isLoading: loading } = useFirestoreCollection<any>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter((c: any) => 
    c.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    c.phone?.includes(debouncedSearchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Remove this customer from the database?')) {
      try {
        await deleteDoc(doc(db, 'customers', id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) return <LoadingSpinner theme={theme} />;

  return (
    <div className="space-y-8">
      <div className={`p-10 rounded-3xl border transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Client Relations Management</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Manage your high-net-worth client database.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-xl ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            New Client Profile
          </button>
        </div>
      </div>

      {/* Search */}
      <div className={`p-8 rounded-3xl border transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
        <div className="relative">
          <Search className={`absolute left-6 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-zinc-500' : 'text-black/30'}`} size={20} />
          <input 
            type="text" 
            placeholder="Search clients by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-16 pr-6 py-5 text-sm font-bold tracking-widest uppercase outline-none border-b transition-all ${
              theme === 'dark' 
                ? 'bg-transparent border-white/10 focus:border-white text-white' 
                : 'bg-transparent border-black/5 focus:border-black text-black'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCustomers.map((customer: any) => (
          <div key={customer.id} className={`p-10 rounded-3xl border transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40 hover:bg-white/10' : 'bg-white border-black/5 shadow-gray-200/50'}`}>
            <div className="flex justify-between items-start mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black transition-all shadow-lg ${theme === 'dark' ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/10'}`}>
                {customer.name?.charAt(0)}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingCustomer(customer)} className={`p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-500 hover:text-white' : 'bg-black/5 text-black/30 hover:text-black'}`}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(customer.id)} className={`p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-red-500/10 text-red-900 hover:text-red-500' : 'bg-red-50 text-red-200 hover:text-red-600'}`}><Trash2 size={16} /></button>
              </div>
            </div>
            
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{customer.name}</h3>
            <div className={`space-y-1 text-[10px] font-bold uppercase tracking-widest opacity-60 mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-black'}`}>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
            </div>

            <div className={`pt-6 border-t ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-2">Lifetime Value</span>
              <p className="text-lg font-mono font-bold">{customer.ltv || '$ 0.00'}</p>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && !loading && (
          <div className="md:col-span-3">
            <EmptyState theme={theme} message="No client profiles found." />
          </div>
        )}
      </div>

      {(isAdding || editingCustomer) && (
        <CustomerModal 
          theme={theme}
          customer={editingCustomer} 
          onClose={() => {
            setIsAdding(false);
            setEditingCustomer(null);
          }} 
        />
      )}
    </div>
  );
}

function CustomerModal({ customer, onClose, theme }: { customer?: any, onClose: () => void, theme: Theme }) {
  const [formData, setFormData] = useState(customer || {
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    ltv: '$ 0.00'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (customer) {
        await updateDoc(doc(db, 'customers', customer.id), formData);
      } else {
        const id = Date.now().toString();
        await setDoc(doc(db, 'customers', id), { ...formData, id });
      }
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving client profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl p-12 relative shadow-2xl transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
        <button onClick={onClose} className={`absolute top-8 right-8 transition-colors ${theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/40 hover:text-black'}`}>
          <X size={24} />
        </button>
        
        <h2 className={`text-3xl font-black uppercase tracking-tighter mb-12 border-b pb-6 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
          {customer ? 'Update Client' : 'New Client Profile'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField theme={theme} label="Full Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
            <FormField theme={theme} label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
            <FormField theme={theme} label="Phone Number" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
            <FormField theme={theme} label="Initial LTV" value={formData.ltv} onChange={(v) => setFormData({...formData, ltv: v})} />
            <div className="md:col-span-2">
              <FormField theme={theme} label="Client Notes" value={formData.notes} onChange={(v) => setFormData({...formData, notes: v})} multiline />
            </div>
          </div>

          <div className={`flex justify-end gap-6 pt-8 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
            <button type="button" onClick={onClose} className={`px-10 py-4 text-[10px] font-bold uppercase tracking-widest border transition-all ${theme === 'dark' ? 'border-zinc-800 text-zinc-400' : 'border-black/5 text-black hover:bg-gray-50'}`}>Cancel</button>
            <button type="submit" disabled={isSaving} className={`px-12 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all disabled:opacity-50 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>{isSaving ? 'Processing...' : 'Save Profile'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- POS / Sales Tab ---

function SalesTab({ theme }: { theme: Theme }) {
  const { data: sales = [], isLoading: salesLoading } = useFirestoreCollection<any>('sales');
  const [isAdding, setIsAdding] = useState(false);

  const totalRevenue = sales.reduce((sum: number, sale: any) => {
    const priceStr = sale.salePrice || '0';
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    return sum + price;
  }, 0);

  if (salesLoading) return <LoadingSpinner theme={theme} />;

  return (
    <div className="space-y-8">
      <div className={`p-8 border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Transaction Intelligence</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Monitor and log asset acquisitions.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className={`px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            Record Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`p-8 border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-4">Total Revenue</span>
          <h3 className="text-4xl font-black tracking-tighter">$ {totalRevenue.toLocaleString()}</h3>
        </div>
        <div className={`p-8 border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-4">Transactions</span>
          <h3 className="text-4xl font-black tracking-tighter">{sales.length}</h3>
        </div>
        <div className={`p-8 border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 block mb-4">Average Sale</span>
          <h3 className="text-4xl font-black tracking-tighter">
            $ {sales.length > 0 ? (totalRevenue / sales.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
          </h3>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className={`border overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-black/5'}`}>
        <div className="p-8 border-b border-black/5 dark:border-zinc-800">
          <h3 className="text-sm font-black uppercase tracking-widest">Recent Acquisitions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 border-b ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Asset</th>
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-zinc-800">
              {sales.sort((a: any, b: any) => b.createdAt?.localeCompare(a.createdAt)).map((sale: any) => (
                <tr key={sale.id} className={`text-xs font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50'}`}>
                  <td className="px-8 py-6 opacity-60">{format(new Date(sale.createdAt), 'MMM d, yyyy')}</td>
                  <td className="px-8 py-6">{sale.itemName}</td>
                  <td className="px-8 py-6">{sale.customerName}</td>
                  <td className="px-8 py-6 text-right font-mono">{sale.salePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && (
            <div className="p-12 text-center opacity-40 text-[10px] font-bold uppercase tracking-[0.3em]">No transaction history available.</div>
          )}
        </div>
      </div>

      {isAdding && (
        <SaleModal 
          theme={theme}
          onClose={() => setIsAdding(false)} 
        />
      )}
    </div>
  );
}

function SaleModal({ onClose, theme }: { onClose: () => void, theme: Theme }) {
  const { data: customers = [] } = useFirestoreCollection<any>('customers');
  const { data: cars = [] } = useFirestoreCollection<any>('cars');
  const { data: properties = [] } = useFirestoreCollection<any>('properties');
  
  const [formData, setFormData] = useState({
    customerId: '',
    itemId: '',
    itemType: 'cars' as 'cars' | 'properties',
    salePrice: '',
    notes: '',
    status: 'Sold'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.itemId) {
      toast.error("Please select both a client and an asset.");
      return;
    }

    setIsSaving(true);
    try {
      const customer = customers.find((c: any) => c.id === formData.customerId);
      const items = formData.itemType === 'cars' ? cars : properties;
      const item = items.find((i: any) => i.id === formData.itemId);

      const saleId = Date.now().toString();
      const saleData = {
        ...formData,
        id: saleId,
        customerName: customer?.name || 'Unknown Client',
        itemName: item?.model || item?.name || 'Unknown Asset',
        createdAt: new Date().toISOString()
      };

      // 1. Create Sale Document
      await setDoc(doc(db, 'sales', saleId), saleData);

      // 2. Update Asset Status
      await updateDoc(doc(db, formData.itemType, formData.itemId), {
        status: 'Sold'
      });

      // 3. Update Customer LTV
      const currentLtv = parseFloat((customer?.ltv || '0').replace(/[^0-9.]/g, '')) || 0;
      const saleAmt = parseFloat(formData.salePrice.replace(/[^0-9.]/g, '')) || 0;
      const newLtv = currentLtv + saleAmt;
      
      await updateDoc(doc(db, 'customers', formData.customerId), {
        ltv: `$ ${newLtv.toLocaleString()}`
      });

      onClose();
    } catch (error) {
      console.error("Sale recording error:", error);
      toast.error("Error recording transaction.");
    } finally {
      setIsSaving(false);
    }
  };

  const availableItems = (formData.itemType === 'cars' ? cars : properties).filter((i: any) => i.status !== 'Sold');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl p-12 relative shadow-2xl transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
        <button onClick={onClose} className={`absolute top-8 right-8 transition-colors ${theme === 'dark' ? 'text-zinc-600 hover:text-white' : 'text-black/40 hover:text-black'}`}>
          <X size={24} />
        </button>
        
        <h2 className={`text-3xl font-black uppercase tracking-tighter mb-12 border-b pb-6 transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
          Record Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="grid gap-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40`}>Select Client</label>
              <select 
                value={formData.customerId} 
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                className={`w-full border p-5 text-sm font-bold uppercase tracking-widest outline-none transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-black/10'}`}
              >
                <option value="">Choose Client...</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="grid gap-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40`}>Asset Category</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, itemType: 'cars', itemId: ''})}
                  className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-widest border transition-all ${formData.itemType === 'cars' ? (theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-black/5 text-black')}`}
                >
                  Showroom
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, itemType: 'properties', itemId: ''})}
                  className={`flex-1 py-4 text-[9px] font-bold uppercase tracking-widest border transition-all ${formData.itemType === 'properties' ? (theme === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-black/5 text-black')}`}
                >
                  Portfolio
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-40`}>Select Asset</label>
              <select 
                value={formData.itemId} 
                onChange={(e) => setFormData({...formData, itemId: e.target.value})}
                className={`w-full border p-5 text-sm font-bold uppercase tracking-widest outline-none transition-all ${theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-black/10'}`}
              >
                <option value="">Choose Asset...</option>
                {availableItems.map((i: any) => <option key={i.id} value={i.id}>{i.model || i.name}</option>)}
              </select>
            </div>

            <FormField theme={theme} label="Final Sale Price" value={formData.salePrice} onChange={(v) => setFormData({...formData, salePrice: v})} placeholder="$ 000,000" />
            
            <div className="md:col-span-2">
              <FormField theme={theme} label="Transaction Notes" value={formData.notes} onChange={(v) => setFormData({...formData, notes: v})} multiline />
            </div>
          </div>

          <div className={`flex justify-end gap-6 pt-8 border-t transition-colors duration-300 ${theme === 'dark' ? 'border-zinc-800' : 'border-black/5'}`}>
            <button type="button" onClick={onClose} className={`px-10 py-4 text-[10px] font-bold uppercase tracking-widest border transition-all ${theme === 'dark' ? 'border-zinc-800 text-zinc-400' : 'border-black/5 text-black hover:bg-gray-50'}`}>Cancel</button>
            <button type="submit" disabled={isSaving} className={`px-12 py-4 text-[10px] font-bold uppercase tracking-[0.4em] transition-all disabled:opacity-50 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>{isSaving ? 'Synchronizing...' : 'Log Transaction'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
