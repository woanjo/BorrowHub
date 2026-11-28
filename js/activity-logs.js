const ACTIVITY_API = "php/activity-logs.php";

let activities = [];
let selectedCategory = "All Activities";
let currentPage = 1;

const pageSize = 8;

const rows = document.getElementById("activityRows");
const searchInput = document.getElementById("searchInput");
const dateFilter = document.getElementById("dateFilter");
const tabs = [...document.querySelectorAll(".tab")];

const emptyState = document.getElementById("emptyState");
const showingText = document.getElementById("showingText");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

// HELPER FUNCTIONS
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function parseJSON(value) {
    if (!value) return {};

    if (typeof value === "object") {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
}

function getCategory(tableName, oldData, newData) {
    switch (tableName.toLowerCase()) {
        case "staff":
            return "Staff Management";

        case "equipment":
        case "equipment_category":
            return "Equipment";

        case "borrower":
            return "Borrowers";

        case "borrowing":
        case "borrowing_item": {
            const data = {
                ...oldData,
                ...newData
            };

            const status = String(
                data.status ?? data.borrowing_status ?? ""
            ).toLowerCase();

            if (
                status.includes("return") ||
                data.returned_at ||
                data.return_date
            ) {
                return "Returns";
            }

            return "Borrowing";
        }

        default:
            return "Other Activities";
    }
}

function getActivityLabel(action) {
    switch (String(action).toUpperCase()) {
        case "INSERT":
            return "Added";

        case "UPDATE":
            return "Updated";

        case "DELETE":
            return "Deleted";

        default:
            return action;
    }
}

function getRecordName(data, tableName) {
    const possibleNames = [
        data.equipment_name,
        data.category_name,
        data.borrower_name,
        data.staff_name,
        data.name,
        data.firstname && data.lastname
            ? `${data.firstname} ${data.lastname}`
            : null,
        data.firstname,
        data.lastname,
        data.description
    ];

    const name = possibleNames.find(
        value => value && String(value).trim() !== ""
    );

    if (name) return name;

    const id = data.equipment_id ??
        data.category_id ??
        data.borrower_id ??
        data.staff_id ??
        data.borrowing_id;

    return id !== undefined
        ? `${tableName.replace("_", " ")} #${id}`
        : tableName.replace("_", " ");
}

function getDescription(item) {
    const oldData = parseJSON(item.old_data);
    const newData = parseJSON(item.new_data);

    const tableName = item.table_name.replace(/_/g, " ");
    const recordName = getRecordName(
        item.action === "DELETE" ? oldData : newData,
        item.table_name
    );

    const action = getActivityLabel(item.action);

    if (item.action === "INSERT") {
        return `Added ${recordName}.`;
    }

    if (item.action === "DELETE") {
        return `Deleted ${recordName}.`;
    }

    if (item.action === "UPDATE") {
        const ignoredFields = [
            "created_at",
            "updated_at",
            "modified_at"
        ];

        const changedFields = Object.keys(newData).filter(key => {
            return !ignoredFields.includes(key) &&
                JSON.stringify(oldData[key]) !==
                JSON.stringify(newData[key]);
        });

        if (changedFields.length > 0) {
            const fieldNames = changedFields
                .map(key => key.replace(/_/g, " "))
                .join(", ");

            return `Updated ${recordName}. Changed: ${fieldNames}.`;
        }

        return `Updated ${recordName} in ${tableName}.`;
    }

    return `${action} ${recordName}.`;
}

function getInitials(firstname, lastname) {
    const first = firstname?.trim()?.charAt(0) || "";
    const last = lastname?.trim()?.charAt(0) || "";

    return (first + last).toUpperCase() || "?";
}

function getAvatar(index) {
    const avatars = ["sage", "mint", "gray"];
    return avatars[index % avatars.length];
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

// CONVERT DATABASE RECORDS INTO DISPLAY RECORDS
function formatActivity(record, index) {
    const oldData = parseJSON(record.old_data);
    const newData = parseJSON(record.new_data);

    const staffName = record.firstname
        ? `${record.firstname} ${record.lastname || ""}`.trim()
        : "System";

    const role = record.role || (
        record.changed_by ? "Staff" : "System"
    );

    const category = getCategory(
        record.table_name,
        oldData,
        newData
    );

    return {
        id: record.audit_id,

        staff: staffName,
        role: role,

        initials: record.firstname
            ? getInitials(record.firstname, record.lastname)
            : "SY",

        avatar: getAvatar(index),

        activity: getActivityLabel(record.action),

        category: category,

        description: getDescription(record),

        date: formatDate(record.change_at),

        timestamp: new Date(record.change_at),

        recordId: record.record_id,

        tableName: record.table_name
    };
}

// FETCH ACTIVITY LOGS FROM PHP API
async function fetchActivities() {
    rows.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center; padding:30px;">
                Loading activity logs...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(ACTIVITY_API, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Failed to retrieve activity logs."
            );
        }

        activities = result.data.map(formatActivity);

        currentPage = 1;

        updateStatistics();
        updateCategoryCounts();
        renderRows();

    } catch (error) {
        console.error("Activity Logs Error:", error);

        rows.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:30px; color:#b42318;">
                    Unable to load activity logs. Please refresh the page.
                </td>
            </tr>
        `;

        emptyState.hidden = true;
        showingText.textContent = "Unable to retrieve activity logs.";
    }
}

// DATE FILTER
function matchesDateRange(item, range) {
    if (range === "all") return true;

    const activityDate = item.timestamp;

    if (Number.isNaN(activityDate.getTime())) {
        return false;
    }

    const now = new Date();

    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    if (range === "today") {
        return activityDate >= startOfToday &&
            activityDate < startOfTomorrow;
    }

    if (range === "week") {
        const startOfWeek = new Date(startOfToday);

        const day = startOfWeek.getDay();
        const difference = day === 0 ? 6 : day - 1;

        startOfWeek.setDate(
            startOfWeek.getDate() - difference
        );

        return activityDate >= startOfWeek &&
            activityDate < startOfTomorrow;
    }

    if (range === "month") {
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        return activityDate >= startOfMonth &&
            activityDate < startOfTomorrow;
    }

    return true;
}

// FILTER ACTIVITIES
function getFilteredActivities() {
    const query = searchInput.value.trim().toLowerCase();
    const range = dateFilter.value;

    return activities.filter(item => {
        const searchable = `
            ${item.staff}
            ${item.role}
            ${item.activity}
            ${item.category}
            ${item.description}
            ${item.recordId}
            ${item.tableName}
        `.toLowerCase();

        const categoryMatch =
            selectedCategory === "All Activities" ||
            item.category === selectedCategory;

        const searchMatch = searchable.includes(query);

        const dateMatch = matchesDateRange(item, range);

        return categoryMatch && searchMatch && dateMatch;
    });
}

// STATISTICS CARDS
function updateStatistics() {
    const statValues = document.querySelectorAll(
        ".stats-grid .stat-card strong"
    );

    const todayCount = activities.filter(item =>
        matchesDateRange(item, "today")
    ).length;

    const staffCount = activities.filter(item =>
        item.category === "Staff Management"
    ).length;

    if (statValues[0]) {
        statValues[0].textContent = activities.length;
    }

    if (statValues[1]) {
        statValues[1].textContent = todayCount;
    }

    if (statValues[2]) {
        statValues[2].textContent = staffCount;
    }
}

// CATEGORY TAB COUNTS
function updateCategoryCounts() {
    tabs.forEach(tab => {
        const category = tab.dataset.category;
        const countElement = tab.querySelector("span");

        if (!countElement) return;

        const count = category === "All Activities"
            ? activities.length
            : activities.filter(item =>
                item.category === category
            ).length;

        countElement.textContent = count;
    });
}

// PAGINATION
function updatePagination(totalPages) {
    const pagination = document.querySelector(".pagination");

    if (!pagination) return;

    let pageButtons = pagination.querySelectorAll(".page-number");

    pageButtons.forEach(button => button.remove());

    const nextButton = document.getElementById("nextPage");

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");

        button.className = "page-number";
        button.dataset.page = page;
        button.textContent = page;

        if (page === currentPage) {
            button.classList.add("current");
        }

        button.addEventListener("click", () => {
            currentPage = page;
            renderRows();
        });

        pagination.insertBefore(button, nextButton);
    }

    prevPage.disabled = currentPage <= 1;
    nextPage.disabled = currentPage >= totalPages;
}

// DISPLAY ACTIVITY ROWS
function renderRows() {
    const filtered = getFilteredActivities();

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / pageSize)
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * pageSize;

    const visible = filtered.slice(
        start,
        start + pageSize
    );

    rows.innerHTML = visible.map(item => `
        <tr>
            <td>
                <div class="staff-cell">
                    <span class="staff-avatar ${escapeHTML(item.avatar)}">
                        ${escapeHTML(item.initials)}
                    </span>

                    <span class="staff-name">
                        <strong>${escapeHTML(item.staff)}</strong>
                        <small>${escapeHTML(item.role)}</small>
                    </span>
                </div>
            </td>

            <td>
                <span class="status ${escapeHTML(item.activity.toLowerCase())}">
                    ${escapeHTML(item.activity)}
                </span>
            </td>

            <td class="module-cell">
                ${escapeHTML(item.category)}
            </td>

            <td class="description">
                ${escapeHTML(item.description)}
            </td>

            <td>
                <span class="date-text">
                    ${escapeHTML(item.date)}
                </span>
            </td>
        </tr>
    `).join("");

    emptyState.hidden = visible.length > 0;

    showingText.innerHTML = `
        Showing <strong>${visible.length}</strong>
        of <strong>${filtered.length}</strong> activities
    `;

    updatePagination(totalPages);
}

// CATEGORY TAB EVENTS
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(item =>
            item.classList.remove("active")
        );

        tab.classList.add("active");

        selectedCategory = tab.dataset.category;

        currentPage = 1;

        renderRows();
    });
});

// SEARCH AND DATE FILTER EVENTS
searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderRows();
});

dateFilter.addEventListener("change", () => {
    currentPage = 1;
    renderRows();
});

// PREVIOUS AND NEXT PAGE
prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderRows();
    }
});

nextPage.addEventListener("click", () => {
    const totalPages = Math.max(
        1,
        Math.ceil(getFilteredActivities().length / pageSize)
    );

    if (currentPage < totalPages) {
        currentPage++;
        renderRows();
    }
});

// ADMINISTRATION DROPDOWN
const adminWrapper = document.getElementById(
    "adminDropdownWrapper"
);

const adminBtn = document.getElementById(
    "adminDropdownBtn"
);

if (adminWrapper && adminBtn) {
    adminBtn.addEventListener("click", event => {
        event.stopPropagation();

        const isOpen = adminWrapper.classList.toggle("open");

        adminBtn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    document.addEventListener("click", event => {
        if (!adminWrapper.contains(event.target)) {
            adminWrapper.classList.remove("open");

            adminBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });
}

// MOBILE NAVIGATION
const mobileMenuBtn = document.getElementById(
    "mobileMenuBtn"
);

const navLinks = document.getElementById("navLinks");

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}

// INITIALIZE ACTIVITY LOGS
fetchActivities();
