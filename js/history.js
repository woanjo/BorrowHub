(function () {
  'use strict';

  const STORAGE_KEY = 'borrowhub_history_records';
  const state = {
    page: 1,
    pageSize: 6,
    search: '',
    month: '2026-10',
    status: 'All'
  };

  const defaultRecords = [
    {
      name: 'Elena Bautista',
      contact: '0920-777-8899 • Purok 4, Barangay Bulacao',
      purok: 'Purok 4',
      equipment: '20 Foldable Chairs',
      items: [{ name: 'Foldable Chairs (Steel Frame)', description: 'Foldable Steel Chairs', quantity: 20, quantityReturned: 20, unit: 'pcs', condition: 'Good' }],
      borrowedAt: 'Oct 25, 2026 • 08:30 AM',
      dueDate: 'Oct 28, 2026',
      dueTime: '05:00 PM',
      actualReturn: 'Oct 28, 2026 • 03:30 PM (On Time)',
      statusDetail: 'Returned On-Time',
      condition: 'Good (Inspected & Verified)',
      notes: 'Returned in good condition.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      transactionId: 'TRX-2026-0892',
      sku: 'BC-2023-014',
      monthKey: '2026-10'
    },
    {
      name: 'Mark Alcantara',
      contact: '0917-875-2246 • Purok 1, Barangay Bulacao',
      purok: 'Purok 1',
      equipment: '6 Molten Basketballs & Scoreboard',
      items: [{ name: 'Molten Basketballs & Scoreboard', quantity: 6, quantityReturned: 6, unit: 'items', condition: 'Good' }],
      borrowedAt: 'Oct 12, 2026 • 09:00 AM',
      dueDate: 'Oct 14, 2026',
      dueTime: '05:00 PM',
      actualReturn: 'Oct 14, 2026 • 03:30 PM (On Time)',
      statusDetail: 'Returned On-Time',
      condition: 'Good (Inspected & Verified)',
      notes: 'No damage or missing units recorded.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      transactionId: 'TRX-2026-0881',
      monthKey: '2026-10'
    },
    {
      name: 'Pedro Mendoza',
      contact: '0906-234-1190 • Purok 1, Barangay Bulacao',
      purok: 'Purok 1',
      equipment: '30 Monobloc Chairs & 3 Tables',
      items: [{ name: 'Monobloc Chairs & Tables', quantity: 33, quantityReturned: 33, unit: 'items', condition: 'Good' }],
      borrowedAt: 'Oct 8, 2026 • 10:00 AM',
      dueDate: 'Oct 11, 2026',
      dueTime: '05:00 PM',
      actualReturn: 'Oct 11, 2026 • 04:10 PM',
      statusDetail: 'Returned On-Time',
      condition: 'Good (Inspected & Verified)',
      notes: 'All items accounted for.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      transactionId: 'TRX-2026-0874',
      monthKey: '2026-10'
    },
    {
      name: 'Dra. Corazon Aquino',
      contact: 'Purok 2, Barangay Bulacao',
      purok: 'Purok 2',
      equipment: '3 Canopy Tents (10x15)',
      items: [{ name: 'Canopy Tents (10x15)', quantity: 3, quantityReturned: 3, unit: 'pcs', condition: 'Good' }],
      borrowedAt: 'Oct 8, 2026 • 08:30 AM',
      dueDate: 'Oct 10, 2026',
      dueTime: '05:00 PM',
      actualReturn: 'Oct 10, 2026 • 03:30 PM',
      statusDetail: 'Returned On-Time',
      condition: 'Good (Inspected & Verified)',
      notes: 'Inspected and cleared for restocking.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      transactionId: 'TRX-2026-0862',
      monthKey: '2026-10'
    },
    {
      name: 'Zone 2 Homeowners Assn.',
      contact: 'Purok 2, Barangay Bulacao',
      purok: 'Purok 2',
      equipment: '40 Monobloc Chairs & Sound System',
      items: [{ name: 'Monobloc Chairs & Sound System', quantity: 41, quantityReturned: 40, unit: 'items', condition: 'Missing' }],
      borrowedAt: 'Oct 6, 2026 • 09:00 AM',
      dueDate: 'Oct 9, 2026',
      dueTime: '05:00 PM',
      actualReturn: 'Oct 10, 2026 • 10:30 AM',
      statusDetail: 'Returned Late',
      condition: 'Incomplete Return',
      notes: 'One unit remains missing and requires follow-up.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      transactionId: 'TRX-2026-0855',
      monthKey: '2026-10'
    },
    {
      name: 'Eduardo Ramos',
      contact: '0918-333-9876 • Purok 5, Barangay Bulacao',
      purok: 'Purok 5',
      equipment: '1 Gasoline Generator',
      items: [{ name: 'Gasoline Generator', quantity: 1, quantityReturned: 1, unit: 'unit', condition: 'Good' }],
      borrowedAt: 'Oct 4, 2026 • 08:30 AM',
      dueDate: 'Oct 5, 2026',
      dueTime: '05:00 PM',
      actualReturn: 'Oct 5, 2026 • 03:30 PM (On Time)',
      statusDetail: 'Returned On-Time',
      condition: 'Good (Inspected & Verified)',
      notes: 'Generator inspected and cleared for use.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      transactionId: 'TRX-2026-0841',
      monthKey: '2026-10'
    }
  ];

  function readStorage() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }

  const stored = readStorage();
  const records = Array.isArray(stored) && stored.length
    ? stored.concat(defaultRecords.filter(defaultRecord => !stored.some(storedRecord =>
      storedRecord.transactionId === defaultRecord.transactionId || storedRecord.name === defaultRecord.name)))
    : defaultRecords.slice();

  const tableBody = document.getElementById('historyTableBody');
  const searchInput = document.getElementById('historySearch');
  const monthSelect = document.getElementById('historyMonth');
  const statusTabs = Array.from(document.querySelectorAll('.history-status-tab'));
  const modalBackdrop = document.getElementById('historyModalBackdrop');

  function syncModalOffset() {
    const navbar = document.querySelector('.navbar-wrapper');
    document.documentElement.style.setProperty('--history-navbar-height', navbar.offsetHeight + 'px');
  }

  function lockPageScroll() {
    document.body.classList.add('modal-open');
  }

  function unlockPageScroll() {
    document.body.classList.remove('modal-open');
  }

  syncModalOffset();
  window.addEventListener('resize', syncModalOffset);
  state.month = monthSelect.value;

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function getMonthKey(record) {
    if (record.monthKey) return record.monthKey;
    const match = String(record.actualReturn || '').match(/(Oct(?:ober)?|Nov(?:ember)?)\s+\d+,\s+2026/i);
    if (!match) return 'All';
    return match[1].toLowerCase().indexOf('oct') === 0 ? '2026-10' : '2026-11';
  }

  function getFilteredRecords() {
    return records.filter(record => {
      const searchText = [record.name, record.contact, record.equipment, record.transactionId].join(' ').toLowerCase();
      const statusMatches = state.status === 'All'
        || (state.status === 'Returned' && record.statusDetail !== 'Returned Late')
        || (state.status === 'Returned Late' && record.statusDetail === 'Returned Late');
      return searchText.includes(state.search)
        && (state.month === 'All' || getMonthKey(record) === state.month)
        && statusMatches;
    });
  }

  function renderCounts() {
    document.getElementById('totalTransactionCount').textContent = '642';
    document.getElementById('completedReturnCount').textContent = '628';
  }

  function renderRows(page) {
    renderCounts();
    const filtered = getFilteredRecords();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(page || state.page, totalPages);
    const start = (state.page - 1) * state.pageSize;
    const visible = filtered.slice(start, start + state.pageSize);

    tableBody.innerHTML = visible.map(record => {
      const late = record.statusDetail === 'Returned Late';
      const equipmentItems = record.items && record.items.length
        ? record.items.map(item => item.name).join(', ')
        : record.equipment;
      return `
        <tr>
          <td><div class="td-borrower-name">${escapeHTML(record.name)}</div><div class="td-borrower-sub">- ${escapeHTML(record.purok || '')}</div></td>
          <td class="td-equipment">${escapeHTML(record.equipment || equipmentItems)}</td>
          <td class="td-date">${escapeHTML((record.borrowedAt || '').split(' • ')[0])}</td>
          <td class="td-date">${escapeHTML(record.dueDate || '')}</td>
          <td class="td-due-date ${late ? 'bold-red' : ''}">${escapeHTML((record.actualReturn || '').split(' • ')[0])}</td>
          <td><span class="status-badge ${late ? 'history-late' : 'green'}"><span class="status-dot"></span>${escapeHTML(late ? 'Returned Late' : 'Returned')}</span></td>
          <td class="history-action-cell"><button type="button" class="history-view-btn" data-history-id="${escapeHTML(record.transactionId || record.name)}">View<br>Details</button></td>
        </tr>`;
    }).join('');

    document.getElementById('historyEmpty').classList.toggle('visible', !visible.length);
    document.getElementById('historyPaginationSummary').textContent = filtered.length
      ? 'Showing ' + (start + 1) + ' - ' + Math.min(start + state.pageSize, filtered.length) + ' of ' + filtered.length + ' records'
      : 'Showing 0 records';
    document.getElementById('historyPageIndicator').textContent = 'Page ' + state.page + ' of ' + totalPages;
    document.getElementById('historyPrevBtn').disabled = state.page <= 1;
    document.getElementById('historyNextBtn').disabled = state.page >= totalPages;
  }

  function findRecord(id) {
    return records.find(record => String(record.transactionId || record.name) === id);
  }

  function openDetails(id) {
    const record = findRecord(id);
    if (!record) return;
    document.getElementById('historyModalReference').textContent = 'Transaction ID: ' + (record.transactionId || 'Not assigned') + ' • ' + (record.statusDetail || 'Returned');
    document.getElementById('historyDetailName').textContent = record.name;
    document.getElementById('historyDetailContact').textContent = record.contact;
    document.getElementById('historyDetailBorrowed').textContent = record.borrowedAt || 'Not recorded';
    document.getElementById('historyDetailExpected').textContent = record.dueDate + ' • ' + (record.dueTime || '');
    document.getElementById('historyDetailActual').textContent = record.actualReturn || 'Not recorded';
    document.getElementById('historyDetailCondition').textContent = record.condition || 'Good (Inspected & Verified)';
    document.getElementById('historyDetailStaff').textContent = (record.staffName || 'Solana Rodrigo') + ' (' + (record.staffRole || 'Barangay Staff') + ')';
    document.getElementById('historyDetailNotes').textContent = record.notes || 'No additional inspection remarks.';

    const items = record.items && record.items.length ? record.items : [{
      name: record.equipment,
      quantityReturned: record.quantity || 1,
      unit: 'item',
      condition: 'Good'
    }];
    document.getElementById('historyDetailItems').innerHTML = items.map(item => `
      <div class="history-item">
        <div><strong>${escapeHTML(item.name)}</strong>${item.description ? '<br><span>' + escapeHTML(item.description) + '</span>' : ''}</div>
        <strong>${escapeHTML(item.quantityReturned != null ? item.quantityReturned : item.quantity)} <span>${escapeHTML(item.unit || 'units')}</span></strong>
      </div>`).join('');

    modalBackdrop.classList.add('active');
    lockPageScroll();
    document.getElementById('historyModalCloseFooter').focus();
  }

  function closeDetails() {
    modalBackdrop.classList.remove('active');
    unlockPageScroll();
  }

  tableBody.addEventListener('click', event => {
    const button = event.target.closest('[data-history-id]');
    if (button) openDetails(button.dataset.historyId);
  });
  document.getElementById('historyModalClose').addEventListener('click', closeDetails);
  document.getElementById('historyModalCloseFooter').addEventListener('click', closeDetails);
  modalBackdrop.addEventListener('click', event => {
    if (event.target === modalBackdrop) closeDetails();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modalBackdrop.classList.contains('active')) closeDetails();
  });

  searchInput.addEventListener('input', function () {
    state.search = this.value.trim().toLowerCase();
    state.page = 1;
    renderRows(1);
  });
  monthSelect.addEventListener('change', function () {
    state.month = this.value;
    state.page = 1;
    renderRows(1);
  });
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      state.status = tab.dataset.status;
      state.page = 1;
      statusTabs.forEach(item => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      renderRows(1);
    });
  });
  document.getElementById('historyPrevBtn').addEventListener('click', function () {
    if (state.page > 1) {
      renderRows(state.page - 1);
    }
  });
  document.getElementById('historyNextBtn').addEventListener('click', function () {
    const totalPages = Math.ceil(getFilteredRecords().length / state.pageSize);
    if (state.page < totalPages) {
      renderRows(state.page + 1);
    }
  });

  const mobileMenuButton = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  mobileMenuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    mobileMenuButton.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('logoutBtn').addEventListener('click', function () {
    try {
      window.sessionStorage.removeItem('borrowhub_session');
      window.localStorage.removeItem('borrowhub_session');
    } catch (error) {}
    window.location.href = 'login.html';
  });

  const adminDropdownWrapper = document.getElementById('adminDropdownWrapper');
  const adminDropdownButton = document.getElementById('adminDropdownBtn');
  const restrictedOverlay = document.getElementById('restrictedOverlay');
  const closeRestricted = document.getElementById('closeRestricted');
  const isAdmin = (document.body.dataset.role || '').trim().toLowerCase() === 'admin';

  function hideRestrictedModal() {
    if (restrictedOverlay) restrictedOverlay.classList.add('hidden');
  }

  if (adminDropdownWrapper && adminDropdownButton) {
    adminDropdownButton.addEventListener('click', () => {
      if (!isAdmin) {
        adminDropdownWrapper.classList.remove('open');
        adminDropdownButton.setAttribute('aria-expanded', 'false');
        if (restrictedOverlay) restrictedOverlay.classList.remove('hidden');
        return;
      }
      const open = adminDropdownWrapper.classList.toggle('open');
      adminDropdownButton.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', event => {
      if (!adminDropdownWrapper.contains(event.target)) {
        adminDropdownWrapper.classList.remove('open');
        adminDropdownButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('click', event => {
    if (navLinks && mobileMenuButton && !event.target.closest('.navbar')) {
      navLinks.classList.remove('mobile-open');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  });

  if (closeRestricted) closeRestricted.addEventListener('click', hideRestrictedModal);
  if (restrictedOverlay) {
    restrictedOverlay.addEventListener('click', event => {
      if (event.target === restrictedOverlay) hideRestrictedModal();
    });
  }

  renderRows(1);
}());