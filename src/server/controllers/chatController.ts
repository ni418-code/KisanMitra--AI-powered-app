import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Conversation, ChatMessage } from '../../types/index.ts';

export class ChatController {
  /**
   * Get all conversations for current user
   */
  static async getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const convs = dataStore.getConversations(req.user.id);
    res.json({
      success: true,
      data: {
        conversations: convs,
        total: convs.length,
      },
    });
  }

  /**
   * Get single conversation or create if not exists
   */
  static async getOrCreateConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { targetUserId, orderId, buyerRequestId, cropName } = req.body;

    let conv = dataStore.conversations.find((c) => {
      if (orderId && c.orderId === orderId) return true;
      if (buyerRequestId && c.buyerRequestId === buyerRequestId && (c.buyerId === req.user!.id || c.farmerId === req.user!.id)) return true;
      if (targetUserId && ((c.buyerId === req.user!.id && c.farmerId === targetUserId) || (c.farmerId === req.user!.id && c.buyerId === targetUserId))) return true;
      return false;
    });

    if (!conv && targetUserId) {
      const targetUser = dataStore.getUserById(targetUserId);
      const isBuyer = req.user.role === 'buyer';
      const buyerId = isBuyer ? req.user.id : targetUserId;
      const buyerName = isBuyer ? req.user.name : targetUser?.name || 'Buyer';
      const farmerId = !isBuyer ? req.user.id : targetUserId;
      const farmerName = !isBuyer ? req.user.name : targetUser?.name || 'Farmer';

      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        orderId,
        buyerRequestId,
        buyerId,
        buyerName,
        farmerId,
        farmerName,
        cropName: cropName || 'Produce Negotiation',
        status: 'active',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: req.user.id,
            senderName: req.user.name,
            senderRole: req.user.role,
            text: `Namaste! I am interested in negotiating for ${cropName || 'produce'}.`,
            timestamp: new Date().toISOString(),
            isRead: true,
          }
        ],
        lastMessage: `Conversation opened for ${cropName || 'negotiation'}`,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      conv = dataStore.addConversation(newConv);
    }

    if (!conv) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    res.json({
      success: true,
      data: { conversation: conv },
    });
  }

  /**
   * Send a chat message with strict closed conversation enforcement (Rule 15)
   */
  static async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || String(text).trim().length === 0) {
      res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
      return;
    }

    const conv = dataStore.getConversationById(conversationId);
    if (!conv) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    // Check if conversation is closed (e.g. cancelled order)
    if (conv.status === 'closed') {
      res.status(400).json({
        success: false,
        message: 'This conversation is closed because the linked order or request is terminated. Messages cannot be sent, but history is retained for audit.',
        code: 'CONVERSATION_CLOSED',
      });
      return;
    }

    // Party check
    if (conv.buyerId !== req.user.id && conv.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to send messages in this conversation.' });
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      text: String(text).trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    conv.messages.push(newMsg);
    conv.lastMessage = newMsg.text;
    conv.lastMessageAt = new Date().toISOString();
    conv.updatedAt = new Date().toISOString();

    // Notify other party
    const recipientId = conv.buyerId === req.user.id ? conv.farmerId : conv.buyerId;
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: recipientId,
      title: `New message from ${req.user.name}`,
      message: newMsg.text.length > 60 ? newMsg.text.slice(0, 60) + '...' : newMsg.text,
      type: 'chat',
      referenceId: conv.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: {
        message: newMsg,
        conversation: conv,
      },
    });
  }
}
