// ================= ABOUT PAGE =================
function loadCareersPage() {
    contentDiv.innerHTML = `
  <div class="d-flex justify-content-end mb-3 flex-wrap">
    <div class="d-flex gap-2">
      <select id="typesearch" class="form-select">
        <option value=" ">-- Select Type --</option>
        <option value="header_job">header_job</option>
        <option value="open_job">open_job</option>
      </select>
      <button class="btn text-white" id="btn_search" style="background: rgb(22, 72, 138);">Search</button>
    </div>
    <button class="btn text-white btn-sm ms-3" style="width:80px;height:38px;background: rgba(183, 145, 68, 1);" onclick="openAddModalCareers()">Add</button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body table-responsive">
      <table class="table table-hover table-sm align-middle">
        <thead class="table-dark">
         <tr>
             <th>ID</th>
      <th style="min-width: 250px;">Title Header (EN)</th>
      <th style="min-width: 250px;">Title Header (KH)</th>
      <th style="min-width: 250px;">Why Choose (EN)</th>
      <th style="min-width: 250px;">Why Choose (KH)</th>
      <th style="min-width: 250px;">Careers Description (EN)</th>
      <th style="min-width: 250px;">Careers Description (KH)</th>
      <th style="min-width: 250px;">Open Positions (EN)</th>
      <th style="min-width: 250px;">Open Positions (KH)</th>
      <th style="min-width: 250px;">Title (EN)</th>
      <th style="min-width: 250px;">Title (KH)</th>
      <th style="min-width: 250px;">Close Date</th>
      <th style="min-width: 250px;">Types</th>
      <th style="min-width: 250px;">Department</th>
      <th style="min-width: 250px;">Location</th>
      <th style="min-width: 250px;">Urgent</th>
      <th style="min-width: 250px;">Apply Link</th>
      <th style="min-width: 250px;">Image URL</th>
      <th style="min-width: 250px;">Created At</th>
      <th style="min-width: 250px;">Updated At</th>
      <th style="min-width: 250px;">Type</th>
        <th width="150">Action</th>
        </tr>
        </thead>
        <tbody id="careers_table_body"></tbody>
      </table>
    </div>
  </div>
  `;

    fetchCareersData();

    // ===== SEARCH =====
    const btn_search = document.getElementById("btn_search");
    const typesearch = document.getElementById("typesearch");

    btn_search.addEventListener("click", () => {
        const type = typesearch.value;
        if (!type) return alert("Please select a type");

        fetch(`http://localhost:1000/api/careers/search?keyword=${encodeURIComponent(type)}`)
            .then(res => res.json())
            .then(data => renderTableCareers(data))
            .catch(err => console.error(err));
    });

    typesearch.addEventListener("change", () => btn_search.click());
}

// ================= FETCH DATA =================
let CAREERS_CACHE = [];

function fetchCareersData(type = "") {
    let url = "http://localhost:1000/api/careers/getlist";
    if (type) url += `?type=${type}`;
    fetch(url)
        .then(res => res.json())
        .then(res => {
            CAREERS_CACHE = res.data || [];
            renderTableCareers(CAREERS_CACHE);
        })
        .catch(() => {
            document.getElementById("careers_table_body").innerHTML =
                `<tr><td colspan="10" class="text-danger text-center">Failed to load data</td></tr>`;
        });
}

// ================= RENDER TABLE =================
function renderTableCareers(data) {
    const tbody = document.getElementById("careers_table_body");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center">No data found</td></tr>`;
        return;
    }

    data.forEach(item => {
        tbody.innerHTML += `
     <tr>
<td>${item.id}</td>
<td>${item.titleheader_en || ""}</td>
<td>${item.titleheader_kh || ""}</td>
<td title="${item.whychoose_en || ""}">${item.whychoose_en || ""}</td>
<td title="${item.whychoose_kh || ""}">${item.whychoose_kh || ""}</td>
<td title="${item.careersds_en || ""}">${item.careersds_en || ""}</td>
<td title="${item.careersds_kh || ""}">${item.careersds_kh || ""}</td>
<td title="${item.openposition_en || ""}">${item.openposition_en || ""}</td>
<td title="${item.openposition_kh || ""}">${item.openposition_kh || ""}</td>
<td>${item.title_en || ""}</td>
<td>${item.title_kh || ""}</td>
<td>${item.close_date || ""}</td>
<td>${item.types || ""}</td>
<td>${item.department || ""}</td>
<td>${item.location || ""}</td>
<td>${item.urgent || ""}</td>
<td>
  ${item.apply_link ? `<a href="${item.apply_link}" target="_blank">Link telegram</a>`: ""}
</td>
<td>
  ${item.image_url
    ? `<img src="${item.image_url}" style="width:80px;height:80px;object-fit:cover;">`
    : ""}
</td>
<td>${item.created_at || ""}</td>
<td>${item.updated_at || ""}</td>
<td>${item.type || ""}</td>


  <td>
    <div class="d-flex gap-1">
      <button class="btn btn-sm text-white"
        style="background: rgba(183,145,68,1);"
        onclick="openEditModalCareers(${item.id})">
        Edit
      </button>

      <button class="btn btn-danger btn-sm"
        onclick="deleteItemCareers(${item.id})">
        Delete
      </button>
    </div>
  </td>
</tr>

    `;
    });
}

// ================= DELETE =================
function deleteItemCareers(id) {
    if (!confirm("Are you sure?")) return;

    fetch(`http://localhost:1000/api/careers/remove/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => fetchCareersData());
}

// ================= EDIT MODAL =================
function openEditModalCareers(id) {
    const item = CAREERS_CACHE.find(i => i.id === id);
    if (!item) return;

    removeModalCareers("careersModal");
    document.body.insertAdjacentHTML("beforeend", modalHTMLCareers("edit"));
document.getElementById("edit_id").value = item.id;

// Headers
document.getElementById("edit_titleheader_en").value = item.titleheader_en || "";
document.getElementById("edit_titleheader_kh").value = item.titleheader_kh || "";

// Why Choose section
document.getElementById("edit_whychoose_en").value = item.whychoose_en || "";
document.getElementById("edit_whychoose_kh").value = item.whychoose_kh || "";

// Career SDS section
document.getElementById("edit_careersds_en").value = item.careersds_en || "";
document.getElementById("edit_careersds_kh").value = item.careersds_kh || "";

// CORRECTED: Open Position (Removed the 's' to match DB)
document.getElementById("edit_openposition_en").value = item.openposition_en || "";
document.getElementById("edit_openposition_kh").value = item.openposition_kh || "";

// Titles
document.getElementById("edit_title_en").value = item.title_en || "";
document.getElementById("edit_title_kh").value = item.title_kh || "";

// Specific Fields from Image
document.getElementById("edit_close_date").value = item.close_date || "";
document.getElementById("edit_types").value = item.types || ""; // Note the 's' in DB for row 13
document.getElementById("edit_department").value = item.department || "";
document.getElementById("edit_location").value = item.location || "";
document.getElementById("edit_urgent").value = item.urgent || "";

// Links and Meta
document.getElementById("edit_apply_link").value = item.apply_link || "";
document.getElementById("edit_image_url").value = item.image_url || "";
document.getElementById("edit_type").value = item.type || ""; // Row 21
    new bootstrap.Modal(document.getElementById("careersModal")).show();
}

// ================= UPDATE =================
function submitUpdateCareers() {
    const id = document.getElementById("edit_id").value;
    const data = getFormDataCareers("edit");

    fetch(`http://localhost:1000/api/careers/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => fetchCareersData());

    closeModalCareers();
}

// ================= ADD MODAL =================
function openAddModalCareers() {
    removeModalCareers("careersModal");
    document.body.insertAdjacentHTML("beforeend", modalHTMLCareers("add"));
    new bootstrap.Modal(document.getElementById("careersModal")).show();
}

// ================= ADD =================
function submitAddCareers() {
    const data = getFormDataCareers("add");

    fetch("http://localhost:1000/api/careers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(() => fetchCareersData());

    closeModalCareers();
}

// ================= HELPERS =================
function getFormDataCareers(prefix) {
    return {
  
    // Basic Headers
    titleheader_en: document.getElementById(`${prefix}_titleheader_en`).value,
    titleheader_kh: document.getElementById(`${prefix}_titleheader_kh`).value,
    
    whychoose_en: document.getElementById(`${prefix}_whychoose_en`).value,
    whychoose_kh: document.getElementById(`${prefix}_whychoose_kh`).value,
    
    careersds_en: document.getElementById(`${prefix}_careersds_en`).value,
    careersds_kh: document.getElementById(`${prefix}_careersds_kh`).value,
    
    // Note: Database uses 'openposition', not 'openpositions'
    openposition_en: document.getElementById(`${prefix}_openposition_en`).value,
    openposition_kh: document.getElementById(`${prefix}_openposition_kh`).value,
    
    title_en: document.getElementById(`${prefix}_title_en`).value,
    title_kh: document.getElementById(`${prefix}_title_kh`).value,
    
    // Date and Category Fields (From DB rows 12-15)
    close_date: document.getElementById(`${prefix}_close_date`).value,
    types: document.getElementById(`${prefix}_types`).value,
    department: document.getElementById(`${prefix}_department`).value,
    location: document.getElementById(`${prefix}_location`).value,
    
    // Status and Links
    urgent: document.getElementById(`${prefix}_urgent`).value, // Row 16
    apply_link: document.getElementById(`${prefix}_apply_link`).value,
    image_url: document.getElementById(`${prefix}_image_url`).value,
    type: document.getElementById(`${prefix}_type`).value // Row 21
 
    };
}

function closeModalCareers() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("careersModal"));
    if (modal) modal.hide();
    removeModalCareers("careersModal");
}

function removeModalCareers(id) {
    const modal = document.getElementById(id);
    if (modal) modal.remove();
}

// ================= MODAL HTML =================
function modalHTMLCareers(type) {
    return `
  <div class="modal fade" id="careersModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${type === "add" ? "Add Careers ( Header * )" : "Edit Careers ( Header  * )"}</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="${type}_id">
          ${formFieldsCareers(type)}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="${type === "add" ? "submitAddCareers()" : "submitUpdateCareers()"}">
            ${type === "add" ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function formFieldsCareers(p) {
    return `
 <div class="row g-3">
  <div class="col-md-6">
    <input id="${p}_titleheader_en" class="form-control" placeholder="Title Header (EN) * ">
  </div>
  <div class="col-md-6">
    <input id="${p}_titleheader_kh" class="form-control" placeholder="Title Header (KH) *">
  </div>

  <div class="col-md-6">
    <textarea id="${p}_whychoose_en" class="form-control" placeholder="Why Choose (EN) * "></textarea>
  </div>
  <div class="col-md-6">
    <textarea id="${p}_whychoose_kh" class="form-control" placeholder="Why Choose (KH) * "></textarea>
  </div>

  <div class="col-md-6">
    <textarea id="${p}_careersds_en" class="form-control" placeholder="Careers DS (EN) * "></textarea>
  </div>
  <div class="col-md-6">
    <textarea id="${p}_careersds_kh" class="form-control" placeholder="Careers DS (KH) * "></textarea>
  </div>

  <div class="col-md-6">
    <textarea id="${p}_openposition_en" class="form-control" placeholder="Open Position (EN) * "></textarea>
  </div>
  <div class="col-md-6">
    <textarea id="${p}_openposition_kh" class="form-control" placeholder="Open Position (KH) * "></textarea>
  </div>

  <div class="col-md-6">
    <input id="${p}_title_en" class="form-control" placeholder="Title (EN) ">
  </div>
  <div class="col-md-6">
    <input id="${p}_title_kh" class="form-control" placeholder="Title (KH) ">
  </div>

  <hr class="my-3">

  <div class="col-md-4">
    <label class="form-label">Close Date</label>
    <input type="date" id="${p}_close_date" class="form-control">
  </div>
  <div class="col-md-4">
    <label class="form-label">Types</label>
    <input id="${p}_types" class="form-control" placeholder="Types">
  </div>
  <div class="col-md-4">
    <label class="form-label">Department</label>
    <input id="${p}_department" class="form-control" placeholder="Department">
  </div>

  <div class="col-md-4">
    <label class="form-label">Location</label>
    <input id="${p}_location" class="form-control" placeholder="Location">
  </div>
  <div class="col-md-4">
    <label class="form-label">Urgent Status</label>
    <select id="${p}_urgent" class="form-control">
      <option value="0">Normal</option>
      <option value="1">Urgent</option>
    </select>
  </div>
  <div class="col-md-4">
    <label class="form-label">Category Type</label>
    <select id="${p}_type" class="form-control">
      <option value="">-- Select Type --</option>
      <option value="open_job">Open Job</option>
      <option value="header_job">Header Job</option>
    </select>
  </div>

  <div class="col-md-6">
    <input id="${p}_apply_link" class="form-control" placeholder="Apply Link URL">
  </div>
  <div class="col-md-6">
    <input id="${p}_image_url" class="form-control" placeholder="Image URL *">
  </div>
</div>
`;
}
