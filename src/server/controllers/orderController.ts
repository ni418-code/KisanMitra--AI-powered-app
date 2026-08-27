import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Order, OrderStatus, PaymentStatus } from '../../types/index.ts';

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
      paymentStatus: 'escrow_held',
      paymentMethod: 'Escrow Simulation (UPI / Bank Transfer)',
      shippingStatus: 'accepted',
      orderStatus: 'accepted',
      trackingNotes: 'Order created with guaranteed escrow protection.',
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

    // If order delivered or completed, mark payment as paid to farmer
    if (status === 'delivered' || status === 'completed') {
      updates.paymentStatus = 'paid';
      updates.trackingNotes = `Produce successfully verified and delivered. Escrow released to Farmer ${order.farmerName}.`;
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
      order.trackingNotes = 'Payment simulated: Funds held safely in Kisan Mitra Escrow account.';
    } else if (action === 'release') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'completed';
      order.shippingStatus = 'completed';
      order.trackingNotes = 'Payment simulated: Escrow funds disbursed directly to farmer bank account.';
    }

    res.json({
      success: true,
      message: `Payment simulation successful: ${order.paymentStatus}`,
      data: { order },
    });
  }
}
