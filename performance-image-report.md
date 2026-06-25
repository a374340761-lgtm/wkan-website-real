# Performance Image Report

Generated: 2026-06-25

## Scope

This phase focuses on LCP image discovery and image SEO signals for the homepage and core commercial pages. It does not convert image assets or change layout/CSS.

## Summary

- Homepage already preloads its first dynamic hero background image.
- Core commercial pages with visible hero images now preload the same image that appears above the fold.
- Visible commercial hero images use `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, explicit `width` and `height`, and descriptive `alt`.
- `og:image` and `twitter:image` are aligned with the page theme for the main commercial pages.
- No WebP or AVIF variants were present under `images/hero/`; conversion is deferred until an image toolchain is available.

## Page Review

| Page | LCP / hero image | Loading strategy | OG image alignment |
|---|---|---|---|
| `/` | `images/hero/canton-fair-2026-invitation-waikwan-booth-12-1f29-30.png` | Preloaded with `fetchpriority="high"`; dynamic background slide rendered by `scripts/main.js`; later slides warmed after first paint | Uses general canopy factory image for brand share preview |
| `/custom-canopy-tent-manufacturer.html` | `images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png` | Added preload; visible `<img>` is eager, high priority, async decoded, 1200x675 | Aligned |
| `/beach-flag-supplier.html` | `images/hero/custom-beach-flags-feather-teardrop-flags-outdoor.png` | Added preload; visible `<img>` is eager, high priority, async decoded, 1200x675 | Aligned |
| `/portable-display-systems.html` | `images/hero/aluminum-profile-fabric-light-box-display-wall.jpeg` | Added preload; visible `<img>` is eager, high priority, async decoded, 1200x675 | Aligned |
| `/10x10-pop-up-canopy-tent.html` | No visible hero image in first section; representative 10x10 image is used in social preview | Added preload for the representative 10x10 canopy image used by `og:image` / `twitter:image` | Aligned |
| `/contact-us.html` | No page-level hero image; form/content is the primary above-the-fold surface | No image preload added | Uses general canopy factory image as broad RFQ preview |

## Asset Availability

Checked `images/hero/` for WebP and AVIF variants.

- `*.webp`: none found
- `*.avif`: none found
- Current hero originals:
  - `images/hero/canton-fair-2026-invitation-waikwan-booth-12-1f29-30.png`
  - `images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png`
  - `images/hero/custom-beach-flags-feather-teardrop-flags-outdoor.png`
  - `images/hero/aluminum-profile-fabric-light-box-display-wall.jpeg`

## Follow-Up Recommendations

- Generate WebP and AVIF variants for the four hero originals, then add `<picture>` fallback markup on static hero-image pages.
- For the homepage dynamic background slider, consider either CSS `image-set()` or a small JavaScript helper that selects WebP/AVIF when supported.
- Keep only the first homepage hero preloaded; later slider images should continue warming after first paint so they do not compete with LCP.
- Run Lighthouse/PageSpeed after deployment to confirm whether the LCP element is the expected hero image or a text block on pages without a visible hero image.
