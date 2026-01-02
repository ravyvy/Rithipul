// ================= ABOUT PAGE =================
function loadAboutPage() {
  contentDiv.innerHTML = `
  <div class="d-flex justify-content-end mb-3 flex-wrap">
    <div class="d-flex gap-2">
      <select id="typesearch" class="form-select">
        <option value="">-- Select Type --</option>
        <option value="Financial">Financial</option>
        <option value="skills">Skills</option>
        <option value="brand">Brand</option>
        <option value="vission">Vission</option>
        <option value="mission">Mission</option>
      </select>
      <button class="btn text-white" id="btn_search" style="background: rgb(22, 72, 138);">Search</button>
    </div>
    <button class="btn text-white btn-sm ms-3" style="width:80px;height:38px;background: rgba(183, 145, 68, 1);" onclick="openAddModalAbout()">Add</button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body table-responsive">
      <table class="table table-hover table-sm align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Category (EN)</th>
            <th>Category (KH)</th>
            <th>Description (EN)</th>
            <th>Description (KH)</th>
            <th>Type</th>
            <th>Image Brand</th>
            <th width="150">Action</th>
          </tr>
        </thead>
        <tbody id="about_table_body"></tbody>
      </table>
    </div>
  </div>
  `;

  fetchAboutData();

  // ===== SEARCH =====
  const btn_search = document.getElementById("btn_search");
  const typesearch = document.getElementById("typesearch");

  btn_search.addEventListener("click", () => {
    const type = typesearch.value;
    if (!type) return alert("Please select a type");

    fetch(`http://localhost:1000/api/about/search?keyword=${encodeURIComponent(type)}`)
      .then(res => res.json())
      .then(data => renderTableAbout(data))
      .catch(err => console.error(err));
  });

  typesearch.addEventListener("change", () => btn_search.click());
}

// ================= FETCH DATA =================
let ABOUT_CACHE = [];

function fetchAboutData(type = "") {
  let url = "http://localhost:1000/api/about/getlist";
  if (type) url += `?type=${type}`;

  fetch(url)
    .then(res => res.json())
    .then(res => {
      ABOUT_CACHE = res.data || [];
      renderTableAbout(ABOUT_CACHE);
    })
    .catch(() => {
      document.getElementById("about_table_body").innerHTML =
        `<tr><td colspan="10" class="text-danger text-center">Failed to load data</td></tr>`;
    });
}

// ================= RENDER TABLE =================
function renderTableAbout(data) {
  const tbody = document.getElementById("about_table_body");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center">No data found</td></tr>`;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
     <tr>
  <td>${item.id}</td>
  <td>${item.category_en || ""}</td>
  <td>${item.category_kh || ""}</td>

  <td title="${item.description_en || ""}">
    ${item.description_en || ""}
  </td>

  <td title="${item.description_kh || ""}">
    ${item.description_kh || ""}
  </td>

  <td>${item.type || ""}</td>

  <td>
    ${item.img_brand
      ? `<img src="${item.img_brand}"
              style="width:80px;height:80px;object-fit:cover;">`
      : ""}
  </td>

  <td>
    <div class="d-flex gap-1">
      <button class="btn btn-sm text-white"
        style="background: rgba(183,145,68,1);"
        onclick="openEditModalAbout(${item.id})">
        Edit
      </button>

      <button class="btn btn-danger btn-sm"
        onclick="deleteItemAbout(${item.id})">
        Delete
      </button>
    </div>
  </td>
</tr>

    `;
  });
}

// ================= DELETE =================
function deleteItemAbout(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`http://localhost:1000/api/about/remove/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => fetchAboutData());
}

// ================= EDIT MODAL =================
function openEditModalAbout(id) {
  const item = ABOUT_CACHE.find(i => i.id === id);
  if (!item) return;

  removeModalAbout("aboutModal");
  document.body.insertAdjacentHTML("beforeend", modalHTMLAbout("edit"));

  document.getElementById("edit_id").value = item.id;
  document.getElementById("edit_category_en").value = item.category_en || "";
  document.getElementById("edit_category_kh").value = item.category_kh || "";
  document.getElementById("edit_description_en").value = item.description_en || "";
  document.getElementById("edit_description_kh").value = item.description_kh || "";
  document.getElementById("edit_type").value = item.type || "";
  document.getElementById("edit_img_brand").value = item.img_brand || "";

  new bootstrap.Modal(document.getElementById("aboutModal")).show();
}

// ================= UPDATE =================
function submitUpdateAbout() {
  const id = document.getElementById("edit_id").value;
  const data = getFormDataAbout("edit");

  fetch(`http://localhost:1000/api/about/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => fetchAboutData());

  closeModalAbout();
}

// ================= ADD MODAL =================
function openAddModalAbout() {
  removeModalAbout("aboutModal");
  document.body.insertAdjacentHTML("beforeend", modalHTMLAbout("add"));
  new bootstrap.Modal(document.getElementById("aboutModal")).show();
}

// ================= ADD =================
function submitAddAbout() {
  const data = getFormDataAbout("add");

  fetch("http://localhost:1000/api/about/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => fetchAboutData());

  closeModalAbout();
}

// ================= HELPERS =================
function getFormDataAbout(prefix) {
  return {
    category_en: document.getElementById(`${prefix}_category_en`).value,
    category_kh: document.getElementById(`${prefix}_category_kh`).value,
    description_en: document.getElementById(`${prefix}_description_en`).value,
    description_kh: document.getElementById(`${prefix}_description_kh`).value,
    type: document.getElementById(`${prefix}_type`).value,
    img_brand: document.getElementById(`${prefix}_img_brand`).value,
  };
}

function closeModalAbout() {
  const modal = bootstrap.Modal.getInstance(document.getElementById("aboutModal"));
  if (modal) modal.hide();
  removeModalAbout("aboutModal");
}

function removeModalAbout(id) {
  const modal = document.getElementById(id);
  if (modal) modal.remove();
}

// ================= MODAL HTML =================
function modalHTMLAbout(type) {
  return `
  <div class="modal fade" id="aboutModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${type === "add" ? "Add About" : "Edit About"}</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="${type}_id">
          ${formFieldsAbout(type)}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="${type === "add" ? "submitAddAbout()" : "submitUpdateAbout()"}">
            ${type === "add" ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function formFieldsAbout(p) {
  return `
  <div class="row g-3">
    <div class="col-md-6"><input id="${p}_category_en" class="form-control" placeholder="Category (EN)"></div>
    <div class="col-md-6"><input id="${p}_category_kh" class="form-control" placeholder="Category (KH)"></div>
    <div class="col-md-6"><textarea id="${p}_description_en" class="form-control" placeholder="Description (EN)"></textarea></div>
    <div class="col-md-6"><textarea id="${p}_description_kh" class="form-control" placeholder="Description (KH)"></textarea></div>
    <div class="col-md-6">
      <select id="${p}_type" class="form-control">
        <option value="">-- Select Type --</option>
        <option value="Financial">Financial</option>
        <option value="skills">Skills</option>
        <option value="brand">Brand</option>
        <option value="vission">Vission</option>
        <option value="mission">Mission</option>
      </select>
    </div>
    <div class="col-md-6"><textarea id="${p}_img_brand" class="form-control" placeholder="Image URL"></textarea></div>
  </div>`;
}
