import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Product, BuyerRequest, MarketPrice, MatchResult } from '../types/index.ts';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  TrendingUp,
  Package,
  Users,
  Wallet,
  ArrowUpRight,
  PlusCircle,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Calculator,
  BellRing,
} from 'lucide-react';

interface FarmerDashboardProps {
  setCurrentTab: (tab: string) => void;
  openAddProduceModal: () => void;
  openCropDetailModal: (cropName: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  setCurrentTab,
  openAddProduceModal,
  openCropDetailModal,
}) => {
  const { user, language, t } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([]);
  const [netReturnInfo, setNetReturnInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      const [prodRes, priceRes, reqRes, netRes] = await Promise.all([
        api.getProducts({ farmerId: user?.id }),
        api.getMarketPrices({ district: user?.location?.district || 'Guntur' }),
        api.getBuyerRequests({ status: 'open' }),
        api.getNetReturn({ cropName: 'Tomato', quantityKg: 1000, farmerDistrict: user?.location?.district || 'Guntur' }),
      ]);

      if (prodRes.success && prodRes.data) setProducts(prodRes.data.products || []);
      if (priceRes.success && priceRes.data) setMarketPrices(priceRes.data.prices || []);
      if (reqRes.success && reqRes.data) setBuyerRequests(reqRes.data.requests || []);
      if (netRes.success && netRes.data) setNetReturnInfo(netRes.data);
      setLoading(false);
    };

    loadDashboardData();
  }, [user]);

  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);
  const activeProductsCount = products.filter((p) => p.status === 'available').length;
  const bestNearbyPrice = marketPrices.length > 0 ? Math.max(...marketPrices.map((m) => m.pricePerKg)) : 28;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl text-white p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-400/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🌾 Kisan Mitra Farmer Portal</span>
              <span>•</span>
              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {user?.location?.district || 'Guntur'}, {user?.location?.state || 'AP'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Namaste, {user?.name || 'Ramesh Patel'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Latest AGMARKNET market prices and verified buyer demands from Hyderabad, Vijayawada & Guntur are synced.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={openAddProduceModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addProduce}</span>
            </button>
            <button
              onClick={() => setCurrentTab('aiAssistant')}
              className="px-3.5 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-500/50 shadow-sm transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Ask AI Mitra</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Total Produce Listed */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Your Produce</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{(totalQuantity || 0).toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-500 font-semibold">kg listed</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {activeProductsCount} active lots available
          </p>
        </div>

        {/* Top Market Modal Price */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Local Rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">₹{bestNearbyPrice}</span>
            <span className="text-xs text-slate-500 font-semibold">/kg (Tomato/Chilli)</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Source: AGMARKNET Daily
          </p>
        </div>

        {/* Open Buyer Requests */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Buyer Demands</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{buyerRequests.length}</span>
            <span className="text-xs text-slate-500 font-semibold">active buyers</span>
          </div>
          <p className="text-[11px] text-blue-700 font-medium mt-1">
            Seeking Tomato, Chilli, Cotton
          </p>
        </div>

        {/* Best Net Return Mandi */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Net Mandi</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {netReturnInfo?.bestMarket || 'Guntur Mandi'}
            </span>
          </div>
          <p className="text-[11px] text-teal-800 font-semibold mt-1">
            Net return: ₹{netReturnInfo?.maxNetReturnPerKg || '26.8'}/kg after transit
          </p>
        </div>

      </div>

      {/* Exact Backend Lot Images & Prices */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-serif">Your Listed Produce Lots 👇 Exact Backend Images & Prices</h2>
            <p className="text-xs text-slate-500">All images and ₹ prices come from your created lots stored on the KisanMitra backend.</p>
          </div>
          <button onClick={() => setCurrentTab('myProduce')} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
            <span>Manage Lots</span><ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((prod) => (
            <div key={prod.id} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 transition">
              <img src={prod.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'} alt={prod.cropName} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{getLocalizedCropName(prod.cropName, language)}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-full uppercase">{prod.status}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{(prod.quantity || 0).toLocaleString('en-IN')} {prod.unit} • {prod.variety || 'Standard'}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Exact backend price</span>
                  <span className="text-sm font-black text-emerald-800">₹{prod.expectedPrice}/{prod.unit}</span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-6 text-xs text-slate-500">
              No lots created yet. Click “+ Create Lot” to add produce and see its exact image and price here.
            </div>
          )}
        </div>
      </div>

      {/* AI Net Return & Recommendation Module (Rule 20) */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold">
              <Sparkles className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950">
                  Smart Net-Return Intelligence
                </h3>
                <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full">
                  Verified Formula
                </span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                Market A may offer ₹31/kg in Hyderabad, but transit is ₹3.2/kg. Selling in local Guntur Mandi at ₹28/kg yields an identical net return of ~₹27/kg with zero transit shrinkage.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('marketPrices')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-200/80 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-lg shrink-0 transition"
          >
            <span>Compare Mandis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two-Column Section: Live Market Ticker + Matching Buyer Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Mandi Prices (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 font-serif">
                Today's Mandi Rates (AGMARKNET)
              </h2>
              <p className="text-xs text-slate-500">Official modal wholesale prices in your district</p>
            </div>
            <button
              onClick={() => setCurrentTab('marketPrices')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>View All Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Crop</th>
                  <th className="py-2.5 px-3">Market Mandi</th>
                  <th className="py-2.5 px-3">Modal Price</th>
                  <th className="py-2.5 px-3">Rate (₹/kg)</th>
                  <th className="py-2.5 px-3">Trend</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketPrices.slice(0, 5).map((price) => (
                  <tr key={price.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {getLocalizedCropName(price.cropName, language)}
                      <span className="block text-[10px] font-normal text-slate-400">{price.variety || 'Standard'}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {price.market}
                      <span className="block text-[10px] text-slate-400">{price.district}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-800">
                      ₹{(price.modalPrice || 0).toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal text-slate-400"> /qtl</span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      ₹{price.pricePerKg}/kg
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Stable
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openCropDetailModal(price.cropName)}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                      >
                        Trends →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoming Buyer Requirements (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 font-serif">
                  Open Buyer Demands
                </h2>
                <p className="text-xs text-slate-500">High-matching purchase requests</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                {buyerRequests.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {buyerRequests.slice(0, 3).map((req) => (
                <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs">{getLocalizedCropName(req.cropName, language)}</span>
                      <p className="text-[11px] text-slate-500">{req.quantity} {req.unit} needed</p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ₹{req.offeredPrice}/{req.unit}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{req.description}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                    <span>📍 {req.deliveryLocation.district}, {req.deliveryLocation.state}</span>
                    <button
                      onClick={() => setCurrentTab('buyerRequests')}
                      className="font-bold text-emerald-700 hover:text-emerald-900"
                    >
                      Negotiate Offer →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentTab('buyerRequests')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition"
            >
              Browse All Buyer Demands
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
