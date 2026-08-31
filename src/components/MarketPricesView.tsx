import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { MarketPrice } from '../types/index.ts';
import {
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpDown,
  Calculator,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface MarketPricesViewProps {
  openCropDetailModal: (cropName: string) => void;
}

const STATES = ['All', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Punjab', 'Madhya Pradesh', 'Uttar Pradesh'];
const DISTRICTS_MAP: Record<string, string[]> = {
  'Andhra Pradesh': ['All', 'Guntur', 'Krishna', 'Kurnool', 'Chittoor', 'Prakasam'],
  'Telangana': ['All', 'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
  'Maharashtra': ['All', 'Nashik', 'Pune', 'Nagpur', 'Aurangabad', 'Solapur'],
  'Karnataka': ['All', 'Bengaluru', 'Kolar', 'Belagavi', 'Dharwad'],
  'Tamil Nadu': ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Punjab': ['All', 'Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'],
  'Madhya Pradesh': ['All', 'Indore', 'Bhopal', 'Ujjain', 'Jabalpur'],
  'Uttar Pradesh': ['All', 'Agra', 'Varanasi', 'Kanpur', 'Lucknow'],
};

const CATEGORIES = ['All', 'Vegetables', 'Spices', 'Cereals', 'Pulses', 'Oilseeds', 'Commercial'];

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({ openCropDetailModal }) => {
  const { user, t } = useAuth();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');
  const [showNetCalculator, setShowNetCalculator] = useState(false);
  const isFarmer = user?.role === 'farmer';

  // Net Return Calculator State
  const [calcCrop, setCalcCrop] = useState('Tomato');
  const [calcQty, setCalcQty] = useState(1000);
  const [calcDistrict, setCalcDistrict] = useState(user?.location?.district || 'Guntur');
  const [calcResult, setCalcResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    const res = await api.getMarketPrices({
      state: selectedState,
      district: selectedDistrict,
      category: selectedCategory,
      search,
      sortBy,
    });

    if (res.success && res.data) {
      setPrices(res.data.prices || []);
      setLastUpdated(res.data.lastUpdated || new Date().toISOString());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedState, selectedDistrict, selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices();
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    const res = await api.triggerMarketSync();
    setSyncing(false);
    if (res.success) {
      fetchPrices();
    }
  };

  const runNetCalculator = async () => {
    setCalcLoading(true);
    const res = await api.getNetReturn({
      cropName: calcCrop,
      quantityKg: calcQty,
      farmerDistrict: calcDistrict,
    });
    if (res.success && res.data) {
      setCalcResult(res.data);
    }
    setCalcLoading(false);
  };

  useEffect(() => {
    if (showNetCalculator && !calcResult) {
      runNetCalculator();
    }
  }, [showNetCalculator]);

  const availableDistricts = DISTRICTS_MAP[selectedState] || ['All'];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🌾 AGMARKNET Real-Time Mandi Rates</span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Today'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              {t.marketPrices}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              {t.govSource}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isFarmer && (
              <button
                onClick={() => setShowNetCalculator(!showNetCalculator)}
                className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Net Return Calculator</span>
              </button>
            )}
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className="px-3 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-600 shadow-sm transition flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync AGMARKNET'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Net Return Calculator Module (Rule 20) — Farmer only */}
      {isFarmer && showNetCalculator && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-amber-800" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Farmer Net Return & Mandi Optimizer (Rule 20)
              </h3>
            </div>
            <button
              onClick={() => setShowNetCalculator(false)}
              className="text-xs text-amber-900 hover:underline font-bold"
            >
              Close Tool
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Crop</label>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Tomato">Tomato (₹24 - ₹32/kg)</option>
                <option value="Chilli Red">Chilli Red (₹180 - ₹210/kg)</option>
                <option value="Onion">Onion (₹22 - ₹30/kg)</option>
                <option value="Paddy (Dhan)">Paddy / Rice (₹23 - ₹28/kg)</option>
                <option value="Cotton">Cotton (₹68 - ₹76/kg)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quantity (Kg)</label>
              <input
                type="number"
                value={calcQty}
                onChange={(e) => setCalcQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Your Farm District</label>
              <input
                type="text"
                value={calcDistrict}
                onChange={(e) => setCalcDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={runNetCalculator}
                disabled={calcLoading}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
              >
                {calcLoading ? 'Calculating...' : 'Calculate Top Mandi'}
              </button>
            </div>
          </div>

          {calcResult && (
            <div className="bg-white p-4 rounded-xl border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Recommended: {calcResult.bestMarket}
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Highest net return after deducting verified transport and handling costs: <span className="font-extrabold text-slate-900">₹{calcResult.maxNetReturnPerKg}/kg</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {calcResult.marketBreakdown?.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs ${
                      m.market === calcResult.bestMarket
                        ? 'bg-emerald-50/80 border-emerald-400 font-medium'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.market}</span>
                      <span className="text-[10px] text-slate-500">{m.distanceKm} km</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">Modal Price: ₹{m.modalPricePerKg}/kg</p>
                    <p className="text-[11px] text-slate-600">Transit Cost: -₹{m.transportPerKg}/kg</p>
                    <p className="text-xs font-black text-emerald-800 mt-1 pt-1 border-t border-slate-200">
                      Net in Pocket: ₹{m.netReturnPerKg}/kg (Total ₹{(m.totalNetReturn || 0).toLocaleString('en-IN')})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchCrop}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.state}</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
              }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.district}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            >
              <option value="price-desc">Highest Price First</option>
              <option value="price-asc">Lowest Price First</option>
              <option value="crop-asc">Crop Name (A-Z)</option>
              <option value="date-desc">Latest Arrival Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Prices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Mandi Arrivals ({prices.length} records)
            </span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              Live data.gov.in Feed
            </span>
          </div>
          {isFarmer ? (
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Click any crop for 30-day interactive price trend chart
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Official current market rates for transparent procurement
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-slate-500">Retrieving AGMARKNET mandi rates...</p>
          </div>
        ) : prices.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No market arrivals found matching selected filters. Try changing State or District.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.cropName || 'Crop Name'}</th>
                  <th className="py-3 px-4">{t.market} & {t.district}</th>
                  <th className="py-3 px-4">{t.date}</th>
                  <th className="py-3 px-4">{t.minPrice} - {t.maxPrice}</th>
                  <th className="py-3 px-4">{t.modalPrice} (₹/qtl)</th>
                  <th className="py-3 px-4">{t.pricePerKg}</th>
                  {isFarmer && <th className="py-3 px-4 text-right">{t.actions}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prices.map((price) => (
                  <tr
                    key={price.id}
                    onClick={() => isFarmer && openCropDetailModal(price.cropName)}
                    className={`hover:bg-emerald-50/50 transition ${isFarmer ? 'cursor-pointer' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <span>{price.cropName}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-normal rounded">
                          {price.variety || 'Local'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold">{price.market}</div>
                      <div className="text-[10px] text-slate-400">{price.district}, {price.state}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {price.arrivalDate}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      ₹{(price.minPrice || 0).toLocaleString('en-IN')} - ₹{(price.maxPrice || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      ₹{(price.modalPrice || 0).toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal text-slate-400"> /qtl</span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ₹{price.pricePerKg}/kg
                    </td>

                    {isFarmer && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCropDetailModal(price.cropName);
                          }}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] rounded-lg transition inline-flex items-center space-x-1"
                        >
                          <span>Trends</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
