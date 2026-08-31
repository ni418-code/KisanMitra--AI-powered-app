import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { MatchingEngine } from '../services/matchingEngine.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { BuyerRequest } from '../../types/index.ts';

export class BuyerRequestController {
  /**
   * Get all buyer requirements with filters
   */
  static async getRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { buyerId, crop, status, search } = req.query;
    let list = dataStore.getBuyerRequests({
      buyerId: buyerId as string,
      crop: crop as string,
      status: status as string,
    });

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (r) =>
          r.cropName.toLowerCase().includes(q) ||
          r.deliveryLocation.district.toLowerCase().includes(q) ||
          r.buyerName.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: {
        requests: list,
        total: list.length,
      },
    });
  }

  /**
   * Get single buyer requirement by ID
   */
  static async getRequestById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const request = dataStore.getBuyerRequestById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: 'Buyer requirement not found.' });
      return;
    }
    res.json({ success: true, data: { request } });
  }

  /**
   * Create buyer requirement (Buyer role only)
   */
  static async createRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'buyer' && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only registered buyers can post crop requirements.', code: 'FORBIDDEN_ROLE' });
      return;
    }

    const {
      cropName,
      quantity,
      unit = 'kg',
      offeredPrice,
      deliveryLocation,
      requiredDate = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      qualityRequirement = 'Grade A (Premium)',
      description,
    } = req.body;

    if (!cropName || !quantity || !offeredPrice) {
      res.status(400).json({ success: false, message: 'Crop name, quantity, and offered price are required.' });
      return;
    }

    const newRequest: BuyerRequest = {
      id: `req-${Date.now()}`,
      buyerId: req.user.id,
      buyerName: req.user.name,
      buyerPhone: req.user.phone,
      buyerUserId: req.user.userId,
      cropName,
      quantity: Number(quantity),
      unit: unit as any,
      offeredPrice: Number(offeredPrice),
      deliveryLocation: deliveryLocation || req.user.location,
      requiredDate,
      qualityRequirement,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    };

    const saved = dataStore.addBuyerRequest(newRequest);

    // Compute immediate matches
    const allProducts = dataStore.getProducts({ status: 'available' });
    const matches = MatchingEngine.findMatchesForRequest(saved, allProducts);

    // Notify top matching farmers
    if (matches.length > 0) {
      matches.slice(0, 3).forEach((m) => {
        dataStore.addNotification({
          id: `notif-${Date.now()}-${Math.random()}`,
          userId: m.product.farmerId,
          title: `New Buyer Requirement Match (${m.matchScore}%)`,
          message: `${saved.buyerName} posted a requirement for ${saved.quantity} ${saved.unit} ${saved.cropName} at ₹${saved.offeredPrice}/${saved.unit}.`,
          type: 'request',
          referenceId: saved.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      });
    }

    res.status(201).json({
      success: true,
      message: 'Buyer requirement posted successfully. Matching engine active.',
      data: {
        request: saved,
        matchCount: matches.length,
        topMatches: matches.slice(0, 5),
      },
    });
  }

  /**
   * Find matching farmers for a buyer requirement
   */
  static async getMatchingFarmers(req: AuthenticatedRequest, res: Response): Promise<void> {
    const request = dataStore.getBuyerRequestById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: 'Buyer requirement not found.' });
      return;
    }

    const allProducts = dataStore.getProducts({ status: 'available' });
    const matches = MatchingEngine.findMatchesForRequest(request, allProducts);

    res.json({
      success: true,
      data: {
        request,
        matches,
        totalMatches: matches.length,
      },
    });
  }

  /**
   * Find matching buyer requests for a farmer's product
   */
  static async getMatchingRequestsForProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    const product = dataStore.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product listing not found.' });
      return;
    }

    const allRequests = dataStore.getBuyerRequests({ status: 'open' });
    const matches = MatchingEngine.findMatchesForProduct(product, allRequests);

    res.json({
      success: true,
      data: {
        product,
        matches,
        totalMatches: matches.length,
      },
    });
  }

  /**
   * Delete a buyer requirement
   */
  static async deleteRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const request = dataStore.getBuyerRequestById(req.params.id);
    if (!request) {
      res.status(404).json({ success: false, message: 'Buyer requirement not found.' });
      return;
    }

    // Role check: Only the buyer who posted or admin can delete
    if (request.buyerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You can only delete your own requirement posts.' });
      return;
    }

    const deleted = dataStore.deleteBuyerRequest(req.params.id);
    if (!deleted) {
      res.status(500).json({ success: false, message: 'Failed to delete buyer requirement.' });
      return;
    }

    res.json({
      success: true,
      message: 'Buyer requirement deleted successfully.',
    });
  }
}
