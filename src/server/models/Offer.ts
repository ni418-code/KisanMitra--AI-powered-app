import mongoose, { Schema, Document } from 'mongoose';

export interface IOfferDoc extends Document {
  requestId?: string;
  productId?: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  proposedPrice: number;
  transportIncluded: boolean;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled';
  initiator: 'buyer' | 'farmer';
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOfferDoc>(
  {
    requestId: { type: String, index: true },
    productId: { type: String, index: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    farmerId: { type: String, required: true, index: true },
    farmerName: { type: String, required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    proposedPrice: { type: Number, required: true },
    transportIncluded: { type: Boolean, default: false },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'countered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    initiator: { type: String, enum: ['buyer', 'farmer'], required: true },
  },
  { timestamps: true }
);

export const OfferModel = mongoose.models.Offer || mongoose.model<IOfferDoc>('Offer', OfferSchema);
