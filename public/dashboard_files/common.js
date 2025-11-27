// common.js - shared behaviors
const lucide = window.lucide

function initSidebar() {
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebar-overlay")
  if (!sidebar || !sidebarToggle || !overlay) return

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full")
    overlay.classList.toggle("hidden")
  })

  overlay.addEventListener("click", () => {
    sidebar.classList.add("-translate-x-full")
    overlay.classList.add("hidden")
  })

  document.querySelectorAll("#sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.add("-translate-x-full")
        overlay.classList.add("hidden")
      }
    })
  })
}

function loadScript(src, id, callback) {
  if (document.getElementById(id)) {
    callback?.()
    return
  }
  const script = document.createElement("script")
  script.src = src
  script.id = id
  script.onload = () => callback?.()
  document.head.appendChild(script)
}

function loadStyle(href, id) {
  if (document.getElementById(id)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  link.id = id
  document.head.appendChild(link)
}

function ensureSelect2Ready(callback) {
  const select2Css = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
  const select2Js = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"
  const jqueryCdn = "https://code.jquery.com/jquery-3.6.4.min.js"
  loadStyle(select2Css, "select2-css")
  const ensureSelect2 = () => {
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.select2) {
      callback()
      return
    }
    loadScript(select2Js, "select2-js", () => callback())
  }
  if (!window.jQuery) {
    loadScript(jqueryCdn, "jquery-cdn", ensureSelect2)
  } else {
    ensureSelect2()
  }
}

function initSelect2() {
  ensureSelect2Ready(() => {
    const $ = window.jQuery
    const isRtl = document.documentElement.getAttribute("dir") === "rtl"
    document.querySelectorAll("select").forEach((select) => {
      if (select.dataset.select2 === "true") return
      $(select).select2({
        width: "100%",
        dir: isRtl ? "rtl" : "ltr",
        dropdownAutoWidth: true,
        minimumResultsForSearch: 0,
      })
      select.dataset.select2 = "true"
    })
  })
}

function initCommon() {
  initSidebar()
  initSelect2()
  if (typeof lucide !== "undefined") {
    lucide.createIcons()
  }
}

document.addEventListener("DOMContentLoaded", initCommon)
