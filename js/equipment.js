(function () {
  'use strict';

  let equipmentList = [];
  let categoriesLoaded = false;

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

  // Escape HTML special characters before rendering text
  function escapeHTML(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Toast Notification Helper
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message, isError = false) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) {
      toast.style.borderLeft = '4px solid #dc2626';
    }
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
    }, 3000);
  }

  // Fetch live equipment and categories from PHP backend (Option 1)
  async function loadEquipmentData() {
    try {
      const response = await fetch('php/equipment.php?action=get');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load equipment from database.');
      }

      if (!categoriesLoaded && Array.isArray(data.categories)) {
        populateCategoryDropdowns(data.categories);
        categoriesLoaded = true;
      }

      const rows = Array.isArray(data.equipment) ? data.equipment : [];
      equipmentList = rows.map(row => {
        const qty = Number(row.quantity ?? 0);
        const status = row.status || 'Available';
        return {
          id: row.equipment_id,
          categoryId: row.category_id,
          category: row.categoryname || 'Uncategorized',
          name: row.equipmentname || 'Unnamed Equipment',
          subtitle: row.description || '',
          description: row.description || 'No description provided.',
          totalQty: qty,
          availQty: status === 'Available' ? qty : 0,
          status: status,
          cataloged: `EQ-${String(row.equipment_id).padStart(3, '0')}`
        };
      });

      updateKPICards();
      renderTable();
    } catch (err) {
      console.error(err);
      showToast(err.message, true);
    }
  }

  // Populate Category Filter & Modal Dropdowns from public.equipment_category
  function populateCategoryDropdowns(categories) {
    const addSelect = document.getElementById('addEquipCategory');
    const editSelect = document.getElementById('editEquipCategory');

    categories.forEach(cat => {
      if (catDropdownMenu) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cat-option';
        btn.setAttribute('data-category', cat.categoryname);
        btn.textContent = cat.categoryname;
        catDropdownMenu.appendChild(btn);
      }

      if (addSelect) {
        const opt = document.createElement('option');
        opt.value = cat.category_id;
        opt.textContent = cat.categoryname;
        addSelect.appendChild(opt);
      }

      if (editSelect) {
        const opt = document.createElement('option');
        opt.value = cat.category_id;
        opt.textContent = cat.categoryname;
        editSelect.appendChild(opt);
      }
    });
  }

  // Update the 4 KPI Summary Cards from live database rows
  function updateKPICards() {
    let totalUnits = 0;
    let availableUnits = 0;
    let borrowedUnits = 0;
    let maintenanceUnits = 0;

    equipmentList.forEach(item => {
      const qty = Number(item.totalQty || 0);
      totalUnits += qty;

      if (item.status === 'Available') {
        availableUnits += qty;
      } else if (item.status === 'Borrowed' || item.status === 'Reserved') {
        borrowedUnits += qty;
      } else if (item.status === 'Unavailable') {
        maintenanceUnits += qty;
      }
    });

    const elTotal = document.getElementById('kpiTotalValue');
    const elAvail = document.getElementById('kpiAvailableValue');
    const elBorrowed = document.getElementById('kpiBorrowedValue');
    const elMaint = document.getElementById('kpiMaintenanceValue');

    if (elTotal) elTotal.textContent = totalUnits;
    if (elAvail) elAvail.textContent = availableUnits;
    if (elBorrowed) elBorrowed.textContent = borrowedUnits;
    if (elMaint) elMaint.textContent = maintenanceUnits;
  }

  // Category-specific crisp SVG icon helper
  function getCategoryIconSVG(category, isMaintenance) {
    if (isMaintenance) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/></svg>`;
    }
    switch (category) {
      case 'Furniture & Tents':
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
    if (status === 'Reserved') {
      return `<span class="status-pill partial"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>Reserved</span>`;
    }
    if (status === 'Borrowed') {
      return `<span class="status-pill borrowed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/></svg>Borrowed</span>`;
    }
    if (status === 'Unavailable' || status === 'Under Maintenance') {
      return `<span class="status-pill maintenance"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><span>${escapeHTML(status)}</span></span>`;
    }
    return `<span class="status-pill available">${escapeHTML(status)}</span>`;
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
        matchesStatus = item.status === 'Borrowed' || item.status === 'Reserved';
      } else if (selectedStatus === 'Maintenance') {
        matchesStatus = item.status === 'Unavailable' || item.status === 'Under Maintenance';
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
      const isMaint = item.status === 'Unavailable' || item.status === 'Under Maintenance';
      const availClass = item.availQty === 0 ? 'qty-num zero-danger' : 'qty-num';

      return `
        <tr data-id="${escapeHTML(item.id)}">
          <td>
            <div class="equip-cell">
              <div class="equip-icon-tile ${isMaint ? 'maintenance-icon' : ''}" aria-hidden="true">
                ${getCategoryIconSVG(item.category, isMaint)}
              </div>
              <div>
                <div class="equip-name-text">${escapeHTML(item.name)}</div>
                <div class="equip-sub-text">${escapeHTML(item.subtitle)}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="category-tag">${escapeHTML(item.category)}</span>
          </td>
          <td class="td-center">
            <span class="qty-num">${item.totalQty}</span>
          </td>
          <td class="td-center">
            <span class="${availClass}">${item.availQty}</span>
          </td>
          <td>
            ${getStatusBadgeHTML(item.status)}
          </td>
          <td class="td-right">
            <div class="row-actions">
              <button type="button" class="btn-eye" data-action="view" data-id="${escapeHTML(item.id)}" title="View Equipment Details" aria-label="View details for ${escapeHTML(item.name)}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button type="button" class="btn-update-row" data-action="edit" data-id="${escapeHTML(item.id)}">
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
  // MODAL 1: Add New Equipment (Connected to public.add_equipment)
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
    const val = Math.max(0, (parseInt(addEquipQtyInput.value, 10) || 0) - 1);
    addEquipQtyInput.value = val;
  });

  document.getElementById('addQtyPlus').addEventListener('click', () => {
    const val = Math.min(999, (parseInt(addEquipQtyInput.value, 10) || 0) + 1);
    addEquipQtyInput.value = val;
  });

  addEquipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('equipmentname', document.getElementById('addEquipName').value.trim());
    formData.append('category_id', document.getElementById('addEquipCategory').value);
    formData.append('status', document.getElementById('addEquipStatus').value);
    formData.append('quantity', document.getElementById('addEquipQty').value);
    formData.append('description', document.getElementById('addEquipDesc').value.trim());

    try {
      const response = await fetch('php/equipment.php?action=add', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not add equipment.');
      }

      closeModal('addModalBackdrop');
      showToast(result.message || 'Equipment added successfully!');
      await loadEquipmentData();
    } catch (err) {
      showToast(err.message, true);
    }
  });

  // ==========================================================================
  // MODAL 2: View Equipment Details Logic
  // ==========================================================================
  function openDetailsModal(item) {
    document.getElementById('detCategory').textContent = item.category || '--';
    document.getElementById('detName').textContent = item.name || '--';
    document.getElementById('detCataloged').textContent = item.cataloged || '--';
    document.getElementById('detCustodian').textContent = 'Barangay Property Office';
    document.getElementById('detTotalQty').textContent = item.totalQty ?? 0;
    document.getElementById('detAvailQty').textContent = item.availQty ?? 0;

    const statusWrap = document.getElementById('detStatusBadgeWrap');
    statusWrap.innerHTML = getStatusBadgeHTML(item.status);

    const statusSub = document.getElementById('detStatusSub');
    if (statusSub) {
      statusSub.textContent = (item.availQty ?? 0) > 0 ? 'Open for requests' : 'Currently unavailable';
    }

    document.getElementById('detDescription').textContent = item.description || '--';

    openModal('detailsModalBackdrop');
  }
  
  // ==========================================================================
  // MODAL 3: Update Equipment (Connected to public.update_equipment)
  // ==========================================================================
  const editEquipmentForm = document.getElementById('editEquipmentForm');
  const editEquipQtyInput = document.getElementById('editEquipQty');
  const editAvailableHint = document.getElementById('editAvailableHint');

  function openEditModal(item) {
    document.getElementById('editEquipId').value = item.id;
    document.getElementById('editEquipName').value = item.name || '';
    document.getElementById('editEquipCategory').value = item.categoryId || '';
    editEquipQtyInput.value = item.totalQty ?? 1;
    editAvailableHint.textContent = `Available: ${item.availQty ?? 0}`;
    document.getElementById('editEquipStatus').value = item.status || 'Available';
    document.getElementById('editEquipDesc').value = item.description || '';

    openModal('editModalBackdrop');
  }

  document.getElementById('editQtyMinus').addEventListener('click', () => {
    const val = Math.max(0, (parseInt(editEquipQtyInput.value, 10) || 0) - 1);
    editEquipQtyInput.value = val;
  });

  document.getElementById('editQtyPlus').addEventListener('click', () => {
    const val = Math.min(999, (parseInt(editEquipQtyInput.value, 10) || 0) + 1);
    editEquipQtyInput.value = val;
  });

  editEquipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('equipment_id', document.getElementById('editEquipId').value);
    formData.append('equipmentname', document.getElementById('editEquipName').value.trim());
    formData.append('category_id', document.getElementById('editEquipCategory').value);
    formData.append('quantity', document.getElementById('editEquipQty').value);
    formData.append('status', document.getElementById('editEquipStatus').value);
    formData.append('description', document.getElementById('editEquipDesc').value.trim());

    try {
      const response = await fetch('php/equipment.php?action=update', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not update equipment.');
      }

      closeModal('editModalBackdrop');
      showToast(result.message || 'Equipment updated successfully!');
      await loadEquipmentData();
    } catch (err) {
      showToast(err.message, true);
    }
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

  // Load live data from Neon on page start
  loadEquipmentData();
})();