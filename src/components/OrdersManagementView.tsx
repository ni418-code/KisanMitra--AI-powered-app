import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import { getLocalizedCropName } from '../services/translations.ts';
import {
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  MapPin,
  MessageSquare,
  FileText,
  DollarSign,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface OrdersManagementViewProps {
  openChatModal?: (convId?: string) => void;
  onOpenEscrow?: (orderId?: string) => void;
}

const SHIPPING_STAGES = [
  'accepted',
  'processing',
  'ready_for_shipping',
  'shipped',
  'out_for_delivery',
  'delivered',
  'completed',
];

export const OrdersManagementView: React.FC<OrdersManagementViewProps> = ({ openChatModal, onOpenEscrow }) => {
  const { user, language, t } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.getOrders();
    if (res.success && res.data) {
      setOrders(res.data.orders || []);
      if (selectedOrder) {
        const refreshed = res.data.orders.find((o) => o.id === selectedOrder.id);
        if (refreshed) setSelectedOrder(refreshed);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingStatus(true);
    const res = await api.updateOrderStatus(orderId, {
      status: nextStatus,
      trackingNotes: `Status updated to ${nextStatus.replace(/_/g, ' ')} on ${new Date().toLocaleTimeString()}`,
    });
    setUpdatingStatus(false);
    if (res.success && res.data) {
      setSelectedOrder(res.data.order);
      fetchOrders();
    }
  };

  const handleSimulatePayment = async (orderId: string, action: 'deposit' | 'release') => {
    setUpdatingStatus(true);
    const res = await api.simulatePayment(orderId, action);
    setUpdatingStatus(false);
    if (res.success && res.data) {
      setSelectedOrder(res.data.order);
      fetchOrders();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-950 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Verified Order Contracts & Logistics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Orders & Escrow Tracking
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl mt-1">
          End-to-end milestone tracking, distance-calculated transit costs, and secure escrow simulation protecting both farmer and buyer.
        </p>
      </div>

      {/* Main Grid: Orders List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders List (1 or 2 cols depending on selection) */}
        <div className={`space-y-4 ${selectedOrder ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs font-bold text-slate-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Orders Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                When a buyer and farmer agree to an offer, a certified order contract is automatically generated here.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`bg-white rounded-2xl p-4 sm:p-5 border cursor-pointer transition ${
                  selectedOrder?.id === ord.id
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">{getLocalizedCropName(ord.cropName || ord.crop || 'Tomato', language)}</span>
                    <span className="text-xs text-slate-400 font-mono">#{ord.orderId}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    ord.orderStatus === 'completed' || ord.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-900' :
                    ord.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {ord.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Parties:</span>
                    <span className="font-semibold">{ord.farmerName} ➔ {ord.buyerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Total Amount:</span>
                    <span className="font-black text-emerald-800 text-sm">₹{(ord.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Escrow: <strong className="text-slate-800">{ord.escrowStatus || ord.paymentStatus}</strong></span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(ord);
                      onOpenEscrow?.(ord.id);
                    }}
                    className="text-emerald-700 font-bold flex items-center hover:underline cursor-pointer"
                    title="View payment status"
                  >
                    Track Milestone <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Order Detail Drawer (2 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6 animate-in fade-in duration-150">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-slate-900 font-serif">
                    Order #{selectedOrder.orderId}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                    {selectedOrder.orderStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {getLocalizedCropName(selectedOrder.cropName || selectedOrder.crop || 'Tomato', language)} • Created on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              {openChatModal && (
                <button
                  onClick={() => openChatModal(selectedOrder.id)}
                  className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Order Chat Room</span>
                </button>
              )}
            </div>

            {/* Server-Side Certified Cost Breakdown (Rule 18) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Server-Certified Financial Breakdown
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Produce Amount ({selectedOrder.quantity} {selectedOrder.unit} × ₹{selectedOrder.pricePerUnit || selectedOrder.agreedPrice || '—'}/{selectedOrder.unit}):</span>
                  <span className="font-semibold">₹{(selectedOrder.costBreakdown?.productAmount || selectedOrder.productAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport & Logistics Cost:</span>
                  <span className="font-semibold">₹{(selectedOrder.costBreakdown?.transportCost || selectedOrder.transportCost || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mandi Handling & Quality Inspection:</span>
                  <span className="font-semibold">₹{(selectedOrder.costBreakdown?.handlingCost || selectedOrder.storageCost || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-emerald-950">
                  <span>Total Order Consideration:</span>
                  <span>₹{(selectedOrder.costBreakdown?.totalAmount || selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Shipping Progression Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Logistics & Transit Stages
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {SHIPPING_STAGES.map((stage, idx) => {
                  const currentIdx = SHIPPING_STAGES.indexOf(selectedOrder.orderStatus);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={stage}
                      className={`p-2.5 rounded-xl border text-center text-xs transition ${
                        isCurrent
                          ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-sm'
                          : isDone
                          ? 'bg-emerald-100/70 text-emerald-900 font-semibold border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-mono mb-1">0{idx + 1}</div>
                      <span className="capitalize">{stage.replace(/_/g, ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Escrow Payment Simulator & Status Actions */}
            <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-teal-800" />
                  <div>
                    <h4 className="text-xs font-bold text-teal-950 uppercase">Escrow Settlement Mechanism</h4>
                    <p className="text-[11px] text-teal-900">
                      Escrow Status: <strong>{selectedOrder.escrowStatus || selectedOrder.paymentStatus}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedOrder.escrowStep !== 'released' ? (
                    <button
                      onClick={() => onOpenEscrow?.(selectedOrder.id)}
                      disabled={updatingStatus}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      Open Secure Escrow
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-200 text-emerald-900 font-bold text-xs rounded-lg">
                      ✅ PAYMENT RELEASED
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Advance Status — only farmer (or admin) drives the shipping timeline */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-slate-500">
                Delivery: {(selectedOrder.deliveryAddress || selectedOrder.deliveryLocation || { district: '—', state: '' }).district}, {(selectedOrder.deliveryAddress || selectedOrder.deliveryLocation || { state: '' }).state}
              </span>
              
              {user?.role !== 'buyer' && selectedOrder.orderStatus !== 'completed' && (
                <div className="flex items-center space-x-2">
                  {selectedOrder.orderStatus === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Mark Processing
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'processing' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'ready_for_shipping')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Ready for Transit
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'ready_for_shipping' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Dispatch Vehicle (Shipped)
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'shipped' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'out_for_delivery')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'out_for_delivery' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Confirm Delivery
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'delivered' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      Complete Order
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
