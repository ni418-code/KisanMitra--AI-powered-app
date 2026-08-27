import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { MarketController } from '../controllers/marketController.ts';
import { ProductController } from '../controllers/productController.ts';
import { BuyerRequestController } from '../controllers/buyerRequestController.ts';
import { OfferController } from '../controllers/offerController.ts';
import { OrderController } from '../controllers/orderController.ts';
import { ChatController } from '../controllers/chatController.ts';
import { AlertController } from '../controllers/alertController.ts';
import { AIController } from '../controllers/aiController.ts';
import { AdminController } from '../controllers/adminController.ts';
import { requireAuth, requireRole } from '../middleware/auth.ts';
import { dataStore } from '../services/dataStore.ts';

const router = Router();

// ================= AUTH ROUTES =================
router.post('/auth/send-otp', AuthController.sendOTP);
router.post('/auth/verify-otp', AuthController.verifyOTP);
router.post('/auth/demo-login', AuthController.demoLogin);
router.get('/auth/me', requireAuth, AuthController.getMe);
router.put('/auth/profile', requireAuth, AuthController.updateProfile);

// ================= MARKET INTELLIGENCE ROUTES =================
router.get('/markets/prices', MarketController.getPrices);
router.get('/markets/crops/:cropName', MarketController.getCropDetails);
router.get('/markets/msp', MarketController.getMSP);
router.get('/markets/net-return', MarketController.getNetReturnRecommendations);
router.post('/markets/sync', requireAuth, MarketController.triggerSync);

// ================= FARMER PRODUCE ROUTES =================
router.get('/products', ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);
router.post('/products', requireAuth, requireRole('farmer', 'admin'), ProductController.createProduct);
router.put('/products/:id', requireAuth, requireRole('farmer', 'admin'), ProductController.updateProduct);
router.delete('/products/:id', requireAuth, requireRole('farmer', 'admin'), ProductController.deleteProduct);
router.get('/products/:id/matching-requests', requireAuth, BuyerRequestController.getMatchingRequestsForProduct);

// ================= BUYER REQUIREMENTS ROUTES =================
router.get('/buyer-requests', BuyerRequestController.getRequests);
router.get('/buyer-requests/:id', BuyerRequestController.getRequestById);
router.post('/buyer-requests', requireAuth, requireRole('buyer', 'admin'), BuyerRequestController.createRequest);
router.get('/buyer-requests/:id/matching-farmers', requireAuth, BuyerRequestController.getMatchingFarmers);

// ================= OFFERS & NEGOTIATIONS =================
router.get('/offers', requireAuth, OfferController.getOffers);
router.post('/offers', requireAuth, OfferController.createOffer);
router.put('/offers/:id/accept', requireAuth, OfferController.acceptOffer);
router.put('/offers/:id/reject', requireAuth, OfferController.rejectOffer);

// ================= ORDERS =================
router.get('/orders', requireAuth, OrderController.getOrders);
router.get('/orders/:id', requireAuth, OrderController.getOrderById);
router.post('/orders', requireAuth, OrderController.createOrder);
router.patch('/orders/:id/status', requireAuth, OrderController.updateOrderStatus);
router.post('/orders/:id/simulate-payment', requireAuth, OrderController.simulatePayment);

// ================= REAL-TIME CHAT =================
router.get('/conversations', requireAuth, ChatController.getConversations);
router.post('/conversations', requireAuth, ChatController.getOrCreateConversation);
router.post('/conversations/:conversationId/messages', requireAuth, ChatController.sendMessage);

// ================= NOTIFICATIONS =================
router.get('/notifications', requireAuth, (req: any, res) => {
  const notifs = dataStore.getNotifications(req.user.id);
  res.json({ success: true, data: { notifications: notifs, unreadCount: notifs.filter((n) => !n.isRead).length } });
});

router.patch('/notifications/:id/read', requireAuth, (req, res) => {
  const success = dataStore.markNotificationRead(req.params.id);
  res.json({ success, message: success ? 'Marked read' : 'Notification not found' });
});

// ================= PRICE ALERTS =================
router.get('/alerts', requireAuth, AlertController.getAlerts);
router.post('/alerts', requireAuth, AlertController.createAlert);
router.patch('/alerts/:id/toggle', requireAuth, AlertController.toggleAlert);
router.delete('/alerts/:id', requireAuth, AlertController.deleteAlert);

// ================= MULTILINGUAL AI ASSISTANT =================
router.post('/ai/chat', AIController.chat);

// ================= ADMIN ROUTES =================
router.get('/admin/stats', requireAuth, requireRole('admin'), AdminController.getPlatformStats);
router.get('/admin/users', requireAuth, requireRole('admin'), AdminController.getUsers);
router.get('/admin/disputes', requireAuth, requireRole('admin'), AdminController.getDisputes);

export default router;
