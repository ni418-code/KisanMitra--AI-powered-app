import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LanguageCode, getLocalizedCropName } from '../services/translations.ts';
import { LANDING_PAGE_TRANSLATIONS } from '../services/landingPageTranslations.ts';
import {
  TrendingUp,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileText,
  Lock,
  PhoneCall,
  Scale,
  Warehouse,
  ChevronDown,
  Wheat,
  Building2,
  BadgeCheck,
  RefreshCw,
  Search,
  Menu,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (role?: 'farmer' | 'buyer', mode?: 'login' | 'register') => void;
  onExploreMandi: () => void;
}

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Farmer & Buyer Direct Communication',
    overlayText: 'Know the price before you sell.',
    badge: 'Transparent Negotiation',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    description: 'Bypass non-transparent intermediary chains and negotiate price, quality, and delivery directly with KYC-verified food mills and wholesale processors.',
    icon: ShieldCheck,
    tag: 'Direct Connection',
  },
  {
    id: 2,
    title: 'Real-Time Mandi Intelligence on Mobile',
    overlayText: 'Find buyers who actually need your product.',
    badge: 'AGMARKNET Live Feeds',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
    description: 'Instant comparisons between local Mandi modal rates and national MSP benchmarks with automatic net-in-pocket profit calculation after transit costs.',
    icon: TrendingUp,
    tag: 'Market Intelligence',
  },
  {
    id: 3,
    title: 'Farm-Gate Logistics & Verified Delivery',
    overlayText: 'Track your transaction from farm to delivery.',
    badge: 'End-to-End Escrow & Transport',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    description: 'Book nearby agricultural transport carriers, secure payments in milestone escrow, and track produce handoff from farm gate to destination warehouse.',
    icon: Truck,
    tag: 'Reliable Logistics',
  },
];

const LIVE_TICKER_ITEMS = [
  { crop: 'Tomato', mandi: 'Guntur, AP', price: '₹28/kg', modal: '₹2,800/qtl', change: '+8.2%' },
  { crop: 'Chilli', mandi: 'Tenali, AP', price: '₹190/kg', modal: '₹19,000/qtl', change: '+4.5%' },
  { crop: 'Turmeric', mandi: 'Duggirala, AP', price: '₹135/kg', modal: '₹13,500/qtl', change: '+3.4%' },
  { crop: 'Paddy (Rice)', mandi: 'Nizamabad, TS', price: '₹23.5/kg', modal: '₹2,350/qtl', change: '+1.1%'},
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreMandi }) => {
  const { language, setLanguage, t, switchDemoUser } = useAuth();
  const lt = LANDING_PAGE_TRANSLATIONS[language] || LANDING_PAGE_TRANSLATIONS.en;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [authDropdown, setAuthDropdown] = useState<'login' | 'register' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Top Notification / Mandi Ticker Bar */}
      <div className="bg-emerald-950 text-white text-xs border-b border-emerald-900 overflow-hidden py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse mr-1.5" />
              {lt.liveArrivalsBadge}
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex items-center space-x-6 mx-4 text-[11px] text-emerald-200">
            {LIVE_TICKER_ITEMS.map((item, idx) => (
              <div key={idx} className="inline-flex items-center space-x-1.5 hover:text-white transition cursor-pointer" onClick={onExploreMandi}>
                <span className="font-semibold text-white">{getLocalizedCropName(item.crop, language)}:</span>
                <span className="text-emerald-300 font-bold">{item.price}</span>
                <span className="text-[10px] text-slate-400">({item.mandi})</span>
                <span className={`text-[10px] font-bold ${item.change.startsWith('+') ? 'text-emerald-400' : item.change.startsWith('-') ? 'text-rose-400' : 'text-amber-300'}`}>
                  {item.change}
                </span>
                {idx < LIVE_TICKER_ITEMS.length - 1 && <span className="text-emerald-800 ml-4">•</span>}
              </div>
            ))}
          </div>

          <div className="shrink-0 hidden md:block text-[11px] text-emerald-300/80 font-medium">
            {lt.agmarknetMspSource}
          </div>
        </div>
      </div>

      {/* Main Header / Top Nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        
        {/* Desktop Navbar Layout (md and above) - Logo, Top Menu, Sign In, Register */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 items-center justify-between">
          
          {/* Left: The Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-600/30">
              <Wheat className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                  Kisan<span className="text-emerald-800">Mitra</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Center: The Top Menu */}
          <nav className="flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            <button
              onClick={onExploreMandi}
              className="px-3.5 py-2 text-xs lg:text-sm font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition cursor-pointer"
            >
              {lt.navLiveMandi}
            </button>
            <a
              href="#features"
              className="px-3.5 py-2 text-xs lg:text-sm font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition cursor-pointer"
            >
              {lt.navDirectBuyers}
            </a>
            <a
              href="#features"
              className="px-3.5 py-2 text-xs lg:text-sm font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition cursor-pointer"
            >
              {lt.navLogistics}
            </a>
            <a
              href="#how-it-works"
              className="px-3.5 py-2 text-xs lg:text-sm font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition cursor-pointer"
            >
              {lt.navHowItWorks}
            </a>
            <a
              href="#ai-assistant"
              className="px-3.5 py-2 text-xs lg:text-sm font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-xl transition cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lt.navAiSahayak}</span>
            </a>
          </nav>

          {/* Right: Language Dropdown + Sign In + Register */}
          <div className="flex items-center space-x-2.5 relative">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer border border-slate-200 shadow-2xs"
                title="Change Platform Language"
              >
                <span className="text-sm">🌐</span>
                <span className="uppercase font-black text-emerald-900">{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400">{lt.prefLangLabel}</div>
                  {[
                    { code: 'te', label: 'తెలుగు (Telugu)' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' },
                    { code: 'en', label: 'English' },
                    { code: 'ta', label: 'தமிழ் (Tamil)' },
                    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                    { code: 'ml', label: 'മലയാളം (Malayalam)' },
                    { code: 'mr', label: 'मराठी (Marathi)' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code as LanguageCode);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-900 transition ${
                        language === l.code ? 'font-black text-emerald-800 bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In Trigger */}
            <div className="relative">
              <button
                onClick={() => setAuthDropdown(authDropdown === 'login' ? null : 'login')}
                className="px-4 py-2 text-xs font-black text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center space-x-1.5 border border-slate-200"
              >
                <span>{lt.loginBtn}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {authDropdown === 'login' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <p className="px-2 py-1 text-[10px] font-black uppercase text-slate-400">{lt.selectPortalSignIn}</p>
                  <button
                    onClick={() => {
                      setAuthDropdown(null);
                      onOpenAuth('farmer', 'login');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Wheat className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-black text-emerald-950">🌾 {lt.farmerPortal}</div>
                      <div className="text-[10px] text-slate-500">{lt.farmerPortalDesc}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setAuthDropdown(null);
                      onOpenAuth('buyer', 'login');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-950 text-xs font-bold flex items-center space-x-2 transition cursor-pointer mt-1"
                  >
                    <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <div>
                      <div className="font-black text-blue-950">🏢 {lt.buyerPortal}</div>
                      <div className="text-[10px] text-slate-500">{lt.buyerPortalDesc}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Register Trigger */}
            <div className="relative">
              <button
                onClick={() => setAuthDropdown(authDropdown === 'register' ? null : 'register')}
                className="px-4.5 py-2 text-xs font-black text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-900/20 transition cursor-pointer flex items-center space-x-1.5"
              >
                <span>{lt.registerBtn}</span>
                <ChevronDown className="w-3 h-3 text-emerald-200" />
              </button>

              {authDropdown === 'register' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                  <p className="px-2 py-1 text-[10px] font-black uppercase text-slate-400">{lt.selectPortalRegister}</p>
                  <button
                    onClick={() => {
                      setAuthDropdown(null);
                      onOpenAuth('farmer', 'register');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Wheat className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <div className="font-black text-emerald-950">🌾 {lt.farmerPortal}</div>
                      <div className="text-[10px] text-slate-500">{lt.farmerPortalDesc}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setAuthDropdown(null);
                      onOpenAuth('buyer', 'register');
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-950 text-xs font-bold flex items-center space-x-2 transition cursor-pointer mt-1"
                  >
                    <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <div>
                      <div className="font-black text-blue-950">🏢 {lt.buyerPortal}</div>
                      <div className="text-[10px] text-slate-500">{lt.buyerPortalDesc}</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navbar Layout: Clean, balanced, showing all 4 features: Logo, Top Menu, Sign In, Register */}
        <div className="md:hidden">
          
          {/* Mobile Row 1: Logo + Language + Mobile Menu Toggle */}
          <div className="px-3.5 py-2.5 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-xs">
                <Wheat className="w-4 h-4" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-slate-900 tracking-tight font-serif">
                  Kisan<span className="text-emerald-800">Mitra</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Mobile Language Button */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition"
                  aria-label="Change Language"
                >
                  <span className="text-xs">🌐</span>
                  <span className="uppercase font-black text-emerald-900 text-[11px]">{language}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                    <div className="px-3 py-1 text-[9px] font-extrabold uppercase text-slate-400">{lt.prefLangLabel}</div>
                    {[
                      { code: 'te', label: 'తెలుగు (Telugu)' },
                      { code: 'hi', label: 'हिन्दी (Hindi)' },
                      { code: 'en', label: 'English' },
                      { code: 'ta', label: 'தமிழ் (Tamil)' },
                      { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                      { code: 'ml', label: 'മലയാളം (Malayalam)' },
                      { code: 'mr', label: 'मराठी (Marathi)' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as LanguageCode);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                          language === l.code ? 'font-black text-emerald-800 bg-emerald-50' : 'text-slate-700'
                        }`}
                      >
                        <span>{l.label}</span>
                        {language === l.code && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4 text-slate-700" /> : <Menu className="w-4 h-4 text-slate-700" />}
                <span className="text-[11px] font-bold">{lt.topMenuFeatures.split(' ')[0] || 'Menu'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Row 2: Sign In & Register Buttons */}
          <div className="grid grid-cols-2 gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => {
                setAuthDropdown(authDropdown === 'login' ? null : 'login');
                setIsMobileMenuOpen(false);
              }}
              className="h-10 w-full px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-black shadow-2xs flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>{lt.loginBtn}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${authDropdown === 'login' ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => {
                setAuthDropdown(authDropdown === 'register' ? null : 'register');
                setIsMobileMenuOpen(false);
              }}
              className="h-10 w-full px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs shadow-emerald-900/20 flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>{lt.registerBtn}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-emerald-200 transition-transform ${authDropdown === 'register' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Auth Portal Selector Drawer */}
          {authDropdown && (
            <div className="px-3 pb-3 bg-slate-50/95 border-b border-slate-200 animate-in slide-in-from-top duration-150">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider my-2 text-center">
                {authDropdown === 'login' ? lt.selectPortalSignIn : lt.selectPortalRegister}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const mode = authDropdown;
                    setAuthDropdown(null);
                    onOpenAuth('farmer', mode);
                  }}
                  className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-100 text-emerald-950 text-xs font-black flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer shadow-2xs"
                >
                  <Wheat className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>🌾 {lt.farmerPortal}</span>
                </button>

                <button
                  onClick={() => {
                    const mode = authDropdown;
                    setAuthDropdown(null);
                    onOpenAuth('buyer', mode);
                  }}
                  className="p-2.5 rounded-xl border border-blue-300 bg-blue-100 text-blue-950 text-xs font-black flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer shadow-2xs"
                >
                  <Building2 className="w-4 h-4 text-blue-800 shrink-0" />
                  <span>🏢 {lt.buyerPortal}</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Full Menu Drawer (when Menu button is tapped) */}
          {isMobileMenuOpen && (
            <div className="px-4 py-4 bg-white border-b border-slate-200 space-y-3 animate-in slide-in-from-top duration-150">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{lt.topMenuFeatures}</div>
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onExploreMandi();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs flex items-center space-x-2.5 transition cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <div className="text-slate-900">{lt.navLiveMandi}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{lt.mobileMandiDesc}</div>
                  </div>
                </button>

                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs flex items-center space-x-2.5 transition block cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <div className="text-slate-900">{lt.navDirectBuyers}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{lt.mobileBuyersDesc}</div>
                  </div>
                </a>

                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs flex items-center space-x-2.5 transition block cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <div className="text-slate-900">{lt.navLogistics}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{lt.mobileLogisticsDesc}</div>
                  </div>
                </a>

                <a
                  href="#how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs flex items-center space-x-2.5 transition block cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-emerald-800 shrink-0" />
                  <div>
                    <div className="text-slate-900">{lt.navHowItWorks}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{lt.mobileWorkflowDesc}</div>
                  </div>
                </a>

                <a
                  href="#ai-assistant"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 text-slate-800 font-bold text-xs flex items-center space-x-2.5 transition block rounded-xl border border-amber-200/80 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-amber-950">{lt.navAiSahayak}</div>
                    <div className="text-[10px] text-amber-800/80 font-normal">{lt.mobileAiDesc}</div>
                  </div>
                </a>
              </div>
            </div>
          )}

        </div>

      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-slate-50 pt-10 sm:pt-16 pb-14 border-b border-slate-200">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-300/10 via-teal-300/10 to-amber-300/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-xs font-extrabold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
              <span>{lt.heroBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Kisan<span className="text-emerald-800">Mitra</span>
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-700">
                {lt.heroHeadline}
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              {lt.heroSubheadline}
            </p>

            {/* Two Main Role CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={() => onOpenAuth('farmer', 'login')}
                className="w-full sm:w-auto px-7 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-900/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 cursor-pointer ring-2 ring-emerald-600/30 group"
              >
                <span>{lt.farmerCta}</span>
                <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAuth('buyer', 'login')}
                className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-base rounded-2xl shadow-xl shadow-slate-900/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 cursor-pointer ring-2 ring-slate-700 group"
              >
                <span>{lt.buyerCta}</span>
                <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Core Question answered */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 font-semibold italic">
                {lt.heroQuote}
              </p>
            </div>
          </div>

          {/* Hero Visual: Farmer <---> KisanMitra <---> Buyer Flow Architecture */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
            
            <div className="text-center mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                {lt.bridgeEyebrow}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                {lt.bridgeTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Left: Farmer Card */}
              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 text-center space-y-2 relative group hover:bg-emerald-100/60 transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
                  <Wheat className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-sm">{lt.farmerCardTitle}</h4>
                <ul className="text-xs text-emerald-900/80 space-y-1 text-left pt-1">
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{lt.farmerBullet1}</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{lt.farmerBullet2}</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{lt.farmerBullet3}</span>
                  </li>
                </ul>
                <button
                  onClick={() => onOpenAuth('farmer', 'login')}
                  className="w-full mt-3 py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <span>🌾 {lt.openFarmerLogin}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center: KisanMitra Core Engine */}
              <div className="bg-gradient-to-b from-slate-900 to-emerald-950 text-white rounded-2xl p-5 text-center space-y-3 shadow-lg relative">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto font-black shadow-md">
                  KM
                </div>
                <div>
                  <h4 className="font-black text-amber-300 text-sm">{lt.engineTitle}</h4>
                  <p className="text-[11px] text-slate-300">{lt.engineSubtitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-emerald-300">
                    {lt.badgeBetterPrice}
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-amber-300">
                    {lt.badgeVerifiedBuyer}
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-blue-300">
                    {lt.badgeFastLogistics}
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-teal-300">
                    {lt.badgeMilestoneEscrow}
                  </div>
                </div>
              </div>

              {/* Right: Buyer Card */}
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-200 text-center space-y-2 relative group hover:bg-blue-100/60 transition">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-blue-950 text-sm">{lt.buyerCardTitle}</h4>
                <ul className="text-xs text-blue-900/80 space-y-1 text-left pt-1">
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{lt.buyerBullet1}</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{lt.buyerBullet2}</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>{lt.buyerBullet3}</span>
                  </li>
                </ul>
                <button
                  onClick={() => onOpenAuth('buyer', 'login')}
                  className="w-full mt-3 py-2 px-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <span>🏢 {lt.openBuyerLogin}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Bottom Flow Indicators */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-bold text-slate-700">{lt.protectedTransactionLabel}</span>
              <div className="flex items-center flex-wrap gap-1 text-[11px] font-semibold text-emerald-800">
                {(lt?.flowSteps || []).map((step, idx) => (
                  <React.Fragment key={idx}>
                    <span>{step}</span>
                    {idx < (lt?.flowSteps?.length || 0) - 1 && <span className="text-slate-400 mx-0.5">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3-Slide Image Carousel Section */}
      <section className="py-14 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                {lt.carouselEyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {lt.carouselTitle}
              </h2>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Carousel Slide */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl min-h-[420px] flex items-center">
            
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <img
                src={CAROUSEL_SLIDES[currentSlide].image}
                alt={CAROUSEL_SLIDES[currentSlide].title}
                className="w-full h-full object-cover opacity-35 filter brightness-90 transition-all duration-700 scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            {/* Slide Content Overlay */}
            <div className="relative z-10 p-6 sm:p-12 max-w-2xl space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                {lt.carouselSlides?.[currentSlide]?.badge || CAROUSEL_SLIDES[currentSlide].badge}
              </span>

              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                “{lt.carouselSlides?.[currentSlide]?.overlayText || CAROUSEL_SLIDES[currentSlide].overlayText}”
              </blockquote>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {lt.carouselSlides?.[currentSlide]?.description || CAROUSEL_SLIDES[currentSlide].description}
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={() => onOpenAuth('farmer', 'register')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition cursor-pointer"
                >
                  {lt.startAsFarmer}
                </button>
                <button
                  onClick={() => onOpenAuth('buyer', 'register')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                >
                  {lt.startAsBuyer}
                </button>
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Three Core Feature Cards */}
      <section id="features" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              {lt.coreCapabilities}
            </span>
            <h2 className="text-3xl font-black text-slate-950">
              {lt.transformingAgriTitle}
            </h2>
            <p className="text-slate-600 text-sm">
              {lt.transformingAgriSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Better Price Discovery */}
            <div className="bg-slate-50 hover:bg-emerald-50/40 rounded-3xl p-7 border border-slate-200 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shadow-xs group-hover:bg-emerald-800 group-hover:text-white transition">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-950 transition">
                📈 {lt.card1Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lt.card1Desc}
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lt.card1Bullet1}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lt.card1Bullet2}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{lt.card1Bullet3}</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Direct Buyer Connection */}
            <div className="bg-slate-50 hover:bg-blue-50/40 rounded-3xl p-7 border border-slate-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shadow-xs group-hover:bg-blue-900 group-hover:text-white transition">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-950 transition">
                🤝 {lt.card2Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lt.card2Desc}
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{lt.card2Bullet1}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{lt.card2Bullet2}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{lt.card2Bullet3}</span>
                </li>
              </ul>
            </div>

            {/* Card 3: End-to-End Transaction */}
            <div className="bg-slate-50 hover:bg-amber-50/40 rounded-3xl p-7 border border-slate-200 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs group-hover:bg-amber-700 group-hover:text-white transition">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-950 transition">
                🚚 {lt.card3Title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lt.card3Desc}
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{lt.card3Bullet1}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{lt.card3Bullet2}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{lt.card3Bullet3}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Step-by-Step "How KisanMitra Works" Workflow */}
      <section id="how-it-works" className="py-16 bg-slate-100/70 border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              {lt.lifecycleEyebrow}
            </span>
            <h2 className="text-3xl font-black text-slate-950">
              {lt.howItWorksTitle}
            </h2>
            <p className="text-slate-600 text-sm">
              {lt.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 text-sm">{lt.step1Title}</h4>
              <p className="text-xs text-slate-600">
                {lt.step1Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 text-sm">{lt.step2Title}</h4>
              <p className="text-xs text-slate-600">
                {lt.step2Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-slate-900 text-sm">{lt.step3Title}</h4>
              <p className="text-xs text-slate-600">
                {lt.step3Desc}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">4</span>
              <h4 className="font-bold text-slate-900 text-sm">{lt.step4Title}</h4>
              <p className="text-xs text-slate-600">
                {lt.step4Desc}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Floating AI Teaser Banner */}
      <section id="ai-assistant" className="py-12 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lt.copilotEyebrow}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              {lt.copilotTitle}
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              {lt.copilotDesc}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onOpenAuth('farmer', 'register')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition cursor-pointer"
            >
              {lt.askAiNow}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black">
              KM
            </div>
            <div>
              <span className="text-white font-bold">KisanMitra</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>{lt.footerLiveSource}</span>
            <span>{lt.footerMspSchedule}</span>
          </div>

          <div className="text-slate-500">
            {lt.footerCopyright}
          </div>
        </div>
      </footer>

    </div>
  );
};
