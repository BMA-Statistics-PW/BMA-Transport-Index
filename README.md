# BMA Urban Transport Index

**ดัชนีระบบขนส่งสาธารณะและการจราจร กรุงเทพมหานคร**

[![Deploy to GitHub Pages](https://github.com/bma-statistics-pw/BMA-Transport-Index/actions/workflows/deploy.yml/badge.svg)](https://github.com/bma-statistics-pw/BMA-Transport-Index/actions/workflows/deploy.yml)
[![Update Transport Data](https://github.com/bma-statistics-pw/BMA-Transport-Index/actions/workflows/update-data.yml/badge.svg)](https://github.com/bma-statistics-pw/BMA-Transport-Index/actions/workflows/update-data.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

---

## 🔗 Live Dashboard

| หน้า | URL |
|---|---|
| หน้าหลัก | <https://bma-statistics-pw.github.io/BMA-Transport-Index/> |
| ภาพรวม Transport Index | <https://bma-statistics-pw.github.io/BMA-Transport-Index/overview.html> |
| ผู้โดยสาร | <https://bma-statistics-pw.github.io/BMA-Transport-Index/ridership.html> |
| ความเร็ว/จราจร | <https://bma-statistics-pw.github.io/BMA-Transport-Index/travel-speed.html> |
| Open Data Catalog | <https://bma-statistics-pw.github.io/BMA-Transport-Index/data/catalog.json> |

---

## ภาพรวม

**BMA Urban Transport Index** รวบรวมและนำเสนอข้อมูล 2 ชุดหลักของ
สำนักการจราจรและขนส่ง กรุงเทพมหานคร (สจส. กทม.) ในรูปแบบ interactive dashboard มาตรฐานสากล:

| ชุดข้อมูล | รายละเอียด | ช่วงเวลา |
|---|---|---|
| **Ridership** | ผู้โดยสารระบบขนส่งสาธารณะ 11 ระบบ | ปี 2556–2568 |
| **Travel Speed** | ความเร็วเฉลี่ย 51 ช่วงถนน 3 โซน ช่วงเร่งด่วน | ปี 2560–2568 |

---

## แหล่งข้อมูล (Data Sources)

### Ridership
- **Google Sheets (รายงาน)**: [`1OV02tcFrMC6_gNKoHrb3K8mheRallx0cwYsFjZFqNb4`](https://docs.google.com/spreadsheets/d/1OV02tcFrMC6_gNKoHrb3K8mheRallx0cwYsFjZFqNb4)  
  Sheet: `Report`
- **Google Sheets (Modal Share)**: [`1fOIvRw9bxC1DOWCnTN8hVW2Z8L4n6ICgzD_WxgIDYt0`](https://docs.google.com/spreadsheets/d/1fOIvRw9bxC1DOWCnTN8hVW2Z8L4n6ICgzD_WxgIDYt0)
- อัปเดตอัตโนมัติทุกวันจันทร์ผ่าน GitHub Actions

### Travel Speed
- **BMA Field Survey** — สำรวจภาคสนาม 51 ช่วงถนนสายหลัก กรุงเทพมหานคร (ปี 2568)
- **TomTom Traffic Index 2025** (international benchmark reference): <https://www.tomtom.com/traffic-index/>

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 · CSS3 (Custom Properties) · Vanilla JavaScript (ES2020) |
| Charts | [Chart.js 4.4.1](https://www.chartjs.org/) via CDN |
| Fonts | [Sarabun + Chakra Petch](https://fonts.google.com/) (Google Fonts) |
| Hosting | GitHub Pages (静的サイト) |
| CI/CD | GitHub Actions (deploy + weekly data refresh) |
| Data Format | CSV · JSON (W3C DCAT catalog) |
| Build tools | None — zero-dependency, static-first architecture |

---

## Project Structure

```
BMA_urban_transport_index/
├── index.html                   # Landing page
├── overview.html                # Combined Transport Index overview
├── ridership.html               # Passenger ridership dashboard
├── travel-speed.html            # Travel speed & congestion dashboard
│
├── src/
│   ├── css/
│   │   ├── bma-theme.css        # BMA Design System (CSS Custom Properties)
│   │   └── dashboard.css        # Dashboard-specific additions
│   └── js/
│       ├── transit-data.js      # Static TRANSIT data object
│       ├── data-loader.js       # Async CSV/JSON loader
│       ├── charts.js            # Chart.js renderers
│       └── ui.js                # UI controller (tabs, sidebar, KPI)
│
├── data/
│   ├── catalog.json             # W3C DCAT data catalog
│   ├── ridership/
│   │   ├── transport_report.csv # Ridership by system 2556–2568
│   │   ├── transport_share.csv  # Modal share 2560–2567
│   │   ├── meta.json            # Human-readable metadata
│   │   └── transport_metadata.json  # Auto-generated (CI/CD)
│   └── travel-speed/
│       ├── travel_speed.csv     # Speed data 2560–2568 (derived — do not edit)
│       ├── meta.json            # Column definitions & notes
│       └── source/              # ไฟล์สำรวจต้นฉบับ (read-only)
│           ├── road_speeds_2568.csv
│           ├── road_traveltime_2568.csv
│           └── zone_{urban,suburban,rural}_trend_2560-2568.csv
│
├── scripts/
│   ├── update_transport_csv.sh  # Download CSVs from Google Sheets
│   └── sanity_check.mjs         # Validate CSV + transit-data.js (Node.js)
│
├── tools/                       # สคริปต์เตรียมข้อมูล (ไม่ใช่ส่วนของเว็บ)
│   ├── build_travel_speed.py    # สร้าง travel_speed.csv จาก source/
│   └── *.ps1, zone_trends_*.csv # สคริปต์/ผลลัพธ์ชั่วคราวจากการสกัดข้อมูล
│
├── .github/
│   └── workflows/
│       ├── deploy.yml           # GitHub Pages auto-deploy
│       ├── update-data.yml      # Weekly Monday data refresh
│       └── sanity-check.yml     # Triggered on data/ changes
│
├── README.md
├── LICENSE                      # CC BY 4.0
└── CHANGELOG.md
```

---

## ความถูกต้องของข้อมูล (Data Integrity)

ตัวเลขทุกค่าที่แสดงบน dashboard ต้องสืบกลับไปยังไฟล์ใน `data/` ได้เสมอ

| ไฟล์ | สถานะ | วิธีแก้ไข |
|---|---|---|
| `data/ridership/transport_report.csv` | ต้นฉบับ | ดึงอัตโนมัติจาก Google Sheets |
| `data/ridership/transport_share.csv` | ต้นฉบับ | ดึงอัตโนมัติจาก Google Sheets |
| `data/travel-speed/source/*.csv` | ต้นฉบับ | แทนที่ด้วยไฟล์สำรวจใหม่ |
| `data/travel-speed/travel_speed.csv` | **สร้างอัตโนมัติ** | `python tools/build_travel_speed.py` |
| `src/js/transit-data.js` | ค่าสรุป | คำนวณจากไฟล์ข้างต้น — ห้ามแก้ตัวเลขด้วยมือ |

ตรวจความสอดคล้องก่อน commit:

```bash
node scripts/sanity_check.mjs
```

### ข้อจำกัดของข้อมูลที่ทราบแล้ว (Known Gaps)

- **เรือโดยสาร** — ยังไม่มีข้อมูลรายระบบใน `transport_report.csv`
  มีเพียงยอดรวมเรือใน `transport_share.csv` ถึงปี 2567
  KPI และกราฟที่เกี่ยวกับเรือจึงถูกถอดออกจนกว่าจะได้ข้อมูลจากกรมเจ้าท่า
- **Modal Share** — มีถึงปี 2567 เท่านั้น ยังไม่เผยแพร่ปี 2568
- **ความเร็วช่วงเย็น** — มีเฉพาะปี 2568 อนุกรม 2560–2567 มีเฉพาะช่วงเช้า
- **ช่วงถนน** — ปี 2568 ปรับใหม่เหลือ 51 ช่วง (เดิม 55 ช่วง)
  ถนนที่พาดผ่านหลายโซนถูกนับในทุกโซนที่พาดผ่าน
- **BRT ปี 2567** — มีข้อมูลไม่เต็มปี ทำให้ %YoY ปี 2568 (+457%) ไม่สะท้อนการเติบโตจริง
- **ดัชนีประสิทธิภาพระบบขนส่ง (radar)** — ยังไม่มีผลสำรวจรองรับ การ์ดจะถูกซ่อนอัตโนมัติ
- **ผู้โดยสารรายเดือน** — `transport_monthly_systems.csv` ครอบคลุม 8 ระบบ
  ไม่ครบเท่า `transport_report.csv` (11 ระบบ)

---

## การนำไปใช้งาน (Getting Started)

### ดูในเครื่อง (Local)

เนื่องจาก `fetch()` ใช้ CORS policy จำเป็นต้องรันผ่าน local HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code — install "Live Server" extension แล้ว click Go Live
```

แล้วเปิด `http://localhost:8000`

### Deploy ไปยัง GitHub Pages

1. Fork/clone repo นี้
2. ใน repository Settings → Pages → Source: **GitHub Actions**
3. Push ไปยัง `main` branch — GitHub Actions จะ deploy อัตโนมัติ

### อัปเดตข้อมูล

ข้อมูลจะอัปเดตอัตโนมัติทุกวันจันทร์เวลา 08:00 น. (ICT) ผ่าน GitHub Actions  
สามารถ trigger manual ได้ที่ Actions → **Update Transport Data** → Run workflow

---

## Standards & Compliance

| Standard | การนำไปใช้ |
|---|---|
| [W3C DCAT](https://www.w3.org/TR/vocab-dcat-3/) | `data/catalog.json` — data catalog |
| [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) | Timestamps ใน metadata |
| [SemVer](https://semver.org/) | Version numbering (MAJOR.MINOR.PATCH) |
| [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) | aria-label, role, contrast ratio |
| [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | License สำหรับข้อมูลและ source code |

---

## Attribution (การอ้างอิง)

หากนำข้อมูลหรือ dashboard นี้ไปใช้ กรุณาอ้างอิง:

```
สำนักการจราจรและขนส่ง กรุงเทพมหานคร. (2568).
BMA Urban Transport Index — ดัชนีระบบขนส่งสาธารณะและการจราจร กรุงเทพมหานคร.
สืบค้นจาก https://bma-statistics-pw.github.io/BMA-Transport-Index/
```

```bibtex
@misc{bma_transport_index_2025,
  author       = {สำนักการจราจรและขนส่ง กรุงเทพมหานคร},
  title        = {BMA Urban Transport Index},
  year         = {2025},
  howpublished = {\url{https://bma-statistics-pw.github.io/BMA-Transport-Index/}},
  note         = {กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน สจส. กทม.}
}
```

---

## License

ข้อมูล รูปภาพ และ source code ในโครงการนี้เผยแพร่ภายใต้สัญญาอนุญาต  
**Creative Commons Attribution 4.0 International (CC BY 4.0)**

ดูรายละเอียดเพิ่มเติมที่ [LICENSE](LICENSE)  
หรือ <https://creativecommons.org/licenses/by/4.0/>

---

*Maintained by กลุ่มงานสถิติและวิจัย · กองนโยบายและแผนงาน · สำนักการจราจรและขนส่ง กรุงเทพมหานคร*
