# 📊 Dashboard สถิติและวิจัย — สจส. กทม.

**กลุ่มงานสถิติและวิจัย | กองนโยบายและแผนงาน**  
**สำนักการจราจรและขนส่ง | กรุงเทพมหานคร**  
© Prapawadee_W.

---

## 📁 โครงสร้างไฟล์

```
sjs-dashboard/
│
├── index.html              ← หน้าหลัก (HTML โครงสร้างล้วน)
│
├── css/
│   ├── main.css            ← ตัวแปรสี, layout, topbar, footer, responsive
│   ├── sidebar.css         ← sidebar และ navigation
│   └── components.css      ← KPI cards, charts, table, badges, progress bars
│
├── js/
│   ├── data.js             ← โหลด transit.json และ fallback data
│   ├── charts.js           ← กราฟทั้ง 4 ตัว (Line, Doughnut, Bar, Radar)
│   └── main.js             ← วันที่ไทย, KPI, ตาราง, progress, refresh
│
├── data/
│   └── transit.json        ← ข้อมูลกลาง (แก้ไขตรงนี้เมื่ออัปเดตข้อมูล)
│
├── images/                 ← วางโลโก้ กทม. และรูปภาพที่ใช้
│
└── README.md               ← คู่มือนี้
```

---

## 🔧 วิธีอัปเดตข้อมูล

**แก้ไขที่ไฟล์เดียว:** `data/transit.json`

```json
{
  "systems": [
    { "no":1, "name":"BTS Skytrain", "daily": 780, "change": 9.2, ... }
  ]
}
```

ไม่ต้องแตะไฟล์ HTML หรือ JS เลย ✅

---

## 🚀 วิธี Deploy บน GitHub Pages

1. สร้าง Repository บน GitHub (เช่น `sjs-dashboard`)
2. อัปโหลดไฟล์ทั้งหมดตามโครงสร้างข้างบน
3. ไปที่ **Settings → Pages**
4. เลือก **Branch: main** → **/ (root)** → กด Save
5. รอ 1–2 นาที เข้าได้ที่:

```
https://username.github.io/sjs-dashboard
```

---

## ⚠️ หมายเหตุ

- ไฟล์ `data/transit.json` จะโหลดได้เฉพาะเมื่อเปิดผ่าน **web server** (GitHub Pages, Live Server)
- หากเปิดจาก `file://` โดยตรง ระบบจะใช้ **fallback data** ใน `js/data.js` อัตโนมัติ
- ลำดับการโหลด JS สำคัญ: `data.js` → `charts.js` → `main.js`

---

## 📦 Dependencies (CDN ไม่ต้องติดตั้ง)

| Library | Version | ใช้สำหรับ |
|---|---|---|
| Chart.js | latest | กราฟทุกประเภท |
| Google Fonts: Sarabun | — | ฟอนต์ภาษาไทย |
| IBM Plex Sans Thai | — | ฟอนต์สำรอง |
