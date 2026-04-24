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
  module.exports = { fetchCsv, fetchJson, parseCsv, loadAllData, processSpeedData, setDataState };
}
