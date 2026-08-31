import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDoc extends Document {
  id?: string;
  userId: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
  location: {
    state: string;
    district: string;
    market?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  preferredLanguage: string;
  profileImage?: string;
  isVerified: boolean;
  farmSizeAcres?: number;
  businessType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    id: { type: String, index: true },
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
    location: {
      state: { type: String, default: 'Andhra Pradesh' },
      district: { type: String, default: 'Guntur' },
      market: { type: String, default: 'Guntur Mandi' },
      address: { type: String, default: '' },
      latitude: { type: Number, default: 16.3067 },
      longitude: { type: Number, default: 80.4365 },
    },
    preferredLanguage: { type: String, default: 'en' },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: true },
    farmSizeAcres: { type: Number },
    businessType: { type: String },
  },
  { timestamps: true, strict: false }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
