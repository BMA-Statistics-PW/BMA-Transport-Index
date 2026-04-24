# Changelog

All notable changes to **BMA Urban Transport Index** will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-04-12

### Added

#### Dashboard Pages
- `index.html` — Landing page with 4 navigation cards to all dashboards
- `overview.html` — Combined Transport Index overview with tabbed panels (KPI, Trend, Modal Share, Speed, Table)
- `ridership.html` — Passenger ridership dashboard (11 systems, annual trend, modal share stacked bar, radar chart, system table)
- `travel-speed.html` — Travel speed & congestion dashboard (3 zones, speed trend, TomTom benchmark)

#### Design System
- `src/css/bma-theme.css` — BMA CSS Custom Properties system (`--bma-navy`, `--bma-gold-bright`, `--bma-blue-mid`, etc.)
- `src/css/sidebar.css` — Sidebar navigation component
- `src/css/dashboard.css` — Dashboard-specific additions (transport mode colors, tabs, zone badges, metric rows, loading skeleton)

#### JavaScript Modules
- `src/js/transit-data.js` — Static `TRANSIT` data object (KPI, 11 systems, annual totals 2556–2568, modal share, TomTom benchmark)
- `src/js/data-loader.js` — Async CSV/JSON loader with base-path detection for GitHub Pages
- `src/js/charts.js` — Chart.js 4.4.1 renderers (annual trend, modal share stacked bar, speed trend, radar, doughnut)
- `src/js/ui.js` — UI controller (Thai date display, KPI strip, system table, benchmark table, tabs, sidebar)

#### Data
- `data/catalog.json` — W3C DCAT-standard data catalog with 2 datasets
- `data/ridership/transport_report.csv` — Ridership by system 2556–2568 (from Google Sheets)
- `data/ridership/transport_share.csv` — Modal share 2560–2568 (from Google Sheets)
- `data/ridership/meta.json` — Human-readable dataset metadata
- `data/ridership/transport_metadata.json` — Auto-generated CI/CD metadata
- `data/travel-speed/travel_speed.csv` — Speed data 2560–2568 (108 rows, 3 zones, 2 directions, 2 peaks)
- `data/travel-speed/meta.json` — Column definitions and data notes

#### CI/CD (GitHub Actions)
- `.github/workflows/deploy.yml` — Auto-deploy to GitHub Pages on push to `main`
- `.github/workflows/update-data.yml` — Weekly Monday 01:00 UTC auto-refresh CSV from Google Sheets
- `.github/workflows/sanity-check.yml` — Data validation triggered on `data/**` changes

#### Scripts
- `scripts/update_transport_csv.sh` — Download ridership CSVs from Google Sheets
- `scripts/sanity_check.mjs` — Validate all 3 CSV files + catalog.json (Node.js ESM)

#### Documentation
- `README.md` — Project overview, live links, tech stack, structure, attribution, citation
- `LICENSE` — CC BY 4.0
- `CHANGELOG.md` — This file
- `.gitignore` — Node.js + OS standard ignores

### Data Sources
- Bangkok Urban Transport (Ridership): สำนักการจราจรและขนส่ง กรุงเทพมหานคร
- BMA Travel Speed Survey: สำนักการจราจรและขนส่ง กรุงเทพมหานคร
- International Benchmark: TomTom Traffic Index 2025

### Standards Applied
- W3C DCAT 3.0 (data catalog)
- CC BY 4.0 (license)
- SemVer 2.0 (versioning)
- ISO 8601 (timestamps)
- WCAG 2.1 AA (accessibility)

---

[1.0.0]: https://github.com/bma-statistics-pw/BMA-Transport-Index/releases/tag/v1.0.0
