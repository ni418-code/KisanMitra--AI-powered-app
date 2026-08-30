import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  ShieldCheck,
  Lock,
  Truck,
  BadgeCheck,
  CheckCircle2,
  RefreshCw,
  CreditCard,
  Zap,
  Sparkles,
  ChevronRight,
  Box,
  CircleDollarSign,
  Smartphone,
  UserCheck,
  PartyPopper,
} from 'lucide-react';

interface EscrowManagementViewProps {
  openChatModal?: (convId?: string) => void;
  initialOrderId?: string | null;
}

const ESCROW_STEPS = [
  { id: 'awaiting_deposit', label: 'Buyer Deposits', icon: CreditCard },
  { id: 'funds_locked', label: 'Funds Locked', icon: Lock },
  { id: 'farmer_delivered', label: 'Farmer Marks Delivery', icon: Truck },
  { id: 'quality_verified', label: 'Buyer Verifies Quality', icon: BadgeCheck },
  { id: 'released', label: 'Payment Released', icon: CheckCircle2 },
];

export const EscrowManagementView: React.FC<EscrowManagementViewProps> = ({ openChatModal, initialOrderId }) => {
  const { user, language, t } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const appliedInitialRef = useRef<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [payModalOrder, setPayModalOrder] = useState<Order | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [justReleased, setJustReleased] = useState(false);

  const isFarmer = user?.role === 'farmer';
  const isBuyer = user?.role === 'buyer';
  const isAdmin = user?.role === 'admin';

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.getOrders();
    if (res.success && res.data) {
      setOrders(res.data.orders || []);
      if (selectedOrder) {
        const refreshed = (res.data.orders || []).find((o) => o.id === selectedOrder.id);
        if (refreshed) setSelectedOrder(refreshed);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!initialOrderId || appliedInitialRef.current === initialOrderId) return;
    const match = orders.find((o) => o.id === initialOrderId || o.orderId === initialOrderId);
    if (match) {
      setSelectedOrder(match);
      appliedInitialRef.current = initialOrderId;
    }
  }, [initialOrderId, orders]);

  const refreshSelected = (order: Order) => {
    setSelectedOrder(order);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  };

  const handleEscrowAction = async (order: Order, action: 'deposit' | 'mark_delivered' | 'verify_quality' | 'release') => {
    setActionLoading(true);
    const res = await api.updateEscrow(order.id, action);
    setActionLoading(false);
    if (res.success && res.data?.order) {
      refreshSelected(res.data.order);
      setBanner(res.message || 'Escrow updated.');
      if (res.data.order.escrowStep === 'released') {
        setJustReleased(true);
        setTimeout(() => setJustReleased(false), 2600);
      }
    } else {
      setBanner(res.message || 'Action could not be completed.');
    }
  };

  const handleOpenMockPayment = (order: Order) => {
    setPayModalOrder(order);
    setPaymentProcessing(false);
    setPaymentSuccess(false);
  };

  const handleMockPay = () => {
    if (!payModalOrder) return;
    setPaymentProcessing(true);
    setTimeout(async () => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setTimeout(async () => {
        const res = await api.updateEscrow(payModalOrder.id, 'deposit');
        if (res.success && res.data?.order) {
          refreshSelected(res.data.order);
          setBanner(res.message || 'Funds locked in escrow.');
        }
        setPayModalOrder(null);
        setPaymentSuccess(false);
      }, 900);
    }, 900);
  };

  const stepIndex = (order: Order) => {
    const step = order.escrowStep || (order.paymentStatus === 'escrow_held' || order.paymentStatus === 'escrow_funded' ? 'funds_locked' : 'awaiting_deposit');
    const idx = ESCROW_STEPS.findIndex((s) => s.id === step);
    return idx < 0 ? 0 : idx;
  };

  const isActionAllowed = (order: Order, action: string): boolean => {
    const step = order.escrowStep || (order.paymentStatus === 'escrow_held' || order.paymentStatus === 'escrow_funded' ? 'funds_locked' : 'awaiting_deposit');
    if (action === 'deposit') return step === 'awaiting_deposit' && (isBuyer || isAdmin);
    if (action === 'mark_delivered') return step === 'funds_locked' && (isFarmer || isAdmin);
    if (action === 'verify_quality') return step === 'farmer_delivered' && (isBuyer || isAdmin);
    if (action === 'release') return isAdmin && step !== 'released';
    return false;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Simulated Escrow & Milestone Payments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">Secure Escrow Workflow</h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl">
              Buyer Deposits → Funds Locked → Farmer Delivers → Buyer Verifies → ✅ Payment Released. Demo balances only — no real payment gateways.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOrders} disabled={loading} className="px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl border border-emerald-500/50 transition flex items-center space-x-1.5">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>
      </div>

      {banner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center justify-between text-sm font-bold shadow-sm animate-in fade-in">
          <span className="flex items-center space-x-2"><CheckCircle2 className="w-5 h-5 text-emerald-700" /><span>{banner}</span></span>
          <button onClick={() => setBanner(null)} className="text-emerald-700 hover:text-emerald-950 text-xs font-bold">✕</button>
        </div>
      )}

      {justReleased && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white p-5 shadow-xl flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white text-emerald-900 flex items-center justify-center">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black">✅ PAYMENT RELEASED</p>
              <p className="text-xs text-emerald-100">Escrow released automatically to the farmer. Success animation logged.</p>
            </div>
          </div>
          <span className="text-3xl">🎉</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order list */}
        <div className={`space-y-4 ${selectedOrder ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading escrow transactions...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <CircleDollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Escrow Orders Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">Accept an offer from Offers & Negotiations to create a payment-protected order.</p>
            </div>
          ) : (
            orders.map((ord) => {
              const step = ord.escrowStep || 'awaiting_deposit';
              return (
                <div key={ord.id} onClick={() => setSelectedOrder(ord)} className={`bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition ${selectedOrder?.id === ord.id ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-sm">{getLocalizedCropName(ord.cropName || ord.crop || 'Tomato', language)}</span>
                    <span className="text-xs text-slate-400 font-mono">#{ord.orderId}</span>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-2">
                    <div className="flex justify-between"><span className="text-slate-400">Amount:</span><span className="font-black text-emerald-800">₹{(ord.totalAmount || 0).toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-slate-400">Parties:</span><span className="font-semibold">{ord.farmerName} ➔ {ord.buyerName}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-slate-400">Escrow:</span><span className="font-bold text-slate-800">{ord.escrowStatus || ord.paymentStatus}</span></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${step === 'released' ? 'bg-emerald-100 text-emerald-900' : step === 'awaiting_deposit' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'}`}>{step.replace(/_/g, ' ')}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected order detail */}
        {selectedOrder && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-slate-900 font-serif">Order #{selectedOrder.orderId}</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">{selectedOrder.orderStatus.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedOrder.cropName || selectedOrder.crop} • {(selectedOrder.quantity || 0).toLocaleString('en-IN')} {selectedOrder.unit}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Escrow Amount</span>
                <span className="text-2xl font-black text-emerald-800">₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="flex flex-wrap items-center gap-2">
              {ESCROW_STEPS.map((s, i) => {
                const idx = stepIndex(selectedOrder);
                const done = i < idx || (i === idx && selectedOrder.escrowStep === 'released');
                const current = i === idx && selectedOrder.escrowStep !== 'released';
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold ${current ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' : done ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      <Icon className="w-4 h-4" />
                      <span>{s.label}</span>
                    </div>
                    {i < ESCROW_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                  </div>
                );
              })}
            </div>

            {/* Status card */}
            <div className="p-4 rounded-2xl border space-y-2 bg-slate-50/70 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">Current Escrow Status</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full">{selectedOrder.escrowStatus || 'Awaiting Buyer Deposit'}</span>
              </div>
              <p className="text-xs text-slate-600">{selectedOrder.trackingNotes || 'Order created with escrow protection.'}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200"><span className="text-slate-400 block text-[10px]">Farmer Delivered</span><span className="font-bold">{selectedOrder.deliveryMarked ? 'Yes ✓' : 'No — pending'}</span></div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200"><span className="text-slate-400 block text-[10px]">Buyer Quality Verified</span><span className="font-bold">{selectedOrder.qualityVerified ? 'Yes ✓' : 'No — pending'}</span></div>
              </div>
            </div>

            {/* Role-specific action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedOrder.escrowStep !== 'released' && isActionAllowed(selectedOrder, 'deposit') && (
                <button onClick={() => handleOpenMockPayment(selectedOrder)} disabled={actionLoading} className="px-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2">
                  <CircleDollarSign className="w-4 h-4" /> Deposit Funds into KisanMitra Escrow
                </button>
              )}
              {isActionAllowed(selectedOrder, 'mark_delivered') && (
                <button onClick={() => handleEscrowAction(selectedOrder, 'mark_delivered')} disabled={actionLoading} className="px-4 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4" /> Mark Lot as Delivered
                </button>
              )}
              {isActionAllowed(selectedOrder, 'verify_quality') && (
                <button onClick={() => handleEscrowAction(selectedOrder, 'verify_quality')} disabled={actionLoading} className="px-4 py-3 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2">
                  <BadgeCheck className="w-4 h-4" /> Verify & Approve Quality
                </button>
              )}
              {selectedOrder.escrowStep === 'farmer_delivered' && !isBuyer && !isAdmin && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2"><UserCheck className="w-4 h-4" /> Waiting for Buyer Quality Check</div>
              )}
              {selectedOrder.escrowStep === 'released' && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> ✅ PAYMENT RELEASED — 🎉 ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')} released successfully.</div>
              )}
            </div>

            {openChatModal && (
              <button onClick={() => openChatModal(selectedOrder.id)} className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition">Open Order Chat Room</button>
            )}

            {/* Admin demo controller */}
            {isAdmin && (
              <div className="p-4 rounded-2xl border border-purple-300 bg-purple-50/60 space-y-3">
                <div className="flex items-center gap-2 font-black text-purple-950 text-xs uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Admin Demo Controller</div>
                <p className="text-xs text-purple-900">Manually simulate any escrow step for investor / hackathon demos. All values are mock.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => handleEscrowAction(selectedOrder, 'deposit')} disabled={actionLoading || selectedOrder.paymentStatus !== 'pending'} className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl disabled:opacity-40">1. Buyer Deposit</button>
                  <button onClick={() => handleEscrowAction(selectedOrder, 'mark_delivered')} disabled={actionLoading || selectedOrder.escrowStep !== 'funds_locked'} className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl disabled:opacity-40">2. Farmer Delivery</button>
                  <button onClick={() => handleEscrowAction(selectedOrder, 'verify_quality')} disabled={actionLoading || selectedOrder.escrowStep !== 'farmer_delivered'} className="px-3 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl disabled:opacity-40">3. Quality Approval</button>
                  <button onClick={() => handleEscrowAction(selectedOrder, 'release')} disabled={actionLoading || selectedOrder.escrowStep === 'released'} className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl disabled:opacity-40">4. Release Payment</button>
                </div>
              </div>
            )}

            {/* Escrow history */}
            {selectedOrder.escrowHistory?.length ? (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Escrow Event History</h3>
                <div className="space-y-1.5">
                  {selectedOrder.escrowHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /><span>{h.label} <span className="text-slate-400">— {new Date(h.at).toLocaleString('en-IN')}</span></span></div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Mock UPI Payment Modal */}
      {payModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">KisanMitra Escrow — Deposit</h3>
                  <p className="text-[11px] text-slate-500">Order #{payModalOrder.orderId}</p>
                </div>
              </div>
              <button onClick={() => setPayModalOrder(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Product</span><span className="font-bold">{payModalOrder.cropName || payModalOrder.crop}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Quantity</span><span className="font-bold">{payModalOrder.quantity} {payModalOrder.unit}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Escrow Amount</span><span className="font-black text-emerald-800">₹{(payModalOrder.totalAmount || 0).toLocaleString('en-IN')}</span></div>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3"><CheckCircle2 className="w-9 h-9" /></div>
                <p className="font-black text-emerald-900">🔒 Funds Locked in Escrow</p>
                <p className="text-xs text-slate-500 mt-1">Simulated payment captured. No real money moved.</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="p-4 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/40 text-center">
                  <Smartphone className="w-8 h-8 text-emerald-700 mx-auto mb-1" />
                  <p className="text-sm font-black text-slate-900">Pay via Mock UPI</p>
                  <p className="text-[11px] text-slate-500">Demo payment using fake UPI ID • kisanmitra@demo</p>
                </div>
                <button onClick={handleMockPay} disabled={paymentProcessing} className="mt-4 w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition disabled:opacity-60">
                  {paymentProcessing ? 'Processing Mock Payment…' : 'Confirm Deposit (Mock UPI)'}
                </button>
                <p className="mt-3 text-center text-[10px] text-slate-400">⚠️ Demo only. No real UPI, bank, or payment gateway is connected.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
