/* ==========================================================================
   CV interactivity. Content comes from _data/profile.yml via the page markup
   and the #career-data JSON block. No build step, no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function now() { var d = new Date(); return d.getFullYear() + d.getMonth() / 12 + 1 / 24; }
  function toNum(s) {
    if (s === "present") return now();
    var p = String(s).split("-").map(Number);
    return p[0] + (p[1] - 1) / 12;
  }
  function el(name, attrs, parent) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function monthLabel(v) {
    var y = Math.floor(v), m = Math.min(11, Math.floor((v - y) * 12 + 1e-6));
    return MONTHS[m] + " " + y;
  }
  function rev(s) { return String(s).split("").reverse().join(""); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- generic Gantt renderer ---------- */
  function drawGantt(svg, rows, opt) {
    var W = Math.max(320, Math.min(760, svg.parentNode.clientWidth || 760));
    var stacked = W < 560; /* narrow screens: label above each bar */
    var labelW = stacked ? 0 : opt.labelW;
    var rowH = (opt.rowH || 24) + (stacked ? 16 : 0), top = 8, axisH = 24;
    var H = top + rows.length * rowH + axisH;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var x = function (v) { return labelW + 2 + (v - opt.min) / (opt.max - opt.min) * (W - labelW - 12); };

    var ticks = el("g", { "class": "tick" }, svg);
    var step = stacked ? opt.tickStep * 2 : opt.tickStep;
    for (var t = Math.ceil(opt.min); t <= opt.max; t += step) {
      el("line", { x1: x(t), x2: x(t), y1: top - 4, y2: H - axisH + 2 }, ticks);
      var anchor = x(t) < 20 ? "start" : (x(t) > W - 20 ? "end" : "middle");
      var tx = el("text", { x: x(t), y: H - 6, "text-anchor": anchor }, ticks);
      tx.textContent = t;
    }

    var bars = [], labels = [];
    rows.forEach(function (r, i) {
      var y = top + i * rowH;
      var lab = el("text", { x: 0, y: stacked ? y + 13 : y + rowH / 2 + 4, "class": "row-label" }, svg);
      lab.textContent = r.label;
      var w = Math.max(3, x(r.end) - x(r.start));
      var barY = stacked ? y + 18 : y + 5, barH = stacked ? rowH - 24 : rowH - 10;
      var b = el("rect", { x: x(r.start), y: barY, width: w, height: barH, rx: 4, "class": "bar" }, svg);
      var title = el("title", {}, b);
      title.textContent = r.label + ": " + r.range;
      if (opt.onClick) {
        b.classList.add("clickable");
        b.setAttribute("tabindex", "0");
        b.setAttribute("role", "button");
        b.setAttribute("aria-label", "Open " + r.label);
        b.addEventListener("click", function () { opt.onClick(r); });
        b.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opt.onClick(r); }
        });
      }
      if (!reduceMotion && opt.animate) {
        b.setAttribute("width", 0);
        setTimeout(function () {
          var start = null;
          function frame(ts) {
            if (!start) start = ts;
            var k = Math.min(1, (ts - start) / 700);
            b.setAttribute("width", w * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        }, 60 * i);
      }
      bars.push(b); labels.push(lab);
    });

    var cursor = opt.cursor ? el("line", { "class": "cursor", y1: top - 6, y2: H - axisH + 4 }, svg) : null;
    return { bars: bars, labels: labels, x: x, cursor: cursor };
  }

  /* ---------- career timeline with slider ---------- */
  var career = [];
  try { career = JSON.parse($("#career-data").textContent); } catch (e) { career = []; }
  career.forEach(function (r) {
    r.s = toNum(r.start); r.e = toNum(r.end);
    r.range = r.start.replace("-", "/") + " to " + (r.end === "present" ? "present" : r.end.replace("-", "/"));
  });

  var cg, careerState = { first: true };
  var slider = $("#year-slider"), out = $("#year-out"), readout = $("#career-readout");
  var BASE = career.length ? Math.floor(Math.min.apply(null, career.map(function (r) { return r.s; })) * 12 + 1e-6) / 12 : 2004;
  var maxMonths = Math.floor((now() - BASE) * 12 + 1e-6);
  slider.min = 0; slider.max = maxMonths;
  slider.value = maxMonths;

  function drawCareer() {
    cg = drawGantt($("#career-gantt"),
      career.map(function (r) { return { label: r.label, start: r.s, end: r.e, range: r.range }; }),
      { min: Math.floor(BASE), max: now() + 0.15, labelW: 172, tickStep: 2, cursor: true, animate: careerState.first });
    careerState.first = false;
    updateCareer();
  }

  function updateCareer() {
    var v = BASE + parseInt(slider.value, 10) / 12 + 1 / 24;
    out.textContent = monthLabel(v);
    slider.setAttribute("aria-valuetext", monthLabel(v));
    cg.cursor.setAttribute("x1", cg.x(v));
    cg.cursor.setAttribute("x2", cg.x(v));
    var active = [];
    career.forEach(function (r, i) {
      var on = v >= r.s && v < r.e + 0.001;
      cg.bars[i].classList.toggle("on", on);
      cg.labels[i].classList.toggle("on", on);
      if (on) active.push(r);
    });
    readout.innerHTML = "";
    if (!active.length) {
      var none = document.createElement("p");
      none.className = "r"; none.textContent = "Between roles at this point.";
      readout.appendChild(none);
      return;
    }
    active.forEach(function (r) {
      var d = document.createElement("div"); d.className = "r";
      var h = document.createElement("h3"); h.textContent = r.title;
      var p1 = document.createElement("p"); p1.className = "muted";
      p1.textContent = (r.full_name || r.label) + (r.place ? ", " + r.place : "");
      var p2 = document.createElement("p"); p2.textContent = r.note;
      d.appendChild(h); d.appendChild(p1); d.appendChild(p2);
      readout.appendChild(d);
    });
  }
  slider.addEventListener("input", updateCareer);

  /* ---------- PPRO project Gantt ---------- */
  var projectEls = $all(".project[data-start]");
  var allDetails = $all("details[data-collapsible]");
  var projRows = projectEls.map(function (p) {
    return {
      label: p.dataset.short, start: toNum(p.dataset.start), end: toNum(p.dataset.end), id: p.id,
      range: $(".when .date", p).textContent
    };
  }).sort(function (a, b) { return a.start - b.start; });
  var pg, activeTag = null;

  function drawProjects() {
    pg = drawGantt($("#ppro-gantt"), projRows, {
      min: 2020.5, max: now() + 0.15, labelW: 250, tickStep: 1, rowH: 26,
      onClick: function (r) {
        var d = document.getElementById(r.id);
        d.open = true;
        d.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        $("summary", d).focus({ preventScroll: true });
      }
    });
    pg.bars.forEach(function (b) { b.classList.add("on"); });
    if (activeTag) applyFilter(activeTag);
  }

  /* ---------- technology filter ---------- */
  var tagCount = {};
  projectEls.forEach(function (p) {
    p.dataset.tags.split(",").forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; });
  });
  var tags = Object.keys(tagCount).sort(function (a, b) { return tagCount[b] - tagCount[a] || a.localeCompare(b); });
  var chipList = $("#skill-chips"), status = $("#filter-status");

  tags.forEach(function (t) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = t;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { applyFilter(activeTag === t ? null : t); });
    li.appendChild(b); chipList.appendChild(li);
  });

  function matches(p, tag) { return !tag || p.dataset.tags.split(",").indexOf(tag) > -1; }

  function applyFilter(tag) {
    activeTag = tag;
    $all(".chip", chipList).forEach(function (c) { c.setAttribute("aria-pressed", String(c.textContent === tag)); });
    var hits = 0;
    projectEls.forEach(function (p) {
      var m = matches(p, tag);
      p.classList.toggle("dim", !m);
      if (m && tag) hits++;
    });
    projRows.forEach(function (r, i) {
      var m = matches(document.getElementById(r.id), tag);
      pg.bars[i].classList.toggle("dim", !m);
      pg.labels[i].classList.toggle("dim", !m);
    });
    status.innerHTML = "";
    if (!tag) return;
    status.appendChild(document.createTextNode(tag + " was used in " + hits + " of " + projectEls.length + " projects. "));
    var clear = document.createElement("button");
    clear.type = "button"; clear.textContent = "Show all projects";
    clear.addEventListener("click", function () { applyFilter(null); });
    status.appendChild(clear);
  }

  /* ---------- Summary / Full detail ---------- */
  var detailBtns = $all("[data-detail]");
  detailBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var full = btn.dataset.detail === "full";
      detailBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      allDetails.forEach(function (d) { d.open = full; });
    });
  });

  /* ---------- theme toggle (white by default) ---------- */
  var themeBtn = $("#theme-btn");
  function syncThemeBtn() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  themeBtn.addEventListener("click", function () {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", "dark");
    try { localStorage.setItem("cv-theme", dark ? "light" : "dark"); } catch (e) {}
    syncThemeBtn();
  });
  syncThemeBtn();

  /* ---------- email: never in the page HTML ---------- */
  var emailBtn = $("#email-btn");
  function address() { return rev(emailBtn.dataset.u) + String.fromCharCode(64) + rev(emailBtn.dataset.d); }
  emailBtn.addEventListener("click", function () { window.location.href = "mail" + "to:" + address(); });

  /* ---------- print / PDF: add email and expand details only while printing ---------- */
  var openState = null;
  function beforePrint() {
    if (openState) return;
    openState = allDetails.map(function (d) { return d.open; });
    allDetails.forEach(function (d) { d.open = true; });
    if (!$("#print-email")) {
      var li = document.createElement("li");
      var s = document.createElement("span");
      s.id = "print-email"; s.textContent = address();
      li.appendChild(s);
      $("#contact-links").appendChild(li);
    }
  }
  function afterPrint() {
    var s = $("#print-email");
    if (s) s.parentNode.parentNode.removeChild(s.parentNode);
    if (openState) { allDetails.forEach(function (d, i) { d.open = openState[i]; }); openState = null; }
  }
  window.addEventListener("beforeprint", beforePrint);
  window.addEventListener("afterprint", afterPrint);
  if (window.matchMedia) {
    var mql = window.matchMedia("print");
    var onMql = function (e) { if (e.matches) beforePrint(); else afterPrint(); };
    if (mql.addEventListener) mql.addEventListener("change", onMql); else if (mql.addListener) mql.addListener(onMql);
  }
  $("#print-btn").addEventListener("click", function () { window.print(); });

  /* ---------- benchmark bars animate when first visible ---------- */
  var fig = $("#vuln-figure");
  var fills = $all(".hbar .fill");
  var maxVal = fig ? parseFloat(fig.dataset.max) || 1 : 1;
  function fillBars() {
    fills.forEach(function (f) { f.style.width = Math.max(1.5, parseFloat(f.dataset.value) / maxVal * 100) + "%"; });
  }
  if ("IntersectionObserver" in window && !reduceMotion && fig) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { fillBars(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(fig);
  } else { fillBars(); }

  /* ---------- section nav highlight ---------- */
  var navLinks = $all(".rail nav a");
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle("current", a.getAttribute("href") === "#" + e.target.id); });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    $all("main section").forEach(function (s) { secObs.observe(s); });
  }

  /* ---------- initial draw and redraw on resize ---------- */
  drawCareer();
  drawProjects();
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { drawCareer(); drawProjects(); }, 150);
  });
})();
