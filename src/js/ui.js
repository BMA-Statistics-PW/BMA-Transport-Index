/* ─────────────────────────────────────────────────────────────────────
   BMA Urban Transport Index — UI Controller (ui.js)
   จัดการ KPI cards, Table, Thai date, Tab navigation
   กลุ่มงานสถิติและวิจัย สจส. กทม.  © Prapawadee_W.
─────────────────────────────────────────────────────────────────────── */

/* jshint esversion:11 */
/* global TRANSIT */

/* ── Thai date helper ── */
const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
                     'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

function getThaiDate(d = new Date()) {
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function setDateElements() {
  const thai = getThaiDate();
  document.querySelectorAll('[data-thai-date]').forEach(el => {
    el.textContent = thai;
  });
}

/* ── KPI Strip render ── */
const KPI_ORDER = [
  { key: 'rail',  icon: '🚇', color: 'bma-kc-blue'  },
  { key: 'bus',   icon: '🚌', color: 'bma-kc-gold'  },
  { key: 'ferry', icon: '⛵', color: 'bma-kc-teal'  },
  { key: 'speed', icon: '🚦', color: 'bma-kc-red'   },
  { key: 'share', icon: '📊', color: 'bma-kc-green' },
];

function renderKpiStrip(containerId) {
  const el = document.getElementById(containerId);
  if (!el || !TRANSIT.kpi) return;

  el.innerHTML = KPI_ORDER.map(cfg => {
    const k = TRANSIT.kpi[cfg.key];
    const chgClass = k.trend === 'up' ? 'bma-up' : k.trend === 'down' ? 'bma-down' : 'bma-flat';
    const chgText  = k.trend === 'up'   ? `▲ ${k.change}%`
                   : k.trend === 'down' ? `▼ ${Math.abs(k.change)}%`
                   : '— คงที่';
    return `
      <div class="bma-kpi-cell ${cfg.color}">
        <div class="bma-kpi-em">${cfg.icon}</div>
        <div class="bma-kpi-lbl">${k.label}</div>
        <div class="bma-kpi-num">${k.value}<span class="bma-kpi-unit">${k.unit}</span></div>
        <div class="bma-kpi-chg ${chgClass}">${chgText}</div>
      </div>`;
  }).join('');
}

/* ── System Table render ── */
function renderSystemTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody || !TRANSIT.systems) return;

  tbody.innerHTML = TRANSIT.systems.map(s => {
    const chgColor = s.change >= 0 ? 'var(--bma-green)' : 'var(--bma-red)';
    const chgSign  = s.change >= 0 ? '+' : '';
    const levelMap = { high: ['high',  'สูง'],   mid: ['mid', 'ปานกลาง'], low: ['low', 'ต่ำ'] };
    const [lClass, lText] = levelMap[s.level] || ['low','ต่ำ'];
    return `
      <tr>
        <td>${s.no}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.agency}</td>
        <td class="num">${s.daily.toLocaleString()}</td>
        <td class="num" style="color:${chgColor}">${chgSign}${s.change}%</td>
        <td class="num">${typeof s.ytd === 'number' ? s.ytd.toFixed(1) : s.ytd}</td>
        <td><span class="bma-badge ${lClass}">${lText}</span></td>
      </tr>`;
  }).join('');
}

/* ── Tab navigation ── */
function initTabs(containerSelector) {
  const tabs   = document.querySelectorAll(`${containerSelector} .bma-tab`);
  const panels = document.querySelectorAll('.bma-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
      // update topbar title
      const pageTitle = document.getElementById('pageTitle');
      if (pageTitle) pageTitle.textContent = tab.textContent.trim();
    });
  });

  // activate first tab
  if (tabs.length > 0) tabs[0].click();
}

/* ── Sidebar active item ── */
function initSidebar() {
  const items = document.querySelectorAll('.bma-sb-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ── TomTom benchmark rows ── */
function renderBenchmarkTable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody || !TRANSIT.benchmark) return;
  const cities = TRANSIT.benchmark.topCities;
  tbody.innerHTML = cities.map(c => {
    const isBKK = c.country === 'TH';
    return `<tr${isBKK ? ' style="background:var(--bma-blue-pale);font-weight:700"' : ''}>
      <td>${c.rank}</td>
      <td>${isBKK ? '🇹🇭 ' : ''}${c.city}</td>
      <td class="num">${c.congestion}%</td>
    </tr>`;
  }).join('');
}

/* ── Bootstrap everything ── */
function initUI() {
  setDateElements();
  renderKpiStrip('kpiStrip');
  renderSystemTable('systemTableBody');
  renderBenchmarkTable('benchmarkTableBody');
  initTabs('.bma-tabs');
  initSidebar();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getThaiDate, renderKpiStrip, renderSystemTable, initUI };
}
