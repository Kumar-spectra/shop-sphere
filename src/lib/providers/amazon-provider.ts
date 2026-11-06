import crypto from 'crypto';
import { Product } from '@/types';
import { MarketplaceAdapter, SearchOptions, ProviderSearchResult } from './provider-types';

export class AmazonProvider implements MarketplaceAdapter {
  id = 'amazon';
  name = 'Amazon Creators API / PA-API 5.0';

  isConfigured(): boolean {
    return Boolean(
      process.env.AMAZON_ACCESS_KEY &&
      process.env.AMAZON_SECRET_KEY &&
      (process.env.AMAZON_PARTNER_TAG || process.env.AMAZON_ASSOCIATE_TAG)
    );
  }

  getMissingCredentials(): string[] {
    const missing: string[] = [];
    if (!process.env.AMAZON_ACCESS_KEY) missing.push('AMAZON_ACCESS_KEY');
    if (!process.env.AMAZON_SECRET_KEY) missing.push('AMAZON_SECRET_KEY');
    if (!process.env.AMAZON_PARTNER_TAG && !process.env.AMAZON_ASSOCIATE_TAG) {
      missing.push('AMAZON_PARTNER_TAG');
    }
    return missing;
  }

  /**
   * Helper to compute AWS Signature Version 4 HMAC
   */
  private hmac(key: Buffer | string, data: string): Buffer {
    return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
  }

  /**
   * Helper to compute SHA256 hash in hex
   */
  private sha256Hex(data: string): string {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
  }

  /**
   * Generates AWS SigV4 headers and executes Amazon PA-API 5.0 SearchItems request
   */
  private async executePaApiSearch(
    query: string,
    limit: number = 10
  ): Promise<Product[]> {
    const accessKey = process.env.AMAZON_ACCESS_KEY!;
    const secretKey = process.env.AMAZON_SECRET_KEY!;
    const partnerTag = process.env.AMAZON_PARTNER_TAG || process.env.AMAZON_ASSOCIATE_TAG || 'shopsphere-21';
    const region = process.env.AMAZON_REGION || 'eu-west-1'; // amazon.in uses eu-west-1
    const host = process.env.AMAZON_HOST || 'webservices.amazon.in';
    const service = 'ProductAdvertisingAPI';

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const payload = JSON.stringify({
      Keywords: query,
      Resources: [
        'Images.Primary.Large',
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.Classifications',
        'ItemInfo.Features',
        'Offers.Listings.Price',
        'Offers.Listings.SavingBasis',
        'Offers.Listings.MerchantInfo',
        'CustomerReviews.Count',
        'CustomerReviews.StarRating',
      ],
      PartnerTag: partnerTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.in',
      ItemCount: Math.min(limit, 10),
    });

    const canonicalUri = '/paapi5/searchitems';
    const canonicalQuerystring = '';
    const canonicalHeaders =
      `content-encoding:amz-1.0\n` +
      `content-type:application/json; charset=utf-8\n` +
      `host:${host}\n` +
      `x-amz-date:${amzDate}\n` +
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`;
    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const payloadHash = this.sha256Hex(payload);

    const canonicalRequest =
      `POST\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign =
      `${algorithm}\n${amzDate}\n${credentialScope}\n${this.sha256Hex(canonicalRequest)}`;

    const kDate = this.hmac('AWS4' + secretKey, dateStamp);
    const kRegion = this.hmac(kDate, region);
    const kService = this.hmac(kRegion, service);
    const kSigning = this.hmac(kService, 'aws4_request');
    const signature = this.hmac(kSigning, stringToSign).toString('hex');

    const authHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(`https://${host}${canonicalUri}`, {
      method: 'POST',
      headers: {
        'content-encoding': 'amz-1.0',
        'content-type': 'application/json; charset=utf-8',
        'host': host,
        'x-amz-date': amzDate,
        'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
        'Authorization': authHeader,
      },
      body: payload,
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Amazon PA-API returned HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const items = data?.SearchResult?.Items || [];

    return items.map((item: any, index: number): Product => {
      const title = item.ItemInfo?.Title?.DisplayValue || query;
      const priceVal = item.Offers?.Listings?.[0]?.Price?.Amount || 999;
      const originalPriceVal = item.Offers?.Listings?.[0]?.SavingBasis?.Amount || priceVal;
      const imageUrl = item.Images?.Primary?.Large?.URL || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80';
      const detailUrl = item.DetailPageURL || `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=${partnerTag}`;
      const brand = item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Amazon Brand';
      const asin = item.ASIN || `B0${Math.floor(10000000 + Math.random() * 90000000)}`;

      return {
        id: `amz-${asin}`,
        name: title,
        slug: `amazon-${asin.toLowerCase()}`,
        description: item.ItemInfo?.Features?.DisplayValues?.join('. ') || title,
        brand,
        price: originalPriceVal,
        discount_price: priceVal < originalPriceVal ? priceVal : null,
        stock_quantity: 50,
        image_urls: [imageUrl],
        rating: item.CustomerReviews?.StarRating?.Value || 4.5,
        review_count: item.CustomerReviews?.Count || 100,
        is_active: true,
        source: 'amazon',
        seller_name: item.Offers?.Listings?.[0]?.MerchantInfo?.Name || 'Amazon Appario Retail',
        affiliate_url: detailUrl,
        external_id: asin,
      };
    });
  }

  async search(options: SearchOptions): Promise<ProviderSearchResult> {
    const startTime = Date.now();
    const query = (options.query || '').trim();
    const missing = this.getMissingCredentials();
    const liveSearchUrl = query ? `https://www.amazon.in/s?k=${encodeURIComponent(query)}` : undefined;

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
      const liveProducts = await this.executePaApiSearch(query, options.limit || 8);
      return { providerId: this.id, providerName: this.name, isLive: true, isConfigured: true,
        missingCredentials: [], responseTimeMs: Date.now() - startTime,
        totalFound: liveProducts.length, products: liveProducts, liveSearchUrl };
    } catch (err: any) {
      console.warn(`[Amazon API] Search failed: ${err.message}`);
      return { providerId: this.id, providerName: this.name, isLive: false, isConfigured: true,
        missingCredentials: [], responseTimeMs: Date.now() - startTime, totalFound: 0,
        products: [], error: `Amazon API request failed: ${err.message}`, liveSearchUrl };
    }
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const searchRes = await this.search({ query: slug.replace(/^amazon-/, '') });
    return searchRes.products.find((p) => p.slug === slug) || searchRes.products[0] || null;
  }
}
