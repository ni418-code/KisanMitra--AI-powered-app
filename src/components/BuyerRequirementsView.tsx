import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { BuyerRequest, Product, MatchResult } from '../types/index.ts';
import {
  PlusCircle,
  ShoppingBag,
  MapPin,
  Calendar,
  CheckCircle,
  Sparkles,
  Users,
  X,
  ArrowRight,
  Send,
  SlidersHorizontal,
  DollarSign,
  Truck,
  Trash2,
} from 'lucide-react';

interface BuyerRequirementsViewProps {
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  openChatModal?: (convId?: string) => void;
}

export const BuyerRequirementsView: React.FC<BuyerRequirementsViewProps> = ({
  isPostModalOpen,
  setIsPostModalOpen,
  openChatModal,
}) => {
  const { user, t } = useAuth();
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'browseLots'>('requests');
  
  // Matchmaker Modal State
  const [selectedReqForMatch, setSelectedReqForMatch] = useState<BuyerRequest | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Send Offer Modal State
  const [offerModalTarget, setOfferModalTarget] = useState<{ productId?: string; buyerRequestId?: string; farmerId?: string; farmerName?: string; cropName: string; defaultPrice: number; defaultQty: number } | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerQty, setOfferQty] = useState<number>(0);
  const [includeTransport, setIncludeTransport] = useState<boolean>(true);
  const [offerNotes, setOfferNotes] = useState<string>('');
  const [offerSuccessMsg, setOfferSuccessMsg] = useState<string | null>(null);

  // Post Requirement Form State
  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Grade A Standard');
  const [quantity, setQuantity] = useState(5000);
  const [unit, setUnit] = useState('kg');
  const [offeredPrice, setOfferedPrice] = useState(26);
  const [qualityStandard, setQualityStandard] = useState('Grade A');
  const [neededByDate, setNeededByDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [state, setState] = useState(user?.location?.state || 'Telangana');
  const [district, setDistrict] = useState(user?.location?.district || 'Hyderabad');
  const [description, setDescription] = useState('Looking for fresh firm tomatoes for retail distribution.');

  const fetchData = async () => {
    setLoading(true);
    const [reqRes, prodRes] = await Promise.all([
      api.getBuyerRequests({ buyerId: user?.role === 'buyer' ? user?.id : undefined }),
      api.getProducts({ status: 'available' }),
    ]);

    if (reqRes.success && reqRes.data) setRequests(reqRes.data.requests || []);
    if (prodRes.success && prodRes.data) setProducts(prodRes.data.products || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createBuyerRequest({
      cropName,
      variety,
      quantity: Number(quantity),
      unit,
      offeredPrice: Number(offeredPrice),
      qualityStandard,
      neededByDate,
      deliveryLocation: { state, district, market: `${district} Mandi` },
      description,
    });

    if (res.success) {
      setIsPostModalOpen(false);
      fetchData();
    }
  };

  const handleOpenMatches = async (req: BuyerRequest) => {
    setSelectedReqForMatch(req);
    setMatchesLoading(true);
    const res = await api.getBuyerRequestMatches(req.id);
    if (res.success && res.data) {
      setMatches(res.data.matches || []);
    }
    setMatchesLoading(false);
  };

  const handleDeleteRequirement = async (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await api.deleteBuyerRequest(id);
    fetchData();
  };

  const handleOpenOfferModal = (target: any) => {
    setOfferModalTarget(target);
    setOfferPrice(target.defaultPrice);
    setOfferQty(target.defaultQty);
    setOfferNotes('We can arrange immediate pickup from your farm yard upon acceptance.');
    setOfferSuccessMsg(null);
  };

  const handleSendOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerModalTarget) return;

    const res = await api.createOffer({
      productId: offerModalTarget.productId,
      buyerRequestId: offerModalTarget.buyerRequestId,
      targetUserId: offerModalTarget.farmerId || 'usr-1',
      targetUserName: offerModalTarget.farmerName || 'Ramesh Patel',
      cropName: offerModalTarget.cropName,
      proposedPrice: Number(offerPrice),
      quantity: Number(offerQty),
      unit: 'kg',
      transportIncluded: includeTransport,
      notes: offerNotes,
    });

    if (res.success) {
      setOfferSuccessMsg('Offer transmitted directly to farmer with instant notification!');
      setTimeout(() => {
        setOfferModalTarget(null);
        setOfferSuccessMsg(null);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-2xl text-white p-5 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            🏢 Buyer Procurement Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Demands & Farmer Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            Post bulk purchase requirements or browse available farm-origin crop lots directly.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.postRequirement}</span>
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'requests'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Posted Requirements ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('browseLots')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'browseLots'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Browse Verified Farmer Lots ({products.length})
        </button>
      </div>

      {/* Tab 1: Posted Requirements */}
      {activeTab === 'requests' && (
        <>
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs font-bold text-slate-500">Loading your requirements...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Requirements Posted</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Post your bulk requirement for tomatoes, onions, paddy, or chillies to automatically match with registered farmers.
              </p>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                + Post New Requirement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-lg font-black text-slate-900">{req.cropName}</span>
                        <span className="block text-xs text-slate-500 font-medium">{req.variety}</span>
                      </div>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        ₹{req.offeredPrice}/{req.unit}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Required Quantity:</span>
                        <span className="font-bold text-slate-800">{(req.quantity || 0).toLocaleString('en-IN')} {req.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Destination:</span>
                        <span className="font-semibold text-slate-700">{req.deliveryLocation.district}, {req.deliveryLocation.state}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Needed By:</span>
                        <span className="font-semibold text-slate-700">{req.neededByDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quality:</span>
                        <span className="font-semibold text-slate-700">{req.qualityStandard}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{req.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenMatches(req)}
                      className="flex-grow py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Matched Farmers</span>
                    </button>
                    <button
                      onClick={() => handleDeleteRequirement(req.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Delete Requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Browse Farmer Lots */}
      {activeTab === 'browseLots' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <img
                  src={prod.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'}
                  alt={prod.cropName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-slate-900">{prod.cropName}</span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ₹{prod.expectedPrice}/{prod.unit}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    {(prod.quantity || 0).toLocaleString('en-IN')} {prod.unit} available • {prod.quality || prod.qualityGrade || prod.grade}
                  </p>

                  <div className="text-xs text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prod.location.district}, {prod.location.state}</span>
                  </div>

                  <div className="text-xs text-emerald-800 font-semibold">
                    Farmer: {prod.farmerName}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() =>
                    handleOpenOfferModal({
                      productId: prod.id,
                      farmerId: prod.farmerId,
                      farmerName: prod.farmerName,
                      cropName: prod.cropName,
                      defaultPrice: prod.expectedPrice,
                      defaultQty: prod.quantity,
                    })
                  }
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Purchase Offer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Requirement Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold font-serif">Post Procurement Requirement</h2>
                <p className="text-xs text-emerald-200">Match instantly with farmers possessing your target crops</p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostRequirement} className="p-5 overflow-y-auto space-y-4 flex-grow">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Crop Needed</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Tomato, Chilli, Paddy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Variety / Grade</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Hybrid Grade A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Offered Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Delivery State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Delivery District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Needed By Date</label>
                  <input
                    type="date"
                    required
                    value={neededByDate}
                    onChange={(e) => setNeededByDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quality Standard</label>
                  <select
                    value={qualityStandard}
                    onChange={(e) => setQualityStandard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                    <option value="Grade C">Grade C (Processing)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Specification & Requirements</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                Post Requirement & Find Matches
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Matching Farmers Modal with Full Score Breakdown */}
      {selectedReqForMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase">Weighted Matching Results</span>
                <h2 className="text-lg font-black">{selectedReqForMatch.cropName} ({selectedReqForMatch.quantity} {selectedReqForMatch.unit})</h2>
              </div>
              <button
                onClick={() => setSelectedReqForMatch(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-grow">
              {matchesLoading ? (
                <div className="py-12 text-center">
                  <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-slate-500 font-semibold">Ranking farmer lots by distance, price & capacity...</p>
                </div>
              ) : matches.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">No farmer lots found currently matching this specification.</p>
              ) : (
                (matches || []).map((m, idx) => {
                  const reasonsList = Array.isArray(m.reasons)
                    ? m.reasons
                    : (m.explanation ? m.explanation.split(' • ') : ['Compatible crop specification']);

                  return (
                    <div key={m.targetId || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full">
                            {m.matchScore}% Match
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs">{m.farmerName || 'Verified Farmer'}</span>
                        </div>
                        <span className="text-xs font-black text-emerald-800">Asking: ₹{m.expectedPrice || m.product?.expectedPrice || 0}/kg</span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                        <div>Crop: <span className="font-bold">{m.breakdown?.cropScore ?? m.breakdown?.cropMatch ?? 0}/40</span></div>
                        <div>Loc: <span className="font-bold">{m.breakdown?.locationScore ?? m.breakdown?.locationMatch ?? 0}/20</span></div>
                        <div>Qty: <span className="font-bold">{m.breakdown?.quantityScore ?? m.breakdown?.quantityMatch ?? 0}/15</span></div>
                        <div>Price: <span className="font-bold">{m.breakdown?.priceScore ?? m.breakdown?.priceMatch ?? 0}/15</span></div>
                        <div>Avail: <span className="font-bold">{m.breakdown?.availabilityScore ?? m.breakdown?.availabilityMatch ?? 0}/10</span></div>
                      </div>

                      <div className="space-y-1">
                        {reasonsList.map((r, i) => (
                          <p key={i} className="text-[11px] text-slate-600 flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{r}</span>
                          </p>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedReqForMatch(null);
                          handleOpenOfferModal({
                            productId: m.targetId || m.product?.id,
                            farmerId: m.farmerId || m.product?.farmerId,
                            farmerName: m.farmerName || m.product?.farmerName,
                            cropName: m.cropName || m.product?.cropName,
                            defaultPrice: m.expectedPrice || m.product?.expectedPrice || 25,
                            defaultQty: m.quantity || m.product?.quantity || 1000,
                          });
                        }}
                        className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Send Offer to {m.farmerName || 'Farmer'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Send Purchase Offer Modal */}
      {offerModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif">Purchase Offer for {offerModalTarget.cropName}</h3>
                <p className="text-xs text-emerald-200">To Farmer: {offerModalTarget.farmerName}</p>
              </div>
              <button
                onClick={() => setOfferModalTarget(null)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {offerSuccessMsg ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">{offerSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendOfferSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Offered Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quantity (Kg)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={offerQty}
                    onChange={(e) => setOfferQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
                  />
                </div>

                <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="transport-check"
                    checked={includeTransport}
                    onChange={(e) => setIncludeTransport(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="transport-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Buyer arranges direct farm pickup logistics
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Proposal Note / Terms</label>
                  <textarea
                    rows={2}
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between font-bold text-emerald-900">
                  <span>Estimated Total Amount:</span>
                  <span>₹{((offerPrice || 0) * (offerQty || 0)).toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
                >
                  Confirm & Transmit Offer
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
