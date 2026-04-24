/* ─────────────────────────────────────────────────────────────────────
   BMA Urban Transport Index — Charts (charts.js)
   สร้างและ render กราฟทุกประเภทด้วย Chart.js 4
   กลุ่มงานสถิติและวิจัย สจส. กทม.  © Prapawadee_W.
─────────────────────────────────────────────────────────────────────── */

/* jshint esversion:11 */
/* global Chart, TRANSIT */

const COLORS = {
  blue:   '#2E86C1',
  gold:   '#E8960A',
  green:  '#1A9B4B',
  red:    '#C0392B',
  teal:   '#148F77',
  purple: '#7D3C98',
  navy:   '#0A2342',
  orange: '#D35400',
};

const ALPHA = {
  blue:   'rgba(46,134,193,0.10)',
  gold:   'rgba(232,150,10,0.08)',
  green:  'rgba(26,155,75,0.08)',
  red:    'rgba(192,57,43,0.08)',
  teal:   'rgba(20,143,119,0.08)',
};

const _charts = {};   // เก็บ instance เพื่อ destroy ก่อน re-render

function _destroyChart(id) {
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }
}

/* ── Chart.js global defaults ── */
function initChartDefaults() {
  Chart.defaults.font.family = "'Sarabun', sans-serif";
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = '#5D7B8A';
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;
}

/* ── 1. แนวโน้มผู้โดยสารรวมทุกระบบ (Line) ── */
function renderAnnualTrendChart(canvasId) {
  _destroyChart(canvasId);
  const d = TRANSIT.annualTotal;
  _charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'รถไฟฟ้า',
          data: d.rail,
          borderColor: COLORS.blue,
          backgroundColor: ALPHA.blue,
          tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5,
        },
        {
          label: 'รถโดยสาร',
          data: d.bus,
          borderColor: COLORS.gold,
          backgroundColor: ALPHA.gold,
          tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5,
        },
        {
          label: 'เรือโดยสาร',
          data: d.ferry,
          borderColor: COLORS.teal,
          backgroundColor: ALPHA.teal,
          tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} ล้านเที่ยว`,
          },
        },
        annotation: {
          annotations: {
            covid: {
              type: 'box', xMin: '2563', xMax: '2564',
              backgroundColor: 'rgba(192,57,43,0.05)',
              borderColor: 'rgba(192,57,43,0.2)', borderWidth: 1,
              label: { display: true, content: 'COVID-19', font: { size: 10 }, color: '#C0392B' },
            },
          },
        },
      },
      scales: {
        x: { grid: { color: '#F0F4F8' } },
        y: {
          grid: { color: '#F0F4F8' },
          ticks: { callback: v => v + ' ล.' },
          title: { display: true, text: 'ล้านเที่ยวคน/ปี', font: { size: 11 } },
        },
      },
    },
  });
}

/* ── 2. สัดส่วน Modal Share (Stacked Area) ── */
function renderModalShareChart(canvasId) {
  _destroyChart(canvasId);
  const d = TRANSIT.modalShare;
  _charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'ขนส่งสาธารณะ (%)',
          data: d.public,
          backgroundColor: COLORS.blue,
          borderRadius: 4,
          stack: 'share',
        },
        {
          label: 'รถส่วนบุคคล (%)',
          data: d.private,
          backgroundColor: '#DDE8F0',
          borderRadius: 4,
          stack: 'share',
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`,
          },
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true, max: 100,
          ticks: { callback: v => v + '%' },
          grid: { color: '#F0F4F8' },
        },
      },
    },
  });
}

/* ── 3. ความเร็วเฉลี่ยรายโซน (Line — หน้า Travel Speed) ── */
function renderSpeedTrendChart(canvasId, speedData) {
  _destroyChart(canvasId);
  const d = speedData || TRANSIT.travelSpeed;
  _charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'ชั้นใน (Inner)',
          data: d.inner,
          borderColor: COLORS.red,
          backgroundColor: ALPHA.red,
          tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5,
        },
        {
          label: 'ชั้นกลาง (Middle)',
          data: d.middle,
          borderColor: COLORS.orange,
          backgroundColor: 'rgba(211,84,0,0.07)',
          tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5,
        },
        {
          label: 'ชั้นนอก (Outer)',
          data: d.outer,
          borderColor: COLORS.green,
          backgroundColor: ALPHA.green,
          tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2.5,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} km/h`,
          },
        },
        annotation: {
          annotations: {
            covid: {
              type: 'box', xMin: '2563', xMax: '2564',
              backgroundColor: 'rgba(192,57,43,0.05)',
              borderColor: 'rgba(192,57,43,0.2)', borderWidth: 1,
              label: { display: true, content: 'COVID-19', font: { size: 10 }, color: '#C0392B' },
            },
          },
        },
      },
      scales: {
        x: { grid: { color: '#F0F4F8' } },
        y: {
          grid: { color: '#F0F4F8' },
          ticks: { callback: v => v + ' km/h' },
          title: { display: true, text: 'ความเร็วเฉลี่ย (km/h)', font: { size: 11 } },
        },
      },
    },
  });
}

/* ── 3.1 ความเร็วแยกทิศทาง/ช่วงเวลา (Grouped Bar) ── */
function renderZoneDirectionBarChart(canvasId, directionalData) {
  _destroyChart(canvasId);
  const d = directionalData || TRANSIT.speedByZoneDirection;
  _charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'เช้า ขาเข้า',
          data: d.morningInbound,
          backgroundColor: '#C0392B',
          borderRadius: 4,
        },
        {
          label: 'เช้า ขาออก',
          data: d.morningOutbound,
          backgroundColor: '#E67E22',
          borderRadius: 4,
        },
        {
          label: 'เย็น ขาเข้า',
          data: d.eveningInbound,
          backgroundColor: '#2471A3',
          borderRadius: 4,
        },
        {
          label: 'เย็น ขาออก',
          data: d.eveningOutbound,
          backgroundColor: '#16A085',
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(2)} km/h`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: '#F0F4F8' },
          ticks: { callback: v => `${v} km/h` },
          title: { display: true, text: 'ความเร็วเฉลี่ย (km/h)', font: { size: 11 } },
        },
      },
    },
  });
}

/* ── 4. Radar — ประสิทธิภาพระบบขนส่ง ── */
function renderRadarChart(canvasId) {
  _destroyChart(canvasId);
  const d = TRANSIT.performance;
  _charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'radar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'ปี 2567',
          data: d.year2567,
          borderColor: 'rgba(46,134,193,0.7)',
          backgroundColor: 'rgba(46,134,193,0.08)',
          pointBackgroundColor: COLORS.blue,
          borderWidth: 2,
        },
        {
          label: 'ปี 2568',
          data: d.year2568,
          borderColor: 'rgba(232,150,10,0.9)',
          backgroundColor: 'rgba(232,150,10,0.08)',
          pointBackgroundColor: COLORS.gold,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        r: {
          min: 0, max: 100, ticks: { stepSize: 20, font: { size: 10 } },
          grid: { color: '#E8EEF4' },
          pointLabels: { font: { size: 11 } },
        },
      },
    },
  });
}

/* ── 5. Doughnut — สัดส่วนรายระบบปัจจุบัน ── */
function renderSystemShareDoughnut(canvasId) {
  _destroyChart(canvasId);
  const systems = TRANSIT.systems.slice(0, 8); // top 8
  const colors  = [COLORS.blue, COLORS.gold, COLORS.green, COLORS.teal,
                   COLORS.purple, COLORS.red, COLORS.orange, '#95A5A6'];
  _charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: 'doughnut',
    data: {
      labels:   systems.map(s => s.name),
      datasets: [{
        data:            systems.map(s => s.daily),
        backgroundColor: colors,
        borderWidth:     2,
        borderColor:     '#fff',
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { font: { size: 11 }, padding: 12 } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} พันคน/วัน`,
          },
        },
      },
    },
  });
}

/* ── render ทุกกราฟในหน้าหลัก ── */
function renderAllCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js ยังไม่ถูกโหลด');
    return;
  }
  initChartDefaults();
  if (document.getElementById('annualTrendChart')) renderAnnualTrendChart('annualTrendChart');
  if (document.getElementById('modalShareChart'))  renderModalShareChart('modalShareChart');
  if (document.getElementById('speedTrendChart'))  renderSpeedTrendChart('speedTrendChart');
  if (document.getElementById('zoneDirectionBarChart')) renderZoneDirectionBarChart('zoneDirectionBarChart');
  if (document.getElementById('radarChart'))       renderRadarChart('radarChart');
  if (document.getElementById('systemShareChart')) renderSystemShareDoughnut('systemShareChart');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initChartDefaults, renderAllCharts, renderSpeedTrendChart };
}
