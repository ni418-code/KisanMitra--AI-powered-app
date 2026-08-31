import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { PriceAlert } from '../types/index.ts';
import {
  BellRing,
  PlusCircle,
  TrendingUp,
  Trash2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';

export const PriceAlertsView: React.FC = () => {
  const { user, t } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState('Tomato');
  const [targetPrice, setTargetPrice] = useState(30);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [district, setDistrict] = useState(user?.location?.district || 'Guntur');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    const res = await api.getAlerts();
    if (res.success && res.data) {
      setAlerts(res.data.alerts || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createAlert({
      crop,
      targetPrice: Number(targetPrice),
      condition,
      district,
    });

    if (res.success) {
      setSuccessMsg(`Alert active! You will be notified when ${crop} rate is ${condition} ₹${targetPrice}/kg.`);
      fetchAlerts();
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleToggle = async (id: string) => {
    await api.toggleAlert(id);
    fetchAlerts();
  };

  const handleDelete = async (id: string) => {
    await api.deleteAlert(id);
    fetchAlerts();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Automated Market Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Mandi Price Alerts & Notifications
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl mt-1">
          Set price triggers. When live AGMARKNET mandi arrivals cross your target threshold, receive instant in-app alerts and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Alert Card (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 font-serif">
            Create New Price Alert
          </h2>

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
              >
                <option value="Tomato">Tomato</option>
                <option value="Chilli Red">Chilli Red</option>
                <option value="Onion">Onion</option>
                <option value="Paddy (Dhan)">Paddy / Rice</option>
                <option value="Maize">Maize</option>
                <option value="Turmeric">Turmeric</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="above">Above (≥)</option>
                  <option value="below">Below (≤)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Target Rate (₹/kg)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-emerald-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Target Mandi District</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              + Activate Price Alert
            </button>
          </form>
        </div>

        {/* Existing Alerts List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 font-serif">
              Active Price Watchlist ({alerts.length})
            </h2>
            <span className="text-xs text-slate-500">Evaluated every 30 mins with AGMARKNET sync</span>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No price alerts active. Create one to receive automated triggers.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition ${
                    alt.active ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{alt.crop}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full">
                        Rate {alt.condition} ₹{alt.targetPrice}/kg
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Market District: <strong>{alt.district}</strong> • Triggered {alt.triggeredCount} times
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggle(alt.id)}
                      className="text-slate-600 hover:text-emerald-700 p-1"
                      title={alt.active ? 'Disable' : 'Enable'}
                    >
                      {alt.active ? (
                        <span className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-300 text-slate-700 rounded-lg text-xs font-bold">Paused</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(alt.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      title="Remove alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
