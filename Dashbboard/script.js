// ================= Global Elements =================
const navLinks = document.querySelectorAll('.nav-link[data-page]');
const contentDiv = document.getElementById('content');
const pageTitle = document.getElementById('page-title');
const sidebar = document.getElementById('sidebarMenu');
const toggleBtn = document.getElementById('toggleSidebar');
const overlay = document.getElementById('sidebarOverlay');

// ================= Sidebar Control Functions =================
function toggleMobileSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('active');
    overlay.classList.toggle('d-none');
}

function closeMobileSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('active');
    overlay.classList.add('d-none');
}

// Event Listeners
toggleBtn.addEventListener('click', toggleMobileSidebar);
overlay.addEventListener('click', closeMobileSidebar);

// ================= Page Navigation =================
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        const title = link.textContent;

        if (page) {
            loadPage(page, title);
        }

        // បិទ Sidebar វិញប្រសិនបើនៅលើ Mobile
        if (window.innerWidth < 768) {
            closeMobileSidebar();
        }
    });
});

// ================= Load Page Logic =================
function loadPage(page, title) {
    pageTitle.textContent = title;

    // ប្តូរពណ៌ Link (Active State)
    navLinks.forEach(l => l.classList.remove('active'));
    const currentLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (currentLink) currentLink.classList.add('active');

    // Dynamic Loading
    try {
        switch(page) {
            case 'home': loadHomePage(); break;
            case 'team': loadTeamPage(); break;
            case 'plan': loadPlanPage(); break;
            case 'about':loadAboutPage(); break;
            
            default:
                contentDiv.innerHTML = `<div class="alert alert-info">${title} content is coming soon!</div>`;
                break;
        }
    } catch (error) {
        console.error("Error loading page function:", error);
        contentDiv.innerHTML = `<p class="text-danger">Error: Make sure the function for "${page}" exists.</p>`;
    }
}

// Load default page on start
window.addEventListener('DOMContentLoaded', () => {
    loadPage('home', 'Home');
});

// Reset sidebar state on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        closeMobileSidebar();
    }
});