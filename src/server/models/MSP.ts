import mongoose, { Schema, Document } from 'mongoose';

export interface IMSPDoc extends Document {
  id?: string;
  crop: string;
  category: string;
  season: 'Kharif' | 'Rabi' | 'Commercial' | 'Other';
  marketingYear: string;
  mspValue: number;
  mspPerKg: number;
  unit: string;
  source: string;
  effectiveDate: string;
  notes?: string;
}

const MSPSchema = new Schema<IMSPDoc>(
  {
    id: { type: String, index: true },
    crop: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    season: { type: String, enum: ['Kharif', 'Rabi', 'Commercial', 'Other'], required: true },
    marketingYear: { type: String, default: '2024-25' },
    mspValue: { type: Number, required: true },
    mspPerKg: { type: Number, required: true },
    unit: { type: String, default: '₹/Quintal' },
    source: { type: String, default: 'Ministry of Agriculture & Farmers Welfare, GoI' },
    effectiveDate: { type: String, default: '2024-10-01' },
    notes: { type: String },
  },
  { timestamps: true, strict: false }
);

export const MSPModel = mongoose.models.MSP || mongoose.model<IMSPDoc>('MSP', MSPSchema);
