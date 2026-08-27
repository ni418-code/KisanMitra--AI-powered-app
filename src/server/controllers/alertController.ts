import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { PriceAlert } from '../../types/index.ts';

export class AlertController {
  static async getAlerts(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const alerts = dataStore.getAlerts(req.user.id);
    res.json({
      success: true,
      data: { alerts, total: alerts.length },
    });
  }

  static async createAlert(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { crop, targetPrice, market = 'All', district = 'All', condition = 'above' } = req.body;
    if (!crop || !targetPrice) {
      res.status(400).json({ success: false, message: 'Crop and target price are required.' });
      return;
    }

    const newAlert: PriceAlert = {
      id: `alt-${Date.now()}`,
      userId: req.user.id,
      crop,
      targetPrice: Number(targetPrice),
      market,
      district,
      condition: condition as any,
      active: true,
      triggeredCount: 0,
      createdAt: new Date().toISOString(),
    };

    const saved = dataStore.addAlert(newAlert);
    res.status(201).json({
      success: true,
      message: `Price alert set for ${crop} when rate is ${condition} ₹${targetPrice}/kg.`,
      data: { alert: saved },
    });
  }

  static async toggleAlert(req: AuthenticatedRequest, res: Response): Promise<void> {
    const alert = dataStore.alerts.find((a) => a.id === req.params.id && a.userId === req.user?.id);
    if (!alert) {
      res.status(404).json({ success: false, message: 'Alert not found.' });
      return;
    }
    alert.active = !alert.active;
    res.json({ success: true, data: { alert } });
  }

  static async deleteAlert(req: AuthenticatedRequest, res: Response): Promise<void> {
    const success = dataStore.deleteAlert(req.params.id);
    res.json({ success, message: success ? 'Price alert removed.' : 'Alert not found.' });
  }
}
