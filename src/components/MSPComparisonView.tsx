import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { MSPData } from '../types/index.ts';
import {
  ShieldCheck,
  Search,
  Award,
  TrendingUp,
  Info,
  ExternalLink,
  Filter,
} from 'lucide-react';

export const MSPComparisonView: React.FC = () => {
  const [mspList, setMspList] = useState<MSPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getMSP(season, search).then((res) => {
      if (res.success && res.data) {
        setMspList(res.data.mspList || []);
      }
      setLoading(false);
    });
  }, [season, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Official Ministry of Agriculture Data
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Minimum Support Price (MSP) Benchmarks
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl mt-1 leading-relaxed">
          Government guaranteed floor rates for 2024-25 & 2025-26 marketing seasons (CACP recommendations). Compare official MSP with live mandi rates to negotiate fair contracts.
        </p>
      </div>

      {/* Distinction Explanatory Banner (Rule 8) */}
      <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 space-y-1">
            <h4 className="font-extrabold text-sm text-blue-900">Understanding Price Benchmarks on Kisan Mitra:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1 font-medium">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="font-bold text-emerald-800">1. Official MSP</span>: Government guaranteed procurement baseline (e.g., Paddy ₹2,300/qtl).
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="font-bold text-amber-800">2. Mandi Modal Price</span>: Prevailing APMC average spot transaction rate today.
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="font-bold text-slate-800">3. Farmer Expected Price</span>: The asking price listed by the farmer based on quality grade.
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="font-bold text-indigo-800">4. Buyer Offered Price</span>: The proposed contract price offered by verified bulk purchasers.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop (e.g. Paddy, Wheat, Maize, Moong)..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600">Season:</span>
          {['All', 'Kharif', 'Rabi', 'Commercial'].map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                season === s
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* MSP Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Official MSP Schedule ({mspList.length} crops listed)
          </span>
          <span className="text-xs text-slate-500">
            Source: CACP & Directorate of Economics and Statistics
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-slate-500">Loading MSP records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Commodity / Crop</th>
                  <th className="py-3 px-4">Variety</th>
                  <th className="py-3 px-4">Season</th>
                  <th className="py-3 px-4">Official MSP (₹/Quintal)</th>
                  <th className="py-3 px-4">MSP Rate (₹/kg)</th>
                  <th className="py-3 px-4">Cost of Production (A2+FL)</th>
                  <th className="py-3 px-4">Return over Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mspList.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {item.cropName || item.crop}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.variety || 'Common / FAQ'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.season === 'Kharif' ? 'bg-amber-100 text-amber-900' :
                        item.season === 'Rabi' ? 'bg-blue-100 text-blue-900' :
                        'bg-purple-100 text-purple-900'
                      }`}>
                        {item.season}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-800 text-sm">
                      ₹{(item.mspValue || item.mspRate || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ₹{item.mspPerKg || item.mspRatePerKg || Math.round((item.mspValue || item.mspRate || 0) / 100)}/kg
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      ₹{(item.costOfProduction || Math.round((item.mspValue || item.mspRate || 0) * 0.65)).toLocaleString('en-IN')}/qtl
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {item.returnOverCostPercentage || 50}%
                    </td>
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
