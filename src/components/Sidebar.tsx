import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { LanguageCode } from '../services/translations.ts';
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  Package,
  FileSpreadsheet,
  Handshake,
  Tag,
  ShoppingBag,
  Truck,
  Warehouse,
  Calculator,
  MessageSquare,
  BellRing,
  Bot,
  AlertOctagon,
  User as UserIcon,
  LogOut,
  Wheat,
  Building2,
  ChevronRight,
  Sparkles,
  Globe,
  Home,
} from 'lucide-react';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'market_prices'
  | 'msp_table'
  | 'produce'
  | 'buyer_requests'
  | 'deals'
  | 'offers'
  | 'orders'
  | 'logistics_storage'
  | 'profit_calculator'
  | 'chat'
  | 'alerts'
  | 'disputes'
  | 'ai_assistant'
  | 'profile';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAuth?: (role?: 'farmer' | 'buyer', mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed = false,
  onOpenAuth,
  onLogout,
}) => {
  const { user, language, setLanguage, t, logout } = useAuth();

  const isFarmer = user?.role === 'farmer';
  const isBuyer = user?.role === 'buyer';

  const navItems = [
    {
      id: 'dashboard' as AppView,
      label: t.dashboard,
      icon: LayoutDashboard,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'market_prices' as AppView,
      label: t.marketPrices,
      icon: TrendingUp,
      roles: ['farmer', 'buyer'],
      badge: 'Live',
    },
    {
      id: 'msp_table' as AppView,
      label: t.mspTable,
      icon: Scale,
      roles: ['farmer', 'buyer'],
    },
    {
      id: isFarmer ? ('produce' as AppView) : ('buyer_requests' as AppView),
      label: isFarmer ? t.myProduce : t.buyerRequests,
      icon: isFarmer ? Package : FileSpreadsheet,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'deals' as AppView,
      label: t.deals,
      icon: Handshake,
      roles: ['farmer', 'buyer'],
      badge: 'Match',
    },
    {
      id: 'offers' as AppView,
      label: t.offers,
      icon: Tag,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'orders' as AppView,
      label: t.orders,
      icon: ShoppingBag,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'logistics_storage' as AppView,
      label: `${t.logistics} & Storage`,
      icon: Truck,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'profit_calculator' as AppView,
      label: t.profitCalculator,
      icon: Calculator,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'chat' as AppView,
      label: t.messages,
      icon: MessageSquare,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'alerts' as AppView,
      label: t.priceAlerts,
      icon: BellRing,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'ai_assistant' as AppView,
      label: t.aiAssistant,
      icon: Bot,
      roles: ['farmer', 'buyer'],
      highlight: true,
    },
    {
      id: 'disputes' as AppView,
      label: t.disputes,
      icon: AlertOctagon,
      roles: ['farmer', 'buyer'],
    },
    {
      id: 'profile' as AppView,
      label: t.profile,
      icon: UserIcon,
      roles: ['farmer', 'buyer'],
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 z-30 transition-all duration-200 border-r border-slate-800 shrink-0 ${
        collapsed ? 'w-20' : 'w-64 lg:w-72'
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Wheat className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black text-white tracking-tight">
                    Kisan<span className="text-emerald-400">Mitra</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 text-[9px] font-black uppercase">
                    SIH
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Agri Commerce Engine</p>
              </div>
            )}
          </div>
        </div>

        {/* User Mini Profile / Active Role Card */}
        {!collapsed && user && (
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isFarmer ? 'bg-emerald-800 text-emerald-100' : 'bg-blue-800 text-blue-100'
                  }`}
                >
                  {isFarmer ? <Wheat className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-white text-xs truncate">{user.name || 'User'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isFarmer ? '🌾 Farmer / FPO' : '🏢 Buyer / Processor'} • {user.location?.district || 'Guntur'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Landing / Home Link */}
          <button
            onClick={() => onNavigate('landing')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              currentView === 'landing'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4 text-slate-400 shrink-0" />
            {!collapsed && <span>Home / Landing Page</span>}
          </button>

          <div className="my-1.5 border-t border-slate-800/60" />

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white font-bold shadow-md shadow-emerald-950/40'
                    : item.highlight
                    ? 'text-amber-300 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-900/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-900 text-emerald-100'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Controls: Language & Sign out */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
        
        {/* Language Selection */}
        {!collapsed && (
          <div className="flex items-center justify-between text-xs px-2 py-1 bg-slate-800/60 rounded-xl">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
              <Globe className="w-3.5 h-3.5" />
              <span>Language:</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-emerald-400 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (Hindi)</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
              <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
              <option value="ml" className="bg-slate-900 text-white">മലയാളം (Malayalam)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (Marathi)</option>
            </select>
          </div>
        )}

        {/* User Account / Log Out */}
        <div className="flex items-center justify-between px-2 pt-1">
          {user ? (
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else logout();
              }}
              className="flex items-center space-x-2 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition w-full py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!collapsed && <span>{t.logout}</span>}
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth?.(undefined, 'login')}
              className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer transition w-full py-1"
            >
              <UserIcon className="w-3.5 h-3.5" />
              {!collapsed && <span>{t.login}</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
