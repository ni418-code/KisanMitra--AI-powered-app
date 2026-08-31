import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { api } from '../services/api.ts';
import { NotificationItem } from '../types/index.ts';
import { Bell, CheckCheck, Info, MessageSquare, Package, Tag, TrendingUp, Truck } from 'lucide-react';

const TYPE_ICON: Record<NotificationItem['type'], React.ElementType> = {
  request: Package,
  offer: Tag,
  order: Truck,
  price_alert: TrendingUp,
  chat: MessageSquare,
  system: Info,
};

const TYPE_COLOR: Record<NotificationItem['type'], string> = {
  request: 'bg-emerald-50 text-emerald-700',
  offer: 'bg-amber-50 text-amber-700',
  order: 'bg-blue-50 text-blue-700',
  price_alert: 'bg-rose-50 text-rose-700',
  chat: 'bg-violet-50 text-violet-700',
  system: 'bg-slate-100 text-slate-600',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Live notification centre. Polls every 30s and updates instantly whenever the
 * server pushes a `notification` event over Socket.IO.
 */
export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const res = await api.getNotifications();
    if (res.success && res.data) {
      setItems(res.data.notifications || []);
      setUnread(res.data.unreadCount || 0);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Poll as a fallback for environments where the websocket is unavailable.
  useEffect(() => {
    if (!user) return;
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [user, load]);

  // Real-time push from the server.
  useEffect(() => {
    if (!socket) return;
    const onNotification = (notif: NotificationItem) => {
      if (!notif || (user && notif.userId !== user.id)) return;
      setItems((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)]);
      setUnread((prev) => prev + 1);
    };
    socket.on('notification', onNotification);
    return () => {
      socket.off('notification', onNotification);
    };
  }, [socket, user]);

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  const markAllRead = async () => {
    const pending = items.filter((n) => !n.isRead);
    await Promise.all(pending.map((n) => api.markNotificationRead(n.id)));
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer relative"
        title="Notifications"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-slate-900">Notifications</p>
              <p className="text-[10px] text-slate-500">{unread > 0 ? `${unread} unread` : 'All caught up'}</p>
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No notifications yet</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  New offers, orders, messages and price alerts appear here.
                </p>
              </div>
            ) : (
              items.slice(0, 25).map((n) => {
                const Icon = TYPE_ICON[n.type] || Info;
                return (
                  <div key={n.id} className={`px-4 py-3 flex gap-3 ${n.isRead ? '' : 'bg-emerald-50/40'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLOR[n.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
