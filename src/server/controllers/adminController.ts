import { Response } from 'express';
import { dataStore } from '../services/dataStore.ts';
import { MarketService } from '../services/marketService.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export class AdminController {
  static async getPlatformStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    const totalUsers = dataStore.users.length;
    const farmersCount = dataStore.users.filter((u) => u.role === 'farmer').length;
    const buyersCount = dataStore.users.filter((u) => u.role === 'buyer').length;
    const productsCount = dataStore.products.length;
    const activeProducts = dataStore.products.filter((p) => p.status === 'available').length;
    const requestsCount = dataStore.buyerRequests.length;
    const ordersCount = dataStore.orders.length;
    const completedOrders = dataStore.orders.filter((o) => o.orderStatus === 'completed' || o.orderStatus === 'delivered').length;
    const totalTransactionValue = dataStore.orders.reduce((acc, o) => acc + o.totalAmount, 0);

    const syncStatus = MarketService.getSyncStatus();

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          farmersCount,
          buyersCount,
          productsCount,
          activeProducts,
          requestsCount,
          ordersCount,
          completedOrders,
          totalTransactionValue,
        },
        marketSync: syncStatus,
      },
    });
  }

  static async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      data: {
        users: dataStore.users,
        total: dataStore.users.length,
      },
    });
  }

  static async getDisputes(req: AuthenticatedRequest, res: Response): Promise<void> {
    // Simulated dispute log for administrative review
    const disputes = [
      {
        id: 'disp-1',
        orderId: 'KM-2026-0891',
        raisedBy: 'usr-2',
        reason: 'Transit delay due to heavy rain in NH-16 corridor',
        status: 'investigating',
        createdAt: '2026-08-25T17:00:00.000Z',
      }
    ];

    res.json({
      success: true,
      data: { disputes },
    });
  }
}
