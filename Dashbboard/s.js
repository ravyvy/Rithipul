
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const contentDiv = document.getElementById('content');
const pageTitle = document.getElementById('page-title');
const sidebar = document.getElementById('sidebarMenu');

/* Toggle sidebar mobile */
document.getElementById('toggleSidebar').addEventListener('click', () => {
  sidebar.classList.toggle('d-none');
});
function loadPage(page, title) {
  pageTitle.textContent = title;

  if (page === 'home') {
    contentDiv.innerHTML = `
      <div class="d-flex justify-content-end mb-3">
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
  <button class="btn btn-primary" id="btn_search">
    Search
  </button>
</div>

        <button 
          class="btn btn-primary btn-sm ms-3"
          style="width: 80px; height: 38px;"
          onclick="addModel()"
        >
          Add
        </button>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
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

    // Function to render table rows
    function renderTable(data) {
      const tableBody = document.getElementById("table_body");
      tableBody.innerHTML = "";

      if (!data || data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='10' class='text-center'>No results found</td></tr>";
        return;
      }

      data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="min-width: 60px;">${item.id}</td>
          <td style="min-width: 250px;">${item.category_en || ''}</td>
          <td style="min-width: 250px;">${item.category_kh || ''}</td>
          <td style="min-width: 400px;">${item.description_en || ''}</td>
          <td style="min-width: 400px;">${item.description_kh || ''}</td>
          <td style="min-width: 80px;">${item.icon_path || ''}</td>
          <td style="min-width: 100px;">
            ${item.img ? `<img src="${item.img}" class="rounded" style="max-height:50px;">` : ''}
          </td>
          <td style="min-width: 80px;">${item.year || ''}</td>
          <td style="min-width: 100px;">${item.type || ''}</td>
          <td style="min-width: 150px;">
            <button class="btn btn-sm btn-warning" onclick='openModal(${JSON.stringify(item)})'>Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    // Initial load of all data
    fetch('http://localhost:1000/api/homepage/getlist')
      .then(res => res.json())
      .then(result => renderTable(result.data))
      .catch(() => {
        const tableBody = document.getElementById("table_body");
        tableBody.innerHTML = "<tr><td colspan='10' class='text-center text-danger'>Failed to load data.</td></tr>";
      });

    // Attach search event
    const btn_search = document.getElementById("btn_search");
    const typeSearch = document.getElementById("typeSearch");
    const apiSearch = "http://localhost:1000/api/homepage/search";

    btn_search.addEventListener("click", () => {
      const selectedType = typeSearch.value;

      if (!selectedType) {
        alert("Please select a type");
        return;
      }

      fetch(`${apiSearch}?keyword=${encodeURIComponent(selectedType)}`)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error("Search error:", err));
    });

    // Optional: trigger search on Enter key
    typeSearch.addEventListener("change", () => {
      btn_search.click();
    });
    // Auto hide sidebar on mobile
    if (window.innerWidth < 768) {
      sidebar.classList.add('d-none');
    }

  } else {
    contentDiv.innerHTML = `<p>${title} content goes here.</p>`;
  }
}


// homepage
function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  fetch(`http://localhost:1000/api/homepage/remove/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(data => {
      alert("Deleted successfully!");
      // reload table or remove row
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("Error deleting item");
    });
}
const openModal = (item) => {
  // Remove existing modal
  const existingModal = document.getElementById("dynamicModal");
  if (existingModal) existingModal.remove();

  // Create modal HTML
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
              <div class="col-md-6">
                <label class="form-label">Category (EN)</label>
                <input type="text" class="form-control" id="category_en">
              </div>
              <div class="col-md-6">
                <label class="form-label">Category (KH)</label>
                <input type="text" class="form-control" id="category_kh">
              </div>
              <div class="col-md-6">
                <label class="form-label">Description (EN)</label>
                <textarea class="form-control" id="description_en"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Description (KH)</label>
                <textarea class="form-control" id="description_kh"></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label">Year</label>
                <input type="number" class="form-control" id="year">
              </div>
              <div class="col-md-4">
                <label class="form-label">Type</label>
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
              <div class="col-md-4">
                <label class="form-label">Icon Path</label>
                <input type="text" class="form-control" id="icon_path" placeholder="Enter icon path or URL">
              </div>
              <div class="col-md-4">
                <label class="form-label">Image</label>
                <input type="text" class="form-control" id="img" placeholder="Enter image URL">
              </div>
            </div>

          </form>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="submitUpdate()">Save changes</button>
        </div>

      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Pre-fill form values
  document.getElementById("update_id").value = item.id;
  document.getElementById("category_en").value = item.category_en || "";
  document.getElementById("category_kh").value = item.category_kh || "";
  document.getElementById("description_en").value = item.description_en || "";
  document.getElementById("description_kh").value = item.description_kh || "";
  document.getElementById("year").value = item.year || "";
  document.getElementById("type").value = item.type || "";
  document.getElementById("icon_path").value = item.icon_path || "";
  document.getElementById("img").value = item.img || "";

  // Show modal
  const myModal = new bootstrap.Modal(document.getElementById('dynamicModal'));
  myModal.show();
}
function submitUpdate() {
  const data = {
    category_en: document.getElementById("category_en").value,
    category_kh: document.getElementById("category_kh").value,
    description_en: document.getElementById("description_en").value,
    description_kh: document.getElementById("description_kh").value,
    year: document.getElementById("year").value,
    type: document.getElementById("type").value,
    icon_path: document.getElementById("icon_path").value,
    img: document.getElementById("img").value
  };

  const id = document.getElementById("update_id").value;

  fetch(`http://localhost:1000/api/homepage/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      alert("Updated successfully!");
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("Error updating data");
    });

  // Close and remove modal
  const modalEl = document.getElementById('dynamicModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance.hide();
  modalEl.remove();
}
// add
function addModel() {
  // Remove existing modal if any
  const existingModal = document.getElementById("addModal");
  if (existingModal) existingModal.remove();

  // Modal HTML
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
              <div class="col-md-6">
                <label class="form-label">Category (EN)</label>
                <input type="text" class="form-control" id="add_category_en">
              </div>

              <div class="col-md-6">
                <label class="form-label">Category (KH)</label>
                <input type="text" class="form-control" id="add_category_kh">
              </div>

              <div class="col-md-6">
                <label class="form-label">Description (EN)</label>
                <textarea class="form-control" id="add_description_en"></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label">Description (KH)</label>
                <textarea class="form-control" id="add_description_kh"></textarea>
              </div>

              <div class="col-md-4">
                <label class="form-label">Year</label>
                <input type="number" class="form-control" id="add_year">
              </div>

              <div class="col-md-4">
                <label class="form-label">Type</label>
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

              <div class="col-md-4">
                <label class="form-label">Icon Path</label>
                <input type="text" class="form-control" id="add_icon_path" placeholder="Enter icon path or URL">
              </div>

              <div class="col-md-4">
                <label class="form-label">Image</label>
                <input type="text" class="form-control" id="add_img" placeholder="Enter image URL">
              </div>
              <div class="col-md-4">
                <label class="form-label">logo</label>
                <input type="text" class="form-control" id="logo" placeholder="Enter logo URL">
              </div>

            </div>

          </form>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button class="btn btn-primary" onclick="submitAdd()">Add</button>
        </div>

      </div>
    </div>
  </div>
  `;

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Show modal
  const myModal = new bootstrap.Modal(document.getElementById('addModal'));
  myModal.show();
}
function submitAdd() {
  const data = {
    category_en: document.getElementById("add_category_en").value,
    category_kh: document.getElementById("add_category_kh").value,
    description_en: document.getElementById("add_description_en").value,
    description_kh: document.getElementById("add_description_kh").value,
    year: document.getElementById("add_year").value,
    type: document.getElementById("add_type").value,
    icon_path: document.getElementById("add_icon_path").value,
    img: document.getElementById("add_img").value,
    logo: document.getElementById("logo").value,

  };

  fetch("http://localhost:1000/api/homepage/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      alert("Added successfully!");
      location.reload(); // refresh table
    })
    .catch(err => {
      console.error(err);
      alert("Error adding data");
    });

  // Close and remove modal
  const modalEl = document.getElementById('addModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance.hide();
  modalEl.remove();
}


/* Nav click */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    loadPage(link.dataset.page, link.textContent);
  });
});

/* Default page */
loadPage('home', 'Home');

