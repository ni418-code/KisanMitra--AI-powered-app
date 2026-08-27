import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { Product } from '../../types/index.ts';

export class ProductController {
  /**
   * Get all products with filters
   */
  static async getProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { farmerId, crop, status, search } = req.query;
    let list = dataStore.getProducts({
      farmerId: farmerId as string,
      crop: crop as string,
      status: status as string,
    });

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.cropName.toLowerCase().includes(q) ||
          p.location.district.toLowerCase().includes(q) ||
          p.variety?.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: {
        products: list,
        total: list.length,
      },
    });
  }

  /**
   * Get single product by ID
   */
  static async getProductById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const product = dataStore.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Produce listing not found.' });
      return;
    }
    res.json({ success: true, data: { product } });
  }

  /**
   * Create product listing (Farmer role only)
   */
  static async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'farmer' && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only registered farmers can list produce.', code: 'FORBIDDEN_ROLE' });
      return;
    }

    const {
      cropName,
      category = 'Vegetables',
      variety,
      quantity,
      unit = 'kg',
      expectedPrice,
      quality = 'Grade A (Premium)',
      grade = 'A',
      location,
      availableFrom = new Date().toISOString().split('T')[0],
      availableUntil = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      images = [],
      description,
    } = req.body;

    if (!cropName || !quantity || !expectedPrice) {
      res.status(400).json({ success: false, message: 'Crop name, quantity and expected price are required.' });
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      farmerId: req.user.id,
      farmerName: req.user.name,
      farmerPhone: req.user.phone,
      farmerUserId: req.user.userId,
      cropName,
      category,
      variety,
      quantity: Number(quantity),
      unit: unit as any,
      expectedPrice: Number(expectedPrice),
      quality: quality as any,
      grade,
      location: location || req.user.location,
      availableFrom,
      availableUntil,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'],
      description,
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    const saved = dataStore.addProduct(newProduct);

    res.status(201).json({
      success: true,
      message: 'Produce listed successfully on Kisan Mitra network.',
      data: { product: saved },
    });
  }

  /**
   * Update product listing (Owner only)
   */
  static async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existing = dataStore.getProductById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Produce listing not found.' });
      return;
    }

    if (existing.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You can only edit your own produce listings.' });
      return;
    }

    const updated = dataStore.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Produce listing updated successfully.',
      data: { product: updated },
    });
  }

  /**
   * Delete product listing (Owner only)
   */
  static async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const existing = dataStore.getProductById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Produce listing not found.' });
      return;
    }

    if (existing.farmerId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You can only delete your own produce listings.' });
      return;
    }

    dataStore.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Produce listing removed.',
    });
  }
}
