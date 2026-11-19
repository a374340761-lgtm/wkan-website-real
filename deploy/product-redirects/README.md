# Legacy product SEO redirects

Production runs on GitHub Pages behind Cloudflare. Publish `worker.mjs` with its imported `catalog.mjs` as an ES module Worker and attach only these Cloudflare Worker routes:

- `www.waikwantent.com/product-detail.html*`
- `www.waikwantent.com/zh/product-detail.html*`

Check that English and Chinese examples with `?sku=9403` return HTTP 301 to their respective /products/ pages. The destination must return HTTP 200 with a self-canonical. Repeat with attribution parameters to confirm they survive. Verify that `?sku=2001` still loads its current product. Detach the two routes to roll back without changing the origin.

Nonempty unknown SKUs return an HTTP 404 with the site's error page. Valid dynamic catalog identifiers, including product IDs and merged aliases, pass through. Requests without a SKU also pass through. Regenerate using `node scripts/build-product-sitemap.mjs --edge-only` after catalog changes. Run `node deploy/product-redirects/check.mjs` and release the updated Worker before publishing products that use new dynamic identifiers.

Use Search Console query/page/country data to prioritize remaining dynamic products and validate overlap among the canopy supplier, OEM manufacturer and 10×10 buyer pages before merging any URLs. Measure AI citations separately in Bing Webmaster Tools. Do not change Cloudflare training-crawler policy to chase citations.
