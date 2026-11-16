const staff = [
    {
        id: "STF-2026-0008",
        name: "Danilo Soriano",
        username: "dsoriano",
        email: "d.soriano@gmail.com",
        phone: "0921-884-3329",
        role: "Staff",
        status: "Active",
        created: "Aug 24, 2026",
        initials: "DS",
        tone: ""
    },
    {
        id: "STF-2026-0009",
        name: "Angelica Reyes",
        username: "areyes",
        email: "a.reyes@gmail.com",
        phone: "0917-555-0123",
        role: "Staff",
        status: "Active",
        created: "Aug 24, 2026",
        initials: "AR",
        tone: "a2"
    },
    {
        id: "STF-2026-0010",
        name: "Joshua Flores",
        username: "jflores",
        email: "j.flores@gmail.com",
        phone: "0922-555-0188",
        role: "Staff",
        status: "Active",
        created: "Aug 25, 2026",
        initials: "JF",
        tone: "a3"
    },
    {
        id: "STF-2026-0011",
        name: "Gabriela Flores",
        username: "gabflores",
        email: "gab.flores@gmail.com",
        phone: "0918-555-0111",
        role: "Admin",
        status: "Active",
        created: "Aug 25, 2026",
        initials: "GF",
        tone: "a4",
        you: true
    },
    {
        id: "STF-2026-0012",
        name: "Hon. Rolando Macaraeg",
        username: "rmacaraeg",
        email: "r.macaraeg@gmail.com",
        phone: "0919-555-0132",
        role: "Staff",
        status: "Active",
        created: "Aug 26, 2026",
        initials: "RM",
        tone: "a5"
    },
    {
        id: "STF-2026-0013",
        name: "Ramon Bautista",
        username: "rbautista",
        email: "r.bautista@gmail.com",
        phone: "0920-555-0145",
        role: "Staff",
        status: "Inactive",
        created: "Aug 27, 2026",
        initials: "RB",
        tone: "a6"
    }
];

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
let filter = "All", currentRole = "Admin", editingId = null;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function render() {
    const q = $("searchInput").value.toLowerCase();
    const rows = staff.filter(s => (filter === "All" || s.role === filter) && (`${s.name} ${s.email} ${s.username}`.toLowerCase().includes(q)));
    $("staffRows").innerHTML = rows.map(s => `<tr>
  <td><div class="person-cell"><span class="initials ${s.tone}">${esc(s.initials)}</span><span>${esc(s.name)} ${s.you ? '<span class="you-tag">YOU</span>' : ''}</span></div></td>
  <td>@${esc(s.username)}</td><td>${esc(s.email)}</td>
  <td><span class="role-pill ${s.role === "Admin" ? "admin" : ""}">
<svg xmlns="http://www.w3.org/2000/svg" width="13" height="11" viewBox="0 0 13 11" fill="none">
<path d="M0 10.5V8.86667C0 8.54583 0.0826389 8.24444 0.247917 7.9625C0.413194 7.68056 0.641667 7.46667 0.933333 7.32083C1.42917 7.06806 1.98819 6.85417 2.61042 6.67917C3.23264 6.50417 3.91806 6.41667 4.66667 6.41667C5.41528 6.41667 6.10069 6.50417 6.72292 6.67917C7.34514 6.85417 7.90417 7.06806 8.4 7.32083C8.69167 7.46667 8.92014 7.68056 9.08542 7.9625C9.25069 8.24444 9.33333 8.54583 9.33333 8.86667V10.5H0V10.5M1.16667 9.33333H8.16667V8.86667C8.16667 8.75972 8.13993 8.6625 8.08646 8.575C8.03299 8.4875 7.9625 8.41944 7.875 8.37083C7.525 8.19583 7.07535 8.02083 6.52604 7.84583C5.97674 7.67083 5.35694 7.58333 4.66667 7.58333C3.97639 7.58333 3.3566 7.67083 2.80729 7.84583C2.25799 8.02083 1.80833 8.19583 1.45833 8.37083C1.37083 8.41944 1.30035 8.4875 1.24688 8.575C1.1934 8.6625 1.16667 8.75972 1.16667 8.86667V9.33333V9.33333M4.66667 5.83333C4.025 5.83333 3.47569 5.60486 3.01875 5.14792C2.56181 4.69097 2.33333 4.14167 2.33333 3.5H2.1875C2.1 3.5 2.02951 3.47326 1.97604 3.41979C1.92257 3.36632 1.89583 3.29583 1.89583 3.20833C1.89583 3.12083 1.92257 3.05035 1.97604 2.99688C2.02951 2.9434 2.1 2.91667 2.1875 2.91667H2.33333C2.33333 2.47917 2.44028 2.08542 2.65417 1.73542C2.86806 1.38542 3.15 1.10833 3.5 0.904167V1.45833C3.5 1.54583 3.52674 1.61632 3.58021 1.66979C3.63368 1.72326 3.70417 1.75 3.79167 1.75C3.87917 1.75 3.94965 1.72326 4.00313 1.66979C4.0566 1.61632 4.08333 1.54583 4.08333 1.45833V0.670833C4.17083 0.641667 4.26319 0.619792 4.36042 0.605208C4.45764 0.590625 4.55972 0.583333 4.66667 0.583333C4.77361 0.583333 4.87569 0.590625 4.97292 0.605208C5.07014 0.619792 5.1625 0.641667 5.25 0.670833V1.45833C5.25 1.54583 5.27674 1.61632 5.33021 1.66979C5.38368 1.72326 5.45417 1.75 5.54167 1.75C5.62917 1.75 5.69965 1.72326 5.75313 1.66979C5.8066 1.61632 5.83333 1.54583 5.83333 1.45833V0.904167C6.18333 1.10833 6.46528 1.38542 6.67917 1.73542C6.89306 2.08542 7 2.47917 7 2.91667H7.14583C7.23333 2.91667 7.30382 2.9434 7.35729 2.99688C7.41076 3.05035 7.4375 3.12083 7.4375 3.20833C7.4375 3.29583 7.41076 3.36632 7.35729 3.41979C7.30382 3.47326 7.23333 3.5 7.14583 3.5H7C7 4.14167 6.77153 4.69097 6.31458 5.14792C5.85764 5.60486 5.30833 5.83333 4.66667 5.83333V5.83333M4.66667 4.66667C4.9875 4.66667 5.26215 4.55243 5.49062 4.32396C5.7191 4.09549 5.83333 3.82083 5.83333 3.5H3.5C3.5 3.82083 3.61424 4.09549 3.84271 4.32396C4.07118 4.55243 4.34583 4.66667 4.66667 4.66667V4.66667M9.04167 7L8.95417 6.5625C8.89583 6.54306 8.83993 6.52118 8.78646 6.49687C8.73299 6.47257 8.68194 6.43611 8.63333 6.3875L8.225 6.53333L7.93333 6.00833L8.25417 5.71667C8.25417 5.6875 8.25417 5.65833 8.25417 5.62917C8.25417 5.6 8.25417 5.57083 8.25417 5.54167C8.25417 5.5125 8.25417 5.48333 8.25417 5.45417C8.25417 5.425 8.25417 5.39583 8.25417 5.36667L7.93333 5.075L8.225 4.55L8.63333 4.69583C8.67222 4.65694 8.72083 4.62292 8.77917 4.59375C8.8375 4.56458 8.89583 4.54028 8.95417 4.52083L9.04167 4.08333H9.625L9.7125 4.52083C9.77083 4.54028 9.82917 4.56458 9.8875 4.59375C9.94583 4.62292 9.99444 4.65694 10.0333 4.69583L10.4417 4.55L10.7333 5.075L10.4125 5.36667C10.4125 5.39583 10.4125 5.425 10.4125 5.45417C10.4125 5.48333 10.4125 5.5125 10.4125 5.54167C10.4125 5.57083 10.4125 5.6 10.4125 5.62917C10.4125 5.65833 10.4125 5.6875 10.4125 5.71667L10.7333 6.00833L10.4417 6.53333L10.0333 6.3875C9.98472 6.43611 9.93368 6.47257 9.88021 6.49687C9.82674 6.52118 9.77083 6.54306 9.7125 6.5625L9.625 7H9.04167V7M9.33333 5.97917C9.45 5.97917 9.55208 5.93542 9.63958 5.84792C9.72708 5.76042 9.77083 5.65833 9.77083 5.54167C9.77083 5.425 9.72708 5.32292 9.63958 5.23542C9.55208 5.14792 9.45 5.10417 9.33333 5.10417C9.21667 5.10417 9.11458 5.14792 9.02708 5.23542C8.93958 5.32292 8.89583 5.425 8.89583 5.54167C8.89583 5.65833 8.93958 5.76042 9.02708 5.84792C9.11458 5.93542 9.21667 5.97917 9.33333 5.97917V5.97917M10.3833 4.08333L10.2667 3.47083C10.1792 3.44167 10.099 3.40521 10.026 3.36146C9.95312 3.31771 9.8875 3.26667 9.82917 3.20833L9.21667 3.4125L8.80833 2.7125L9.30417 2.275C9.28472 2.22639 9.275 2.1875 9.275 2.15833C9.275 2.12917 9.275 2.09028 9.275 2.04167C9.275 1.99306 9.275 1.95417 9.275 1.925C9.275 1.89583 9.28472 1.85694 9.30417 1.80833L8.80833 1.37083L9.21667 0.670833L9.82917 0.875C9.8875 0.816667 9.95312 0.765625 10.026 0.721875C10.099 0.678125 10.1792 0.641667 10.2667 0.6125L10.3833 0H11.2L11.3167 0.6125C11.4042 0.641667 11.4844 0.678125 11.5573 0.721875C11.6302 0.765625 11.6958 0.816667 11.7542 0.875L12.3667 0.670833L12.775 1.37083L12.2792 1.80833C12.2986 1.85694 12.3083 1.89583 12.3083 1.925C12.3083 1.95417 12.3083 1.99306 12.3083 2.04167C12.3083 2.09028 12.3083 2.12917 12.3083 2.15833C12.3083 2.1875 12.2986 2.22639 12.2792 2.275L12.775 2.7125L12.3667 3.4125L11.7542 3.20833C11.6958 3.26667 11.6302 3.31771 11.5573 3.36146C11.4844 3.40521 11.4042 3.44167 11.3167 3.47083L11.2 4.08333H10.3833V4.08333M10.7917 2.77083C10.9958 2.77083 11.1684 2.70035 11.3094 2.55938C11.4503 2.4184 11.5208 2.24583 11.5208 2.04167C11.5208 1.8375 11.4503 1.66493 11.3094 1.52396C11.1684 1.38299 10.9958 1.3125 10.7917 1.3125C10.5875 1.3125 10.4149 1.38299 10.274 1.52396C10.133 1.66493 10.0625 1.8375 10.0625 2.04167C10.0625 2.24583 10.133 2.4184 10.274 2.55938C10.4149 2.70035 10.5875 2.77083 10.7917 2.77083V2.77083M4.66667 9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333V9.33333" fill="#486550"/>
</svg></i>${s.role}</span></td>
  <td><span class="status-pill ${s.status === "Inactive" ? "inactive" : ""}"><span class="dot green"></span></i>${s.status}</span></td>
  <td><div class="actions"><button data-action="view" data-id="${s.id}">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11" fill="none">
<path d="M7.79167 8.5C8.67708 8.5 9.42969 8.1901 10.0495 7.57031C10.6693 6.95052 10.9792 6.19792 10.9792 5.3125C10.9792 4.42708 10.6693 3.67448 10.0495 3.05469C9.42969 2.4349 8.67708 2.125 7.79167 2.125C6.90625 2.125 6.15365 2.4349 5.53385 3.05469C4.91406 3.67448 4.60417 4.42708 4.60417 5.3125C4.60417 6.19792 4.91406 6.95052 5.53385 7.57031C6.15365 8.1901 6.90625 8.5 7.79167 8.5V8.5M7.79167 7.225C7.26042 7.225 6.80885 7.03906 6.43698 6.66719C6.0651 6.29531 5.87917 5.84375 5.87917 5.3125C5.87917 4.78125 6.0651 4.32969 6.43698 3.95781C6.80885 3.58594 7.26042 3.4 7.79167 3.4C8.32292 3.4 8.77448 3.58594 9.14635 3.95781C9.51823 4.32969 9.70417 4.78125 9.70417 5.3125C9.70417 5.84375 9.51823 6.29531 9.14635 6.66719C8.77448 7.03906 8.32292 7.225 7.79167 7.225V7.225M7.79167 10.625C6.06806 10.625 4.49792 10.1439 3.08125 9.18177C1.66458 8.21962 0.6375 6.92986 0 5.3125C0.6375 3.69514 1.66458 2.40538 3.08125 1.44323C4.49792 0.481076 6.06806 0 7.79167 0C9.51528 0 11.0854 0.481076 12.5021 1.44323C13.9188 2.40538 14.9458 3.69514 15.5833 5.3125C14.9458 6.92986 13.9188 8.21962 12.5021 9.18177C11.0854 10.1439 9.51528 10.625 7.79167 10.625V10.625M7.79167 5.3125V5.3125V5.3125V5.3125V5.3125V5.3125V5.3125V5.3125V5.3125V5.3125M7.79167 9.20833C9.12569 9.20833 10.3505 8.85712 11.4661 8.15469C12.5818 7.45226 13.4347 6.50486 14.025 5.3125C13.4347 4.12014 12.5818 3.17274 11.4661 2.47031C10.3505 1.76788 9.12569 1.41667 7.79167 1.41667C6.45764 1.41667 5.23281 1.76788 4.11719 2.47031C3.00156 3.17274 2.14861 4.12014 1.55833 5.3125C2.14861 6.50486 3.00156 7.45226 4.11719 8.15469C5.23281 8.85712 6.45764 9.20833 7.79167 9.20833V9.20833" fill="#404944"/>
</svg> View Details</button><button data-action="edit" data-id="${s.id}"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
<path d="M1.41667 11.3333H2.42604L9.35 4.40938L8.34062 3.4L1.41667 10.324V11.3333V11.3333M0 12.75V9.73958L9.35 0.407292C9.49167 0.277431 9.64809 0.177083 9.81927 0.10625C9.99045 0.0354167 10.1705 0 10.3594 0C10.5483 0 10.7313 0.0354167 10.9083 0.10625C11.0854 0.177083 11.2389 0.283333 11.3687 0.425L12.3427 1.41667C12.4844 1.54653 12.5877 1.7 12.6526 1.87708C12.7175 2.05417 12.75 2.23125 12.75 2.40833C12.75 2.59722 12.7175 2.77726 12.6526 2.94844C12.5877 3.11962 12.4844 3.27604 12.3427 3.41771L3.01042 12.75H0V12.75M11.3333 2.40833V2.40833L10.3417 1.41667V1.41667L11.3333 2.40833V2.40833M8.83646 3.91354L8.34062 3.4V3.4L9.35 4.40938V4.40938L8.83646 3.91354V3.91354" fill="#404944"/>
</svg> Edit</button></div></td>
 </tr>`).join("") || '<tr><td colspan="6" style="text-align:center;padding:30px">No staff accounts found.</td></tr>';
    const active = staff.filter(s => s.status === "Active").length;
    $("totalCount").textContent = staff.length; $("activeCount").textContent = active; $("inactiveCount").textContent = staff.length - active;
    $("showingText").innerHTML = `Showing <b>${rows.length}</b> of <b>${staff.length}</b> staff accounts`;
}

function openModal(content) { 
    $("modalContent").innerHTML = content; 
    $("modalOverlay").classList.remove("hidden"); 
}

function closeModal() { $("modalOverlay").classList.add("hidden"); editingId = null; }
function viewStaff(id) {
    const s = staff.find(x => x.id === id); if (!s) return;
    openModal(`<div class="modal-header"><span class="modal-icon"><i class="fa-solid fa-id-card-clip"></i></span><div><h2 id="modalTitle">Admin/Staff Account Details <span class="id-tag">${s.id}</span></h2><span class="account-state">● ${s.status} Account</span></div></div>
 <div class="identity-card">
    <span class="big-initials">${s.initials}</span>
<div>
<h3>${esc(s.name)} <span class="role-pill ${s.role === "Admin" ? "admin" : ""}">${s.role}</span></h3><p>${s.role}</p><span class="identity-id"># ${s.id}</span></div></div>
 <div class="section-card"><h3><i class="fa-regular fa-file-lines"></i> ACCOUNT INFORMATION &amp; CONTACT INFO</h3><div class="info-grid">
 <div class="info-item"><i class="fa-solid fa-at"></i><div><small>Username</small><b>${esc(s.username)}</b></div></div>
 <div class="info-item"><i class="fa-regular fa-envelope"></i><div><small>Email</small><b>${esc(s.email)}</b></div></div>
 <div class="info-item"><i class="fa-solid fa-phone"></i><div><small>Contact Number</small><b>${esc(s.phone)}</b></div></div>
 <div class="info-item"><i class="fa-solid fa-shield-halved"></i><div><small>Date of Creation</small><b>${s.created}</b></div></div>
 </div></div><div class="modal-footer"><button class="soft-btn" data-close>Close</button><button class="primary-btn compact" id="editFromView"><i class="fa-solid fa-pen"></i> Edit Account</button></div>`);
    $("editFromView").onclick = () => editStaff(id);
}
function editStaff(id) {
    const s = staff.find(x => x.id === id); if (!s) return; editingId = id;
    openModal(`<div class="modal-header"><span class="modal-icon"><i class="fa-solid fa-user-gear"></i></span><div><h2 id="modalTitle">Edit Admin/Staff Account <span class="id-tag">${s.id}</span></h2></div></div>
 <form id="staffForm"><div class="form-grid">
 <div class="field"><label>Full Name <span class="required">*</span></label><input name="name" required value="${esc(s.name)}"></div>
 <div class="field"><label>Staff ID</label><input class="readonly" readonly value="${s.id}"></div>
 <div class="field"><label>Username <span class="required">*</span></label><input name="username" required value="${esc(s.username)}"></div>
 <div class="field"><label>Email Address <span class="required">*</span></label><input name="email" type="email" required value="${esc(s.email)}"></div>
 <div class="field"><label>Contact Number <span class="required">*</span></label><input name="phone" required value="${esc(s.phone)}"></div>
 <div class="field"><label>Role <span class="required">*</span></label><select name="role"><option ${s.role === "Staff" ? "selected" : ""}>Staff</option><option ${s.role === "Admin" ? "selected" : ""}>Admin</option></select></div>
 <div class="field full"><label>Operational Account Status</label><div class="status-options"><label class="status-option"><input type="radio" name="status" value="Active" ${s.status === "Active" ? "checked" : ""}> Active Duty</label><label class="status-option"><input type="radio" name="status" value="Inactive" ${s.status === "Inactive" ? "checked" : ""}> Inactive / On Leave</label></div></div>
 </div><div class="modal-footer"><button type="button" class="soft-btn" data-close>Cancel</button><button class="primary-btn compact" type="submit"><i class="fa-regular fa-floppy-disk"></i> Confirm Changes</button></div></form>`);
    $("staffForm").onsubmit = e => { e.preventDefault(); const d = new FormData(e.target); Object.assign(s, { name: d.get("name"), username: d.get("username"), email: d.get("email"), phone: d.get("phone"), role: d.get("role"), status: d.get("status") }); closeModal(); render(); toast("Staff account updated successfully."); };
}
function addStaff() {
    editingId = null;
    const next = String(14 + staff.length - 6).padStart(4, "0");
    openModal(`<div class="modal-header"><span class="modal-icon"><i class="fa-solid fa-user-plus"></i></span><div><h2 id="modalTitle">Add New Admin/Staff</h2></div></div>
 <form id="staffForm"><div class="form-grid">
 <div class="field"><label>Full Name <span class="required">*</span></label><input name="name" placeholder="Last, First M.I." required></div>
 <div class="field"><label>Staff ID <span class="required">*</span> <span class="field-note">Auto-generated</span></label><input class="readonly" readonly value="STF-2026-${next}"></div>
 <div class="field"><label>Username <span class="required">*</span></label><input name="username" required placeholder="e.g. jdelacruz"></div>
 <div class="field"><label>Email Address <span class="required">*</span></label><input name="email" type="email" required placeholder="name@gmail.com"></div>
 <div class="field"><label>Contact Number <span class="required">*</span></label><input name="phone" required placeholder="09XX-XXX-XXXX"></div>
 <div class="field"><label>Role <span class="required">*</span></label><select name="role"><option>Staff</option><option>Admin</option></select></div>
 <div class="field"><label>Temporary Password <span class="required">*</span></label><input name="password" type="password" required minlength="8" placeholder="At least 8 characters"><div class="field-note">Minimum of 8 characters with letters and numbers.</div></div>
 <div class="field"><label>Confirm Password <span class="required">*</span></label><input name="confirm" type="password" required minlength="8" placeholder="Re-enter password"></div>
 <div class="field full"><label>Initial Account Status <span class="required">*</span></label><div class="status-options"><label class="status-option"><input type="radio" name="status" value="Active" checked> Active</label></div></div>
 </div><div class="modal-footer"><button type="button" class="soft-btn" data-close>Cancel</button><button class="primary-btn compact" type="submit"><i class="fa-solid fa-user-check"></i> Create Staff Account</button></div></form>`);
    $("staffForm").onsubmit = e => { e.preventDefault(); const d = new FormData(e.target); if (d.get("password") !== d.get("confirm")) { toast("Passwords do not match."); return; } const id = `STF-2026-${String(8 + staff.length).padStart(4, "0")}`; const name = d.get("name"); staff.push({ id, name, username: d.get("username"), email: d.get("email"), phone: d.get("phone"), role: d.get("role"), status: "Active", created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), initials: name.split(/\s+/).slice(0, 2).map(x => x[0]).join("").toUpperCase(), tone: "a2" }); closeModal(); render(); toast("New account created."); };
}
function toast(msg) { $("toast").textContent = msg; $("toast").classList.remove("hidden"); setTimeout(() => $("toast").classList.add("hidden"), 2600); }
$("staffRows").addEventListener("click", e => { const b = e.target.closest("button[data-action]"); if (!b) return; b.dataset.action === "view" ? viewStaff(b.dataset.id) : editStaff(b.dataset.id); });
$("searchInput").addEventListener("input", render);
document.querySelectorAll(".filter-tabs button").forEach(b => b.addEventListener("click", () => { filter = b.dataset.filter; document.querySelectorAll(".filter-tabs button").forEach(x => x.classList.toggle("selected", x === b)); render(); }));
$("addStaffBtn").onclick = addStaff;
$("modalOverlay").addEventListener("click", e => { if (e.target === $("modalOverlay") || e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); $("restrictedOverlay").classList.add("hidden"); $("roleMenu").classList.add("hidden"); } });
$("administrationBtn").onclick = () => { if (currentRole !== "Admin") $("restrictedOverlay").classList.remove("hidden"); else toast("You are viewing Administration."); };
$("closeRestricted").onclick = () => $("restrictedOverlay").classList.add("hidden");
$("profileButton").onclick = () => $("roleMenu").classList.toggle("hidden");
document.querySelectorAll(".role-menu button").forEach(b => b.onclick = () => { currentRole = b.dataset.role; $("currentRole").textContent = currentRole; $("currentUser").textContent = currentRole === "Admin" ? "Gabriela Flores" : "Solana Rodrigo"; $("roleMenu").classList.add("hidden"); toast(`Preview role changed to ${currentRole}.`); });
render();