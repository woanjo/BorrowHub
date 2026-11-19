(function () {
  'use strict';

  let equipmentList = [];

  // Filter state
  let searchQuery = '';
  let selectedCategory = 'All Categories';
  let selectedStatus = 'All';

  // DOM References
  const tbody = document.getElementById('inventoryTableBody');
  const itemsCountBadge = document.getElementById('itemsCountBadge');
  const searchInput = document.getElementById('searchInput');
  const catFilterWrap = document.getElementById('catFilterWrap');
  const catFilterBtn = document.getElementById('catFilterBtn');
  const selectedCategoryLabel = document.getElementById('selectedCategoryLabel');
  const catDropdownMenu = document.getElementById('catDropdownMenu');
  const statusTabs = document.querySelectorAll('.status-tab');

  // Category-specific crisp SVG icon helper
  function getCategoryIconSVG(category, isMaintenance) {
    if (isMaintenance) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/></svg>`;
    }
    switch (category) {
      case 'Furniture':
      case 'Chairs & Tables':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6"/><path d="M3 12h18v4H3z"/><path d="M6 16v4"/><path d="M18 16v4"/></svg>`;
      case 'Event Equipment':
      case 'Tents & Canopies':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20 12 4l9 16"/><path d="M12 4v16"/><path d="M7.5 12h9"/></svg>`;
      case 'Audio Equipment':
      case 'Sound Systems':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/></svg>`;
      case 'Presentation Equipment':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/></svg>`;
    }
  }

  // Status Pill Badge HTML generator
  function getStatusBadgeHTML(status) {
    if (status === 'Available') {
      return `<span class="status-pill available"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>Available</span>`;
    }
    if (status === 'Partially Borrowed') {
      return `<span class="status-pill partial"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>Partially Borrowed</span>`;
    }
    if (status === 'Borrowed') {
      return `<span class="status-pill borrowed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/></svg>Borrowed</span>`;
    }
    if (status === 'Under Maintenance' || status === 'Unavailable') {
      return `<span class="status-pill maintenance"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><span>${status}</span></span>`;
    }
    return `<span class="status-pill available">${status}</span>`;
  }

  // Render Equipment Inventory Table
  function renderTable() {
    const filtered = equipmentList.filter(item => {
      const name = (item.name || '').toLowerCase();
      const subtitle = (item.subtitle || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch = name.includes(q) || subtitle.includes(q) || category.includes(q);
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;

      let matchesStatus = true;
      if (selectedStatus === 'Available') {
        matchesStatus = item.status === 'Available';
      } else if (selectedStatus === 'Borrowed') {
        matchesStatus = item.status === 'Borrowed' || item.status === 'Partially Borrowed';
      } else if (selectedStatus === 'Maintenance') {
        matchesStatus = item.status === 'Under Maintenance' || item.status === 'Unavailable';
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });

    itemsCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Item' : 'Items'}`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr class="empty-state-row">
          <td colspan="6">No equipment records found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const isMaint = item.status === 'Under Maintenance' || item.status === 'Unavailable';
      const availClass = item.availQty === 0 ? 'qty-num zero-danger' : 'qty-num';

      return `
        <tr data-id="${item.id}">
          <td>
            <div class="equip-cell">
              <div class="equip-icon-tile ${isMaint ? 'maintenance-icon' : ''}" aria-hidden="true">
                ${getCategoryIconSVG(item.category, isMaint)}
              </div>
              <div>
                <div class="equip-name-text">${item.name}</div>
                <div class="equip-sub-text">${item.subtitle || ''}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="category-tag">${item.category}</span>
          </td>
          <td class="td-center">
            <span class="qty-num">${item.totalQty ?? 1}</span>
          </td>
          <td class="td-center">
            <span class="${availClass}">${item.availQty ?? (item.status === 'Available' ? 1 : 0)}</span>
          </td>
          <td>
            ${getStatusBadgeHTML(item.status)}
          </td>
          <td class="td-right">
            <div class="row-actions">
              <button type="button" class="btn-eye" data-action="view" data-id="${item.id}" title="View Equipment Details" aria-label="View details for ${item.name}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button type="button" class="btn-update-row" data-action="edit" data-id="${item.id}">
                Update<br>Equipment
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================================================
  // Modal Open / Close & Background Scroll Lock
  // ==========================================================================
  function openModal(backdropId) {
    const backdrop = document.getElementById(backdropId);
    if (!backdrop) return;
    backdrop.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal(backdropId) {
    const backdrop = document.getElementById(backdropId);
    if (!backdrop) return;
    backdrop.classList.remove('active');
    const anyOpen = document.querySelector('.modal-backdrop.active');
    if (!anyOpen) {
      document.body.classList.remove('modal-open');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.getAttribute('data-close-modal'));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // ==========================================================================
  // MODAL 1: Add New Equipment Logic
  // ==========================================================================
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const addEquipmentForm = document.getElementById('addEquipmentForm');
  const addEquipQtyInput = document.getElementById('addEquipQty');

  openAddModalBtn.addEventListener('click', () => {
    addEquipmentForm.reset();
    addEquipQtyInput.value = 1;
    openModal('addModalBackdrop');
  });

  document.getElementById('addQtyMinus').addEventListener('click', () => {
    const val = Math.max(1, (parseInt(addEquipQtyInput.value, 10) || 1) - 1);
    addEquipQtyInput.value = val;
  });

  document.getElementById('addQtyPlus').addEventListener('click', () => {
    const val = Math.min(999, (parseInt(addEquipQtyInput.value, 10) || 1) + 1);
    addEquipQtyInput.value = val;
  });

  addEquipmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('addEquipName').value.trim();
    const category = document.getElementById('addEquipCategory').value;
    if (!name || !category) return;
  });

  // ==========================================================================
  // MODAL 2: View Equipment Details Logic
  // ==========================================================================
  function openDetailsModal(item) {
    document.getElementById('detCategory').textContent = item.category || '--';
    document.getElementById('detName').textContent = item.name || '--';
    document.getElementById('detCataloged').textContent = item.cataloged || '--';
    document.getElementById('detCustodian').textContent = item.custodian || '--';
    document.getElementById('detTotalQty').textContent = item.totalQty ?? 0;
    document.getElementById('detAvailQty').textContent = item.availQty ?? 0;

    const activeLoanCount = Math.max(0, (item.totalQty ?? 0) - (item.availQty ?? 0));
    document.getElementById('detOnLoanSub').textContent = `• ${activeLoanCount} Active on loan`;

    const statusWrap = document.getElementById('detStatusBadgeWrap');
    statusWrap.innerHTML = getStatusBadgeHTML(item.status === 'Partially Borrowed' ? 'Available' : item.status);
    document.getElementById('detStatusSub').textContent =
      (item.availQty ?? 0) > 0 ? 'Open for requests' : 'Currently unavailable';

    const condPill = document.getElementById('detConditionPill');
    condPill.innerHTML = item.condition ? `&#10003; ${item.condition}` : '--';
    condPill.className = item.condition === 'Needs Repair' ? 'status-pill maintenance' : 'status-pill available';

    document.getElementById('detInspectedSub').textContent = item.inspected || '--';
    document.getElementById('detDescription').textContent = item.description || '--';
    document.getElementById('detDimensions').textContent = item.dimensions || '--';
    document.getElementById('detWeight').textContent = item.weight || '--';
    document.getElementById('detMaterial').textContent = item.material || '--';
    document.getElementById('detWear').textContent = item.wear || '--';
    document.getElementById('detLoanTitle').textContent = item.borrowerNote || 'No active loans';
    document.getElementById('detLoanSub').textContent = item.borrowSlip || '--';

    openModal('detailsModalBackdrop');
  }

  // ==========================================================================
  // MODAL 3: Update Equipment Logic
  // ==========================================================================
  const editEquipmentForm = document.getElementById('editEquipmentForm');
  const editEquipQtyInput = document.getElementById('editEquipQty');
  const editAvailableHint = document.getElementById('editAvailableHint');

  function openEditModal(item) {
    document.getElementById('editEquipId').value = item.id;
    document.getElementById('editEquipName').value = item.name || '';
    document.getElementById('editEquipCategory').value = item.category || '';
    editEquipQtyInput.value = item.totalQty ?? 1;
    editAvailableHint.textContent = `Available: ${item.availQty ?? 0}`;
    document.getElementById('editEquipCondition').value = item.conditionFull || 'Good Condition (Minor Surface Wear)';
    document.getElementById('editEquipStatus').value = item.status || 'Available';
    document.getElementById('editEquipDesc').value = item.description || '';

    openModal('editModalBackdrop');
  }

  document.getElementById('editQtyMinus').addEventListener('click', () => {
    const val = Math.max(1, (parseInt(editEquipQtyInput.value, 10) || 1) - 1);
    editEquipQtyInput.value = val;
  });

  document.getElementById('editQtyPlus').addEventListener('click', () => {
    const val = Math.min(999, (parseInt(editEquipQtyInput.value, 10) || 1) + 1);
    editEquipQtyInput.value = val;
  });

  editEquipmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Delegate Eye (View Details) & Update Equipment row buttons
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const item = equipmentList.find(eq => String(eq.id) === String(id));
    if (!item) return;

    if (btn.getAttribute('data-action') === 'view') {
      openDetailsModal(item);
    } else if (btn.getAttribute('data-action') === 'edit') {
      openEditModal(item);
    }
  });

  // ==========================================================================
  // Search & Filter Controls
  // ==========================================================================
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTable();
  });

  catFilterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = catFilterWrap.classList.toggle('open');
    catFilterBtn.setAttribute('aria-expanded', String(isOpen));
  });

  if (catDropdownMenu) {
    catDropdownMenu.addEventListener('click', (e) => {
      const opt = e.target.closest('.cat-option');
      if (!opt) return;
      catDropdownMenu.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedCategory = opt.getAttribute('data-category');
      selectedCategoryLabel.textContent = selectedCategory;
      catFilterWrap.classList.remove('open');
      catFilterBtn.setAttribute('aria-expanded', 'false');
      renderTable();
    });
  }

  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedStatus = tab.getAttribute('data-status');
      renderTable();
    });
  });

  // ==========================================================================
  // Mobile Menu & Administration Access Restriction
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

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
    if (catFilterWrap && !catFilterWrap.contains(e.target)) {
      catFilterWrap.classList.remove('open');
      if (catFilterBtn) {
        catFilterBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Toast Notification Helper
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
  renderTable();
})();