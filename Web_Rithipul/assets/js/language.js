// ==================================
// Global Variables
// ==================================
let currentLanguage = 'en'; // Default language
const languageSelect = document.getElementById('languageSelect');

const apiMap = {
  // services: "http://localhost:1000/api/service/getlist",
  // values: "http://localhost:1000/api/values/getlist",
  // milestone: "http://localhost:1000/api/milestone/getlist",
  // mission: "http://localhost:1000/api/mision/getlist",
  // curriculum: "http://localhost:1000/api/curriculum/getlist",
  // achievement: "http://localhost:1000/api/achievement/getlist",
  plans: "http://localhost:1000/api/newplan/getlist",
  teams: "http://localhost:1000/api/team/getlist",
  home: "http://localhost:1000/api/homepage/getlist",
  about: "http://localhost:1000/api/about/getlist"
};
// ==================================
// Language Switch Function
// ==================================
function switchLanguage(lang) {
  if (currentLanguage === lang && document.documentElement.lang === lang) return;

  document.documentElement.lang = lang;
  document.body.classList.toggle('khmer', lang === 'kh');

  const translatableElements = document.querySelectorAll('[data-kh]');
  translatableElements.forEach(el => {
    const text = lang === 'kh' ? el.dataset.kh : (el.dataset.en || el.innerHTML);
    el.innerHTML = text;
  });

  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);

  if (languageSelect) languageSelect.value = lang;
}
// ==================================
// Fetch & Render Helper
// ==================================
async function fetchAndRender(url, renderCallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API not found");
    const result = await res.json();
    renderCallback(result.data || []);
    // Apply language after rendering
    switchLanguage(currentLanguage);
  } catch (err) {
    console.error("API Error:", err);
  }
}
// ==================================
// Render Functions
// ==================================
// function renderServices(services) {
//   const serviceList = document.getElementById("serviceList");
//   if (!serviceList) return;
//   if (!services.length) {
//     serviceList.innerHTML = "<p>No services found</p>";
//     return;
//   }

//   let html = '';
//   services.forEach(item => {
//     const descriptions = item.description ? item.description.split('-').filter(i => i.trim() !== "") : [];
//     const descHtml = '<ul style="list-style: none; padding: 0;">' +
//       descriptions.map(text => `<li>- ${text.trim()}</li>`).join('') +
//       '</ul>';

//     html += `
//       <div class="col-lg-4">
//         <div class="feature-card">
//           <div class="feature-icon">
//             <i class="${item.icon_path || 'bi bi-easel'}"></i>
//           </div>
//           <div class="feature-content title-font">
//             <h3 data-en="${item.category_en}" data-kh="${item.category_kh}">${item.category_en}</h3>
//             <div class="desc-text" data-en="${item.description}" data-kh="${item.description_kh}">
//               ${descHtml}
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   });

//   serviceList.innerHTML = html;
// }

// function renderValues(values) {
//   const valueList = document.getElementById("valueList");
//   if (!valueList) return;
//   if (!values.length) {
//     valueList.innerHTML = "<p>No values found</p>";
//     return;
//   }

//   let html = '';
//   values.forEach(item => {
//     html += `
//       <div class="col">
//         <div class="value-card">
//           <div class="value-icon">
//             <i class="${item.icon_path || 'bi bi-award-fill'}"></i>
//           </div>
//           <h4 data-en="${item.category_en}" data-kh="${item.category_kh}" style="color: rgb(19, 73, 138);">
//             ${item.category_en} 
//           </h4>
//           <p data-en="${item.description_en}" data-kh="${item.description_kh}">
//             ${item.description_en}
//           </p>
//         </div>
//       </div>
//     `;
//   });

//   valueList.innerHTML = html;
// }

// function renderMilestone(milestones) {
//   const container = document.getElementById("timeline");
//   if (!container) return;
//   if (!milestones.length) {
//     container.innerHTML = "<p>No milestones found</p>";
//     return;
//   }

//   let html = '';
//   milestones.forEach(item => {
//     html += `
//       <div class="timeline-item">
//         <div class="timeline-dot"></div>
//         <div class="timeline-content">
//           <h4 data-en="${item.year}">${item.year}</h4>
//           <p data-en="${item.text}" data-kh="${item.text_kh}">${item.text}</p>
//         </div>
//       </div>
//     `;
//   });

//   container.innerHTML = html;
// }

// function renderMission(missions) {
//   const container = document.getElementById("mision");
//   if (!container) return;
//   if (!missions.length) {
//     container.innerHTML = "<p>No mission/vision found</p>";
//     return;
//   }

//   let html = '';
//   missions.forEach(item => {
//     html += `
//       <img src="${item.img}" alt="Campus" class="img-fluid rounded">
//       <div class="mission-vision title-font text-center">
//         <div class="mission">
//           <h3 class="fw-bold" data-en="${item.title_mision}" data-kh="${item.title_mision_kh}">${item.title_mision}</h3>
//           <p data-en="${item.mision}" data-kh="${item.mision_kh}">${item.mision}</p>
//           <a href="about.html" data-kh="មើលបន្ថែម.....">See more...</a>
//         </div>
//         <div class="vision">
//           <h3 class="fw-bold" data-en="${item.title_vision}" data-kh="${item.title_vision_kh}">${item.title_vision}</h3>
//           <p data-en="${item.vision}" data-kh="${item.vision_kh}">${item.vision}</p>
//           <a href="about.html" data-kh="មើលបន្ថែម.....">See more...</a>
//         </div>
//       </div>
//     `;
//   });

//   container.innerHTML = html;
// }

// function renderCurriculum(curriculums) {
//   const container = document.getElementById("curriculum");
//   if (!container) return;
//   if (!curriculums.length) {
//     container.innerHTML = "<p>No curriculum found</p>";
//     return;
//   }

//   let html = '';
//   curriculums.forEach(item => {
//     html += `
//       <div class="col-xl-6">
//         <article class="post-item d-flex" style="background-color: rgb(182, 135, 45);">
//           <div class="post-img">
//             <img src="${item.img}" alt="" class="img-fluid" loading="lazy">
//           </div>
//           <div class="post-content flex-grow-1">
//             <p class="post-description text-white" data-en="${item.text}" data-kh="${item.text_kh}">
//               ${item.text}
//             </p>
//           </div>
//         </article>
//       </div>
//     `;
//   });

//   container.innerHTML = html;
// }

// function renderAchievement(achievements) {
//   const container = document.getElementById("Achievement");
//   if (!container) return;
//   if (!achievements.length) {
//     container.innerHTML = "<p>No achievements found</p>";
//     return;
//   }

//   let html = '';
//   achievements.forEach(item => {
//     html += `
//       <div class="col-lg-6 col-md-6">
//         <div class="event-item">
//           <div class="event-image">
//             <img src="${item.img}" alt="Achievement" class="img-fluid">
//             <div class="event-date-overlay">
//               <span class="date"><img src="assets/img/achiment/youth.png" style="width: 40px;"></span>
//             </div>
//           </div>
//           <div class="event-details">
//             <p data-en="${item.text}" data-kh="${item.text_kh}">${item.text}</p>
//           </div>
//         </div>
//       </div>
//     `;
//   });

//   container.innerHTML = html;
// }

function renderPlans(plans) {
  const container = document.getElementById("plan");
  if (!container) return;

  if (!plans.length) {
    container.innerHTML = "<p>No plan found</p>";
    return;
  }

  let html = '';
  plans.forEach(item => {

    // ✅ choose language dynamically
    const title = currentLanguage === "kh" ? item.title_kh : item.title;
    const text = currentLanguage === "kh" ? item.text_kh : item.text;

    html += `
      <div
        class="event-item d-flex gap-4 p-3 mb-4 shadow-sm rounded-4 border-start border-4 border-dark-subtle bg-white"
        data-aos="fade-up">

        <div class="event-content w-100">
          <h3 class="event-title h5 fw-bold text-dark mb-2"
              data-kh="${item.title_kh}"
              data-en="${item.title}">
            ${title}
          </h3>

          <div class="event-meta d-flex gap-3 mb-3 text-muted small">
            <span>
              <i class="bi bi-calendar-check me-1 text-primary"></i>
              ${item.datestart}
            </span>
          </div>

          <div class="event-courses border-top pt-3">
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 rounded-2 bg-light-subtle hover-bg">
              <p class="mb-0 text-secondary"
                 data-en="${item.text}"
                 data-kh="${item.text_kh}">
                <i class="bi bi-dot text-primary fs-4"></i>
                ${text}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderTeam(teams) {
  const founderRow = document.getElementById("founderRow");
  const teamRow = document.getElementById("teamRow");
  const hiddenRow = document.getElementById("hiddenRow");

  if (!teams || !teams.length) return;

  founderRow && (founderRow.innerHTML = "");
  teamRow && (teamRow.innerHTML = "");
  hiddenRow && (hiddenRow.innerHTML = "");

  teams.forEach(item => {
    let card = "";

    // ✅ choose language
    const name = currentLanguage === "kh" ? item.full_name_kh || item.fullname_kh : item.full_name || item.fullname;
    const position = currentLanguage === "kh" ? item.position_kh : item.position_name;

    /* ================= FOUNDER ================= */
    if (item.type === "founder" && founderRow) {
      card = `
        <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
          <div class="organization-card-team">
            <img src="${item.image_url}" class="img-fluid rounded" alt="">
            <div class="mt-2">
              <h3 class="text-center fw-bold"
                  data-en="${item.full_name}"
                  data-kh="${item.full_name_kh}">
                ${name}
              </h3>
              <p class="text-center"
                 data-en="${item.position_name}"
                 data-kh="${item.position_kh}">
                ${position}
              </p>
            </div>

            <div class="d-flex justify-content-center gap-2 mb-3">
              <a href="${item.facebook_link}"><i class="bi bi-facebook"></i></a>
              <a href="${item.linkedin_link}"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
      `;
      founderRow.insertAdjacentHTML("beforeend", card);
    }

    /* ================= TEAM ================= */
    if (item.type === "team" && teamRow) {
      card = `
       <div class="col-md-3 d-flex justify-content-center"
     data-aos="zoom-in"
     data-aos-delay="100">

  <div class="organization-card-team-all text-center border rounded shadow-sm w-100"
       style="max-width:300px;">

    <img src="${item.image_url}" class="team-img w-100">

    <div class="p-3">
      <h5 class="fw-bold mb-1"
          data-en="${item.full_name}"
          data-kh="${item.full_name_kh}">
        ${name}
      </h5>

      <p class="text-muted mb-2"
         data-en="${item.position_name}"
         data-kh="${item.position_kh}">
        ${position}
      </p>

      <div class="d-flex justify-content-center gap-3">
        <a href="${item.facebook_link}" target="_blank">
          <i class="bi bi-facebook"></i>
        </a>
        <a href="${item.linkedin_link}" target="_blank">
          <i class="bi bi-linkedin"></i>
        </a>
      </div>
    </div>

  </div>
</div>

      `;
      teamRow.insertAdjacentHTML("beforeend", card);
    }

    /* ================= HIDDEN TEAM ================= */
    if (item.type === "hidden" && hiddenRow) {
      card = `
      <div class="col-12 col-sm-6 col-md-3 d-flex justify-content-center"
     data-aos="zoom-in"
     data-aos-delay="100">

  <div class="organization-card-team-all text-center border rounded shadow-sm w-100"
       style="max-width:300px;">

    <img src="${item.image_url || 'assets/img/default.png'}"
         class="team-img w-100">

    <div class="p-3">
      <h5 class="fw-bold mb-1"
          data-en="${item.full_name}"
          data-kh="${item.full_name_kh}">
        ${name}
      </h5>

      <p class="text-muted mb-2"
         data-en="${item.position_name}"
         data-kh="${item.position_kh}">
        ${position}
      </p>

      <div class="d-flex justify-content-center gap-2 mb-3">
              <a href="${item.facebook_link}"><i class="bi bi-facebook"></i></a>
              <a href="${item.linkedin_link}"><i class="bi bi-linkedin"></i></a>
            </div>
    </div>
  </div>
</div>

      `;
      hiddenRow.insertAdjacentHTML("beforeend", card);
    }
  });
}

function renderHome(home) {
  const milestone = document.getElementById("timeline");
  const valueList = document.getElementById("valueList");
  const curriculum = document.getElementById("curriculum");
  const achievement = document.getElementById("Achievement");
  const serviceList = document.getElementById("serviceList");
  const vissionList = document.getElementById("vission");

  // ✅ prevent crash on pages without these sections
  if (!home || !home.length) return;

  milestone && (milestone.innerHTML = "");
  valueList && (valueList.innerHTML = "");
  curriculum && (curriculum.innerHTML = "");
  achievement && (achievement.innerHTML = "");
  serviceList && (serviceList.innerHTML = "");
  vissionList && (vissionList.innerHTML = "");

  home.forEach(item => {
    let card = "";

    // ✅ choose language once
    const title = currentLanguage === "kh" ? item.category_kh : item.category_en;
    const desc = currentLanguage === "kh" ? item.description_kh : item.description_en;

    /* ================= SERVICES ================= */
    if (item.type === "service" && serviceList) {
      card = `
        <div class="col-lg-4">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="${item.icon_path || 'bi bi-easel'}"></i>
            </div>
            <div class="feature-content title-font">
              <h3 style="color: rgb(22, 72, 138) ;"  data-en="${item.category_en}" data-kh="${item.category_kh}">
                ${title}
              </h3>
              <div class="desc-text" data-en="${item.description_en}" data-kh="${item.description_kh}">
                ${desc}
              </div>
            </div>
          </div>
        </div>
      `;
      serviceList.insertAdjacentHTML("beforeend", card);
    }

    /* ================= MILESTONE ================= */
    if (item.type === "milestone" && milestone) {
      card = `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>${item.year}</h4>
            <p data-en="${item.description_en}" data-kh="${item.description_kh}">
              ${desc}
            </p>
          </div>
        </div>
      `;
      milestone.insertAdjacentHTML("beforeend", card);
    }

    /* ================= VALUES ================= */
    if (item.type === "values" && valueList) {
      card = `
        <div class="col">
          <div class="value-card">
            <div class="value-icon">
              <i class="${item.icon_path || 'bi bi-award-fill'}"></i>
            </div>
            <h4 data-en="${item.category_en}" data-kh="${item.category_kh}" style="color: rgb(19, 73, 138);">
              ${title}
            </h4>
            <p data-en="${item.description_en}" data-kh="${item.description_kh}">
              ${desc}
            </p>
          </div>
        </div>
      `;
      valueList.insertAdjacentHTML("beforeend", card);
    }

    /* ================= CURRICULUM ================= */
    if (item.type === "curriculum" && curriculum) {
      card = `
        <div class="col-xl-6">
          <article class="post-item d-flex" style="background-color: rgb(182, 135, 45);">
            <div class="post-img">
              <img src="${item.img}" class="img-fluid" loading="lazy">
            </div>
            <div class="post-content flex-grow-1">
              <p class="post-description text-white "
                 data-en="${item.description_en}"
                 data-kh="${item.description_kh}">
                ${desc}
              </p>
            </div>
          </article>
        </div>
      `;
      curriculum.insertAdjacentHTML("beforeend", card);
    }

    /* ================= ACHIEVEMENT ================= */
    if (item.type === "achievement" && achievement) {
      card = `
       <div class="col-lg-6 col-md-6">
  <div class="event-item">

    <div class="event-image position-relative">
      <img src="${item.img}" class="img-fluid w-100 rounded">

      <!-- Logo -->
     <img src="${item.logo}"
     class="position-absolute top-0 end-0 m-2 bg-white  rounded img-fluid"
     style="width:60px; height:60px; object-fit:contain;"
     alt="logo">

    </div>

    <div class="event-details mt-2">
      <p data-en="${item.description_en}" data-kh="${item.description_kh}">
        ${desc}
      </p>
    </div>

  </div>
</div>

      `;
      achievement.insertAdjacentHTML("beforeend", card);
    }

    /* ================= VISSION ================= */
    if (item.type === "vision" && vissionList) {
      card = `
  <div class="col-12">
          <img src="${item.img}" class="img-fluid w-100 rounded">
        </div>
         <!-- Text Column -->
        <div class="col-12">
          <div class="card-body p-4">
            <h4 class="fw-bold  text-center" style="color: rgb(22, 72, 138) ;"
                data-en="${item.category_en}" data-kh="${item.category_kh}">
              ${title}
            </h4>
            <p data-en="${item.description_en}" data-kh="${item.description_kh}">
              ${desc}
            </p>
            <a href="about.html" class="btn btn-sm" >See more.....</a>
          </div>
        </div>

        <!-- Image Column -->
       
      `;
      vissionList.insertAdjacentHTML("beforeend", card);
    }
  });
}

function renderAbout(about) {
  const training = document.getElementById("training");
  const who = document.getElementById("whoareyou");
  const imglogo = document.getElementById("imglogo");

  if (!about || !about.length) return;

  training && (training.innerHTML = "");
  who && (who.innerHTML = "");
  imglogo && (imglogo.innerHTML = "");

  about.forEach(item => {
    let card = "";

    // ✅ language decision
    const title = currentLanguage === "kh" ? item.category_kh : item.category_en;
    const desc = currentLanguage === "kh" ? item.description_kh : item.description_en;

    /* ================= FINANCIAL ================= */
    if (item.type === "Financial" && training) {
      card = `
        <div class="col-lg-6">
          <div class="value-card" style="background-color: rgba(183,145,68,1);">
            <div class="value-icon">
              <i class="bi bi-cash-coin text-light"></i>
            </div>
            <h1 class="fw-bold text-light"
                data-en="${item.category_en}"
                data-kh="${item.category_kh}">
              ${title}
            </h1>
            <div style="text-align: justify; margin: auto;">
              <p class="text-light" style="font-size:18px;"
                 data-en="${item.description_en}"
                 data-kh="${item.description_kh}">
                ${desc}
              </p>
            </div>
          </div>
        </div>
      `;
      training.insertAdjacentHTML("beforeend", card);
    }

    /* ================= SKILLS ================= */
    if (item.type === "skills" && training) {
      card = `
        <div class="col-lg-6">
          <div class="value-card" style="background-color: rgba(183,145,68,1);">
            <div class="value-icon">
              <i class="bi bi-people-fill text-light"></i>
            </div>
            <h1 class="fw-bold text-light"
                data-en="${item.category_en}"
                data-kh="${item.category_kh}">
              ${title}
            </h1>
            <div style="text-align: justify;   margin: auto;">
              <p class="text-light" style="font-size:18px;"
                 data-en="${item.description_en}"
                 data-kh="${item.description_kh}">
                ${desc}
              </p>
            </div>
          </div>
        </div>
      `;
      training.insertAdjacentHTML("beforeend", card);
    }

    /* ================= VISION ================= */
    if (item.type === "vission" && who) {
      card = `
        <div class="col-lg-6">
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-compass"></i>
            </div>
            <h1 class="fw-bold" style="color: rgb(22,72,138);"
                data-en="${item.category_en}"
                data-kh="${item.category_kh}">
              ${title}
            </h1>
            <div style="text-align: justify;  margin: auto;">
              <p class="text-center" style="color: rgb(22,72,138); font-size:20px;"
                 data-en="${item.description_en}"
                 data-kh="${item.description_kh}">
                ${desc}
              </p>
            </div>
          </div>
        </div>
      `;
      who.insertAdjacentHTML("beforeend", card);
    }

    /* ================= MISSION ================= */
    if (item.type === "mission" && who) {
      card = `
        <div class="col-lg-6">
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-rocket-takeoff"></i>
            </div>
            <h1 class="fw-bold" style="color: rgb(22,72,138);"
                data-en="${item.category_en}"
                data-kh="${item.category_kh}">
              ${title}
            </h1>
            <div style="text-align: justify;  margin: auto;">
              <p style="color: rgb(22,72,138); font-size:20px;"
                 data-en="${item.description_en}"
                 data-kh="${item.description_kh}">
                ${desc}
              </p>
            </div>
          </div>
        </div>
      `;
      who.insertAdjacentHTML("beforeend", card);
    }

    /* ================= BRAND ================= */
    if (item.type === "brand" && imglogo) {
      card = `
       <div class="text-center">
          <img src="${item.img_brand || ''}"
       class="img-fluid"
       style="height:400px;"
       alt="${item.brand_name || 'Partner logo'}">
          </div>

      `;
      imglogo.insertAdjacentHTML("beforeend", card);
    }
  });
}

// ==================================
// Initialize
// ==================================
document.addEventListener('DOMContentLoaded', () => {
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  switchLanguage(savedLanguage);

  // fetchAndRender(apiMap.services, renderServices);
  // fetchAndRender(apiMap.values, renderValues);
  // fetchAndRender(apiMap.milestone, renderMilestone);
  // fetchAndRender(apiMap.mission, renderMission);
  // fetchAndRender(apiMap.curriculum, renderCurriculum);
  // fetchAndRender(apiMap.achievement, renderAchievement);
  fetchAndRender(apiMap.plans, renderPlans);
  fetchAndRender(apiMap.teams, renderTeam);
  fetchAndRender(apiMap.home, renderHome);
  fetchAndRender(apiMap.about, renderAbout);
});

// ==================================
// Language Select Event
// ==================================
if (languageSelect) {
  languageSelect.addEventListener('change', e => switchLanguage(e.target.value));
}

// ==================================
// Keyboard shortcut: Ctrl/Cmd + L
// ==================================
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
    e.preventDefault();
    switchLanguage(currentLanguage === 'en' ? 'kh' : 'en');
  }
});
