import { User, Product, BuyerRequest, Offer, Order, Conversation, NotificationItem, PriceAlert, LogisticsTask } from '../../types/index.ts';

// Pre-seeded authentic initial mock users for demo & seamless testing
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    userId: 'KM-F-000001',
    name: 'Ramesh Patel',
    phone: '9876543210',
    role: 'farmer',
    location: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market: 'Guntur Mandi',
      address: 'Pedakakani Village, Guntur',
      latitude: 16.3067,
      longitude: 80.4365,
    },
    preferredLanguage: 'en',
    isVerified: true,
    farmSizeAcres: 8.5,
    businessType: 'Organic & Commercial Farming',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'usr-2',
    userId: 'KM-B-000001',
    name: 'Rajesh Agro Foods Ltd',
    phone: '9123456780',
    role: 'buyer',
    location: {
      state: 'Telangana',
      district: 'Hyderabad',
      market: 'Bowenpally Market',
      address: 'Plot 42, Agro Industrial Park, Hyderabad',
      latitude: 17.3850,
      longitude: 78.4867,
    },
    preferredLanguage: 'en',
    isVerified: true,
    businessType: 'Wholesale Agri Distributor & Processing',
    createdAt: '2026-08-05T00:00:00.000Z',
  },
  {
    id: 'usr-3',
    userId: 'KM-A-000001',
    name: 'Kisan Mitra Admin',
    phone: '9999999999',
    role: 'admin',
    location: {
      state: 'National',
      district: 'HQ',
      market: 'Central Hub',
      address: 'Kisan Mitra AgriTech Network',
    },
    preferredLanguage: 'en',
    isVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '9876543210',
    farmerUserId: 'KM-F-000001',
    cropName: 'Tomato',
    category: 'Vegetables',
    variety: 'Hybrid Shivam (Grade A)',
    quantity: 1200,
    unit: 'kg',
    expectedPrice: 27,
    quality: 'Grade A (Premium)',
    grade: 'Grade A',
    location: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market: 'Guntur Mandi',
      address: 'Field Lot 4, Pedakakani',
    },
    availableFrom: '2026-08-25',
    availableUntil: '2026-09-10',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'],
    description: 'Fresh farm harvest. Uniform size, firm red ripeness, zero chemical residue spray for 14 days before picking.',
    status: 'available',
    createdAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '9876543210',
    farmerUserId: 'KM-F-000001',
    cropName: 'Chilli',
    category: 'Spices',
    variety: 'Guntur Sannam Red Hot',
    quantity: 500,
    unit: 'kg',
    expectedPrice: 210,
    quality: 'Grade A (Premium)',
    grade: 'Super A+',
    location: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market: 'Guntur Yard',
    },
    availableFrom: '2026-08-26',
    availableUntil: '2026-09-30',
    images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80'],
    description: 'Sun-dried high SHU pungent Guntur chillies, moisture < 10%, export lot.',
    status: 'available',
    createdAt: '2026-08-25T08:30:00.000Z',
  },
  {
    id: 'prod-3',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '9876543210',
    farmerUserId: 'KM-F-000001',
    cropName: 'Paddy (Rice)',
    category: 'Cereals',
    variety: 'BPT-5204 (Samba Mahsuri)',
    quantity: 35,
    unit: 'quintal',
    expectedPrice: 2450,
    quality: 'Grade A (Premium)',
    grade: 'A',
    location: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market: 'Tenali Mandi',
    },
    availableFrom: '2026-08-20',
    availableUntil: '2026-10-15',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80'],
    description: 'Fine grain paddy, single farmer origin, tested moisture 12.5%.',
    status: 'available',
    createdAt: '2026-08-24T14:00:00.000Z',
  }
];

export const INITIAL_BUYER_REQUESTS: BuyerRequest[] = [
  {
    id: 'req-1',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    buyerPhone: '9123456780',
    buyerUserId: 'KM-B-000001',
    cropName: 'Tomato',
    quantity: 1000,
    unit: 'kg',
    offeredPrice: 28,
    deliveryLocation: {
      state: 'Telangana',
      district: 'Hyderabad',
      market: 'Bowenpally Market',
      address: 'Cold Storage Unit 3, Hyderabad',
    },
    requiredDate: '2026-08-30',
    qualityRequirement: 'Grade A (Premium)',
    description: 'Looking for 1000 kg fresh firm tomatoes for sauce and distribution. Direct farmer pickup or delivery.',
    status: 'open',
    createdAt: '2026-08-25T11:00:00.000Z',
  },
  {
    id: 'req-2',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    buyerPhone: '9123456780',
    buyerUserId: 'KM-B-000001',
    cropName: 'Chilli',
    quantity: 400,
    unit: 'kg',
    offeredPrice: 215,
    deliveryLocation: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      address: 'Spice Processing Hub, Guntur',
    },
    requiredDate: '2026-09-05',
    qualityRequirement: 'Grade A (Premium)',
    description: 'Need export quality dry red chilli. Immediate payment upon quality inspection.',
    status: 'open',
    createdAt: '2026-08-25T12:00:00.000Z',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderId: 'KM-2026-0891',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    buyerPhone: '9123456780',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '9876543210',
    productId: 'prod-1',
    buyerRequestId: 'req-1',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    agreedPrice: 28,
    productAmount: 14000, // 500 * 28
    transportCost: 800,
    storageCost: 200,
    totalAmount: 15000, // 14000 + 800 + 200
    deliveryLocation: {
      state: 'Telangana',
      district: 'Hyderabad',
      address: 'Cold Storage Unit 3, Hyderabad',
    },
    paymentStatus: 'pending',
    paymentMethod: 'Escrow Simulation (UPI / Bank)',
    shippingStatus: 'processing',
    orderStatus: 'processing',
    trackingNotes: 'Order created. Buyer must deposit funds into KisanMitra Escrow to begin protected delivery.',
    estimatedDeliveryDate: '2026-08-28',
    escrowStep: 'awaiting_deposit',
    escrowStatus: '⏳ Awaiting Buyer Deposit',
    deliveryMarked: false,
    qualityVerified: false,
    escrowHistory: [
      { label: 'Order created with escrow protection', at: '2026-08-25T15:30:00.000Z' },
    ],
    createdAt: '2026-08-25T15:30:00.000Z',
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    orderId: 'KM-2026-0891',
    buyerRequestId: 'req-1',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Tomato (500 kg)',
    status: 'active',
    lastMessage: 'I have packed 500 kg in standard 25kg crates. Ready for dispatch.',
    lastMessageAt: '2026-08-25T16:00:00.000Z',
    createdAt: '2026-08-25T15:30:00.000Z',
    messages: [
      {
        id: 'msg-1',
        senderId: 'usr-2',
        senderName: 'Rajesh Agro Foods Ltd',
        senderRole: 'buyer',
        text: 'Namaste Ramesh ji, we confirm the order for 500kg Tomato at ₹28/kg. Escrow payment is deposited.',
        timestamp: '2026-08-25T15:32:00.000Z',
        isRead: true,
      },
      {
        id: 'msg-2',
        senderId: 'usr-1',
        senderName: 'Ramesh Patel',
        senderRole: 'farmer',
        text: 'Namaste Rajesh ji, thank you. I have packed 500 kg in standard 25kg crates. Ready for dispatch.',
        timestamp: '2026-08-25T16:00:00.000Z',
        isRead: true,
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    title: 'New High Match Buyer Request!',
    message: 'Rajesh Agro Foods in Hyderabad requested 1000 kg Tomato at ₹28/kg. Match score: 95%',
    type: 'request',
    referenceId: 'req-1',
    isRead: false,
    createdAt: '2026-08-25T11:05:00.000Z',
  },
  {
    id: 'notif-2',
    userId: 'usr-1',
    title: 'Order Escrow Payment Secured',
    message: 'Buyer deposited ₹15,000 for Order #KM-2026-0891 into verified escrow.',
    type: 'order',
    referenceId: 'ord-1',
    isRead: true,
    createdAt: '2026-08-25T15:31:00.000Z',
  }
];

export const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alt-1',
    userId: 'usr-1',
    crop: 'Tomato',
    targetPrice: 30,
    market: 'All',
    district: 'Guntur',
    condition: 'above',
    active: true,
    triggeredCount: 1,
    lastTriggeredAt: '2026-08-25T09:00:00.000Z',
    createdAt: '2026-08-20T00:00:00.000Z',
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    requestId: 'req-1',
    productId: 'prod-1',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Tomato',
    quantity: 500,
    unit: 'kg',
    proposedPrice: 28,
    transportIncluded: false,
    notes: 'Direct farm-gate pickup from Guntur lot. Payment protected via Kisan Mitra Escrow.',
    status: 'pending',
    initiator: 'buyer',
    createdAt: '2026-08-25T13:00:00.000Z',
  },
  {
    id: 'off-2',
    requestId: 'req-2',
    productId: 'prod-2',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Chilli',
    quantity: 200,
    unit: 'kg',
    proposedPrice: 215,
    transportIncluded: true,
    notes: 'Grade A Guntur Sannam dry red chillies lot with moisture < 10%.',
    status: 'accepted',
    initiator: 'buyer',
    createdAt: '2026-08-25T14:15:00.000Z',
  },
  {
    id: 'off-3',
    productId: 'prod-3',
    buyerId: 'usr-2',
    buyerName: 'Rajesh Agro Foods Ltd',
    farmerId: 'usr-1',
    farmerName: 'Ramesh Patel',
    cropName: 'Paddy (Rice)',
    quantity: 25,
    unit: 'quintal',
    proposedPrice: 2420,
    transportIncluded: false,
    notes: 'Counter offer proposed for BPT-5204 fine grain lot.',
    status: 'countered',
    initiator: 'farmer',
    createdAt: '2026-08-26T09:30:00.000Z',
  },
];

// Runtime store instance
class DataStore {
  users: User[] = [...INITIAL_USERS];
  products: Product[] = [...INITIAL_PRODUCTS];
  buyerRequests: BuyerRequest[] = [...INITIAL_BUYER_REQUESTS];
  offers: Offer[] = [...INITIAL_OFFERS];
  orders: Order[] = [...INITIAL_ORDERS];
  conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  alerts: PriceAlert[] = [...INITIAL_ALERTS];
  logisticsTasks: LogisticsTask[] = [];

  // Users
  getUserById(idOrUserId: string): User | undefined {
    return this.users.find((u) => u.id === idOrUserId || u.userId === idOrUserId || u.phone === idOrUserId);
  }

  addUser(user: User): User {
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex((u) => u.id === id || u.userId === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.users[idx];
    }
    return undefined;
  }

  // Products
  getProducts(filters?: { farmerId?: string; crop?: string; status?: string }): Product[] {
    let list = [...this.products];
    if (filters?.farmerId) list = list.filter((p) => p.farmerId === filters.farmerId || p.farmerUserId === filters.farmerId);
    if (filters?.crop && filters.crop !== 'All') list = list.filter((p) => p.cropName.toLowerCase() === filters.crop!.toLowerCase());
    if (filters?.status && filters.status !== 'All') list = list.filter((p) => p.status === filters.status);
    return list;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  addProduct(product: Product): Product {
    this.products.unshift(product);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.products[idx];
    }
    return undefined;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  // Buyer Requests
  getBuyerRequests(filters?: { buyerId?: string; crop?: string; status?: string }): BuyerRequest[] {
    let list = [...this.buyerRequests];
    if (filters?.buyerId) list = list.filter((r) => r.buyerId === filters.buyerId || r.buyerUserId === filters.buyerId);
    if (filters?.crop && filters.crop !== 'All') list = list.filter((r) => r.cropName.toLowerCase() === filters.crop!.toLowerCase());
    if (filters?.status && filters.status !== 'All') list = list.filter((r) => r.status === filters.status);
    return list;
  }

  getBuyerRequestById(id: string): BuyerRequest | undefined {
    return this.buyerRequests.find((r) => r.id === id);
  }

  addBuyerRequest(request: BuyerRequest): BuyerRequest {
    this.buyerRequests.unshift(request);
    return request;
  }

  updateBuyerRequest(id: string, updates: Partial<BuyerRequest>): BuyerRequest | undefined {
    const idx = this.buyerRequests.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.buyerRequests[idx] = { ...this.buyerRequests[idx], ...updates };
      return this.buyerRequests[idx];
    }
    return undefined;
  }

  deleteBuyerRequest(id: string): boolean {
    const initialLen = this.buyerRequests.length;
    this.buyerRequests = this.buyerRequests.filter((r) => r.id !== id);
    return this.buyerRequests.length < initialLen;
  }

  // Offers
  getOffers(userId?: string): Offer[] {
    if (!userId) return [...this.offers];
    return this.offers.filter((o) => o.buyerId === userId || o.farmerId === userId);
  }

  addOffer(offer: Offer): Offer {
    this.offers.unshift(offer);
    return offer;
  }

  updateOffer(id: string, updates: Partial<Offer>): Offer | undefined {
    const idx = this.offers.findIndex((o) => o.id === id);
    if (idx !== -1) {
      this.offers[idx] = { ...this.offers[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.offers[idx];
    }
    return undefined;
  }

  // Orders
  getOrders(userId?: string, role?: string): Order[] {
    let list = [...this.orders];
    if (userId && role === 'farmer') {
      list = list.filter((o) => o.farmerId === userId);
    } else if (userId && role === 'buyer') {
      list = list.filter((o) => o.buyerId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderId === id);
  }

  addOrder(order: Order): Order {
    this.orders.unshift(order);
    return order;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const idx = this.orders.findIndex((o) => o.id === id || o.orderId === id);
    if (idx !== -1) {
      this.orders[idx] = { ...this.orders[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.orders[idx];
    }
    return undefined;
  }

  // Conversations
  getConversations(userId: string): Conversation[] {
    return this.conversations.filter((c) => c.buyerId === userId || c.farmerId === userId);
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find((c) => c.id === id || c.orderId === id || c.buyerRequestId === id);
  }

  addConversation(conv: Conversation): Conversation {
    this.conversations.unshift(conv);
    return conv;
  }

  addMessageToConversation(convId: string, message: any): Conversation | undefined {
    const conv = this.conversations.find((c) => c.id === convId);
    if (conv) {
      conv.messages.push(message);
      conv.lastMessage = message.text;
      conv.lastMessageAt = new Date().toISOString();
      conv.updatedAt = new Date().toISOString();
      return conv;
    }
    return undefined;
  }

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addNotification(notif: NotificationItem): NotificationItem {
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationRead(id: string): boolean {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.isRead = true;
      return true;
    }
    return false;
  }

  // Price Alerts
  getAlerts(userId: string): PriceAlert[] {
    return this.alerts.filter((a) => a.userId === userId);
  }

  addAlert(alert: PriceAlert): PriceAlert {
    this.alerts.unshift(alert);
    return alert;
  }

  deleteAlert(id: string): boolean {
    const initial = this.alerts.length;
    this.alerts = this.alerts.filter((a) => a.id !== id);
    return this.alerts.length < initial;
  }

  // Logistics & Storage Tasks
  getLogisticsTasks(userId?: string): LogisticsTask[] {
    if (!userId) return [...this.logisticsTasks];
    return this.logisticsTasks.filter((task) => task.userWhoCreated === userId);
  }

  getLogisticsTaskById(id: string): LogisticsTask | undefined {
    return this.logisticsTasks.find((task) => task.id === id);
  }

  addLogisticsTask(task: LogisticsTask): LogisticsTask {
    this.logisticsTasks.unshift(task);
    return task;
  }

  updateLogisticsTask(id: string, updates: Partial<LogisticsTask>): LogisticsTask | undefined {
    const idx = this.logisticsTasks.findIndex((task) => task.id === id);
    if (idx !== -1) {
      this.logisticsTasks[idx] = { ...this.logisticsTasks[idx], ...updates, completedAt: updates.status === 'completed' || updates.status === 'stored' ? new Date().toISOString() : this.logisticsTasks[idx].completedAt };
      return this.logisticsTasks[idx];
    }
    return undefined;
  }
}

export const dataStore = new DataStore();
