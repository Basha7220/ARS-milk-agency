/**
 * MAIN APP ENGINE
 * Orchestrates the application logic across different pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Global UI
    UI.initTheme();
    if (window.lucide) lucide.createIcons();

    // 2. Identify Current Page
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    if (page === 'index.html' || page === '') {
        initHomePage();
    } else if (page === 'login.html') {
        initLoginPage();
    } else if (page === 'admin.html') {
        initAdminPage();
    }
});

/**
 * HOME PAGE LOGIC
 */
function initHomePage() {
    const products = Products.getAll();
    const services = Services.getAll();

    // Render New Releases
    renderProductGrid('new-products-grid', Products.filter({ isNew: true }));

    // Render Best Sellers
    renderProductGrid('best-products-grid', Products.filter({ isBestSeller: true }));

    // Render All Products
    renderProductGrid('all-products-grid', products);

    // Render Services
    renderServicesGrid(services);

    // Auth Button State
    const loginBtn = document.getElementById('login-nav-btn');
    if (Auth.isAuthenticated()) {
        loginBtn.textContent = 'Admin Dashboard';
        loginBtn.href = 'admin.html';
    }

    // Search & Filter Logic
    const searchInput = document.getElementById('product-search');
    const categoryBtns = document.querySelectorAll('.category-btn');
    let activeCategory = 'All';

    const handleFilter = () => {
        const query = searchInput.value;
        const filtered = Products.filter({ 
            search: query, 
            category: activeCategory 
        });
        
        renderProductGrid('all-products-grid', filtered);
        
        const noResults = document.getElementById('no-results');
        if (filtered.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', handleFilter);
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
            categoryBtns.forEach(b => b.classList.add('btn-ghost'));
            
            btn.classList.add('active', 'btn-primary');
            btn.classList.remove('btn-ghost');
            
            activeCategory = btn.dataset.category;
            handleFilter();
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            UI.showToast('Message sent successfully! We will contact you soon.', 'success');
            contactForm.reset();
        };
    }
}

/**
 * LOGIN PAGE LOGIC
 */
function initLoginPage() {
    Auth.redirectIfAuthenticated();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const user = loginForm.username.value;
            const pass = loginForm.password.value;
            
            const result = Auth.login(user, pass);
            if (result.success) {
                UI.showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'admin.html', 1000);
            } else {
                UI.showToast(result.message, 'error');
            }
        };
    }
}

/**
 * ADMIN PAGE LOGIC
 */
function initAdminPage() {
    Auth.protectRoute();
    
    // Sidebar/Tab Navigation
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(s => {
                if (s.id === target) s.classList.remove('hidden');
                else s.classList.add('hidden');
            });
        });
    });

    // Stats
    updateAdminStats();

    // Render Content
    renderAdminProducts();
    renderAdminServices();

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => Auth.logout();
    }
}

/**
 * HELPER RENDERERS
 */
function renderProductGrid(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(p => {
        container.appendChild(UI.createProductCard(p));
    });
}

function renderServicesGrid(services) {
    const container = document.getElementById('services-grid');
    if (!container) return;
    
    container.innerHTML = '';
    services.forEach(s => {
        container.appendChild(UI.createServiceCard(s));
    });
}

/**
 * ADMIN FUNCTIONS (Stubbed - to be expanded in admin.html scripts)
 */
function updateAdminStats() {
    const pCount = Products.getAll().length;
    const sCount = Services.getAll().length;
    
    const pStat = document.getElementById('stat-products');
    const sStat = document.getElementById('stat-services');
    
    if (pStat) pStat.textContent = pCount;
    if (sStat) sStat.textContent = sCount;
}

function renderAdminProducts() {
    const products = Products.getAll();
    const table = document.getElementById('admin-products-list');
    if (!table) return;

    table.innerHTML = products.map(p => `
        <div class="card flex justify-between align-center" style="margin-bottom: 12px; padding: 16px;">
            <div class="flex align-center gap-4">
                <img src="${p.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                <div>
                    <h4 style="margin: 0;">${p.name}</h4>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${p.category} • ₹${p.price}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm edit-product" data-id="${p.id}"><i data-lucide="edit-2" style="width: 18px;"></i></button>
                <button class="btn btn-ghost btn-sm delete-product" data-id="${p.id}" style="color: #ef4444;"><i data-lucide="trash-2" style="width: 18px;"></i></button>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();
    
    // Attach events
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.onclick = () => {
            if (confirm('Are you sure you want to delete this product?')) {
                Products.delete(btn.dataset.id);
                UI.showToast('Product deleted', 'success');
                renderAdminProducts();
                updateAdminStats();
            }
        };
    });
}

function renderAdminServices() {
    const services = Services.getAll();
    const table = document.getElementById('admin-services-list');
    if (!table) return;

    table.innerHTML = services.map(s => `
        <div class="card flex justify-between align-center" style="margin-bottom: 12px; padding: 16px;">
            <div class="flex align-center gap-4">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="${s.icon}" style="width: 20px;"></i>
                </div>
                <div>
                    <h4 style="margin: 0;">${s.title}</h4>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm delete-service" data-id="${s.id}" style="color: #ef4444;"><i data-lucide="trash-2" style="width: 18px;"></i></button>
            </div>
        </div>
    `).join('');
    
    if (window.lucide) lucide.createIcons();

     // Attach events
     document.querySelectorAll('.delete-service').forEach(btn => {
        btn.onclick = () => {
            if (confirm('Are you sure you want to delete this service?')) {
                Services.delete(btn.dataset.id);
                UI.showToast('Service deleted', 'success');
                renderAdminServices();
                updateAdminStats();
            }
        };
    });
}
