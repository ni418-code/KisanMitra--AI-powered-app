import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  Handshake,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Wheat,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Tag,
  MessageSquare,
  DollarSign,
  Filter,
} from 'lucide-react';

interface MatchItem {
  id: string;
  partyName: string;
  partyType: 'buyer' | 'farmer';
  location: string;
  distanceKm: number;
  crop: string;
  quantity: string;
  expectedPrice: number;
  marketModalPrice: number;
  matchScore: number;
  gradeRequired: string;
  factors: {
    priceCompatibility: number;
    varietyMatch: number;
    distanceConvenience: number;
    volumeFit: number;
    trustScore: number;
  };
  kycVerified: boolean;
}

interface SmartMatchingViewProps {
  openChatModal: (convId?: string) => void;
  onNavigateToOffers?: () => void;
}

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  openChatModal,
  onNavigateToOffers,
}) => {
  const { user, language, t } = useAuth();
  const isFarmer = user?.role === 'farmer';

  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [activeMatchModal, setActiveMatchModal] = useState<MatchItem | null>(null);
  const [offerSent, setOfferSent] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(30);

  const mockMatches: MatchItem[] = [
    {
      id: 'M-101',
      partyName: isFarmer ? 'ABC Agro Food Processors Ltd' : 'Ramesh Kumar (Farmer)',
      partyType: isFarmer ? 'buyer' : 'farmer',
      location: 'Vijayawada, AP',
      distanceKm: 34,
      crop: 'Tomato',
      quantity: '2,000 kg',
      expectedPrice: 32.0,
      marketModalPrice: 28.0,
      matchScore: 96,
      gradeRequired: 'Grade A (Table / Puree)',
      factors: {
        priceCompatibility: 98,
        varietyMatch: 100,
        distanceConvenience: 92,
        volumeFit: 95,
        trustScore: 99,
      },
      kycVerified: true,
    },
    {
      id: 'M-102',
      partyName: isFarmer ? 'South Fresh Retail Hub' : 'Suresh Reddy (FPO Lead)',
      partyType: isFarmer ? 'buyer' : 'farmer',
      location: 'Guntur Rural, AP',
      distanceKm: 12,
      crop: 'Tomato',
      quantity: '1,500 kg',
      expectedPrice: 30.5,
      marketModalPrice: 28.0,
      matchScore: 93,
      gradeRequired: 'Grade A & B',
      factors: {
        priceCompatibility: 90,
        varietyMatch: 95,
        distanceConvenience: 99,
        volumeFit: 90,
        trustScore: 94,
      },
      kycVerified: true,
    },
    {
      id: 'M-103',
      partyName: isFarmer ? 'Deccan Spice & Chilli Exporters' : 'Venkata Rao (Chilli Farmer)',
      partyType: isFarmer ? 'buyer' : 'farmer',
      location: 'Tenali, AP',
      distanceKm: 26,
      crop: 'Chilli',
      quantity: '800 kg',
      expectedPrice: 195.0,
      marketModalPrice: 190.0,
      matchScore: 91,
      gradeRequired: 'Grade A (Dry S17)',
      factors: {
        priceCompatibility: 94,
        varietyMatch: 90,
        distanceConvenience: 88,
        volumeFit: 92,
        trustScore: 95,
      },
      kycVerified: true,
    },
    {
      id: 'M-104',
      partyName: isFarmer ? 'Nandi Cotton Ginning Mills' : 'Anil Kumar (Cotton Producer)',
      partyType: isFarmer ? 'buyer' : 'farmer',
      location: 'Warangal, TS',
      distanceKm: 140,
      crop: 'Cotton',
      quantity: '3,000 kg',
      expectedPrice: 74.0,
      marketModalPrice: 72.0,
      matchScore: 88,
      gradeRequired: 'Long Staple 29mm',
      factors: {
        priceCompatibility: 86,
        varietyMatch: 95,
        distanceConvenience: 78,
        volumeFit: 96,
        trustScore: 92,
      },
      kycVerified: true,
    },
  ];

  const filteredMatches = mockMatches.filter((m) => {
    if (selectedCropFilter === 'all') return true;
    return m.crop.toLowerCase() === selectedCropFilter.toLowerCase();
  });

  const handleMakeOffer = (item: MatchItem) => {
    setActiveMatchModal(item);
    setCounterPrice(item.expectedPrice);
  };

  const handleConfirmOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMatchModal || !user) return;

    const isFarmerView = user.role === 'farmer';
    const targetUserId = isFarmerView ? 'usr-2' : 'usr-1';
    const targetUserName = isFarmerView ? 'Rajesh Agro Foods Ltd' : 'Ramesh Patel';

    // Actually dispatch a real offer through the backend so it shows up in
    // "Offers & Negotiations" for both the user and the counterparty.
    const res = await api.createOffer({
      productId: isFarmerView ? 'prod-1' : undefined,
      buyerRequestId: isFarmerView ? undefined : 'req-1',
      targetUserId,
      targetUserName,
      cropName: activeMatchModal.crop,
      quantity: 2000,
      unit: 'kg',
      proposedPrice: Number(counterPrice) || 0,
      transportIncluded: false,
      notes: 'Bilateral proposal sent via KisanMitra Smart Matching Engine.',
    });

    if (res.success) {
      setOfferSent(`Bilateral proposal of ₹${counterPrice}/kg sent directly to ${activeMatchModal.partyName}! Track negotiation under the Offers tab.`);
    } else {
      setOfferSent(res.message || 'Offer could not be dispatched. Please retry.');
    }
    setActiveMatchModal(null);
    setTimeout(() => setOfferSent(null), 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Factor Compatibility Algorithm</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t.deals}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            {isFarmer
              ? 'Real-time matches between your listed produce lots and verified corporate procurement demands.'
              : 'Directly matching your procurement requirements with verified farm-gate digital lots.'}
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-300" />
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Crops</option>
            <option value="Tomato" className="bg-slate-900 text-white">Tomato</option>
            <option value="Chilli" className="bg-slate-900 text-white">Chilli</option>
            <option value="Cotton" className="bg-slate-900 text-white">Cotton</option>
          </select>
        </div>
      </div>

      {offerSent && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{offerSent}</span>
        </div>
      )}

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md space-y-4"
          >
            {/* Top Match Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                    m.partyType === 'buyer' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {m.partyType === 'buyer' ? <Building2 className="w-6 h-6" /> : <Wheat className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-extrabold text-slate-900 text-sm">{m.partyName}</h3>
                    {m.kycVerified && (
                      <span title="100% KYC Verified" className="text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 inline" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{m.location} ({m.distanceKm} km away)</span>
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black">
                  🔥 {m.matchScore}% Match
                </span>
              </div>
            </div>

            {/* Produce & Price Specs */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Commodity</span>
                <span className="font-extrabold text-slate-900">{getLocalizedCropName(m.crop, language)}</span>
                <span className="text-[10px] text-slate-500 block">{m.gradeRequired}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Volume</span>
                <span className="font-extrabold text-slate-900">{m.quantity}</span>
                <span className="text-[10px] text-emerald-800 font-semibold block">In Stock</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Offered Rate</span>
                <span className="font-black text-emerald-800 text-sm">₹{m.expectedPrice}/kg</span>
                <span className="text-[10px] text-slate-400 block">(Mandi: ₹{m.marketModalPrice}/kg)</span>
              </div>
            </div>

            {/* 5-Factor Radar Breakdown */}
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between items-center">
                <span>Price Advantage:</span>
                <span className="font-bold text-slate-900">{m.factors.priceCompatibility}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${m.factors.priceCompatibility}%` }} />
              </div>

              <div className="flex justify-between items-center pt-1">
                <span>Logistics Distance Fit:</span>
                <span className="font-bold text-slate-900">{m.factors.distanceConvenience}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${m.factors.distanceConvenience}%` }} />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openChatModal()}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat Direct</span>
              </button>

              <button
                onClick={() => handleMakeOffer(m)}
                className="px-4.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow transition cursor-pointer flex items-center space-x-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Send Counter-Offer</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Offer Negotiation Modal */}
      {activeMatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900">
              Propose Deal to {activeMatchModal.partyName}
            </h3>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p><strong>Crop:</strong> {activeMatchModal.crop} • {activeMatchModal.gradeRequired}</p>
              <p><strong>Quantity:</strong> {activeMatchModal.quantity}</p>
              <p><strong>Original Price:</strong> ₹{activeMatchModal.expectedPrice}/kg</p>
            </div>

            <form onSubmit={handleConfirmOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Proposed Price (₹/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-lg font-black text-emerald-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                <span className="font-bold block">Total Deal Value:</span>
                <span className="text-base font-black">₹{(counterPrice * 2000).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMatchModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow cursor-pointer"
                >
                  Submit Bilateral Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
