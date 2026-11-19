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
  const paginationControls = document.getElementById('paginationControls');

  const overdueListContainer = document.getElementById('overdueListContainer');
  const overduePanelCount = document.getElementById('overduePanelCount');
  const categoryAvailabilityList = document.getElementById('categoryAvailabilityList');

  function renderOverdueList() {
    if (!overdueListContainer) return;
    if (overduePanelCount) overduePanelCount.textContent = overdueList.length;

    if (overdueList.length === 0) {
      overdueListContainer.innerHTML = `<div class="empty-panel-msg" style="padding: 16px 0; color: var(--text-muted); font-size: 13px;">No overdue borrowings found.</div>`;
      return;
    }

    overdueListContainer.innerHTML = overdueList.map(item => `
      <div class="overdue-item">
        <div class="overdue-item-top">
          <span class="borrower-name">${item.borrowerName}</span>
          <span class="status-badge overdue"><span class="status-dot"></span>Overdue</span>
        </div>
        <div class="overdue-org">${item.organization || ''}</div>
        <div class="overdue-equip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="4" rx="1"/>
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
            <path d="M10 12h4"/>
          </svg>
          <span>${item.equipment}</span>
        </div>
        <div class="overdue-due">${item.dueLabel}</div>
      </div>
    `).join('');
  }

  function renderCategoryAvailability() {
    if (!categoryAvailabilityList) return;

    if (categoryStatsList.length === 0) {
      categoryAvailabilityList.innerHTML = `<div class="empty-panel-msg" style="padding: 16px 0; color: var(--text-muted); font-size: 13px;">No category inventory data available.</div>`;
      return;
    }

    categoryAvailabilityList.innerHTML = categoryStatsList.map(cat => {
      const pct = cat.total > 0 ? Math.round((cat.available / cat.total) * 10000) / 100 : 0;
      return `
        <div class="category-item">
          <div class="category-meta">
            <span class="category-name">${cat.name}</span>
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
          <td colspan="5" style="text-align:center; padding: 24px; color: var(--text-muted);">No borrowing transactions recorded yet.</td>
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
            <div class="td-borrower-name">${row.name}</div>
            <div class="td-borrower-sub">${row.subtext || ''}</div>
          </td>
          <td class="td-equipment">${row.equipment}</td>
          <td class="td-date">${row.dateBorrowed}</td>
          <td class="${dueClass}">${row.dueDate}</td>
          <td>
            <span class="status-badge ${row.badgeType}">
              <span class="status-dot"></span>${row.status}
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
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  // Initial render
  renderOverdueList();
  renderCategoryAvailability();
  renderTransactions(1);
})();