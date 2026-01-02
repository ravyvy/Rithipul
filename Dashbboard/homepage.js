// ================= Home Page =================
function loadHomePage() {
  contentDiv.innerHTML = `
    <div class="d-flex justify-content-end mb-3 flex-wrap">
      <div class="d-flex gap-2 mb-3">
        <select id="typeSearch" class="form-select">
          <option value="">-- Select Type --</option>
          <option value="service">service</option>
          <option value="milestone">milestone</option>
          <option value="vission">vission</option>
          <option value="values">values</option>
          <option value="curriculum">curriculum</option>
          <option value="achievement">achievement</option>
        </select>
        <button class="btn text-white" id="btn_search"style="background: rgb(22, 72, 138) ;">Search</button>
      </div>
      <button class="btn text-white btn-sm ms-3" style="width:80px;height:38px;background: rgba(183, 145, 68, 1);"onclick="addModel()">Add</button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive" style="overflow-x:auto;">
          <table class="table table-hover table-sm align-middle">
            <thead class="table-dark">
              <tr>
                <th style="min-width: 60px;">ID</th>
                <th style="min-width: 250px;">Category (EN)</th>
                <th style="min-width: 250px;">Category (KH)</th>
                <th style="min-width: 400px;">Description (EN)</th>
                <th style="min-width: 400px;">Description (KH)</th>
                <th style="min-width: 80px;">Icon</th>
                <th style="min-width: 100px;">Image</th>
                <th style="min-width: 80px;">Year</th>
                <th style="min-width: 80px;">logo</th>
                <th style="min-width: 100px;">Type</th>
                <th style="min-width: 150px;">Action</th>
              </tr>
            </thead>
            <tbody id="table_body"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  fetchHomeData();

  // Search
  const btn_search = document.getElementById("btn_search");
  const typeSearch = document.getElementById("typeSearch");

  btn_search.addEventListener("click", () => {
    const type = typeSearch.value;
    if (!type) return alert("Please select a type");
    fetch(`http://localhost:1000/api/homepage/search?keyword=${encodeURIComponent(type)}`)
      .then(res => res.json())
      .then(data => renderTable(data))
      .catch(err => console.error(err));
  });

  typeSearch.addEventListener("change", () => btn_search.click());
}

// ================= Fetch Table Data =================
function fetchHomeData() {
  fetch("http://localhost:1000/api/homepage/getlist")
    .then(res => res.json())
    .then(result => renderTable(result.data))
    .catch(() => {
      const tableBody = document.getElementById("table_body");
      tableBody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">Failed to load data.</td></tr>`;
    });
}

// ================= Render Table Rows =================
function renderTable(data) {
  const tableBody = document.getElementById("table_body");
  tableBody.innerHTML = "";
  if (!data || data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="text-center">No results found</td></tr>`;
    return;
  }

  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.category_en || ''}</td>
      <td>${item.category_kh || ''}</td>
      <td>${item.description_en || ''}</td>
      <td>${item.description_kh || ''}</td>
      <td>${item.icon_path || ''}</td>
      <td>${item.img ? `<img src="${item.img}"  style="height:auto; width:100px;">` : ''}</td>
      <td>${item.year || ''}</td>
       <td>${item.logo ? `<img src="${item.logo}"  style="height:auto; width:60px;">` : ''}</td>
      <td>${item.type || ''}</td>
      <td >
        <button class="btn text-white btn-sm "style="background: rgba(183, 145, 68, 1);" onclick='openModal(${JSON.stringify(item)})'>Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ================= Delete Item =================
function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  fetch(`http://localhost:1000/api/homepage/remove/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => { alert("Deleted successfully!"); fetchHomeData(); })
    .catch(err => { console.error(err); alert("Error deleting item"); });
}

// ================= Edit Modal =================
function openModal(item) {
  const existingModal = document.getElementById("dynamicModal");
  if (existingModal) existingModal.remove();

  const modalHTML = `
  <div class="modal fade" id="dynamicModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Update Homepage</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="updateForm">
            <input type="hidden" id="update_id">
            <div class="row g-3">
              <div class="col-md-6"><label>Category (EN)</label><input type="text" class="form-control" id="category_en"></div>
              <div class="col-md-6"><label>Category (KH)</label><input type="text" class="form-control" id="category_kh"></div>
              <div class="col-md-6"><label>Description (EN)</label><textarea class="form-control" id="description_en"></textarea></div>
              <div class="col-md-6"><label>Description (KH)</label><textarea class="form-control" id="description_kh"></textarea></div>
              <div class="col-md-4"><label>Year</label><input type="number" class="form-control" id="year"></div>
              <div class="col-md-4"><label>logo</label><input type="text" class="form-control" id="logo"></div>
              <div class="col-md-4"><label>Type</label>
                <select class="form-control" id="type">
                  <option value="">-- Select Type --</option>
                  <option value="service">service</option>
                  <option value="milestone">milestone</option>
                  <option value="vision">vision</option>
                  <option value="values">values</option>
                  <option value="curriculum">curriculum</option>
                  <option value="achievement">achievement</option>
                </select>
              </div>
              <div class="col-md-4"><label>Icon Path</label><input type="text" class="form-control" id="icon_path"></div>
              <div class="col-md-4"><label>Image</label><input type="text" class="form-control" id="img"></div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="submitUpdate()">Save changes</button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById("update_id").value = item.id;
  document.getElementById("category_en").value = item.category_en || "";
  document.getElementById("category_kh").value = item.category_kh || "";
  document.getElementById("description_en").value = item.description_en || "";
  document.getElementById("description_kh").value = item.description_kh || "";
  document.getElementById("year").value = item.year || "";
  document.getElementById("logo").value = item.logo || "";
  document.getElementById("type").value = item.type || "";
  document.getElementById("icon_path").value = item.icon_path || "";
  document.getElementById("img").value = item.img || "";

  new bootstrap.Modal(document.getElementById('dynamicModal')).show();
}

function submitUpdate() {
  const data = {
    category_en: document.getElementById("category_en").value,
    category_kh: document.getElementById("category_kh").value,
    description_en: document.getElementById("description_en").value,
    description_kh: document.getElementById("description_kh").value,
    year: document.getElementById("year").value,
    logo: document.getElementById("logo").value,
    type: document.getElementById("type").value,
    icon_path: document.getElementById("icon_path").value,
    img: document.getElementById("img").value
  };
  const id = document.getElementById("update_id").value;

  fetch(`http://localhost:1000/api/homepage/update/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(() => { alert("Updated successfully!"); fetchHomeData(); })
    .catch(err => { console.error(err); alert("Error updating data"); });

  const modalEl = document.getElementById('dynamicModal');
  bootstrap.Modal.getInstance(modalEl).hide();
  modalEl.remove();
}

// ================= Add Modal =================
function addModel() {
  const existingModal = document.getElementById("addModal");
  if (existingModal) existingModal.remove();

  const modalHTML = `
  <div class="modal fade" id="addModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New Homepage Item</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form id="addForm">
            <div class="row g-3">
              <div class="col-md-6"><label>Category (EN)</label><input type="text" class="form-control" id="add_category_en"></div>
              <div class="col-md-6"><label>Category (KH)</label><input type="text" class="form-control" id="add_category_kh"></div>
              <div class="col-md-6"><label>Description (EN)</label><textarea class="form-control" id="add_description_en"></textarea></div>
              <div class="col-md-6"><label>Description (KH)</label><textarea class="form-control" id="add_description_kh"></textarea></div>
              <div class="col-md-4"><label>Year</label><input type="number" class="form-control" id="add_year"></div>
              <div class="col-md-4"><label>logo</label><input type="text" class="form-control" id="logo"></div>
              <div class="col-md-4"><label>Type</label>
                <select class="form-control" id="add_type">
                  <option value="">-- Select Type --</option>
                  <option value="service">service</option>
                  <option value="milestone">milestone</option>
                  <option value="vision">vision</option>
                  <option value="values">values</option>
                  <option value="curriculum">curriculum</option>
                  <option value="achievement">achievement</option>
                </select>
              </div>
              <div class="col-md-4"><label>Icon Path</label><input type="text" class="form-control" id="add_icon_path"></div>
              <div class="col-md-4"><label>Image</label><input type="text" class="form-control" id="add_img"></div>
              <div class="col-md-4"><label>Logo</label><input type="text" class="form-control" id="logo"></div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="submitAdd()">Add</button>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  new bootstrap.Modal(document.getElementById('addModal')).show();
}

function submitAdd() {
  const data = {
    category_en: document.getElementById("add_category_en").value,
    category_kh: document.getElementById("add_category_kh").value,
    description_en: document.getElementById("add_description_en").value,
    description_kh: document.getElementById("add_description_kh").value,
    year: document.getElementById("add_year").value,
    logo: document.getElementById("logo").value,
    type: document.getElementById("add_type").value,
    icon_path: document.getElementById("add_icon_path").value,
    img: document.getElementById("add_img").value,
    logo: document.getElementById("logo").value
  };

  fetch("http://localhost:1000/api/homepage/create", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(() => { alert("Added successfully!"); fetchHomeData(); })
    .catch(err => { console.error(err); alert("Error adding data"); });

  const modalEl = document.getElementById('addModal');
  bootstrap.Modal.getInstance(modalEl).hide();
  modalEl.remove();
}
