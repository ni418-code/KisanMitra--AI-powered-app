import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Product, MatchResult } from '../types/index.ts';
import {
  PlusCircle,
  Package,
  MapPin,
  Calendar,
  CheckCircle,
  Trash2,
  Edit,
  Sparkles,
  Users,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ProduceManagementViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  openChatModal?: (convId?: string) => void;
}

const PRESET_CROPS = [
  { name: 'Tomato', category: 'Vegetables', defaultPrice: 28, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
  { name: 'Onion', category: 'Vegetables', defaultPrice: 26, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80' },
  { name: 'Paddy (Rice)', category: 'Cereals', defaultPrice: 25, image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500&auto=format&fit=crop&q=80' },
  { name: 'Chilli Red', category: 'Spices', defaultPrice: 195, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80' },
  { name: 'Maize', category: 'Cereals', defaultPrice: 24, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80' },
];

export const ProduceManagementView: React.FC<ProduceManagementViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { user, t } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForMatches, setSelectedProductForMatches] = useState<Product | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Form State
  const [cropName, setCropName] = useState('Tomato');
  const [category, setCategory] = useState('Vegetables');
  const [variety, setVariety] = useState('Hybrid A-10');
  const [quantity, setQuantity] = useState(2500);
  const [unit, setUnit] = useState('kg');
  const [expectedPrice, setExpectedPrice] = useState(28);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('Farm fresh produce directly harvested from Guntur farm.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80');

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.getProducts({ farmerId: user?.role === 'farmer' ? user?.id : undefined });
    if (res.success && res.data) {
      setProducts(res.data.products || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleSelectPreset = (preset: typeof PRESET_CROPS[0]) => {
    setCropName(preset.name);
    setCategory(preset.category);
    setExpectedPrice(preset.defaultPrice);
    setImageUrl(preset.image);
  };

  const handleAddProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createProduct({
      cropName,
      category,
      variety,
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      quality: qualityGrade,
      grade: qualityGrade,
      qualityGrade,
      harvestDate,
      availableUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      location: user?.location || { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Mandi' },
      images: [imageUrl],
      description,
    });

    if (res.success) {
      setIsAddModalOpen(false);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await api.deleteProduct(id);
    fetchProducts();
  };

  const handleViewMatches = async (product: Product) => {
    setSelectedProductForMatches(product);
    setMatchesLoading(true);
    const res = await api.getProductMatches(product.id);
    if (res.success && res.data) {
      setMatches(res.data.matches || []);
    }
    setMatchesLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl text-white p-5 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            🌾 Farmer Produce Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            My Listed Crop Lots
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            List and manage your harvested produce. The automated matching engine connects you to verified buyers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addProduce}</span>
        </button>
      </div>

      {/* Produce List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-bold text-slate-500">Loading produce inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Produce Lots Listed Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Click "+ Add Produce" to list your tomatoes, chillies, paddy, or maize and receive instant buyer purchase offers.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            + Add First Crop Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'}
                    alt={prod.cropName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                    <span>{prod.cropName}</span>
                    <span className="text-emerald-300">({prod.category})</span>
                  </div>

                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase ${
                    prod.status === 'available' ? 'bg-emerald-500 text-white' :
                    prod.status === 'reserved' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                  }`}>
                    {prod.status}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">{(prod.quantity || 0).toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-500 font-semibold ml-1">{prod.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-800">₹{prod.expectedPrice}</span>
                      <span className="text-xs text-slate-500 font-medium">/{prod.unit}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Variety & Grade:</span>
                      <span className="font-bold text-slate-800">{prod.variety || 'Standard'} • {prod.quality || prod.qualityGrade || prod.grade}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-700">{prod.location.district}, {prod.location.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Harvest Date:</span>
                      <span className="font-semibold text-slate-700">{prod.harvestDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleViewMatches(prod)}
                  className="flex-grow py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Matching Buyers</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(prod.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold font-serif">Add New Produce Lot</h2>
                <p className="text-xs text-emerald-200">List your harvest for verified buyers across India</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduce} className="p-5 overflow-y-auto space-y-4 flex-grow">
              
              {/* Quick Select Presets */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Popular Crops (Click to Auto-fill)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CROPS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-2.5 py-1 text-xs rounded-lg border font-semibold transition ${
                        cropName === preset.name
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Spices">Spices</option>
                    <option value="Cereals">Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Oilseeds">Oilseeds</option>
                    <option value="Commercial">Commercial</option>
                  </select>
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
                    <option value="kg">kg (Kilogram)</option>
                    <option value="quintal">quintal (100 kg)</option>
                    <option value="ton">ton (1,000 kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Expected Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Quality Grade</label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                    <option value="Grade C">Grade C (Processing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Image URL / Preset</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Produce Notes & Description</label>
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
                Publish Produce Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Matching Buyers Modal */}
      {selectedProductForMatches && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase">Matching Engine Results</span>
                <h2 className="text-lg font-black">{selectedProductForMatches.cropName} ({selectedProductForMatches.quantity} {selectedProductForMatches.unit})</h2>
              </div>
              <button
                onClick={() => setSelectedProductForMatches(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-grow">
              {matchesLoading ? (
                <div className="py-12 text-center">
                  <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-slate-500 font-semibold">Calculating multi-criteria match weights...</p>
                </div>
              ) : matches.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">No active buyer requests currently matching this crop.</p>
              ) : (
                (matches || []).map((m, idx) => {
                  const reasonsList = Array.isArray(m.reasons)
                    ? m.reasons
                    : (m.explanation ? m.explanation.split(' • ') : ['Compatible crop specification']);

                  return (
                    <div key={m.targetId || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full">
                            {m.matchScore}% Match
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs">{m.buyerName || 'Verified Buyer'}</span>
                        </div>
                        <span className="text-xs font-black text-slate-800">Offered: ₹{m.offeredPrice || m.buyerRequest?.targetPricePerKg || 0}/kg</span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 mb-2">
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
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
