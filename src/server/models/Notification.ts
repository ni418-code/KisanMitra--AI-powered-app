import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDoc extends Document {
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'offer' | 'order' | 'price_alert' | 'chat' | 'system';
  referenceId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDoc>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['request', 'offer', 'order', 'price_alert', 'chat', 'system'],
      default: 'system',
    },
    referenceId: { type: String },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.models.Notification || mongoose.model<INotificationDoc>('Notification', NotificationSchema);
