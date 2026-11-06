import { Product } from '@/types';

export interface SearchOptions {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
  sort?: string;
}

export interface ProviderSearchResult {
  providerId: string;
  providerName: string;
  isLive: boolean;
  isConfigured: boolean;
  missingCredentials: string[];
  responseTimeMs: number;
  totalFound: number;
  products: Product[];
  error?: string;
  liveSearchUrl?: string;
}

export interface MarketplaceAdapter {
  id: string;
  name: string;
  isConfigured: () => boolean;
  getMissingCredentials: () => string[];
  search: (options: SearchOptions) => Promise<ProviderSearchResult>;
  getBySlug: (slug: string) => Promise<Product | null>;
}
