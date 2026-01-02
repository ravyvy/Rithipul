// ================= TEAM PAGE =================
function loadTeamPage() {
  contentDiv.innerHTML = `
  <div class="d-flex justify-content-end mb-3 flex-wrap">
    <div class="d-flex gap-2">
      <select id="typeSearch" class="form-select">
        <option value="">-- Select Type --</option>
        <option value="founder">Founder</option>
        <option value="team">Team</option>
        <option value="hidden">TeamHidden</option>
      </select>
      <button class="btn text-white" id="btn_search" style="background: rgb(22, 72, 138) ;">Search</button>
    </div>
    <button class="btn text-white btn-sm ms-3"style="width:80px;height:38px;background: rgba(183, 145, 68, 1);" onclick="openAddModalTeam()">Add</button>
  </div>

  <div class="card shadow-sm">
    <div class="card-body table-responsive">
      <table class="table table-hover table-sm align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Full Name (EN)</th>
            <th>Full Name (KH)</th>
            <th>Position (EN)</th>
            <th>Position (KH)</th>
            <th>Image</th>
            <th>Facebook</th>
            <th>LinkedIn</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="team_table_body"></tbody>
      </table>
    </div>
  </div>
  `;

  fetchTeamData(); // load all initially

  // ===== SEARCH =====
  const btn_search = document.getElementById("btn_search");
  const typeSearch = document.getElementById("typeSearch");

  btn_search.addEventListener("click", () => {
    const type = typeSearch.value;
    if (!type) return alert("Please select a type");

    // fetch from search API
    fetch(`http://localhost:1000/api/team/search?keyword=${encodeURIComponent(type)}`)
      .then(res => res.json())
      .then(data => renderTableTeam(data))
      .catch(err => console.error(err));
  });

  typeSearch.addEventListener("change", () => btn_search.click());
}

// ================= FETCH DATA =================
let TEAM_CACHE = [];

function fetchTeamData(type = "") {
  let url = "http://localhost:1000/api/team/getlist";
  if (type) url += `?type=${type}`;

  fetch(url)
    .then(res => res.json())
    .then(res => {
      TEAM_CACHE = res.data || [];
      renderTableTeam(TEAM_CACHE);
    })
    .catch(() => {
      document.getElementById("team_table_body").innerHTML =
        `<tr><td colspan="10" class="text-danger text-center">Failed to load data</td></tr>`;
    });
}

// ================= RENDER TABLE =================
function renderTableTeam(data) {
  const tbody = document.getElementById("team_table_body");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center">No data found</td></tr>`;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
   <tr>
  <td>${item.id}</td>
  <td>${item.full_name || ""}</td>
  <td>${item.full_name_kh || ""}</td>
  <td>${item.position_name || ""}</td>
  <td>${item.position_kh || ""}</td>

  <td>
    ${item.image_url
      ? `<img src="${item.image_url}"
              style="width:60px;height:80px;object-fit:cover;">`
      : ""}
  </td>

  <td title="${item.facebook_link || ""}">
    ${item.facebook_link || ""}
  </td>

  <td title="${item.linkedin_link || ""}">
    ${item.linkedin_link || ""}
  </td>

  <td>${item.type || ""}</td>

  <td>
    <div class="d-flex gap-1">
      <button class="btn btn-sm text-white"
        style="background:rgba(183,145,68,1)"
        onclick="openEditModal(${item.id})">Edit</button>

      <button class="btn btn-danger btn-sm"
        onclick="deleteItemTeam(${item.id})">Delete</button>
    </div>
  </td>
</tr>

    `;
  });
}

// ================= DELETE =================
function deleteItemTeam(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`http://localhost:1000/api/team/remove/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => fetchTeamData());
}

// ================= EDIT MODAL =================
function openEditModal(id) {
  const item = TEAM_CACHE.find(i => i.id === id);
  if (!item) return;

  removeModal("teamModal");

  document.body.insertAdjacentHTML("beforeend", modalHTML("edit"));

  document.getElementById("edit_id").value = item.id;
  document.getElementById("edit_name_en").value = item.full_name || "";
  document.getElementById("edit_name_kh").value = item.full_name_kh || "";
  document.getElementById("edit_position_en").value = item.position_name || "";
  document.getElementById("edit_position_kh").value = item.position_kh || "";
  document.getElementById("edit_type").value = item.type || "";
  document.getElementById("edit_facebook").value = item.facebook_link || "";
  document.getElementById("edit_linkedin").value = item.linkedin_link || "";
  document.getElementById("edit_image").value = item.image_url || "";

  new bootstrap.Modal(document.getElementById("teamModal")).show();
}

// ================= UPDATE =================
function submitUpdateTeam() {
  const id = document.getElementById("edit_id").value;
  const data = getFormData("edit");

  fetch(`http://localhost:1000/api/team/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => fetchTeamData());

  closeModal();
}

// ================= ADD MODAL =================
function openAddModalTeam() {
  removeModal("teamModal");
  document.body.insertAdjacentHTML("beforeend", modalHTML("add"));
  new bootstrap.Modal(document.getElementById("teamModal")).show();
}

// ================= ADD =================
function submitAddTeam() {
  const data = getFormData("add");

  fetch("http://localhost:1000/api/team/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => fetchTeamData());

  closeModal();
}

// ================= HELPERS =================
function getFormData(prefix) {
  return {
    full_name: document.getElementById(`${prefix}_name_en`).value,
    full_name_kh: document.getElementById(`${prefix}_name_kh`).value,
    position_name: document.getElementById(`${prefix}_position_en`).value,
    position_kh: document.getElementById(`${prefix}_position_kh`).value,
    type: document.getElementById(`${prefix}_type`).value,
    facebook_link: document.getElementById(`${prefix}_facebook`).value,
    linkedin_link: document.getElementById(`${prefix}_linkedin`).value,
    image_url: document.getElementById(`${prefix}_image`).value
  };
}

function closeModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById("teamModal"));
  if (modal) modal.hide();
  removeModal("teamModal");
}

function removeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.remove();
}

// ================= MODAL HTML =================
function modalHTML(type) {
  return `
  <div class="modal fade" id="teamModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${type === "add" ? "Add Team Member" : "Edit Team Member"}</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="${type}_id">
          ${formFields(type)}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="${type === "add" ? "submitAddTeam()" : "submitUpdateTeam()"}">
            ${type === "add" ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function formFields(p) {
  return `
  <div class="row g-3">
    <div class="col-md-6"><input id="${p}_name_en" class="form-control" placeholder="Full Name (EN)"></div>
    <div class="col-md-6"><input id="${p}_name_kh" class="form-control" placeholder="Full Name (KH)"></div>
    <div class="col-md-6"><textarea id="${p}_position_en" class="form-control" placeholder="Position (EN)"></textarea></div>
    <div class="col-md-6"><textarea id="${p}_position_kh" class="form-control" placeholder="Position (KH)"></textarea></div>
    <div class="col-md-4">
      <select id="${p}_type" class="form-control">
        <option value="">-- Type --</option>
        <option value="founder">Founder</option>
        <option value="team">Team</option>
        <option value="hidden">Hidden</option>
      </select>
    </div>
    <div class="col-md-4"><input id="${p}_image" class="form-control" placeholder="Image URL"></div>
    <div class="col-md-4"><input id="${p}_facebook" class="form-control" placeholder="Facebook Link"></div>
    <div class="col-md-4"><input id="${p}_linkedin" class="form-control" placeholder="LinkedIn Link"></div>
  </div>`;
}
