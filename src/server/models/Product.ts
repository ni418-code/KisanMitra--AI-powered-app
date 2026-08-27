import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDoc extends Document {
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerUserId: string;
  cropName: string;
  category: string;
  variety?: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  quality: string;
  grade: string;
  location: {
    state: string;
    district: string;
    market?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  availableFrom: string;
  availableUntil: string;
  images: string[];
  description?: string;
  status: 'available' | 'reserved' | 'sold' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    farmerId: { type: String, required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    farmerUserId: { type: String, required: true },
    cropName: { type: String, required: true, index: true },
    category: { type: String, default: 'Vegetables' },
    variety: { type: String },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal', 'ton'], default: 'kg' },
    expectedPrice: { type: Number, required: true },
    quality: { type: String, default: 'Grade A (Premium)' },
    grade: { type: String, default: 'A' },
    location: {
      state: { type: String, default: 'Andhra Pradesh' },
      district: { type: String, default: 'Guntur' },
      market: { type: String, default: 'Guntur Mandi' },
      address: { type: String, default: '' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    availableFrom: { type: String, required: true },
    availableUntil: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
    status: { type: String, enum: ['available', 'reserved', 'sold', 'expired'], default: 'available', index: true },
  },
  { timestamps: true }
);

ProductSchema.index({ farmerId: 1, cropName: 1, status: 1 });

export const ProductModel = mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
