import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceAlertDoc extends Document {
  userId: string;
  crop: string;
  targetPrice: number;
  market: string;
  district: string;
  condition: 'above' | 'below';
  active: boolean;
  triggeredCount: number;
  lastTriggeredAt?: Date;
  createdAt: Date;
}

const PriceAlertSchema = new Schema<IPriceAlertDoc>(
  {
    userId: { type: String, required: true, index: true },
    crop: { type: String, required: true, index: true },
    targetPrice: { type: Number, required: true },
    market: { type: String, default: 'All' },
    district: { type: String, default: 'All' },
    condition: { type: String, enum: ['above', 'below'], default: 'above' },
    active: { type: Boolean, default: true, index: true },
    triggeredCount: { type: Number, default: 0 },
    lastTriggeredAt: { type: Date },
  },
  { timestamps: true }
);

export const PriceAlertModel = mongoose.models.PriceAlert || mongoose.model<IPriceAlertDoc>('PriceAlert', PriceAlertSchema);
