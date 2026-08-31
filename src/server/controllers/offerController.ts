import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Offer, Order, Conversation } from '../../types/index.ts';

export class OfferController {
  /**
   * Get all offers involving user
   */
  static async getOffers(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const offers = dataStore.getOffers(req.user.id);
    res.json({
      success: true,
      data: {
        offers,
        total: offers.length,
      },
    });
  }

  /**
   * Create an offer / counter-offer
   */
  static async createOffer(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      requestId,
      productId,
      targetUserId,
      targetUserName,
      cropName,
      quantity,
      unit = 'kg',
      proposedPrice,
      transportIncluded = false,
      notes,
    } = req.body;

    if (!cropName || !quantity || !proposedPrice || !targetUserId) {
      res.status(400).json({ success: false, message: 'Target user, crop name, quantity and proposed price are required.' });
      return;
    }

    const isBuyer = req.user.role === 'buyer';
    const buyerId = isBuyer ? req.user.id : targetUserId;
    const buyerName = isBuyer ? req.user.name : targetUserName || 'Buyer';
    const farmerId = !isBuyer ? req.user.id : targetUserId;
    const farmerName = !isBuyer ? req.user.name : targetUserName || 'Farmer';

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      requestId,
      productId,
      buyerId,
      buyerName,
      farmerId,
      farmerName,
      cropName,
      quantity: Number(quantity),
      unit: unit as any,
      proposedPrice: Number(proposedPrice),
      transportIncluded: Boolean(transportIncluded),
      notes,
      status: 'pending',
      initiator: isBuyer ? 'buyer' : 'farmer',
      createdAt: new Date().toISOString(),
    };

    const saved = dataStore.addOffer(newOffer);

    // Notify recipient
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: `New Offer Received for ${cropName}`,
      message: `${req.user.name} sent an offer for ${quantity} ${unit} ${cropName} at ₹${proposedPrice}/${unit}.`,
      type: 'offer',
      referenceId: saved.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Offer dispatched successfully.',
      data: { offer: saved },
    });
  }

  /**
   * Accept offer & create order automatically
   */
  static async acceptOffer(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const offer = dataStore.offers.find((o) => o.id === req.params.id);
    if (!offer) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    // Verify user is party to offer
    if (offer.buyerId !== req.user.id && offer.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to respond to this offer.' });
      return;
    }

    offer.status = 'accepted';
    offer.updatedAt = new Date().toISOString();

    // Server-side strict cost calculation (Quantity * Price + Transport + Handling)
    const productAmount = Math.round(offer.quantity * offer.proposedPrice);
    const transportCost = offer.transportIncluded ? 0 : Math.round(offer.quantity * 1.5);
    const storageCost = 150;
    const totalAmount = productAmount + transportCost + storageCost;

    const buyerUser = dataStore.getUserById(offer.buyerId);
    const farmerUser = dataStore.getUserById(offer.farmerId);

    const orderIdNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId: `KM-ORD-${orderIdNum}`,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerPhone: buyerUser?.phone || '9123456780',
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      farmerPhone: farmerUser?.phone || '9876543210',
      productId: offer.productId,
      buyerRequestId: offer.requestId,
      crop: offer.cropName,
      quantity: offer.quantity,
      unit: offer.unit,
      agreedPrice: offer.proposedPrice,
      productAmount,
      transportCost,
      storageCost,
      totalAmount,
      deliveryLocation: buyerUser?.location || { state: 'Telangana', district: 'Hyderabad', market: 'Bowenpally' },
      paymentStatus: 'pending',
      paymentMethod: 'Escrow Simulation (UPI / Bank Transfer)',
      shippingStatus: 'accepted',
      orderStatus: 'accepted',
      trackingNotes: 'Offer accepted. Buyer must deposit funds into KisanMitra Escrow to begin protected delivery.',
      escrowStep: 'awaiting_deposit',
      escrowStatus: '⏳ Awaiting Buyer Deposit',
      deliveryMarked: false,
      qualityVerified: false,
      escrowHistory: [
        { label: 'Offer accepted and order created', at: new Date().toISOString() },
      ],
      estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const savedOrder = dataStore.addOrder(newOrder);

    // Initialize or bind active conversation
    let conv = dataStore.conversations.find((c) => (c.buyerId === offer.buyerId && c.farmerId === offer.farmerId) || c.orderId === savedOrder.id);
    if (!conv) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        orderId: savedOrder.id,
        buyerRequestId: offer.requestId,
        buyerId: offer.buyerId,
        buyerName: offer.buyerName,
        farmerId: offer.farmerId,
        farmerName: offer.farmerName,
        cropName: `${offer.cropName} (${offer.quantity} ${offer.unit})`,
        status: 'active',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: req.user.id,
            senderName: req.user.name,
            senderRole: req.user.role,
            text: `Offer accepted! Order #${savedOrder.orderId} created for ${offer.quantity} ${offer.unit} ${offer.cropName} at ₹${offer.proposedPrice}/${offer.unit}. Total Amount: ₹${totalAmount.toLocaleString('en-IN')}.`,
            timestamp: new Date().toISOString(),
            isRead: true,
          }
        ],
        lastMessage: `Offer accepted for Order #${savedOrder.orderId}`,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      conv = dataStore.addConversation(newConv);
    }

    // Notify both parties
    const otherUserId = offer.buyerId === req.user.id ? offer.farmerId : offer.buyerId;
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: otherUserId,
      title: `Offer Accepted & Order #${savedOrder.orderId} Created!`,
      message: `${req.user.name} accepted your offer for ${offer.quantity} ${offer.unit} ${offer.cropName}.`,
      type: 'order',
      referenceId: savedOrder.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Offer accepted and Order generated successfully.',
      data: {
        offer,
        order: savedOrder,
        conversationId: conv.id,
      },
    });
  }

  /**
   * Delete / cancel an offer (initiator can delete pending or their own declined offers)
   */
  static async deleteOffer(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const offer = dataStore.offers.find((o) => o.id === req.params.id);
    if (!offer) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    if (offer.buyerId !== req.user.id && offer.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this offer.' });
      return;
    }

    if (offer.status === 'accepted') {
      res.status(400).json({ success: false, message: 'Accepted offers are converted into orders and cannot be deleted. Manage it in Orders.' });
      return;
    }

    dataStore.deleteOffer(offer.id);

    const otherUserId = offer.buyerId === req.user.id ? offer.farmerId : offer.buyerId;
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: otherUserId,
      title: `Offer Removed for ${offer.cropName}`,
      message: `${req.user.name} removed the offer of ₹${offer.proposedPrice}/${offer.unit}.`,
      type: 'offer',
      referenceId: offer.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Offer deleted successfully.',
      data: { id: offer.id },
    });
  }

  /**
   * Reject offer
   */
  static async rejectOffer(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const offer = dataStore.offers.find((o) => o.id === req.params.id);
    if (!offer) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    const rejected = dataStore.updateOffer(offer.id, { status: 'rejected' }) || offer;

    const otherUserId = offer.buyerId === req.user.id ? offer.farmerId : offer.buyerId;
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: otherUserId,
      title: `Offer Declined for ${offer.cropName}`,
      message: `${req.user.name} declined the offer of ₹${offer.proposedPrice}/${offer.unit}.`,
      type: 'offer',
      referenceId: offer.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Offer marked as rejected.',
      data: { offer: rejected },
    });
  }
}
