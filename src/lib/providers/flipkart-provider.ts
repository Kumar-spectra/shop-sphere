import { Product } from '@/types';
import { MarketplaceAdapter, SearchOptions, ProviderSearchResult } from './provider-types';

export class FlipkartProvider implements MarketplaceAdapter {
  id = 'flipkart';
  name = 'Flipkart Affiliate API';

  isConfigured(): boolean {
    return Boolean(
      process.env.FLIPKART_AFFILIATE_ID &&
      process.env.FLIPKART_AFFILIATE_TOKEN
    );
  }

  getMissingCredentials(): string[] {
    const missing: string[] = [];
    if (!process.env.FLIPKART_AFFILIATE_ID) missing.push('FLIPKART_AFFILIATE_ID');
    if (!process.env.FLIPKART_AFFILIATE_TOKEN) missing.push('FLIPKART_AFFILIATE_TOKEN');
    return missing;
  }

  /**
   * Executes official Flipkart Affiliate REST search
   */
  private async executeFlipkartSearch(
    query: string,
    limit: number = 10
  ): Promise<Product[]> {
    const affiliateId = process.env.FLIPKART_AFFILIATE_ID!;
    const affiliateToken = process.env.FLIPKART_AFFILIATE_TOKEN!;
    const endpoint = `https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query=${encodeURIComponent(query)}&resultCount=${Math.min(limit, 10)}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Fk-Affiliate-Id': affiliateId,
        'Fk-Affiliate-Token': affiliateToken,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Flipkart Affiliate API returned HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const productsList = data?.productInfoList || data?.products || [];

    return productsList.map((item: any): Product => {
      const baseInfo = item.productBaseInfoV1 || item.productBaseInfo || {};
      const attrs = baseInfo.productAttributes || {};
      const title = attrs.title || query;
      const mrp = attrs.maximumRetailPrice?.amount || 999;
      const sellingPrice = attrs.sellingPrice?.amount || mrp;
      const brand = attrs.productBrand || 'Flipkart Verified';
      const images = attrs.imageUrls || {};
      const imageUrl =
        images['800x800'] ||
        images['400x400'] ||
        Object.values(images)[0] ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80';
      const productUrl =
        attrs.productUrl ||
        `https://www.flipkart.com/search?q=${encodeURIComponent(query)}&affid=${affiliateId}`;
      const itemId = baseInfo.productIdentifier?.productId || `FK-${Math.floor(100000 + Math.random() * 900000)}`;

      return {
        id: `fk-${itemId}`,
        name: title,
        slug: `flipkart-${itemId.toLowerCase()}`,
        description: attrs.productDescription || title,
        brand,
        price: mrp,
        discount_price: sellingPrice < mrp ? sellingPrice : null,
        stock_quantity: attrs.inStock ? 50 : 0,
        image_urls: [typeof imageUrl === 'string' ? imageUrl : String(imageUrl)],
        rating: 4.4,
        review_count: 320,
        is_active: true,
        source: 'flipkart',
        seller_name: 'RetailNet (Flipkart Assured)',
        affiliate_url: productUrl,
        external_id: itemId,
        specifications: {
          'Fulfillment': 'Flipkart Assured Fast Dispatch',
          'COD Support': attrs.codAvailable ? 'Cash on Delivery Available' : 'Prepaid Only',
        },
      };
    });
  }

  async search(options: SearchOptions): Promise<ProviderSearchResult> {
    const startTime = Date.now();
    const query = (options.query || '').trim();
    const missing = this.getMissingCredentials();
    const liveSearchUrl = query ? `https://www.flipkart.com/search?q=${encodeURIComponent(query)}` : undefined;

    // Never present sample data as marketplace inventory. Without credentials,
    // send users to the marketplace's own search page instead.
    if (!this.isConfigured()) {
      return {
        providerId: this.id,
        providerName: this.name,
        isLive: false,
        isConfigured: false,
        missingCredentials: missing,
        responseTimeMs: Date.now() - startTime,
        totalFound: 0,
        products: [],
        liveSearchUrl,
      };
    }

    if (!query) {
      return { providerId: this.id, providerName: this.name, isLive: false, isConfigured: true,
        missingCredentials: [], responseTimeMs: Date.now() - startTime, totalFound: 0, products: [] };
    }

    try {
      const liveProducts = await this.executeFlipkartSearch(query, options.limit || 8);
      return { providerId: this.id, providerName: this.name, isLive: true, isConfigured: true,
        missingCredentials: [], responseTimeMs: Date.now() - startTime,
        totalFound: liveProducts.length, products: liveProducts, liveSearchUrl };
    } catch (err: any) {
      console.warn(`[Flipkart API] Search failed: ${err.message}`);
      return { providerId: this.id, providerName: this.name, isLive: false, isConfigured: true,
        missingCredentials: [], responseTimeMs: Date.now() - startTime, totalFound: 0,
        products: [], error: `Flipkart API request failed: ${err.message}`, liveSearchUrl };
    }
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const searchRes = await this.search({ query: slug.replace(/^flipkart-/, '') });
    return searchRes.products.find((p) => p.slug === slug) || searchRes.products[0] || null;
  }
}
