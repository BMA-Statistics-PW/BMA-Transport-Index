import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const catalogPath = path.join(root, 'data/catalog.json');
const sharePath   = path.join(root, 'data/ridership/transport_share.csv');
const reportPath  = path.join(root, 'data/ridership/transport_report.csv');
const speedPath   = path.join(root, 'data/travel-speed/travel_speed.csv');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map(v => v.trim());
}

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
  return { headers, rows };
}

function extractYears(headers, skip = 1) {
  return headers
    .slice(skip)
    .map(h => {
      const m = String(h).trim().match(/(25\d{2})\s*$/);
      return m ? Number(m[1]) : NaN;
    })
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
}

/* ปีที่ต้องมีครบในแต่ละชุดข้อมูล — กันกรณีคอลัมน์ถูกข้ามแบบเงียบ ๆ */
function assertContiguousYears(years, from, to, label) {
  for (let y = from; y <= to; y += 1) {
    assert(years.includes(y), `${label}: ขาดคอลัมน์ปี ${y} (อาจเกิดจากหัวคอลัมน์ต้นทางมีข้อความปนมา)`);
  }
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
assert(Array.isArray(catalog.datasets) && catalog.datasets.length >= 2, 'catalog.json must contain at least 2 datasets');

const share = readCsv(sharePath);
const report = readCsv(reportPath);

const shareYears = extractYears(share.headers, 1);
const reportYears = extractYears(report.headers, 2);

assertContiguousYears(shareYears, 2560, 2567, 'transport_share.csv');
assertContiguousYears(reportYears, 2556, 2568, 'transport_report.csv');

assert(shareYears[0] <= 2560, 'share dataset should include year 2560 or earlier');
assert(shareYears[shareYears.length - 1] >= 2567, 'share dataset should include year 2567 or later');
assert(reportYears[0] <= 2556, 'report dataset should include year 2556 or earlier');

const shareSystemHeader = share.headers[0];
const reportSystemHeader = report.headers[1] || report.headers[0];
const shareRows = share.rows.filter(r => String(r[shareSystemHeader]).trim() !== '');
const reportRows = report.rows.filter(r => String(r[reportSystemHeader]).trim() !== '');

assert(shareRows.length >= 10, 'share dataset should have at least 10 non-empty rows');
assert(reportRows.length >= 10, 'report dataset should have at least 10 non-empty rows');

const hasPublicShare = shareRows.some(r => String(r[shareSystemHeader]).includes('สัดส่วนสาธารณะ'));
const hasPrivateShare = shareRows.some(r => String(r[shareSystemHeader]).includes('สัดส่วนระบบรถส่วนบุคคล'));
assert(hasPublicShare && hasPrivateShare, 'share dataset must contain public/private modal share rows');

const hasBrtRow = reportRows.some(r => String(r[reportSystemHeader]).includes('BRT'));
assert(hasBrtRow, 'report dataset should contain BRT row');

// travel_speed.csv
const speed = readCsv(speedPath);
assert(speed.headers.includes('year'),       'travel_speed.csv must have "year" column');
assert(speed.headers.includes('speed_kmh'),  'travel_speed.csv must have "speed_kmh" column');
assert(speed.rows.length >= 50,              'travel_speed.csv must have at least 50 rows');
const zones = [...new Set(speed.rows.map(r => r.zone))];
assert(zones.includes('Inner'),  'travel_speed.csv must have Inner zone');
assert(zones.includes('Middle'), 'travel_speed.csv must have Middle zone');
assert(zones.includes('Outer'),  'travel_speed.csv must have Outer zone');

/* travel_time_per10km ต้องสอดคล้องกับ speed_kmh เสมอ (600 / speed) */
speed.rows.forEach(r => {
  const kmh = Number.parseFloat(r.speed_kmh);
  const min = Number.parseFloat(r.travel_time_per10km);
  assert(Number.isFinite(kmh) && kmh > 0, `travel_speed.csv: speed_kmh ไม่ถูกต้อง (${r.year} ${r.zone} ${r.direction} ${r.peak})`);
  assert(Math.abs(min - 600 / kmh) < 0.15,
    `travel_speed.csv: travel_time_per10km ไม่ตรงกับ speed_kmh ที่ ${r.year} ${r.zone} ${r.direction} ${r.peak}`);
});

/* ทุกแถวต้องระบุไฟล์ต้นฉบับ — กันการเติมตัวเลขด้วยมือ */
assert(speed.headers.includes('source'), 'travel_speed.csv must have "source" column');
speed.rows.forEach(r => {
  assert(String(r.source || '').trim() !== '',
    `travel_speed.csv: ไม่ระบุ source ที่ ${r.year} ${r.zone} ${r.direction} ${r.peak}`);
});

/* transit-data.js ต้องไม่มีค่าที่ไม่มีแหล่งอ้างอิงหลงเหลือ */
const transitJs = fs.readFileSync(path.join(root, 'src/js/transit-data.js'), 'utf8');
assert(!/\bferry\s*:/.test(transitJs),
  'transit-data.js: ยังมี KPI เรือโดยสาร แต่ไม่มีข้อมูลเรือใน data/ridership/');
assert(!/\bperformance\s*:/.test(transitJs),
  'transit-data.js: ยังมีดัชนีประสิทธิภาพที่ไม่มีไฟล์ต้นฉบับรองรับ');

console.log('\u2705 All sanity checks passed.');