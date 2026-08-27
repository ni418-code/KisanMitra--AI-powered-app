import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { LanguageCode, getLocalizedCropName } from '../services/translations.ts';
import {
  User as UserIcon,
  ShieldCheck,
  MapPin,
  Phone,
  Building2,
  Wheat,
  Globe,
  CheckCircle2,
  Save,
  Award,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, refreshUser, language, setLanguage, t } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState(user?.location?.district || 'Guntur');
  const [state, setState] = useState(user?.location?.state || 'Andhra Pradesh');
  const [village, setVillage] = useState(user?.location?.village || 'Prathipadu');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Preferred crops selection
  const availableCrops = ['Tomato', 'Chilli', 'Cotton', 'Paddy', 'Turmeric', 'Maize', 'Onion', 'Groundnut', 'Soybean'];
  const [preferredCrops, setPreferredCrops] = useState<string[]>(
    user?.preferredCrops || ['Tomato', 'Chilli', 'Cotton']
  );

  const toggleCrop = (crop: string) => {
    if (preferredCrops.includes(crop)) {
      setPreferredCrops(preferredCrops.filter((c) => c !== crop));
    } else {
      setPreferredCrops([...preferredCrops, crop]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        name,
        phone,
        location: {
          state,
          district,
          village,
        },
        preferredCrops,
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const isFarmer = user?.role === 'farmer';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${
              isFarmer ? 'bg-emerald-800 text-emerald-100' : 'bg-blue-800 text-blue-100'
            }`}
          >
            {isFarmer ? <Wheat className="w-8 h-8" /> : <Building2 className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">{user?.name || 'User Profile'}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold">
                ✓ KYC Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isFarmer ? '🌾 Farmer / FPO Producer' : '🏢 Institutional Buyer / Food Processor'} • Member since 2026
            </p>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Trust Rating</span>
          <span className="text-xl font-black text-amber-300 block">⭐ 4.9 / 5.0</span>
          <span className="text-[10px] text-emerald-300 font-semibold">100% On-Time Delivery</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Profile and crop preferences updated successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          Personal & Business Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name / Organization</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.state}</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.district}</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Village / Locality / APMC Yard</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* Preferred Crops Multi-Selection */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              {isFarmer ? '🌾 Crops You Cultivate & Sell' : '🏢 Commodities You Purchase'}
            </label>
            <p className="text-xs text-slate-500">
              Select your primary commodities to receive personalized Mandi alerts and deal matches.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {availableCrops.map((crop) => {
              const isSelected = preferredCrops.includes(crop);
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{getLocalizedCropName(crop, language)}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-bold text-slate-900">
            🌐 Preferred Application Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                type="button"
                onClick={() => setLanguage(l.code as LanguageCode)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                  language === l.code
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
