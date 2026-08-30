import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Offer, Order } from '../types/index.ts';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  Tag,
  Handshake,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Truck,
  TrendingUp,
  AlertCircle,
  Building2,
  Wheat,
  DollarSign,
  X,
} from 'lucide-react';

interface OffersNegotiationViewProps {
  openChatModal?: (convId?: string) => void;
  setCurrentTab?: (tab: string) => void;
}

export const OffersNegotiationView: React.FC<OffersNegotiationViewProps> = ({
  openChatModal,
  setCurrentTab,
}) => {
  const { user, language, t } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'countered' | 'rejected'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Counter Offer Modal State
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [counterQuantity, setCounterQuantity] = useState<number>(0);
  const [counterTransportIncluded, setCounterTransportIncluded] = useState<boolean>(false);
  const [counterNotes, setCounterNotes] = useState<string>('');
  const [isSubmittingCounter, setIsSubmittingCounter] = useState<boolean>(false);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.getOffers();
      if (res.data?.offers) {
        setOffers(res.data.offers);
      }
    } catch (err: any) {
      console.log('[OffersView] Fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const isFarmer = user?.role === 'farmer';

  // Handle Accept
  const handleAcceptOffer = async (offer: Offer) => {
    if (!confirm(`Confirm acceptance of this offer for ${offer.quantity} ${offer.unit} ${offer.cropName} at ₹${offer.proposedPrice}/${offer.unit}?`)) {
      return;
    }

    setActionLoadingId(offer.id);
    try {
      const res = await api.acceptOffer(offer.id);
      if (res.data?.offer) {
        setSuccessBanner(`Offer accepted! Order #${res.data.order?.orderId || 'generated'} created with escrow protection.`);
        await fetchOffers();
      }
    } catch (err: any) {
      alert(`Could not accept offer: ${err.message || 'Please retry'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject
  const handleRejectOffer = async (offer: Offer) => {
    if (!confirm(`Are you sure you want to decline this offer for ${offer.cropName}?`)) {
      return;
    }

    setActionLoadingId(offer.id);
    try {
      await api.rejectOffer(offer.id);
      setSuccessBanner(`Offer for ${offer.cropName} declined.`);
      await fetchOffers();
    } catch (err: any) {
      alert(`Could not decline offer: ${err.message || 'Please retry'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Counter Modal
  const handleOpenCounterModal = (offer: Offer) => {
    setCounterModalOffer(offer);
    setCounterPrice(offer.proposedPrice || 0);
    setCounterQuantity(offer.quantity || 0);
    setCounterTransportIncluded(Boolean(offer.transportIncluded));
    setCounterNotes(`Counter proposal for ${offer.cropName}`);
  };

  // Submit Counter Offer
  const handleSubmitCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalOffer || !user) return;

    if (counterPrice <= 0 || counterQuantity <= 0) {
      alert('Please enter a valid price and quantity.');
      return;
    }

    setIsSubmittingCounter(true);
    try {
      const targetUserId = counterModalOffer.buyerId === user.id ? counterModalOffer.farmerId! : counterModalOffer.buyerId!;
      const targetUserName = counterModalOffer.buyerId === user.id ? counterModalOffer.farmerName : counterModalOffer.buyerName;

      await api.createOffer({
        requestId: counterModalOffer.requestId,
        productId: counterModalOffer.productId,
        targetUserId,
        targetUserName,
        cropName: counterModalOffer.cropName,
        quantity: counterQuantity,
        unit: counterModalOffer.unit,
        proposedPrice: counterPrice,
        transportIncluded: counterTransportIncluded,
        notes: counterNotes,
      });

      setSuccessBanner(`Counter-offer of ₹${counterPrice}/${counterModalOffer.unit} dispatched successfully.`);
      setCounterModalOffer(null);
      await fetchOffers();
    } catch (err: any) {
      alert(`Failed to send counter-offer: ${err.message || 'Please retry'}`);
    } finally {
      setIsSubmittingCounter(false);
    }
  };

  // Filtered offers
  const filteredOffers = offers.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  const pendingCount = offers.filter((o) => o.status === 'pending').length;
  const acceptedCount = offers.filter((o) => o.status === 'accepted').length;

  return (
    <div id="offers-negotiation-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {t.offers || 'Offers & Negotiations'}
              </h1>
              <p className="text-xs text-slate-700 mt-0.5">
                Direct buyer-to-farmer price proposals with instant counter-offers and escrow-secured execution.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            id="refresh-offers-btn"
            onClick={fetchOffers}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Offers', count: offers.length },
          { id: 'pending', label: 'Pending Response', count: pendingCount },
          { id: 'accepted', label: 'Accepted / Orders', count: acceptedCount },
          { id: 'countered', label: 'Counter-Offered', count: offers.filter((o) => o.status === 'countered').length },
          { id: 'rejected', label: 'Declined', count: offers.filter((o) => o.status === 'rejected').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
              filter === tab.id
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                filter === tab.id ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-700 font-medium">Loading your offers and negotiations...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <Handshake className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No offers found in this category</h3>
          <p className="text-xs text-slate-700 mt-1 max-w-md mx-auto">
            {filter === 'all'
              ? 'When buyers or farmers initiate deals or propose prices for crop lots, they will appear here.'
              : `You do not have any offers marked as "${filter}".`}
          </p>
          <div className="mt-4 flex justify-center space-x-3">
            <button
              onClick={() => setCurrentTab?.('marketPrices')}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
            >
              Explore Live Mandi Prices →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOffers.map((offer) => {
            const isSentByMe = offer.initiator
              ? (offer.initiator === 'buyer' && !isFarmer) || (offer.initiator === 'farmer' && isFarmer)
              : offer.farmerId === user?.id;

            const counterpartyName = isFarmer ? offer.buyerName || 'Verified Buyer' : offer.farmerName || 'Verified Farmer';
            const totalValue = (offer.quantity || 0) * (offer.proposedPrice || 0);

            const statusColors: Record<string, string> = {
              pending: 'bg-amber-50 text-amber-950 border-amber-300',
              accepted: 'bg-emerald-50 text-emerald-950 border-emerald-300',
              countered: 'bg-blue-50 text-blue-950 border-blue-300',
              rejected: 'bg-rose-50 text-rose-950 border-rose-300',
            };

            const isActionable = offer.status === 'pending' && !isSentByMe;

            return (
              <div
                key={offer.id}
                id={`offer-card-${offer.id}`}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        {isFarmer ? <Building2 className="w-4 h-4" /> : <Wheat className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center space-x-1">
                          <span>{counterpartyName}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 inline" />
                        </div>
                        <div className="text-[11px] text-slate-700 flex items-center space-x-1">
                          {isSentByMe ? (
                            <span className="inline-flex items-center text-slate-700">
                              <ArrowUpRight className="w-3 h-3 mr-0.5 text-slate-600" /> Offer Sent by You
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-emerald-800 font-bold">
                              <ArrowDownLeft className="w-3 h-3 mr-0.5" /> Received Offer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${
                        statusColors[offer.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  {/* Crop & Price Details */}
                  <div className="mt-4 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Commodity Lot</span>
                        <div className="text-base font-black text-slate-900">
                          {getLocalizedCropName(offer.cropName, language)}
                        </div>
                        <div className="text-xs text-slate-700 mt-0.5">
                          Volume: <span className="font-bold text-slate-900">{offer.quantity} {offer.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Offered Rate</span>
                        <div className="text-base font-black text-emerald-800">
                          ₹{offer.proposedPrice}/{offer.unit}
                        </div>
                        <div className="text-xs font-bold text-slate-700 mt-0.5">
                          Total: ₹{totalValue.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Logistics inclusion badge */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700">
                      <span className="flex items-center space-x-1">
                        <Truck className="w-3.5 h-3.5 text-slate-600" />
                        <span>Transport: {offer.transportIncluded ? 'Included by seller' : 'Buyer to arrange/direct pickup'}</span>
                      </span>
                      <span className="flex items-center space-x-1 font-bold text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Escrow Protected</span>
                      </span>
                    </div>

                    {offer.notes && (
                      <div className="mt-2 text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-100">
                        "{offer.notes}"
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-700">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(offer.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <span>ID: {offer.id.slice(0, 10)}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openChatModal?.()}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>

                  {isActionable ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRejectOffer(offer)}
                        disabled={actionLoadingId === offer.id}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => handleOpenCounterModal(offer)}
                        disabled={actionLoadingId === offer.id}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                      >
                        Counter
                      </button>

                      <button
                        onClick={() => handleAcceptOffer(offer)}
                        disabled={actionLoadingId === offer.id}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 shadow-xs transition cursor-pointer flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{actionLoadingId === offer.id ? 'Accepting...' : 'Accept'}</span>
                      </button>
                    </div>
                  ) : offer.status === 'accepted' ? (
                    <button
                      onClick={() => setCurrentTab?.('orders')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer flex items-center space-x-1"
                    >
                      <span>View Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-slate-700 font-medium">
                      {isSentByMe ? 'Awaiting counterparty response' : `Status: ${offer.status}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Submit Counter Proposal</h3>
                  <p className="text-[11px] text-slate-700">Negotiate price & terms directly</p>
                </div>
              </div>
              <button
                onClick={() => setCounterModalOffer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCounter} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="text-slate-700 font-medium">Commodity:</div>
                <div className="font-bold text-slate-900 text-sm">{counterModalOffer.cropName}</div>
                <div className="text-slate-700 mt-1">
                  Original Proposal: <span className="font-bold text-slate-800">₹{counterModalOffer.proposedPrice}/{counterModalOffer.unit}</span> for {counterModalOffer.quantity} {counterModalOffer.unit}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Proposed Rate (₹ per {counterModalOffer.unit}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity ({counterModalOffer.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={counterQuantity}
                  onChange={(e) => setCounterQuantity(parseInt(e.target.value, 10) || 0)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="counterTransport"
                  checked={counterTransportIncluded}
                  onChange={(e) => setCounterTransportIncluded(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="counterTransport" className="text-xs text-slate-700 cursor-pointer font-medium">
                  Transport costs included in this proposed rate
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Terms (Optional)</label>
                <textarea
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Grade A lot with moisture < 10%. Dispatch available immediately."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Total Calculation Preview */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-xs text-emerald-950 font-medium">Counter Deal Total:</span>
                <span className="text-sm font-black text-emerald-900">
                  ₹{Math.round(counterPrice * counterQuantity).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterModalOffer(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCounter}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingCounter ? 'Sending...' : 'Send Counter Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
