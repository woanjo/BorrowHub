(function () {
  'use strict';

  let transactionsList = [];
  let overdueList = [];
  let categoryStatsList = [];

  let currentPage = 1;
  const pageSize = 5;

  const tbody = document.getElementById('transactionsBody');
  const summaryEl = document.getElementById('paginationSummary');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  const overdueListContainer = document.getElementById('overdueListContainer');
  const overduePanelCount = document.getElementById('overduePanelCount');
  const categoryAvailabilityList = document.getElementById('categoryAvailabilityList');

  function escapeHTML(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Update the Top 5 KPI Summary Cards
  function updateKPIs(kpis) {
    const total = Number(kpis.totalEquipment ?? 0);
    const available = Number(kpis.availableEquipment ?? 0);
    const borrowed = Number(kpis.borrowedEquipment ?? 0);
    const maintenance = Number(kpis.maintenanceEquipment ?? 0);
    const overdue = Number(kpis.overdueReturns ?? 0);

    const operationalRate = total > 0 ? Math.round((available / total) * 100) : 0;

    const elTotal = document.getElementById('kpiTotalEquipment');
    const elAvail = document.getElementById('kpiAvailableEquipment');
    const elRate = document.getElementById('kpiOperationalRate');
    const elBorrowed = document.getElementById('kpiBorrowedEquipment');
    const elMaint = document.getElementById('kpiMaintenanceEquipment');
    const elOverdue = document.getElementById('kpiOverdueReturns');
    const elActionPill = document.getElementById('kpiActionPill');

    if (elTotal) elTotal.textContent = total;
    if (elAvail) elAvail.textContent = available;
    if (elRate) elRate.textContent = `${operationalRate}% operational`;
    if (elBorrowed) elBorrowed.textContent = borrowed;
    if (elMaint) elMaint.textContent = maintenance;
    if (elOverdue) elOverdue.textContent = overdue;
    if (elActionPill) {
      elActionPill.style.display = overdue > 0 ? 'inline-block' : 'none';
    }
  }

  function renderOverdueList() {
    if (!overdueListContainer) return;
    if (overduePanelCount) overduePanelCount.textContent = overdueList.length;

    if (overdueList.length === 0) {
      overdueListContainer.style.justifyContent = 'center';
      overdueListContainer.innerHTML = `<div class="empty-panel-msg" style="padding: 36px 24px; color: var(--text-muted); font-size: 13.5px; text-align: center;">No overdue borrowings found.</div>`;
      return;
    }

    overdueListContainer.style.justifyContent = 'flex-start';
    overdueListContainer.innerHTML = overdueList.map(item => `
      <div class="overdue-item">
        <div class="overdue-item-top">
          <span class="borrower-name">${escapeHTML(item.borrowerName)}</span>
          <span class="status-badge overdue"><span class="status-dot"></span>Overdue</span>
        </div>
        <div class="overdue-org">${escapeHTML(item.organization || '')}</div>
        <div class="overdue-equip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="4" rx="1"/>
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
            <path d="M10 12h4"/>
          </svg>
          <span>${escapeHTML(item.equipment)}</span>
        </div>
        <div class="overdue-due">${escapeHTML(item.dueLabel)}</div>
      </div>
    `).join('');
  }

  function renderCategoryAvailability() {
    if (!categoryAvailabilityList) return;

    if (categoryStatsList.length === 0) {
      categoryAvailabilityList.style.justifyContent = 'center';
      categoryAvailabilityList.innerHTML = `<div class="empty-panel-msg" style="padding: 36px 24px; color: var(--text-muted); font-size: 13.5px; text-align: center;">No category inventory data available.</div>`;
      return;
    }

    categoryAvailabilityList.style.justifyContent = 'flex-start';
    categoryAvailabilityList.innerHTML = categoryStatsList.map(cat => {
      const pct = cat.total > 0 ? Math.round((cat.available / cat.total) * 10000) / 100 : 0;
      return `
        <div class="category-item">
          <div class="category-meta">
            <span class="category-name">${escapeHTML(cat.name)}</span>
            <span class="category-stats"><strong>${cat.available} / ${cat.total} units</strong> (${pct}% available)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTransactions(page) {
    const totalRecords = transactionsList.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    if (page > totalPages) page = totalPages;
    currentPage = page;

    if (totalRecords === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding: 28px; color: var(--text-muted);">No borrowing transactions recorded yet.</td>
        </tr>
      `;
      summaryEl.innerHTML = `Showing <strong>0</strong> of 0 Borrowers`;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const startIdx = (page - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, totalRecords);
    const rows = transactionsList.slice(startIdx, endIdx);

    tbody.innerHTML = rows.map(row => {
      const dueClass =
        row.dueStyle === 'bold-red'
          ? 'td-due-date bold-red'
          : row.dueStyle === 'bold-dark'
          ? 'td-due-date bold-dark'
          : 'td-due-date';

      return `
        <tr class="${row.isOverdueRow ? 'row-overdue' : ''}">
          <td>
            <div class="td-borrower-name">${escapeHTML(row.name)}</div>
            <div class="td-borrower-sub">${escapeHTML(row.subtext || '')}</div>
          </td>
          <td class="td-equipment">${escapeHTML(row.equipment)}</td>
          <td class="td-date">${escapeHTML(row.dateBorrowed)}</td>
          <td class="${dueClass}">${escapeHTML(row.dueDate)}</td>
          <td>
            <span class="status-badge ${escapeHTML(row.badgeType)}">
              <span class="status-dot"></span>${escapeHTML(row.status)}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    summaryEl.innerHTML = `Showing <strong>${startIdx + 1} - ${endIdx}</strong> of ${totalRecords} Borrowers`;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        renderTransactions(currentPage - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.max(1, Math.ceil(transactionsList.length / pageSize));
      if (currentPage < totalPages) {
        renderTransactions(currentPage + 1);
      }
    });
  }

  // Administration Access Restriction
  const adminWrapper = document.getElementById('adminDropdownWrapper');
  const adminBtn = document.getElementById('adminDropdownBtn');
  const restrictedOverlay = document.getElementById('restrictedOverlay');
  const closeRestricted = document.getElementById('closeRestricted');

  const accountRole = (document.body.dataset.role || '').trim().toLowerCase();
  const isAdmin = accountRole === 'admin';

  function showRestrictedModal() {
    if (restrictedOverlay) {
      restrictedOverlay.classList.remove('hidden');
    }
  }

  function hideRestrictedModal() {
    if (restrictedOverlay) {
      restrictedOverlay.classList.add('hidden');
    }
  }

  if (adminBtn && adminWrapper) {
    adminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAdmin) {
        adminWrapper.classList.remove('open');
        adminBtn.setAttribute('aria-expanded', 'false');
        showRestrictedModal();
        return;
      }

      const isOpen = adminWrapper.classList.toggle('open');
      adminBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (closeRestricted) {
    closeRestricted.addEventListener('click', hideRestrictedModal);
  }

  if (restrictedOverlay) {
    restrictedOverlay.addEventListener('click', (e) => {
      if (e.target === restrictedOverlay) {
        hideRestrictedModal();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (adminWrapper && !adminWrapper.contains(e.target)) {
      adminWrapper.classList.remove('open');
      if (adminBtn) {
        adminBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // Toast notification helper
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      <span>${escapeHTML(message)}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  // Fetch live dashboard metrics and lists from PHP backend
  async function loadDashboardData() {
    try {
      const response = await fetch('php/dashboard.php');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load dashboard data.');
      }

      if (data.kpis) {
        updateKPIs(data.kpis);
      }

      categoryStatsList = Array.isArray(data.categories) ? data.categories : [];
      overdueList = Array.isArray(data.overdue) ? data.overdue : [];
      transactionsList = Array.isArray(data.transactions) ? data.transactions : [];

      renderOverdueList();
      renderCategoryAvailability();
      renderTransactions(1);
    } catch (err) {
      console.error(err);
      showToast(err.message);
      renderOverdueList();
      renderCategoryAvailability();
      renderTransactions(1);
    }
  }

  // Load live data on page start
  loadDashboardData();
})();