const activities=[];

const rows = document.getElementById("activityRows");
const searchInput = document.getElementById("searchInput");
const dateFilter = document.getElementById("dateFilter");
const tabs = [...document.querySelectorAll(".tab")];
let selectedCategory = "All Activities";
let currentPage = 1;
const pageSize = 8;

function renderRows() {
  const query = searchInput.value.trim().toLowerCase();
  const range = dateFilter.value;
  const filtered = activities.filter(item => {
    const searchable = `${item.staff} ${item.role} ${item.activity} ${item.category} ${item.description}`.toLowerCase();
    const categoryMatch = selectedCategory === "All Activities" || item.category === selectedCategory;
    const searchMatch = searchable.includes(query);
    const dateMatch = range === "all" || item.dateGroup === range ||
      (range === "week" && item.dateGroup === "today") ||
      (range === "month" && ["today","week","month"].includes(item.dateGroup));
    return categoryMatch && searchMatch && dateMatch;
  });

  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  rows.innerHTML = visible.map(item => `
    <tr>
      <td><div class="staff-cell"><span class="staff-avatar ${item.avatar}">${item.initials}</span>
      <span class="staff-name"><strong>${item.staff}</strong><small>${item.role}</small></span></div></td>
      <td><span class="status ${item.activity.toLowerCase()}">${item.activity}</span></td>
      <td class="module-cell">${item.category}</td>
      <td class="description">${item.description}</td>
      <td><span class="date-text">${item.date}</span></td>
    </tr>`).join("");

  document.getElementById("emptyState").hidden = visible.length > 0;
  document.getElementById("showingText").innerHTML =
    `Showing <strong>${visible.length}</strong> of <strong>${filtered.length === activities.length ? 842 : filtered.length}</strong> activities`;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= pages;
  document.querySelectorAll(".page-number").forEach(btn =>
    btn.classList.toggle("current", Number(btn.dataset.page) === currentPage));
}

// Administration dropdown toggle
const adminWrapper = document.getElementById('adminDropdownWrapper');
const adminBtn = document.getElementById('adminDropdownBtn');

adminBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  const isOpen = adminWrapper.classList.toggle('open');
  adminBtn.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (e) => {
  if (!adminWrapper.contains(e.target)) {
    adminWrapper.classList.remove('open');
    adminBtn.setAttribute('aria-expanded', 'false');
  }
});

tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  selectedCategory = tab.dataset.category;
  currentPage = 1;
  renderRows();
}));

searchInput.addEventListener("input", () => { currentPage = 1; renderRows(); });
dateFilter.addEventListener("change", () => { currentPage = 1; renderRows(); });
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) { currentPage--; renderRows(); }
});

document.getElementById("nextPage").addEventListener("click", () => { currentPage++; renderRows(); });
document.querySelectorAll(".page-number").forEach(btn => btn.addEventListener("click", () => {
  currentPage = Number(btn.dataset.page); renderRows();
}));

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

renderRows();
