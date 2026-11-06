/**
 * ShopSphere Search Engine - NLP Preprocessing, Typo Tolerance & Synonym Expansion
 */

// Common e-commerce synonyms dictionary
const SYNONYM_MAP: Record<string, string[]> = {
  'tea stone': ['tea infuser', 'cooling stones', 'tea accessories', 'tea strainer'],
  'stone for tea': ['tea infuser', 'tea strainer', 'cooling stones', 'tea infuser mesh'],
  'tea strainer': ['tea infuser', 'chai chalni', 'tea filter', 'mesh strainer'],
  'laptop': ['notebook', 'macbook', 'ultrabook', 'computer'],
  'phone': ['smartphone', 'mobile', 'cellphone', 'iphone'],
  'iphone': ['apple smartphone', 'ios mobile', 'iphone 15', 'iphone 16', 'iphone 17'],
  'shoes': ['sneakers', 'footwear', 'running shoes', 'sports shoes', 'loafers'],
  'water bottle': ['flask', 'sipper', 'insulated bottle', 'hydration bottle', 'thermos'],
  'charger': ['power adapter', 'fast charger', 'usb-c adapter', 'charging cable'],
  'headphones': ['earphones', 'earbuds', 'headset', 'airpods', 'tws'],
  'wireless headphones': ['bluetooth headphones', 'tws earbuds', 'noise cancelling headphones'],
  'chair': ['office chair', 'desk chair', 'ergonomic chair', 'study chair'],
  'office chair': ['ergonomic chair', 'executive desk chair', 'mesh revolving chair'],
  'utensils': ['cookware', 'kitchen tools', 'kitchenware', 'cutlery'],
  'books': ['paperback', 'hardcover', 'novel', 'bestseller'],
};

// Known vocabulary for typo tolerance
const VOCABULARY = [
  'tea', 'strainer', 'infuser', 'stone', 'filter', 'chai', 'chalni',
  'iphone', 'apple', 'macbook', 'laptop', 'charger', 'adapter', 'cable',
  'shoes', 'sneakers', 'footwear', 'running', 'sandals', 'boots',
  'water', 'bottle', 'flask', 'thermos', 'insulated', 'sipper',
  'headphones', 'earphones', 'earbuds', 'wireless', 'bluetooth', 'airpods',
  'chair', 'office', 'ergonomic', 'desk', 'furniture',
  'utensils', 'kitchen', 'cookware', 'knife', 'pan', 'spatula',
  'samsung', 'galaxy', 'sony', 'dell', 'hp', 'lenovo', 'asus',
  'nike', 'adidas', 'puma', 'boat', 'noise', 'fastrack'
];

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  for (let i = 0; i <= bLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLen; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bLen][aLen];
}

/**
 * Suggest spelling correction for a single token
 */
export function correctToken(token: string): string {
  const lower = token.toLowerCase();
  if (VOCABULARY.includes(lower)) return lower;

  let bestMatch = lower;
  let minDistance = 2; // threshold for single word typo

  for (const word of VOCABULARY) {
    const dist = levenshteinDistance(lower, word);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = word;
    }
  }

  return bestMatch;
}

export interface ProcessedQuery {
  original: string;
  normalized: string;
  tokens: string[];
  corrected: string | null;
  synonyms: string[];
  suggestedPhrases: string[];
}

/**
 * Preprocesses, normalizes, detects typos, and expands synonyms for a search query
 */
export function preprocessQuery(query: string): ProcessedQuery {
  const original = query || '';
  const normalized = original
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // remove special chars except hyphens
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return {
      original,
      normalized: '',
      tokens: [],
      corrected: null,
      synonyms: [],
      suggestedPhrases: [],
    };
  }

  const tokens = normalized.split(' ').filter(Boolean);

  // Check for multi-word typos / corrections
  const correctedTokens = tokens.map((token) => correctToken(token));
  const correctedCandidate = correctedTokens.join(' ');
  const corrected = correctedCandidate !== normalized ? correctedCandidate : null;

  // Synonyms lookup
  const synonyms: string[] = [];
  if (SYNONYM_MAP[normalized]) {
    synonyms.push(...SYNONYM_MAP[normalized]);
  } else if (corrected && SYNONYM_MAP[corrected]) {
    synonyms.push(...SYNONYM_MAP[corrected]);
  } else {
    // Check individual tokens for synonyms
    tokens.forEach((t) => {
      if (SYNONYM_MAP[t]) {
        synonyms.push(...SYNONYM_MAP[t]);
      }
    });
  }

  // Generate related search suggestions
  const suggestedPhrases: string[] = [];
  if (corrected) {
    suggestedPhrases.push(corrected);
  }
  synonyms.slice(0, 3).forEach((syn) => {
    if (!suggestedPhrases.includes(syn)) {
      suggestedPhrases.push(syn);
    }
  });

  return {
    original,
    normalized,
    tokens,
    corrected,
    synonyms: Array.from(new Set(synonyms)),
    suggestedPhrases,
  };
}

