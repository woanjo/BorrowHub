(function () {
  'use strict';

  const records = [
    { id: 1, name: 'Maria Santos', contact: 'Purok 2 • 0928-444-5678', equipment: 'White Monobloc Chairs & Foldable Tables', items: 'Monobloc Chairs (40 pcs), Foldable Tables (4 pcs)', dueDate: 'Nov 7, 2026', dueTime: '03:30 PM', status: 'Pending', borrowedAt: 'November 4, 2026 • 08:30 AM', equipmentRows: [{ name: 'White Monobloc Chairs (Uratex 101 Heavy Duty)', quantity: 40, unit: 'pcs', inventoryId: 'BSI-EQ-2023-001', restockBay: 'Restock Bay 1-B' }, { name: 'Heavy-Duty Foldable Tables 6ft (Plastic Top)', quantity: 4, unit: 'pcs', inventoryId: 'BSI-EQ-2023-018', restockBay: 'Restock Bay 2-A' }] },
    { id: 2, name: 'Roberto Diaz', contact: 'Purok 1 • 0917-555-1234', equipment: 'Heavy-Duty Canopy Tent', items: 'Heavy-Duty Canopy Tent (10×10) (2 items)', dueDate: 'Nov 4, 2026', dueTime: '05:00 PM (Today)', status: 'Due Today' },
    { id: 3, name: 'Ricardo Dalisay', contact: 'Purok 1 • 0915-888-4455', equipment: 'Portable Sound System', items: 'Portable Sound System + mic (2 items)', dueDate: 'Nov 4, 2026', dueTime: '05:00 PM (Today)', status: 'Due Today' },
    { id: 4, name: 'Eduardo Ramos', contact: 'Purok 3 • 0918-333-9876', equipment: 'Megaphone & Emergency Gear', items: 'Megaphone & First Aid Kit Box (2 items)', dueDate: 'Nov 3, 2026', dueTime: '02:15 PM (Overdue)', status: 'Overdue' },
    { id: 5, name: 'Elena Bautista', contact: 'Purok 4 • 0920-777-8899', equipment: 'Foldable Chairs', items: 'Foldable Steel Chairs (20 items)', dueDate: 'Oct 28, 2026', dueTime: '03:30 PM', status: 'Returned', condition: 'Good condition' },
    { id: 6, name: 'Nenita Gomez', contact: 'Purok 5 • 0933-222-1100', equipment: 'Maintenance/Sanitation', items: 'Grass Cutter & Extension Reel (1 item)', dueDate: 'Oct 21, 2026', dueTime: '04:00 PM', status: 'Returned', condition: 'Good condition' },
    { id: 7, name: 'Carlos Mendoza', contact: 'Purok 1 • 0916-445-2100', equipment: 'Sports & Youth Equipment', items: 'Basketballs (5 pcs), Volleyball Nets (2 pcs)', dueDate: 'Nov 8, 2026', dueTime: '04:00 PM', status: 'Pending' },
    { id: 8, name: 'Liza Soberano-Cruz', contact: 'Purok 2 • 0908-551-9002', equipment: 'Chairs & Tables', items: 'Monobloc Chairs (15 pcs), Banquet Table (1 pc)', dueDate: 'Nov 9, 2026', dueTime: '03:00 PM', status: 'Pending' },
    { id: 9, name: 'Antonio Reyes', contact: 'Purok 3 • 0917-601-3342', equipment: 'Two-Way Radios', items: 'Two-Way Radios (4 pcs), Searchlights (2 pcs)', dueDate: 'Nov 10, 2026', dueTime: '04:30 PM', status: 'Pending' },
    { id: 10, name: 'Clarissa Bautista', contact: 'Purok 1 • 0921-440-7781', equipment: 'Daycare Center Furniture', items: 'Kiddie Chairs (20 pcs), Activity Tables (4 pcs)', dueDate: 'Nov 11, 2026', dueTime: '03:30 PM', status: 'Pending' },
    { id: 11, name: 'Fernando Tolentino', contact: 'Purok 4 • 0915-765-2234', equipment: 'Maintenance Tools', items: 'Grass Cutter (1 pc), Wheelbarrows (2 pcs)', dueDate: 'Nov 12, 2026', dueTime: '04:00 PM', status: 'Pending' },
    { id: 12, name: 'Marisol De Leon', contact: 'Purok 2 • 0918-345-6220', equipment: 'Sound System & Seating', items: 'Monobloc Chairs (50 pcs), PA Sound System (1 pc)', dueDate: 'Nov 13, 2026', dueTime: '03:00 PM', status: 'Pending' },
    { id: 13, name: 'Jomar Aquino', contact: 'Purok 4 • 0922-555-3490', equipment: 'Extension Ladder', items: 'Extension Ladder (16 ft) (1 pc)', dueDate: 'Nov 14, 2026', dueTime: '04:00 PM', status: 'Pending' },
    { id: 14, name: 'Teresa Magbanua', contact: 'Purok 1 • 0919-225-0761', equipment: 'Emergency Equipment', items: 'Folding Stretchers (2 pcs), Emergency Tent (1 pc)', dueDate: 'Nov 15, 2026', dueTime: '03:30 PM', status: 'Pending' },
    { id: 15, name: 'Pedro Mendoza', contact: 'Purok 5 • 0906-234-1190', equipment: 'Chairs & Canopy', items: 'Monobloc Chairs (30 pcs), Canopy Tent (1 pc)', dueDate: 'Nov 16, 2026', dueTime: '05:00 PM', status: 'Pending' },
    { id: 16, name: 'Roberto Gomez', contact: 'Purok 5 • 0912-390-4420', equipment: 'Water Pump & Hose Set', items: 'Water Pump (1 pc), Heavy Hose (1 set)', dueDate: 'Nov 17, 2026', dueTime: '04:00 PM', status: 'Pending' },
    { id: 17, name: 'Lourdes Santiago', contact: 'Purok 2 • 0928-224-1900', equipment: 'Portable Sound System', items: 'Portable Sound System (1 set)', dueDate: 'Nov 18, 2026', dueTime: '03:00 PM', status: 'Pending' },
    { id: 18, name: 'Ramon Bautista', contact: 'Purok 3 • 0917-900-1022', equipment: 'Disaster Response Kit', items: 'Emergency Kit (3 sets)', dueDate: 'Nov 19, 2026', dueTime: '05:00 PM', status: 'Pending' },
    { id: 19, name: 'Angelica Reyes', contact: 'Purok 4 • 0920-810-3677', equipment: 'Foldable Tables', items: 'Foldable Tables (6 pcs)', dueDate: 'Nov 20, 2026', dueTime: '04:30 PM', status: 'Pending' },
    { id: 20, name: 'Danilo Soriano', contact: 'Purok 1 • 0916-781-1202', equipment: 'Canopy Tent', items: 'Canopy Tent (10×10) (1 pc)', dueDate: 'Nov 4, 2026', dueTime: '05:00 PM (Today)', status: 'Due Today' },
    { id: 21, name: 'Joshua Flores', contact: 'Purok 3 • 0908-559-6623', equipment: 'Sports & Youth Equipment', items: 'Volleyballs (4 pcs), Net (1 pc)', dueDate: 'Nov 4, 2026', dueTime: '05:00 PM (Today)', status: 'Due Today' },
    { id: 22, name: 'Teresa Cruz', contact: 'Purok 5 • 0915-330-8754', equipment: 'Public Address System', items: 'PA System (1 set), Wireless Microphone (2 pcs)', dueDate: 'Nov 4, 2026', dueTime: '05:00 PM (Today)', status: 'Due Today' },
    { id: 23, name: 'Mark Alcantara', contact: 'Purok 2 • 0917-875-2246', equipment: 'Chairs & Tables', items: 'Monobloc Chairs (25 pcs), Tables (3 pcs)', dueDate: 'Nov 2, 2026', dueTime: '02:00 PM (Overdue)', status: 'Overdue' },
    { id: 24, name: 'Liza Ramos', contact: 'Purok 4 • 0923-411-9081', equipment: 'Disaster Response Kit', items: 'Emergency Tent (1 pc), First Aid Kit (2 pcs)', dueDate: 'Nov 2, 2026', dueTime: '02:00 PM (Overdue)', status: 'Overdue' }
  ];

  const pageSize = 6;
  const tbody = document.getElementById('returnsBody');
  const searchInput = document.getElementById('searchInput');
  const tabs = Array.from(document.querySelectorAll('.filter-tab'));
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const modalBackdrop = document.getElementById('returnModalBackdrop');
  const returnForm = document.getElementById('returnForm');
  let selectedStatus = 'All';
  let currentPage = 1;
  let activeRecord = null;
  let modalMode = 'process';
  let processItems = [];
  let selectedProcessCondition = 'Good Condition';

  function getCounts() {
    return records.reduce(function (counts, record) {
      counts[record.status] += 1;
      return counts;
    }, { Pending: 0, 'Due Today': 0, Overdue: 0, Returned: 0 });
  }

  function renderCounts() {
    const counts = getCounts();
    document.getElementById('pendingCount').textContent = counts.Pending;
    document.getElementById('dueCount').textContent = counts['Due Today'];
    document.getElementById('overdueCount').textContent = counts.Overdue;
    document.getElementById('pendingTabCount').textContent = counts.Pending;
    document.getElementById('dueTabCount').textContent = counts['Due Today'];
    document.getElementById('overdueTabCount').textContent = counts.Overdue;
    document.getElementById('returnedTabCount').textContent = counts.Returned;
  }

  function getFilteredRecords() {
    const query = searchInput.value.trim().toLowerCase();
    return records.filter(function (record) {
      const statusMatches = selectedStatus === 'All' || record.status === selectedStatus;
      const searchText = [record.name, record.contact, record.equipment, record.items, record.status].join(' ').toLowerCase();
      return statusMatches && searchText.includes(query);
    });
  }

  function statusClass(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  function renderRows() {
    renderCounts();
    const filtered = getFilteredRecords();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    const visible = filtered.slice(start, start + pageSize);
    tbody.innerHTML = visible.map(function (record) {
      const dueClass = record.status === 'Overdue' ? 'is-overdue' : record.status === 'Due Today' ? 'is-today' : '';
      const actionLabel = record.status === 'Returned' ? 'Returned' : record.status === 'Overdue' ? 'View Details' : 'Process Return';
      const actionType = record.status === 'Returned' || record.status === 'Overdue' ? 'view' : 'process';
      const icon = actionType === 'view'
        ? '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
        : '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>';
      return '<tr class="' + (record.status === 'Overdue' ? 'row-overdue' : '') + '">' +
        '<td><div class="borrower-name">' + escapeHTML(record.name) + '</div><span class="borrower-sub">' + escapeHTML(record.contact) + '</span></td>' +
        '<td><div class="equipment-name">' + escapeHTML(record.equipment) + '</div><span class="equipment-sub">' + escapeHTML(record.items) + '</span></td>' +
        '<td><div class="due-date ' + dueClass + '">' + escapeHTML(record.dueDate) + '<span class="due-time">' + escapeHTML(record.dueTime) + '</span></div></td>' +
        '<td><span class="status-badge ' + statusClass(record.status) + '">' + escapeHTML(record.status) + '</span></td>' +
        '<td class="action-cell"><button type="button" class="action-btn ' + (record.status === 'Overdue' ? 'view' : record.status === 'Returned' ? 'returned-button' : '') + '" data-action="' + actionType + '" data-id="' + record.id + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icon + '</svg>' + actionLabel + '</button></td>' +
        '</tr>';
    }).join('');

    document.getElementById('emptyState').hidden = visible.length > 0;
    const shownStart = filtered.length ? start + 1 : 0;
    const shownEnd = Math.min(start + pageSize, filtered.length);
    document.getElementById('paginationSummary').textContent = 'Showing ' + shownStart + ' to ' + shownEnd + ' of ' + filtered.length + ' records';
    document.getElementById('pageIndicator').textContent = 'Page ' + currentPage + ' of ' + totalPages;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.getElementById('toastContainer').appendChild(toast);
    window.setTimeout(function () {
      toast.remove();
    }, 2800);
  }

  function getEquipmentRows(record) {
    if (record.returnItems) return record.returnItems;
    if (record.equipmentRows) {
      return record.equipmentRows.map(function (item) {
        return {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          inventoryId: item.inventoryId,
          restockBay: item.restockBay
        };
      });
    }

    const quantity = record.items.match(/\((\d+)\s+(pcs?|items?|sets?)\)/i);
    return [{
      name: record.equipment,
      quantity: quantity ? Number(quantity[1]) : 1,
      unit: quantity ? quantity[2].toLowerCase() : 'item',
      inventoryId: 'BSI-EQ-2023-' + String(record.id).padStart(3, '0'),
      restockBay: 'Restock Bay 1-B'
    }];
  }

  function getBorrowedAt(record) {
    if (record.borrowedAt) return record.borrowedAt;
    const borrowedDate = new Date(record.dueDate + ' 08:30 AM');
    borrowedDate.setDate(borrowedDate.getDate() - 3);
    return borrowedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
      ' • ' + borrowedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function getLocalDateTimeValue(date) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  function formatTurnover(value) {
    return new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
      ' • ' + new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function getReturnReference(record) {
    return record.returnReference || 'RET-2026-' + String(1108 + record.id).padStart(4, '0');
  }

  function getBorrowingReference(record) {
    return record.borrowingReference || 'TRX-2026-' + String(1103 + record.id).padStart(4, '0');
  }

  function formatQuantity(quantity, unit) {
    return quantity + ' ' + unit;
  }

  function renderProcessEquipment(record) {
    processItems = getEquipmentRows(record).map(function (item) {
      return {
        name: item.name,
        quantity: item.quantity,
        quantityReturned: item.quantity,
        unit: item.unit,
        inventoryId: item.inventoryId,
        restockBay: item.restockBay,
        condition: 'Good'
      };
    });
    document.getElementById('returningItemsCount').textContent = processItems.length + ' Returning Items';
    document.getElementById('processEquipmentRows').innerHTML = processItems.map(function (item, index) {
      const equipmentIcon = /table|desk/i.test(item.name)
        ? '<path d="M3 9h18M5 9v10m14-10v10M8 5h8l2 4H6l2-4Z"/>'
        : '<path d="M4 13h16v6H4zM6 13V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M7 19v2m10-2v2"/>';
      return '<tr>' +
        '<td><div class="process-equipment-cell"><span class="process-equipment-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + equipmentIcon + '</svg></span>' +
        '<span class="process-equipment-copy"><strong>' + escapeHTML(item.name) + '</strong><small><span class="inventory-tag">' + escapeHTML(item.inventoryId) + '</span><span> • Borrowed: ' + formatQuantity(item.quantity, escapeHTML(item.unit)) + '</span><span> • ' + escapeHTML(item.restockBay) + '</span></small></span></div></td>' +
        '<td class="returning-amount"><span>RETURNING</span><strong><output data-return-amount="' + index + '">' + item.quantity + '</output> of ' + item.quantity + ' units</strong></td>' +
        '<td><div class="quantity-stepper"><button type="button" data-qty-step="-1" data-item-index="' + index + '" aria-label="Return one fewer ' + escapeHTML(item.name) + '">−</button><output data-qty-value="' + index + '">' + item.quantity + '</output><button type="button" data-qty-step="1" data-item-index="' + index + '" aria-label="Return one more ' + escapeHTML(item.name) + '">+</button></div></td>' +
        '</tr>';
    }).join('');
    updateInspectionCounts();
  }

  function updateInspectionCounts() {
    const borrowedQuantity = processItems.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
    const returnedQuantity = processItems.reduce(function (sum, item) {
      return sum + item.quantityReturned;
    }, 0);
    const missingQuantity = Math.max(0, borrowedQuantity - returnedQuantity);
    const damagedQuantity = selectedProcessCondition === 'Damaged' ? returnedQuantity : 0;
    document.getElementById('damagedQuantity').textContent = damagedQuantity;
    document.getElementById('missingQuantity').textContent = missingQuantity;
    document.getElementById('processBorrowedTotal').innerHTML = borrowedQuantity + ' <small>pcs</small>';
    document.getElementById('processReturnedTotal').innerHTML = returnedQuantity + ' <small>pcs</small>';
    document.getElementById('processDamagedTotal').innerHTML = damagedQuantity + ' <small>pcs</small>';
    document.getElementById('processMissingTotal').innerHTML = missingQuantity + ' <small>pcs</small>';
    const needsReview = selectedProcessCondition !== 'Good Condition' || damagedQuantity > 0 || missingQuantity > 0;
    document.getElementById('clearanceStatus').classList.toggle('needs-review', needsReview);
    document.getElementById('clearanceStatus').innerHTML = needsReview
      ? '<span aria-hidden="true">!</span> Needs Review'
      : '<span aria-hidden="true">✓</span> Ready for Clearance';
    document.querySelectorAll('.condition-option').forEach(function (button) {
      const selected = button.dataset.condition === selectedProcessCondition;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    processItems.forEach(function (item, index) {
      const returningAmount = document.querySelector('[data-return-amount="' + index + '"]');
      const quantityValue = document.querySelector('[data-qty-value="' + index + '"]');
      if (returningAmount) returningAmount.textContent = item.quantityReturned;
      if (quantityValue) quantityValue.textContent = item.quantityReturned;
      const minusButton = document.querySelector('[data-item-index="' + index + '"][data-qty-step="-1"]');
      const plusButton = document.querySelector('[data-item-index="' + index + '"][data-qty-step="1"]');
      if (minusButton) minusButton.disabled = item.quantityReturned <= 0;
      if (plusButton) plusButton.disabled = item.quantityReturned >= item.quantity;
    });
  }

  function renderDetailsEquipment(items) {
    document.getElementById('detailsEquipmentRows').innerHTML = items.map(function (item) {
      return '<tr>' +
        '<td class="return-equipment-name">' + escapeHTML(item.name) + '</td>' +
        '<td>' + formatQuantity(item.quantity, escapeHTML(item.unit)) + '</td>' +
        '<td>' + formatQuantity(item.quantityReturned, escapeHTML(item.unit)) + '</td>' +
        '<td><span class="condition-badge ' + (item.condition === 'Good' ? 'good' : 'needs-attention') + '"><span aria-hidden="true">' +
        (item.condition === 'Good' ? '✓' : '!') + '</span>' + escapeHTML(item.condition) + '</span></td>' +
        '</tr>';
    }).join('');
  }

  function openProcessView(record) {
    const now = new Date();
    const contactParts = record.contact.split(' • ');
    document.getElementById('processBorrowerName').textContent = record.name;
    document.getElementById('processResidence').textContent = 'Resident borrower';
    document.getElementById('processContact').textContent = contactParts[1] || 'Not provided';
    document.getElementById('processContactPurok').textContent = contactParts[0] || 'Resident borrower';
    document.getElementById('processDeadline').textContent = record.dueDate;
    document.getElementById('processDueTime').textContent = record.dueTime.replace(/\s*\((Today|Overdue)\)/, '') + ' (Cut-off)';
    document.getElementById('turnoverTime').value = getLocalDateTimeValue(now);
    updateProcessTime(record);
    document.getElementById('returnNotes').value = '';
    document.getElementById('remarksCharacterCount').textContent = '0';
    selectedProcessCondition = 'Good Condition';
    document.getElementById('processEquipmentRows').innerHTML = '';
    renderProcessEquipment(record);
  }

  function updateProcessTime(record) {
    const turnoverValue = document.getElementById('turnoverTime').value;
    const dueValue = record.dueDate + ' ' + record.dueTime.replace(/\s*\((Today|Overdue)\)/, '');
    const status = new Date(turnoverValue) <= new Date(dueValue) ? 'On-Time Check-In' : 'Late Check-In';
    document.getElementById('processTurnoverStatus').textContent = status;
    document.getElementById('processTurnoverStatus').classList.toggle('late', status === 'Late Check-In');
  }

  function makeStoredReturn(record) {
    const rows = getEquipmentRows(record).map(function (item) {
      return {
        name: item.name,
        quantity: item.quantity,
        quantityReturned: item.quantity,
        unit: item.unit,
        condition: record.condition && record.condition !== 'Good condition' ? record.condition : 'Good'
      };
    });
    return {
      items: rows,
      overallCondition: 'Good (Inspected & Verified)',
      damagedQuantity: 0,
      missingQuantity: 0,
      notes: record.notes || 'All returned equipment was inspected. No damage or missing units were recorded.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      timestamp: record.dueDate + ' • ' + record.dueTime.replace(/\s*\((Today|Overdue)\)/, ''),
      turnoverStatus: 'Returned On Time'
    };
  }

  function openDetailsView(record) {
    const isReturned = record.status === 'Returned';
    const inspection = record.returnInspection || (isReturned ? makeStoredReturn(record) : null);
    const items = inspection ? inspection.items : getEquipmentRows(record).map(function (item) {
      return {
        name: item.name,
        quantity: item.quantity,
        quantityReturned: 0,
        unit: item.unit,
        condition: 'Awaiting inspection'
      };
    });
    const turnoverStatus = inspection ? inspection.turnoverStatus : 'Return pending';

    const modalStatus = document.getElementById('modalStatus');
    modalStatus.hidden = false;
    modalStatus.classList.toggle('overdue-state', !isReturned);
    modalStatus.textContent = isReturned ? 'Returned' : record.status;
    document.getElementById('returnReference').textContent = getReturnReference(record);
    document.getElementById('borrowingReference').textContent = getBorrowingReference(record);
    document.getElementById('detailsBorrowerName').textContent = record.name;
    document.getElementById('detailsBorrowedAt').textContent = getBorrowedAt(record);
    document.getElementById('detailsDeadline').textContent = record.dueDate + ' • ' + record.dueTime.replace(/\s*\((Today|Overdue)\)/, '');
    document.getElementById('detailsTurnoverAt').textContent = inspection ? inspection.timestamp : 'Not recorded';
    document.getElementById('detailsTurnoverStatus').textContent = turnoverStatus;
    document.getElementById('detailsTurnoverStatus').classList.toggle('late', turnoverStatus === 'Returned Late');
    renderDetailsEquipment(items);
    document.getElementById('detailsOverallCondition').textContent = inspection ? inspection.overallCondition : 'Pending inspection';
    document.getElementById('detailsDamagedQuantity').textContent = (inspection ? inspection.damagedQuantity : 0) + ' pcs';
    document.getElementById('detailsMissingQuantity').textContent = (inspection ? inspection.missingQuantity : items.reduce(function (sum, item) {
      return sum + item.quantity - item.quantityReturned;
    }, 0)) + ' pcs';
    document.getElementById('detailsNotes').textContent = inspection ? inspection.notes : 'Physical inspection has not been completed.';
    document.getElementById('detailsStaffName').textContent = inspection ? inspection.staffName : 'Not assigned';
    document.getElementById('detailsStaffRole').textContent = inspection ? inspection.staffRole : 'Pending inspection';
    document.getElementById('detailsTimestamp').textContent = inspection ? inspection.timestamp : '';
    document.getElementById('detailsProcessBtn').hidden = isReturned;
    document.getElementById('printReturnReceiptBtn').hidden = !isReturned;
    document.getElementById('closeDetailsBtn').hidden = !isReturned;
    document.getElementById('cancelReturnBtn').hidden = isReturned;
  }

  function openModal(record, mode) {
    activeRecord = record;
    modalMode = mode;
    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('processView').hidden = mode !== 'process';
    document.getElementById('detailsView').hidden = mode !== 'details';
    document.getElementById('modalTitle').textContent = mode === 'process' ? 'Process Equipment' : 'Return Details';
    document.getElementById('modalStatus').hidden = mode === 'process';
    document.getElementById('processTransactionRef').hidden = mode !== 'process';
    document.getElementById('processTransactionRef').textContent = getBorrowingReference(record);
    document.getElementById('returnReferenceGroup').hidden = mode === 'process';
    document.getElementById('borrowingReferenceGroup').hidden = mode === 'process';
    document.getElementById('returnForm').querySelectorAll('input, select, textarea').forEach(function (control) {
      control.disabled = mode === 'details';
    });
    document.getElementById('completeReturnBtn').hidden = mode !== 'process';
    document.getElementById('inspectedBy').hidden = mode !== 'process';
    document.getElementById('detailsProcessBtn').hidden = true;
    document.getElementById('printReturnReceiptBtn').hidden = true;
    document.getElementById('closeDetailsBtn').hidden = true;
    document.getElementById('cancelReturnBtn').hidden = false;

    if (mode === 'process') {
      document.getElementById('returnReference').textContent = 'Assigned on completion';
      document.getElementById('borrowingReference').textContent = getBorrowingReference(record);
      document.getElementById('processView').querySelectorAll('input, select, textarea').forEach(function (control) {
        control.disabled = false;
      });
      openProcessView(record);
      document.getElementById('turnoverTime').focus();
      return;
    }

    openDetailsView(record);
    document.getElementById('detailsProcessBtn').focus();
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = '';
    activeRecord = null;
  }

  tbody.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const record = records.find(function (item) { return item.id === Number(button.dataset.id); });
    if (record) openModal(record, button.dataset.action === 'process' ? 'process' : 'details');
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      selectedStatus = tab.dataset.status;
      currentPage = 1;
      tabs.forEach(function (item) {
        const isSelected = item === tab;
        item.classList.toggle('active', isSelected);
        item.setAttribute('aria-selected', String(isSelected));
      });
      renderRows();
    });
  });

  searchInput.addEventListener('input', function () {
    currentPage = 1;
    renderRows();
  });

  prevBtn.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage -= 1;
      renderRows();
    }
  });
  nextBtn.addEventListener('click', function () {
    const totalPages = Math.ceil(getFilteredRecords().length / pageSize);
    if (currentPage < totalPages) {
      currentPage += 1;
      renderRows();
    }
  });

  document.getElementById('processEquipmentRows').addEventListener('click', function (event) {
    const button = event.target.closest('button[data-qty-step]');
    if (!button) return;
    const item = processItems[Number(button.dataset.itemIndex)];
    if (!item) return;
    item.quantityReturned = Math.max(0, Math.min(item.quantity, item.quantityReturned + Number(button.dataset.qtyStep)));
    const missingQuantity = processItems.reduce(function (sum, equipment) {
      return sum + equipment.quantity - equipment.quantityReturned;
    }, 0);
    if (missingQuantity > 0 && selectedProcessCondition === 'Good Condition') {
      selectedProcessCondition = 'Missing Items';
    } else if (missingQuantity === 0 && selectedProcessCondition === 'Missing Items') {
      selectedProcessCondition = 'Good Condition';
    }
    updateInspectionCounts();
  });

  document.querySelectorAll('.condition-option').forEach(function (button) {
    button.addEventListener('click', function () {
      selectedProcessCondition = button.dataset.condition;
      if (selectedProcessCondition === 'Missing Items' && processItems.every(function (item) {
        return item.quantityReturned === item.quantity;
      })) {
        const lastItem = processItems[processItems.length - 1];
        if (lastItem && lastItem.quantityReturned > 0) lastItem.quantityReturned -= 1;
      } else if (selectedProcessCondition === 'Good Condition') {
        processItems.forEach(function (item) { item.quantityReturned = item.quantity; });
      }
      updateInspectionCounts();
    });
  });

  document.getElementById('turnoverTime').addEventListener('input', function () {
    if (activeRecord) updateProcessTime(activeRecord);
  });
  document.getElementById('turnoverTime').addEventListener('change', function () {
    if (activeRecord) updateProcessTime(activeRecord);
  });
  document.getElementById('returnNotes').addEventListener('input', function (event) {
    document.getElementById('remarksCharacterCount').textContent = event.target.value.length;
  });

  returnForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!activeRecord || modalMode !== 'process') return;

    const returnedItems = processItems.map(function (item) {
      return {
        name: item.name,
        quantity: item.quantity,
        quantityReturned: item.quantityReturned,
        unit: item.unit,
        inventoryId: item.inventoryId,
        restockBay: item.restockBay,
        condition: selectedProcessCondition === 'Damaged' ? 'Damaged' : item.quantityReturned < item.quantity ? 'Missing' : 'Good'
      };
    });
    const missingQuantity = returnedItems.reduce(function (sum, item) {
      return sum + item.quantity - item.quantityReturned;
    }, 0);
    const damagedQuantity = selectedProcessCondition === 'Damaged'
      ? returnedItems.reduce(function (sum, item) { return sum + item.quantityReturned; }, 0)
      : 0;
    const turnoverValue = document.getElementById('turnoverTime').value;
    const dueValue = activeRecord.dueDate + ' ' + activeRecord.dueTime.replace(/\s*\((Today|Overdue)\)/, '');
    const turnoverStatus = new Date(turnoverValue) <= new Date(dueValue) ? 'Returned On Time' : 'Returned Late';
    const borrowerName = activeRecord.name;

    activeRecord.borrowedAt = getBorrowedAt(activeRecord);
    activeRecord.borrowingReference = getBorrowingReference(activeRecord);
    activeRecord.returnReference = getReturnReference(activeRecord);
    activeRecord.returnedAt = turnoverValue;
    activeRecord.returnItems = returnedItems;
    activeRecord.returnInspection = {
      items: returnedItems,
      overallCondition: selectedProcessCondition === 'Good Condition'
        ? 'Good (Inspected & Verified)'
        : selectedProcessCondition === 'Damaged'
          ? 'Returned with Damage'
          : 'Incomplete Return',
      damagedQuantity: damagedQuantity,
      missingQuantity: missingQuantity,
      notes: document.getElementById('returnNotes').value.trim() || 'No additional inspection remarks.',
      staffName: 'Solana Rodrigo',
      staffRole: 'Barangay Staff',
      timestamp: formatTurnover(turnoverValue),
      turnoverStatus: turnoverStatus
    };
    activeRecord.status = 'Returned';
    activeRecord.condition = activeRecord.returnInspection.overallCondition;
    activeRecord.notes = activeRecord.returnInspection.notes;
    closeModal();
    renderRows();
    showToast('Return recorded for ' + borrowerName + '.');
  });

  document.getElementById('detailsProcessBtn').addEventListener('click', function () {
    if (activeRecord) openModal(activeRecord, 'process');
  });
  document.getElementById('printReturnReceiptBtn').addEventListener('click', function () {
    window.print();
  });

  modalBackdrop.addEventListener('click', function (event) {
    if (event.target === modalBackdrop || event.target.closest('[data-close-modal]')) closeModal();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
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

  const mobileMenuButton = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  mobileMenuButton.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('mobile-open');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.getElementById('logoutBtn').addEventListener('click', function () {
    showToast('Session locked for Solana Rodrigo (Staff).');
  });

  renderRows();
}());
