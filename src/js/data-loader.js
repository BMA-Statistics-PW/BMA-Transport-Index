/* ─────────────────────────────────────────────────────────────────────
   BMA Urban Transport Index — Data Loader (data-loader.js)
   โหลด CSV/JSON จาก data/ แบบ async — แยก data ออกจาก HTML
   กลุ่มงานสถิติและวิจัย สจส. กทม.  © Prapawadee_W.
─────────────────────────────────────────────────────────────────────── */

/* jshint esversion:11 */

/**
 * อ่านไฟล์ CSV และแปลงเป็น array of objects
 * @param {string} url - path to CSV file
 * @returns {Promise<Array<Object>>}
 */
async function fetchCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV fetch failed: ${url} (${res.status})`);
  const text = await res.text();
  return parseCsv(text);
}

/**
 * อ่านไฟล์ JSON
 * @param {string} url - path to JSON file
 * @returns {Promise<Object>}
 */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`JSON fetch failed: ${url} (${res.status})`);
  return res.json();
}

/**
 * แปลง CSV string เป็น array of objects
 * - รองรับ quoted fields (RFC 4180)
 * - strip BOM
 * @param {string} raw
 * @returns {Array<Object>}
 */
function parseCsv(raw) {
  const text   = raw.replace(/^\uFEFF/, ''); // strip UTF-8 BOM
  const lines  = text.split(/\r?\n/).filter(s => s.trim() !== '');
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
    return obj;
  });
}

function parseCsvLine(line) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      out.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/**
 * โหลดข้อมูลทั้งหมดที่จำเป็นสำหรับ dashboard
 * @returns {Promise<{ridership: Array, share: Array, speed: Array, catalog: Object}>}
 */
async function loadAllData() {
  const base = _getDataBase();
  const [ridership, share, speed, catalog] = await Promise.all([
    fetchCsv(`${base}/ridership/transport_report.csv`),
    fetchCsv(`${base}/ridership/transport_share.csv`),
    fetchCsv(`${base}/travel-speed/travel_speed.csv`),
    fetchJson(`${base}/catalog.json`),
  ]);
  return { ridership, share, speed, catalog };
}

/**
 * หา base URL ของ data/ directory (รองรับทั้ง local dev และ GitHub Pages)
 */
function _getDataBase() {
  const loc  = window.location;
  const isGH = loc.hostname.endsWith('github.io');
  if (isGH) {
    // GitHub Pages: /reponame/data
    const repo = loc.pathname.split('/')[1];
    return `/${repo}/data`;
  }
  // local dev
  return './data';
}

/**
 * แปลงข้อมูล speed CSV เป็นรูปแบบที่ chart ใช้ได้
 * @param {Array<Object>} rows
 * @returns {{labels, inner, middle, outer}}
 */
function processSpeedData(rows) {
  // กรองเฉพาะ Inbound Morning (เป็นตัวแทนหลัก)
  const filtered = rows.filter(r => r.direction === 'Inbound' && r.peak === 'Morning');
  const years    = [...new Set(filtered.map(r => r.year))].sort();
  const getZone  = zone => years.map(y => {
    const row = filtered.find(r => r.year === y && r.zone === zone);
    return row ? parseFloat(row.speed_kmh) : null;
  });
  return {
    labels: years,
    inner:  getZone('Inner'),
    middle: getZone('Middle'),
    outer:  getZone('Outer'),
  };
}

/**
 * แปลงข้อมูล speed CSV เป็นความเร็วปีล่าสุด แยกโซน/ทิศทาง/ช่วงเวลา
 * @param {Array<Object>} rows
 * @returns {{labels, morningInbound, morningOutbound, eveningInbound, eveningOutbound}}
 */
function processSpeedDirectionData(rows) {
  const years = [...new Set(rows.map(r => Number(r.year)))].filter(Number.isFinite).sort((a, b) => a - b);
  const latest = String(years[years.length - 1] || '');
  const zones = ['Inner', 'Middle', 'Outer'];

  const getValues = (peak, direction) => zones.map(zone => {
    const row = rows.find(r => r.year === latest && r.zone === zone && r.peak === peak && r.direction === direction);
    return row ? Number.parseFloat(row.speed_kmh) : null;
  });

  return {
    labels: ['ชั้นใน', 'ชั้นกลาง', 'ชั้นนอก'],
    morningInbound:  getValues('Morning', 'Inbound'),
    morningOutbound: getValues('Morning', 'Outbound'),
    eveningInbound:  getValues('Evening', 'Inbound'),
    eveningOutbound: getValues('Evening', 'Outbound'),
  };
}

/**
 * แปลงข้อมูล speed CSV เป็นแนวโน้มรายปีแยกโซน/ทิศทาง (ช่วงเช้า)
 * @param {Array<Object>} rows
 * @returns {{labels: string[], Urban: {inbound:number[], outbound:number[]}, Suburban: {inbound:number[], outbound:number[]}, Rural: {inbound:number[], outbound:number[]}}}
 */
function processZoneSpeedTrendData(rows) {
  const years = [...new Set(rows.map(r => Number(r.year)))].filter(Number.isFinite).sort((a, b) => a - b);
  const getSeries = (zone, direction) => years.map(year => {
    const row = rows.find(r => Number(r.year) === year && r.zone === zone && r.peak === 'Morning' && r.direction === direction);
    return row ? Number.parseFloat(row.speed_kmh) : null;
  });

  return {
    labels: years.map(year => String(year + 543)),
    Urban: {
      inbound: getSeries('Inner', 'Inbound'),
      outbound: getSeries('Inner', 'Outbound'),
    },
    Suburban: {
      inbound: getSeries('Middle', 'Inbound'),
      outbound: getSeries('Middle', 'Outbound'),
    },
    Rural: {
      inbound: getSeries('Outer', 'Inbound'),
      outbound: getSeries('Outer', 'Outbound'),
    },
  };
}

function _toNumber(value) {
  const clean = String(value ?? '').replace(/,/g, '').replace(/%/g, '').trim();
  if (!clean || clean === '-' || clean.toLowerCase() === 'na') return null;
  const n = Number.parseFloat(clean);
  return Number.isFinite(n) ? n : null;
}

/**
 * ดึงชื่อคอลัมน์ที่เป็น "ปี พ.ศ." ออกจากแถวข้อมูล
 *
 * เดิมใช้ /^ปี\s*\d{4}$/ ซึ่งเป็นการจับแบบตรงตัวทั้งสตริง ทำให้คอลัมน์ที่ต้นทาง
 * Google Sheets ใส่ข้อความหน่วยปนมา เช่น "หน่วย: ล้านคน-เที่ยวต่อปี ปี 2566"
 * ไม่ถูกนับเป็นปี → ข้อมูลปี 2566 หายจากกราฟ Modal Share โดยไม่มี error
 *
 * ปรับใหม่: จับ "ปี พ.ศ." ที่ท้ายชื่อคอลัมน์ และข้ามคอลัมน์ชื่อรายการ (skip)
 * ซึ่งอาจมีเลขปีอยู่ในหัวเรื่อง เช่น "สัดส่วน... ปี 2560 - ปี 2567"
 *
 * @param {Object} row     แถวข้อมูลหนึ่งแถว
 * @param {number} [skip]  จำนวนคอลัมน์แรกที่เป็นคอลัมน์ชื่อรายการ
 * @returns {string[]}     ชื่อคอลัมน์ปี เรียงตามปีจากน้อยไปมาก
 */
function _getYearHeaders(row, skip = 1) {
  return Object.keys(row)
    .slice(skip)
    .filter(k => /ปี\s*\d{4}\s*$/.test(String(k).trim()))
    .sort((a, b) => _yearOf(a) - _yearOf(b));
}

/** ดึงเลขปี พ.ศ. ตัวสุดท้ายจากชื่อคอลัมน์ */
function _yearOf(header) {
  const m = String(header).trim().match(/(\d{4})\s*$/);
  return m ? Number(m[1]) : NaN;
}

/** ตัดข้อความอื่นออก เหลือเฉพาะเลขปีสำหรับใช้เป็น label */
function _yearLabel(header) {
  const y = _yearOf(header);
  return Number.isFinite(y) ? String(y) : String(header);
}

/**
 * แปลงข้อมูลผู้โดยสารรายระบบจาก transport_report.csv
 * @param {Array<Object>} rows
 * @returns {{labels: string[], datasets: Array<{label: string, data: Array<number|null>}>}}
 */
function processRidershipSystemTrend(rows) {
  if (!rows || rows.length === 0) return { labels: [], datasets: [] };
  /* transport_report.csv: คอลัมน์ 0 ว่าง, คอลัมน์ 1 คือชื่อระบบขนส่ง */
  const firstDataRow = rows.find(r => _getYearHeaders(r, 2).length > 0) || rows[0];
  const years = _getYearHeaders(firstDataRow, 2);
  const nameKey = Object.keys(firstDataRow)[1] || Object.keys(firstDataRow)[0];

  const pickRow = (matcher) => rows.find(r => matcher(String(r[nameKey] || '')));
  const buildSeries = (row) => years.map(y => {
    const v = row ? _toNumber(row[y]) : null;
    return v == null ? null : v / 1000000;
  });

  const busRow = pickRow(name => name.includes('รถโดยสารประจำทาง'));
  const btsGreenRow = pickRow(name => name.includes('BTS สายสีเขียว'));
  const mrtBlueRow = pickRow(name => name.includes('MRT สายสีน้ำเงิน'));
  const arlRow = pickRow(name => name.includes('Airport Rail Link'));
  const mrtPurpleRow = pickRow(name => name.includes('MRT สายสีม่วง'));

  return {
    labels: years.map(_yearLabel),
    datasets: [
      { label: 'รถประจำทาง (ขสมก.)', data: buildSeries(busRow) },
      { label: 'BTS สายสีเขียว', data: buildSeries(btsGreenRow) },
      { label: 'MRT สายสีน้ำเงิน', data: buildSeries(mrtBlueRow) },
      { label: 'Airport Rail Link', data: buildSeries(arlRow) },
      { label: 'MRT สายสีม่วง', data: buildSeries(mrtPurpleRow) },
    ],
  };
}

/**
 * แปลงข้อมูลรายเดือนแยกรายระบบเป็น long format สำหรับ drill-down chart
 * @param {Array<Object>} rows
 * @returns {{systems: string[], years: number[], months: string[], bySystem: Object}}
 */
function processMonthlyRidershipData(rows) {
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const out = { systems: [], years: [], months: monthNames, bySystem: {} };
  if (!rows || rows.length === 0) return out;

  const systems = [...new Set(rows.map(r => String(r.system || '').trim()).filter(Boolean))];
  const years = [...new Set(rows.map(r => Number.parseInt(r.year, 10)).filter(Number.isFinite))].sort((a, b) => a - b);

  systems.forEach(system => {
    out.bySystem[system] = {};
    years.forEach(year => {
      out.bySystem[system][year] = new Array(12).fill(null);
    });
  });

  rows.forEach(r => {
    const system = String(r.system || '').trim();
    const year = Number.parseInt(r.year, 10);
    const month = Number.parseInt(r.month, 10);
    const value = _toNumber(r.value_million);
    if (!system || !Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return;
    if (!out.bySystem[system] || !out.bySystem[system][year]) return;
    out.bySystem[system][year][month - 1] = value;
  });

  out.systems = systems;
  out.years = years;
  return out;
}

/**
 * แปลงข้อมูล modal share จาก transport_share.csv
 * @param {Array<Object>} rows
 * @returns {{labels: string[], public: number[], private: number[]}}
 */
function processModalShareData(rows) {
  if (!rows || rows.length === 0) return { labels: [], public: [], private: [] };
  /* transport_share.csv: คอลัมน์ 0 คือชื่อรายการ (มีเลขปีในหัวเรื่อง จึงต้อง skip) */
  const firstDataRow = rows.find(r => _getYearHeaders(r, 1).length > 0) || rows[0];
  const years = _getYearHeaders(firstDataRow, 1);
  const nameKey = Object.keys(firstDataRow)[0];

  const publicRow = rows.find(r => String(r[nameKey] || '').includes('สัดส่วนสาธารณะ'));
  const privateRow = rows.find(r => String(r[nameKey] || '').includes('สัดส่วนระบบรถส่วนบุคคล'));

  return {
    labels: years.map(_yearLabel),
    public: years.map(y => _toNumber(publicRow ? publicRow[y] : null)),
    private: years.map(y => _toNumber(privateRow ? privateRow[y] : null)),
  };
}

/**
 * แสดงสถานะ loading/error ใน container
 * @param {string} containerId
 * @param {'loading'|'error'} state
 * @param {string} [message]
 */
function setDataState(containerId, state, message = '') {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (state === 'loading') {
    el.innerHTML = '<div class="bma-skeleton" style="height:200px;width:100%"></div>';
  } else if (state === 'error') {
    el.innerHTML = `<div class="bma-note warning">⚠️ ไม่สามารถโหลดข้อมูลได้: ${message}</div>`;
  }
}

/* export สำหรับ module-aware environments */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchCsv,
    fetchJson,
    parseCsv,
    loadAllData,
    processSpeedData,
    processSpeedDirectionData,
    processZoneSpeedTrendData,
    processRidershipSystemTrend,
    processModalShareData,
    processMonthlyRidershipData,
    setDataState,
  };
}
