import { User, MarketPrice, MSPData, Product, BuyerRequest, MatchResult, Offer, Order, Conversation, NotificationItem, PriceAlert, WalletTransaction } from '../types/index.ts';

// Same-origin by default (Render web deploy). For the Capacitor Android APK, set
// VITE_API_BASE_URL to the deployed backend URL so the app can reach the API.
const BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string) || '/api').replace(/\/+$/, '');

function getAuthToken(): string | null {
  return localStorage.getItem('km_auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; code?: string }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }

    // Handle non-JSON response gracefully (e.g. 401/403/404 HTML fallback)
    const text = await res.text();
    return {
      success: false,
      message: res.statusText || 'Server responded with non-JSON format',
      code: `HTTP_${res.status}`,
    };
  } catch (err: any) {
    console.error(`[API Request Error] ${endpoint}:`, err);
    return {
      success: false,
      message: err.message || 'Network communication error with Kisan Mitra server.',
      code: 'NETWORK_ERROR',
    };
  }
}

export const api = {
  // Auth
  sendOTP: (phone: string, role?: string) =>
    request<{ phone: string; expiresInSeconds: number; demoCode: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, role }),
    }),

  verifyOTP: (params: { phone: string; otp: string; role?: string; name?: string; location?: any; preferredLanguage?: string; preferredCrops?: string[] }) =>
    request<{ token: string; user: User }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  demoLogin: (role: 'farmer' | 'buyer' | 'admin') =>
    request<{ token: string; user: User }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  updateProfile: (updates: Partial<User>) =>
    request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Wallet & Banking
  getWalletTransactions: () =>
    request<{
      transactions: WalletTransaction[];
      total: number;
      walletBalance: number;
      withdrawableBalance: number;
      escrowLockedBalance: number;
    }>('/wallet/transactions'),

  depositWallet: (amount: number, method: string, referenceNote?: string) =>
    request<{ user: User; transaction: WalletTransaction }>('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, method, referenceNote }),
    }),

  withdrawWallet: (amount: number, method: string, payoutDetails?: any) =>
    request<{ user: User; transaction: WalletTransaction; utr: string }>('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, method, payoutDetails }),
    }),

  // Market Prices & Trends
  getMarketPrices: (filters?: { crop?: string; state?: string; district?: string; market?: string; category?: string; search?: string; sortBy?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'All') params.append(k, v);
      });
    }
    return request<{ prices: MarketPrice[]; total: number; source: string; lastUpdated: string; syncStatus: any }>(`/markets/prices?${params.toString()}`);
  },

  getCropDetails: (cropName: string, district?: string) =>
    request<any>(`/markets/crops/${encodeURIComponent(cropName)}${district ? `?district=${encodeURIComponent(district)}` : ''}`),

  getMSP: (season?: string, search?: string) => {
    const params = new URLSearchParams();
    if (season && season !== 'All') params.append('season', season);
    if (search) params.append('search', search);
    return request<{ mspList: MSPData[]; total: number; source: string; marketingYear: string }>(`/markets/msp?${params.toString()}`);
  },

  getNetReturn: (params: { cropName: string; quantityKg: number; farmerDistrict?: string; farmerState?: string }) => {
    const query = new URLSearchParams({
      cropName: params.cropName,
      quantityKg: String(params.quantityKg),
      farmerDistrict: params.farmerDistrict || 'Guntur',
      farmerState: params.farmerState || 'Andhra Pradesh',
    });
    return request<any>(`/markets/net-return?${query.toString()}`);
  },

  triggerMarketSync: () =>
    request<any>('/markets/sync', {
      method: 'POST',
    }),

  // Farmer Produce Listings
  getProducts: (filters?: { farmerId?: string; crop?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'All') params.append(k, v);
      });
    }
    return request<{ products: Product[]; total: number }>(`/products?${params.toString()}`);
  },

  createProduct: (productData: Partial<Product>) =>
    request<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id: string, updates: Partial<Product>) =>
    request<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteProduct: (id: string) =>
    request<any>(`/products/${id}`, {
      method: 'DELETE',
    }),

  getProductMatches: (id: string) =>
    request<{ product: Product; matches: MatchResult[]; totalMatches: number }>(`/products/${id}/matching-requests`),

  // Buyer Requirements
  getBuyerRequests: (filters?: { buyerId?: string; crop?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v && v !== 'All') params.append(k, v);
      });
    }
    return request<{ requests: BuyerRequest[]; total: number }>(`/buyer-requests?${params.toString()}`);
  },

  createBuyerRequest: (requestData: Partial<BuyerRequest>) =>
    request<{ request: BuyerRequest; matchCount: number; topMatches: MatchResult[] }>('/buyer-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),

  deleteBuyerRequest: (id: string) =>
    request<any>(`/buyer-requests/${id}`, {
      method: 'DELETE',
    }),

  getBuyerRequestMatches: (id: string) =>
    request<{ request: BuyerRequest; matches: MatchResult[]; totalMatches: number }>(`/buyer-requests/${id}/matching-farmers`),

  // Offers
  getOffers: () => request<{ offers: Offer[]; total: number }>('/offers'),

  createOffer: (offerData: Partial<Offer> & { targetUserId: string; targetUserName?: string }) =>
    request<{ offer: Offer }>('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    }),

  acceptOffer: (id: string) =>
    request<{ offer: Offer; order: Order; conversationId: string }>(`/offers/${id}/accept`, {
      method: 'PUT',
    }),

  rejectOffer: (id: string) =>
    request<{ offer: Offer }>(`/offers/${id}/reject`, {
      method: 'PUT',
    }),

  deleteOffer: (id: string) =>
    request<{ id: string }>(`/offers/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: (status?: string) =>
    request<{ orders: Order[]; total: number }>(`/orders${status && status !== 'All' ? `?status=${status}` : ''}`),

  getOrderById: (id: string) =>
    request<{ order: Order }>(`/orders/${id}`),

  createOrder: (orderData: any) =>
    request<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  updateOrderStatus: (id: string, updates: { status?: string; trackingNotes?: string; paymentStatus?: string }) =>
    request<{ order: Order }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteOrder: (id: string) =>
    request<any>(`/orders/${id}`, {
      method: 'DELETE',
    }),

  simulatePayment: (id: string, action: 'deposit' | 'release') =>
    request<{ order: Order }>(`/orders/${id}/simulate-payment`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  updateEscrow: (id: string, action: 'deposit' | 'mark_delivered' | 'verify_quality' | 'release') =>
    request<{ order: Order }>(`/orders/${id}/escrow`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  getLogisticsTasks: () =>
    request<{ tasks: any[]; total: number }>(`/logistics`),

  createLogisticsTask: (taskData: any) =>
    request<{ task: any }>('/logistics', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  updateLogisticsTaskStatus: (id: string, status: 'stored' | 'completed', notes?: string) =>
    request<{ task: any }>(`/logistics/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  // Chat
  getConversations: () =>
    request<{ conversations: Conversation[]; total: number }>('/conversations'),

  getOrCreateConversation: (params: { targetUserId?: string; orderId?: string; buyerRequestId?: string; cropName?: string }) =>
    request<{ conversation: Conversation }>('/conversations', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  sendMessage: (conversationId: string, text: string) =>
    request<{ message: any; conversation: Conversation }>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  // Notifications
  getNotifications: () =>
    request<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications'),

  markNotificationRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  // Price Alerts
  getAlerts: () =>
    request<{ alerts: PriceAlert[]; total: number }>('/alerts'),

  createAlert: (alertData: Partial<PriceAlert>) =>
    request<{ alert: PriceAlert }>('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    }),

  toggleAlert: (id: string) =>
    request<{ alert: PriceAlert }>(`/alerts/${id}/toggle`, {
      method: 'PATCH',
    }),

  deleteAlert: (id: string) =>
    request<any>(`/alerts/${id}`, {
      method: 'DELETE',
    }),

  // Multilingual AI Assistant
  askAI: (params: { message: string; language?: string; userRole?: string; userLocation?: string; conversationHistory?: any[] }) =>
    request<{ reply: string; sources: string[]; relatedCrops?: string[] }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Admin
  getAdminStats: () =>
    request<{ stats: any; marketSync: any }>('/admin/stats'),

  getAdminUsers: () =>
    request<{ users: User[]; total: number }>('/admin/users'),

  getAdminDisputes: () =>
    request<{ disputes: any[] }>('/admin/disputes'),
};
