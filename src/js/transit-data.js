/* ─────────────────────────────────────────────────────────────────────
   BMA Urban Transport Index — Data Layer (transit-data.js)
   ค่าสรุปสำหรับ KPI / ตาราง / กราฟหน้าหลัก
   กลุ่มงานสถิติและวิจัย สจส. กทม.  © Prapawadee_W.

   ⚠️ ทุกตัวเลขในไฟล์นี้คำนวณจากไฟล์ต้นฉบับใน data/ เท่านั้น
      - ผู้โดยสาร     : data/ridership/transport_report.csv
      - สัดส่วนการเดินทาง : data/ridership/transport_share.csv
      - ความเร็ว      : data/travel-speed/travel_speed.csv
      ห้ามแก้ตัวเลขด้วยมือ — หากข้อมูลต้นฉบับเปลี่ยน ให้รัน
      node scripts/sanity_check.mjs เพื่อตรวจความสอดคล้อง
─────────────────────────────────────────────────────────────────────── */

/* jshint esversion:6 */
/* global TRANSIT */

const TRANSIT = {

  /* ── metadata ── */
  meta: {
    year:      2568,
    yearCE:    2025,
    period:    '2556–2568',
    unit:      'ล้านเที่ยวคน/ปี',
    source:    'กลุ่มงานสถิติและวิจัย กองนโยบายและแผนงาน สจส. กทม.',
    copyright: '© Prapawadee_W.',
    updatedAt: '2026-07-21',
  },

  /* ── KPI strip (ปี 2568) ──────────────────────────────────────────
     rail  = ผลรวมระบบรางทั้ง 9 สาย     514.19 ล้านเที่ยว/ปี
     bus   = ขสมก. + BRT                183.91 ล้านเที่ยว/ปี
     share = สัดส่วนสาธารณะปีล่าสุดที่มีข้อมูล (2567)
     speed = ความเร็วเช้า·ขาเข้า·ชั้นใน ปี 2568                        */
  kpi: {
    rail: {
      label:  'ผู้โดยสารรถไฟฟ้า',
      value:  '1.41',
      unit:   'ล้านคน/วัน',
      change: -1.0,
      trend:  'down',
    },
    bus: {
      label:  'ผู้โดยสารรถโดยสาร',
      value:  '504',
      unit:   'พันคน/วัน',
      change: -10.4,
      trend:  'down',
    },
    speed: {
      label:  'ความเร็วเฉลี่ย (ช่วงเช้า-ชั้นใน)',
      value:  '15.27',
      unit:   'กม./ชม.',
      change: -3.8,
      trend:  'down',
    },
    share: {
      label:  'สัดส่วนการเดินทางด้วยขนส่งสาธารณะ (2567)',
      value:  '11.71',
      unit:   '%',
      change: -19.0,
      trend:  'down',
    },
  },

  /* ── ตาราง: ระบบขนส่งรายสาย (ปี 2568) ───────────────────────────
     daily  = พันเที่ยวคน/วัน (= รายปี ÷ 365)
     change = %YoY เทียบปี 2567
     annual = ล้านเที่ยวคน/ปี                                        */
  systems: [
    { no:1,  name:'BTS สายสีเขียว',        agency:'BTSC',  daily:717.3, change:-1.6,  annual:261.8, level:'high' },
    { no:2,  name:'MRT สายสีน้ำเงิน',      agency:'BEM',   daily:416.1, change:-3.4,  annual:151.9, level:'high' },
    { no:3,  name:'รถโดยสาร ขสมก.',        agency:'ขสมก.', daily:496.6, change:-11.4, annual:181.3, level:'high' },
    { no:4,  name:'Airport Rail Link',      agency:'SRTET', daily:67.1,  change:1.3,   annual:24.5,  level:'mid'  },
    { no:5,  name:'MRT สายสีม่วง',         agency:'BEM',   daily:66.9,  change:-1.2,  annual:24.4,  level:'mid'  },
    { no:6,  name:'MRT สายสีชมพู',         agency:'NSMR',  daily:58.8,  change:6.3,   annual:21.5,  level:'mid'  },
    { no:7,  name:'MRT สายสีเหลือง',       agency:'EMH',   daily:44.4,  change:13.4,  annual:16.2,  level:'mid'  },
    { no:8,  name:'SRT สายสีแดง (เหนือ)',  agency:'SRT',   daily:28.5,  change:12.5,  annual:10.4,  level:'mid'  },
    { no:9,  name:'BTS สายสีทอง',          agency:'BTSC',  daily:7.4,   change:-2.5,  annual:2.7,   level:'low'  },
    { no:10, name:'BRT',                    agency:'กทม.', daily:7.3,   change:457.5, annual:2.7,   level:'low'  },
    { no:11, name:'SRT สายสีแดง (ตะวันตก)', agency:'SRT',  daily:2.2,   change:15.5,  annual:0.8,   level:'low'  },
  ],

  /* ── ผู้โดยสารรายปี (ล้านเที่ยวคน/ปี) ───────────────────────────
     ที่มา: transport_report.csv — ไม่มีข้อมูลเรือในตารางนี้        */
  annualTotal: {
    labels: ['2556','2557','2558','2559','2560','2561','2562','2563','2564','2565','2566','2567','2568'],
    rail:   [317,   339,   356,   373,   395,   408,   441,   310,   181,   332,   473,   519,   514 ],
    bus:    [332,   312,   321,   307,   299,   387,   377,   263,   177,   190,   149,   205,   184 ],
  },

  /* ── สัดส่วน Modal Share (%) ─────────────────────────────────────
     ที่มา: transport_share.csv แถว "สัดส่วนสาธารณะ" / "สัดส่วนระบบรถส่วนบุคคล"
     มีข้อมูลถึงปี 2567 เท่านั้น — ปี 2568 ยังไม่เผยแพร่             */
  modalShare: {
    labels: ['2560','2561','2562','2563','2564','2565','2566','2567'],
    public: [20.55, 17.90, 19.42, 15.62, 8.27,  9.79,  14.46, 11.71],
    private:[79.45, 82.10, 80.58, 84.38, 91.73, 90.21, 85.54, 88.29],
  },

  /* ── ความเร็วเฉลี่ย ช่วงเช้า·ขาเข้า (กม./ชม.) ───────────────────
     ที่มา: travel_speed.csv (peak=Morning, direction=Inbound)      */
  travelSpeed: {
    labels: ['2560','2561','2562','2563','2564','2565','2566','2567','2568'],
    inner:  [15.33, 16.05, 15.88, 17.15, 20.67, 17.27, 17.43, 15.88, 15.27],
    middle: [21.31, 21.23, 21.60, 22.27, 28.20, 22.77, 24.12, 21.62, 20.89],
    outer:  [29.23, 27.11, 26.59, 28.40, 32.69, 26.99, 28.21, 24.55, 25.99],
  },

  /* ── แนวโน้มความเร็วรายโซน ช่วงเช้า (2560–2568) ─────────────── */
  speedTrendByZone: {
    labels: ['2560','2561','2562','2563','2564','2565','2566','2567','2568'],
    Urban: {
      inbound:  [15.33, 16.05, 15.88, 17.15, 20.67, 17.27, 17.43, 15.88, 15.27],
      outbound: [15.26, 15.88, 15.98, 16.82, 20.63, 17.92, 17.90, 17.77, 17.16],
    },
    Suburban: {
      inbound:  [21.31, 21.23, 21.60, 22.27, 28.20, 22.77, 24.12, 21.62, 20.89],
      outbound: [26.13, 26.12, 24.29, 26.05, 30.77, 27.37, 29.20, 27.24, 27.14],
    },
    Rural: {
      inbound:  [29.23, 27.11, 26.59, 28.40, 32.69, 26.99, 28.21, 24.55, 25.99],
      outbound: [35.99, 33.45, 33.26, 34.12, 39.75, 33.28, 36.44, 34.47, 35.37],
    },
  },

  /* ── ความเร็วแยกโซน/ทิศทาง (ปี 2568) ────────────────────────────
     Morning จาก zone trend survey · Evening จาก road_speeds_2568   */
  speedByZoneDirection: {
    labels: ['ชั้นใน', 'ชั้นกลาง', 'ชั้นนอก'],
    morningInbound:   [15.27, 20.89, 25.99],
    morningOutbound:  [17.16, 27.14, 35.37],
    eveningInbound:   [14.58, 23.56, 28.21],
    eveningOutbound:  [14.89, 26.39, 32.89],
  },

  /* ── Benchmark ภายนอก (TomTom Traffic Index 2025) ────────────────
     ใช้เปรียบเทียบระดับสากลเท่านั้น วิธีเก็บข้อมูลต่างจาก สจส.     */
  benchmark: {
    bangkokRank:      10,
    congestionLevel:  67.9,
    tomtomSpeed:      20.4,
    bmaInnerSpeed:    15.27,
    avgTimePer10km:   '22:59',
    morningRushTime:  '25:45',
    eveningRushTime:  '31:25',
    peakCongestion:   126.5,
    annualLostHours:  115,
    topCities: [
      { rank:1,  city:'London',    country:'GB', congestion:97.0 },
      { rank:2,  city:'Dublin',    country:'IE', congestion:89.8 },
      { rank:3,  city:'Milan',     country:'IT', congestion:87.6 },
      { rank:4,  city:'Istanbul',  country:'TR', congestion:87.0 },
      { rank:5,  city:'Tokyo',     country:'JP', congestion:83.3 },
      { rank:10, city:'Bangkok',   country:'TH', congestion:67.9 },
    ],
  },

};
