/**
 * UI HELPERS
 * Handles themes, toasts, modals, and repetitive DOM tasks.
 */

const UI = {
    // Theme Management
    initTheme() {
        const savedTheme = localStorage.getItem('ars_theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('ars_theme', newTheme);
                this.updateThemeIcon(newTheme);
            });
        }
    },

    updateThemeIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;
        
        if (theme === 'dark') {
            toggleBtn.innerHTML = '<i data-lucide="moon"></i>';
        } else {
            toggleBtn.innerHTML = '<i data-lucide="sun"></i>';
        }
        if (window.lucide) lucide.createIcons();
    },

    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="flex align-center gap-2">
                <i data-lucide="${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    getToastIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'alert-triangle';
            default: return 'info';
        }
    },

    // Modal Management
    showModal(title, contentHtml, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <h2 style="margin-bottom: 24px;">${title}</h2>
                <div id="modal-body">${contentHtml}</div>
                <div class="flex justify-end gap-2" style="margin-top: 32px;">
                    <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="modal-confirm">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
        overlay.querySelector('#modal-confirm').onclick = () => {
            if (onConfirm()) overlay.remove();
        };

        // Close on escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },

    // Product Card Template
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'card flex flex-column gap-2';
        card.innerHTML = `
            <div style="position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 4/3;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 4px;">
                    ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
                    ${product.isBestSeller ? '<span class="badge badge-best">Best Seller</span>' : ''}
                </div>
            </div>
            <div class="flex-column gap-1">
                <span style="color: var(--primary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">${product.category}</span>
                <h3 style="font-size: 1.15rem;">${product.name}</h3>
                <div class="flex justify-between align-center" style="margin-top: 8px;">
                    <span style="font-size: 1.25rem; font-weight: 700;">₹${product.price}</span>
                    <button class="btn btn-primary btn-sm buy-btn" data-id="${product.id}" style="padding: 8px 16px; font-size: 0.9rem;">
                        <i data-lucide="shopping-cart" style="width: 16px; height: 16px;"></i>
                        Order
                    </button>
                </div>
            </div>
        `;
        
        // Add fake order event
        card.querySelector('.buy-btn').onclick = () => {
            this.showToast(`Order placed for ${product.name} - Demo only!`, 'success');
        };

        return card;
    },

    // Service Card Template
    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'card flex align-center gap-4';
        card.innerHTML = `
            <div style="width: 64px; height: 64px; min-width: 64px; border-radius: 16px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="${service.icon}" style="width: 32px; height: 32px;"></i>
            </div>
            <div>
                <h3 style="margin-bottom: 8px;">${service.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">${service.description}</p>
            </div>
        `;
        return card;
    }
};

window.UI = UI;
