import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LanguageCode, getLocalizedCropName } from '../services/translations.ts';
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
  { crop: 'Cotton', mandi: 'Warangal, TS', price: '₹72/kg', modal: '₹7,200/qtl', change: '+2.1%' },
  { crop: 'Paddy (Rice)', mandi: 'Nizamabad, TS', price: '₹23.5/kg', modal: '₹2,350/qtl', change: 'MSP Benchmarked' },
  { crop: 'Turmeric', mandi: 'Duggirala, AP', price: '₹145/kg', modal: '₹14,500/qtl', change: '+11.4%' },
  { crop: 'Onion', mandi: 'Lasalgaon, MH', price: '₹24/kg', modal: '₹2,400/qtl', change: '-1.8%' },
  { crop: 'Maize', mandi: 'Kurnool, AP', price: '₹22.5/kg', modal: '₹2,250/qtl', change: '+3.0%' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreMandi }) => {
  const { language, setLanguage, t, switchDemoUser } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
      <div className="bg-emerald-950 text-white text-xs border-b border-emerald-900 overflow-hidden py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-[10px] font-extrabold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse mr-1.5" />
              {t.liveArrivals}
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

          <button
            onClick={onExploreMandi}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline shrink-0 hidden sm:inline-flex cursor-pointer"
          >
            View All APMC Mandis →
          </button>
        </div>
      </div>

      {/* Main Header / Top Nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-600/30">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Kisan<span className="text-emerald-800">Mitra</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer border border-slate-200"
              >
                <span className="text-sm">🌐</span>
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400">Select Language</div>
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'te', label: 'తెలుగు (Telugu)' },
                    { code: 'hi', label: 'हिन्दी (Hindi)' },
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
                        language === l.code ? 'font-black text-emerald-800 bg-emerald-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Demo Login Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => switchDemoUser('farmer')}
                className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition cursor-pointer flex items-center space-x-1.5"
              >
                <span>🌾 Demo Farmer</span>
              </button>
              <button
                onClick={() => switchDemoUser('buyer')}
                className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl transition cursor-pointer flex items-center space-x-1.5"
              >
                <span>🏢 Demo Buyer</span>
              </button>
            </div>

            {/* Auth Actions */}
            <button
              onClick={() => onOpenAuth(undefined, 'login')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              {t.login}
            </button>

            <button
              onClick={() => onOpenAuth(undefined, 'register')}
              className="px-4.5 py-2 text-xs sm:text-sm font-black text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-900/20 transition cursor-pointer flex items-center space-x-1.5"
            >
              <span>{t.signUp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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
              <span>Smart India Hackathon 2026 • Agri-Market Intelligence Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Kisan<span className="text-emerald-800">Mitra</span>
              <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-700">
                {t.heroHeadline}
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              {t.heroSubheadline}
            </p>

            {/* Two Main Role CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={() => onOpenAuth('farmer', 'register')}
                className="w-full sm:w-auto px-7 py-4 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-900/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 cursor-pointer ring-2 ring-emerald-600/30 group"
              >
                <span>🌾 I'm a Farmer / FPO</span>
                <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenAuth('buyer', 'register')}
                className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-base rounded-2xl shadow-xl shadow-slate-900/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 cursor-pointer ring-2 ring-slate-700 group"
              >
                <span>🏢 I'm a Buyer / Processor</span>
                <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Core Question answered */}
            <div className="pt-2">
              <p className="text-xs text-slate-500 font-semibold italic">
                “Answers the fundamental question: Should I sell now, where should I sell, and to whom?”
              </p>
            </div>
          </div>

          {/* Hero Visual: Farmer <---> KisanMitra <---> Buyer Flow Architecture */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
            
            <div className="text-center mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                Interactive Transaction Bridge
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                Unified Agricultural Commerce Flow
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Left: Farmer Card */}
              <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 text-center space-y-2 relative group hover:bg-emerald-100/60 transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
                  <Wheat className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-sm">🌾 Farmer / FPO</h4>
                <ul className="text-xs text-emerald-900/80 space-y-1 text-left pt-1">
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Create Digital Lots with Grade A/B/C</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Live Mandi & MSP Comparison</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Net-in-Pocket Profit Calculator</span>
                  </li>
                </ul>
              </div>

              {/* Center: KisanMitra Core Engine */}
              <div className="bg-gradient-to-b from-slate-900 to-emerald-950 text-white rounded-2xl p-5 text-center space-y-3 shadow-lg relative">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto font-black shadow-md">
                  KM
                </div>
                <div>
                  <h4 className="font-black text-amber-300 text-sm">🛡️ KisanMitra Engine</h4>
                  <p className="text-[11px] text-slate-300">Smart Matching & Trust Layer</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-emerald-300">
                    📈 Better Price
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-amber-300">
                    ✓ Verified Buyer
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-blue-300">
                    🚚 Fast Logistics
                  </div>
                  <div className="bg-white/10 rounded-lg p-1.5 font-bold text-teal-300">
                    🔒 Milestone Escrow
                  </div>
                </div>
              </div>

              {/* Right: Buyer Card */}
              <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-200 text-center space-y-2 relative group hover:bg-blue-100/60 transition">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-blue-950 text-sm">🏢 Buyer / Processor</h4>
                <ul className="text-xs text-blue-900/80 space-y-1 text-left pt-1">
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Post Bulk Purchase Demands</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Source Directly from 10,000+ Farmers</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Quality-Verified Digital Handoff</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Flow Indicators */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-bold text-slate-700">7-Stage Protected Transaction:</span>
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-800">
                <span>Lot Created</span> → <span>Smart Match</span> → <span>Bilateral Offer</span> → <span>Digital Agreement</span> → <span>Milestone Fund</span> → <span>Transport</span> → <span>Delivery</span>
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
                Field Visuals & Real Operations
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                KisanMitra in Action Across Rural India
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
                {CAROUSEL_SLIDES[currentSlide].badge}
              </span>

              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                “{CAROUSEL_SLIDES[currentSlide].overlayText}”
              </blockquote>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {CAROUSEL_SLIDES[currentSlide].description}
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <button
                  onClick={() => onOpenAuth('farmer', 'register')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition cursor-pointer"
                >
                  Start as Farmer →
                </button>
                <button
                  onClick={() => onOpenAuth('buyer', 'register')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                >
                  Start as Buyer →
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
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-black text-slate-950">
              Transforming Agricultural Trade in India
            </h2>
            <p className="text-slate-600 text-sm">
              Designed specifically for the ground realities of Indian farmers, FPOs, and processing industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Better Price Discovery */}
            <div className="bg-slate-50 hover:bg-emerald-50/40 rounded-3xl p-7 border border-slate-200 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shadow-xs group-hover:bg-emerald-800 group-hover:text-white transition">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-950 transition">
                📈 {t.betterPrice}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.betterPriceDesc} Compares local Mandi modal rates against national MSP benchmarks with automatic 7-day trend forecasts.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Real-time AGMARKNET integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Net in-pocket calculator minus transit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Optimal sale-window recommendations</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Direct Buyer Connection */}
            <div className="bg-slate-50 hover:bg-blue-50/40 rounded-3xl p-7 border border-slate-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center shadow-xs group-hover:bg-blue-900 group-hover:text-white transition">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-950 transition">
                🤝 {t.verifiedBuyer}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.verifiedBuyerDesc} Smart 6-factor matching engine evaluates crop variety, distance, volume, price, and reliability score.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>100% KYC & GSTIN verified buyers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Bilateral counter-offer negotiation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Direct WhatsApp / In-app messaging</span>
                </li>
              </ul>
            </div>

            {/* Card 3: End-to-End Transaction */}
            <div className="bg-slate-50 hover:bg-amber-50/40 rounded-3xl p-7 border border-slate-200 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs group-hover:bg-amber-700 group-hover:text-white transition">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-950 transition">
                🚚 {t.endToEnd}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.endToEndDesc} Integrated logistics carriers and storage warehouses ensure your harvest is transported safely and payments release on delivery.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-200/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Digital agreement & e-contract</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Milestone secured payment release</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Nearby cold storage & warehouse search</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Step-by-Step "How KisanMitra Works" Workflow */}
      <section className="py-16 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Transaction Lifecycle
            </span>
            <h2 className="text-3xl font-black text-slate-950">
              {t.howItWorks}
            </h2>
            <p className="text-slate-600 text-sm">
              From initial registration to physical produce delivery and payment disbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Register & Choose Language</h4>
              <p className="text-xs text-slate-600">
                OTP verified onboarding with full agricultural localization in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, or English.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 text-sm">Create Lot / Post Demand</h4>
              <p className="text-xs text-slate-600">
                Farmers specify crop grade, moisture, harvest date & price. Buyers post bulk procurement specifications.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-slate-900 text-sm">Smart Match & Negotiate</h4>
              <p className="text-xs text-slate-600">
                AI matching engine connects compatible lots. Exchange bilateral counter-offers in real time.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center">4</span>
              <h4 className="font-bold text-slate-900 text-sm">Secured Transport & Pay</h4>
              <p className="text-xs text-slate-600">
                Sign digital agreement, fund milestone payment, assign transport carrier, and confirm receipt.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Floating AI Teaser Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI Agricultural Copilot</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Try AI KisanMitra Sahayak
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Ask in Telugu (“Tomato price entha undi?”), Hindi (“धान का एमएसपी क्या है?”), or English for real-time rates, nearby buyers, and preservation guidance.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onOpenAuth('farmer', 'register')}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition cursor-pointer"
            >
              Ask AI Assistant Now →
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
              <span className="text-white font-bold">KisanMitra</span> • Smart India Hackathon 2026
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>Live Data Source: data.gov.in / AGMARKNET</span>
            <span>CACP MSP Schedule 2024-25</span>
          </div>

          <div className="text-slate-500">
            © 2026 KisanMitra Platform. Built for Indian Agriculture.
          </div>
        </div>
      </footer>

    </div>
  );
};
