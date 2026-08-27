import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  FileText,
  MessageSquare,
  Scale,
  Send,
} from 'lucide-react';

interface Dispute {
  id: string;
  orderId: string;
  party: string;
  category: string;
  description: string;
  status: 'under_review' | 'mediation' | 'resolved';
  amountAtStake: number;
  filedDate: string;
  resolution?: string;
}

export const GrievancesView: React.FC = () => {
  const { user, t } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState('KM-ORD-9021');
  const [category, setCategory] = useState('Quality Grading Discrepancy');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'DISP-104',
      orderId: 'KM-ORD-8812',
      party: 'South Fresh Retail Pvt Ltd',
      category: 'Weight Discrepancy at Weighbridge',
      description: 'Dispatched 2,000 kg Tomatoes, buyer weighbridge registered 1,910 kg (90 kg difference).',
      status: 'resolved',
      amountAtStake: 2700,
      filedDate: '24 Aug 2026',
      resolution: '45 kg transit moisture allowance accepted by mutual agreement. ₹1,350 refunded from escrow.',
    },
    {
      id: 'DISP-105',
      orderId: 'KM-ORD-9021',
      party: 'ABC Agro Processing Ltd',
      category: 'Quality Grade Dispute',
      description: 'Buyer reported 8% higher sorting rejects than agreed Grade A specification.',
      status: 'mediation',
      amountAtStake: 4500,
      filedDate: '26 Aug 2026',
    },
  ]);

  const handleFileDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newDisp: Dispute = {
      id: `DISP-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      party: 'Assigned Counterparty',
      category,
      description,
      status: 'under_review',
      amountAtStake: 3500,
      filedDate: 'Today',
    };

    setDisputes([newDisp, ...disputes]);
    setShowModal(false);
    setDescription('');
    setSuccessMsg('Grievance filed successfully. KisanMitra Mediation Officer will initiate resolution within 24 hours.');
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-900/60 text-rose-200 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>Digital Mediation & Escrow Arbitration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t.disputes}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Neutral digital arbitration for quality disputes, transit spoilage, weight variations, and delayed escrow disbursements.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-rose-700 hover:bg-rose-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.fileDispute}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Disputes List */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-slate-900">
          Your Grievances & Mediation Cases ({disputes.length})
        </h2>

        <div className="space-y-4">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-slate-400">{d.id}</span>
                  <h3 className="font-extrabold text-slate-900 text-sm">{d.category}</h3>
                  <span className="text-xs text-slate-500">• Order #{d.orderId}</span>
                </div>

                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    d.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : d.status === 'mediation'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {d.status === 'resolved' ? '✓ Resolved' : d.status === 'mediation' ? '⚖️ Mediation in Progress' : '⏳ Under Review'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {d.description}
              </p>

              {d.resolution && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                  <strong className="block text-emerald-900 font-bold mb-0.5">Official Mediation Outcome:</strong>
                  {d.resolution}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Filed on {d.filedDate} • Counterparty: <strong>{d.party}</strong></span>
                <span className="font-bold text-slate-900">Amount in Escrow: ₹{d.amountAtStake.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Dispute Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">File a Formal Transaction Grievance</h3>
            
            <form onSubmit={handleFileDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Associated Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Grievance Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900"
                >
                  <option value="Quality Grading Discrepancy">Quality Grading Discrepancy</option>
                  <option value="Weight Variation at Weighbridge">Weight Variation at Weighbridge</option>
                  <option value="Transit Delay & Moisture Spoilage">Transit Delay & Moisture Spoilage</option>
                  <option value="Escrow Release Delay">Escrow Release Delay</option>
                  <option value="Buyer / Farmer Unresponsive">Buyer / Farmer Unresponsive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Description & Evidence</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain the issue with weights, grade differences, dates, or photos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
