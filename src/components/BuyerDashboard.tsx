import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Product, BuyerRequest, MatchResult } from '../types/index.ts';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  TrendingUp,
  Boxes,
  PlusCircle,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle,
  Truck,
  FileText,
  Wallet,
  ArrowDownLeft,
} from 'lucide-react';

interface BuyerDashboardProps {
  setCurrentTab: (tab: string) => void;
  openPostRequirementModal: () => void;
  openChatModal?: (convId?: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  setCurrentTab,
  openPostRequirementModal,
  openChatModal,
}) => {
  const { user, language, t } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuyerData = async () => {
      setLoading(true);
      const [prodRes, reqRes] = await Promise.all([
        api.getProducts({ status: 'available' }),
        api.getBuyerRequests({ buyerId: user?.id }),
      ]);

      if (prodRes.success && prodRes.data) setProducts(prodRes.data.products || []);
      if (reqRes.success && reqRes.data) setBuyerRequests(reqRes.data.requests || []);
      setLoading(false);
    };

    loadBuyerData();
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-2xl text-white p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🏢 Kisan Mitra Buyer & Processing Portal</span>
              <span>•</span>
              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {user?.location?.district || 'Hyderabad'}, {user?.location?.state || 'Telangana'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Welcome, {user?.name || 'Rajesh Agro Foods Ltd'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Source farm-fresh agricultural lots directly from verified farmers in Guntur, Krishna, Warangal & Kurnool with zero middleman markups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={openPostRequirementModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.postRequirement}</span>
            </button>
            <button
              onClick={() => setCurrentTab('findProduce')}
              className="px-3.5 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-600 shadow-sm transition flex items-center space-x-2"
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>Browse Farmer Lots</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Your Demands</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{buyerRequests.length}</span>
            <span className="text-xs text-slate-500 font-semibold">active posts</span>
          </div>
          <p className="text-[11px] text-blue-700 font-medium mt-1">
            Matching engine active
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Lots</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{products.length}</span>
            <span className="text-xs text-slate-500 font-semibold">verified lots</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Direct farmer origin
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Escrow Protection</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">100% Guaranteed</span>
          </div>
          <p className="text-[11px] text-teal-800 font-semibold mt-1">
            Payment released on delivery
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Transport Logistics</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">Integrated Rates</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Calculated distance pricing
          </p>
        </div>

      </div>

      {/* Buyer Escrow Wallet & Direct Deposit Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal-900/60">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-black shrink-0 border border-white/20">
            <Wallet className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <span className="text-[10px] text-teal-300 uppercase font-black tracking-wider block">
              KisanMitra Buyer Escrow Balance
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black text-white">
                ₹{(user?.walletBalance || 125000).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-teal-200">Available to Lock in Orders</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Locked in active transit orders: <span className="font-bold text-amber-300">₹{(user?.escrowLockedBalance || 61250).toLocaleString('en-IN')}</span> • Protected by RBI Compliant Nodal Escrow
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentTab('escrow')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit to Escrow Wallet</span>
          </button>
          <button
            onClick={() => setCurrentTab('profile')}
            className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
          >
            Manage Banking
          </button>
        </div>
      </div>

      {/* Recommended Farmer Produce Lots */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif">
              Recommended Direct Farmer Lots
            </h2>
            <p className="text-xs text-slate-500">Quality-inspected lots ready for immediate procurement</p>
          </div>
          <button
            onClick={() => setCurrentTab('findProduce')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View Full Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.slice(0, 3).map((prod) => (
            <div key={prod.id} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex flex-col justify-between hover:border-emerald-400 transition">
              <div>
                <img
                  src={prod.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'}
                  alt={prod.cropName}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-slate-900">{getLocalizedCropName(prod.cropName, language)}</span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ₹{prod.expectedPrice}/{prod.unit}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium">
                    {prod.variety || 'Grade A Standard'} • {(prod.quantity || 0).toLocaleString('en-IN')} {prod.unit} available
                  </p>

                  <div className="mt-2 text-[11px] text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{prod.location.district}, {prod.location.state}</span>
                  </div>

                  <div className="mt-1 text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Farmer: {prod.farmerName} ({prod.farmerUserId})</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setCurrentTab('findProduce')}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
                >
                  Send Purchase Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
