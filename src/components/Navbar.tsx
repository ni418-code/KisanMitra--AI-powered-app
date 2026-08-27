import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LanguageCode } from '../services/translations.ts';
import { api } from '../services/api.ts';
import { NotificationItem } from '../types/index.ts';
import {
  Sprout,
  MapPin,
  Bell,
  Globe,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
  openChatModal?: (convId?: string) => void;
}

const POPULAR_LOCATIONS = [
  { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Mandi' },
  { state: 'Andhra Pradesh', district: 'Krishna', market: 'Vijayawada Market' },
  { state: 'Andhra Pradesh', district: 'Kurnool', market: 'Kurnool Market' },
  { state: 'Telangana', district: 'Hyderabad', market: 'Bowenpally Mandi' },
  { state: 'Telangana', district: 'Warangal', market: 'Warangal Mandi' },
  { state: 'Telangana', district: 'Nizamabad', market: 'Nizamabad Mandi' },
  { state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon Mandi' },
  { state: 'Punjab', district: 'Ludhiana', market: 'Khanna Mandi' },
  { state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Mandi' },
  { state: 'Uttar Pradesh', district: 'Agra', market: 'Agra Mandi' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAuthModal, openChatModal }) => {
  const { user, language, setLanguage, t, switchDemoUser, logout, updateLocation } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    const res = await api.getNotifications();
    if (res.success && res.data) {
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDetectGPS = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectingLocation(false);
          updateLocation({
            state: user?.location?.state || 'Andhra Pradesh',
            district: user?.location?.district || 'Guntur',
            market: 'Nearest GPS Mandi',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setShowLocationPicker(false);
        },
        () => {
          setDetectingLocation(false);
          setShowLocationPicker(false);
        }
      );
    } else {
      setDetectingLocation(false);
      setShowLocationPicker(false);
    }
  };

  const markRead = async (id: string) => {
    await api.markNotificationRead(id);
    fetchNotifications();
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center shadow-inner text-emerald-950 font-bold">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white font-serif">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-700/70 text-emerald-100 rounded-full border border-emerald-600/50">
                  Agri Market Live
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Location Chip */}
          <div className="relative">
            <button
              id="location-picker-btn"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="flex items-center space-x-1.5 bg-emerald-800/80 hover:bg-emerald-700/90 text-emerald-50 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-emerald-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span className="max-w-[90px] sm:max-w-[140px] truncate">
                {user?.location?.district || 'Guntur'}, {user?.location?.state || 'AP'}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {showLocationPicker && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Mandi Location</span>
                  <button
                    onClick={handleDetectGPS}
                    disabled={detectingLocation}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${detectingLocation ? 'animate-spin' : ''}`} />
                    <span>{detectingLocation ? 'Detecting...' : 'Use GPS'}</span>
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        updateLocation(loc);
                        setShowLocationPicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        user?.location?.district === loc.district
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{loc.market}</p>
                        <p className="text-[10px] text-slate-500">{loc.district}, {loc.state}</p>
                      </div>
                      {user?.location?.district === loc.district && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector */}
            <div className="relative">
              <select
                id="language-select"
                aria-label="Select Preferred Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs sm:text-sm font-medium py-1.5 px-2 sm:px-2.5 rounded-lg border border-emerald-700 focus:ring-2 focus:ring-amber-400 focus:outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
                <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
              </select>
              <Globe className="w-3 h-3 text-emerald-300 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg border border-emerald-700 transition"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {t.notifications} ({notifications.length})
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">Real-time alerts</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No new notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markRead(n.id);
                            if (n.type === 'chat' && openChatModal) openChatModal(n.referenceId);
                            if (n.type === 'order') setCurrentTab('orders');
                            if (n.type === 'offer') setCurrentTab('offers');
                            if (n.type === 'request') setCurrentTab('buyerRequests');
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-lg text-xs cursor-pointer transition border ${
                            n.isRead ? 'bg-slate-50 border-slate-200/60' : 'bg-emerald-50/80 border-emerald-300 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & Profile Dropdown */}
            <div className="relative">
              <button
                id="role-profile-btn"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-600 shadow-sm transition"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-amber-300">
                  {user?.role === 'farmer' ? '🌾' : user?.role === 'buyer' ? '🏢' : '👑'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-tight">{user?.name || 'Guest'}</p>
                  <p className="text-[10px] text-emerald-200 uppercase font-semibold tracking-wide">
                    {user?.role || 'Guest'} • {user?.userId || ''}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="border-b border-slate-100 pb-2 mb-2">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500">{user?.phone} • {user?.userId}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Active: {user?.role?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Quick Role Switcher
                  </p>
                  <div className="space-y-1 mb-2">
                    <button
                      onClick={() => {
                        switchDemoUser('farmer');
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user?.role === 'farmer' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>🌾</span> <span>Farmer (Ramesh Patel)</span>
                      </span>
                      {user?.role === 'farmer' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser('buyer');
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user?.role === 'buyer' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>🏢</span> <span>Buyer (Rajesh Agro Ltd)</span>
                      </span>
                      {user?.role === 'buyer' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser('admin');
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                        user?.role === 'admin' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>👑</span> <span>Platform Admin</span>
                      </span>
                      {user?.role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        openAuthModal();
                        setShowRoleSwitcher(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-emerald-700 hover:bg-emerald-50 font-semibold"
                    >
                      📱 Log In with Another Phone / OTP
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
