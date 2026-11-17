/* ==========================================================================
   Barangay BorrowHub - Borrower Page Logic
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Constants & helpers
     ------------------------------------------------------------------ */
  var PAGE_SIZE = 6;
  var PUROKS = {
    1: 'Ilang-Ilang',
    2: 'Sampaguita',
    3: 'Gumamela',
    4: 'Santan',
    5: 'Rosal'
  };
  var MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n, len) { var s = String(n); while (s.length < len) s = '0' + s; return s; }
  function purokLabel(n) { return 'Purok ' + n + ' - ' + PUROKS[n]; }
  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var a = parts[0] ? parts[0].charAt(0) : '';
    var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (a + b).toUpperCase();
  }
  function addDays(d) { var t = new Date(); t.setDate(t.getDate() + d); return t; }
  function fmtShort(date) { return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function fmtFull(date) { return MONTHS_FULL[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear(); }
  function dueText(d) {
    if (d < 0) return 'Overdue ' + (-d) + ' day' + (-d === 1 ? '' : 's');
    if (d === 0) return 'Due today';
    if (d === 1) return 'Due tomorrow';
    return 'Due in ' + d + ' days';
  }
  function statusClass(s) {
    if (s === 'Good Standing') return 'good';
    if (s === 'Overdue') return 'overdue';
    return 'warn';
  }
  function streetShort(street) { return street.replace(/,\s*Barangay Bulacao\s*$/i, ''); }

  /* ------------------------------------------------------------------
     Icons
     ------------------------------------------------------------------ */
  var ICON = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    chair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>',
    table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16"/><path d="M5 10v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M6 10v10"/><path d="M18 10v10"/><path d="M6 15h12"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    tent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    idcard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M13 10h5"/><path d="M13 14h5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 17v-5"/><path d="M12 17V8"/><path d="M16 17v-3"/></svg>',
    ledger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16v18l-3-2-3 2-2-2-2 2-3-2-3 2z"/><path d="M8 8h8"/><path d="M8 12h8"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    calCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    pencilSm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };
  function itemIcon(name) {
    var n = name.toLowerCase();
    if (n.indexOf('chair') > -1) return ICON.chair;
    if (n.indexOf('table') > -1) return ICON.table;
    if (n.indexOf('megaphone') > -1 || n.indexOf('speaker') > -1 || n.indexOf('sound') > -1) return ICON.speaker;
    if (n.indexOf('canopy') > -1 || n.indexOf('tent') > -1) return ICON.tent;
    return ICON.box;
  }

  /* ------------------------------------------------------------------
     Seed data (142 borrowers: 6 hand-written + 136 generated)
     ------------------------------------------------------------------ */
  var PURPOSES = {
    chair: 'Family Gathering / Community Assistance',
    table: 'Purok Assembly / Relief Distribution',
    speaker: 'Purok Clean-Up Drive Briefing',
    tent: 'Barangay Fiesta / Wake & Funeral',
    box: 'Community Event Support'
  };
  function purposeFor(name) {
    var n = name.toLowerCase();
    if (n.indexOf('chair') > -1) return PURPOSES.chair;
    if (n.indexOf('table') > -1) return PURPOSES.table;
    if (n.indexOf('megaphone') > -1 || n.indexOf('speaker') > -1 || n.indexOf('sound') > -1) return PURPOSES.speaker;
    if (n.indexOf('canopy') > -1 || n.indexOf('tent') > -1) return PURPOSES.tent;
    return PURPOSES.box;
  }

  var HISTORY_POOL = [
    { date: 'Jan 12, 2026', items: '1 Megaphone', status: 'Returned' },
    { date: 'Mar 08, 2026', items: '2 Folding Tables', status: 'Returned' },
    { date: 'May 20, 2026', items: '1 Canopy (10\u00d710)', status: 'Returned' },
    { date: 'Jul 15, 2026', items: '1 Sound System', status: 'Returned' },
    { date: 'Sept 04, 2026', items: '30 Chairs', status: 'Returned' }
  ];

  var ITEM_POOL = [
    { name: 'Stackable Monobloc Chairs', units: 10 },
    { name: 'Folding Catering Tables', units: 2 },
    { name: 'Canopy (10\u00d710)', units: 1 },
    { name: 'Portable Sound System', units: 1 },
    { name: 'Heavy Duty Portable Megaphone', units: 1 },
    { name: 'Stackable Monobloc Chairs', units: 15 },
    { name: 'Folding Catering Tables', units: 3 }
  ];

  var FIRST = ['Juan', 'Rosario', 'Carlo', 'Teresita', 'Mario', 'Liza', 'Jose', 'Angelica', 'Ramon', 'Cecilia', 'Danilo', 'Marites', 'Felipe', 'Gloria', 'Arnel', 'Josefina', 'Rodel', 'Lourdes', 'Benjie', 'Imelda'];
  var LAST = ['Reyes', 'Cruz', 'Garcia', 'Mendoza', 'Villanueva', 'Aquino', 'Castillo', 'Navarro', 'Pascual', 'Flores', 'Torres', 'Dela Cruz', 'Ramirez', 'Soriano', 'Bernardo', 'Domingo', 'Lim', 'Tan', 'Abella', 'Cabahug', 'Gonzales', 'Lapid', 'Ouano', 'Pacana'];
  var REG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'];

  function mkItem(name, units, dueInDays) {
    return { name: name, units: units, dueInDays: dueInDays };
  }
  function totalUnits(b) { return b.items.reduce(function (s, it) { return s + it.units; }, 0); }

  function buildSeed() {
    var list = [
      { name: 'Roberto Diaz', contact: '0917-555-1234', email: 'rdiaz@gmail.com', purok: 1, street: '#8 Ilang-Ilang St., Barangay Bulacao', status: 'Good Standing', registered: 'January 05, 2026', completed: 3, items: [mkItem('Heavy Duty Portable Megaphone', 2, 2)], history: HISTORY_POOL.slice(2) },
      {
        name: 'Maria Santos', contact: '0928-444-5678', email: 'msantos@gmail.com', purok: 2, street: '#14 Sampaguita St., Barangay Bulacao', status: 'Good Standing', registered: 'January 09, 2026', completed: 5,
        items: [mkItem('Stackable Monobloc Chairs', 40, 2), mkItem('Folding Catering Tables', 4, 2)],
        history: [
          { date: 'Jan 12, 2026', items: '1 Megaphone', status: 'Returned' },
          { date: 'May 20, 2026', items: '1 Canopy (10\u00d710)', status: 'Returned' },
          { date: 'Sept 04, 2026', items: '30 Chairs', status: 'Returned' }
        ]
      },
      { name: 'Eduardo Ramos', contact: '0918-333-9876', email: '', purok: 3, street: '#21 Gumamela St., Barangay Bulacao', status: 'Overdue', registered: 'February 14, 2026', completed: 2, items: [mkItem('Folding Catering Tables', 2, -3)], history: HISTORY_POOL.slice(3) },
      { name: 'Elena Bautista', contact: '0920-777-8899', email: 'ebautista@gmail.com', purok: 4, street: '#5 Santan St., Barangay Bulacao', status: 'Good Standing', registered: 'February 20, 2026', completed: 4, items: [mkItem('Stackable Monobloc Chairs', 20, 5)], history: HISTORY_POOL.slice(1) },
      { name: 'Ricardo Dalisay', contact: '0915-888-4455', email: '', purok: 1, street: '#33 Ilang-Ilang St., Barangay Bulacao', status: 'Good Standing', registered: 'March 03, 2026', completed: 1, items: [mkItem('Folding Catering Tables', 2, 3)], history: HISTORY_POOL.slice(4) },
      { name: 'Nenita Gomez', contact: '0933-222-1100', email: 'ngomez@gmail.com', purok: 5, street: '#12 Rosal St., Barangay Bulacao', status: 'Good Standing', registered: 'March 18, 2026', completed: 2, items: [mkItem('Canopy (10\u00d710)', 1, 6)], history: HISTORY_POOL.slice(3) }
    ];

    for (var i = 0; i < 136; i++) {
      var purok = (i % 5) + 1;
      var active = (i % 7 === 3 && i < 126);
      var status = 'Good Standing';
      if (i === 10 || i === 45) status = 'Overdue';
      else if (i % 31 === 5) status = 'Restricted';
      else if (i === 77) status = 'Suspended';
      var first = FIRST[i % 20];
      var last = LAST[(i * 7 + Math.floor(i / 20)) % 24];
      var completed = (i * 3) % 6;
      var items = [];
      if (active) {
        var base = ITEM_POOL[i % ITEM_POOL.length];
        items.push(mkItem(base.name, base.units, status === 'Overdue' ? -(2 + (i % 3)) : 1 + (i % 6)));
      }
      var fname = first + ' ' + last;
      list.push({
        name: fname,
        contact: '09' + pad(15 + (i * 3) % 30, 2) + '-' + pad(100 + (i * 37) % 900, 3) + '-' + pad(1000 + (i * 911) % 9000, 4),
        email: i % 3 === 0 ? (first.charAt(0) + last).toLowerCase().replace(/\s+/g, '') + '@gmail.com' : '',
        purok: purok,
        street: '#' + (1 + (i * 5) % 48) + ' ' + PUROKS[purok] + ' St., Barangay Bulacao',
        status: status,
        registered: REG_MONTHS[i % 10] + ' ' + pad(1 + (i * 3) % 28, 2) + ', 2026',
        completed: completed,
        items: items,
        history: HISTORY_POOL.slice(5 - Math.min(completed, 5))
      });
    }

    list.forEach(function (b, idx) {
      b.key = 'b' + idx;
      b.id = 'BRG-BOR-2025-' + pad(idx + 1, 4);
    });
    return list;
  }

  var borrowers = buildSeed();
  var nextSeq = 82;                // next auto-generated ID: BRG-BOR-2026-0082
  var keyCounter = borrowers.length;
  var state = { page: 1, search: '', purok: 'All', status: 'All', selected: borrowers[1].key };

  /* ------------------------------------------------------------------
     Toasts
     ------------------------------------------------------------------ */
  function toast(msg, type) {
    var c = $('#toastContainer');
    var el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.textContent = msg;
    c.appendChild(el);
    setTimeout(function () {
      el.classList.add('leaving');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
    }, 3200);
  }
  $$('[data-toast]').forEach(function (btn) {
    btn.addEventListener('click', function () { toast(btn.getAttribute('data-toast')); });
  });

  /* ------------------------------------------------------------------
     Navbar behaviours
     ------------------------------------------------------------------ */
  var adminWrap = $('#adminDropdownWrapper');
  $('#adminDropdownBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    var open = adminWrap.classList.toggle('open');
    this.setAttribute('aria-expanded', open);
  });
  $('#mobileMenuBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    $('#navLinks').classList.toggle('open');
  });

  /* ------------------------------------------------------------------
     Filter dropdowns (Purok / Status)
     ------------------------------------------------------------------ */
  function setupFilterDropdown(wrapId, key) {
    var wrap = $('#' + wrapId);
    var btn = $('.filter-dd-btn', wrap);
    var label = $('.filter-dd-label', wrap);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      $$('.filter-dd').forEach(function (o) { if (o !== wrap) o.classList.remove('open'); });
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    $$('.filter-opt', wrap).forEach(function (opt) {
      opt.addEventListener('click', function () {
        $$('.filter-opt', wrap).forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        label.textContent = opt.textContent;
        state[key] = opt.getAttribute('data-value');
        state.page = 1;
        wrap.classList.remove('open');
        renderList();
      });
    });
  }
  setupFilterDropdown('purokFilterWrap', 'purok');
  setupFilterDropdown('statusFilterWrap', 'status');

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#adminDropdownWrapper')) adminWrap.classList.remove('open');
    if (!e.target.closest('.filter-dd')) $$('.filter-dd').forEach(function (o) { o.classList.remove('open'); });
    if (!e.target.closest('.navbar')) $('#navLinks').classList.remove('open');
  });

  $('#searchInput').addEventListener('input', function () {
    state.search = this.value.trim().toLowerCase();
    state.page = 1;
    renderList();
  });

  /* ------------------------------------------------------------------
     Rendering: KPI + table + pagination
     ------------------------------------------------------------------ */
  function getFiltered() {
    return borrowers.filter(function (b) {
      if (state.search && b.name.toLowerCase().indexOf(state.search) === -1) return false;
      if (state.purok !== 'All' && String(b.purok) !== state.purok) return false;
      if (state.status !== 'All' && b.status !== state.status) return false;
      return true;
    });
  }

  function avatarClass(b, idx) {
    if (b.status === 'Overdue') return 'av-red';
    var cycle = ['av-dark', 'av-mid', 'av-light', 'av-lighter'];
    return cycle[idx % cycle.length];
  }

  function renderKpis() {
    $('#kpiTotalValue').textContent = borrowers.length;
    $('#kpiActiveValue').textContent = borrowers.filter(function (b) { return b.items.length > 0; }).length;
    $('#kpiOverdueValue').textContent = borrowers.filter(function (b) { return b.status === 'Overdue'; }).length;
  }

  function renderList() {
    var filtered = getFiltered();
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageRows = filtered.slice(start, start + PAGE_SIZE);

    $('#listedBadge').textContent = filtered.length + ' Listed';
    var body = $('#borrowerTableBody');

    if (!pageRows.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="6">No borrowers match your search or filters.</td></tr>';
    } else {
      body.innerHTML = pageRows.map(function (b, i) {
        var units = totalUnits(b);
        var pillCls = b.status === 'Overdue' ? ' red' : (units === 0 ? ' zero' : '');
        var itemsText = units === 0 ? 'None' : units + (units === 1 ? ' item' : ' items');
        var cls = [];
        if (b.status === 'Overdue') cls.push('is-overdue');
        if (b.key === state.selected) cls.push('selected');
        return '<tr data-key="' + b.key + '" class="' + cls.join(' ') + '">' +
          '<td><div class="b-name"><span class="avatar ' + avatarClass(b, start + i) + '">' + esc(initials(b.name)) + '</span><span class="name-text">' + esc(b.name) + '</span></div></td>' +
          '<td class="td-contact">' + esc(b.contact) + '</td>' +
          '<td>Purok ' + b.purok + '</td>' +
          '<td class="td-center"><span class="items-pill' + pillCls + '">' + itemsText + '</span></td>' +
          '<td><span class="pill ' + statusClass(b.status) + '">' + esc(b.status) + '</span></td>' +
          '<td class="td-right"><div class="row-actions">' +
            '<button type="button" class="icon-btn" data-action="view" aria-label="View ' + esc(b.name) + '" title="View details">' + ICON.eye + '</button>' +
            '<button type="button" class="icon-btn" data-action="edit" aria-label="Edit ' + esc(b.name) + '" title="Edit borrower">' + ICON.pencil + '</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }

    $('#footerShowing').textContent = 'Showing ' + pageRows.length + ' of ' + filtered.length + ' Borrowers';
    $('#footerPage').textContent = 'Page ' + state.page + ' of ' + totalPages;
    renderPagination(totalPages);
    renderKpis();
  }

  function renderPagination(totalPages) {
    var wrap = $('#pagination');
    var startPage = Math.max(1, Math.min(state.page - 1, totalPages - 2));
    var endPage = Math.min(totalPages, startPage + 2);
    var html = '<button type="button" class="page-btn" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + '>Previous</button>';
    for (var p = startPage; p <= endPage; p++) {
      html += '<button type="button" class="page-btn' + (p === state.page ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
    }
    html += '<button type="button" class="page-btn" data-page="' + (state.page + 1) + '"' + (state.page === totalPages ? ' disabled' : '') + '>Next</button>';
    wrap.innerHTML = html;
  }

  $('#pagination').addEventListener('click', function (e) {
    var btn = e.target.closest('.page-btn');
    if (!btn || btn.disabled) return;
    state.page = parseInt(btn.getAttribute('data-page'), 10);
    renderList();
  });

  $('#borrowerTableBody').addEventListener('click', function (e) {
    var row = e.target.closest('tr[data-key]');
    if (!row) return;
    var key = row.getAttribute('data-key');
    var actionBtn = e.target.closest('[data-action]');
    selectBorrower(key);
    if (actionBtn) {
      var b = findByKey(key);
      if (actionBtn.getAttribute('data-action') === 'view') openDetails(b);
      else openEdit(b);
    }
  });

  function findByKey(key) {
    for (var i = 0; i < borrowers.length; i++) if (borrowers[i].key === key) return borrowers[i];
    return null;
  }

  function selectBorrower(key) {
    state.selected = key;
    $$('#borrowerTableBody tr[data-key]').forEach(function (tr) {
      tr.classList.toggle('selected', tr.getAttribute('data-key') === key);
    });
    renderDetailPanel();
  }

  /* ------------------------------------------------------------------
     Side detail panel
     ------------------------------------------------------------------ */
  function renderDetailPanel() {
    var b = findByKey(state.selected);
    var panel = $('#detailPanel');
    if (!b) {
      panel.innerHTML = '<div class="held-empty">Select a borrower to view borrowing details.</div>';
      return;
    }
    var units = totalUnits(b);
    var minDue = b.items.length ? Math.min.apply(null, b.items.map(function (it) { return it.dueInDays; })) : null;
    var dueLabel, dueCls = '';
    if (minDue === null) { dueLabel = 'No active loans'; dueCls = ' muted'; }
    else if (minDue < 0) { dueLabel = 'Overdue'; dueCls = ' red'; }
    else if (minDue <= 2) { dueLabel = 'Due Soon'; }
    else { dueLabel = 'On Schedule'; dueCls = ' muted'; }

    var itemsHtml = b.items.length ? b.items.map(function (it) {
      var overdue = it.dueInDays < 0;
      return '<div class="held-item">' +
        '<div class="held-icon">' + itemIcon(it.name) + '</div>' +
        '<div class="held-text"><div class="held-name">' + esc(it.name) + '</div><div class="held-units">' + it.units + (it.units === 1 ? ' Unit' : ' Units') + '</div></div>' +
        '<span class="held-tag' + (overdue ? ' overdue' : '') + '">' + (overdue ? 'Overdue' : 'Active') + '</span>' +
      '</div>';
    }).join('') : '<div class="held-empty">No items currently borrowed.</div>';

    var recent = b.history.slice(-3);
    var historyHtml = recent.length ?
      '<div class="history-grid">' +
        '<div class="hh">DATE</div><div class="hh">ITEMS BORROWED</div><div class="hh">STATUS</div>' +
        recent.map(function (h) {
          return '<div class="hc date">' + esc(h.date) + '</div><div class="hc items">' + esc(h.items) + '</div><div class="hc status">' + esc(h.status) + '</div>';
        }).join('') +
      '</div>' : '<div class="history-empty">No borrowing history yet.</div>';

    panel.innerHTML =
      '<div class="dp-head">' +
        '<div class="dp-avatar">' + esc(initials(b.name)) + '</div>' +
        '<div class="dp-head-text"><div class="dp-name">' + esc(b.name) + '</div><div class="dp-role">Resident Borrower</div></div>' +
        '<span class="dp-status ' + statusClass(b.status) + '">' + esc(b.status) + '</span>' +
      '</div>' +
      '<div class="dp-info-grid">' +
        '<div><div class="dp-info-label">Contact Number</div><div class="dp-info-value">' + esc(b.contact) + '</div></div>' +
        '<div><div class="dp-info-label">Address</div><div class="dp-info-value">Purok ' + b.purok + ', ' + esc(streetShort(b.street)) + '</div></div>' +
        '<div><div class="dp-info-label">Active Borrowings</div><div class="dp-info-value">' + units + (units === 1 ? ' item' : ' items') + '</div></div>' +
        '<div><div class="dp-info-label">Completed Borrowings</div><div class="dp-info-value">' + b.completed + (b.completed === 1 ? ' item' : ' items') + '</div></div>' +
      '</div>' +
      '<div class="dp-section-head"><span>ACTIVE ITEMS HELD</span><span class="aside' + dueCls + '">' + dueLabel + '</span></div>' +
      itemsHtml +
      '<div class="dp-section-head"><span>RECENT BORROWING HISTORY</span><span class="aside muted">' + b.completed + ' Total</span></div>' +
      '<div class="history-box">' + historyHtml + '</div>' +
      '<button type="button" class="btn-edit-borrower" id="panelEditBtn">' + ICON.pencilSm + '<span>Edit Borrower</span></button>';

    $('#panelEditBtn').addEventListener('click', function () { openEdit(b); });
  }

  /* ------------------------------------------------------------------
     Modal helpers
     ------------------------------------------------------------------ */
  function openModal(id) {
    var m = $('#' + id);
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    $('#' + id).classList.remove('open');
    if (!$('.modal-backdrop.open')) document.body.style.overflow = '';
  }
  $$('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.getAttribute('data-close-modal')); });
  });
  $$('.modal-backdrop').forEach(function (bd) {
    bd.addEventListener('mousedown', function (e) { if (e.target === bd) closeModal(bd.id); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $$('.modal-backdrop.open').forEach(function (m) { closeModal(m.id); });
  });

  /* ------------------------------------------------------------------
     Validation helpers
     ------------------------------------------------------------------ */
  var PHONE_RE = /^09\d{2}-?\d{3}-?\d{4}$/;
  function normalizePhone(v) {
    var d = v.replace(/\D/g, '');
    return d.slice(0, 4) + '-' + d.slice(4, 7) + '-' + d.slice(7, 11);
  }
  function markInvalid(el, bad) { el.classList.toggle('invalid', !!bad); }
  function clearInvalid(form) { $$('.invalid', form).forEach(function (el) { el.classList.remove('invalid'); }); }
  function validateBorrowerFields(form, f) {
    clearInvalid(form);
    var ok = true;
    if (!f.name.value.trim()) { markInvalid(f.name, true); ok = false; }
    if (!PHONE_RE.test(f.contact.value.trim())) { markInvalid(f.contact, true); ok = false; }
    if (!f.street.value.trim()) { markInvalid(f.street, true); ok = false; }
    if (f.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { markInvalid(f.email, true); ok = false; }
    return ok;
  }
  $$('.mint-input, .mint-select').forEach(function (el) {
    el.addEventListener('input', function () { el.classList.remove('invalid'); });
  });

  /* ------------------------------------------------------------------
     Register Borrower modal
     ------------------------------------------------------------------ */
  function nextId() { return 'BRG-BOR-2026-' + pad(nextSeq, 4); }

  $('#openRegisterModalBtn').addEventListener('click', function () {
    $('#registerForm').reset();
    clearInvalid($('#registerForm'));
    $('#regId').value = nextId();
    $('#regPurok').value = '2';
    $('#regCertify').checked = true;
    $('.certify-row').classList.remove('invalid');
    openModal('registerModalBackdrop');
    setTimeout(function () { $('#regName').focus(); }, 60);
  });

  $('#registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = this;
    var fields = { name: $('#regName'), contact: $('#regContact'), email: $('#regEmail'), street: $('#regStreet') };
    var ok = validateBorrowerFields(form, fields);
    var certify = $('#regCertify');
    $('.certify-row').classList.toggle('invalid', !certify.checked);
    if (!certify.checked) ok = false;
    if (!ok) { toast('Please complete the required fields correctly.', 'error'); return; }

    var b = {
      key: 'b' + (keyCounter++),
      id: nextId(),
      name: fields.name.value.trim(),
      contact: normalizePhone(fields.contact.value),
      email: fields.email.value.trim(),
      purok: parseInt($('#regPurok').value, 10),
      street: fields.street.value.trim(),
      status: $('#regStatus').value,
      proof: $('#regProof').value,
      registered: fmtFull(new Date()),
      completed: 0,
      items: [],
      history: []
    };
    nextSeq++;
    borrowers.unshift(b);
    state.search = ''; state.purok = 'All'; state.status = 'All'; state.page = 1;
    $('#searchInput').value = '';
    resetFilterLabels();
    state.selected = b.key;
    closeModal('registerModalBackdrop');
    renderList();
    renderDetailPanel();
    toast(b.name + ' registered as ' + b.id);
  });

  function resetFilterLabels() {
    ['purokFilterWrap', 'statusFilterWrap'].forEach(function (id) {
      var wrap = $('#' + id);
      $$('.filter-opt', wrap).forEach(function (o, i) { o.classList.toggle('selected', i === 0); });
      $('.filter-dd-label', wrap).textContent = $$('.filter-opt', wrap)[0].textContent;
    });
  }

  /* ------------------------------------------------------------------
     Edit Borrower modal
     ------------------------------------------------------------------ */
  function openEdit(b) {
    clearInvalid($('#editForm'));
    $('#editBorrowerKey').value = b.key;
    $('#editHeaderId').textContent = b.id;
    $('#editName').value = b.name;
    $('#editId').value = b.id;
    $('#editContact').value = b.contact;
    $('#editEmail').value = b.email;
    $('#editStreet').value = b.street;
    $('#editPurok').value = String(b.purok);
    $('#editStatus').value = b.status;

    var units = totalUnits(b);
    if (b.items.length) {
      var minDue = Math.min.apply(null, b.items.map(function (it) { return it.dueInDays; }));
      $('#editCustodyTag').textContent = minDue < 0 ? 'Overdue' : 'In Custody';
      $('#editCustodyText').textContent = b.items.length + ' Active Borrowed (' + units + ' items held)';
      $('#editCustodyDue').textContent = minDue < 0 ? dueText(minDue) : 'Due: ' + (minDue === 0 ? 'Today' : minDue === 1 ? 'Tomorrow' : 'In ' + minDue + ' days');
    } else {
      $('#editCustodyTag').textContent = 'Clear';
      $('#editCustodyText').textContent = 'No active borrowings';
      $('#editCustodyDue').textContent = '';
    }
    openModal('editModalBackdrop');
  }

  $('#editForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var b = findByKey($('#editBorrowerKey').value);
    if (!b) return;
    var fields = { name: $('#editName'), contact: $('#editContact'), email: $('#editEmail'), street: $('#editStreet') };
    if (!validateBorrowerFields(this, fields)) { toast('Please complete the required fields correctly.', 'error'); return; }
    b.name = fields.name.value.trim();
    b.contact = normalizePhone(fields.contact.value);
    b.email = fields.email.value.trim();
    b.street = fields.street.value.trim();
    b.purok = parseInt($('#editPurok').value, 10);
    b.status = $('#editStatus').value;
    closeModal('editModalBackdrop');
    renderList();
    renderDetailPanel();
    toast('Updated record for ' + b.name);
  });

  /* ------------------------------------------------------------------
     Borrower Details modal
     ------------------------------------------------------------------ */
  function openDetails(b) {
    var units = totalUnits(b);
    var overdueCount = b.items.filter(function (it) { return it.dueInDays < 0; }).length;
    var minDue = b.items.length ? Math.min.apply(null, b.items.map(function (it) { return it.dueInDays; })) : null;
    var sCls = statusClass(b.status);

    $('#detHeaderId').textContent = b.id;
    $('#detVerifiedChip').innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Verified Resident &bull; ' + esc(b.status);

    var standingText = b.status === 'Good Standing' ? 'Good Standing (Eligible to Borrow)' :
      b.status === 'Overdue' ? 'Overdue (Unreturned Items)' :
      b.status === 'Restricted' ? 'Restricted (Not Eligible)' : 'Suspended (Pending Review)';

    var outstandingSub = minDue === null ? 'No pending returns' :
      (minDue < 0 ? dueText(minDue) : 'Due ' + (minDue === 1 ? 'Tomorrow' : minDue === 0 ? 'Today' : fmtShort(addDays(minDue))) + ': 5:00 PM');

    var ledgerRows = '';
    b.items.forEach(function (it, i) {
      var overdue = it.dueInDays < 0;
      var due = addDays(it.dueInDays);
      ledgerRows +=
        '<div class="ledger-row active' + (overdue ? ' overdue' : '') + '">' +
          '<div class="ledger-left">' +
            '<div class="ledger-icon">' + itemIcon(it.name) + '</div>' +
            '<div>' +
              '<div class="ledger-title">' + it.units + 'x ' + esc(it.name) + ' <span class="ledger-tag">' + (overdue ? 'Overdue' : 'Active Custody') + '</span></div>' +
              '<div class="ledger-meta"><span>Transaction ID: <b>TXN-2026-' + (1100 + i + parseInt(b.key.slice(1), 10)) + '-A</b></span><span>&bull; Purpose: ' + esc(purposeFor(it.name)) + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="ledger-right">' +
            '<span class="ledger-date">' + ICON.cal.replace('<svg', '<svg width="14" height="14"') + ' Due ' + fmtShort(due) + ' (5:00 PM)</span>' +
            '<div class="ledger-state">Status: ' + (overdue ? 'Overdue \u2022 Follow-up required' : 'In Good Custody \u2022 Inspected OK') + '</div>' +
          '</div>' +
        '</div>';
    });
    b.history.slice(-2).reverse().forEach(function (h, i) {
      ledgerRows +=
        '<div class="ledger-row">' +
          '<div class="ledger-left">' +
            '<div class="ledger-icon">' + itemIcon(h.items) + '</div>' +
            '<div>' +
              '<div class="ledger-title">' + esc(h.items) + ' <span class="ledger-tag">Completed &amp; Returned</span></div>' +
              '<div class="ledger-meta"><span>Transaction ID: <b>TXN-2026-' + (1011 + i) + '-B</b></span><span>&bull; Purpose: ' + esc(purposeFor(h.items)) + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="ledger-right">' +
            '<span class="ledger-date">' + ICON.calCheck.replace('<svg', '<svg width="14" height="14"') + ' Returned ' + esc(h.date) + '</span>' +
            '<div class="ledger-state">Condition Verified: Clean, functional</div>' +
          '</div>' +
        '</div>';
    });
    if (!ledgerRows) ledgerRows = '<div class="ledger-empty">No equipment custody records yet.</div>';

    $('#detailsBody').innerHTML =
      '<div class="det-section">' +
        '<div class="det-section-title">' + ICON.idcard + ' Borrower Profile</div>' +
        '<div class="profile-grid">' +
          '<div class="profile-person">' +
            '<div class="profile-photo">' + esc(initials(b.name)) + '<span class="verified-dot">' + ICON.check + '</span></div>' +
            '<div><div class="p-label">Full Legal Name</div><div class="p-value">' + esc(b.name) + '</div>' +
            '<span class="p-standing ' + (sCls === 'good' ? '' : sCls) + '">' + esc(standingText) + '</span></div>' +
          '</div>' +
          '<div>' +
            '<div class="p-block"><div class="p-label">Residential Address</div><div class="p-value normal">' + esc(streetShort(b.street)) + ', Purok ' + b.purok + ', Barangay Bulacao</div></div>' +
            '<div class="p-registered">' + ICON.cal + ' <span>Registered: <strong>' + esc(b.registered) + '</strong></span></div>' +
          '</div>' +
          '<div>' +
            '<div class="p-block"><div class="p-label">Contact Number</div><div class="p-value p-inline">' + ICON.phone + esc(b.contact) + '</div></div>' +
            '<div class="p-block"><div class="p-label">Email Address</div><div class="p-value normal p-inline">' + ICON.mail + (b.email ? esc(b.email) : 'Not provided') + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="det-heading">' + ICON.chart + ' Borrowing Summary &amp; Custody History</div>' +
      '<div class="summary-grid">' +
        '<div class="summary-box"><div class="s-label">Total Borrowings</div><div class="s-num">' + (b.items.length + b.completed) + '</div><div class="s-sub">Approved transactions</div></div>' +
        '<div class="summary-box"><div class="s-label">Currently Borrowed</div><div class="s-num">' + units + '<small>items</small></div><div class="s-sub">' + b.items.length + ' active borrowed' + (b.items.length ? ' (' + b.items.map(function (it) { return it.name.split(' ').pop(); }).join(' &amp; ') + ')' : '') + '</div></div>' +
        '<div class="summary-box"><div class="s-label">Completed</div><div class="s-num">' + b.completed + '</div><div class="s-sub">' + (b.completed ? '100% returned on time' : 'No returns yet') + '</div></div>' +
        '<div class="summary-box shade"><div class="s-label">Outstanding Returns</div><div class="s-num' + (overdueCount ? ' red' : '') + '">' + overdueCount + '<small>overdue</small></div><div class="s-sub">' + esc(outstandingSub) + '</div></div>' +
      '</div>' +

      '<div class="det-heading">' + ICON.ledger + ' Equipment Custody Ledger</div>' +
      '<div class="ledger">' + ledgerRows + '</div>' +

      '<div class="custodian-strip">' + ICON.shield + ' Recorded Custodian: Solana Rodrigo (Barangay Property Officer)</div>';

    openModal('detailsModalBackdrop');
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  renderList();
  renderDetailPanel();
})();