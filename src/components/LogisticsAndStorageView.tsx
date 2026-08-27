import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Truck,
  Warehouse,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const LogisticsAndStorageView: React.FC = () => {
  const { user, language, t } = useAuth();
  const [activeTab, setActiveTab] = useState<'transport' | 'storage'>('transport');
  
  // Transport Booking Form States
  const [pickupLocation, setPickupLocation] = useState(
    user?.location?.village ? `${user.location.village}, ${user.location.district}` : 'Prathipadu Village, Guntur'
  );
  const [dropLocation, setDropLocation] = useState('Vijayawada Wholesale Yard, Krishna');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('v1');
  const [bookedSuccess, setBookedSuccess] = useState<string | null>(null);

  // Storage Request States
  const [storageCategory, setStorageCategory] = useState<'all' | 'cold' | 'dry'>('all');
  const [storageRequested, setStorageRequested] = useState<string | null>(null);

  const vehicleOptions = [
    {
      id: 'v1',
      name: 'Tata Ace (Chota Hathi)',
      capacity: '1,000 kg (1 Ton)',
      suitableFor: 'Vegetables, Fruits, Quick intra-district transport',
      baseFare: 600,
      perKmRate: 18,
      driverName: 'Ramesh Naidu',
      phone: '+91 98480 12345',
      rating: 4.9,
      trips: 142,
      availableIn: '15 mins',
      distance: '3.2 km away',
    },
    {
      id: 'v2',
      name: 'Mahindra Bolero Maxi Truck Plus',
      capacity: '2,000 kg (2 Tons)',
      suitableFor: 'Tomatoes, Chilli sacks, Medium loads',
      baseFare: 1000,
      perKmRate: 24,
      driverName: 'Suresh Reddy',
      phone: '+91 94401 67890',
      rating: 4.8,
      trips: 98,
      availableIn: '30 mins',
      distance: '6.5 km away',
    },
    {
      id: 'v3',
      name: 'Eicher Pro 2049 (6 Wheeler)',
      capacity: '4,500 kg (4.5 Tons)',
      suitableFor: 'Paddy bags, Cotton bales, Inter-district transport',
      baseFare: 2200,
      perKmRate: 36,
      driverName: 'Venkata Rao',
      phone: '+91 89190 54321',
      rating: 4.7,
      trips: 210,
      availableIn: '1 hour',
      distance: '11.0 km away',
    },
    {
      id: 'v4',
      name: '10-Ton Heavy Container Truck',
      capacity: '10,000 kg (10 Tons)',
      suitableFor: 'Bulk grain transport, Long-haul mandi dispatches',
      baseFare: 4500,
      perKmRate: 52,
      driverName: 'Anil Kumar Transport',
      phone: '+91 90001 11223',
      rating: 4.9,
      trips: 340,
      availableIn: '2 hours',
      distance: '15.4 km away',
    },
  ];

  const storageFacilities = [
    {
      id: 'st1',
      name: 'Guntur Multi-Chamber Cold Storage',
      type: 'cold',
      district: 'Guntur, Andhra Pradesh',
      address: 'NH-16 Bypass, Guntur Rural',
      distance: '8.4 km',
      temperature: '2°C to 8°C (Humidity 85%)',
      suitableFor: 'Red Chilli, Tomatoes, Fresh Vegetables, Seeds',
      totalCapacity: '250 Tons',
      availableSpace: '35 Tons Available',
      rate: '₹45 / quintal / month',
      insurance: 'Govt WDRA Accredited & Insured',
      contact: '+91 863 2234567',
    },
    {
      id: 'st2',
      name: 'Andhra Pradesh State Warehousing Corp (APSWC)',
      type: 'dry',
      district: 'Tenali, Andhra Pradesh',
      address: 'Industrial Area, Tenali',
      distance: '14.2 km',
      temperature: 'Ambient Dry (Pest Controlled & Fumigated)',
      suitableFor: 'Paddy, Rice, Cotton Bales, Maize, Pulses',
      totalCapacity: '1,200 Tons',
      availableSpace: '180 Tons Available',
      rate: '₹22 / quintal / month',
      insurance: '100% e-NWR Electronic Negotiable Receipt',
      contact: '+91 864 4221199',
    },
    {
      id: 'st3',
      name: 'Krishna Agri Fresh Atmosphere Storage',
      type: 'cold',
      district: 'Vijayawada, Andhra Pradesh',
      address: 'Enikepadu, Vijayawada',
      distance: '38.0 km',
      temperature: '0°C to 4°C (Controlled Atmosphere CA)',
      suitableFor: 'Mangoes, Exotic Produce, High-value Horti crops',
      totalCapacity: '180 Tons',
      availableSpace: '18 Tons Available',
      rate: '₹55 / quintal / month',
      insurance: 'WDRA Certified • Solar Powered Backup',
      contact: '+91 866 2889900',
    },
    {
      id: 'st4',
      name: 'Nizamabad Central Warehouse Godown',
      type: 'dry',
      district: 'Nizamabad, Telangana',
      address: 'Mandi Road, Nizamabad',
      distance: '260 km',
      temperature: 'Dry Scientific Storage',
      suitableFor: 'Turmeric Fingers, Maize, Soya',
      totalCapacity: '3,000 Tons',
      availableSpace: '450 Tons Available',
      rate: '₹24 / quintal / month',
      insurance: 'NABARD Approved & Collateral Management',
      contact: '+91 846 2255441',
    },
  ];

  const handleBookTransport = (vehicle: any) => {
    setBookedSuccess(`Transport booked successfully with ${vehicle.name}! Driver ${vehicle.driverName} has been assigned. OTP: 4892.`);
    setTimeout(() => {
      setBookedSuccess(null);
    }, 6000);
  };

  const handleRequestStorage = (facility: any) => {
    setStorageRequested(`Storage space request submitted to ${facility.name}. Facility manager will contact you within 2 hours.`);
    setTimeout(() => {
      setStorageRequested(null);
    }, 6000);
  };

  const filteredStorage = storageFacilities.filter((f) => {
    if (storageCategory === 'all') return true;
    return f.type === storageCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Farm-to-Gate Logistics & WDRA Certified Warehouses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Logistics, Transport & Cold Storage
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Book GPS-tracked transport vehicles for farm pickup and locate verified cold storage / dry warehouses near your farm.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shrink-0">
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'transport'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>🚚 Book Vehicle</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
              activeTab === 'storage'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>🏬 Storage Facilities</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {bookedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{bookedSuccess}</span>
        </div>
      )}

      {storageRequested && (
        <div className="p-4 bg-blue-50 border border-blue-300 text-blue-950 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0" />
          <span>{storageRequested}</span>
        </div>
      )}

      {/* TAB 1: LOGISTICS TRANSPORT BOOKING */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          
          {/* Pickup and Drop Route Planner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-emerald-800" />
              <span>Route & Pickup Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Pickup Location (Farm Gate / Village)</span>
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Enter farm gate / village location"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-700" />
                  <span>Drop Destination (Mandi Yard / Warehouse)</span>
                </label>
                <input
                  type="text"
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  placeholder="Enter destination Mandi / Warehouse"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-semibold">Estimated Distance: <strong>42 km</strong></span>
              <span className="font-semibold">Estimated Transit Time: <strong>1 hr 15 mins</strong></span>
              <span className="text-emerald-800 font-bold">✓ Direct Farm-Gate Handoff</span>
            </div>
          </div>

          {/* Vehicle Fleet Cards */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900">
              Select Vehicle Carrier
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicleOptions.map((v) => {
                const estCost = v.baseFare + 42 * v.perKmRate;
                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black uppercase">
                          {v.capacity}
                        </span>
                        <h3 className="text-base font-black text-slate-900">{v.name}</h3>
                        <p className="text-xs text-slate-500">{v.suitableFor}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-800">₹{estCost.toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] text-slate-400 font-medium">Estimated total</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Driver:</span>
                        <span className="font-bold text-slate-900">{v.driverName}</span>
                        <span className="block text-[10px] text-amber-700 font-bold">⭐ {v.rating} ({v.trips} trips)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Availability:</span>
                        <span className="font-bold text-emerald-800">{v.availableIn}</span>
                        <span className="block text-[10px] text-slate-500">{v.distance}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Base ₹{v.baseFare} + ₹{v.perKmRate}/km
                      </span>
                      <button
                        onClick={() => handleBookTransport(v)}
                        className="px-4.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow transition cursor-pointer flex items-center space-x-1.5"
                      >
                        <span>Book Vehicle Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COLD STORAGE & WAREHOUSE LOCATOR */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          
          {/* Storage Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Filter Storage Type:</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStorageCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  storageCategory === 'all'
                    ? 'bg-slate-900 text-white font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Facilities
              </button>
              <button
                onClick={() => setStorageCategory('cold')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  storageCategory === 'cold'
                    ? 'bg-teal-800 text-white font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ❄️ Cold Storages (Perishables)
              </button>
              <button
                onClick={() => setStorageCategory('dry')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  storageCategory === 'dry'
                    ? 'bg-amber-800 text-white font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🌾 Dry Warehouses (Grains)
              </button>
            </div>
          </div>

          {/* Storage List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStorage.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-teal-300 transition-all shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        s.type === 'cold'
                          ? 'bg-teal-100 text-teal-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {s.type === 'cold' ? '❄️ Cold Storage' : '🌾 Dry Grain Warehouse'}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{s.address} ({s.distance} from your farm)</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-teal-800">{s.rate}</span>
                    <span className="block text-[10px] text-emerald-700 font-bold">{s.availableSpace}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs text-slate-600">
                  <p><strong>Environment:</strong> {s.temperature}</p>
                  <p><strong>Suitable For:</strong> {s.suitableFor}</p>
                  <p className="text-[11px] text-emerald-800 font-semibold">🛡️ {s.insurance}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{s.contact}</span>
                  </span>

                  <button
                    onClick={() => handleRequestStorage(s)}
                    className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow transition cursor-pointer"
                  >
                    Request Storage Space
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
