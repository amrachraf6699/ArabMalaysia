// dashboard.js - only for index.html
const state = {
  users: [
    { name: "محمود صادق", email: "mahmoud@example.com", department: "المبيعات", status: "نشط" },
    { name: "فاطمة سالم", email: "fatema@example.com", department: "التسويق", status: "نشط" },
    { name: "علي جابر", email: "ali@example.com", department: "المالية", status: "معلق" },
    { name: "نورة حمد", email: "noura@example.com", department: "الدعم", status: "نشط" },
    { name: "عمر خالد", email: "omar@example.com", department: "التقنية", status: "موقوف" },
    { name: "ليلى مهند", email: "layla@example.com", department: "إدارة المنتجات", status: "نشط" },
    { name: "سارة يوسف", email: "sara@example.com", department: "التشغيل", status: "نشط" },
    { name: "هادي مازن", email: "hadi@example.com", department: "الهندسة", status: "معلق" },
    { name: "عائشة مراد", email: "aisha@example.com", department: "المالية", status: "نشط" },
    { name: "يوسف عادل", email: "yousef@example.com", department: "الاستشارات", status: "نشط" },
    { name: "خالد ريان", email: "khaled@example.com", department: "المشاريع", status: "موقوف" },
    { name: "منى سعيد", email: "mona@example.com", department: "المبيعات", status: "نشط" },
  ],
  table: { page: 1, perPage: 6 },
}

const flatpickr = window.flatpickr
const Choices = window.Choices

function initCharts() {
  if (!window.Chart) return
  const textColor = "#1e293b"
  const gridColor = "#e2e8f0"
  const bgColor = "#ffffff"

  const lineCtx = document.getElementById("lineChart")?.getContext("2d")
  const doughnutCtx = document.getElementById("doughnutChart")?.getContext("2d")
  const barCtx = document.getElementById("barChart")?.getContext("2d")
  if (!lineCtx || !doughnutCtx || !barCtx) return

  new window.Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
      datasets: [
        {
          label: "الإيرادات الشهرية",
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: bgColor,
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor } },
        x: { grid: { display: false } },
      },
    },
  })

  new window.Chart(doughnutCtx, {
    type: "doughnut",
    data: {
      labels: ["المبيعات", "دعم", "تطوير", "مالية"],
      datasets: [
        {
          data: [30, 25, 20, 25],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
          borderColor: bgColor,
          borderWidth: 2,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
  })

  new window.Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["تطبيق", "موقع", "شركاء", "معارض"],
      datasets: [
        { label: "????? 1", data: [12, 19, 15, 25], backgroundColor: "#3b82f6" },
        { label: "????? 2", data: [8, 17, 20, 22], backgroundColor: "#10b981" },
        { label: "????? 3", data: [15, 25, 18, 28], backgroundColor: "#f59e0b" },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor } },
        x: { grid: { display: false } },
      },
    },
  })
}

function renderTable() {
  const tbody = document.getElementById("usersTableBody")
  if (!tbody) return
  const start = (state.table.page - 1) * state.table.perPage
  const rows = state.users.slice(start, start + state.table.perPage)
  tbody.innerHTML = ""
  rows.forEach((row) => {
    const tr = document.createElement("tr")
    tr.className = "border-b border-slate-200"
    tr.innerHTML = `
      <td class="px-4 py-3">${row.name}</td>
      <td class="px-4 py-3">${row.email}</td>
      <td class="px-4 py-3">${row.department}</td>
      <td class="px-4 py-3">
        <span class="px-2 py-1 rounded text-xs font-medium ${
          row.status === "نشط"
            ? "bg-green-100 text-green-700"
            : row.status === "معلق"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }">${row.status}</span>
      </td>
       <td class="px-4 py-3"><button class="text-blue-600 hover:underline text-xs">تعديل</button></td>
    `
    tbody.appendChild(tr)
  })
  const totalPages = Math.ceil(state.users.length / state.table.perPage)
  const info = document.getElementById("pageInfo")
  const prev = document.getElementById("prevPage")
  const next = document.getElementById("nextPage")
  if (info) info.textContent = `${state.table.page} / ${totalPages}`
  if (prev) prev.disabled = state.table.page === 1
  if (next) next.disabled = state.table.page === totalPages
}

function initTables() {
  if (!document.getElementById("usersTable")) return
  document.getElementById("prevPage")?.addEventListener("click", () => {
    if (state.table.page > 1) {
      state.table.page -= 1
      renderTable()
    }
  })
  document.getElementById("nextPage")?.addEventListener("click", () => {
    const total = Math.ceil(state.users.length / state.table.perPage)
    if (state.table.page < total) {
      state.table.page += 1
      renderTable()
    }
  })
  renderTable()
}

function initForms() {
  if (typeof flatpickr !== "undefined") {
    flatpickr("#joinDateInput", { enableTime: false, dateFormat: "Y-m-d", locale: "ar" })
  }
  if (typeof Choices !== "undefined") {
    document.querySelectorAll("[data-choices]").forEach((el) => {
      new Choices(el, { searchEnabled: true, removeItemButton: el.multiple, shouldSort: false, itemSelectText: "" })
    })
  }
  const passwordToggle = document.getElementById("togglePassword")
  if (passwordToggle) {
    passwordToggle.addEventListener("click", function (e) {
      e.preventDefault()
      const input = document.getElementById("passwordInput")
      const icon = this.querySelector("[data-lucide]")
      if (input.type === "password") {
        input.type = "text"
        icon.setAttribute("data-lucide", "eye-off")
      } else {
        input.type = "password"
        icon.setAttribute("data-lucide", "eye")
      }
      if (window.lucide) window.lucide.createIcons()
    })
  }
  const addUserForm = document.getElementById("addUserForm")
  if (addUserForm) {
    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault()
      showToast("?? ??? ???????? ?????", "success")
      addUserForm.reset()
    })
  }
}

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn")
  if (!tabBtns.length) return
  const tabContents = document.querySelectorAll(".tab-content")

  const activate = (btn) => {
    tabBtns.forEach((b) => b.classList.remove("active", "border-b-2", "border-blue-500", "text-slate-900"))
    tabBtns.forEach((b) => b.classList.add("text-slate-600"))
    tabContents.forEach((tab) => {
      tab.classList.add("hidden")
      tab.setAttribute("hidden", "hidden")
      tab.classList.remove("opacity-100", "translate-y-0")
      tab.classList.add("opacity-0", "translate-y-2")
    })
    btn.classList.remove("text-slate-600")
    btn.classList.add("active", "border-b-2", "border-blue-500", "text-slate-900")
    const target = document.getElementById(btn.dataset.tab)
    if (target) {
      target.classList.remove("hidden")
      target.removeAttribute("hidden")
      requestAnimationFrame(() => {
        target.classList.remove("opacity-0", "translate-y-2")
        target.classList.add("opacity-100", "translate-y-0")
      })
    }
    tabBtns.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"))
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activate(btn)
    })
  })

  const initial = document.querySelector(".tab-btn.active") || tabBtns[0]
  if (initial) activate(initial)
}

function initModals() {
  const modal = document.getElementById("modal")
  if (!modal) return
  document.getElementById("modal-close")?.addEventListener("click", closeModal)
  document.getElementById("modal-cancel")?.addEventListener("click", closeModal)
  document.getElementById("modal-confirm")?.addEventListener("click", () => {
    showToast("?? ????? ??????? ?????", "success")
    closeModal()
  })
}
function closeModal() {
  document.getElementById("modal")?.classList.add("hidden")
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container")
  if (!container) return
  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500", warning: "bg-yellow-500" }
  const icons = { success: "check-circle", error: "alert-circle", info: "info", warning: "alert-triangle" }
  const toast = document.createElement("div")
  toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`
  toast.innerHTML = `<svg data-lucide="${icons[type]}" class="w-5 h-5"></svg><span>${message}</span>`
  container.appendChild(toast)
  if (window.lucide) window.lucide.createIcons()
  setTimeout(() => toast.remove(), 3000)
}

function initSearchableSelect() {
  const searchInput = document.getElementById("departmentSearch")
  const optionsContainer = document.getElementById("departmentOptions")
  const options = document.querySelectorAll(".department-option")
  const hiddenSelect = document.getElementById("departmentSelect")
  if (!searchInput || !optionsContainer) return
  searchInput.addEventListener("focus", () => optionsContainer.classList.remove("hidden"))
  searchInput.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase()
    options.forEach((option) => {
      option.style.display = option.textContent.toLowerCase().includes(searchValue) ? "block" : "none"
    })
  })
  options.forEach((option) => {
    option.addEventListener("click", () => {
      searchInput.value = option.textContent
      hiddenSelect.value = option.dataset.value
      optionsContainer.classList.add("hidden")
    })
  })
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#departmentSearch") && !e.target.closest("#departmentOptions")) {
      optionsContainer.classList.add("hidden")
    }
  })
}

function initRangeSlider() {
  const rangeInput = document.querySelector('input[type="range"]')
  const rangeValue = document.getElementById("rangeValue")
  if (!rangeInput || !rangeValue) return
  rangeInput.addEventListener("input", () => (rangeValue.textContent = rangeInput.value))
}

function initDashboard() {
  initCharts()
  initTables()
  initForms()
  initSearchableSelect()
  initRangeSlider()
  initTabs()
  initModals()
  if (window.lucide) window.lucide.createIcons()
}

document.addEventListener("DOMContentLoaded", initDashboard)
