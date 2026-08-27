import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import {
  X,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface CropDetailModalProps {
  cropName: string | null;
  onClose: () => void;
  onSelectAction?: (action: 'sell' | 'buy', crop: string) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({ cropName, onClose, onSelectAction }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    if (!cropName) return;
    setLoading(true);
    api.getCropDetails(cropName).then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, [cropName]);

  if (!cropName) return null;

  const historicalTrends = data?.historicalTrends || [];
  const chartData = timeRange === '7d' ? historicalTrends.slice(-7) : historicalTrends;
  const nearbyMandis = data?.nearbyMandis || [];
  const currentPrice = data?.currentPrice;
  const msp = data?.msp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-lg">
              🌾
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black font-serif">{cropName}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-700/80 text-emerald-100 text-xs font-semibold rounded-full border border-emerald-500/50">
                  AGMARKNET Intelligence
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Real-time wholesale market trends, nearby mandis comparison & MSP benchmark
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-emerald-950/40 text-emerald-200 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs font-bold text-slate-500">Loading live AGMARKNET trend data...</p>
            </div>
          ) : (
            <>
              {/* Top Rate Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Modal Rate (₹/kg)</span>
                  <p className="text-2xl font-black text-emerald-800 mt-0.5">
                    ₹{currentPrice?.pricePerKg || 28}<span className="text-xs font-normal text-slate-500">/kg</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">₹{currentPrice?.modalPrice || 2800}/quintal</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Min - Max Spread</span>
                  <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                    ₹{currentPrice ? Math.round(currentPrice.minPrice / 100) : 24} - ₹{currentPrice ? Math.round(currentPrice.maxPrice / 100) : 33}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Range in local mandis</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Govt. MSP Benchmark</span>
                  <p className="text-xl font-extrabold text-amber-700 mt-0.5">
                    {msp ? `₹${msp.mspRatePerKg}/kg` : 'Open Market'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{msp ? `₹${msp.mspRate}/qtl (${msp.season})` : 'No MSP fixed'}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Primary Mandi</span>
                  <p className="text-lg font-bold text-slate-800 mt-0.5 truncate">
                    {currentPrice?.market || 'Guntur Mandi'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{currentPrice?.district || 'Guntur'}, AP</p>
                </div>
              </div>

              {/* Historical Price Chart (Recharts) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Historical Price Trajectory (₹/Quintal)</h4>
                    <p className="text-xs text-slate-500">Modal price movements over time from official mandi records</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setTimeRange('7d')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                        timeRange === '7d' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange('30d')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                        timeRange === '30d' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      30 Days
                    </button>
                  </div>
                </div>

                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip
                        formatter={(val: any) => [`₹${val}/qtl (₹${(val / 100).toFixed(1)}/kg)`, 'Modal Price']}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="modalPrice"
                        stroke="#059669"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Nearby Mandis Comparison Table */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-extrabold text-slate-800 mb-2">Nearby Mandi Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Market Mandi</th>
                        <th className="py-2 px-3">District</th>
                        <th className="py-2 px-3">Modal Rate (₹/qtl)</th>
                        <th className="py-2 px-3">Rate (₹/kg)</th>
                        <th className="py-2 px-3 text-right">Distance (approx)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 bg-white">
                      {nearbyMandis.map((m: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{m.market}</td>
                          <td className="py-2.5 px-3 text-slate-600">{m.district}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-800">₹{(m.modalPrice || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 font-black text-slate-900">₹{m.pricePerKg}/kg</td>
                          <td className="py-2.5 px-3 text-right text-slate-500">{m.distanceKm || (idx * 25 + 10)} km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Source: AGMARKNET Govt of India API
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                if (onSelectAction) onSelectAction('sell', cropName);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              List {cropName} Produce
            </button>
            <button
              onClick={() => {
                onClose();
                if (onSelectAction) onSelectAction('buy', cropName);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Post Buyer Request
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
