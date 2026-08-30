import { Product, BuyerRequest, MatchResult } from '../../types/index.ts';

export class MatchingEngine {
  /**
   * Calculate match score between a BuyerRequest and a Farmer Product Listing
   */
  static match(request: BuyerRequest, product: Product): MatchResult {
    let cropMatch = 0;
    let locationMatch = 0;
    let quantityMatch = 0;
    let priceMatch = 0;
    let availabilityMatch = 0;

    const reasons: string[] = [];

    // 1. Crop Match (Max 40 pts)
    const reqCrop = request.cropName.toLowerCase().trim();
    const prodCrop = product.cropName.toLowerCase().trim();

    if (reqCrop === prodCrop) {
      cropMatch = 40;
      reasons.push(`Exact crop match (${product.cropName})`);
    } else if (reqCrop.includes(prodCrop) || prodCrop.includes(reqCrop)) {
      cropMatch = 35;
      reasons.push(`Close commodity category match`);
    } else {
      cropMatch = 0;
    }

    // 2. Location Match (Max 20 pts)
    const reqState = (request.deliveryLocation?.state || '').toLowerCase().trim();
    const prodState = (product.location?.state || '').toLowerCase().trim();
    const reqDist = (request.deliveryLocation?.district || '').toLowerCase().trim();
    const prodDist = (product.location?.district || '').toLowerCase().trim();

    if (reqDist && prodDist && reqDist === prodDist) {
      locationMatch = 20;
      reasons.push(`Local within same district (${product.location.district})`);
    } else if (reqState && prodState && reqState === prodState) {
      locationMatch = 14;
      reasons.push(`Same state transport zone (${product.location.state})`);
    } else {
      locationMatch = 8;
      reasons.push(`Inter-state transit required`);
    }

    // 3. Quantity Match (Max 15 pts)
    // Convert units to kg for comparison
    const toKg = (qty: number, unit: string) => {
      const u = (unit || 'kg').toLowerCase();
      if (u === 'ton' || u === 'tonne') return qty * 1000;
      if (u === 'quintal') return qty * 100;
      return qty;
    };

    const reqKg = toKg(request.quantity, request.unit);
    const prodKg = toKg(product.quantity, product.unit);

    if (prodKg >= reqKg) {
      quantityMatch = 15;
      reasons.push(`Farmer has sufficient volume (${product.quantity} ${product.unit} available for required ${request.quantity} ${request.unit})`);
    } else if (prodKg >= reqKg * 0.7) {
      quantityMatch = 10;
      reasons.push(`Farmer fulfills ${(prodKg / reqKg * 100).toFixed(0)}% of required lot`);
    } else {
      quantityMatch = 5;
      reasons.push(`Partial quantity available (${product.quantity} ${product.unit})`);
    }

    // 4. Price Match (Max 15 pts)
    // Normalize price per kg
    const reqPriceKg = request.offeredPrice / (request.unit === 'quintal' ? 100 : request.unit === 'ton' ? 1000 : 1);
    const prodPriceKg = product.expectedPrice / (product.unit === 'quintal' ? 100 : product.unit === 'ton' ? 1000 : 1);

    if (reqPriceKg >= prodPriceKg) {
      priceMatch = 15;
      reasons.push(`Buyer offer (₹${reqPriceKg}/kg) meets or exceeds farmer expected rate (₹${prodPriceKg}/kg)`);
    } else {
      const diffPct = ((prodPriceKg - reqPriceKg) / prodPriceKg) * 100;
      if (diffPct <= 10) {
        priceMatch = 12;
        reasons.push(`Price difference is within negotiable 10% margin`);
      } else if (diffPct <= 20) {
        priceMatch = 8;
        reasons.push(`Price difference is within 20% margin`);
      } else {
        priceMatch = 3;
        reasons.push(`Moderate price spread between offer and expected`);
      }
    }

    // 5. Availability & Quality (Max 10 pts)
    if (product.status === 'available') {
      availabilityMatch += 5;
    }
    if (request.qualityRequirement && product.quality) {
      if (request.qualityRequirement.toLowerCase() === product.quality.toLowerCase()) {
        availabilityMatch += 5;
        reasons.push(`Exact quality tier match: ${product.quality}`);
      } else {
        availabilityMatch += 3;
      }
    } else {
      availabilityMatch += 4;
    }

    const totalScore = Math.min(100, Math.round(cropMatch + locationMatch + quantityMatch + priceMatch + availabilityMatch));

    return {
      targetId: product.id || request.id,
      buyerId: request.buyerId,
      buyerName: request.buyerName,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      cropName: product.cropName,
      quantity: product.quantity,
      expectedPrice: product.expectedPrice,
      offeredPrice: request.offeredPrice,
      product,
      buyerRequest: request,
      matchScore: totalScore,
      breakdown: {
        cropMatch,
        cropScore: cropMatch,
        locationMatch,
        locationScore: locationMatch,
        quantityMatch,
        quantityScore: quantityMatch,
        priceMatch,
        priceScore: priceMatch,
        availabilityMatch,
        availabilityScore: availabilityMatch,
      },
      explanation: reasons.join(' • '),
      reasons,
    };
  }

  /**
   * Find matching products for a buyer request, sorted by match score
   */
  static findMatchesForRequest(request: BuyerRequest, products: Product[]): MatchResult[] {
    return products
      .filter((p) => p.status === 'available')
      .map((p) => MatchingEngine.match(request, p))
      .filter((m) => m.breakdown.cropMatch > 0) // only matching crops
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Find matching buyer requests for a farmer's product
   */
  static findMatchesForProduct(product: Product, requests: BuyerRequest[]): MatchResult[] {
    return requests
      .filter((r) => r.status === 'open' || r.status === 'matched')
      .map((r) => MatchingEngine.match(r, product))
      .filter((m) => m.breakdown.cropMatch > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}
