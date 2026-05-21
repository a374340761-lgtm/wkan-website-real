import { buildFallbackSku, looksLikeSeoSlug, normalizeSku } from './normalize-sku.mjs';

/** @type {Record<string, string>} slug (no .html) -> catalog SKU */
export const SEO_PAGE_SKU_MAP = {
  'advertising-flag-pole-and-base-wholesale-supplier-b2b': 'FLG-HUB-BASE-ACC',
  'replacement-beach-flag-pole-base-supplier-wholesale': 'FLG-HUB-BASE-ACC',
  'portable-trade-show-booth-backdrop-manufacturer-export': '42002',
  'portable-backdrop-display-system-supplier-wholesale': '42002',
  'aluminum-frame-pop-up-tent-factory-direct-export': '2002',
  'aluminum-frame-fabric-display-manufacturer-custom-branding': 'WK-HZ',
  'beach-flag-manufacturer-wholesale-feather-teardrop-flags': 'FLG-HUB-FGF',
  'branded-promotional-tent-supplier-b2b-bulk-orders': '2003',
  'collapsible-display-system-wholesale-distributor-pricing': '42003',
  'commercial-grade-pop-up-canopy-wholesale-supplier': '2003',
  'custom-beach-flag-kit-supplier-for-agencies': 'FLG-BP-ST-HUB',
  'custom-canopy-tent-factory-for-reseller-programs': '2001',
  'custom-printed-canopy-tent-manufacturer-oem-china': '2001',
  'custom-printed-feather-flag-supplier-bulk-order-oem': 'FLG-HUB-FGF',
  'double-sided-beach-flag-manufacturer-export-quality': 'FLG-HUB-FGF',
  'event-feather-flag-printing-manufacturer-factory-direct': 'FLG-HUB-FGF',
  'exhibition-tent-frame-and-fabric-manufacturer-odm': '2002',
  'fabric-tension-backwall-supplier-bulk-for-rental-companies': 'WK-HZ-STRAIGHT',
  'folding-event-tent-supplier-wholesale-moq': '2001',
  'heavy-duty-gazebo-tent-wholesale-manufacturer-europe-shipping': '2003',
  'modular-exhibition-display-hardware-manufacturer-odm': '42003',
  'outdoor-advertising-tent-oem-supplier-custom-sizes': '2002',
  'outdoor-promotional-flag-system-manufacturer-oem': 'FLG-BP-ST-HUB',
  'pop-up-display-stand-wholesale-supplier-for-events': '42003',
  'quick-setup-display-frame-supplier-oem-graphics': '42003',
  'seg-fabric-light-box-manufacturer-b2b-custom-sizes': 'WK-LB-AP',
  'teardrop-flag-hardware-supplier-for-print-shops': 'FLG-HUB-FGT',
  'tension-fabric-display-wall-manufacturer-oem-trade-show': 'WK-HZ-STRAIGHT',
  'trade-show-canopy-tent-manufacturer-for-distributors': '2002',
  'wind-sail-banner-flag-wholesale-supplier-moq': 'FLG-BP-ST-HUB',
};

/**
 * Infer product category token for hash fallback SKUs.
 * @param {string} slug
 * @returns {string}
 */
export function inferSeoCategory(slug) {
  const s = String(slug || '').toLowerCase();
  if (/flag|feather|teardrop|banner|wind-sail|pole|base/.test(s)) return 'FLAG';
  if (/backdrop|display|tension-fabric|pop-up-display|collapsible|modular-exhibition|quick-setup/.test(s)) {
    return 'DISPLAY';
  }
  if (/light-box|seg-fabric|lightbox/.test(s)) return 'LIGHTBOX';
  if (/tent|canopy|gazebo|folding-event/.test(s)) return 'TENT';
  return 'PRODUCT';
}

/**
 * Resolve a short stable SKU for an SEO landing page slug.
 * @param {string} slug page basename without .html
 * @returns {string}
 */
export function resolveSeoPageSku(slug) {
  const key = String(slug || '').replace(/\.html$/i, '');
  const mapped = SEO_PAGE_SKU_MAP[key];
  if (mapped) {
    return normalizeSku(mapped, key, inferSeoCategory(key));
  }
  const category = inferSeoCategory(key);
  return buildFallbackSku(key, category);
}

/**
 * Validate and normalize any SKU candidate (e.g. from product catalog).
 * @param {string} input
 * @param {string} fallbackSeed
 * @returns {string}
 */
export function coerceProductSku(input, fallbackSeed) {
  const seed = String(fallbackSeed || 'WK-PRODUCT');
  const raw = String(input || '').trim();
  if (!raw || looksLikeSeoSlug(raw)) {
    return buildFallbackSku(seed, inferSeoCategory(seed));
  }
  return normalizeSku(raw, seed, inferSeoCategory(seed));
}
