import { Product, ProviderHealth } from '@/types';
import { MarketplaceAdapter, SearchOptions } from './provider-types';
import { AmazonProvider } from './amazon-provider';
import { FlipkartProvider } from './flipkart-provider';
import { EbayProvider } from './ebay-provider';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private adapters: Map<string, MarketplaceAdapter> = new Map();

  private constructor() {
    this.adapters.set('amazon', new AmazonProvider());
    this.adapters.set('flipkart', new FlipkartProvider());
    this.adapters.set('ebay', new EbayProvider());
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public getAdapter(id: string): MarketplaceAdapter | undefined {
    return this.adapters.get(id);
  }

  public async searchAllMarketplaces(options: SearchOptions): Promise<Product[]> {
    const promises = Array.from(this.adapters.values()).map(async (adapter) => {
      try {
        const res = await adapter.search(options);
        return res.products;
      } catch (err) {
        console.error(`Error querying provider ${adapter.id}:`, err);
        return [] as Product[];
      }
    });

    const results = await Promise.all(promises);
    return results.flat();
  }

  public async getExternalProductBySlug(slug: string): Promise<Product | null> {
    for (const adapter of this.adapters.values()) {
      const match = await adapter.getBySlug(slug);
      if (match) return match;
    }
    return null;
  }

  public getProvidersHealth(): ProviderHealth[] {
    const amazon = this.adapters.get('amazon')!;
    const flipkart = this.adapters.get('flipkart')!;
    const ebay = this.adapters.get('ebay')!;

    const hasCashfree = Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
    const hasShiprocket = Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);

    return [
      {
        id: 'shopsphere',
        name: 'ShopSphere Inventory',
        type: 'marketplace',
        mode: 'live',
        is_configured: true,
        status_message: 'Native warehouse inventory & order fulfillment active',
        docs_url: 'https://shopsphere.in',
        required_env_vars: ['NEXT_PUBLIC_SUPABASE_URL'],
      },
      {
        id: 'amazon',
        name: amazon.name,
        type: 'marketplace',
        mode: amazon.isConfigured() ? 'live' : 'external_link',
        is_configured: amazon.isConfigured(),
        status_message: amazon.isConfigured()
          ? 'Connected to Amazon PA-API 5.0'
          : 'API not connected. Use the external Amazon India search link for live listings.',
        docs_url: 'https://webservices.amazon.com/paapi5/documentation/',
        required_env_vars: ['AMAZON_ACCESS_KEY', 'AMAZON_SECRET_KEY', 'AMAZON_PARTNER_TAG'],
      },
      {
        id: 'flipkart',
        name: flipkart.name,
        type: 'marketplace',
        mode: flipkart.isConfigured() ? 'live' : 'external_link',
        is_configured: flipkart.isConfigured(),
        status_message: flipkart.isConfigured()
          ? 'Connected to Flipkart Affiliate API'
          : 'API not connected. Use the external Flipkart search link for live listings.',
        docs_url: 'https://affiliate.flipkart.com/api-docs',
        required_env_vars: ['FLIPKART_AFFILIATE_ID', 'FLIPKART_AFFILIATE_TOKEN'],
      },
      {
        id: 'ebay',
        name: ebay.name,
        type: 'marketplace',
        mode: ebay.isConfigured() ? 'live' : 'external_link',
        is_configured: ebay.isConfigured(),
        status_message: ebay.isConfigured()
          ? 'Connected to eBay REST Browse API'
          : 'API not connected. Use the external eBay search link for live listings.',
        docs_url: 'https://developer.ebay.com/api-docs/buy/browse/overview.html',
        required_env_vars: ['EBAY_APP_ID', 'EBAY_CERT_ID'],
      },
      {
        id: 'cashfree',
        name: 'Cashfree Payment Gateway (India)',
        type: 'payment',
        mode: hasCashfree ? 'live' : 'simulated',
        is_configured: hasCashfree,
        status_message: hasCashfree
          ? 'Connected to Cashfree PG Sandbox / Prod'
          : 'Running in ₹0 Learning Mode (Simulates Success, Failure, Pending states)',
        docs_url: 'https://docs.cashfree.com/docs/payment-gateway-overview',
        required_env_vars: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY'],
      },
      {
        id: 'shiprocket',
        name: 'Shiprocket Logistics & Shipping',
        type: 'shipping',
        mode: hasShiprocket ? 'live' : 'simulated',
        is_configured: hasShiprocket,
        status_message: hasShiprocket
          ? 'Connected to Shiprocket API v2'
          : 'Running in ₹0 Learning Mode (Simulates AWB generation, Courier rates & Live Tracking)',
        docs_url: 'https://apidocs.shiprocket.in/',
        required_env_vars: ['SHIPROCKET_EMAIL', 'SHIPROCKET_PASSWORD'],
      },
    ];
  }
}

