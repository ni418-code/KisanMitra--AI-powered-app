import { Request, Response } from 'express';
import { MarketService } from '../services/marketService.ts';
import { MSPService } from '../services/mspService.ts';
import { RecommendationService } from '../services/recommendationService.ts';

export class MarketController {
  /**
   * Get all live AGMARKNET market prices with filters & sorting
   */
  static async getPrices(req: Request, res: Response): Promise<void> {
    const { crop, state, district, market, category, search, sortBy } = req.query;

    const prices = MarketService.getAllPrices({
      crop: crop as string,
      state: state as string,
      district: district as string,
      market: market as string,
      category: category as string,
      search: search as string,
      sortBy: sortBy as any,
    });

    const syncStatus = MarketService.getSyncStatus();

    res.json({
      success: true,
      data: {
        prices,
        total: prices.length,
        source: 'Government AGMARKNET (data.gov.in)',
        lastUpdated: syncStatus.lastSuccessAt,
        syncStatus,
      },
    });
  }

  /**
   * Get 7-day and 30-day historical price trends for a specific crop
   */
  static async getCropDetails(req: Request, res: Response): Promise<void> {
    const cropName = req.params.cropName;
    const { district } = req.query;

    if (!cropName) {
      res.status(400).json({ success: false, message: 'Crop name is required.' });
      return;
    }

    const details = MarketService.getCropHistory(cropName, district as string);
    const msp = MSPService.getMSPForCrop(cropName);

    res.json({
      success: true,
      data: {
        ...details,
        officialMSP: msp || null,
      },
    });
  }

  /**
   * Get official Ministry MSP benchmark data
   */
  static async getMSP(req: Request, res: Response): Promise<void> {
    const { season, search } = req.query;
    const mspList = MSPService.getAllMSP(season as string, search as string);

    res.json({
      success: true,
      data: {
        mspList,
        total: mspList.length,
        source: 'Ministry of Agriculture & Farmers Welfare, GoI',
        marketingYear: '2024-25',
      },
    });
  }

  /**
   * Calculate Estimated Net Return across nearby markets after transport & handling
   */
  static async getNetReturnRecommendations(req: Request, res: Response): Promise<void> {
    const { cropName = 'Tomato', quantityKg = 1000, farmerDistrict = 'Guntur', farmerState = 'Andhra Pradesh' } = req.query;

    const recommendations = RecommendationService.getNetReturnRecommendations({
      cropName: String(cropName),
      quantityKg: Number(quantityKg),
      farmerDistrict: String(farmerDistrict),
      farmerState: String(farmerState),
    });

    res.json({
      success: true,
      data: recommendations,
    });
  }

  /**
   * Trigger Manual Synchronization from data.gov.in
   */
  static async triggerSync(req: Request, res: Response): Promise<void> {
    const result = await MarketService.syncMarketData();
    res.json({
      success: result.success,
      message: result.success ? `Synchronized ${result.count} authentic government records.` : `Sync error: ${result.error}`,
      data: MarketService.getSyncStatus(),
    });
  }
}
