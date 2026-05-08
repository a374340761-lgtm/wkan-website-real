# Performance Report

## Biggest Likely Slow Resources

- Homepage hero images are large PNG/JPEG files, especially `images/hero/canton-fair-2026-invitation-waikwan-booth-12-1f29-30.png`, `images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png`, and `images/hero/custom-beach-flags-feather-teardrop-flags-outdoor.png`.
- The homepage uses background-image hero slides, so the first slide should remain eager/preloaded while later slides should not compete with LCP.
- Google Fonts and Font Awesome from external CDNs are render-blocking candidates. Test whether a local icon subset or self-hosted critical font files improve first paint.
- Product listings load many product card images. These should stay lazy-loaded with async decoding and stable card dimensions.
- News/gallery images and catalog reference images may need WebP/AVIF versions if PageSpeed flags transfer size.

## Files Changed For Performance

- `scripts/main.js`: delayed non-first hero image warmup until idle/time-delayed execution, and added `decoding="async"` to dynamically rendered below-the-fold images.
- `scripts/products.js`: added `decoding="async"` to product card, product row and catalog reference images while preserving lazy loading.
- `styles/multilang.css`: changed default language visibility so English pages do not flash Chinese text before JavaScript initializes.

## Recommended Image Conversions

- Convert large hero PNG/JPEG files to WebP or AVIF and keep the current PNG/JPEG fallback paths.
- Prioritize WebP/AVIF versions for:
  - `images/hero/canton-fair-2026-invitation-waikwan-booth-12-1f29-30.png`
  - `images/hero/pop-up-canopy-tent-10x10-blue-trade-show-booth.png`
  - `images/hero/custom-beach-flags-feather-teardrop-flags-outdoor.png`
  - `images/hero/aluminum-profile-fabric-light-box-display-wall.jpeg`
  - large `news/images/APPPEXPO2026/` gallery photos
- Do not rename existing image files unless every HTML, CSS and JavaScript reference is updated.

## Manual Lighthouse/PageSpeed Items To Test

- Largest Contentful Paint on homepage desktop and mobile.
- Total blocking time from external fonts/icons and JavaScript.
- Cumulative layout shift on homepage hero, product cards and all-products grid.
- Image transfer size warnings for hero, product and news/gallery images.
- Mobile navigation, language switching, product filters and quote form after script loading changes.
