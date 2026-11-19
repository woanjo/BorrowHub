/* ==========================================================================
   Barangay BorrowHub - Borrower Page Logic (Aligned with Equipment Style)
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

  function fmtFull(date) {
    return MONTHS_FULL[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function statusClass(s) {
    if (s === 'Good Standing') return 'good';
    if (s === 'Overdue') return 'overdue';
    return 'warn';
  }

  function streetShort(street) {
    return (street || '').replace(/,\s*Barangay Bulacao\s*$/i, '');
  }

  var ICON = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    pencilSm: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex-shrink:0;"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>'
  };

  /* ------------------------------------------------------------------
     Seed Data (Maria Santos & Eduardo Ramos only)
     ------------------------------------------------------------------ */
  var HISTORY_POOL = [
    { date: 'Jan 12, 2026', items: '1 Megaphone', status: 'Returned' },
    { date: 'Mar 08, 2026', items: '2 Folding Tables', status: 'Returned' },
    { date: 'May 20, 2026', items: '1 Canopy (10\u00d710)', status: 'Returned' },
    { date: 'Jul 15, 2026', items: '1 Sound System', status: 'Returned' },
    { date: 'Sept 04, 2026', items: '30 Chairs', status: 'Returned' }
  ];

  function mkItem(name, units, dueInDays) {
    return { name: name, units: units, dueInDays: dueInDays };
  }

  function totalUnits(b) {
    return (b.items || []).reduce(function (s, it) { return s + it.units; }, 0);
  }

  function buildSeed() {
    var list = [
      {
        name: 'Maria Santos',
        contact: '0928-444-5678',
        email: 'msantos@gmail.com',
        purok: 2,
        street: '#14 Sampaguita St., Barangay Bulacao',
        status: 'Good Standing',
        registered: 'January 09, 2026',
        completed: 5,
        items: [
          mkItem('Stackable Monobloc Chairs', 40, 2),
          mkItem('Folding Catering Tables', 4, 2)
        ],
        history: HISTORY_POOL.slice(0, 3)
      },
      {
        name: 'Eduardo Ramos',
        contact: '0918-333-9876',
        email: '',
        purok: 3,
        street: '#21 Gumamela St., Barangay Bulacao',
        status: 'Overdue',
        registered: 'February 14, 2026',
        completed: 2,
        items: [mkItem('Folding Catering Tables', 2, -3)],
        history: HISTORY_POOL.slice(3)
      }
    ];

    list.forEach(function (b, idx) {
      b.key = 'b' + idx;
      b.id = 'BRG-BOR-2025-' + pad(idx + 1, 4);
    });
    return list;
  }

  var borrowers = buildSeed();
  var nextSeq = 82;
  var keyCounter = borrowers.length;
  var state = { page: 1, search: '', purok: 'All', status: 'All', selected: borrowers[0].key };

  // Administration Access Restriction
const adminWrapper = document.getElementById('adminDropdownWrapper');
const adminBtn = document.getElementById('adminDropdownBtn');

const restrictedOverlay = document.getElementById('restrictedOverlay');
const closeRestricted = document.getElementById('closeRestricted');

// Get the authenticated account role from the HTML body
const accountRole = (
    document.body.dataset.role || ''
).trim().toLowerCase();

// Check whether the account is an administrator
const isAdmin = accountRole === 'admin';

// Display the restriction modal
function showRestrictedModal() {
    if (restrictedOverlay) {
        restrictedOverlay.classList.remove('hidden');
    }
}

// Close the restriction modal
function hideRestrictedModal() {
    if (restrictedOverlay) {
        restrictedOverlay.classList.add('hidden');
    }
}

// Administration dropdown click
if (adminBtn && adminWrapper) {
    adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Staff accounts cannot access Administration
        if (!isAdmin) {
            adminWrapper.classList.remove('open');
            adminBtn.setAttribute('aria-expanded', 'false');

            showRestrictedModal();
            return;
        }

        // Admin accounts can access Administration
        const isOpen = adminWrapper.classList.toggle('open');

        adminBtn.setAttribute(
            'aria-expanded',
            String(isOpen)
        );
    });
}

// Close restriction modal using the Close button
if (closeRestricted) {
    closeRestricted.addEventListener('click', hideRestrictedModal);
}

// Close restriction modal when clicking outside the card
if (restrictedOverlay) {
    restrictedOverlay.addEventListener('click', (e) => {
        if (e.target === restrictedOverlay) {
            hideRestrictedModal();
        }
    });
}

// Close Administration dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (
        adminWrapper &&
        !adminWrapper.contains(e.target)
    ) {
        adminWrapper.classList.remove('open');

        if (adminBtn) {
            adminBtn.setAttribute('aria-expanded', 'false');
        }
    }
});

  /* ------------------------------------------------------------------
     Toast Helper
     ------------------------------------------------------------------ */
  function toast(msg, type) {
    var c = $('#toastContainer');
    if (!c) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex-shrink:0;">' +
        '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>' +
      '</svg>' +
      '<span>' + esc(msg) + '</span>';
    c.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
    }, 2800);
  }

  $$('[data-toast]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toast(btn.getAttribute('data-toast'));
    });
  });

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
      body.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:36px;color:var(--text-muted);">No borrowers match your search or filters.</td></tr>';
    } else {
      body.innerHTML = pageRows.map(function (b) {
        var units = totalUnits(b);
        var itemsText = units === 0 ? 'None' : units + (units === 1 ? ' item' : ' items');
        var isSelected = b.key === state.selected ? ' selected' : '';
        var avCls = b.status === 'Overdue' ? ' av-red' : '';

        return '<tr data-key="' + b.key + '" class="' + isSelected + '">' +
          '<td><div class="b-name"><span class="avatar' + avCls + '">' + esc(initials(b.name)) + '</span><span class="name-text">' + esc(b.name) + '</span></div></td>' +
          '<td class="td-contact">' + esc(b.contact) + '</td>' +
          '<td>Purok ' + b.purok + '</td>' +
          '<td style="text-align:center;font-weight:600;">' + esc(itemsText) + '</td>' +
          '<td><span class="status-pill ' + statusClass(b.status) + '">' + esc(b.status) + '</span></td>' +
          '<td style="text-align:right;"><div class="row-actions">' +
            '<button type="button" class="icon-btn" data-action="view" aria-label="Select ' + esc(b.name) + '" title="View in side panel">' + ICON.eye + '</button>' +
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

    var html = '<button type="button" class="page-btn" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + '>Prev</button>';
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

      if (actionBtn && actionBtn.getAttribute('data-action') === 'edit') {
        var b = findByKey(key);
        if (b) openEdit(b);
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
    var b = findByKey(state.selected);
    var panel = $('#detailPanel');
    if (!panel) return;

    if (!b) {
      panel.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:24px;">Select a borrower to view borrowing details.</div>';
      return;
    }

    var units = totalUnits(b);
    var itemsHtml = b.items.length
      ? b.items.map(function (it) {
          var overdue = it.dueInDays < 0;
          return '<div class="held-item">' +
            '<div class="held-icon">' + ICON.box + '</div>' +
            '<div class="held-text">' +
              '<div class="held-name">' + esc(it.name) + '</div>' +
              '<div class="held-units">' + it.units + (it.units === 1 ? ' Unit' : ' Units') + (overdue ? ' \u2022 Overdue' : '') + '</div>' +
            '</div>' +
            '<span class="status-pill ' + (overdue ? 'overdue' : 'good') + '">' + (overdue ? 'Overdue' : 'Active') + '</span>' +
          '</div>';
        }).join('')
      : '<div style="background:#f6faf8;border-radius:8px;padding:14px;text-align:center;color:var(--text-muted);font-size:12.5px;">No items currently borrowed.</div>';

    panel.innerHTML =
      '<div class="dp-head">' +
        '<div class="dp-avatar">' + esc(initials(b.name)) + '</div>' +
        '<div class="dp-head-text">' +
          '<div class="dp-name">' + esc(b.name) + '</div>' +
          '<div class="dp-role">' + esc(b.id) + ' &bull; Resident Borrower</div>' +
        '</div>' +
        '<span class="status-pill ' + statusClass(b.status) + '">' + esc(b.status) + '</span>' +
      '</div>' +
      '<div class="dp-info-grid">' +
        '<div><div class="dp-info-label">Contact</div><div class="dp-info-value">' + esc(b.contact) + '</div></div>' +
        '<div><div class="dp-info-label">Address</div><div class="dp-info-value">Purok ' + b.purok + ', ' + esc(streetShort(b.street)) + '</div></div>' +
        '<div><div class="dp-info-label">Active Items</div><div class="dp-info-value">' + units + (units === 1 ? ' item' : ' items') + '</div></div>' +
        '<div><div class="dp-info-label">Completed</div><div class="dp-info-value">' + b.completed + ' returned</div></div>' +
      '</div>' +
      '<div class="dp-section-head"><span>ACTIVE ITEMS HELD</span><span>' + b.items.length + ' loan(s)</span></div>' +
      itemsHtml +
      '<button type="button" class="btn-edit-borrower" id="panelEditBtn">' + ICON.pencilSm + '<span>Edit Borrower</span></button>';

    var editBtn = $('#panelEditBtn');
    if (editBtn) {
      editBtn.addEventListener('click', function () { openEdit(b); });
    }
  }

  /* ------------------------------------------------------------------
     Modal Open / Close & Forms
     ------------------------------------------------------------------ */
  function openModal(id) {
    var m = $('#' + id);
    if (!m) return;
    m.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeModal(id) {
    var m = $('#' + id);
    if (!m) return;
    m.classList.remove('open');
    if (!$('.modal-backdrop.open')) {
      document.body.classList.remove('modal-open');
    }
  }

  $$('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(btn.getAttribute('data-close-modal'));
    });
  });

  $$('.modal-backdrop').forEach(function (bd) {
    bd.addEventListener('mousedown', function (e) {
      if (e.target === bd) closeModal(bd.id);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      $$('.modal-backdrop.open').forEach(function (m) { closeModal(m.id); });
    }
  });

  function nextId() {
    return 'BRG-BOR-2026-' + pad(nextSeq, 4);
  }

  var openRegBtn = $('#openRegisterModalBtn');
  if (openRegBtn) {
    openRegBtn.addEventListener('click', function () {
      var form = $('#registerForm');
      if (form) form.reset();
      var idInput = $('#regId');
      if (idInput) idInput.value = nextId();
      var purokInput = $('#regPurok');
      if (purokInput) purokInput.value = '2';
      openModal('registerModalBackdrop');
      setTimeout(function () {
        var nameInput = $('#regName');
        if (nameInput) nameInput.focus();
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

      if (!nameVal || !contactVal || !streetVal) {
        toast('Please fill in all required borrower fields.', 'error');
        return;
      }

      var b = {
        key: 'b' + (keyCounter++),
        id: nextId(),
        name: nameVal,
        contact: contactVal,
        email: emailVal,
        purok: purokVal,
        street: streetVal,
        status: 'Good Standing',
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
    if ($('#editName')) $('#editName').value = b.name;
    if ($('#editContact')) $('#editContact').value = b.contact;
    if ($('#editPurok')) $('#editPurok').value = String(b.purok);
    if ($('#editStatus')) $('#editStatus').value = b.status;
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
      var purokVal = parseInt(($('#editPurok') && $('#editPurok').value) || String(b.purok), 10);
      var statusVal = ($('#editStatus') && $('#editStatus').value) || b.status;

      if (!nameVal || !contactVal) {
        toast('Name and contact number are required.', 'error');
        return;
      }

      b.name = nameVal;
      b.contact = contactVal;
      b.purok = purokVal;
      b.status = statusVal;

      closeModal('editModalBackdrop');
      renderList();
      renderDetailPanel();
      toast('Updated record for ' + b.name);
    });
  }

  renderList();
  renderDetailPanel();
})();