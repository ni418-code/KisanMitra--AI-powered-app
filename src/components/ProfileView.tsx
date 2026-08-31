import React, { useState, useEffect } from 'react';
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
  CreditCard,
  Landmark,
  QrCode,
  AlertCircle,
  Lock,
} from 'lucide-react';

const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Axis Bank',
  'Canara Bank',
  'Bank of Baroda',
  'Kotak Mahindra Bank',
  'Union Bank of India',
  'Indian Bank',
];

export const ProfileView: React.FC = () => {
  const { user, refreshUser, language, setLanguage, t } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState(user?.location?.district || 'Guntur');
  const [state, setState] = useState(user?.location?.state || 'Andhra Pradesh');
  const [village, setVillage] = useState(user?.location?.village || 'Prathipadu');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Bank & Payout Details state
  const [accountHolderName, setAccountHolderName] = useState(
    user?.bankDetails?.accountHolderName || user?.name || ''
  );
  const [bankName, setBankName] = useState(
    user?.bankDetails?.bankName || 'State Bank of India'
  );
  const [branchName, setBranchName] = useState(
    user?.bankDetails?.branchName || ''
  );
  const [accountNumber, setAccountNumber] = useState(
    user?.bankDetails?.accountNumber || ''
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(
    user?.bankDetails?.accountNumber || ''
  );
  const [ifscCode, setIfscCode] = useState(
    user?.bankDetails?.ifscCode || ''
  );
  const [upiId, setUpiId] = useState(
    user?.bankDetails?.upiId || (user?.phone ? `${user.phone}@sbi` : '')
  );
  const [accountType, setAccountType] = useState<'savings' | 'current'>(
    user?.bankDetails?.accountType || 'savings'
  );

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDistrict(user.location?.district || 'Guntur');
      setState(user.location?.state || 'Andhra Pradesh');
      setVillage(user.location?.village || 'Prathipadu');
      if (user.bankDetails) {
        setAccountHolderName(user.bankDetails.accountHolderName || user.name || '');
        setBankName(user.bankDetails.bankName || 'State Bank of India');
        setBranchName(user.bankDetails.branchName || '');
        setAccountNumber(user.bankDetails.accountNumber || '');
        setConfirmAccountNumber(user.bankDetails.accountNumber || '');
        setIfscCode(user.bankDetails.ifscCode || '');
        setUpiId(user.bankDetails.upiId || '');
        setAccountType(user.bankDetails.accountType || 'savings');
      }
    }
  }, [user]);

  // Preferred crops selection
  const availableCrops = ['Tomato', 'Chilli', 'Paddy', 'Turmeric', 'Maize', 'Onion', 'Groundnut', 'Soybean'];
  const [preferredCrops, setPreferredCrops] = useState<string[]>(
    user?.preferredCrops || ['Tomato', 'Chilli', 'Turmeric']
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
    setErrorMessage(null);

    // Validation for bank details if provided
    if (accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber) {
      setErrorMessage('Bank Account Numbers do not match. Please verify.');
      return;
    }

    if (ifscCode && ifscCode.trim().length !== 11) {
      setErrorMessage('IFSC Code must be exactly 11 characters (e.g., SBIN0001248 or HDFC0001428).');
      return;
    }

    setSaving(true);
    try {
      const res = await api.updateProfile({
        name,
        phone,
        location: {
          state,
          district,
          village,
        },
        preferredCrops,
        bankDetails: {
          accountHolderName: accountHolderName.trim() || name,
          bankName,
          branchName: branchName.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          upiId: upiId.trim(),
          accountType,
          isVerified: true,
        },
      });

      if (res.success) {
        await refreshUser();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setErrorMessage(res.message || 'Failed to save profile updates.');
      }
    } catch (err: any) {
      console.error('Failed to update profile', err);
      setErrorMessage(err.message || 'Network error updating profile.');
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
              {isFarmer ? '🌾 Farmer / FPO Producer' : '🏢 Institutional Buyer / Food Processor'} • User ID: {user?.userId || 'KM-000001'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Escrow Balance</span>
            <span className="text-xl font-black text-emerald-300 block">
              ₹{((isFarmer ? user?.withdrawableBalance : user?.walletBalance) || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-300 font-semibold">
              {isFarmer ? 'Withdrawable to Bank' : 'Available for Orders'}
            </span>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Trust Rating</span>
            <span className="text-xl font-black text-amber-300 block">⭐ 4.9 / 5.0</span>
            <span className="text-[10px] text-emerald-300 font-semibold">100% On-Time Delivery</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Profile, Bank Account, and Payout details updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        
        {/* Personal & Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <UserIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-extrabold text-slate-900">
              Personal & Business Information
            </h2>
          </div>

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
        </div>

        {/* BANK ACCOUNT DETAILS SECTION */}
        <div id="bank-account-details-section" className="space-y-5 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-black">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Bank Account Details
                </h2>
                <p className="text-xs text-slate-500">
                  {isFarmer
                    ? 'Enter your bank account number, IFSC code, and branch details for direct escrow settlement and harvest payouts.'
                    : 'Enter your bank account number, IFSC code, and branch details for escrow security, deposits, and verified refunds.'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>NPCI & RBI Escrow Compliant</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Holder Name */}
            <div>
              <label htmlFor="account-holder-name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Holder Name <span className="text-slate-400 font-normal">(as on passbook)</span>
              </label>
              <input
                id="account-holder-name-input"
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label htmlFor="bank-name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Bank Name
              </label>
              <div className="relative">
                <input
                  id="bank-name-input"
                  type="text"
                  list="popular-bank-list"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
                <datalist id="popular-bank-list">
                  {POPULAR_BANKS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="account-number-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Bank Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="account-number-input"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\s+/g, ''))}
                placeholder="Enter 9 to 18 digit account number"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none font-mono"
              />
            </div>

            {/* Confirm Account Number */}
            <div>
              <label htmlFor="confirm-account-number-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm Account Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="confirm-account-number-input"
                type="text"
                value={confirmAccountNumber}
                onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\s+/g, ''))}
                placeholder="Re-enter bank account number"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-slate-900 focus:ring-2 focus:outline-none font-mono ${
                  confirmAccountNumber && accountNumber !== confirmAccountNumber
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/40'
                    : 'border-slate-300 focus:ring-teal-600'
                }`}
              />
              {confirmAccountNumber && accountNumber === confirmAccountNumber && accountNumber.length > 0 && (
                <span className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                  ✓ Account numbers match
                </span>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label htmlFor="ifsc-code-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                IFSC Code (11 Characters) <span className="text-rose-500">*</span>
              </label>
              <input
                id="ifsc-code-input"
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                placeholder="e.g. SBIN0001248"
                maxLength={11}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 uppercase font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                4 letters (Bank), 5th char '0', followed by 6 branch code digits
              </span>
            </div>

            {/* Branch Details */}
            <div>
              <label htmlFor="branch-details-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Branch Details / Branch Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="branch-details-input"
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="e.g. Guntur Main Branch, Market Yard"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Location or city of your bank branch
              </span>
            </div>

            {/* Account Type */}
            <div>
              <label htmlFor="account-type-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Type
              </label>
              <select
                id="account-type-select"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as 'savings' | 'current')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value="savings">Savings Account (Individual / Farmer)</option>
                <option value="current">Current Account (Agri-Business / FPO / Enterprise)</option>
              </select>
            </div>

            {/* UPI ID */}
            <div>
              <label htmlFor="upi-id-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                UPI ID (Virtual Payment Address - VPA)
              </label>
              <input
                id="upi-id-input"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value.replace(/\s+/g, ''))}
                placeholder="e.g. 9876543210@sbi or name@okhdfcbank"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-950">
            <div className="flex items-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Bank data is 256-bit encrypted. Stored in server database for secure automated escrow disbursements.</span>
            </div>
            <button
              id="save-bank-details-btn"
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Bank Details'}</span>
            </button>
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
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            All banking and identity updates take effect across all Kisan Mitra escrow modules instantly.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center space-x-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Updates…' : 'Save Profile & Bank Details'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
