#!/usr/bin/env python3
"""
สร้าง data/travel-speed/travel_speed.csv จากไฟล์สำรวจต้นฉบับใน
data/travel-speed/source/  (ห้ามแก้ travel_speed.csv ด้วยมือ)

  Morning 2560-2568 : ค่าเฉลี่ยรายโซนจาก zone_{urban,suburban,rural}_trend_2560-2568.csv
  Evening 2568      : ค่าเฉลี่ยรายโซนจาก road_speeds_2568.csv (จับคู่ถนน -> โซน)

หมายเหตุ: ปี 2568 มีการปรับช่วงถนน (51 ถนน) ต่างจากอนุกรมเดิม (55 ช่วง)
ถนนที่พาดผ่านมากกว่าหนึ่งโซนจะถูกนับในทุกโซนที่พาดผ่าน
กลุ่มงานสถิติและวิจัย สจส. กทม.  (c) Prapawadee_W.
"""
import csv, io, re, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'travel-speed')
SRC = os.path.join(BASE, 'source')
OUT = os.path.join(BASE, 'travel_speed.csv')
ZONE_FILES = [('Inner', 'zone_urban_trend_2560-2568.csv'),
              ('Middle', 'zone_suburban_trend_2560-2568.csv'),
              ('Outer', 'zone_rural_trend_2560-2568.csv')]
THAI_YEARS = list(range(2560, 2569))

# ถนนปี 2568 ที่ช่วงสำรวจถูกรวมใหม่จนพาดผ่านหลายโซน
SPAN = {
    ('พหลโยธิน(ส่วนต้น)', 'แยกวงเวียนอนุสาวรีย์หลักสี่ถึงแยกอนุสาวรีย์ชัยฯ'): ['Middle', 'Inner'],
    ('พหลโยธิน(ส่วนปลาย)', 'แยกโรงเรียนนายเรืออากาศ(คปอ.)ถึงแยกวงเวียนอนุสาวรีย์หลักสี่'): ['Outer'],
    ('เพชรเกษม', 'สุดเขตกรุงเทพฯถึงแยกวงเวียนใหญ่'): ['Outer', 'Middle'],
    ('เพชรบุรี', 'แยกคลองตันถึงแยกยมราช'): ['Middle', 'Inner'],
    ('รามคำแหง(ส่วนต้น)', 'แยกสวนสนถึงแยกคลองตัน'): ['Middle'],
    ('วิภาวดีรังสิต', 'แยกหลักสี่ถึงแยกใต้ด่วนดินแดง'): ['Middle', 'Inner'],
}

norm = lambda s: re.sub(r'\s+', '', s or '')

def read(name):
    with open(os.path.join(SRC, name), encoding='utf-8-sig') as fh:
        return list(csv.reader(io.StringIO(fh.read())))

def num(s):
    s = (s or '').strip().replace(',', '')
    try:
        return float(s)
    except ValueError:
        return None

def mean(v):
    return sum(v) / len(v) if v else None

rows = []
zone_of = {}

# ── Morning 2560-2568 ────────────────────────────────────────────────
for zone, fname in ZONE_FILES:
    roads = [r for r in read(fname)[3:] if r and r[0].strip().isdigit()]
    for r in roads:
        zone_of.setdefault((norm(r[1]), norm(r[2])), []).append(zone)
    for i, thai in enumerate(THAI_YEARS):
        col = 3 + i * 2
        for direction, c in (('Inbound', col), ('Outbound', col + 1)):
            vals = [v for r in roads if (v := num(r[c])) is not None]
            if not vals:
                continue
            rows.append((thai - 543, zone, direction, 'Morning',
                         mean(vals), len(vals), 'zone_trend_2560-2568'))

# ── Evening 2568 ─────────────────────────────────────────────────────
acc = {}
for r in [x for x in read('road_speeds_2568.csv')[3:] if x and x[0].strip().isdigit()]:
    key = (norm(r[1]), norm(r[2]))
    zones = zone_of.get(key) or SPAN.get(key)
    if not zones:
        raise SystemExit(f'ไม่พบโซนของถนน: {r[1]} | {r[2]}')
    for zone in zones:
        for direction, c in (('Inbound', 6), ('Outbound', 7)):
            if (v := num(r[c])) is not None:
                acc.setdefault((zone, direction), []).append(v)
for (zone, direction), vals in acc.items():
    rows.append((2025, zone, direction, 'Evening',
                 mean(vals), len(vals), 'road_speeds_2568'))

order = {'Inner': 0, 'Middle': 1, 'Outer': 2}
rows.sort(key=lambda r: (r[0], order[r[1]], r[3], r[2]))

with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
    w = csv.writer(fh, lineterminator='\n')
    w.writerow(['year', 'zone', 'direction', 'peak', 'speed_kmh',
                'travel_time_per10km', 'n_roads', 'source'])
    for year, zone, direction, peak, speed, n, src in rows:
        w.writerow([year, zone, direction, peak, f'{speed:.2f}',
                    f'{600 / speed:.1f}', n, src])

print(f'เขียน {OUT} จำนวน {len(rows)} แถว')
