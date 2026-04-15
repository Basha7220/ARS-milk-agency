/**
 * AUTHENTICATION SYSTEM
 * Handles admin login, session persistence, and logout.
 */

const Auth = {
    ADMIN_CREDENTIALS: {
        username: 'admin',
        password: 'admin123'
    },
    
    STORAGE_KEY: 'ars_auth_state',

    // Check if user is logged in
    isAuthenticated() {
        const state = localStorage.getItem(this.STORAGE_KEY);
        if (!state) return false;
        
        try {
            const parsed = JSON.parse(state);
            return parsed.isLoggedIn && parsed.username === this.ADMIN_CREDENTIALS.username;
        } catch (e) {
            return false;
        }
    },

    // Login function
    login(username, password) {
        if (username === this.ADMIN_CREDENTIALS.username && password === this.ADMIN_CREDENTIALS.password) {
            const state = {
                isLoggedIn: true,
                username: username,
                loginTime: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
            return { success: true };
        }
        return { success: false, message: 'Invalid username or password' };
    },

    // Logout function
    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.location.href = 'index.html';
    },

    // Protected route check
    protectRoute() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    },

    // Redirect if already logged in (used on login page)
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'admin.html';
        }
    }
};

// Global export
window.Auth = Auth;
