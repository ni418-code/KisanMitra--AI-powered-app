import mongoose, { Schema, Document } from 'mongoose';

export interface ILogisticsTaskDoc extends Document {
  id: string;
  orderId?: string;
  type: 'transport' | 'storage';
  title: string;
  reference: string;
  status: 'active' | 'stored' | 'completed';
  driverName?: string;
  vehicle?: string;
  facility?: string;
  pickup?: string;
  drop?: string;
  userWhoCreated: string;
  createdAt: Date;
  completedAt?: Date;
}

const LogisticsTaskSchema = new Schema<ILogisticsTaskDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, index: true },
    type: { type: String, enum: ['transport', 'storage'], required: true },
    title: { type: String, required: true },
    reference: { type: String, required: true },
    status: { type: String, enum: ['active', 'stored', 'completed'], default: 'active', index: true },
    driverName: { type: String },
    vehicle: { type: String },
    facility: { type: String },
    pickup: { type: String },
    drop: { type: String },
    userWhoCreated: { type: String, required: true, index: true },
    completedAt: { type: Date },
  },
  { timestamps: true, strict: false }
);

export const LogisticsTaskModel =
  mongoose.models.LogisticsTask || mongoose.model<ILogisticsTaskDoc>('LogisticsTask', LogisticsTaskSchema);
