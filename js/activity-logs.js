const activities=[ {
    initials: "MC",
    staff:"Maria Teresa Cruz",
    role:"Admin", 
    avatar:"",
    activity:"Processed",
    category:"Returns",
    description:'Completed return inspection for <strong>40 Monobloc Chairs &amp; 4 Tables</strong> (Maria Santos - <code>TRX-2026-0104</code>). All items in good condition.',
    date:"Nov 7, 2026 · 04:30 PM",
    dateGroup:"today"
},
{
    initials: "DS", 
    staff:"Danilo Soriano", 
    role:"Staff", 
    avatar:"sage", 
    activity:"Added", 
    category:"Borrowing", 
    description:'Issued loan slip <code>#BBH-2026-10</code> to <strong>Roberto Diaz</strong> (Purok 4) for 2 sets Heavy-Duty Canopy Tent 10×10ft.', 
    date:"Nov 2, 2026 · 02:15 PM", 
    dateGroup:"week"
},
{
    initials: "MC", 
    staff:"Maria Teresa Cruz", 
    role:"Admin", 
    avatar:"", 
    activity:"Activated", 
    category:"Staff Management", 
    description:'Activated system account for Tanod Desk Officer <strong>Ramon Bautista</strong> (<code>@rbautista</code>).', 
    date:"Oct 26, 2026 · 11:20 AM", 
    dateGroup:"month"
},
{
    initials: "MC", 
    staff:"Maria Teresa Cruz", 
    role:"Admin", 
    avatar:"", 
    activity:"Updated", 
    category:"Staff Management", 
    description:'Modified role permissions and stockroom custody privileges for <strong>Danilo Soriano</strong>.', 
    date:"Oct 25, 2026 · 04:50 PM", 
    dateGroup:"month"
},
{
    initials: "AR", 
    staff:"Angelica Reyes", 
    role:"Staff", 
    avatar:"mint", 
    activity:"Deactivated", 
    category:"Equipment", 
    description:'Decommissioned 1 damaged Grass Cutter (<code>BSI-EQ-2021-008</code>) for repair assessment.', 
    date:"Oct 25, 2026 · 02:10 PM", 
    dateGroup:"month"
},
{
    initials: "JF", 
    staff:"Joshua Flores", 
    role:"Staff", 
    avatar:"gray", 
    activity:"Processed", 
    category:"Borrowing", 
    description:'Approved loan request for <strong>SK Council (Mark Alcantara)</strong> for 6 Molten Basketballs &amp; 1 Scoreboard.', 
    date:"Oct 12, 2026 · 08:45 AM", 
    dateGroup:"month"
},
{
    initials: "DS", 
    staff:"Danilo Soriano", 
    role:"Staff", 
    avatar:"sage", 
    activity:"Updated", 
    category:"Equipment", 
    description:'Updated condition and bay location for <strong>Gasoline Generator 3500W</strong> (Property Tag: <code>BSI-EQ-2022-045</code>) to <strong>Available</strong>.', 
    date:"Oct 5, 2026 · 09:18 AM", 
    dateGroup:"month"
},
{
    initials: "AR", 
    staff:"Angelica Reyes", 
    role:"Staff", 
    avatar:"mint", 
    activity:"Added", 
    category:"Borrowers", 
    description:'Registered new resident borrower <strong>Eduardo Ramos</strong> (Purok 5, ID: <code>BRG-BOR-2026-0091</code>).', 
    date:"Oct 4, 2026 · 10:05 AM", 
    dateGroup:"month"
}];

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
document.getElementById("menuToggle").addEventListener("click", () =>
  document.getElementById("mainNav").classList.toggle("open"));

renderRows();
