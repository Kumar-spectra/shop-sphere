/**
 * ShopSphere Unified Marketplace Search Orchestrator
 * Executes concurrent, fault-tolerant queries across ShopSphere, Amazon, Flipkart, and eBay.
 */

import { Product, ProductSource } from '@/types';
import { ProviderSearchResult, SearchOptions } from '../providers/provider-types';
import { AmazonProvider } from '../providers/amazon-provider';
import { FlipkartProvider } from '../providers/flipkart-provider';
import { EbayProvider } from '../providers/ebay-provider';
import { preprocessQuery, ProcessedQuery } from './search-engine';
import { INITIAL_PRODUCTS } from '@/data/mock-data';

export interface UnifiedSearchResponse {
  query: string;
  processed: ProcessedQuery;
  total: number;
  products: Product[];
  providers: ProviderSearchResult[];
  executionTimeMs: number;
  cached: boolean;
  brands: string[];
}

// In-memory short-lived cache (5-minute TTL)
interface CacheEntry {
  data: UnifiedSearchResponse;
  timestamp: number;
}

const SEARCH_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class SearchOrchestrator {
  private static instance: SearchOrchestrator;
  private amazonProvider: AmazonProvider;
  private flipkartProvider: FlipkartProvider;
  private ebayProvider: EbayProvider;

  private constructor() {
    this.amazonProvider = new AmazonProvider();
    this.flipkartProvider = new FlipkartProvider();
    this.ebayProvider = new EbayProvider();
  }

  public static getInstance(): SearchOrchestrator {
    if (!SearchOrchestrator.instance) {
      SearchOrchestrator.instance = new SearchOrchestrator();
    }
    return SearchOrchestrator.instance;
  }

  /**
   * Search native ShopSphere internal inventory
   */
  private async searchNativeInventory(
    processed: ProcessedQuery,
    options: SearchOptions
  ): Promise<ProviderSearchResult> {
    const startTime = Date.now();
    const query = processed.normalized;

    let matched = INITIAL_PRODUCTS.filter((p) => p.source === 'shopsphere');

    if (query) {
      const tokens = processed.tokens;
      matched = matched.filter((p) => {
        const titleLower = p.name.toLowerCase();
        const descLower = p.description.toLowerCase();
        const brandLower = p.brand.toLowerCase();

        // Exact match
        if (titleLower.includes(query) || brandLower.includes(query)) return true;

        // Token match
        const tokenHits = tokens.filter(
          (t) => titleLower.includes(t) || descLower.includes(t) || brandLower.includes(t)
        );
        if (tokenHits.length > 0) return true;

        // Synonym match
        const synHits = processed.synonyms.filter(
          (s) => titleLower.includes(s) || descLower.includes(s)
        );
        return synHits.length > 0;
      });
    }

    // Apply category filter if provided
    if (options.category && options.category !== 'all') {
      matched = matched.filter((p) => p.category?.slug === options.category);
    }

    return {
      providerId: 'shopsphere',
      providerName: 'ShopSphere Inventory',
      isLive: true,
      isConfigured: true,
      missingCredentials: [],
      responseTimeMs: Date.now() - startTime,
      totalFound: matched.length,
      products: matched,
    };
  }

  /**
   * Deduplicate and rank products across multiple providers by relevance
   */
  private rankAndDeduplicate(
    items: Product[],
    processed: ProcessedQuery,
    sort?: string
  ): Product[] {
    const seenTitles = new Set<string>();
    const deduplicated: Product[] = [];

    for (const item of items) {
      // Create a simplified fingerprint for deduplication
      const fingerprint = item.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 30);

      if (!seenTitles.has(fingerprint)) {
        seenTitles.add(fingerprint);
        deduplicated.push(item);
      }
    }

    // Relevance scoring
    const tokens = processed.tokens;
    const scored = deduplicated.map((item) => {
      let score = 0;
      const titleLower = item.name.toLowerCase();
      const descLower = item.description.toLowerCase();
      const brandLower = item.brand.toLowerCase();

      // Exact brand match (e.g. searching "Samsung", "Apple", "Sony")
      if (processed.normalized && (brandLower === processed.normalized || brandLower.startsWith(processed.normalized))) {
        score += 100;
      }

      // Full query in title
      if (processed.normalized && titleLower.includes(processed.normalized)) {
        score += 50;
      }

      // Title starts with query
      if (processed.normalized && titleLower.startsWith(processed.normalized)) {
        score += 30;
      }

      // Token matches in title and brand
      tokens.forEach((t) => {
        if (titleLower.includes(t)) score += 20;
        if (brandLower.includes(t)) score += 25;
        if (descLower.includes(t)) score += 5;
      });

      // Direct ShopSphere fulfillment bonus
      if (item.source === 'shopsphere') {
        score += 15;
      }

      // Synonym matches
      processed.synonyms.forEach((s) => {
        if (titleLower.includes(s)) score += 8;
      });

      // Rating bonus
      if (item.rating) {
        score += item.rating * 2;
      }

      return { item, score };
    });

    // Custom sorting
    if (sort === 'price_asc') {
      scored.sort((a, b) => (a.item.discount_price ?? a.item.price) - (b.item.discount_price ?? b.item.price));
    } else if (sort === 'price_desc') {
      scored.sort((a, b) => (b.item.discount_price ?? b.item.price) - (a.item.discount_price ?? a.item.price));
    } else if (sort === 'rating') {
      scored.sort((a, b) => (b.item.rating ?? 0) - (a.item.rating ?? 0));
    } else if (sort === 'discount') {
      scored.sort((a, b) => {
        const discA = a.item.discount_price ? a.item.price - a.item.discount_price : 0;
        const discB = b.item.discount_price ? b.item.price - b.item.discount_price : 0;
        return discB - discA;
      });
    } else {
      // Default: relevance score
      scored.sort((a, b) => b.score - a.score);
    }

    return scored.map((s) => s.item);
  }

  /**
   * Execute universal multi-marketplace search
   */
  public async executeSearch(options: SearchOptions): Promise<UnifiedSearchResponse> {
    const overallStart = Date.now();
    const rawQuery = options.query || '';
    const processed = preprocessQuery(rawQuery);

    const cacheKey = JSON.stringify({
      q: processed.normalized,
      cat: options.category,
      src: options.brand,
      sort: options.sort,
      min: options.minPrice,
      max: options.maxPrice,
    });

    // Check cache
    const cachedEntry = SEARCH_CACHE.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL_MS) {
      return {
        ...cachedEntry.data,
        cached: true,
        executionTimeMs: Date.now() - overallStart,
      };
    }

    // Launch concurrent searches to all 4 providers using Promise.allSettled
    const searchPromises: Promise<ProviderSearchResult>[] = [
      this.searchNativeInventory(processed, options),
      this.amazonProvider.search({ query: rawQuery, limit: options.limit || 8 }),
      this.flipkartProvider.search({ query: rawQuery, limit: options.limit || 8 }),
      this.ebayProvider.search({ query: rawQuery, limit: options.limit || 8 }),
    ];

    const settled = await Promise.allSettled(searchPromises);

    const providerResults: ProviderSearchResult[] = [];
    const allProducts: Product[] = [];

    settled.forEach((result, idx) => {
      const fallbackNames = ['ShopSphere', 'Amazon', 'Flipkart', 'eBay'];
      const fallbackIds = ['shopsphere', 'amazon', 'flipkart', 'ebay'];

      if (result.status === 'fulfilled') {
        providerResults.push(result.value);
        allProducts.push(...result.value.products);
      } else {
        providerResults.push({
          providerId: fallbackIds[idx],
          providerName: fallbackNames[idx],
          isLive: false,
          isConfigured: false,
          missingCredentials: [],
          responseTimeMs: 0,
          totalFound: 0,
          products: [],
          error: result.reason?.message || 'Provider request rejected',
        });
      }
    });

    // Deduplicate and rank products
    let rankedProducts = this.rankAndDeduplicate(allProducts, processed, options.sort);

    // Apply price filtering if requested
    if (options.minPrice !== undefined) {
      rankedProducts = rankedProducts.filter(
        (p) => (p.discount_price ?? p.price) >= options.minPrice!
      );
    }
    if (options.maxPrice !== undefined) {
      rankedProducts = rankedProducts.filter(
        (p) => (p.discount_price ?? p.price) <= options.maxPrice!
      );
    }

    // Extract unique brands for filtering
    const brands = Array.from(new Set(rankedProducts.map((p) => p.brand))).filter(Boolean);

    const unifiedResponse: UnifiedSearchResponse = {
      query: rawQuery,
      processed,
      total: rankedProducts.length,
      products: rankedProducts,
      providers: providerResults,
      executionTimeMs: Date.now() - overallStart,
      cached: false,
      brands,
    };

    // Store in cache
    SEARCH_CACHE.set(cacheKey, {
      data: unifiedResponse,
      timestamp: Date.now(),
    });

    return unifiedResponse;
  }
}

