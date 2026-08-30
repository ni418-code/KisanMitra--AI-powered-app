import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { SocketProvider } from './context/SocketContext.tsx';
import { Sidebar, AppView } from './components/Sidebar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { FarmerDashboard } from './components/FarmerDashboard.tsx';
import { BuyerDashboard } from './components/BuyerDashboard.tsx';
import { MarketPricesView } from './components/MarketPricesView.tsx';
import { MSPComparisonView } from './components/MSPComparisonView.tsx';
import { ProduceManagementView } from './components/ProduceManagementView.tsx';
import { BuyerRequirementsView } from './components/BuyerRequirementsView.tsx';
import { SmartMatchingView } from './components/SmartMatchingView.tsx';
import { OffersNegotiationView } from './components/OffersNegotiationView.tsx';
import { OrdersManagementView } from './components/OrdersManagementView.tsx';
import { LogisticsAndStorageView } from './components/LogisticsAndStorageView.tsx';
import { EscrowManagementView } from './components/EscrowManagementView.tsx';
import { ProfitAndSaleWindowView } from './components/ProfitAndSaleWindowView.tsx';
import { RealtimeChatView } from './components/RealtimeChatView.tsx';
import { AIAssistantView } from './components/AIAssistantView.tsx';
import { PriceAlertsView } from './components/PriceAlertsView.tsx';
import { GrievancesView } from './components/GrievancesView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AdminPanelView } from './components/AdminPanelView.tsx';
import { CropDetailModal } from './components/CropDetailModal.tsx';
import { FloatingAIAssistant } from './components/FloatingAIAssistant.tsx';
import { LogisticsStatusBanner } from './components/LogisticsStatusBanner.tsx';
import { LanguageCode } from './services/translations.ts';
import {
  Menu,
  X,
  Search,
  Globe,
  Bell,
  Sparkles,
  Wheat,
  Building2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, language, setLanguage, t, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'farmer' | 'buyer'>('farmer');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [selectedCropModal, setSelectedCropModal] = useState<string | null>(null);
  const [escrowInitialOrderId, setEscrowInitialOrderId] = useState<string | null>(null);
  const [chatConvId, setChatConvId] = useState<string | null>(null);
  const [isAddProduceModalOpen, setIsAddProduceModalOpen] = useState(false);
  const [isPostReqModalOpen, setIsPostReqModalOpen] = useState(false);

  const isFarmer = user?.role === 'farmer';
  const isBuyer = user?.role === 'buyer';

  const handleOpenAuth = (role: 'farmer' | 'buyer' = 'farmer', mode: 'login' | 'register' = 'login') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChatModal = (convId?: string) => {
    if (convId) setChatConvId(convId);
    setCurrentView('chat');
  };

  const handleCropModalAction = (action: 'sell' | 'buy', crop: string) => {
    if (action === 'sell') {
      setCurrentView('produce');
      setIsAddProduceModalOpen(true);
    } else {
      setCurrentView('buyer_requests');
      setIsPostReqModalOpen(true);
    }
  };

  const navigateTo = (view: AppView) => {
    // If not logged in and requesting dashboard or profile or private actions, open auth
    if (!user && (view === 'dashboard' || view === 'produce' || view === 'buyer_requests' || view === 'deals' || view === 'offers' || view === 'orders' || view === 'escrow' || view === 'chat' || view === 'admin_panel' || view === 'profile')) {
      handleOpenAuth(authModalRole, 'login');
      return;
    }
    // Farmer-only pages should never be opened by a buyer
    if (isBuyer && (view === 'msp_table' || view === 'logistics_storage' || view === 'profit_calculator')) {
      setCurrentView('dashboard');
      setIsSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-800 flex font-sans antialiased">
      
      {/* If on Landing Page view, show full width landing page experience with floating AI and full nav */}
      {currentView === 'landing' ? (
        <div className="w-full flex flex-col min-h-screen">
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onExploreMandi={() => setCurrentView('market_prices')}
          />
          {/* Floating AI Assistant at bottom-right */}
          <FloatingAIAssistant onNavigateToView={(v) => setCurrentView(v as AppView)} />
        </div>
      ) : (
        /* Authenticated / Platform Workspace Layout with Left-Side Navigation */
        <div className="flex w-full min-h-screen">
          
          {/* Desktop Left-Side Sidebar Navigation */}
          <div className="hidden md:block">
            <Sidebar
              currentView={currentView}
              onNavigate={navigateTo}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile Sidebar Drawer */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs">
              <div className="w-72 bg-slate-900 h-full shadow-2xl relative animate-in slide-in-from-left duration-200">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
                <Sidebar
                  currentView={currentView}
                  onNavigate={navigateTo}
                  onOpenAuth={handleOpenAuth}
                  onLogout={handleLogout}
                />
              </div>
              <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Top Workspace Bar */}
            <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 shadow-2xs h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
              
              <div className="flex items-center space-x-3">
                {/* Mobile Hamburger */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Open Navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Breadcrumb / Page Title */}
                <div className="flex items-center space-x-2">
                  <span
                    onClick={() => navigateTo('dashboard')}
                    className="font-black text-slate-900 text-sm sm:text-base cursor-pointer hover:text-emerald-800 transition"
                  >
                    KisanMitra
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
                  <span className="text-xs sm:text-sm font-bold text-emerald-800 hidden sm:inline capitalize">
                    {currentView.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                
                {/* Quick Mandi Trigger */}
                <button
                  onClick={() => navigateTo('market_prices')}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Live Mandis</span>
                </button>

                {/* Active User Role Badge */}
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1 border border-slate-200">
                  <span>{isFarmer ? '🌾 Farmer / FPO' : isBuyer ? '🏢 Buyer / Processor' : '🔐 Admin / System'}</span>
                </div>

                {/* Language Picker */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="ml">മലയാളം</option>
                  <option value="mr">मराठी</option>
                </select>

                {/* Price Alerts */}
                <button
                  onClick={() => navigateTo('alerts')}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer relative"
                  title="Price Alerts"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                </button>

                {/* User Avatar */}
                <div
                  onClick={() => navigateTo('profile')}
                  className="w-8 h-8 rounded-xl bg-emerald-800 text-white font-black text-xs flex items-center justify-center cursor-pointer shadow-xs"
                  title="View Profile"
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>

              </div>
            </header>

            {/* Dynamic View Container */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {currentView === 'dashboard' && (
                isBuyer ? (
                  <BuyerDashboard
                    setCurrentTab={(tab) => {
                      if (tab === 'buyerRequests') navigateTo('buyer_requests');
                      else if (tab === 'findProduce') navigateTo('buyer_requests');
                      else if (tab === 'marketPrices') navigateTo('market_prices');
                      else if (tab === 'orders') navigateTo('orders');
                      else if (tab === 'offers') navigateTo('offers');
                      else if (tab === 'messages') navigateTo('chat');
                    }}
                    openPostRequirementModal={() => {
                      navigateTo('buyer_requests');
                      setIsPostReqModalOpen(true);
                    }}
                    openChatModal={handleOpenChatModal}
                  />
                ) : (
                  <FarmerDashboard
                    setCurrentTab={(tab) => {
                      if (tab === 'myProduce') navigateTo('produce');
                      else if (tab === 'marketPrices') navigateTo('market_prices');
                      else if (tab === 'aiAssistant' || tab === 'ai_assistant') navigateTo('ai_assistant');
                      else if (tab === 'buyerRequests' || tab === 'buyer_requests') navigateTo('buyer_requests');
                      else if (tab === 'orders') navigateTo('orders');
                      else if (tab === 'offers') navigateTo('offers');
                      else if (tab === 'messages') navigateTo('chat');
                    }}
                    openAddProduceModal={() => {
                      navigateTo('produce');
                      setIsAddProduceModalOpen(true);
                    }}
                    openCropDetailModal={(crop) => setSelectedCropModal(crop)}
                  />
                )
              )}

              {currentView === 'market_prices' && (
                <MarketPricesView
                  openCropDetailModal={(crop) => setSelectedCropModal(crop)}
                />
              )}

              {currentView === 'msp_table' && <MSPComparisonView />}

              {currentView === 'produce' && (
                <ProduceManagementView
                  isAddModalOpen={isAddProduceModalOpen}
                  setIsAddModalOpen={setIsAddProduceModalOpen}
                  openChatModal={handleOpenChatModal}
                />
              )}

              {currentView === 'buyer_requests' && (
                <BuyerRequirementsView
                  isPostModalOpen={isPostReqModalOpen}
                  setIsPostModalOpen={setIsPostReqModalOpen}
                  openChatModal={handleOpenChatModal}
                />
              )}

              {currentView === 'deals' && (
                <SmartMatchingView
                  openChatModal={handleOpenChatModal}
                  onNavigateToOffers={() => navigateTo('offers')}
                />
              )}

              {currentView === 'offers' && (
                <OffersNegotiationView
                  openChatModal={handleOpenChatModal}
                  setCurrentTab={(tab) => {
                    if (tab === 'orders') navigateTo('orders');
                  }}
                />
              )}

              {currentView === 'orders' && (
                <OrdersManagementView
                  openChatModal={handleOpenChatModal}
                  onOpenEscrow={(orderId) => {
                    setEscrowInitialOrderId(orderId || null);
                    navigateTo('escrow');
                  }}
                />
              )}

              {currentView === 'escrow' && (
                <EscrowManagementView
                  openChatModal={handleOpenChatModal}
                  initialOrderId={escrowInitialOrderId}
                />
              )}

              {currentView === 'logistics_storage' && <LogisticsAndStorageView />}

              {currentView === 'profit_calculator' && <ProfitAndSaleWindowView />}

              {currentView === 'chat' && (
                <RealtimeChatView initialConversationId={chatConvId} />
              )}

              {currentView === 'alerts' && <PriceAlertsView />}

              {currentView === 'disputes' && <GrievancesView />}

              {currentView === 'ai_assistant' && <AIAssistantView />}

              {currentView === 'admin_panel' && <AdminPanelView />}

              {currentView === 'profile' && <ProfileView />}
            </main>

          </div>

          {/* Persistent Floating AI Assistant in the bottom right corner */}
          <FloatingAIAssistant onNavigateToView={navigateTo} />

          {/* Persistent logistics/storage tracker (stays until stored/ride completed) */}
          <LogisticsStatusBanner onGoToLogistics={() => navigateTo('logistics_storage')} />

        </div>
      )}

      {/* Global Modals */}
      {selectedCropModal && (
        <CropDetailModal
          cropName={selectedCropModal}
          onClose={() => setSelectedCropModal(null)}
          onSelectAction={handleCropModalAction}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialRole={authModalRole}
        initialMode={authModalMode}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
