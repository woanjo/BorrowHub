(function () {
  'use strict';

  // Dataset for Recent Borrowing Transactions across pages 1, 2, and 3
  const transactionsPages = {
    1: [
      {
        name: 'Maria Santos',
        subtext: 'Resident • Purok 2',
        equipment: '40 Monobloc Chairs, 4 Foldable Tables',
        dateBorrowed: 'Nov 4, 2026',
        dueDate: 'Nov 7, 2026',
        dueStyle: 'normal',
        status: 'Pending',
        badgeType: 'green',
        isOverdueRow: false
      },
      {
        name: 'Roberto Diaz',
        subtext: 'Barangay Council• Purok 1',
        equipment: '2 Heavy Duty Tent (Canopy 10×10)',
        dateBorrowed: 'Nov 2, 2026',
        dueDate: 'Nov 04, 2026',
        dueStyle: 'bold-dark',
        status: 'Due Today',
        badgeType: 'green',
        isOverdueRow: false
      },
      {
        name: 'Eduardo Ramos',
        subtext: 'Zone 3 Homeowners • Purok 3',
        equipment: '1 Megaphone, 1 First Aid Kit Box',
        dateBorrowed: 'Oct 20, 2026',
        dueDate: 'Nov 3, 2026',
        dueStyle: 'bold-red',
        status: 'Overdue',
        badgeType: 'overdue',
        isOverdueRow: true
      },
      {
        name: 'Ricardo Dalisay',
        subtext: 'Resident • Purok 1',
        equipment: '1 Portable PA Sound System, 1 Wireless Mic',
        dateBorrowed: 'Oct 28, 2026',
        dueDate: 'Nov 4, 2026',
        dueStyle: 'bold-dark',
        status: 'Due Today',
        badgeType: 'green',
        isOverdueRow: false
      },
      {
        name: 'Pedro Mendoza',
        subtext: 'Resident • Purok 1',
        equipment: '30 Monobloc Chairs, 3 Tents',
        dateBorrowed: 'Oct 20, 10:00',
        dueDate: 'Oct 22, 17:00',
        dueStyle: 'normal',
        status: 'Returned',
        badgeType: 'returned',
        isOverdueRow: false
      }
    ],
    2: [
      {
        name: 'Carlos Mendoza',
        subtext: 'SK Youth Sports Committee • Purok 1',
        equipment: '5 Basketballs, 2 Volleyball Nets',
        dateBorrowed: 'Oct 21, 2026',
        dueDate: 'Oct 24, 2026',
        dueStyle: 'bold-red',
        status: 'Overdue',
        badgeType: 'overdue',
        isOverdueRow: true
      },
      {
        name: 'Elena Villanueva',
        subtext: 'Purok 4 Women’s Club • Purok 4',
        equipment: '25 Monobloc Chairs, 2 Banquet Tables',
        dateBorrowed: 'Nov 1, 2026',
        dueDate: 'Nov 6, 2026',
        dueStyle: 'normal',
        status: 'Pending',
        badgeType: 'green',
        isOverdueRow: false
      },
      {
        name: 'Roberto Gomez',
        subtext: 'Purok 5 Farmers Assoc. • Purok 5',
        equipment: '1 Water Pump & Heavy Hose Set',
        dateBorrowed: 'Oct 22, 2026',
        dueDate: 'Oct 24, 2026',
        dueStyle: 'bold-red',
        status: 'Overdue',
        badgeType: 'overdue',
        isOverdueRow: true
      },
      {
        name: 'Liza Soberano-Cruz',
        subtext: 'Resident • Purok 2',
        equipment: '15 Monobloc Chairs, 1 Canopy Tent',
        dateBorrowed: 'Oct 18, 2026',
        dueDate: 'Oct 20, 2026',
        dueStyle: 'normal',
        status: 'Returned',
        badgeType: 'returned',
        isOverdueRow: false
      },
      {
        name: 'Antonio Reyes',
        subtext: 'Barangay Tanod Unit • Purok 3',
        equipment: '4 Two-Way Radios, 2 Searchlights',
        dateBorrowed: 'Nov 3, 2026',
        dueDate: 'Nov 8, 2026',
        dueStyle: 'normal',
        status: 'Pending',
        badgeType: 'green',
        isOverdueRow: false
      }
    ],
    3: [
      {
        name: 'Clarissa Bautista',
        subtext: 'Daycare Center Staff • Purok 1',
        equipment: '20 Kiddie Chairs, 4 Activity Tables',
        dateBorrowed: 'Oct 15, 2026',
        dueDate: 'Oct 19, 2026',
        dueStyle: 'normal',
        status: 'Returned',
        badgeType: 'returned',
        isOverdueRow: false
      },
      {
        name: 'Fernando Tolentino',
        subtext: 'Resident • Purok 6',
        equipment: '1 Grass Cutter, 2 Wheelbarrows',
        dateBorrowed: 'Nov 2, 2026',
        dueDate: 'Nov 4, 2026',
        dueStyle: 'bold-dark',
        status: 'Due Today',
        badgeType: 'green',
        isOverdueRow: false
      },
      {
        name: 'Marisol De Leon',
        subtext: 'Senior Citizens Org • Purok 2',
        equipment: '50 Monobloc Chairs, 1 PA Sound System',
        dateBorrowed: 'Oct 12, 2026',
        dueDate: 'Oct 14, 2026',
        dueStyle: 'normal',
        status: 'Returned',
        badgeType: 'returned',
        isOverdueRow: false
      },
      {
        name: 'Jomar Aquino',
        subtext: 'Resident • Purok 4',
        equipment: '1 Extension Ladder (16ft)',
        dateBorrowed: 'Nov 3, 2026',
        dueDate: 'Nov 5, 2026',
        dueStyle: 'normal',
        status: 'Pending',
        badgeType: 'green',
        isOverdueRow: false
      },
      {
        name: 'Teresa Magbanua',
        subtext: 'Health Center • Purok 1',
        equipment: '2 Folding Stretchers, 1 Emergency Tent',
        dateBorrowed: 'Oct 10, 2026',
        dueDate: 'Oct 13, 2026',
        dueStyle: 'normal',
        status: 'Returned',
        badgeType: 'returned',
        isOverdueRow: false
      }
    ]
  };

  let currentPage = 1;
  const totalPages = 3;
  const totalRecords = 142;
  const pageSize = 5;

  const tbody = document.getElementById('transactionsBody');
  const summaryEl = document.getElementById('paginationSummary');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const pageBtns = document.querySelectorAll('.page-btn[data-page]');

  function renderTransactions(page) {
    const rows = transactionsPages[page] || transactionsPages[1];
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
            <div class="td-borrower-sub">${row.subtext}</div>
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

    const startIdx = (page - 1) * pageSize + 1;
    const endIdx = page * pageSize;
    summaryEl.innerHTML = `Showing <strong>${startIdx} - ${endIdx}</strong> of ${totalRecords} Borrowers`;

    pageBtns.forEach(btn => {
      const btnPage = Number(btn.getAttribute('data-page'));
      btn.classList.toggle('active', btnPage === page);
    });

    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
  }

  // Pagination event listeners
  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = Number(btn.getAttribute('data-page'));
      if (targetPage !== currentPage) {
        currentPage = targetPage;
        renderTransactions(currentPage);
      }
    });
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTransactions(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTransactions(currentPage);
    }
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

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  // Top navigation active tab switching & subtle feedback
  const navButtons = document.querySelectorAll('.nav-btn[data-nav]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      navLinks.classList.remove('mobile-open');

      const section = btn.getAttribute('data-nav');
      if (section !== 'Dashboard') {
        showToast(`Switched view to ${section} module`);
      }
    });
  });

  // Toast notification helper
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message) {
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

  // Attach toast notifications to interactive links and dropdown items
  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      adminWrapper.classList.remove('open');
      showToast(el.getAttribute('data-toast'));
    });
  });

  // Initial render of Page 1
  renderTransactions(1);
})();
