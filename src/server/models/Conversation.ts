import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageSubDoc {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'buyer' | 'admin';
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface IConversationDoc extends Document {
  orderId?: string;
  buyerRequestId?: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  status: 'active' | 'closed';
  messages: IMessageSubDoc[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSubSchema = new Schema(
  {
    id: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversationDoc>(
  {
    orderId: { type: String, index: true },
    buyerRequestId: { type: String, index: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    farmerId: { type: String, required: true, index: true },
    farmerName: { type: String, required: true },
    cropName: { type: String, default: 'Produce Negotiation' },
    status: { type: String, enum: ['active', 'closed'], default: 'active', index: true },
    messages: [MessageSubSchema],
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.models.Conversation || mongoose.model<IConversationDoc>('Conversation', ConversationSchema);
