import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { LanguageCode, getLocalizedCropName } from '../services/translations.ts';
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
  initialRole?: 'farmer' | 'buyer';
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
  
  const [role, setRole] = useState<UserRole>(initialRole);
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState(initialRole === 'farmer' ? 'Ramesh Kumar' : 'Rajesh Agro Foods');
  const [state, setState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Guntur');
  const [village, setVillage] = useState('Prathipadu');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

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
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-2 rounded-xl bg-emerald-950/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black">Kisan<span className="text-amber-300">Mitra</span></h2>
                <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-emerald-100 text-[10px] font-black uppercase">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {step === 'details' ? 'Step 1: Role & Location Setup' : 'Step 2: Mobile OTP Verification'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[calc(85vh-100px)] overflow-y-auto space-y-5">
          
          {/* Quick Demo Login Shortcut */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Instant 1-Click Demo Sandbox:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={async () => {
                  await switchDemoUser('farmer');
                  if (onSuccess) onSuccess();
                  else onClose();
                }}
                className="p-2.5 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-300 shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>🌾 Farmer (Ramesh)</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await switchDemoUser('buyer');
                  if (onSuccess) onSuccess();
                  else onClose();
                }}
                className="p-2.5 bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs rounded-xl border border-blue-300 shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>🏢 Buyer (Rajesh Agro)</span>
              </button>
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
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Choose User Role (రైతు / కొనుగోలుదారు)
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('farmer');
                      if (!name) setName('Ramesh Kumar');
                    }}
                    className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                      role === 'farmer'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">🌾</span>
                    <span>Farmer / FPO (రైతు)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('buyer');
                      if (!name || name === 'Ramesh Kumar') setName('Rajesh Agro Processors');
                    }}
                    className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                      role === 'buyer'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-950/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">🏢</span>
                    <span>Buyer / Mill (కొనుగోలుదారు)</span>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-800" />
                  <span>2. Preferred Language (భాషను ఎంచుకోండి)</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { code: 'te', label: 'తెలుగు' },
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'kn', label: 'ಕನ್ನಡ' },
                    { code: 'mr', label: 'मराठी' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code as LanguageCode)}
                      className={`py-1.5 px-2 rounded-xl border font-bold text-center transition cursor-pointer ${
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Entity</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (+91)</label>
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
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Village / Locality</label>
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
                  3. Select Crops of Interest
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
                            ? 'bg-emerald-800 text-white border-emerald-800'
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
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Sending OTP...' : 'Send Verification OTP →'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                  >
                    Edit Details
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
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Verifying...' : 'Verify OTP & Enter KisanMitra'}</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
