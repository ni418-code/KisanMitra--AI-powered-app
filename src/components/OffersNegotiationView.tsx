import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Offer } from '../types/index.ts';
import {
  Handshake,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Send,
  Truck,
} from 'lucide-react';

interface OffersNegotiationViewProps {
  openChatModal?: (convId?: string) => void;
  setCurrentTab: (tab: string) => void;
}

export const OffersNegotiationView: React.FC<OffersNegotiationViewProps> = ({ openChatModal, setCurrentTab }) => {
  const { user, t } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterId, setCounterId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [counterMessage, setCounterMessage] = useState<string>('');

  const fetchOffers = async () => {
    setLoading(true);
    const res = await api.getOffers();
    if (res.success && res.data) {
      setOffers(res.data.offers || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const handleAccept = async (offerId: string) => {
    const res = await api.acceptOffer(offerId);
    if (res.success && res.data) {
      alert(`Offer Accepted! Order ${res.data.order.orderId} created successfully. You can now track logistics & payment.`);
      fetchOffers();
      setCurrentTab('orders');
    }
  };

  const handleReject = async (offerId: string) => {
    if (window.confirm('Are you sure you want to decline this offer?')) {
      await api.rejectOffer(offerId);
      fetchOffers();
    }
  };

  const handleSendCounter = async (originalOffer: Offer) => {
    if (!counterPrice) return;
    const res = await api.createOffer({
      productId: originalOffer.productId,
      buyerRequestId: originalOffer.buyerRequestId,
      targetUserId: originalOffer.senderId,
      targetUserName: originalOffer.senderName,
      cropName: originalOffer.cropName,
      offeredPricePerUnit: Number(counterPrice),
      quantity: originalOffer.quantity,
      unit: originalOffer.unit,
      transportIncluded: originalOffer.transportIncluded,
      message: counterMessage || `Counter proposal: ₹${counterPrice}/${originalOffer.unit}`,
    });

    if (res.success) {
      setCounterId(null);
      fetchOffers();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Bilateral Negotiation Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Offers & Live Negotiations
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl mt-1">
          Review counter-proposals, agree on price & transport terms, and seamlessly create binding orders with verified cost breakdowns.
        </p>
      </div>

      {/* Offer Cards List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-bold text-slate-500">Loading negotiation records...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Active Negotiations</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            When you send or receive purchase proposals, they will appear here for interactive counter-offering and acceptance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((off) => {
            const isRecipient = off.receiverId === user?.id;
            return (
              <div
                key={off.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition ${
                  off.status === 'accepted'
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : off.status === 'rejected'
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Offer Details */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-slate-900">{off.cropName}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        off.status === 'pending' ? 'bg-amber-100 text-amber-900' :
                        off.status === 'accepted' ? 'bg-emerald-100 text-emerald-900' :
                        'bg-rose-100 text-rose-900'
                      }`}>
                        {off.status}
                      </span>
                      {off.transportIncluded && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-bold rounded-full flex items-center space-x-1">
                          <Truck className="w-3 h-3 mr-1" /> Transport Arranged
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3 text-xs">
                      <span className="text-slate-600">
                        Proposed by: <strong className="text-slate-900">{off.senderName}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">
                        Target: <strong className="text-slate-900">{off.receiverName}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">
                        Date: {new Date(off.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 italic">"{off.message}"</p>
                  </div>

                  {/* Right Price & Actions */}
                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-2xl font-black text-emerald-800">
                        ₹{off.offeredPricePerUnit}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/{off.unit}</span>
                      <div className="text-xs font-bold text-slate-700">
                        Total: ₹{(off.totalAmount || (off.offeredPricePerUnit * off.quantity) || 0).toLocaleString('en-IN')} ({(off.quantity || 0).toLocaleString('en-IN')} {off.unit})
                      </div>
                    </div>

                    {isRecipient && off.status === 'pending' && (
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => handleAccept(off.id)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept & Create Order</span>
                        </button>
                        <button
                          onClick={() => {
                            setCounterId(counterId === off.id ? null : off.id);
                            setCounterPrice(off.offeredPricePerUnit);
                          }}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition"
                        >
                          Counter Offer
                        </button>
                        <button
                          onClick={() => handleReject(off.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Decline Offer"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Counter Offer Expandable Sub-form */}
                {counterId === off.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 bg-amber-50/70 p-4 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-950 uppercase">Propose Counter Offer to {off.senderName}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Your Counter Price (₹/kg)</label>
                        <input
                          type="number"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Note / Term adjustment</label>
                        <input
                          type="text"
                          value={counterMessage}
                          onChange={(e) => setCounterMessage(e.target.value)}
                          placeholder="e.g. Can do ₹30/kg if pickup is tomorrow"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setCounterId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendCounter(off)}
                        className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                      >
                        Send Counter Offer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
