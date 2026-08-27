import { MSPData } from '../../types/index.ts';

// Official Minimum Support Prices (MSP) fixed by Government of India (Ministry of Agriculture)
export const OFFICIAL_MSP_DATA: MSPData[] = [
  {
    id: 'msp-1',
    crop: 'Paddy (Common)',
    category: 'Cereals',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 2300,
    mspPerKg: 23.0,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Increase of ₹117/quintal over previous year (Cost A2+FL + 50%)',
  },
  {
    id: 'msp-2',
    crop: 'Paddy (Grade A)',
    category: 'Cereals',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 2320,
    mspPerKg: 23.2,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Premium grade paddy procurement price',
  },
  {
    id: 'msp-3',
    crop: 'Wheat',
    category: 'Cereals',
    season: 'Rabi',
    marketingYear: '2024-25',
    mspValue: 2275,
    mspPerKg: 22.75,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-04-01',
    notes: 'Procurement season benchmark with 105% margin over cost',
  },
  {
    id: 'msp-4',
    crop: 'Cotton (Medium Staple)',
    category: 'Commercial',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 7121,
    mspPerKg: 71.21,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'CCI direct procurement minimum support guarantee',
  },
  {
    id: 'msp-5',
    crop: 'Cotton (Long Staple)',
    category: 'Commercial',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 7521,
    mspPerKg: 75.21,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Long staple cotton standard',
  },
  {
    id: 'msp-6',
    crop: 'Maize',
    category: 'Cereals',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 2225,
    mspPerKg: 22.25,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'National feed & industrial grain MSP standard',
  },
  {
    id: 'msp-7',
    crop: 'Soybean (Yellow)',
    category: 'Oilseeds',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 4892,
    mspPerKg: 48.92,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Critical protein & oilseed incentive price',
  },
  {
    id: 'msp-8',
    crop: 'Groundnut',
    category: 'Oilseeds',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 6783,
    mspPerKg: 67.83,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Groundnut pod procurement standard price',
  },
  {
    id: 'msp-9',
    crop: 'Gram (Chana)',
    category: 'Pulses',
    season: 'Rabi',
    marketingYear: '2024-25',
    mspValue: 5440,
    mspPerKg: 54.4,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-04-01',
    notes: 'Pulse self-sufficiency support standard',
  },
  {
    id: 'msp-10',
    crop: 'Mustard / Rapeseed',
    category: 'Oilseeds',
    season: 'Rabi',
    marketingYear: '2024-25',
    mspValue: 5650,
    mspPerKg: 56.5,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-04-01',
    notes: 'High oil yield standard guarantee',
  },
  {
    id: 'msp-11',
    crop: 'Tur / Arhar (Red Gram)',
    category: 'Pulses',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 7550,
    mspPerKg: 75.5,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Highest return pulse crop incentive',
  },
  {
    id: 'msp-12',
    crop: 'Moong (Green Gram)',
    category: 'Pulses',
    season: 'Kharif',
    marketingYear: '2024-25',
    mspValue: 8682,
    mspPerKg: 86.82,
    unit: '₹/Quintal',
    source: 'Ministry of Agriculture & Farmers Welfare, GoI',
    effectiveDate: '2024-10-01',
    notes: 'Short duration summer/kharif pulse MSP',
  }
];

export class MSPService {
  static getAllMSP(season?: string, search?: string): MSPData[] {
    let list = [...OFFICIAL_MSP_DATA];
    if (season && season !== 'All') {
      list = list.filter((item) => item.season.toLowerCase() === season.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.crop.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
    }
    return list;
  }

  static getMSPForCrop(cropName: string): MSPData | undefined {
    const q = cropName.toLowerCase();
    return OFFICIAL_MSP_DATA.find(
      (m) =>
        m.crop.toLowerCase().includes(q) ||
        q.includes(m.crop.toLowerCase().split(' ')[0])
    );
  }
}
