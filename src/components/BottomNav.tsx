import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  Award,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openChatModal?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, openChatModal }) => {
  const { user, t } = useAuth();
  const isFarmer = user?.role === 'farmer';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
      
      {/* Home / Dashboard */}
      <button
        onClick={() => setCurrentTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
          currentTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{t.dashboard}</span>
      </button>

      {/* Market Prices */}
      <button
        onClick={() => setCurrentTab('marketPrices')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
          currentTab === 'marketPrices' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <TrendingUp className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{t.marketPrices}</span>
      </button>

      {/* Produce / Requirements */}
      <button
        onClick={() => setCurrentTab(isFarmer ? 'myProduce' : 'buyerRequirements')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
          currentTab === (isFarmer ? 'myProduce' : 'buyerRequirements') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Boxes className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{isFarmer ? t.myProduce : t.postRequirement}</span>
      </button>

      {/* Orders */}
      <button
        onClick={() => setCurrentTab('orders')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
          currentTab === 'orders' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{t.orders}</span>
      </button>

      {/* AI Assistant */}
      <button
        onClick={() => setCurrentTab('aiAssistant')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
          currentTab === 'aiAssistant' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Sparkles className="w-5 h-5 mb-0.5 text-amber-500" />
        <span className="text-[10px]">AI Mitra</span>
      </button>

      {/* Chat */}
      <button
        onClick={() => (openChatModal ? openChatModal() : setCurrentTab('messages'))}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
          currentTab === 'messages' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <MessageSquare className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">{t.messages}</span>
      </button>

    </div>
  );
};
