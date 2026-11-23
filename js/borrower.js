/* ==========================================================================
   Barangay BorrowHub - Borrower Page Logic (Empty Initial Data)
   ========================================================================== */
(function () {
  'use strict';

  var PAGE_SIZE = 6;
  var PUROKS = {
    1: 'Ilang-Ilang',
    2: 'Sampaguita',
    3: 'Gumamela',
    4: 'Santan',
    5: 'Rosal'
  };
  var MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad(n, len) {
    var s = String(n);
    while (s.length < len) s = '0' + s;
    return s;
  }

  function initials(name) {
    var parts = (name || '').trim().split(/\s+/);
    var a = parts[0] ? parts[0].charAt(0) : '';
    var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (a + b).toUpperCase() || 'BR';
  }

  function addDays(d) {
    var t = new Date();
    t.setDate(t.getDate() + d);
    return t;
  }

  function fmtShort(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function fmtFull(date) {
    return MONTHS_FULL[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

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

  function streetShort(street) {
    return (street || '').replace(/,\s*Barangay Bulacao\s*$/i, '');
  }

  function totalUnits(b) {
    return (b.items || []).reduce(function (s, it) { return s + it.units; }, 0);
  }

  var ICON = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    pencilSm: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;min-width:16px;max-width:16px;flex-shrink:0;"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
    idcard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M13 10h5"/><path d="M13 14h5"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 17v-5"/><path d="M12 17V8"/><path d="M16 17v-3"/></svg>',
    ledger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16v18l-3-2-3 2-2-2-2 2-3-2-3 2z"/><path d="M8 8h8"/><path d="M8 12h8"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    calCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  /* ------------------------------------------------------------------
     Empty initial state
     ------------------------------------------------------------------ */
  var borrowers = [];
  var nextSeq = 1;
  var keyCounter = 0;
  var state = { page: 1, search: '', purok: 'All', status: 'All', selected: null };

  /* ------------------------------------------------------------------
     Toasts
     ------------------------------------------------------------------ */
  function toast(msg, type) {
    var c = $('#toastContainer');
    if (!c) return;
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
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toast(btn.getAttribute('data-toast'));
    });
  });

  /* ------------------------------------------------------------------
     Navbar & Filter Dropdowns
     ------------------------------------------------------------------ */
  var adminWrap = $('#adminDropdownWrapper');
  var adminBtn = $('#adminDropdownBtn');
  if (adminBtn && adminWrap) {
    adminBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = adminWrap.classList.toggle('open');
      adminBtn.setAttribute('aria-expanded', String(open));
    });
  }

  var mobileBtn = $('#mobileMenuBtn');
  var navLinks = $('#navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
  }

  function setupFilterDropdown(wrapId, key) {
    var wrap = $('#' + wrapId);
    if (!wrap) return;
    var btn = $('.filter-dd-btn', wrap);
    var label = $('.filter-dd-label', wrap);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      $$('.filter-dd').forEach(function (o) { if (o !== wrap) o.classList.remove('open'); });
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });

    $$('.filter-opt', wrap).forEach(function (opt) {
      opt.addEventListener('click', function () {
        $$('.filter-opt', wrap).forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        if (label) label.textContent = opt.textContent;
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
    if (adminWrap && !e.target.closest('#adminDropdownWrapper')) {
      adminWrap.classList.remove('open');
      if (adminBtn) adminBtn.setAttribute('aria-expanded', 'false');
    }
    if (!e.target.closest('.filter-dd')) {
      $$('.filter-dd').forEach(function (o) { o.classList.remove('open'); });
    }
    if (navLinks && !e.target.closest('.navbar')) {
      navLinks.classList.remove('open');
    }
  });

  var searchInput = $('#searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.search = this.value.trim().toLowerCase();
      state.page = 1;
      renderList();
    });
  }

  /* ------------------------------------------------------------------
     Rendering KPIs, Table, Pagination & Detail Panel
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
    var totalEl = $('#kpiTotalValue');
    var activeEl = $('#kpiActiveValue');
    var overdueEl = $('#kpiOverdueValue');
    if (totalEl) totalEl.textContent = borrowers.length;
    if (activeEl) activeEl.textContent = borrowers.filter(function (b) { return b.items.length > 0; }).length;
    if (overdueEl) overdueEl.textContent = borrowers.filter(function (b) { return b.status === 'Overdue'; }).length;
  }

  function renderList() {
    var filtered = getFiltered();
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageRows = filtered.slice(start, start + PAGE_SIZE);

    var badge = $('#listedBadge');
    if (badge) badge.textContent = filtered.length + ' Listed';

    var body = $('#borrowerTableBody');
    if (!body) return;

    if (!pageRows.length) {
      var emptyMsg = borrowers.length === 0
        ? 'No borrowers registered yet. Click "Register Borrower" to add one.'
        : 'No borrowers match your search or filters.';
      body.innerHTML = '<tr class="empty-row"><td colspan="6">' + esc(emptyMsg) + '</td></tr>';
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

    var showingEl = $('#footerShowing');
    var pageEl = $('#footerPage');
    if (showingEl) showingEl.textContent = 'Showing ' + pageRows.length + ' of ' + filtered.length + ' Borrowers';
    if (pageEl) pageEl.textContent = 'Page ' + state.page + ' of ' + totalPages;

    renderPagination(totalPages);
    renderKpis();
  }

  function renderPagination(totalPages) {
    var wrap = $('#pagination');
    if (!wrap) return;
    var startPage = Math.max(1, Math.min(state.page - 1, totalPages - 2));
    var endPage = Math.min(totalPages, startPage + 2);

    var html = '<button type="button" class="page-btn" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + '>Previous</button>';
    for (var p = startPage; p <= endPage; p++) {
      html += '<button type="button" class="page-btn' + (p === state.page ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
    }
    html += '<button type="button" class="page-btn" data-page="' + (state.page + 1) + '"' + (state.page === totalPages ? ' disabled' : '') + '>Next</button>';
    wrap.innerHTML = html;
  }

  var paginationEl = $('#pagination');
  if (paginationEl) {
    paginationEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.page-btn');
      if (!btn || btn.disabled) return;
      state.page = parseInt(btn.getAttribute('data-page'), 10);
      renderList();
    });
  }

  var tableBodyEl = $('#borrowerTableBody');
  if (tableBodyEl) {
    tableBodyEl.addEventListener('click', function (e) {
      var row = e.target.closest('tr[data-key]');
      if (!row) return;
      var key = row.getAttribute('data-key');
      var actionBtn = e.target.closest('[data-action]');
      selectBorrower(key);

      if (actionBtn) {
        var b = findByKey(key);
        if (!b) return;
        if (actionBtn.getAttribute('data-action') === 'view') openDetails(b);
        else openEdit(b);
      }
    });
  }

  function findByKey(key) {
    for (var i = 0; i < borrowers.length; i++) {
      if (borrowers[i].key === key) return borrowers[i];
    }
    return null;
  }

  function selectBorrower(key) {
    state.selected = key;
    $$('#borrowerTableBody tr[data-key]').forEach(function (tr) {
      tr.classList.toggle('selected', tr.getAttribute('data-key') === key);
    });
    renderDetailPanel();
  }

  function renderDetailPanel() {
    var panel = $('#detailPanel');
    if (!panel) return;

    var b = findByKey(state.selected);
    if (!b) {
      panel.innerHTML = '<div class="held-empty">No borrower selected.</div>';
      return;
    }

    var units = totalUnits(b);
    var minDue = b.items.length ? Math.min.apply(null, b.items.map(function (it) { return it.dueInDays; })) : null;
    var dueLabel, dueCls = '';
    if (minDue === null) { dueLabel = 'No active loans'; dueCls = ' muted'; }
    else if (minDue < 0) { dueLabel = 'Overdue'; dueCls = ' red'; }
    else if (minDue <= 2) { dueLabel = 'Due Soon'; }
    else { dueLabel = 'On Schedule'; dueCls = ' muted'; }

    var itemsHtml = b.items.length
      ? b.items.map(function (it) {
          var overdue = it.dueInDays < 0;
          return '<div class="held-item">' +
            '<div class="held-icon">' + ICON.box + '</div>' +
            '<div class="held-text"><div class="held-name">' + esc(it.name) + '</div><div class="held-units">' + it.units + (it.units === 1 ? ' Unit' : ' Units') + '</div></div>' +
            '<span class="held-tag' + (overdue ? ' overdue' : '') + '">' + (overdue ? 'Overdue' : 'Active') + '</span>' +
          '</div>';
        }).join('')
      : '<div class="held-empty">No items currently borrowed.</div>';

    var recent = b.history.slice(-3);
    var historyHtml = recent.length
      ? '<div class="history-grid">' +
          '<div class="hh">DATE</div><div class="hh">ITEMS BORROWED</div><div class="hh">STATUS</div>' +
          recent.map(function (h) {
            return '<div class="hc date">' + esc(h.date) + '</div><div class="hc items">' + esc(h.items) + '</div><div class="hc status">' + esc(h.status) + '</div>';
          }).join('') +
        '</div>'
      : '<div class="history-empty">No borrowing history yet.</div>';

    panel.innerHTML =
      '<div class="dp-head">' +
        '<div class="dp-avatar">' + esc(initials(b.name)) + '</div>' +
        '<div class="dp-head-text"><div class="dp-name">' + esc(b.name) + '</div><div class="dp-role">' + esc(b.id) + ' &bull; Resident Borrower</div></div>' +
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

    var editBtn = $('#panelEditBtn');
    if (editBtn) {
      editBtn.addEventListener('click', function () { openEdit(b); });
    }
  }

  /* ------------------------------------------------------------------
     Modals & Forms
     ------------------------------------------------------------------ */
  function openModal(id) {
    var m = $('#' + id);
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    var m = $('#' + id);
    if (!m) return;
    m.classList.remove('open');
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

  var PHONE_RE = /^09\d{2}-?\d{3}-?\d{4}$/;
  function normalizePhone(v) {
    var d = v.replace(/\D/g, '');
    return d.length >= 11 ? d.slice(0, 4) + '-' + d.slice(4, 7) + '-' + d.slice(7, 11) : v.trim();
  }

  function nextId() {
    return 'BRG-BOR-2026-' + pad(nextSeq, 4);
  }

  var openRegBtn = $('#openRegisterModalBtn');
  if (openRegBtn) {
    openRegBtn.addEventListener('click', function () {
      var form = $('#registerForm');
      if (form) form.reset();
      if ($('#regId')) $('#regId').value = nextId();
      if ($('#regPurok')) $('#regPurok').value = '2';
      if ($('#regCertify')) $('#regCertify').checked = true;
      openModal('registerModalBackdrop');
      setTimeout(function () {
        if ($('#regName')) $('#regName').focus();
      }, 60);
    });
  }

  var regForm = $('#registerForm');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameVal = ($('#regName') && $('#regName').value || '').trim();
      var contactVal = ($('#regContact') && $('#regContact').value || '').trim();
      var emailVal = ($('#regEmail') && $('#regEmail').value || '').trim();
      var streetVal = ($('#regStreet') && $('#regStreet').value || '').trim();
      var purokVal = parseInt(($('#regPurok') && $('#regPurok').value) || '2', 10);
      var statusVal = ($('#regStatus') && $('#regStatus').value) || 'Good Standing';
      var proofVal = ($('#regProof') && $('#regProof').value) || 'Barangay ID';
      var certifyEl = $('#regCertify');

      if (!nameVal || !PHONE_RE.test(contactVal) || !streetVal || (certifyEl && !certifyEl.checked)) {
        toast('Please enter a valid name, contact number (09XX-XXX-XXXX), and address.', 'error');
        return;
      }

      var b = {
        key: 'b' + (keyCounter++),
        id: nextId(),
        name: nameVal,
        contact: normalizePhone(contactVal),
        email: emailVal,
        purok: purokVal,
        street: streetVal,
        status: statusVal,
        proof: proofVal,
        registered: fmtFull(new Date()),
        completed: 0,
        items: [],
        history: []
      };

      nextSeq++;
      borrowers.unshift(b);
      state.search = '';
      state.purok = 'All';
      state.status = 'All';
      state.page = 1;
      state.selected = b.key;

      if ($('#searchInput')) $('#searchInput').value = '';
      closeModal('registerModalBackdrop');
      renderList();
      renderDetailPanel();
      toast(b.name + ' registered as ' + b.id);
    });
  }

  function openEdit(b) {
    if ($('#editBorrowerKey')) $('#editBorrowerKey').value = b.key;
    if ($('#editHeaderId')) $('#editHeaderId').textContent = b.id;
    if ($('#editName')) $('#editName').value = b.name;
    if ($('#editId')) $('#editId').value = b.id;
    if ($('#editContact')) $('#editContact').value = b.contact;
    if ($('#editEmail')) $('#editEmail').value = b.email || '';
    if ($('#editStreet')) $('#editStreet').value = b.street || '';
    if ($('#editPurok')) $('#editPurok').value = String(b.purok);
    if ($('#editStatus')) $('#editStatus').value = b.status;

    var units = totalUnits(b);
    if ($('#editCustodyTag') && $('#editCustodyText') && $('#editCustodyDue')) {
      if (b.items.length) {
        var minDue = Math.min.apply(null, b.items.map(function (it) { return it.dueInDays; }));
        $('#editCustodyTag').textContent = minDue < 0 ? 'Overdue' : 'In Custody';
        $('#editCustodyText').textContent = b.items.length + ' Active Borrowed (' + units + ' items held)';
        $('#editCustodyDue').textContent = dueText(minDue);
      } else {
        $('#editCustodyTag').textContent = 'Clear';
        $('#editCustodyText').textContent = 'No active borrowings';
        $('#editCustodyDue').textContent = '';
      }
    }

    openModal('editModalBackdrop');
  }

  var editForm = $('#editForm');
  if (editForm) {
    editForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = $('#editBorrowerKey') ? $('#editBorrowerKey').value : '';
      var b = findByKey(key);
      if (!b) return;

      var nameVal = ($('#editName') && $('#editName').value || '').trim();
      var contactVal = ($('#editContact') && $('#editContact').value || '').trim();
      var emailVal = ($('#editEmail') && $('#editEmail').value || '').trim();
      var streetVal = ($('#editStreet') && $('#editStreet').value || '').trim();
      var purokVal = parseInt(($('#editPurok') && $('#editPurok').value) || String(b.purok), 10);
      var statusVal = ($('#editStatus') && $('#editStatus').value) || b.status;

      if (!nameVal || !PHONE_RE.test(contactVal)) {
        toast('Please enter a valid name and contact number.', 'error');
        return;
      }

      b.name = nameVal;
      b.contact = normalizePhone(contactVal);
      b.email = emailVal;
      if (streetVal) b.street = streetVal;
      b.purok = purokVal;
      b.status = statusVal;

      closeModal('editModalBackdrop');
      renderList();
      renderDetailPanel();
      toast('Updated record for ' + b.name);
    });
  }

  function openDetails(b) {
    var bodyEl = $('#detailsBody');
    if (!bodyEl) {
      openEdit(b);
      return;
    }

    var units = totalUnits(b);
    var overdueCount = b.items.filter(function (it) { return it.dueInDays < 0; }).length;
    var minDue = b.items.length ? Math.min.apply(null, b.items.map(function (it) { return it.dueInDays; })) : null;
    var sCls = statusClass(b.status);

    if ($('#detHeaderId')) $('#detHeaderId').textContent = b.id;
    if ($('#detVerifiedChip')) {
      $('#detVerifiedChip').innerHTML = ICON.check + ' Verified Resident &bull; ' + esc(b.status);
    }

    var standingText = b.status === 'Good Standing' ? 'Good Standing (Eligible to Borrow)' :
      b.status === 'Overdue' ? 'Overdue (Unreturned Items)' :
      b.status === 'Restricted' ? 'Restricted (Not Eligible)' : 'Suspended (Pending Review)';

    var outstandingSub = minDue === null ? 'No pending returns' :
      (minDue < 0 ? dueText(minDue) : 'Due ' + fmtShort(addDays(minDue)));

    bodyEl.innerHTML =
      '<div class="det-section">' +
        '<div class="det-section-title">' + ICON.idcard + ' Borrower Profile</div>' +
        '<div class="profile-grid">' +
          '<div class="profile-person">' +
            '<div class="profile-photo">' + esc(initials(b.name)) + '</div>' +
            '<div><div class="p-label">Full Legal Name</div><div class="p-value">' + esc(b.name) + '</div>' +
            '<span class="p-standing ' + (sCls === 'good' ? '' : sCls) + '">' + esc(standingText) + '</span></div>' +
          '</div>' +
          '<div>' +
            '<div class="p-block"><div class="p-label">Residential Address</div><div class="p-value normal">' + esc(streetShort(b.street)) + ', Purok ' + b.purok + '</div></div>' +
            '<div class="p-registered">' + ICON.cal + ' <span>Registered: <strong>' + esc(b.registered) + '</strong></span></div>' +
          '</div>' +
          '<div>' +
            '<div class="p-block"><div class="p-label">Contact Number</div><div class="p-value p-inline">' + ICON.phone + esc(b.contact) + '</div></div>' +
            '<div class="p-block"><div class="p-label">Email Address</div><div class="p-value normal p-inline">' + ICON.mail + (b.email ? esc(b.email) : 'Not provided') + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="det-heading">' + ICON.chart + ' Borrowing Summary</div>' +
      '<div class="summary-grid">' +
        '<div class="summary-box"><div class="s-label">Total Borrowings</div><div class="s-num">' + (b.items.length + b.completed) + '</div></div>' +
        '<div class="summary-box"><div class="s-label">Currently Borrowed</div><div class="s-num">' + units + '<small>items</small></div></div>' +
        '<div class="summary-box"><div class="s-label">Completed</div><div class="s-num">' + b.completed + '</div></div>' +
        '<div class="summary-box shade"><div class="s-label">Outstanding</div><div class="s-num' + (overdueCount ? ' red' : '') + '">' + overdueCount + '<small>overdue</small></div><div class="s-sub">' + esc(outstandingSub) + '</div></div>' +
      '</div>' +
      '<div class="custodian-strip">' + ICON.shield + ' Recorded Custodian: Solana Rodrigo (Barangay Property Officer)</div>';

    openModal('detailsModalBackdrop');
  }

  renderList();
  renderDetailPanel();
})();