/* ═══════════════════════════════════════════════════════════════
   charts.js  |  สร้างกราฟทั้งหมดด้วย Chart.js
   กลุ่มงานสถิติและวิจัย สจส. กทม.
   © Prapawadee_W.
   ═══════════════════════════════════════════════════════════════ */

// ─── สีมาตรฐาน ─────────────────────────────────────────────────
const COLORS = {
  blue:   '#2E86C1',
  gold:   '#F4A300',
  green:  '#1E8449',
  red:    '#C0392B',
  purple: '#7D3C98',
  teal:   '#148F77',
  navy:   '#0A2342',
}

// เก็บ instance กราฟไว้ เพื่อ destroy ก่อน re-render
const chartInstances = {}

/**
 * ตั้งค่า default ของ Chart.js
 */
function initChartDefaults() {
  Chart.defaults.font.family = "'Sarabun', sans-serif"
  Chart.defaults.font.size   = 12
  Chart.defaults.color       = '#7F8C8D'
}

/**
 * สร้างกราฟทั้งหมด
 */
function renderCharts() {
  initChartDefaults()
  renderLineChart()
  renderDoughnutChart()
  renderBarChart()
  renderRadarChart()
}

/* ─── LINE CHART ────────────────────────────────────────────────
   แนวโน้มผู้โดยสารรายเดือน
──────────────────────────────────────────────────────────────── */
function renderLineChart() {
  if (chartInstances.line) chartInstances.line.destroy()

  const d = TRANSIT.monthly
  const palette = [COLORS.blue, COLORS.gold, COLORS.green]
  const alphas  = ['rgba(46,134,193,0.08)', 'rgba(244,163,0,0.06)', 'rgba(30,132,73,0.06)']

  chartInstances.line = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: d.datasets.map((ds, i) => ({
        label:           ds.label,
        data:            ds.data,
        borderColor:     palette[i],
        backgroundColor: alphas[i],
        tension: 0.4, fill: true, pointRadius: 4, borderWidth: 2,
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { size: 12 } } }
      },
      scales: {
        x: { grid: { color: '#F0F4F8' } },
        y: { grid: { color: '#F0F4F8' }, ticks: { callback: v => v.toLocaleString() } }
      }
    }
  })
}

/* ─── DOUGHNUT CHART ────────────────────────────────────────────
   สัดส่วน Modal Share
──────────────────────────────────────────────────────────────── */
function renderDoughnutChart() {
  if (chartInstances.doughnut) chartInstances.doughnut.destroy()

  const d      = TRANSIT.modalShare
  const colors = [COLORS.blue, COLORS.gold, COLORS.green, COLORS.purple, COLORS.red, COLORS.teal]

  chartInstances.doughnut = new Chart(document.getElementById('doughnutChart'), {
    type: 'doughnut',
    data: {
      labels: d.labels,
      datasets: [{ data: d.data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } }
      }
    }
  })

  // Custom legend
  const html = d.labels.map((l, i) =>
    `<span style="display:inline-flex;align-items:center;gap:5px;margin:3px 8px 3px 0;font-size:12px">
      <span style="width:10px;height:10px;border-radius:50%;background:${colors[i]};display:inline-block"></span>
      ${l} <strong>${d.data[i]}%</strong></span>`
  ).join('')
  document.getElementById('doughnutLegend').innerHTML = `<div style="display:flex;flex-wrap:wrap">${html}</div>`
}

/* ─── BAR CHART ─────────────────────────────────────────────────
   ผู้โดยสาร BTS รายสาย รายไตรมาส
──────────────────────────────────────────────────────────────── */
function renderBarChart() {
  if (chartInstances.bar) chartInstances.bar.destroy()

  const d = TRANSIT.btsQuarterly

  chartInstances.bar = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        { label: 'สายสุขุมวิท', data: d.sukhumvit, backgroundColor: COLORS.blue, borderRadius: 6 },
        { label: 'สายสีลม',     data: d.silom,     backgroundColor: COLORS.gold, borderRadius: 6 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#F0F4F8' }, ticks: { callback: v => v + ' ล.' } }
      }
    }
  })
}

/* ─── RADAR CHART ───────────────────────────────────────────────
   ประสิทธิภาพระบบขนส่ง ปี 2567 vs 2568
──────────────────────────────────────────────────────────────── */
function renderRadarChart() {
  if (chartInstances.radar) chartInstances.radar.destroy()

  const d = TRANSIT.performance

  chartInstances.radar = new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'ปี 2567',
          data:  d.year2567,
          borderColor: 'rgba(46,134,193,0.6)', backgroundColor: 'rgba(46,134,193,0.08)',
          pointBackgroundColor: COLORS.blue, borderWidth: 2,
        },
        {
          label: 'ปี 2568',
          data:  d.year2568,
          borderColor: 'rgba(244,163,0,0.8)', backgroundColor: 'rgba(244,163,0,0.08)',
          pointBackgroundColor: COLORS.gold, borderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } } },
      scales: {
        r: {
          min: 0, max: 100, ticks: { stepSize: 20, font: { size: 10 } },
          grid: { color: '#E8EEF4' }, pointLabels: { font: { size: 11 } }
        }
      }
    }
  })
}
