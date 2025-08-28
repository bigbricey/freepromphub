// Simple client-side authentication system for FreePromptHub
// Uses localStorage for demo purposes - in production, use a proper backend

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.initializeAuth();
    }

    // Initialize authentication state
    initializeAuth() {
        const stored = localStorage.getItem('fph_user');
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
                this.updateUIState();
            } catch (e) {
                console.error('Invalid user data:', e);
                this.logout();
            }
        }
    }

    // Register new user
    register(email, password, name) {
        // Check if user exists
        const users = this.getAllUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        // Create new user
        const user = {
            id: this.generateId(),
            email,
            password: this.hashPassword(password), // Simple hash for demo
            name,
            createdAt: new Date().toISOString(),
            favorites: [],
            history: [],
            preferences: {
                emailNotifications: true,
                darkMode: false
            }
        };

        // Save to storage
        users.push(user);
        localStorage.setItem('fph_users', JSON.stringify(users));
        
        // Log them in
        this.login(email, password);
        return user;
    }

    // Login user
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.password !== this.hashPassword(password)) {
            throw new Error('Invalid password');
        }

        // Remove password from session
        const sessionUser = { ...user };
        delete sessionUser.password;
        
        this.currentUser = sessionUser;
        localStorage.setItem('fph_user', JSON.stringify(sessionUser));
        
        // Track login
        this.trackEvent('login');
        this.updateUIState();
        
        return sessionUser;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('fph_user');
        this.updateUIState();
        window.location.href = '/';
    }

    // Check if logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.isLoggedIn()) return false;
        
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) return false;
        
        // Update user data
        Object.assign(users[userIndex], updates);
        localStorage.setItem('fph_users', JSON.stringify(users));
        
        // Update session
        Object.assign(this.currentUser, updates);
        localStorage.setItem('fph_user', JSON.stringify(this.currentUser));
        
        return true;
    }

    // Add to favorites
    addFavorite(promptId, promptTitle, category) {
        if (!this.isLoggedIn()) {
            this.showLoginPrompt();
            return false;
        }
        
        const favorite = {
            id: promptId,
            title: promptTitle,
            category: category,
            addedAt: new Date().toISOString()
        };
        
        // Check if already favorited
        if (this.currentUser.favorites.find(f => f.id === promptId)) {
            return false;
        }
        
        this.currentUser.favorites.push(favorite);
        this.saveUserData();
        this.trackEvent('favorite_added', { promptId });
        
        return true;
    }

    // Remove from favorites
    removeFavorite(promptId) {
        if (!this.isLoggedIn()) return false;
        
        const index = this.currentUser.favorites.findIndex(f => f.id === promptId);
        if (index === -1) return false;
        
        this.currentUser.favorites.splice(index, 1);
        this.saveUserData();
        this.trackEvent('favorite_removed', { promptId });
        
        return true;
    }

    // Check if prompt is favorited
    isFavorited(promptId) {
        if (!this.isLoggedIn()) return false;
        return this.currentUser.favorites.some(f => f.id === promptId);
    }

    // Track prompt usage
    trackUsage(promptId, promptTitle, category) {
        if (!this.isLoggedIn()) return;
        
        const usage = {
            id: promptId,
            title: promptTitle,
            category: category,
            usedAt: new Date().toISOString(),
            copyCount: (this.getUsageCount(promptId) || 0) + 1
        };
        
        // Remove old entry if exists
        this.currentUser.history = this.currentUser.history.filter(h => h.id !== promptId);
        
        // Add to beginning of history
        this.currentUser.history.unshift(usage);
        
        // Keep only last 100 items
        if (this.currentUser.history.length > 100) {
            this.currentUser.history = this.currentUser.history.slice(0, 100);
        }
        
        this.saveUserData();
        this.trackEvent('prompt_used', { promptId });
    }

    // Get usage count for a prompt
    getUsageCount(promptId) {
        if (!this.isLoggedIn()) return 0;
        const item = this.currentUser.history.find(h => h.id === promptId);
        return item ? item.copyCount : 0;
    }

    // Track events for analytics
    trackEvent(event, data = {}) {
        const eventData = {
            event,
            userId: this.currentUser?.id,
            timestamp: new Date().toISOString(),
            ...data
        };
        
        // In production, send to analytics service
        console.log('Event tracked:', eventData);
        
        // Store locally for now
        const events = JSON.parse(localStorage.getItem('fph_events') || '[]');
        events.push(eventData);
        
        // Keep only last 1000 events
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        localStorage.setItem('fph_events', JSON.stringify(events));
    }

    // Get user statistics
    getUserStats() {
        if (!this.isLoggedIn()) return null;
        
        const totalUsage = this.currentUser.history.reduce((sum, item) => sum + item.copyCount, 0);
        const uniquePrompts = this.currentUser.history.length;
        const favoriteCount = this.currentUser.favorites.length;
        
        // Calculate category breakdown
        const categoryUsage = {};
        this.currentUser.history.forEach(item => {
            categoryUsage[item.category] = (categoryUsage[item.category] || 0) + item.copyCount;
        });
        
        // Find most used prompts
        const mostUsed = [...this.currentUser.history]
            .sort((a, b) => b.copyCount - a.copyCount)
            .slice(0, 5);
        
        return {
            totalUsage,
            uniquePrompts,
            favoriteCount,
            categoryUsage,
            mostUsed,
            memberSince: this.currentUser.createdAt
        };
    }

    // Helper methods
    getAllUsers() {
        return JSON.parse(localStorage.getItem('fph_users') || '[]');
    }

    saveUserData() {
        // Update in users list
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            // Preserve password from stored user
            const password = users[userIndex].password;
            users[userIndex] = { ...this.currentUser, password };
            localStorage.setItem('fph_users', JSON.stringify(users));
        }
        
        // Update session
        localStorage.setItem('fph_user', JSON.stringify(this.currentUser));
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash for demo - use bcrypt in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    showLoginPrompt() {
        if (confirm('You need to be logged in to use this feature. Would you like to login now?')) {
            window.location.href = '/auth/login.html';
        }
    }

    // Update UI based on auth state
    updateUIState() {
        const isLoggedIn = this.isLoggedIn();
        
        // Update navigation
        const authNav = document.querySelector('.auth-nav');
        if (authNav) {
            if (isLoggedIn) {
                authNav.innerHTML = `
                    <a href="/dashboard" class="nav-link">Dashboard</a>
                    <div class="user-menu">
                        <button class="user-menu-toggle">
                            <span class="user-avatar">${this.currentUser.name[0].toUpperCase()}</span>
                            <span class="user-name">${this.currentUser.name}</span>
                        </button>
                        <div class="user-dropdown">
                            <a href="/dashboard">My Dashboard</a>
                            <a href="/dashboard/favorites">Favorites</a>
                            <a href="/dashboard/history">History</a>
                            <a href="/dashboard/settings">Settings</a>
                            <hr>
                            <button onclick="auth.logout()">Logout</button>
                        </div>
                    </div>
                `;
            } else {
                authNav.innerHTML = `
                    <a href="/auth/login.html" class="nav-link">Login</a>
                    <a href="/auth/register.html" class="btn-primary">Sign Up Free</a>
                `;
            }
        }
        
        // Update favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const promptId = btn.dataset.promptId;
            if (this.isFavorited(promptId)) {
                btn.classList.add('favorited');
                btn.innerHTML = '❤️ Saved';
            } else {
                btn.classList.remove('favorited');
                btn.innerHTML = '🤍 Save';
            }
        });
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Export for use in other scripts
window.FPH = window.FPH || {};
window.FPH.auth = auth;