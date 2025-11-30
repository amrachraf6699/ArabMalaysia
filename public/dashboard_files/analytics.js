// analytics.js - charts for analytics.html
function initAnalyticsCharts() {
  if (!window.Chart) return
  const lineCtx = document.getElementById("lineChart")?.getContext("2d")
  const barCtx = document.getElementById("barChart")?.getContext("2d")
  if (!lineCtx || !barCtx) return

  new window.Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["?????", "??????", "????", "?????", "????", "?????"],
      datasets: [
        {
          label: "???? ??????",
          data: [1200, 1500, 1100, 1800, 2200, 2600],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  })

  new window.Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["????", "???", "???", "API"],
      datasets: [
        { label: "?????", data: [320, 280, 160, 210], backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"] },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  })
}

document.addEventListener("DOMContentLoaded", initAnalyticsCharts)
