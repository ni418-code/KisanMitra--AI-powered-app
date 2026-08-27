export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface LocationInfo {
  state: string;
  district: string;
  village?: string;
  market?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: string;
  userId: string; // e.g. KM-F-000001 or KM-B-000001
  name: string;
  phone: string;
  role: UserRole;
  location: LocationInfo;
  preferredLanguage: string;
  preferredCrops?: string[];
  profileImage?: string;
  isVerified: boolean;
  farmSizeAcres?: number;
  businessType?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MarketPrice {
  id: string;
  commodity: string;
  cropName: string;
  variety?: string;
  category: string;
  market: string;
  district: string;
  state: string;
  minPrice: number; // in ₹/Quintal
  modalPrice: number; // in ₹/Quintal
  maxPrice: number; // in ₹/Quintal
  pricePerKg: number; // modalPrice / 100
  priceUnit: string; // e.g. "₹/Quintal"
  arrivalDate: string; // YYYY-MM-DD
  source: string; // "Government AGMARKNET (data.gov.in)"
  fetchedAt: string;
}

export interface MSPData {
  id: string;
  crop?: string;
  cropName?: string;
  category?: string;
  variety?: string;
  season?: string;
  marketingYear?: string;
  mspValue?: number; // in ₹/Quintal
  mspRate?: number;
  mspPerKg?: number; // in ₹/Kg
  mspRatePerKg?: number;
  unit?: string;
  costOfProduction?: number;
  returnOverCostPercentage?: number;
  source?: string;
  effectiveDate?: string;
  notes?: string;
}

export type ProductStatus = 'available' | 'reserved' | 'sold' | 'expired';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  farmerUserId?: string;
  cropName: string;
  category: string;
  variety?: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | string;
  expectedPrice: number;
  quality?: string;
  grade?: string;
  qualityGrade?: string;
  harvestDate?: string;
  location: LocationInfo;
  availableFrom?: string;
  availableUntil?: string;
  images: string[];
  description?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt?: string;
}

export type BuyerRequestStatus = 'open' | 'matched' | 'accepted' | 'rejected' | 'cancelled' | 'fulfilled' | 'expired';

export interface BuyerRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  buyerUserId?: string;
  cropName: string;
  variety?: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | string;
  offeredPrice: number;
  deliveryLocation: LocationInfo;
  requiredDate?: string;
  neededByDate?: string;
  qualityRequirement?: string;
  qualityStandard?: string;
  description?: string;
  status: BuyerRequestStatus;
  createdAt: string;
  expiresAt?: string;
}

export interface MatchResult {
  targetId?: string;
  product?: Product;
  buyerRequest?: BuyerRequest;
  matchScore: number; // 0 to 100%
  buyerName?: string;
  farmerName?: string;
  cropName?: string;
  quantity?: number;
  expectedPrice?: number;
  offeredPrice?: number;
  farmerId?: string;
  buyerId?: string;
  breakdown: {
    cropMatch?: number;
    cropScore?: number;
    locationMatch?: number;
    locationScore?: number;
    quantityMatch?: number;
    quantityScore?: number;
    priceMatch?: number;
    priceScore?: number;
    availabilityMatch?: number;
    availabilityScore?: number;
  };
  explanation?: string;
  reasons?: string[];
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled';

export interface Offer {
  id: string;
  requestId?: string;
  buyerRequestId?: string;
  productId?: string;
  buyerId?: string;
  buyerName?: string;
  farmerId?: string;
  farmerName?: string;
  senderId?: string;
  senderName?: string;
  senderRole?: UserRole;
  receiverId?: string;
  receiverName?: string;
  cropName: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | string;
  proposedPrice?: number;
  offeredPricePerUnit?: number;
  totalAmount?: number;
  transportIncluded: boolean;
  message?: string;
  notes?: string;
  status: OfferStatus;
  initiator?: 'buyer' | 'farmer';
  createdAt: string;
  updatedAt?: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'processing' | 'ready_for_shipping' | 'shipped' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'escrow_held' | 'escrow_funded' | 'released' | 'paid' | 'refunded' | 'failed';

export interface Order {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  productId?: string;
  buyerRequestId?: string;
  crop?: string;
  cropName?: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton' | string;
  agreedPrice?: number;
  pricePerUnit?: number;
  productAmount?: number;
  transportCost?: number;
  storageCost?: number;
  handlingCost?: number;
  totalAmount: number;
  costBreakdown?: {
    productAmount: number;
    transportCost: number;
    handlingCost: number;
    totalAmount: number;
  };
  deliveryLocation?: LocationInfo;
  deliveryAddress?: LocationInfo;
  paymentStatus: PaymentStatus | string;
  paymentMethod?: string;
  shippingStatus?: OrderStatus;
  orderStatus: OrderStatus;
  trackingNotes?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  orderId?: string;
  buyerRequestId?: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  status: 'active' | 'closed';
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'offer' | 'order' | 'price_alert' | 'chat' | 'system';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  crop: string;
  targetPrice: number; // ₹/kg or ₹/Quintal
  market: string;
  district: string;
  condition: 'above' | 'below';
  active: boolean;
  triggeredCount: number;
  lastTriggeredAt?: string;
  createdAt: string;
}
