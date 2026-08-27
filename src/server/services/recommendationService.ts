import { MarketService } from './marketService.ts';

export interface MarketNetReturnRecommendation {
  market: string;
  district: string;
  state: string;
  sellingPricePerKg: number;
  modalPriceQuintal: number;
  distanceKm: number;
  transportCostPerKg: number;
  handlingCostPerKg: number;
  estimatedNetReturnPerKg: number;
  totalNetProfitForLot: number;
  recommendationRank: number;
  isRecommendedBest: boolean;
  insight: string;
}

export class RecommendationService {
  /**
   * Calculate realistic net return for farmer's crop across multiple nearby markets
   * Accounts for transport cost per km, handling/loading, and distance.
   */
  static getNetReturnRecommendations(params: {
    cropName: string;
    quantityKg: number;
    farmerDistrict: string;
    farmerState: string;
  }): {
    cropName: string;
    quantityKg: number;
    bestMarket: string;
    maxNetReturnPerKg: number;
    recommendations: MarketNetReturnRecommendation[];
  } {
    const { cropName, quantityKg, farmerDistrict, farmerState } = params;
    const prices = MarketService.getAllPrices({ crop: cropName });

    const marketsToEvaluate = prices.length > 0
      ? prices
      : MarketService.getAllPrices().slice(0, 5);

    // Approximate distance heuristic based on district match
    const recommendations: MarketNetReturnRecommendation[] = marketsToEvaluate.map((m, idx) => {
      let distanceKm = 15;
      if (m.district.toLowerCase() === farmerDistrict.toLowerCase()) {
        distanceKm = 12 + (idx * 5); // 12-25km local mandi
      } else if (m.state.toLowerCase() === farmerState.toLowerCase()) {
        distanceKm = 65 + (idx * 20); // 65-120km regional mandi
      } else {
        distanceKm = 220 + (idx * 45); // 220km+ inter-state terminal mandi
      }

      // Logistics model:
      // Base transport rate approx ₹0.025 / kg / 10km (or ₹2.5/km for small truck)
      const transportCostPerKg = Number(Math.max(0.4, (distanceKm * 0.032)).toFixed(2));
      const handlingCostPerKg = 0.35; // Loading, Mandi cess, weighing

      const sellingPricePerKg = m.pricePerKg;
      const estimatedNetReturnPerKg = Number((sellingPricePerKg - transportCostPerKg - handlingCostPerKg).toFixed(2));
      const totalNetProfitForLot = Math.round(estimatedNetReturnPerKg * quantityKg);

      return {
        market: m.market,
        district: m.district,
        state: m.state,
        sellingPricePerKg,
        modalPriceQuintal: m.modalPrice,
        distanceKm,
        transportCostPerKg,
        handlingCostPerKg,
        estimatedNetReturnPerKg,
        totalNetProfitForLot,
        recommendationRank: 0,
        isRecommendedBest: false,
        insight: '',
      };
    });

    // Sort by net return descending
    recommendations.sort((a, b) => b.estimatedNetReturnPerKg - a.estimatedNetReturnPerKg);

    recommendations.forEach((rec, idx) => {
      rec.recommendationRank = idx + 1;
      if (idx === 0) {
        rec.isRecommendedBest = true;
        rec.insight = `Top net yield. Even after deducting ₹${rec.transportCostPerKg}/kg transport (${rec.distanceKm} km), you earn ₹${rec.estimatedNetReturnPerKg}/kg net profit.`;
      } else {
        const diff = Number((recommendations[0].estimatedNetReturnPerKg - rec.estimatedNetReturnPerKg).toFixed(2));
        rec.insight = `₹${diff}/kg lower net return due to ${rec.distanceKm > 50 ? 'higher transit distance' : 'lower wholesale mandi rate'}.`;
      }
    });

    const best = recommendations[0] || {
      market: 'Local Guntur Mandi',
      estimatedNetReturnPerKg: 26.5,
    };

    return {
      cropName,
      quantityKg,
      bestMarket: best.market,
      maxNetReturnPerKg: best.estimatedNetReturnPerKg,
      recommendations,
    };
  }
}
