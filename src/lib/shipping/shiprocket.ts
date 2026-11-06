import { Shipment, TrackingEvent } from '@/types';

export interface ServiceabilityResult {
  pincode: string;
  isServiceable: boolean;
  courierPartners: {
    id: number;
    name: string;
    rate: number;
    estimatedDays: number;
    etd: string;
    codAvailable: boolean;
  }[];
}

export class ShiprocketService {
  private email: string;
  private password: string;
  private token: string | null = null;

  constructor() {
    this.email = process.env.SHIPROCKET_EMAIL || '';
    this.password = process.env.SHIPROCKET_PASSWORD || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.email && this.password);
  }

  /**
   * Check Indian PIN code serviceability across couriers
   */
  public async checkServiceability(
    deliveryPincode: string,
    pickupPincode = '400001'
  ): Promise<ServiceabilityResult> {
    if (this.isConfigured()) {
      // Production hook: Call Shiprocket API v2
      // try { ... } catch {}
    }

    // Zero-cost simulated learning mode
    const cleanPincode = deliveryPincode.trim();
    const isValidIndianPin = /^[1-9][0-9]{5}$/.test(cleanPincode);

    if (!isValidIndianPin) {
      return {
        pincode: cleanPincode,
        isServiceable: false,
        courierPartners: [],
      };
    }

    return {
      pincode: cleanPincode,
      isServiceable: true,
      courierPartners: [
        {
          id: 101,
          name: 'Delhivery Surface Express',
          rate: 0,
          estimatedDays: 1,
          etd: 'Tomorrow by 9:00 PM',
          codAvailable: true,
        },
        {
          id: 102,
          name: 'BlueDart Air FastTrack',
          rate: 49,
          estimatedDays: 1,
          etd: 'Tomorrow by 2:00 PM',
          codAvailable: true,
        },
        {
          id: 103,
          name: 'Ecom Express Standard',
          rate: 0,
          estimatedDays: 2,
          etd: 'Within 2-3 Business Days',
          codAvailable: true,
        },
        {
          id: 104,
          name: 'DTDC Surface Express',
          rate: 0,
          estimatedDays: 3,
          etd: 'Within 3 Business Days',
          codAvailable: true,
        },
      ],
    };
  }

  /**
   * Create shipment and assign Air Waybill (AWB)
   */
  public async createShipment(
    orderId: string,
    courierName = 'Delhivery Surface Express',
    destinationCity = 'Mumbai'
  ): Promise<Shipment> {
    if (this.isConfigured()) {
      // Production hook: Shiprocket Adhoc Order & AWB assignment
    }

    // Zero-cost simulated shipment
    const awbCode = `SR${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const now = new Date();

    const trackingEvents: TrackingEvent[] = [
      {
        status: 'MANIFESTED',
        location: 'ShopSphere Logistics Hub, Bhiwandi, MH',
        timestamp: now.toISOString(),
        description: 'Electronic shipping info received. AWB generated & parcel packed.',
      },
      {
        status: 'PICKED_UP',
        location: 'Mumbai Central Gateway',
        timestamp: new Date(now.getTime() + 1000 * 60 * 60 * 2).toISOString(),
        description: `Package picked up by ${courierName} and scanned at inbound facility.`,
      },
      {
        status: 'IN_TRANSIT',
        location: `${destinationCity} Main Distribution Center`,
        timestamp: new Date(now.getTime() + 1000 * 60 * 60 * 8).toISOString(),
        description: 'Shipment has arrived at destination sorting hub.',
      },
      {
        status: 'OUT_FOR_DELIVERY',
        location: `${destinationCity} Delivery Station`,
        timestamp: new Date(now.getTime() + 1000 * 60 * 60 * 18).toISOString(),
        description: 'Out for delivery with delivery agent. Contactless OTP verification active.',
      },
    ];

    return {
      id: `ship_${Date.now()}`,
      order_id: orderId,
      awb_code: awbCode,
      courier_name: courierName,
      current_status: 'IN_TRANSIT',
      estimated_delivery: new Date(now.getTime() + 86400000).toISOString(),
      tracking_events: trackingEvents,
    };
  }
}

export const shiprocket = new ShiprocketService();

