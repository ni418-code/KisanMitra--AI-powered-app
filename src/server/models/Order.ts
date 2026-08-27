import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderDoc extends Document {
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  productId?: string;
  buyerRequestId?: string;
  crop: string;
  quantity: number;
  unit: string;
  agreedPrice: number;
  productAmount: number;
  transportCost: number;
  storageCost: number;
  totalAmount: number;
  deliveryLocation: {
    state: string;
    district: string;
    market?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  paymentStatus: 'pending' | 'escrow_held' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  shippingStatus: 'pending' | 'accepted' | 'processing' | 'ready_for_shipping' | 'shipped' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
  orderStatus: 'pending' | 'accepted' | 'processing' | 'ready_for_shipping' | 'shipped' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
  trackingNotes?: string;
  estimatedDeliveryDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    farmerId: { type: String, required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    productId: { type: String },
    buyerRequestId: { type: String },
    crop: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    agreedPrice: { type: Number, required: true },
    productAmount: { type: Number, required: true },
    transportCost: { type: Number, default: 0 },
    storageCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    deliveryLocation: {
      state: { type: String, default: 'Telangana' },
      district: { type: String, default: 'Hyderabad' },
      market: { type: String },
      address: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'escrow_held', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'Escrow Simulation (UPI / Bank)' },
    shippingStatus: {
      type: String,
      enum: ['pending', 'accepted', 'processing', 'ready_for_shipping', 'shipped', 'out_for_delivery', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'accepted', 'processing', 'ready_for_shipping', 'shipped', 'out_for_delivery', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    trackingNotes: { type: String, default: 'Order registered in Kisan Mitra network.' },
    estimatedDeliveryDate: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ buyerId: 1, farmerId: 1, orderStatus: 1 });

export const OrderModel = mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);
