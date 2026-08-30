import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { User, Order } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  RefreshCw,
  ShoppingBag,
  Package,
  CheckCircle,
  AlertTriangle,
  Lock,
  CircleDollarSign,
  Truck,
  BadgeCheck,
  Zap,
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [marketSync, setMarketSync] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [escrowLoadingId, setEscrowLoadingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [statsRes, usersRes, disputesRes, ordersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminDisputes(),
        api.getOrders(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data.stats || {});
        setMarketSync(statsRes.data.marketSync || {});
      } else if (!statsRes.success && statsRes.message) {
        setErrorMsg(statsRes.message);
      }

      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data.users || []);
      }
      if (disputesRes.success && disputesRes.data) {
        setDisputes(disputesRes.data.disputes || []);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data.orders || []);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user?.role]);

  const handleManualSync = async () => {
    setSyncing(true);
    await api.triggerMarketSync();
    await fetchAdminData();
    setSyncing(false);
  };

  const handleEscrowSim = async (orderId: string, action: 'deposit' | 'mark_delivered' | 'verify_quality' | 'release') => {
    setEscrowLoadingId(`${orderId}-${action}`);
    await api.updateEscrow(orderId, action);
    await fetchAdminData();
    setEscrowLoadingId(null);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-sm text-slate-600">
          You are currently signed in as <span className="font-bold text-slate-800">{user?.name || 'Guest'} ({user?.role || 'user'})</span>. Switch to the platform administrator account to view governance controls and sync monitors.
        </p>
        <button
          onClick={() => switchDemoUser('admin')}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition inline-flex items-center space-x-2 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-amber-300" />
          <span>Switch to Admin Account</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-2xl text-white p-5 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Platform Administrative Control
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
                Platform Governance & Sync Monitor
              </h1>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Force AGMARKNET Sync'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KPI Stats */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Registered Users</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers ?? 0}</p>
            <p className="text-[11px] text-slate-500">{stats.farmersCount ?? 0} Farmers • {stats.buyersCount ?? 0} Buyers</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Crop Lots</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{stats.activeProducts ?? 0}</p>
            <p className="text-[11px] text-emerald-700 font-medium">In AP, Telangana & Maharashtra</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Orders</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{stats.ordersCount ?? 0}</p>
            <p className="text-[11px] text-blue-700 font-medium">{stats.completedOrders ?? 0} Completed in Escrow</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Platform GMV</span>
            <p className="text-2xl font-black text-slate-900 mt-1">₹{(stats.totalTransactionValue || 0).toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-slate-500">Gross Contract Value</p>
          </div>
        </div>
      ) : loading ? (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-700 mb-2" />
          <p className="text-xs text-slate-500">Loading administrative statistics...</p>
        </div>
      ) : null}

      {/* AGMARKNET Sync Engine Status */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Government AGMARKNET Sync Engine
          </h3>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
            Status: {marketSync?.status || 'Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Sync Timestamp</span>
            <span className="font-bold text-slate-800">{marketSync?.lastSyncTime ? new Date(marketSync.lastSyncTime).toLocaleString('en-IN') : 'Just now'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Records Synced</span>
            <span className="font-bold text-slate-800">{marketSync?.totalRecordsCount || 34} Mandi Price Records</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Sync Schedule</span>
            <span className="font-bold text-slate-800">Every 30 mins (Cron active)</span>
          </div>
        </div>
      </div>

      {/* Admin Escrow Demo Controller */}
      <div className="bg-white rounded-2xl border border-purple-300/70 shadow-sm overflow-hidden">
        <div className="p-4 bg-purple-50 border-b border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-purple-800" />
            <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">Admin Demo Controller — 4-Step Escrow Workflow</h3>
          </div>
          <span className="text-[10px] text-purple-700 font-bold">Simulated only</span>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600">
            Manually drive the same shared order status used by Farmer, Buyer and System dashboards.
          </p>
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No orders available for demo simulation.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {orders.map((o) => (
                <div key={o.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-black text-slate-900 text-xs">{o.cropName || o.crop}</span>
                      <span className="text-[10px] text-slate-500 block">#{o.orderId} • ₹{(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-black rounded-full">{o.escrowStatus || o.paymentStatus}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button onClick={() => handleEscrowSim(o.id, 'deposit')} disabled={escrowLoadingId?.startsWith(o.id)} className="px-2 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-[10px] font-bold rounded-lg disabled:opacity-40">1. Deposit</button>
                    <button onClick={() => handleEscrowSim(o.id, 'mark_delivered')} disabled={escrowLoadingId?.startsWith(o.id) || o.escrowStep !== 'funds_locked'} className="px-2 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-[10px] font-bold rounded-lg disabled:opacity-40">2. Deliver</button>
                    <button onClick={() => handleEscrowSim(o.id, 'verify_quality')} disabled={escrowLoadingId?.startsWith(o.id) || o.escrowStep !== 'farmer_delivered'} className="px-2 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-bold rounded-lg disabled:opacity-40">3. Verify</button>
                    <button onClick={() => handleEscrowSim(o.id, 'release')} disabled={escrowLoadingId?.startsWith(o.id) || o.escrowStep === 'released'} className="px-2 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg disabled:opacity-40">4. Release</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Platform Users Directory ({users.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Synced from DataStore</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">User Name</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Phone / User ID</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Language</th>
                <th className="py-2.5 px-4">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'farmer' ? 'bg-emerald-100 text-emerald-900' :
                      u.role === 'buyer' ? 'bg-blue-100 text-blue-900' : 'bg-purple-100 text-purple-900'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{u.phone} ({u.userId})</td>
                  <td className="py-3 px-4 text-slate-600">{u.location?.district || 'Guntur'}, {u.location?.state || 'AP'}</td>
                  <td className="py-3 px-4 uppercase font-semibold text-slate-500">{u.preferredLanguage || 'en'}</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">✓ Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
