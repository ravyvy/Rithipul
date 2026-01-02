// ================= TEAM PAGE =================
function loadPlanPage() {
  contentDiv.innerHTML = `
  <div class="d-flex justify-content-end mb-3 flex-wrap">
    <div class="d-flex gap-2">
      <input 
      type="text" 
      class="form-control rounded shadow-sm " 
      id="searchplan"
      placeholder="Search plan..." style="width:180px;">
      <button class="btn text-white" id="btn_search" style="background: rgb(22, 72, 138) ;">Search</button>
    </div>
        <button class="btn text-white btn-sm ms-2"style="width:60px;height:38px;background: rgba(183, 145, 68, 1);" onclick="openAddModalPlan()">Add</button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body table-responsive">
      <table class="table table-hover table-sm align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Title (EN)</th>
            <th>Tilte (KH)</th>
            <th>DateStart</th>
            <th>text (EN)</th>
            <th>text (KH)</th>
            <th width="150">Action</th>
          </tr>
        </thead>
        <tbody id="plan_table_body"></tbody>
      </table>
    </div>
  </div>
  `;

  fetchPlanData(); // load all initially

  // ===== SEARCH =====
  const btn_search = document.getElementById("btn_search");
  const searchplan = document.getElementById("searchplan");

  btn_search.addEventListener("click", () => {
    const type = searchplan.value;
    if (!type) return alert("Please select a type");

    // fetch from search API
    fetch(`http://localhost:1000/api/newplan/search?keyword=${encodeURIComponent(type)}`)
      .then(res => res.json())
      .then(data => renderTablePlan(data))
      .catch(err => console.error(err));
  });

  searchplan.addEventListener("change", () => btn_search.click());
}

// ================= FETCH DATA =================
let PLAN_CACHE = [];

function fetchPlanData(type = "") {
  let url = "http://localhost:1000/api/newplan/getlist";
  if (type) url += `?type=${type}`;

  fetch(url)
    .then(res => res.json())
    .then(res => {
      PLAN_CACHE = res.data || [];
      renderTablePlan(PLAN_CACHE);
    })
    .catch(() => {
      document.getElementById("plan_table_body").innerHTML =
        `<tr><td colspan="10" class="text-danger text-center">Failed to load data</td></tr>`;
    });
}

// ================= RENDER TABLE =================
function renderTablePlan(data) {
  const tbody = document.getElementById("plan_table_body");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center">No data found</td></tr>`;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
   <tr>
  <td>${item.id}</td>
  <td>${item.title || ""}</td>
  <td>${item.title_kh || ""}</td>
  <td>${item.datestart ? new Date(item.datestart).toLocaleDateString() : ""}</td>

  <td title="${item.text || ""}">
    ${item.text || ""}
  </td>

  <td title="${item.text_kh || ""}">
    ${item.text_kh || ""}
  </td>

  <td>
    <div class="d-flex gap-1">
      <button class="btn btn-sm text-white"
        style="background: rgba(183,145,68,1);"
        onclick="openEditModalPlan(${item.id})">
        Edit
      </button>
      <button class="btn btn-danger btn-sm"
        onclick="deleteItemPlan(${item.id})">
        Delete
      </button>
    </div>
  </td>
</tr>

    `;
  });
}

// ================= DELETE =================
function deleteItemPlan(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`http://localhost:1000/api/newplan/remove/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => fetchPlanData());
}

// ================= EDIT MODAL =================
function openEditModalPlan(id) {
  const item = PLAN_CACHE.find(i => i.id === id);
  if (!item) return;

  removeModalPlan("PlanModal");

  document.body.insertAdjacentHTML("beforeend", modalHTMLPlan("edit"));

  document.getElementById("edit_id").value = item.id;
  document.getElementById("edit_title").value = item.title || "";
  document.getElementById("edit_title_kh").value = item.title_kh || "";
  document.getElementById("edit_datestart").value = item.datestart || "";
  document.getElementById("edit_text").value = item.text || "";
  document.getElementById("edit_text_kh").value = item.text_kh || "";
  new bootstrap.Modal(document.getElementById("planModal")).show();
}

// ================= UPDATE =================
function submitUpdatePlan() {
  const id = document.getElementById("edit_id").value;
  const data = getFormDataPlan("edit");

  fetch(`http://localhost:1000/api/newplan/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => fetchPlanData());

  closeModalPlan();
}

// ================= ADD MODAL =================
function openAddModalPlan() {
  removeModalPlan("planModal");
  document.body.insertAdjacentHTML("beforeend", modalHTMLPlan("add"));
  new bootstrap.Modal(document.getElementById("planModal")).show();
}

// ================= ADD =================
function submitAddPlan() {
  const data = getFormDataPlan("add");

  fetch("http://localhost:1000/api/newplan/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => fetchPlanData());

  closeModalPlan();
}

// ================= HELPERS =================
function getFormDataPlan(prefix) {
  return {
    title: document.getElementById(`${prefix}_title`).value,
    title_kh: document.getElementById(`${prefix}_title_kh`).value,
    datestart: document.getElementById(`${prefix}_datestart`).value,
    text: document.getElementById(`${prefix}_text`).value,
    text_kh: document.getElementById(`${prefix}_text_kh`).value,
  };
}

function closeModalPlan() {
  const modal = bootstrap.Modal.getInstance(document.getElementById("planModal"));
  if (modal) modal.hide();
  removeModalPlan("planModal");
}

function removeModalPlan(id) {
  const modal = document.getElementById(id);
  if (modal) modal.remove();
}

// ================= MODAL HTML =================
function modalHTMLPlan(type) {
  return `
  <div class="modal fade" id="planModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${type === "add" ? "Add plan " : "Edit Plan "}</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="${type}_id">
          ${formFieldsPlan(type)}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="${type === "add" ? "submitAddPlan()" : "submitUpdatePlan()"}">
            ${type === "add" ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function formFieldsPlan(p) {
  return `
  <div class="row g-3">
    <div class="col-md-6"><input id="${p}_title" class="form-control" placeholder="title (EN)"></div>
    <div class="col-md-6"><input id="${p}_title_kh" class="form-control" placeholder="title_kh (KH)"></div>
    <div class="col-md-6"><textarea id="${p}_datestart" class="form-control" placeholder="datestart"></textarea></div>
    <div class="col-md-6"><textarea id="${p}_text" class="form-control" placeholder="text"></textarea></div>
    <div class="col-md-6"><textarea id="${p}_text_kh" class="form-control" placeholder="text_kh"></textarea></div>
    <div class="col-md-4">
    
    </div>
  </div>`;
}
