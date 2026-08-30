import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Order, OrderStatus, PaymentStatus, EscrowAction } from '../../types/index.ts';

export class OrderController {
  /**
   * Get orders for the authenticated user
   */
  static async getOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status } = req.query;
    let orders = dataStore.getOrders(req.user.role === 'admin' ? undefined : req.user.id, req.user.role);

    if (status && status !== 'All') {
      orders = orders.filter((o) => o.orderStatus === status);
    }

    res.json({
      success: true,
      data: {
        orders,
        total: orders.length,
      },
    });
  }

  /**
   * Get single order by ID
   */
  static async getOrderById(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const order = dataStore.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Authorization check
    if (order.buyerId !== req.user.id && order.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
      return;
    }

    res.json({
      success: true,
      data: { order },
    });
  }

  /**
   * Create direct order (Buyer or Farmer agreement)
   */
  static async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      buyerId,
      farmerId,
      productId,
      buyerRequestId,
      crop,
      quantity,
      unit = 'kg',
      agreedPrice,
      customTransportCost,
      deliveryLocation,
    } = req.body;

    if (!crop || !quantity || !agreedPrice || !farmerId || !buyerId) {
      res.status(400).json({ success: false, message: 'Missing required order parameters.' });
      return;
    }

    // Strict Backend Cost Calculation (Rule 14)
    const qty = Number(quantity);
    const price = Number(agreedPrice);
    const productAmount = Math.round(qty * price);
    const transportCost = customTransportCost !== undefined ? Number(customTransportCost) : Math.round(qty * 1.5);
    const storageCost = 150;
    const totalAmount = productAmount + transportCost + storageCost;

    const buyerUser = dataStore.getUserById(buyerId);
    const farmerUser = dataStore.getUserById(farmerId);

    const orderIdNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId: `KM-ORD-${orderIdNum}`,
      buyerId,
      buyerName: buyerUser?.name || 'Agri Buyer',
      buyerPhone: buyerUser?.phone || '9123456780',
      farmerId,
      farmerName: farmerUser?.name || 'Farmer',
      farmerPhone: farmerUser?.phone || '9876543210',
      productId,
      buyerRequestId,
      crop,
      quantity: qty,
      unit: unit as any,
      agreedPrice: price,
      productAmount,
      transportCost,
      storageCost,
      totalAmount,
      deliveryLocation: deliveryLocation || buyerUser?.location || { state: 'Telangana', district: 'Hyderabad', market: 'Bowenpally' },
      paymentStatus: 'pending',
      paymentMethod: 'Escrow Simulation (UPI / Bank Transfer)',
      shippingStatus: 'accepted',
      orderStatus: 'accepted',
      trackingNotes: 'Order created. Buyer must deposit funds into KisanMitra Escrow to begin protected delivery.',
      escrowStep: 'awaiting_deposit',
      escrowStatus: '⏳ Awaiting Buyer Deposit',
      deliveryMarked: false,
      qualityVerified: false,
      escrowHistory: [
        { label: 'Order created with escrow protection', at: new Date().toISOString() },
      ],
      estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const saved = dataStore.addOrder(newOrder);

    // Notify farmer
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: farmerId,
      title: `New Confirmed Order #${saved.orderId}!`,
      message: `Order confirmed for ${qty} ${unit} ${crop} at ₹${price}/${unit}. Escrow total ₹${totalAmount.toLocaleString('en-IN')}.`,
      type: 'order',
      referenceId: saved.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Order created with backend verified cost calculation.',
      data: { order: saved },
    });
  }

  /**
   * Update order shipping & lifecycle status
   */
  static async updateOrderStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status, trackingNotes, paymentStatus } = req.body;
    const order = dataStore.getOrderById(req.params.id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (order.buyerId !== req.user.id && order.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const updates: Partial<Order> = {};
    if (status) {
      updates.orderStatus = status as OrderStatus;
      updates.shippingStatus = status as OrderStatus;
    }
    if (trackingNotes) {
      updates.trackingNotes = trackingNotes;
    }
    if (paymentStatus) {
      updates.paymentStatus = paymentStatus as PaymentStatus;
    }

    // If order delivered or completed via shipping timeline, update delivery marker only.
    // Actual escrow release happens in the 4-step Secure Escrow workflow after buyer quality verification.
    if (status === 'delivered' || status === 'completed') {
      updates.deliveryMarked = true;
      updates.trackingNotes = `Delivery milestone recorded. Escrow will release only after buyer quality verification in Secure Escrow.`;
      if (!order.escrowStep || order.escrowStep === 'awaiting_deposit' || order.escrowStep === 'funds_locked') {
        updates.escrowStep = 'farmer_delivered';
        updates.escrowStatus = '🚚 Farmer Delivered • Waiting for Buyer Quality Check';
      }
    }

    // If order cancelled, close the linked conversation (Rule 15)
    if (status === 'cancelled') {
      updates.paymentStatus = 'refunded';
      updates.trackingNotes = 'Order was cancelled. Escrow refunded to buyer.';
      
      const conv = dataStore.conversations.find((c) => c.orderId === order.id || c.orderId === order.orderId);
      if (conv) {
        conv.status = 'closed';
        conv.messages.push({
          id: `msg-${Date.now()}`,
          senderId: 'system',
          senderName: 'Kisan Mitra System',
          senderRole: 'admin',
          text: `[SYSTEM] Order #${order.orderId} was cancelled. This conversation has been closed for audit retention.`,
          timestamp: new Date().toISOString(),
          isRead: true,
        });
      }
    }

    const updated = dataStore.updateOrder(order.id, updates);

    // Notify other party
    const notifyUser = req.user.id === order.buyerId ? order.farmerId : order.buyerId;
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: notifyUser,
      title: `Order #${order.orderId} Update: ${status ? status.toUpperCase() : 'Updated'}`,
      message: trackingNotes || `Order status moved to ${status}.`,
      type: 'order',
      referenceId: order.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Order status updated to ${status || 'updated'}.`,
      data: { order: updated },
    });
  }

  /**
   * Advanced 4-step escrow workflow: deposit -> funds locked -> farmer delivers -> buyer verifies -> payment released.
   */
  static async updateEscrow(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const order = dataStore.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    if (order.buyerId !== req.user.id && order.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Unauthorized to manage this escrow.' });
      return;
    }

    const action = (req.body?.action || 'deposit') as EscrowAction;
    const step = order.escrowStep || (order.paymentStatus === 'escrow_held' || order.paymentStatus === 'escrow_funded' ? 'funds_locked' : 'awaiting_deposit');

    // Owner/role guards
    if (action === 'deposit' && req.user.role !== 'buyer' && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the buyer (or admin demo) can deposit funds.' });
      return;
    }
    if (action === 'mark_delivered' && req.user.role !== 'farmer' && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the farmer (or admin demo) can mark delivery.' });
      return;
    }
    if (action === 'verify_quality' && req.user.role !== 'buyer' && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the buyer (or admin demo) can verify quality.' });
      return;
    }

    const history = order.escrowHistory || [];
    const push = (label: string) => history.push({ label, at: new Date().toISOString() });
    const updates: Partial<Order> = { escrowHistory: history };

    switch (action) {
      case 'deposit': {
        if (order.paymentStatus !== 'pending') {
          res.json({ success: false, message: 'Funds are already locked in escrow for this order.', data: { order } });
          return;
        }
        updates.paymentStatus = 'escrow_held';
        updates.escrowStep = 'funds_locked';
        updates.escrowStatus = '🔒 Funds Locked in Escrow';
        updates.trackingNotes = 'Buyer deposited funds into KisanMitra Escrow via Mock UPI. Funds are protected.';
        push('Buyer deposited funds into KisanMitra Escrow via Mock UPI');
        break;
      }
      case 'mark_delivered': {
        if (order.escrowStep !== 'funds_locked') {
          res.status(400).json({ success: false, message: 'Deposit funds first before marking delivery.', data: { order } });
          return;
        }
        updates.deliveryMarked = true;
        updates.orderStatus = 'delivered';
        updates.shippingStatus = 'delivered';
        updates.escrowStep = 'farmer_delivered';
        updates.escrowStatus = '🚚 Farmer Delivered • Waiting for Buyer Quality Check';
        updates.trackingNotes = 'Farmer marked the lot as delivered. Waiting for buyer quality check.';
        push('Farmer marked lot as delivered');
        break;
      }
      case 'verify_quality': {
        if (!order.deliveryMarked && updates.deliveryMarked !== true) {
          res.status(400).json({ success: false, message: 'Farmer must mark delivery first.', data: { order } });
          return;
        }
        updates.qualityVerified = true;
        updates.escrowStep = order.deliveryMarked ? 'quality_verified' : 'farmer_delivered';
        updates.escrowStatus = '✅ Quality Verified • Payment Releasing...';
        updates.trackingNotes = 'Buyer verified the lot quality. Escrow is being automatically released to the farmer.';
        push('Buyer verified and approved lot quality');
        break;
      }
      case 'release': {
        updates.deliveryMarked = true;
        updates.qualityVerified = true;
        updates.paymentStatus = 'released';
        updates.escrowStep = 'released';
        updates.orderStatus = 'completed';
        updates.shippingStatus = 'completed';
        updates.escrowStatus = '✅ PAYMENT RELEASED';
        updates.escrowReleasedAt = new Date().toISOString();
        updates.trackingNotes = `🎉 ₹${order.totalAmount.toLocaleString('en-IN')} payment released to farmer ${order.farmerName}.`;
        push('Escrow payment released to farmer');
        break;
      }
      default:
        res.status(400).json({ success: false, message: 'Invalid escrow action.' });
        return;
    }

    // Auto-release when both conditions are true (farmer delivered + buyer verified)
    if (
      (updates.deliveryMarked === true || order.deliveryMarked === true) &&
      (updates.qualityVerified === true || order.qualityVerified === true) &&
      updates.escrowStep !== 'released'
    ) {
      updates.paymentStatus = 'released';
      updates.escrowStep = 'released';
      updates.orderStatus = 'completed';
      updates.shippingStatus = 'completed';
      updates.escrowStatus = '✅ PAYMENT RELEASED';
      updates.escrowReleasedAt = new Date().toISOString();
      updates.trackingNotes = `🎉 ₹${order.totalAmount.toLocaleString('en-IN')} payment released to farmer ${order.farmerName}.`;
      push('Both delivery and quality confirmed. Escrow automatically released.');
    }

    const updated = dataStore.updateOrder(order.id, updates);

    // Notify counterpart
    const notifyUser = req.user.id === order.buyerId ? order.farmerId : order.buyerId;
    dataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: notifyUser,
      title: `Order #${order.orderId} Escrow: ${updated.escrowStatus}`,
      message: updated.trackingNotes || `Escrow step updated to ${updated.escrowStep}.`,
      type: 'order',
      referenceId: order.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Escrow updated: ${updated.escrowStatus}`,
      data: { order: updated },
    });
  }

  /**
   * Simulate payment escrow release / deposit
   */
  static async simulatePayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    const order = dataStore.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    const { action = 'deposit' } = req.body; // 'deposit' | 'release'

    if (action === 'deposit') {
      order.paymentStatus = 'escrow_held';
      order.escrowStep = 'funds_locked';
      order.escrowStatus = '🔒 Funds Locked in Escrow';
      order.trackingNotes = 'Payment simulated: Funds held safely in Kisan Mitra Escrow account.';
      order.escrowHistory = [...(order.escrowHistory || []), { label: 'Buyer deposited funds into KisanMitra Escrow', at: new Date().toISOString() }];
    } else if (action === 'release') {
      order.paymentStatus = 'released';
      order.escrowStep = 'released';
      order.escrowStatus = '✅ PAYMENT RELEASED';
      order.orderStatus = 'completed';
      order.shippingStatus = 'completed';
      order.deliveryMarked = true;
      order.qualityVerified = true;
      order.trackingNotes = `🎉 ₹${order.totalAmount.toLocaleString('en-IN')} payment released to farmer ${order.farmerName}.`;
      order.escrowHistory = [...(order.escrowHistory || []), { label: 'Escrow payment released to farmer', at: new Date().toISOString() }];
    }

    res.json({
      success: true,
      message: `Payment simulation successful: ${order.paymentStatus}`,
      data: { order },
    });
  }
}
