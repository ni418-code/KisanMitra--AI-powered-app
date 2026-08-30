import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { LanguageCode, getLocalizedCropName } from '../services/translations.ts';
import { LANDING_PAGE_TRANSLATIONS } from '../services/landingPageTranslations.ts';
import {
  X,
  Phone,
  KeyRound,
  Wheat,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Check,
  CheckCircle2,
  Globe,
  MapPin,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'farmer',
  initialMode = 'login',
}) => {
  const { loginWithOTP, requestOTP, switchDemoUser, language, setLanguage, t } = useAuth();
  const lt = LANDING_PAGE_TRANSLATIONS[language] || LANDING_PAGE_TRANSLATIONS.en;
  
  const role: UserRole = (initialRole as UserRole) || 'farmer';
  const isFarmer = role === 'farmer';
  const isBuyer = role === 'buyer';

  const [phone, setPhone] = useState(isBuyer ? '9123456789' : '9876543210');
  const [name, setName] = useState(isBuyer ? 'Rajesh Agro Foods Ltd' : 'Ramesh Kumar');
  const [state, setState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Guntur');
  const [village, setVillage] = useState(isBuyer ? 'Industrial Processing Zone' : 'Prathipadu');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  // Sync state when initialRole changes
  React.useEffect(() => {
    if (initialRole === 'buyer') {
      setName('Rajesh Agro Foods Ltd');
      setPhone('9123456789');
      setVillage('Industrial Processing Zone');
    } else {
      setName('Ramesh Kumar');
      setPhone('9876543210');
      setVillage('Prathipadu');
    }
    setStep('details');
    setMessage(null);
    setOtp('');
  }, [initialRole, isOpen]);

  // Crop Preferences
  const availableCrops = ['Tomato', 'Chilli', 'Cotton', 'Paddy', 'Turmeric', 'Maize', 'Onion'];
  const [preferredCrops, setPreferredCrops] = useState<string[]>(['Tomato', 'Chilli', 'Cotton']);

  if (!isOpen) return null;

  const toggleCrop = (crop: string) => {
    if (preferredCrops.includes(crop)) {
      setPreferredCrops(preferredCrops.filter((c) => c !== crop));
    } else {
      setPreferredCrops([...preferredCrops, crop]);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit mobile number.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    const res = await requestOTP(phone, role);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      setDemoCode(res.demoCode || '123456');
      setMessage({
        text: `OTP sent successfully! (Sandbox test code: ${res.demoCode || '123456'})`,
        type: 'success',
      });
      setOtp(res.demoCode || '123456');
    } else {
      setMessage({ text: res.message || 'Failed to send OTP.', type: 'error' });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ text: 'Please enter the 6-digit OTP.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    const res = await loginWithOTP(
      phone,
      otp,
      role,
      name,
      { state, district, village },
      preferredCrops
    );
    setLoading(false);

    if (res.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } else {
      setMessage({ text: res.message || 'Verification failed. Try 123456.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header - Specialized for Role */}
        <div className={`p-6 relative text-white ${
          isFarmer
            ? 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded-xl bg-black/30 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md ${
              isFarmer ? 'bg-amber-400 text-emerald-950' : 'bg-blue-500 text-white'
            }`}>
              {isFarmer ? <Wheat className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black">
                  {isFarmer ? lt.authFarmerTitle : lt.authBuyerTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-200">
                {isFarmer
                  ? (step === 'details' ? lt.authFarmerSubtitle : lt.enterOtpTitle)
                  : (step === 'details' ? lt.authBuyerSubtitle : lt.enterOtpTitle)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[calc(85vh-100px)] overflow-y-auto space-y-5">
          
          {/* Quick Demo Login Shortcut - ONLY for the selected role */}
          <div className={`rounded-2xl p-3.5 space-y-2 border ${
            isFarmer ? 'bg-emerald-50/90 border-emerald-200' : 'bg-blue-50/90 border-blue-200'
          }`}>
            <div className={`flex items-center space-x-2 font-extrabold text-xs ${
              isFarmer ? 'text-emerald-950' : 'text-blue-950'
            }`}>
              <Sparkles className={`w-4 h-4 ${isFarmer ? 'text-amber-600' : 'text-blue-600'}`} />
              <span>
                {isFarmer ? lt.demoFarmerLabel : lt.demoBuyerLabel}
              </span>
            </div>

            <div>
              {isFarmer ? (
                <button
                  type="button"
                  onClick={async () => {
                    await switchDemoUser('farmer');
                    if (onSuccess) onSuccess();
                    else onClose();
                  }}
                  className="w-full p-3 bg-white hover:bg-emerald-100/60 text-emerald-950 font-black text-xs rounded-xl border border-emerald-300 shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Wheat className="w-4 h-4 text-emerald-700" />
                  <span>{lt.demoFarmerBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await switchDemoUser('buyer');
                    if (onSuccess) onSuccess();
                    else onClose();
                  }}
                  className="w-full p-3 bg-white hover:bg-blue-100/60 text-blue-950 font-black text-xs rounded-xl border border-blue-300 shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>{lt.demoBuyerBtn}</span>
                </button>
              )}
            </div>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold ${
                message.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-800" />
                  <span>{lt.prefLangLabel}</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[
                    { code: 'te', label: 'తెలుగు' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'en', label: 'English' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'kn', label: 'ಕನ್ನಡ' },
                    { code: 'ml', label: 'മലയാളം' },
                    { code: 'mr', label: 'मराठी' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code as LanguageCode)}
                      className={`py-1.5 px-2 rounded-xl border font-bold text-center transition cursor-pointer text-[11px] ${
                        language === l.code
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isFarmer ? lt.farmerNameLabel : lt.buyerNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isFarmer ? lt.farmerNamePlaceholder : lt.buyerNamePlaceholder}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isFarmer ? lt.farmerMobileLabel : lt.buyerMobileLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-wider focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{lt.districtLabel}</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isFarmer ? lt.farmerVillageLabel : lt.buyerVillageLabel}
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Crop Preferences */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFarmer ? lt.cropsGrownLabel : lt.cropsNeededLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableCrops.map((c) => {
                    const isSel = preferredCrops.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCrop(c)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                          isSel
                            ? (isFarmer ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-blue-900 text-white border-blue-900')
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {getLocalizedCropName(c, language)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white rounded-2xl font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center space-x-2 ${
                  isFarmer
                    ? 'bg-emerald-800 hover:bg-emerald-700'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span>{loading ? 'Sending OTP...' : (isFarmer ? lt.sendOtpFarmerBtn : lt.sendOtpBuyerBtn)}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lt.enterOtpTitle}
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                  >
                    {lt.editDetailsBtn}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-lg font-mono font-bold tracking-widest text-center focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Sent to +91 {phone}. Demo verification code: <span className="font-bold text-emerald-800">{demoCode || '123456'}</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white rounded-2xl font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center space-x-2 ${
                  isFarmer
                    ? 'bg-emerald-800 hover:bg-emerald-700'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <span>{loading ? 'Verifying...' : (isFarmer ? lt.verifyOtpFarmerBtn : lt.verifyOtpBuyerBtn)}</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
