const MAX_SKU_LEN = 50;
const SAFE_SKU_RE = /^[A-Z0-9\-_.~]+$/;
const URL_LIKE_RE = /^https?:\/\//i;

/**
 * Deterministic 4-char uppercase hex hash from a seed string.
 * @param {string} seed
 * @returns {string}
 */
export function shortHash(seed) {
  let h = 2166136261;
  const s = String(seed || '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).slice(0, 4).toUpperCase().padStart(4, '0');
}

/**
 * Build a short stable fallback SKU: WK-SEO-{CATEGORY}-{HASH}
 * @param {string} fallbackSeed
 * @param {string} [category]
 * @returns {string}
 */
export function buildFallbackSku(fallbackSeed, category = 'PRODUCT') {
  const cat = String(category || 'PRODUCT')
    .toUpperCase()
    .replace(/[^A-Z0-9\-_.~]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);
  const hash = shortHash(fallbackSeed);
  let sku = `WK-SEO-${cat}-${hash}`.replace(/-+/g, '-');
  if (sku.length > MAX_SKU_LEN) {
    sku = sku.slice(0, MAX_SKU_LEN).replace(/-+$/, '');
  }
  return sku;
}

/**
 * Normalize a merchant SKU: uppercase, safe chars only, <= 50 chars, never empty.
 * @param {string} input
 * @param {string} fallbackSeed
 * @param {string} [category]
 * @returns {string}
 */
export function normalizeSku(input, fallbackSeed = 'WK-SEO', category = 'PRODUCT') {
  const seed = String(fallbackSeed || 'WK-SEO');
  let val = String(input || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\-_.~]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const invalid =
    !val ||
    val.length > MAX_SKU_LEN ||
    !SAFE_SKU_RE.test(val) ||
    URL_LIKE_RE.test(val) ||
    /\s/.test(val);

  if (invalid) {
    return buildFallbackSku(seed, category);
  }

  if (val.length > MAX_SKU_LEN) {
    val = val.slice(0, MAX_SKU_LEN).replace(/-+$/, '');
  }

  return val || buildFallbackSku(seed, category);
}

/**
 * True when a value looks like a long SEO slug rather than a product code.
 * @param {string} value
 * @returns {boolean}
 */
export function looksLikeSeoSlug(value) {
  const v = String(value || '').trim();
  if (!v) return true;
  if (v.length > 30 && v.includes('-')) return true;
  if (/^(ADVERTISING|REPLACEMENT|PORTABLE|MODULAR|COLLAPSIBLE|COMMERCIAL|CUSTOM|DOUBLE|EVENT|EXHIBITION|FABRIC|FOLDING|HEAVY|OUTDOOR|POP|QUICK|SEG|TENSION|TRADE|WIND|ALUMINUM|BEACH|BRANDED|TEARDROP)-/i.test(v)) {
    return true;
  }
  return false;
}
