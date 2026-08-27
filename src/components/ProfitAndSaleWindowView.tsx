import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  TrendingDown,
  Sparkles,
  MapPin,
  Truck,
  Warehouse,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const ProfitAndSaleWindowView: React.FC = () => {
  const { user, language, t } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [quantityKg, setQuantityKg] = useState<number>(2000);
  const [costOfCultivationPerKg, setCostOfCultivationPerKg] = useState<number>(12);
  const [holdingDays, setHoldingDays] = useState<number>(0);

  // Mandi comparison data with distances from user's farm
  const mandis = [
    {
      name: 'Guntur APMC Mandi',
      district: 'Guntur, AP',
      distanceKm: 14,
      modalPricePerKg: 28.0,
      transitCostPerKg: 0.8,
      trend: 'up',
      arrivalVolume: 'Moderate',
      demandLevel: 'High',
    },
    {
      name: 'Vijayawada Wholesale Yard',
      district: 'Krishna, AP',
      distanceKm: 42,
      modalPricePerKg: 31.5,
      transitCostPerKg: 1.8,
      trend: 'up',
      arrivalVolume: 'Low',
      demandLevel: 'Very High',
    },
    {
      name: 'Tenali Fruit & Veg Market',
      district: 'Guntur, AP',
      distanceKm: 28,
      modalPricePerKg: 29.0,
      transitCostPerKg: 1.2,
      trend: 'stable',
      arrivalVolume: 'Normal',
      demandLevel: 'Moderate',
    },
    {
      name: 'Hyderabad Bowenpally',
      district: 'Hyderabad, TS',
      distanceKm: 275,
      modalPricePerKg: 35.0,
      transitCostPerKg: 4.5,
      trend: 'up',
      arrivalVolume: 'High',
      demandLevel: 'High',
    },
    {
      name: 'Ongole Agriculture Market',
      district: 'Prakasam, AP',
      distanceKm: 110,
      modalPricePerKg: 27.5,
      transitCostPerKg: 2.6,
      trend: 'down',
      arrivalVolume: 'Heavy',
      demandLevel: 'Low',
    },
  ];

  // Storage cost if holding
  const storageCostPerKgPerDay = 0.08; // ₹80 per ton per day
  const totalStorageCost = quantityKg * holdingDays * storageCostPerKgPerDay;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Net-in-Pocket Decision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t.profitCalculator} & {t.saleWindow}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Never sell at the nearest market blindly. Calculate real in-pocket return after deducting transport and storage costs across 5 competing Mandis.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-300 block">
            Best Sale Window
          </span>
          <span className="text-xl font-black text-white block mt-0.5">Next 2 - 4 Days</span>
          <span className="text-[10px] text-emerald-300 font-semibold">Vijayawada Mandi • +₹5,400 higher return</span>
        </div>
      </div>

      {/* Input Parameter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-emerald-800" />
          <span>Lot & Cultivation Cost Parameters</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.cropName}</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="Tomato">{getLocalizedCropName('Tomato', language)}</option>
              <option value="Chilli">{getLocalizedCropName('Chilli', language)}</option>
              <option value="Cotton">{getLocalizedCropName('Cotton', language)}</option>
              <option value="Paddy">{getLocalizedCropName('Paddy', language)}</option>
              <option value="Turmeric">{getLocalizedCropName('Turmeric', language)}</option>
              <option value="Onion">{getLocalizedCropName('Onion', language)}</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.quantity} (in Kilograms)</label>
            <input
              type="number"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              min="100"
              step="100"
            />
          </div>

          {/* Cost of Cultivation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Production Cost (₹/kg)</label>
            <input
              type="number"
              value={costOfCultivationPerKg}
              onChange={(e) => setCostOfCultivationPerKg(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              min="1"
              step="0.5"
            />
          </div>

          {/* Cold Storage Hold Days */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Cold Storage Hold (Days)</label>
            <input
              type="number"
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              min="0"
              max="60"
            />
          </div>

        </div>
      </div>

      {/* Comparison Table Across 5 Mandis */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Net In-Pocket Return Comparison Across Nearby Mandis
            </h2>
            <p className="text-xs text-slate-500">
              Ranked dynamically by total net profit after deducting fuel/transit & cold storage expenses.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Total Lot: {quantityKg.toLocaleString('en-IN')} kg
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mandi Market</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Modal Price (₹/kg)</th>
                <th className="py-3 px-4">Transit Cost</th>
                <th className="py-3 px-4">Gross Value</th>
                <th className="py-3 px-4">Total Expenses</th>
                <th className="py-3 px-4 font-black text-slate-900">Net Profit (₹)</th>
                <th className="py-3 px-4">Market Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mandis
                .map((m) => {
                  const gross = quantityKg * m.modalPricePerKg;
                  const transitTotal = quantityKg * m.transitCostPerKg;
                  const productionTotal = quantityKg * costOfCultivationPerKg;
                  const totalExpenses = transitTotal + productionTotal + totalStorageCost;
                  const netProfit = gross - totalExpenses;
                  const netPerKg = netProfit / quantityKg;
                  return { ...m, gross, transitTotal, totalExpenses, netProfit, netPerKg };
                })
                .sort((a, b) => b.netProfit - a.netProfit)
                .map((m, idx) => {
                  const isTop = idx === 0;
                  return (
                    <tr key={idx} className={isTop ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {isTop && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-black uppercase">
                              TOP NET
                            </span>
                          )}
                          <span className="font-bold text-slate-900">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.district}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {m.distanceKm} km
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{m.modalPricePerKg.toFixed(1)}/kg
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        ₹{m.transitCostPerKg.toFixed(1)}/kg (₹{m.transitTotal.toLocaleString('en-IN')})
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        ₹{m.gross.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-rose-700 font-medium">
                        -₹{m.totalExpenses.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-sm font-black ${m.netProfit > 0 ? 'text-emerald-800' : 'text-rose-700'}`}>
                          ₹{m.netProfit.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-normal">
                          (₹{m.netPerKg.toFixed(1)} net/kg)
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            m.trend === 'up'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.trend === 'down'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.trend === 'up' ? '↗ High Demand' : m.trend === 'down' ? '↘ Heavy Arrivals' : '→ Steady'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Window & Price Forecast AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommendation Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Optimal Timing & Mandi Recommendation
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <h4 className="font-black text-emerald-950 text-base">
              Dispatch to Vijayawada Wholesale Yard within 48 Hours
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Vijayawada offers ₹3.5/kg higher price than local Guntur. Even after ₹1.8/kg additional transport costs, you earn a <strong>net additional profit of ₹3,400</strong> on this 2,000 kg lot.
            </p>
          </div>

          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>Tomato arrivals in Vijayawada are 18% lower than average due to rain in northern districts.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>Hyderabad offers highest gross, but the 275 km haul creates ₹4.5/kg fuel & spoilage drag.</span>
            </li>
          </ul>
        </div>

        {/* Storage Holding Simulation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <Warehouse className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
              Cold Storage Hold vs Sell Decision
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p>
              Holding perishable crops like Tomato beyond 7 days in cold storage costs ~₹0.08/kg/day with 4% weight loss risk.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Sell Immediately</span>
                <span className="text-lg font-black text-emerald-800 block">₹35,000</span>
                <span className="text-[10px] text-slate-500">Zero storage risk</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Hold 14 Days</span>
                <span className="text-lg font-black text-slate-700 block">₹36,200</span>
                <span className="text-[10px] text-amber-700 font-semibold">-₹2,240 storage cost</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Recommendation: <strong>Sell immediately.</strong> Price upside does not compensate for cold storage & moisture shrinkage risk.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
