import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Order, WalletTransaction } from '../types/index.ts';
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
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  QrCode,
  AlertCircle,
  Building2,
  Wallet,
  Receipt,
  Download,
  History,
  FileText,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';

interface EscrowManagementViewProps {
  openChatModal?: (convId?: string) => void;
  initialOrderId?: string | null;
  onNavigateToProfile?: () => void;
}

const ESCROW_STEPSCol = [
  { id: 'awaiting_deposit', label: 'Buyer Deposits', icon: CreditCard },
  { id: 'funds_locked', label: 'Funds Locked', icon: Lock },
  { id: 'farmer_delivered', label: 'Farmer Marks Delivery', icon: Truck },
  { id: 'quality_verified', label: 'Buyer Verifies Quality', icon: BadgeCheck },
  { id: 'released', label: 'Payment Released', icon: CheckCircle2 },
];

const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Axis Bank',
  'Canara Bank',
  'Bank of Baroda',
  'Kotak Mahindra Bank',
  'Union Bank of India',
];

export const EscrowManagementView: React.FC<EscrowManagementViewProps> = ({
  openChatModal,
  initialOrderId,
  onNavigateToProfile,
}) => {
  const { user, refreshUser, language, t } = useAuth();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'banking' | 'orders' | 'transactions'>('banking');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const appliedInitialRef = useRef<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'escrow_hold' | 'payout_received'>('all');

  // Notifications / Feedback
  const [banner, setBanner] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [justReleased, setJustReleased] = useState(false);

  // Buyer Deposit State
  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const [depositMethod, setDepositMethod] = useState<'upi' | 'netbanking' | 'neft' | 'card'>('upi');
  const [depositBank, setDepositBank] = useState('HDFC Bank');
  const [depositUpiId, setDepositUpiId] = useState('buyer.agro@okhdfcbank');
  const [depositProcessing, setDepositProcessing] = useState(false);
  const [depositSuccessData, setDepositSuccessData] = useState<{ amount: number; utr: string } | null>(null);

  // Farmer Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(15000);
  const [withdrawMethod, setWithdrawMethod] = useState<'bank_transfer' | 'upi'>('bank_transfer');
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);
  const [withdrawSuccessData, setWithdrawSuccessData] = useState<{ amount: number; utr: string; destination: string } | null>(null);

  // Modal for individual order deposit
  const [payModalOrder, setPayModalOrder] = useState<Order | null>(null);
  const [payModalMethod, setPayModalMethod] = useState<'upi' | 'netbanking' | 'neft' | 'card'>('upi');
  const [customPayableAmount, setCustomPayableAmount] = useState<number>(0);
  const [orderPayProcessing, setOrderPayProcessing] = useState(false);
  const [orderPaySuccess, setOrderPaySuccess] = useState(false);

  const isFarmer不易 = user?.role === 'farmer';
  const isFarmer = user?.role === 'farmer';
  const isBuyer = user?.role === 'buyer';
  const isAdmin = user?.role === 'admin';

  // Fetch orders and transactions
  const fetchData = async () => {
    setLoading(true);
    setTxLoading(true);

    try {
      const [ordersRes, txRes] = await Promise.all([
        api.getOrders(),
        api.getWalletTransactions(),
      ]);

      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data.orders || []);
        if (selectedOrder) {
          const refreshed = (ordersRes.data.orders || []).find((o) => o.id === selectedOrder.id);
          if (refreshed) setSelectedOrder(refreshed);
        }
      }

      if (txRes.success && txRes.data) {
        setTransactions(txRes.data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching escrow data', err);
    } finally {
      setLoading(false);
      setTxLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!initialOrderId || appliedInitialRef.current === initialOrderId) return;
    const match拼 = orders.find((o) => o.id === initialOrderId || o.orderId === initialOrderId);
    if (match拼) {
      setSelectedOrder(match拼);
      setActiveTab('orders');
      appliedInitialRef.current = initialOrderId;
    }
  }, [initialOrderId, orders]);

  const refreshSelected = (order: Order) => {
    setSelectedOrder(order);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
  };

  // Buyer Deposit Action
  const handleBuyerDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) {
      setBanner({ text: 'Please enter a valid deposit amount (min ₹1).', type: 'error' });
      return;
    }

    setDepositProcessing(true);
    try {
      const res = await api.depositWallet(
        depositAmount,
        depositMethod,
        `Deposit via ${depositMethod.toUpperCase()} (${depositMethod === 'netbanking' ? depositBank : depositMethod === 'upi' ? depositUpiId : 'Virtual Escrow Account'})`
      );

      if (res.success && res.data) {
        await refreshUser();
        setDepositSuccessData({
          amount: depositAmount,
          utr: res.data.transaction.referenceId || `DEP_${Date.now()}`,
        });
        setBanner({
          text: `₹${depositAmount.toLocaleString('en-IN')} deposited successfully into your KisanMitra Escrow Wallet!`,
          type: 'success',
        });
        // Refresh ledger
        const txRes = await api.getWalletTransactions();
        if (txRes.success && txRes.data) {
          setTransactions(txRes.data.transactions || []);
        }
      } else {
        setBanner({ text: res.message || 'Deposit failed. Please try again.', type: 'error' });
      }
    } catch (err: any) {
      setBanner({ text: err.message || 'Network error executing deposit.', type: 'error' });
    } finally {
      setDepositProcessing(false);
    }
  };

  // Farmer Withdrawal Action
  const handleFarmerWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const available = user?.withdrawableBalance ?? user?.walletBalance ?? 0;
    if (withdrawAmount <= 0) {
      setBanner({ text: 'Please enter a valid withdrawal amount.', type: 'error' });
      return;
    }
    if (withdrawAmount > available) {
      setBanner({ text: `Withdrawal amount exceeds available balance of ₹${available.toLocaleString('en-IN')}`, type: 'error' });
      return;
    }

    const bankDetails = user?.bankDetails;
    const destText = withdrawMethod === 'upi'
      ? `UPI ID ${bankDetails?.upiId || user?.phone + '@sbi'}`
      : `${bankDetails?.bankName || 'SBI'} A/C: ••••${(bankDetails?.accountNumber || '6194').slice(-4)}`;

    setWithdrawProcessing(true);
    try {
      const res拼 = await api.withdrawWallet(withdrawAmount, withdrawMethod, {
        upiId: bankDetails?.upiId,
        accountNumber: bankDetails?.accountNumber,
        ifscCode: bankDetails?.ifscCode,
      });

      if (res拼.success && res拼.data) {
        await refreshUser();
        setWithdrawSuccessData({
          amount: withdrawAmount,
          utr: res拼.data.utr || res拼.data.transaction.referenceId || `IMPS${Date.now()}`,
          destination: destText,
        });
        setBanner({
          text: `₹${withdrawAmount.toLocaleString('en-IN')} withdrawn successfully to ${destText}. Transfer Ref: ${res拼.data.utr}`,
          type: 'success',
        });
        // Refresh transactions
        const txRes = await api.getWalletTransactions();
        if (txRes.success && txRes.data) {
          setTransactions(txRes.data.transactions || []);
        }
      } else {
        setBanner({ text: res拼.message || 'Withdrawal failed. Please check balance.', type: 'error' });
      }
    } catch (err: any) {
      setBanner({ text: err.message || 'Network error executing withdrawal.', type: 'error' });
    } finally {
      setWithdrawProcessing(false);
    }
  };

  // Escrow Order Actions
  const handleEscrowAction = async (order: Order, action: 'deposit' | 'mark_delivered' | 'verify_quality' | 'release') => {
    setActionLoading(true);
    const res = await api.updateEscrow(order.id, action);
    setActionLoading(false);
    if (res.success && res.data?.order) {
      refreshSelected(res.data.order);
      setBanner({ text: res.message || 'Escrow updated.', type: 'success' });
      if (res.data.order.escrowStep === 'released') {
        setJustReleased(true);
        setTimeout(() => setJustReleased(false), 2600);
      }
      await refreshUser();
      const txRes = await api.getWalletTransactions();
      if (txRes.success && txRes.data) setTransactions(txRes.data.transactions || []);
    } else {
      setBanner({ text: res.message || 'Action could not be completed.', type: 'error' });
    }
  };

  const handleOpenOrderPaymentModal = (order: Order) => {
    setPayModalOrder(order);
    setCustomPayableAmount(order.totalAmount || 0);
    setOrderPayProcessing(false);
    setOrderPaySuccess(false);
  };

  const handleExecuteOrderPay = () => {
    if (!payModalOrder) return;
    setOrderPayProcessing(true);
    setTimeout(async () => {
      setOrderPayProcessing(false);
      setOrderPaySuccess(true);
      setTimeout(async () => {
        const res = await api.updateEscrow(payModalOrder.id, 'deposit');
        if (res.success && res.data?.order) {
          refreshSelected(res.data.order);
          setBanner({
            text: `₹${customPayableAmount.toLocaleString('en-IN')} locked safely in escrow for Order #${payModalOrder.orderId} via ${payModalMethod.toUpperCase()}.`,
            type: 'success',
          });
          await refreshUser();
        }
        setPayModalOrder(null);
        setOrderPaySuccess(false);
      }, 900);
    }, 900);
  };

  const stepIndex = (order: Order) => {
    const step = order.escrowStep || (order.paymentStatus === 'escrow_held' || order.paymentStatus === 'escrow_funded' ? 'funds_locked' : 'awaiting_deposit');
    const idx = ESCROW_STEPSCol.findIndex((s) => s.id === step);
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

  const filteredTransactions = transactions.filter((tx) => {
    if (txFilter === 'all') return true;
    return tx.type === txFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-7xl mx-auto">
      
      {/* Top Banner with Financial Balances & Trust Status */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 rounded-3xl text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>KisanMitra Direct Escrow & Banking Clearing Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif">
              {isFarmer ? 'Farmer Payouts & Settlement Vault' : 'Buyer Payments & Escrow Vault'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl">
              {isFarmer
                ? 'Guaranteed payment protection: Buyer funds are locked prior to harvest dispatch, with instant direct-to-bank settlement via IMPS/UPI upon quality approval.'
                : '100% milestone protected agri-trade: Deposit funds into your secure escrow wallet. Funds are only disbursed once you inspect and verify produce quality.'}
            </p>
          </div>

          {/* Quick Balance Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            
            {/* Primary Balance */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block">
                {isFarmer ? 'Withdrawable Balance' : 'Escrow Wallet Balance'}
              </span>
              <span className="text-2xl font-black text-emerald-300 block">
                ₹{((isFarmer ? user?.withdrawableBalance : user?.walletBalance) || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {isFarmer ? 'Available for instant withdrawal' : 'Available for new orders'}
              </span>
            </div>

            {/* Locked Balance */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">
                {isFarmer ? 'Pending Lot Escrow' : 'Locked in Transit Orders'}
              </span>
              <span className="text-2xl font-black text-amber-300 block">
                ₹{(user?.escrowLockedBalance || (isFarmer ? 32400 : 61250)).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {isFarmer ? 'Guarded in trustee lock' : 'Held safely until inspection'}
              </span>
            </div>

            {/* Trust Rating / Bank Link */}
            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Linked Payout A/C</span>
                <span className="text-xs font-black text-white truncate block">
                  {user?.bankDetails?.bankName || 'State Bank of India'}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  ••••{(user?.bankDetails?.accountNumber || '6194').slice(-4)}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                ✓ 256-Bit NPCI Verified
              </span>
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('banking')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'banking'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>
              {isBuyer ? '💳 Deposit & Payment Methods' : isFarmer ? '🏦 Farmer Withdrawal & Bank Payouts' : '💳 Payments & Banking'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>🔒 Order Escrow Milestones ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'transactions'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            <History className="w-4 h-4" />
            <span>📜 Transaction Ledger ({transactions.length})</span>
          </button>
        </div>
      </div>

      {/* Global Banner Alert */}
      {banner && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm font-bold shadow-sm animate-in fade-in ${
            banner.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
              : banner.type === 'error'
              ? 'bg-rose-50 border border-rose-300 text-rose-950'
              : 'bg-blue-50 border border-blue-300 text-blue-950'
          }`}
        >
          <span className="flex items-center space-x-2">
            {banner.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
            {banner.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />}
            {banner.type === 'info' && <Info className="w-5 h-5 text-blue-700 shrink-0" />}
            <span>{banner.text}</span>
          </span>
          <button onClick={() => setBanner(null)} className="text-slate-600 hover:text-slate-900 text-xs font-bold p-1">
            ✕
          </button>
        </div>
      )}

      {justReleased && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white p-5 shadow-xl flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white text-emerald-900 flex items-center justify-center font-black">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg font-black">✅ ESCROW PAYMENT RELEASED</p>
              <p className="text-xs text-emerald-100">
                Payment released automatically to the farmer's verified bank account via IMPS/NEFT.
              </p>
            </div>
          </div>
          <span className="text-3xl">🎉</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: BANKING, DEPOSITS & WITHDRAWALS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'banking' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Role-Specific Action (Buyer Deposit or Farmer Withdrawal) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* BUYER DEPOSIT FLOW */}
            {(isBuyer || isAdmin) && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center font-black">
                      <ArrowDownLeft className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Deposit Funds to Escrow Wallet</h2>
                      <p className="text-xs text-slate-500">
                        Pre-fund your escrow balance for instant order placement and automatic milestone locking.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-xs font-black shrink-0">
                    Instant 24x7 Credit
                  </span>
                </div>

                {depositSuccessData && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs text-emerald-950 animate-in fade-in">
                    <div className="flex items-center space-x-2 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Deposit Successful — ₹{depositSuccessData.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-slate-600">
                      Transaction Reference: <span className="font-mono font-bold text-slate-900">{depositSuccessData.utr}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setDepositSuccessData(null)}
                      className="text-xs text-teal-800 font-black hover:underline"
                    >
                      + Make another deposit
                    </button>
                  </div>
                )}

                <form onSubmit={handleBuyerDeposit} className="space-y-6">
                  
                  {/* Amount Input & Preset Chips */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Deposit Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-lg font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        min="100"
                        required
                      />
                    </div>

                    {/* Quick Amount Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[10000, 25000, 50000, 100000, 250000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            depositAmount === amt
                              ? 'bg-teal-800 text-white border-teal-800'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          +₹{amt.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Select Deposit Method
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                        { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                        { id: 'neft', label: 'NEFT / RTGS', icon: Building2 },
                        { id: 'card', label: 'Debit / Corporate Card', icon: CreditCard },
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSelected不易 = depositMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setDepositMethod(m.id as any)}
                            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                              isSelected不易
                                ? 'bg-teal-50 border-teal-600 text-teal-950 font-black shadow-xs ring-1 ring-teal-600'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-5 h-5 mb-2 text-teal-700" />
                            <span className="text-xs">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method Details */}
                  {depositMethod === 'upi' && (
                    <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 text-center space-y-3">
                      <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-teal-300 mx-auto shadow-sm flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-slate-950 rounded-xl p-2 flex flex-wrap gap-1 justify-center items-center">
                          <div className="w-9 h-9 bg-white rounded-xs p-1"><div className="w-full h-full bg-slate-900 rounded-xs"></div></div>
                          <div className="w-9 h-9 bg-white rounded-xs p-1"><div className="w-full h-full bg-slate-900 rounded-xs"></div></div>
                          <div className="w-9 h-9 bg-white rounded-xs p-1"><div className="w-full h-full bg-slate-900 rounded-xs"></div></div>
                          <div className="w-9 h-9 bg-white rounded-xs p-1"><div className="w-full h-full bg-teal-600 rounded-xs"></div></div>
                        </div>
                        <span className="text-[8px] font-black text-slate-700 mt-1">NPCI AUTO-UPI QR</span>
                      </div>

                      <div className="flex justify-center items-center gap-2 text-[11px] font-bold text-slate-600">
                        <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Google Pay</span>
                        <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">PhonePe</span>
                        <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">Paytm</span>
                        <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">BHIM UPI</span>
                      </div>

                      <div className="text-left pt-2">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Or Enter Buyer UPI ID (VPA)
                        </label>
                        <input
                          type="text"
                          value={depositUpiId}
                          onChange={(e) => setDepositUpiId(e.target.value)}
                          placeholder="e.g. buyer.agro@okhdfcbank"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {depositMethod === 'netbanking' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Select Corporate / Retail Net Banking Bank
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {POPULAR_BANKS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setDepositBank(b)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                              depositBank === b
                                ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 text-center">
                        Direct instant 2FA routing via {depositBank} secure corporate banking.
                      </p>
                    </div>
                  )}

                  {depositMethod === 'neft' && (
                    <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs space-y-2.5">
                      <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                        <span className="font-bold text-blue-900">Virtual Escrow Beneficiary Details</span>
                        <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-black">
                          RTGS / NEFT 24x7
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Beneficiary Name:</span>
                          <span className="font-bold text-slate-900">KisanMitra Escrow Trustee Pvt Ltd</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Virtual Account No:</span>
                          <span className="font-mono font-bold text-blue-900">KMESCROW88920194</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">IFSC Code:</span>
                          <span className="font-mono font-bold text-slate-900">KMBA0001824</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Bank / Branch:</span>
                          <span className="font-bold text-slate-900">Reserve Agri Bank of India, HQ</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {depositMethod === 'card' && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          Card Number (RuPay / Visa / MasterCard)
                        </label>
                        <input
                          type="text"
                          placeholder="4111 •••• •••• 1234"
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={3}
                            className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Deposit */}
                  <button
                    type="submit"
                    disabled={depositProcessing || depositAmount <= 0}
                    className="w-full py-3.5 bg-teal-800 hover:bg-teal-700 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {depositProcessing
                        ? 'Processing Instant Escrow Deposit…'
                        : `Deposit ₹${depositAmount.toLocaleString('en-IN')} to Escrow Wallet`}
                    </span>
                  </button>

                </form>
              </div>
            )}

            {/* FARMER WITHDRAWAL FLOW */}
            {(isFarmer || isAdmin) && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Instant Farmer Bank Withdrawal</h2>
                      <p className="text-xs text-slate-500">
                        Transfer your cleared produce earnings directly to your verified bank account or UPI ID.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-black shrink-0">
                    IMPS / UPI 24x7 (0% Fee)
                  </span>
                </div>

                {withdrawSuccessData && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs text-emerald-950 animate-in fade-in">
                    <div className="flex items-center space-x-2 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Payout Dispatched — ₹{withdrawSuccessData.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-slate-600">
                      Destination: <span className="font-bold text-slate-900">{withdrawSuccessData.destination}</span>
                    </p>
                    <p className="text-slate-600">
                      Bank Clearing UTR: <span className="font-mono font-bold text-emerald-900">{withdrawSuccessData.utr}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setWithdrawSuccessData(null)}
                      className="text-xs text-emerald-800 font-black hover:underline"
                    >
                      + Make another withdrawal
                    </button>
                  </div>
                )}

                <form onSubmit={handleFarmerWithdrawal} className="space-y-6">
                  
                  {/* Withdrawable Balance Info Banner */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Available Withdrawable Balance</span>
                      <span className="text-2xl font-black text-emerald-950">
                        ₹{((user?.withdrawableBalance ?? user?.walletBalance) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount((user?.withdrawableBalance ?? user?.walletBalance) || 0)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      Withdraw All
                    </button>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Withdrawal Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-lg font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value) || 0)}
                        max={(user?.withdrawableBalance ?? user?.walletBalance) || 0}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-lg font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        min="1"
                        required
                      />
                    </div>

                    {/* Quick Preset Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[5000, 10000, 25000, 48500].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setWithdrawAmount(amt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            withdrawAmount === amt
                              ? 'bg-emerald-800 text-white border-emerald-800'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          ₹{amt.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Mode */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Select Payout Destination
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('bank_transfer')}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                          withdrawMethod === 'bank_transfer'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Landmark className="w-5 h-5 mb-2 text-emerald-700" />
                        <div>
                          <span className="text-xs font-bold block">Direct Bank Account (IMPS)</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {user?.bankDetails?.bankName || 'State Bank of India'} (A/C: ••••{(user?.bankDetails?.accountNumber || '6194').slice(-4)})
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('upi')}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                          withdrawMethod === 'upi'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <QrCode className="w-5 h-5 mb-2 text-emerald-700" />
                        <div>
                          <span className="text-xs font-bold block">Direct UPI Instant Transfer</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {user?.bankDetails?.upiId || (user?.phone ? `${user.phone}@sbi` : '9876543210@sbi')}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Destination Details Card with Edit Profile Shortcut */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">Current Linked Bank Information</span>
                      {onNavigateToProfile && (
                        <button
                          type="button"
                          onClick={onNavigateToProfile}
                          className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Edit Bank in Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Account Holder:</span>
                        <span className="font-bold">{user?.bankDetails?.accountHolderName || user?.name || 'Ramesh Patel'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Bank & Branch:</span>
                        <span className="font-bold">{user?.bankDetails?.bankName || 'SBI'} • {user?.bankDetails?.branchName || 'Guntur Branch'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Account Number:</span>
                        <span className="font-mono font-bold">{user?.bankDetails?.accountNumber || '30894726194'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                        <span className="font-mono font-bold uppercase">{user?.bankDetails?.ifscCode || 'SBIN0001248'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Withdrawal */}
                  <button
                    type="submit"
                    disabled={withdrawProcessing || withdrawAmount <= 0 || withdrawAmount > ((user?.withdrawableBalance ?? user?.walletBalance) || 0)}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>
                      {withdrawProcessing
                        ? 'Clearing Instant IMPS/UPI Payout…'
                        : `Withdraw ₹${withdrawAmount.toLocaleString('en-IN')} to Bank Account`}
                    </span>
                  </button>

                </form>
              </div>
            )}

          </div>

          {/* Right Column: Payment Method Standards, Security Vault, and Live Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Escrow Guarantee Trust Certificate */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">KisanMitra Escrow Trustee Guarantee</h3>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    RBI PSS ACT 2007 COMPLIANT
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                All buyer and farmer funds are safeguarded in an independent nodal escrow account. No third-party deductions, zero hidden commission, and automatic instant clearing upon produce acceptance.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>100% Guaranteed Payout to Farmers upon Buyer Quality Check</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>100% Refund Protection for Buyers on Defective Shipments</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Instant RTGS / IMPS / UPI 2.0 Real-Time Clearing 24x7</span>
                </div>
              </div>
            </div>

            {/* Supported Payment & Banking Methods */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Supported Clearing Rails</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  All Major Banks & UPI
                </span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <QrCode className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">Unified Payments Interface (UPI 2.0)</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      GPay, PhonePe, Paytm, BHIM, Cred, AmazonPay, and all bank UPI handles. Instant 0-second settlement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Landmark className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">Corporate & Retail Net Banking</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Supported for 50+ nationalized, commercial, and regional rural cooperative banks across India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Building2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-slate-900 block">NEFT / RTGS Virtual Escrow Accounts</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Dedicated virtual accounts for high-volume wholesale commodity transactions up to ₹50,00,000.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Profile Bank Details Shortcut */}
            <div className="bg-teal-50 border border-teal-200 rounded-3xl p-5 text-xs text-teal-950 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Landmark className="w-6 h-6 text-teal-700 shrink-0" />
                <div>
                  <span className="font-black block text-sm">Update Bank Details</span>
                  <span className="text-slate-600 text-[11px]">
                    Ensure your IFSC & Account Number are up to date for instant clearance.
                  </span>
                </div>
              </div>
              {onNavigateToProfile && (
                <button
                  type="button"
                  onClick={onNavigateToProfile}
                  className="px-3.5 py-2 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition shrink-0"
                >
                  My Profile
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ORDER ESCROW MILESTONES (4-STEP WORKFLOW)                          */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Orders List */}
          <div className={`space-y-4 ${selectedOrder ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-black uppercase text-slate-700">Active Escrow Contracts</span>
              <button
                onClick={fetchData}
                disabled={loading}
                className="text-xs text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Loading escrow contracts...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
                <CircleDollarSign className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Escrow Orders Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Accept an offer from Offers & Negotiations or create a buy/sell deal to initialize an escrow order.
                </p>
              </div>
            ) : (
              orders.map((ord) => {
                const step = ord.escrowStep || 'awaiting_deposit';
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`bg-white rounded-3xl p-5 border cursor-pointer transition ${
                      selectedOrder?.id === ord.id
                        ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {getLocalizedCropName(ord.cropName || ord.crop || 'Tomato', language)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{ord.orderId}</span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl mb-3 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Value:</span>
                        <span className="font-black text-teal-900">₹{(ord.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Parties:</span>
                        <span className="font-semibold truncate max-w-[170px]">{ord.farmerName} ➔ {ord.buyerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="font-bold text-slate-800">{ord.escrowStatus || ord.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                          step === 'released'
                            ? 'bg-emerald-100 text-emerald-900'
                            : step === 'awaiting_deposit'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {step.replace(/_/g, ' ')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-teal-700" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Order Escrow Flow */}
          {selectedOrder && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-extrabold text-slate-900 font-serif">Order #{selectedOrder.orderId}</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                      {selectedOrder.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedOrder.cropName || selectedOrder.crop} • {(selectedOrder.quantity || 0).toLocaleString('en-IN')} {selectedOrder.unit}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Escrow Amount</span>
                  <span className="text-2xl font-black text-teal-900">
                    ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 4-Step Visual Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                  Escrow Milestone Progress
                </span>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {ESCROW_STEPSCol.map((s, i) => {
                    const idx = stepIndex(selectedOrder);
                    const done = i < idx || (i === idx && selectedOrder.escrowStep === 'released');
                    const current = i === idx && selectedOrder.escrowStep !== 'released';
                    const Icon = s.icon;
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold ${
                            current
                              ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                              : done
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{s.label}</span>
                        </div>
                        {i < ESCROW_STEPSCol.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Status Card */}
              <div className="p-4 rounded-2xl border space-y-2 bg-slate-50/80 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Current Milestone State
                  </span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-950 font-black text-xs rounded-full">
                    {selectedOrder.escrowStatus || 'Awaiting Buyer Deposit'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {selectedOrder.trackingNotes || 'Order created with full escrow clearance protection.'}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Farmer Delivered</span>
                    <span className="font-bold">{selectedOrder.deliveryMarked ? 'Yes ✓' : 'No — pending'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Buyer Quality Verified</span>
                    <span className="font-bold">{selectedOrder.qualityVerified ? 'Yes ✓' : 'No — pending'}</span>
                  </div>
                </div>
              </div>

              {/* Role Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedOrder.escrowStep !== 'released' && isActionAllowed(selectedOrder, 'deposit') && (
                  <button
                    onClick={() => handleOpenOrderPaymentModal(selectedOrder)}
                    disabled={actionLoading}
                    className="px-4 py-3 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CircleDollarSign className="w-4 h-4" /> Deposit Funds into Escrow
                  </button>
                )}

                {isActionAllowed(selectedOrder, 'mark_delivered') && (
                  <button
                    onClick={() => handleEscrowAction(selectedOrder, 'mark_delivered')}
                    disabled={actionLoading}
                    className="px-4 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" /> Mark Lot as Delivered
                  </button>
                )}

                {isActionAllowed(selectedOrder, 'verify_quality') && (
                  <button
                    onClick={() => handleEscrowAction(selectedOrder, 'verify_quality')}
                    disabled={actionLoading}
                    className="px-4 py-3 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BadgeCheck className="w-4 h-4" /> Verify Quality & Release Payment
                  </button>
                )}

                {selectedOrder.escrowStep === 'farmer_delivered' && !isBuyer && !isAdmin && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Waiting for Buyer Quality Inspection
                  </div>
                )}

                {selectedOrder.escrowStep === 'released' && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 sm:col-span-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✅ PAYMENT RELEASED — ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')} credited to farmer's linked account.</span>
                  </div>
                )}
              </div>

              {openChatModal && (
                <button
                  onClick={() => openChatModal(selectedOrder.id)}
                  className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Open Order Negotiation Chat Room
                </button>
              )}

              {/* Admin demo controller */}
              {isAdmin && (
                <div className="p-4 rounded-2xl border border-purple-300 bg-purple-50/60 space-y-3">
                  <div className="flex items-center gap-2 font-black text-purple-950 text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Admin Demo Simulation Controller
                  </div>
                  <p className="text-xs text-purple-900">
                    Instantly simulate any milestone step for demonstration testing:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => handleEscrowAction(selectedOrder, 'deposit')}
                      disabled={actionLoading || selectedOrder.paymentStatus !== 'pending'}
                      className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl disabled:opacity-40"
                    >
                      1. Buyer Deposit
                    </button>
                    <button
                      onClick={() => handleEscrowAction(selectedOrder, 'mark_delivered')}
                      disabled={actionLoading || selectedOrder.escrowStep !== 'funds_locked'}
                      className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl disabled:opacity-40"
                    >
                      2. Farmer Delivery
                    </button>
                    <button
                      onClick={() => handleEscrowAction(selectedOrder, 'verify_quality')}
                      disabled={actionLoading || selectedOrder.escrowStep !== 'farmer_delivered'}
                      className="px-3 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl disabled:opacity-40"
                    >
                      3. Quality Approval
                    </button>
                    <button
                      onClick={() => handleEscrowAction(selectedOrder, 'release')}
                      disabled={actionLoading || selectedOrder.escrowStep === 'released'}
                      className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl disabled:opacity-40"
                    >
                      4. Release Payout
                    </button>
                  </div>
                </div>
              )}

              {/* Escrow History Log */}
              {selectedOrder.escrowHistory?.length ? (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Milestone Event History
                  </h3>
                  <div className="space-y-1.5">
                    {selectedOrder.escrowHistory.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>
                          {h.label} <span className="text-slate-400">— {new Date(h.at).toLocaleString('en-IN')}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FINANCIAL LEDGER & TRANSACTION HISTORY                             */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Wallet & Escrow Transaction Ledger</h2>
              <p className="text-xs text-slate-500">
                Complete audit trail of all deposits, escrow locks, releases, and bank withdrawals.
              </p>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'deposit', label: 'Deposits' },
                { id: 'withdrawal', label: 'Withdrawals' },
                { id: 'escrow_hold', label: 'Escrow Holds' },
                { id: 'payout_received', label: 'Payouts' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTxFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    txFilter === f.id
                      ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger Table / Cards */}
          {txLoading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Loading ledger records...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No transactions found for this filter</p>
              <p className="text-xs text-slate-400">
                Make a deposit or initiate an order escrow transaction to see records here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'payout_received' || tx.type === 'refund';
                return (
                  <div
                    key={tx.id}
                    className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                          isCredit
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-slate-900">{tx.description}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              tx.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>📅 {new Date(tx.createdAt).toLocaleString('en-IN')}</span>
                          <span>•</span>
                          <span className="font-mono">Ref: {tx.referenceId || tx.id}</span>
                          <span>•</span>
                          <span className="uppercase font-semibold">{tx.method.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span
                        className={`text-base font-black ${
                          isCredit ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {isCredit ? 'Credit / Inflow' : 'Disbursement / Lock'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER SPECIFIC DEPOSIT MODAL                                              */}
      {/* ========================================================================= */}
      {payModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Lock Funds in Escrow Vault</h3>
                  <p className="text-xs text-slate-500">Order #{payModalOrder.orderId} • Guaranteed Milestone Settlement</p>
                </div>
              </div>
              <button onClick={() => setPayModalOrder(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Produce Lot:</span>
                <span className="font-extrabold text-slate-900">
                  {payModalOrder.cropName || payModalOrder.crop} ({payModalOrder.quantity} {payModalOrder.unit})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Agreed Contract Value:</span>
                <span className="font-bold text-slate-700">₹{(payModalOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-extrabold text-slate-800">Payable Escrow Deposit Amount (₹):</label>
                  <button
                    type="button"
                    onClick={() => setCustomPayableAmount(payModalOrder.totalAmount || 0)}
                    className="text-[10px] text-teal-700 font-bold hover:underline"
                  >
                    Reset to contract price
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    value={customPayableAmount}
                    onChange={(e) => setCustomPayableAmount(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-teal-400 rounded-xl text-sm font-black text-teal-950 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPayModalMethod('upi')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  payModalMethod === 'upi' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                UPI / QR
              </button>
              <button
                type="button"
                onClick={() => setPayModalMethod('netbanking')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  payModalMethod === 'netbanking' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Net Banking
              </button>
              <button
                type="button"
                onClick={() => setPayModalMethod('neft')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  payModalMethod === 'neft' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                NEFT/RTGS
              </button>
              <button
                type="button"
                onClick={() => setPayModalMethod('card')}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  payModalMethod === 'card' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Card
              </button>
            </div>

            {orderPaySuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-black">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-base font-black text-emerald-950">
                  ₹{customPayableAmount.toLocaleString('en-IN')} Secured in Escrow!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Funds will be safely held by the KisanMitra Escrow Trustee until farmer delivers and quality check completes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {payModalMethod === 'upi' && (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-center space-y-3">
                    <div className="w-28 h-28 bg-white p-2 rounded-xl border border-emerald-300 mx-auto shadow-xs flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-slate-900 rounded-lg p-1.5 flex flex-wrap gap-0.5 justify-center items-center">
                        <div className="w-7 h-7 bg-white rounded-xs p-0.5"><div className="w-full h-full bg-slate-900 rounded-xs"></div></div>
                        <div className="w-7 h-7 bg-white rounded-xs p-0.5"><div className="w-full h-full bg-slate-900 rounded-xs"></div></div>
                        <div className="w-7 h-7 bg-white rounded-xs p-0.5"><div className="w-full h-full bg-slate-900 rounded-xs"></div></div>
                        <div className="w-7 h-7 bg-white rounded-xs p-0.5"><div className="w-full h-full bg-teal-600 rounded-xs"></div></div>
                      </div>
                      <span className="text-[8px] font-black text-slate-700 mt-1">SCAN WITH UPI APP</span>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-slate-600">
                      <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">GPay</span>
                      <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">PhonePe</span>
                      <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">Paytm</span>
                      <span className="px-2 py-1 bg-white rounded-lg border border-slate-200">BHIM</span>
                    </div>
                  </div>
                )}

                {payModalMethod === 'netbanking' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <span className="font-bold text-slate-800 block">Bank Net Banking Clearing:</span>
                    <p className="text-slate-600">Direct debit from linked HDFC Corporate Account.</p>
                  </div>
                )}

                {payModalMethod === 'neft' && (
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs space-y-1.5">
                    <div className="flex justify-between"><span className="text-slate-600">Virtual Escrow:</span><span className="font-mono font-bold text-blue-900">KMESCROW88920194</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">IFSC Code:</span><span className="font-mono font-bold text-slate-900">KMBA0001824</span></div>
                  </div>
                )}

                {payModalMethod === 'card' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Card No.</label>
                    <input type="text" placeholder="4111 •••• •••• 1234" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs" />
                  </div>
                )}

                <button
                  onClick={handleExecuteOrderPay}
                  disabled={orderPayProcessing || customPayableAmount <= 0}
                  className="w-full py-3.5 bg-teal-800 hover:bg-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {orderPayProcessing
                      ? 'Securely Locking in Escrow…'
                      : `Lock ₹${customPayableAmount.toLocaleString('en-IN')} in Escrow`}
                  </span>
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  🔒 Bank-grade Escrow Sandbox. Funds safely held until inspection criteria are met.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
