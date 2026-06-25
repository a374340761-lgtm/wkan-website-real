# SERP CTR Copy Update

Generated: 2026-06-25

## Scope

Phase 2 focused on English SERP copy and first-screen buyer clarity. It did not change image performance, page layout, sitemap strategy, or product data.

Updated fields:

- Static `<title>`
- `meta name="description"`
- Open Graph and Twitter title/description
- H1 fallback text
- First-screen answer copy where the page renders it directly or through `scripts/multilang.js`

## Core Pages

| Page | Old title | New title |
|---|---|---|
| `/` | Custom Canopy Tent Manufacturer \| Pop Up & Event Tents \| Wai Kwan | Custom Canopy Tent Manufacturer \| OEM Flags & Displays \| WaiKwan |
| `/custom-canopy-tent-manufacturer.html` | Custom Canopy Tent Manufacturer \| Custom Printed Pop Up Canopy Tents \| WaiKwan | Custom Canopy Tent Manufacturer \| OEM Pop Up Tents \| WaiKwan |
| `/beach-flag-supplier.html` | Beach Flag Supplier \| Custom Beach Flags, Feather Flags & Flag Poles \| WaiKwan | Beach Flag Supplier \| Feather & Teardrop Flag OEM \| WaiKwan |
| `/portable-display-systems.html` | Portable Display Systems Manufacturer \| Trade Show Display Stands & Backdrops \| WaiKwan | Portable Display Systems Manufacturer \| OEM Trade Show Kits \| WaiKwan |
| `/10x10-pop-up-canopy-tent.html` | 10x10 Pop Up Canopy Tent / duplicate title state | 10x10 Pop Up Canopy Tent \| Custom 3x3 OEM Factory \| WaiKwan |
| `/contact-us.html` | Contact Us \| WaiKwan Tent Manufacturing | Request a Quote \| Custom Tents, Flags & Displays \| WaiKwan |

## Core Page Intent Changes

| Page | New SERP description angle |
|---|---|
| `/` | Factory-direct OEM/ODM tents, flags and displays; asks buyer to share specs for MOQ, lead time and export packing. |
| `/custom-canopy-tent-manufacturer.html` | OEM/ODM pop up tents, printed roofs, sidewalls and export packing with quote inputs. |
| `/beach-flag-supplier.html` | Feather and teardrop flag kits with poles, bases, bags, MOQ guidance and lead time. |
| `/portable-display-systems.html` | Fabric backdrops, counters, roll-up stands and OEM trade show kits with graphics and export packing. |
| `/10x10-pop-up-canopy-tent.html` | 3x3 m / 10x10 B2B OEM program with frames, printing, sidewalls, weights and shipping details. |
| `/contact-us.html` | RFQ entry page for OEM/ODM quote requests with specs, quantity, artwork and destination. |

## SEO Long-Tail Pages

| Page | Old title | New title |
|---|---|---|
| `/seo/custom-canopy-tent-factory-for-reseller-programs.html` | Custom Canopy Tent Factory for Reseller Programs \| WaiKwan | Custom Canopy Tent Factory for Resellers \| OEM Programs \| WaiKwan |
| `/seo/trade-show-canopy-tent-manufacturer-for-distributors.html` | Trade Show Canopy Tent Manufacturer for Distributors \| WaiKwan | Trade Show Canopy Tent Manufacturer \| Distributor OEM \| WaiKwan |
| `/seo/custom-printed-canopy-tent-manufacturer-oem-china.html` | Custom Printed Canopy Tent Manufacturer OEM China \| WaiKwan | Custom Printed Canopy Tent Manufacturer \| OEM China \| WaiKwan |
| `/seo/collapsible-display-system-wholesale-distributor-pricing.html` | Collapsible Display System Wholesale Distributor Pricing \| WaiKwan | Collapsible Display System Wholesale \| Distributor Pricing \| WaiKwan |
| `/seo/advertising-flag-pole-and-base-wholesale-supplier-b2b.html` | Advertising Flag Pole and Base Wholesale Supplier B2B \| WaiKwan | Advertising Flag Pole and Base Wholesale Supplier \| WaiKwan |

## SEO Long-Tail Intent Changes

| Page | New first-screen answer angle |
|---|---|
| Reseller canopy factory | OEM printing, neutral cartons, repeatable frame SKUs, spare parts, MOQ tiers and reseller documentation. |
| Trade show canopy distributor | Distributor resale programs with printed roofs, walls, counters, frame spares, MOQ tiers and export packing. |
| Custom printed canopy OEM China | China OEM printed canopy tent manufacturing with branded roofs, sidewalls, sample timing and export packing. |
| Collapsible display distributor pricing | Wholesale display pricing for distributors with frames, fabric graphics, cases, volume tiers and lead time. |
| Advertising flag pole and base | Flag hardware kits for print shops and distributors with pole/base options, MOQ and shipping inputs. |

## Notes

- `10x10-pop-up-canopy-tent.html` now has a single `<title>` element instead of competing title tags.
- `scripts/multilang.js` English runtime strings were updated for the core pages that use `data-translate`, so the visible H1/lead copy does not revert after JavaScript loads.
- The update intentionally keeps Chinese page copy out of scope except where existing Chinese pages inherit the same translation keys in Chinese mode.
