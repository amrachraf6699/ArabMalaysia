// ========== State & Storage ==========
const state = {
  darkMode: localStorage.getItem("dark-mode") === "true",
  charts: {},
}

// Initialize theme from localStorage or system preference
if (!localStorage.getItem("dark-mode")) {
  state.darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
} else {
  state.darkMode = localStorage.getItem("dark-mode") === "true"
}

// Declare variables before using them
const lucide = window.lucide // Assuming lucide is a global variable or imported
const $ = window.jQuery // Assuming jQuery is a global variable or imported
const flatpickr = window.flatpickr // Assuming flatpickr is a global variable or imported

// ========== Theme (Dark Mode) ==========
function initTheme() {
  const html = document.documentElement
  if (state.darkMode) {
    html.classList.add("dark")
  } else {
    html.classList.remove("dark")
  }
  updateThemeIcon()
}

function toggleTheme() {
  state.darkMode = !state.darkMode
  localStorage.setItem("dark-mode", state.darkMode)
  initTheme()
  updateChartsTheme()
}

function updateThemeIcon() {
  const icon = document.getElementById("theme-icon")
  if (state.darkMode) {
    icon.setAttribute("data-lucide", "sun")
  } else {
    icon.setAttribute("data-lucide", "moon")
  }
  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  }
}

// ========== Sidebar ==========
function initSidebar() {
  console.log("[v0] Initializing sidebar...")
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")
  const collapseBtns = document.querySelectorAll(".sidebar-collapse")

  console.log("[v0] Sidebar elements found:", { sidebar: !!sidebar, toggle: !!sidebarToggle, overlay: !!overlay })

  // Mobile toggle
  sidebarToggle.addEventListener("click", () => {
    console.log("[v0] Sidebar toggle clicked")
    sidebar.classList.toggle("-translate-x-full")
    overlay.classList.toggle("hidden")
  })

  // Overlay click
  overlay.addEventListener("click", () => {
    console.log("[v0] Overlay clicked, closing sidebar")
    sidebar.classList.add("-translate-x-full")
    overlay.classList.add("hidden")
  })

  // Submenu collapse
  collapseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target
      const submenu = document.getElementById(targetId)
      const chevron = btn.querySelector("svg:last-child")

      submenu.classList.toggle("hidden")
      chevron.style.transform = submenu.classList.contains("hidden") ? "rotate(0deg)" : "rotate(-180deg)"
    })
  })

  // Close sidebar on mobile when clicking a link
  document.querySelectorAll("#sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) {
        console.log("[v0] Link clicked on mobile, closing sidebar")
        sidebar.classList.add("-translate-x-full")
        overlay.classList.add("hidden")
      }
    })
  })
}

// ========== Charts ==========
function initCharts() {
  // Chart.js theme colors
  const isDark = state.darkMode
  const textColor = isDark ? "#e2e8f0" : "#1e293b"
  const gridColor = isDark ? "#334155" : "#e2e8f0"
  const bgColor = isDark ? "#0f172a" : "#ffffff"

  const lineCtx = document.getElementById("lineChart").getContext("2d")
  new window.Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
      datasets: [
        {
          label: "الإيرادات",
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: "#3b82f6",
          backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
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
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  })

  const doughnutCtx = document.getElementById("doughnutChart").getContext("2d")
  new window.Chart(doughnutCtx, {
    type: "doughnut",
    data: {
      labels: ["منتج أ", "منتج ب", "منتج ج", "منتج د"],
      datasets: [
        {
          data: [30, 25, 20, 25],
          backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
          borderColor: bgColor,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: textColor, padding: 15 },
        },
      },
    },
  })

  const barCtx = document.getElementById("barChart").getContext("2d")
  new window.Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["التسويق", "المبيعات", "التطوير", "العمليات"],
      datasets: [
        {
          label: "Q1",
          data: [12, 19, 15, 25],
          backgroundColor: "#3b82f6",
        },
        {
          label: "Q2",
          data: [8, 17, 20, 22],
          backgroundColor: "#10b981",
        },
        {
          label: "Q3",
          data: [15, 25, 18, 28],
          backgroundColor: "#f59e0b",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
        },
        x: {
          grid: { display: false },
        },
      },
      plugins: {
        legend: { labels: { color: textColor } },
      },
    },
  })
}

function updateChartsTheme() {
  if (Object.keys(state.charts).length > 0) {
    // Recreate charts with new theme
    setTimeout(() => {
      document.getElementById("lineChart").parentElement.innerHTML = '<canvas id="lineChart"></canvas>'
      document.getElementById("doughnutChart").parentElement.innerHTML = '<canvas id="doughnutChart"></canvas>'
      document.getElementById("barChart").parentElement.innerHTML = '<canvas id="barChart"></canvas>'
      initCharts()
    }, 0)
  }
}

// ========== Tables ==========
function initTables() {
  if (typeof $ !== "undefined") {
    $("#usersTable").DataTable({
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      pageLength: 10,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/ar.json",
      },
      dom: '<"top"f>rt<"bottom"lp><"clear">',
      columnDefs: [{ orderable: false, targets: 4 }],
    })
  }
}

// ========== Forms & Plugins ==========
function initForms() {
  // Using native HTML select styled with Tailwind instead

  // Flatpickr date picker
  if (typeof flatpickr !== "undefined") {
    flatpickr("#joinDateInput", {
      enableTime: false,
      dateFormat: "Y-m-d",
      locale: "ar",
    })
  }

  // Password toggle
  document.getElementById("togglePassword").addEventListener("click", function (e) {
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

    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  })

  // Form submission
  document.getElementById("addUserForm").addEventListener("submit", function (e) {
    e.preventDefault()
    showToast("تم إضافة المستخدم بنجاح!", "success")
    this.reset()
  })
}

// ========== Tabs ==========
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active state from all buttons
      tabBtns.forEach((b) =>
        b.classList.remove("active", "border-b-2", "border-blue-500", "text-slate-900", "dark:text-white"),
      )
      tabBtns.forEach((b) => b.classList.add("text-slate-600", "dark:text-slate-400"))

      // Hide all tabs
      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.add("hidden")
      })

      // Activate clicked button
      btn.classList.remove("text-slate-600", "dark:text-slate-400")
      btn.classList.add("active", "border-b-2", "border-blue-500", "text-slate-900", "dark:text-white")

      // Show associated tab
      const tabId = btn.dataset.tab
      document.getElementById(tabId).classList.remove("hidden")
    })
  })
}

// ========== Modals ==========
function initModals() {
  const modal = document.getElementById("modal")
  const modalClose = document.getElementById("modal-close")
  const modalCancel = document.getElementById("modal-cancel")

  modalClose.addEventListener("click", closeModal)
  modalCancel.addEventListener("click", closeModal)

  document.getElementById("modal-confirm").addEventListener("click", () => {
    showToast("تم تنفيذ العملية بنجاح!", "success")
    closeModal()
  })
}

function openModal() {
  document.getElementById("modal").classList.remove("hidden")
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden")
}

// ========== Toasts ==========
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container")
  const toast = document.createElement("div")

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  }

  const icons = {
    success: "check-circle",
    error: "alert-circle",
    info: "info",
    warning: "alert-triangle",
  }

  toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`
  toast.innerHTML = `
        <svg data-lucide="${icons[type]}" class="w-5 h-5"></svg>
        <span>${message}</span>
    `

  container.appendChild(toast)

  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  }

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// ========== Searchable Select ==========
function initSearchableSelect() {
  const searchInput = document.getElementById("departmentSearch")
  const optionsContainer = document.getElementById("departmentOptions")
  const options = document.querySelectorAll(".department-option")
  const hiddenSelect = document.getElementById("departmentSelect")

  searchInput.addEventListener("focus", () => {
    optionsContainer.classList.remove("hidden")
  })

  searchInput.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase()
    options.forEach((option) => {
      const optionText = option.textContent.toLowerCase()
      if (optionText.includes(searchValue)) {
        option.style.display = "block"
      } else {
        option.style.display = "none"
      }
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

// ========== Range Slider ==========
function initRangeSlider() {
  const rangeInput = document.querySelector('input[type="range"]')
  const rangeValue = document.getElementById("rangeValue")

  rangeInput.addEventListener("input", () => {
    rangeValue.textContent = rangeInput.value
  })
}

// ========== Init on DOMContentLoaded ==========
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM loaded, initializing dashboard...")
  initTheme()
  initSidebar()
  initCharts()
  initTables()
  initForms()
  initSearchableSelect()
  initRangeSlider()
  initTabs()
  initModals()

  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme)

  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  }

  window.addEventListener("resize", () => {
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("sidebar-overlay")

    if (window.innerWidth >= 1024) {
      // On desktop, always show sidebar
      sidebar.classList.remove("-translate-x-full")
      overlay.classList.add("hidden")
      console.log("[v0] Window resized to desktop, showing sidebar")

    } else {
      // On mobile, hide sidebar by default
      sidebar.classList.add("-translate-x-full")
      console.log("[v0] Window resized to mobile, hiding sidebar")
    }
  })
})
