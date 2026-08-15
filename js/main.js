(function(){
  "use strict";

  /* ---------------- i18n ---------------- */
  var currentLang = "en";

  function applyI18n(lang){
    var dict = I18N[lang];
    if(!dict) return;
    document.documentElement.setAttribute("lang", lang === "ar" ? "ar" : "en");
    document.documentElement.setAttribute("dir", dict.dir);

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var key = el.getAttribute("data-i18n-ph");
      if(dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.getElementById("langBtn").textContent = dict.lang_toggle;
    var mobileBtn = document.getElementById("langBtnMobile");
    if(mobileBtn) mobileBtn.textContent = dict.lang_toggle;

    currentLang = lang;
    renderProjectsTable();
    populateYearFilter();
  }

  function toggleLang(){
    applyI18n(currentLang === "en" ? "ar" : "en");
  }
  document.getElementById("langBtn").addEventListener("click", toggleLang);
  var mBtn = document.getElementById("langBtnMobile");
  if(mBtn) mBtn.addEventListener("click", toggleLang);

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function(){
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){ navLinks.classList.remove("open"); });
  });

  /* ---------------- Nav scroll shadow ---------------- */
  var nav = document.querySelector(".site-nav");
  window.addEventListener("scroll", function(){
    if(window.scrollY > 12){ nav.style.boxShadow = "0 6px 24px rgba(0,0,0,.06)"; }
    else{ nav.style.boxShadow = "none"; }
  });

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------------- Stat counters ---------------- */
  var counters = document.querySelectorAll("[data-count]");
  var counted = false;
  function runCounters(){
    if(counted) return;
    counted = true;
    counters.forEach(function(el){
      var target = parseInt(el.getAttribute("data-count"), 10);
      var dur = 1400;
      var start = null;
      function step(ts){
        if(!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var statsSection = document.querySelector(".stats");
  if(statsSection){
    var statsIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) runCounters(); });
    }, { threshold: .4 });
    statsIO.observe(statsSection);
  }

  /* ---------------- Gallery strip ---------------- */
  var galleryStrip = document.getElementById("galleryStrip");
  var GALLERY_COUNT = 24;
  for(var g = 1; g <= GALLERY_COUNT; g++){
    var idx = ("0" + g).slice(-2);
    var img = document.createElement("img");
    img.src = "assets/img/gallery/project-" + idx + ".jpeg";
    img.alt = "Hawara Advanced Contracting Co. — completed project " + g;
    img.loading = "lazy";
    galleryStrip.appendChild(img);
  }

  /* ---------------- Clients grid ---------------- */
  var clientsGrid = document.getElementById("clientsGrid");
  var CLIENT_FILES = ["png","png","jpeg","png","jpeg","jpeg","jpeg","png","png","png",
    "jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","jpeg","png","png",
    "png","jpeg","png","jpeg","png","jpeg","jpeg","jpeg","png","jpeg",
    "png","jpeg","png","jpeg","png","png","jpeg","png","jpeg","jpeg",
    "jpeg","png","jpeg","png"];
  CLIENT_FILES.forEach(function(ext, i){
    var num = ("0" + (i+1)).slice(-2);
    var tile = document.createElement("div");
    tile.className = "client-tile";
    var img = document.createElement("img");
    img.src = "assets/img/clients/client-" + num + "." + ext;
    img.alt = "Client logo " + (i+1);
    img.loading = "lazy";
    tile.appendChild(img);
    clientsGrid.appendChild(tile);
  });

  /* ---------------- Projects table ---------------- */
  var tbody = document.getElementById("projTbody");
  var searchInput = document.getElementById("projSearch");
  var yearSelect = document.getElementById("projYear");
  var countLabel = document.getElementById("projCount");
  var sortKey = "n";
  var sortDir = 1;

  function populateYearFilter(){
    var years = Array.from(new Set(PROJECTS.map(function(p){ return p.year; }))).sort(function(a,b){return a-b;});
    var current = yearSelect.value;
    var dict = I18N[currentLang];
    yearSelect.innerHTML = '<option value="">' + dict.projects_filter_all + '</option>';
    years.forEach(function(y){
      var opt = document.createElement("option");
      opt.value = y; opt.textContent = y;
      yearSelect.appendChild(opt);
    });
    yearSelect.value = current || "";
  }

  function getFiltered(){
    var q = (searchInput.value || "").trim().toLowerCase();
    var y = yearSelect.value;
    return PROJECTS.filter(function(p){
      var matchQ = !q || p.project.toLowerCase().indexOf(q) > -1 || p.client.toLowerCase().indexOf(q) > -1;
      var matchY = !y || String(p.year) === y;
      return matchQ && matchY;
    });
  }

  function fmtMoney(v){
    return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderProjectsTable(){
    var dict = I18N[currentLang];
    var rows = getFiltered();
    rows.sort(function(a,b){
      var av = a[sortKey], bv = b[sortKey];
      if(typeof av === "string"){ av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if(av < bv) return -1 * sortDir;
      if(av > bv) return 1 * sortDir;
      return 0;
    });
    tbody.innerHTML = "";
    rows.forEach(function(p){
      var tr = document.createElement("tr");
      var roleClass = /renovation/i.test(p.role) ? "role-badge renovation" : "role-badge";
      tr.innerHTML =
        "<td class=\"num\">" + p.n + "</td>" +
        "<td class=\"proj-name\">" + p.project + "</td>" +
        "<td>" + p.client + "</td>" +
        "<td class=\"role-tag\"><span class=\"" + roleClass + "\">" + p.role + "</span></td>" +
        "<td>" + p.date + "</td>" +
        "<td>" + p.desc + "</td>" +
        "<td class=\"num\">" + fmtMoney(p.value) + "</td>";
      tbody.appendChild(tr);
    });
    countLabel.textContent = dict.projects_showing + " " + rows.length + " " + dict.projects_of + " " + PROJECTS.length + " " + dict.projects_results;
  }

  searchInput.addEventListener("input", renderProjectsTable);
  yearSelect.addEventListener("change", renderProjectsTable);

  document.querySelectorAll(".projects-table thead th").forEach(function(th){
    th.addEventListener("click", function(){
      var key = th.getAttribute("data-sort");
      if(sortKey === key){ sortDir *= -1; } else { sortKey = key; sortDir = 1; }
      renderProjectsTable();
    });
  });

  /* ---------------- Contact form (static, no backend) ---------------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var msgs = {
      en: "Thanks — this form is a static demo. Please email info@hawariacc.com or call +962 6 551 5546 directly.",
      ar: "شكراً — هذا النموذج تجريبي حالياً. يرجى مراسلتنا على info@hawariacc.com أو الاتصال على 0655155546."
    };
    formNote.textContent = msgs[currentLang] || msgs.en;
  });

  /* ---------------- Footer year ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Init ---------------- */
  populateYearFilter();
  renderProjectsTable();
  applyI18n("en");
})();
