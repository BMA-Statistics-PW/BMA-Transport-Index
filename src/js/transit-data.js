/* ─────────────────────────────────────────────────────────────────────
   BMA Urban Transport Index — Data Layer (transit-data.js)
   ข้อมูลกึ่งสถิตสำหรับแสดงผลหน้าหลัก / KPI / ตาราง
   กลุ่มงานสถิติและวิจัย สจส. กทม.  © Prapawadee_W.
   NOTE: ข้อมูล CSV จะถูกโหลดแบบ async ผ่าน data-loader.js
         ส่วนนี้ใช้สำหรับข้อมูลคงที่และค่าปัจจุบัน (ปี 2568)
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
    updatedAt: '2025-04-12',
  },

  /* ── KPI strip (ปี 2568 ล่าสุด) ── */
  kpi: {
    rail: {
      label:  'ผู้โดยสารรถไฟฟ้า',
      value:  '1.29',
      unit:   'ล้านคน/วัน',
      change: 9.2,
      trend:  'up',
    },
    bus: {
      label:  'ผู้โดยสารรถโดยสาร',
      value:  '557',
      unit:   'พันคน/วัน',
      change: -3.4,
      trend:  'down',
    },
    ferry: {
      label:  'ผู้โดยสารเรือ',
      value:  '44',
      unit:   'พันคน/วัน',
      change: 5.2,
      trend:  'up',
    },
    speed: {
      label:  'ความเร็วเฉลี่ย (ช่วงเช้า-ชั้นใน)',
      value:  '15.3',
      unit:   'กม./ชม.',
      change: -5.3,
      trend:  'down',
    },
    share: {
      label:  'สัดส่วนการเดินทางด้วยขนส่งสาธารณะ',
      value:  '11.7',
      unit:   '%',
      change: 0,
      trend:  'flat',
    },
  },

  /* ── ตาราง: ระบบขนส่งรายสาย ── */
  systems: [
    { no:1,  name:'BTS Skytrain (สายสีเขียว+สีทอง)', agency:'BTSC',  daily:842,  change:9.8,  ytd:153.8, level:'high' },
    { no:2,  name:'MRT Blue Line',                    agency:'BEM',   daily:412,  change:8.2,  ytd:75.2,  level:'high' },
    { no:3,  name:'MRT Purple Line',                  agency:'BEM',   daily:64,   change:12.4, ytd:11.7,  level:'mid'  },
    { no:4,  name:'MRT Yellow Line',                  agency:'EMH',   daily:58,   change:18.5, ytd:10.6,  level:'mid'  },
    { no:5,  name:'MRT Pink Line',                    agency:'NSMR',  daily:52,   change:22.1, ytd:9.5,   level:'mid'  },
    { no:6,  name:'Airport Rail Link',                agency:'SRTET', daily:73,   change:4.6,  ytd:13.3,  level:'mid'  },
    { no:7,  name:'SRT Red Line',                     agency:'SRT',   daily:31,   change:13.2, ytd:5.7,   level:'mid'  },
    { no:8,  name:'รถโดยสาร ขสมก.',                  agency:'ขสมก.', daily:497,  change:-3.8, ytd:90.7,  level:'mid'  },
    { no:9,  name:'เรือด่วนเจ้าพระยา',               agency:'CRB',   daily:21,   change:5.9,  ytd:3.8,   level:'mid'  },
    { no:10, name:'เรือคลองแสนแสบ',                  agency:'กทม.', daily:41,   change:3.7,  ytd:7.5,   level:'mid'  },
    { no:11, name:'เรือไฟฟ้า (คลองผดุงฯ)',           agency:'กทม.', daily:2.8,  change:28.4, ytd:0.5,   level:'low'  },
  ],

  /* ── ผู้โดยสารรายปี (ทุกระบบรวม) ── */
  annualTotal: {
    labels: ['2556','2557','2558','2559','2560','2561','2562','2563','2564','2565','2566','2567','2568'],
    rail:   [376,   396,   417,   408,   430,   480,   516,   348,   232,   380,   500,   558,   611 ],
    bus:    [332,   312,   321,   307,   299,   387,   377,   263,   177,   190,   149,   205,   181 ],
    ferry:  [72,    74,    76,    73,    75,    78,    80,    54,    38,    55,    62,    66,    69  ],
  },

  /* ── สัดส่วน Modal Share (ปี 2560–2568) ── */
  modalShare: {
    labels: ['2560','2561','2562','2563','2564','2565','2566','2567','2568 (est.)'],
    public: [14.8,  15.2,  15.9,  16.4,  13.1,  14.2,  14.9,  11.7,  12.1  ],
    private:[85.2,  84.8,  84.1,  83.6,  86.9,  85.8,  85.1,  88.3,  87.9  ],
  },

  /* ── ความเร็วเฉลี่ย (ข้อมูลสรุปสำหรับ KPI charts) ── */
  travelSpeed: {
    labels:   ['2560','2561','2562','2563','2564','2565','2566','2567','2568'],
    inner:    [18.5,  17.9,  17.4,  21.5,  23.2,  18.3,  16.8,  16.1,  15.3 ],
    middle:   [23.5,  22.8,  22.2,  26.4,  28.1,  23.1,  21.6,  21.2,  20.9 ],
    outer:    [28.6,  27.8,  27.3,  32.1,  34.2,  28.2,  27.1,  26.4,  26.0 ],
  },

  /* ── Benchmark (TomTom 2025) ── */
  benchmark: {
    bangkokRank:      10,
    congestionLevel:  67.9,
    tomtomSpeed:      20.4,
    bmaInnerSpeed:    15.3,
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

  /* ── ความเร็วแยกโซน/ทิศทาง (ปี 2568) ── */
  speedByZoneDirection: {
    labels: ['ชั้นใน', 'ชั้นกลาง', 'ชั้นนอก'],
    morningInbound:   [15.27, 20.90, 25.99],
    morningOutbound:  [16.80, 22.10, 27.10],
    eveningInbound:   [14.10, 18.90, 23.80],
    eveningOutbound:  [15.20, 20.00, 24.90],
  },

  /* ── แนวโน้มความเร็วรายโซน (2560-2568) ── */
  speedTrendByZone: {
    labels: ['2560','2561','2562','2563','2564','2565','2566','2567','2568'],
    Urban: {
      inbound:  [18.50, 17.90, 17.40, 21.50, 23.20, 18.30, 16.80, 16.10, 15.27],
      outbound: [19.80, 19.20, 18.70, 22.90, 24.50, 19.60, 18.20, 17.50, 16.80],
    },
    Suburban: {
      inbound:  [23.50, 22.80, 22.20, 26.40, 28.10, 23.10, 21.60, 21.20, 20.90],
      outbound: [24.20, 23.60, 23.10, 27.30, 29.30, 24.40, 22.70, 22.30, 22.10],
    },
    Rural: {
      inbound:  [28.60, 27.80, 27.30, 32.10, 34.20, 28.20, 27.10, 26.40, 25.99],
      outbound: [29.10, 28.40, 27.90, 33.40, 35.60, 29.50, 28.30, 27.60, 27.10],
    },
  },

  /* ── ประสิทธิภาพระบบขนส่ง (Radar chart) ── */
  performance: {
    labels:   ['ความถี่','ตรงเวลา','ความจุ','ความปลอดภัย','ความพึงพอใจ','ครอบคลุมพื้นที่'],
    year2567: [70, 72, 65, 80, 74, 60],
    year2568: [78, 80, 74, 85, 82, 72],
  },

};
