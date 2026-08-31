import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyerRequestDoc extends Document {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerUserId: string;
  cropName: string;
  quantity: number;
  unit: string;
  offeredPrice: number;
  deliveryLocation: {
    state: string;
    district: string;
    market?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  requiredDate: string;
  qualityRequirement: string;
  description?: string;
  status: 'open' | 'matched' | 'accepted' | 'rejected' | 'cancelled' | 'fulfilled' | 'expired';
  createdAt: Date;
  expiresAt?: Date;
}

const BuyerRequestSchema = new Schema<IBuyerRequestDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    buyerUserId: { type: String, required: true },
    cropName: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal', 'ton'], default: 'kg' },
    offeredPrice: { type: Number, required: true },
    deliveryLocation: {
      state: { type: String, default: 'Telangana' },
      district: { type: String, default: 'Hyderabad' },
      market: { type: String },
      address: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    requiredDate: { type: String, required: true },
    qualityRequirement: { type: String, default: 'Grade A (Premium)' },
    description: { type: String },
    status: {
      type: String,
      enum: ['open', 'matched', 'accepted', 'rejected', 'cancelled', 'fulfilled', 'expired'],
      default: 'open',
      index: true,
    },
    expiresAt: { type: Date },
  },
  { timestamps: true, strict: false }
);

BuyerRequestSchema.index({ buyerId: 1, cropName: 1, status: 1 });

export const BuyerRequestModel = mongoose.models.BuyerRequest || mongoose.model<IBuyerRequestDoc>('BuyerRequest', BuyerRequestSchema);
