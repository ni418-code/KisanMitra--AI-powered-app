import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketPriceDoc extends Document {
  id?: string;
  commodity: string;
  cropName: string;
  variety?: string;
  category: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  pricePerKg: number;
  priceUnit: string;
  arrivalDate: string;
  source: string;
  fetchedAt: Date;
}

const MarketPriceSchema = new Schema<IMarketPriceDoc>(
  {
    id: { type: String, index: true },
    commodity: { type: String, required: true, index: true },
    cropName: { type: String, required: true, index: true },
    variety: { type: String, default: 'Other' },
    category: { type: String, default: 'Vegetables' },
    market: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    minPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    priceUnit: { type: String, default: '₹/Quintal' },
    arrivalDate: { type: String, required: true, index: true },
    source: { type: String, default: 'Government AGMARKNET (data.gov.in)' },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

MarketPriceSchema.index({ cropName: 1, district: 1, market: 1, arrivalDate: -1 });

export const MarketPriceModel: mongoose.Model<IMarketPriceDoc> = (mongoose.models.MarketPrice as mongoose.Model<IMarketPriceDoc>) || mongoose.model<IMarketPriceDoc>('MarketPrice', MarketPriceSchema);
