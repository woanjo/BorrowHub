(function () {
  'use strict';

  // Initial 8 equipment items
  let equipmentList = [
    {
      id: 1,
      name: 'White Monobloc Chairs',
      subtitle: 'Uratex 101 Heavy Duty Stacking Resin',
      category: 'Chairs & Tables',
      totalQty: 250,
      availQty: 210,
      status: 'Available',
      condition: 'Good Condition',
      conditionFull: 'Good Condition (Minor Surface Wear)',
      cataloged: 'January 10, 2026',
      inspected: 'Inspected Oct 2024',
      description: 'Heavy-duty UV-stabilized stacking resin monobloc chairs for barangay assemblies, health missions, and community events. Stored in Logistics Bay 1-A.',
      dimensions: '18"L × 20"W × 32"H',
      weight: '2.4 kg / chair',
      material: 'Virgin Polypropylene',
      wear: 'Minimal Stack Scuffs',
      borrowerNote: '40 Units Currently Borrowed by Maria Santos (Purok 2)',
      borrowSlip: 'Borrow Slip #LS-2026-1140 • Due Date: Nov 7, 2026'
    },
    {
      id: 2,
      name: 'Heavy-Duty Foldable Tables 6ft',
      subtitle: 'Lifetime Commercial Polyethylene',
      category: 'Chairs & Tables',
      totalQty: 50,
      availQty: 25,
      status: 'Partially Borrowed',
      condition: 'Good Condition',
      conditionFull: 'Good Condition (Minor Surface Wear)',
      cataloged: 'January 15, 2026',
      inspected: 'Inspected Oct 2024',
      description: 'Commercial-grade 6-foot bi-fold plastic utility table with powder-coated rust-resistant steel frame. Designed for indoor and outdoor barangay assemblies, relief distribution, health missions, and registered community events. Features fold-in-half carrying handle for safe transport. Max weight capacity: 300 lbs distributed load.',
      dimensions: '72"L × 30"W × 29"H',
      weight: '13.5 kg / table',
      material: 'HDPE + Alloy Frame',
      wear: 'Minor Surface Scratches',
      borrowerNote: '25 Units Currently Borrowed by Purok 4 Council',
      borrowSlip: 'Borrow Slip #LS-2024-1102 • Due Date: Tomorrow, 17:00'
    },
    {
      id: 3,
      name: 'Steel Canopy Tent (10×10ft)',
      subtitle: 'Galvanized Retractable Heavy Frame',
      category: 'Tents & Canopies',
      totalQty: 15,
      availQty: 13,
      status: 'Available',
      condition: 'Brand New / Excellent',
      conditionFull: 'Brand New / Excellent',
      cataloged: 'February 02, 2026',
      inspected: 'Inspected Jan 2026',
      description: 'Pop-up galvanized steel canopy tent with waterproof 600D Oxford tarpaulin roof. Ideal for mobile vaccination booths, registration desks, and outdoor shade. Stored in Logistics Bay 2-A.',
      dimensions: '120"L × 120"W × 126"H',
      weight: '22.0 kg / set',
      material: 'Galvanized Steel + Oxford',
      wear: 'Clean / Intact Seam',
      borrowerNote: '2 Units Currently Borrowed by Barangay Council (Purok 1)',
      borrowSlip: 'Borrow Slip #LS-2026-1138 • Due Date: Nov 04, 2026'
    },
    {
      id: 4,
      name: 'High-Peak Event Tent (20×20ft)',
      subtitle: 'Heavy Duty Marquee Tarpaulin',
      category: 'Tents & Canopies',
      totalQty: 5,
      availQty: 0,
      status: 'Borrowed',
      condition: 'Good Condition',
      conditionFull: 'Good Condition (Minor Surface Wear)',
      cataloged: 'December 12, 2025',
      inspected: 'Inspected Dec 2025',
      description: 'Large-span 20×20ft marquee event tent with reinforced guy-wires and steel ground stakes for fiesta celebrations, sports leagues, and emergency evacuation centers. Stored in Exterior Shed B.',
      dimensions: '240"L × 240"W × 168"H',
      weight: '68.0 kg / full kit',
      material: 'Structural Steel + PVC',
      wear: 'Normal Outdoor Wear',
      borrowerNote: '5 Units Currently Borrowed by Barangay Fiesta Committee',
      borrowSlip: 'Borrow Slip #LS-2026-1129 • Due Date: Nov 6, 2026'
    },
    {
      id: 5,
      name: 'Portable Sound System w/ 2 Wireless Mics',
      subtitle: 'Yamaha StagePas 400BT',
      category: 'Sound Systems',
      totalQty: 10,
      availQty: 6,
      status: 'Under Maintenance',
      condition: 'Needs Repair',
      conditionFull: 'Needs Repair',
      cataloged: 'November 18, 2025',
      inspected: 'Flagged Nov 2026',
      description: '400W portable PA sound system with detachable 8-channel powered mixer, dual 8-inch speakers, stands, and 2 UHF wireless microphones. 4 units currently undergoing tweeter & battery calibration in Tech Room.',
      dimensions: '22"L × 14"W × 18"H',
      weight: '18.3 kg / pair',
      material: 'ABS Enclosure + Copper',
      wear: '4 Units In Repair Shop',
      borrowerNote: '4 Units Undergoing Technical Maintenance & Calibration',
      borrowSlip: 'Maintenance Ticket #MT-2026-019 • Est. Completion: Nov 8, 2026'
    },
    {
      id: 6,
      name: 'Official Basketball (Size 7)',
      subtitle: 'Molten GG7X Composite Leather',
      category: 'Sports & Youth',
      totalQty: 40,
      availQty: 34,
      status: 'Available',
      condition: 'Good Condition',
      conditionFull: 'Good Condition (Minor Surface Wear)',
      cataloged: 'January 22, 2026',
      inspected: 'Inspected Sep 2026',
      description: 'FIBA-approved 12-panel composite leather basketballs allocated for Sangguniang Kabataan (SK) inter-purok tournaments and youth sports clinics. Stored in Sports Locker C.',
      dimensions: '29.5" Circumference',
      weight: '0.62 kg / ball',
      material: 'Composite Microfiber',
      wear: 'Good Grip Pebble',
      borrowerNote: '6 Units Currently Borrowed by SK Youth Sports Committee',
      borrowSlip: 'Borrow Slip #LS-2026-1115 • Due Date: Nov 5, 2026'
    },
    {
      id: 7,
      name: 'Gasoline Generator 3500W',
      subtitle: 'Honda GX200 4-Stroke Engine',
      category: 'Disaster & Emergency',
      totalQty: 50,
      availQty: 45,
      status: 'Available',
      condition: 'Brand New / Excellent',
      conditionFull: 'Brand New / Excellent',
      cataloged: 'March 05, 2026',
      inspected: 'Inspected Oct 2026',
      description: '3.5kW portable backup power generator with AVR voltage regulation and 15L fuel tank for BDRRMC disaster response, brownout relief, and field lighting. Stored in BDRRMC Vault.',
      dimensions: '24"L × 18"W × 19"H',
      weight: '44.0 kg / unit',
      material: 'Cast Iron + Tubular Frame',
      wear: 'Serviced / Full Oil',
      borrowerNote: '5 Units Deployed to Purok Evacuation Outposts',
      borrowSlip: 'Deployment Memo #DR-2026-08 • Standby Custody'
    },
    {
      id: 8,
      name: 'Grass Cutter / Weed Whacker',
      subtitle: 'Stihl FS 250 Brushcutter',
      category: 'Maintenance/Sanitation',
      totalQty: 30,
      availQty: 25,
      status: 'Available',
      condition: 'Good Condition',
      conditionFull: 'Good Condition (Minor Surface Wear)',
      cataloged: 'February 14, 2026',
      inspected: 'Inspected Oct 2026',
      description: 'Heavy-duty 2-stroke brushcutter with shoulder harness and metal clearing blade for barangay clean-up drives, canal clearing, and roadside maintenance. Stored in Sanitation Shed.',
      dimensions: '70"L × 12"W × 11"H',
      weight: '6.3 kg / unit',
      material: 'Aluminum Shaft + Steel',
      wear: 'Blades Sharpened',
      borrowerNote: '5 Units Currently Borrowed by Clean & Green Brigade',
      borrowSlip: 'Borrow Slip #LS-2026-1131 • Due Date: Nov 5, 2026'
    }
  ];

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
  const catOptions = document.querySelectorAll('.cat-option');
  const statusTabs = document.querySelectorAll('.status-tab');

  // Category-specific crisp SVG icon helper
  function getCategoryIconSVG(category, isMaintenance) {
    if (isMaintenance) {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/></svg>`;
    }
    switch (category) {
      case 'Chairs & Tables':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6"/><path d="M3 12h18v4H3z"/><path d="M6 16v4"/><path d="M18 16v4"/></svg>`;
      case 'Tents & Canopies':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20 12 4l9 16"/><path d="M12 4v16"/><path d="M7.5 12h9"/></svg>`;
      case 'Sound Systems':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><line x1="12" y1="6" x2="12.01" y2="6"/></svg>`;
      case 'Sports & Youth':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M4.93 4.93c4.5 4.5 9.64 4.5 14.14 0"/><path d="M4.93 19.07c4.5-4.5 9.64-4.5 14.14 0"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`;
      case 'Disaster & Emergency':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`;
      case 'Maintenance/Sanitation':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
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
    if (status === 'Under Maintenance') {
      return `<span class="status-pill maintenance"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><span>Under<br>Maintenance</span></span>`;
    }
    return `<span class="status-pill available">${status}</span>`;
  }

  // Render Equipment Inventory Table
  function renderTable() {
    const filtered = equipmentList.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Categories' || item.category === selectedCategory;

      let matchesStatus = true;
      if (selectedStatus === 'Available') {
        matchesStatus = item.status === 'Available';
      } else if (selectedStatus === 'Borrowed') {
        matchesStatus = item.status === 'Borrowed' || item.status === 'Partially Borrowed';
      } else if (selectedStatus === 'Maintenance') {
        matchesStatus = item.status === 'Under Maintenance';
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });

    itemsCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Item' : 'Items'}`;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr class="empty-state-row">
          <td colspan="6">No equipment records match your current search or filter criteria.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const isMaint = item.status === 'Under Maintenance';
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
                <div class="equip-sub-text">${item.subtitle}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="category-tag">${item.category}</span>
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
    const conditionFull = document.getElementById('addEquipCondition').value;
    const status = document.getElementById('addEquipStatus').value;
    const qty = Math.max(1, parseInt(addEquipQtyInput.value, 10) || 1);
    const desc = document.getElementById('addEquipDesc').value.trim();

    if (!name || !category) return;

    const newItem = {
      id: Date.now(),
      name: name,
      subtitle: desc ? desc.slice(0, 42) + (desc.length > 42 ? '...' : '') : 'Barangay Bulacao Official Asset',
      category: category,
      totalQty: qty,
      availQty: status === 'Available' ? qty : 0,
      status: status,
      condition: conditionFull.split(' (')[0],
      conditionFull: conditionFull,
      cataloged: 'November 15, 2026',
      inspected: 'Inspected Nov 2026',
      description: desc || 'Official municipal equipment recorded in the Barangay Bulacao custodial inventory ledger.',
      dimensions: 'Standard Municipal Spec',
      weight: 'Verified on Intake',
      material: 'Heavy-Duty Commercial',
      wear: conditionFull.split(' (')[0],
      borrowerNote: '0 Units Currently Borrowed • Newly Cataloged',
      borrowSlip: 'Registry Entry #RG-2026-884 • Ready for Assignment'
    };

    equipmentList.unshift(newItem);

    const totalEl = document.getElementById('kpiTotalValue');
    const availEl = document.getElementById('kpiAvailableValue');
    const maintEl = document.getElementById('kpiMaintenanceValue');

    totalEl.textContent = parseInt(totalEl.textContent, 10) + qty;
    if (status === 'Available') {
      availEl.textContent = parseInt(availEl.textContent, 10) + qty;
    } else {
      maintEl.textContent = parseInt(maintEl.textContent, 10) + qty;
    }

    renderTable();
    closeModal('addModalBackdrop');
    showToast(`Added "${name}" (${qty} units) to Barangay Inventory`);
  });

  // ==========================================================================
  // MODAL 2: View Equipment Details Logic
  // ==========================================================================
  function openDetailsModal(item) {
    document.getElementById('detCategory').textContent = item.category;
    document.getElementById('detName').textContent = item.name;
    document.getElementById('detCataloged').textContent = item.cataloged;
    document.getElementById('detTotalQty').textContent = item.totalQty;
    document.getElementById('detAvailQty').textContent = item.availQty;

    const activeLoanCount = Math.max(0, item.totalQty - item.availQty);
    document.getElementById('detOnLoanSub').textContent = `• ${activeLoanCount} Active on loan`;

    const statusWrap = document.getElementById('detStatusBadgeWrap');
    statusWrap.innerHTML = getStatusBadgeHTML(item.status === 'Partially Borrowed' ? 'Available' : item.status);
    document.getElementById('detStatusSub').textContent =
      item.availQty > 0 ? 'Open for requests' : 'Currently unavailable';

    const condPill = document.getElementById('detConditionPill');
    condPill.innerHTML = `&#10003; ${item.condition}`;
    condPill.className = item.condition === 'Needs Repair' ? 'status-pill maintenance' : 'status-pill available';

    document.getElementById('detInspectedSub').textContent = item.inspected;
    document.getElementById('detDescription').textContent = item.description;
    document.getElementById('detDimensions').textContent = item.dimensions;
    document.getElementById('detWeight').textContent = item.weight;
    document.getElementById('detMaterial').textContent = item.material;
    document.getElementById('detWear').textContent = item.wear;
    document.getElementById('detLoanTitle').textContent = item.borrowerNote;
    document.getElementById('detLoanSub').textContent = item.borrowSlip;

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
    document.getElementById('editEquipName').value = item.name;
    document.getElementById('editEquipCategory').value = item.category;
    editEquipQtyInput.value = item.totalQty;
    editAvailableHint.textContent = `Available: ${item.availQty}`;
    document.getElementById('editEquipCondition').value = item.conditionFull;
    document.getElementById('editEquipStatus').value = item.status;
    document.getElementById('editEquipDesc').value = item.description;

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
    const id = Number(document.getElementById('editEquipId').value);
    const item = equipmentList.find(eq => eq.id === id);
    if (!item) return;

    const updatedName = document.getElementById('editEquipName').value.trim();
    const updatedCat = document.getElementById('editEquipCategory').value;
    const updatedTotal = Math.max(1, parseInt(editEquipQtyInput.value, 10) || 1);
    const updatedCondFull = document.getElementById('editEquipCondition').value;
    const updatedStatus = document.getElementById('editEquipStatus').value;
    const updatedDesc = document.getElementById('editEquipDesc').value.trim();

    const borrowedDiff = Math.max(0, item.totalQty - item.availQty);
    item.name = updatedName;
    item.category = updatedCat;
    item.totalQty = updatedTotal;
    item.availQty =
      updatedStatus === 'Borrowed'
        ? 0
        : Math.max(0, Math.min(updatedTotal, updatedTotal - borrowedDiff));
    item.conditionFull = updatedCondFull;
    item.condition = updatedCondFull.split(' (')[0];
    item.status = updatedStatus;
    item.description = updatedDesc;

    renderTable();
    closeModal('editModalBackdrop');
    showToast(`Updated ledger record for "${item.name}"`);
  });

  // Delegate Eye (View Details) & Update Equipment row buttons
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.getAttribute('data-id'));
    const item = equipmentList.find(eq => eq.id === id);
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

  catOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      catOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedCategory = opt.getAttribute('data-category');
      selectedCategoryLabel.textContent = selectedCategory;
      catFilterWrap.classList.remove('open');
      catFilterBtn.setAttribute('aria-expanded', 'false');
      renderTable();
    });
  });

  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedStatus = tab.getAttribute('data-status');
      renderTable();
    });
  });

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

  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (adminWrapper) adminWrapper.classList.remove('open');
      showToast(el.getAttribute('data-toast'));
    });
  });

  // Initial render
  renderTable();
})();