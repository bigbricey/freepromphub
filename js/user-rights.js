// User Rights Management System
class UserRightsManager {
    constructor() {
        this.authSystem = new AuthSystem();
        this.currentUser = this.authSystem.getCurrentUser();
        this.rights = {
            access: true,
            rectification: true,
            erasure: true,
            restriction: true,
            portability: true,
            objection: true,
            withdrawConsent: true
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.checkCompliance();
    }
    
    setupEventListeners() {
        // Data export button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportUserData());
        }
        
        // Delete account button
        const deleteBtn = document.getElementById('deleteAccountBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteAccount());
        }
        
        // Data correction form
        const correctionForm = document.getElementById('dataCorrectionForm');
        if (correctionForm) {
            correctionForm.addEventListener('submit', (e) => this.handleCorrection(e));
        }
        
        // Restrict processing
        const restrictBtn = document.getElementById('restrictProcessingBtn');
        if (restrictBtn) {
            restrictBtn.addEventListener('click', () => this.restrictProcessing());
        }
        
        // Object to processing
        const objectBtn = document.getElementById('objectProcessingBtn');
        if (objectBtn) {
            objectBtn.addEventListener('click', () => this.objectToProcessing());
        }
    }
    
    loadUserData() {
        if (!this.currentUser) {
            this.showLoginPrompt();
            return;
        }
        
        // Display user data in dashboard
        this.displayUserInfo();
        this.displayDataCategories();
        this.displayProcessingActivities();
        this.displayConsentHistory();
    }
    
    displayUserInfo() {
        const infoContainer = document.getElementById('userInfoContainer');
        if (!infoContainer) return;
        
        infoContainer.innerHTML = `
            <div class="user-info-card">
                <h3>Your Account Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Name:</label>
                        <span>${this.currentUser.name}</span>
                        <button class="edit-btn" data-field="name">Edit</button>
                    </div>
                    <div class="info-item">
                        <label>Email:</label>
                        <span>${this.currentUser.email}</span>
                        <button class="edit-btn" data-field="email">Edit</button>
                    </div>
                    <div class="info-item">
                        <label>Account Created:</label>
                        <span>${new Date(this.currentUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="info-item">
                        <label>Last Login:</label>
                        <span>${new Date(this.currentUser.lastLogin || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add edit functionality
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.editField(e.target.dataset.field);
            });
        });
    }
    
    displayDataCategories() {
        const categoriesContainer = document.getElementById('dataCategoriesContainer');
        if (!categoriesContainer) return;
        
        const categories = this.getDataCategories();
        
        categoriesContainer.innerHTML = `
            <div class="data-categories-card">
                <h3>Data We Collect About You</h3>
                <div class="categories-list">
                    ${categories.map(cat => `
                        <div class="category-item">
                            <div class="category-header">
                                <h4>${cat.name}</h4>
                                <span class="data-count">${cat.count} items</span>
                            </div>
                            <p class="category-description">${cat.description}</p>
                            <div class="category-actions">
                                <button class="view-data-btn" data-category="${cat.id}">View Data</button>
                                <button class="download-category-btn" data-category="${cat.id}">Download</button>
                                <button class="delete-category-btn" data-category="${cat.id}">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.attachCategoryListeners();
    }
    
    getDataCategories() {
        const categories = [
            {
                id: 'profile',
                name: 'Profile Information',
                description: 'Your name, email, and account settings',
                count: 4
            },
            {
                id: 'activity',
                name: 'Activity Data',
                description: 'Prompts viewed, favorites, and search history',
                count: this.currentUser.history ? this.currentUser.history.length : 0
            },
            {
                id: 'preferences',
                name: 'Preferences',
                description: 'Your saved preferences and favorites',
                count: this.currentUser.favorites ? this.currentUser.favorites.length : 0
            },
            {
                id: 'consent',
                name: 'Consent Records',
                description: 'Your privacy choices and consent history',
                count: this.getConsentRecords().length
            }
        ];
        
        return categories;
    }
    
    displayProcessingActivities() {
        const activitiesContainer = document.getElementById('processingActivitiesContainer');
        if (!activitiesContainer) return;
        
        const activities = [
            {
                purpose: 'Account Management',
                legalBasis: 'Contract',
                dataUsed: 'Email, Name, Password',
                retention: 'Until account deletion',
                canObject: false
            },
            {
                purpose: 'Analytics',
                legalBasis: 'Legitimate Interest',
                dataUsed: 'Usage data, IP address',
                retention: '90 days',
                canObject: true
            },
            {
                purpose: 'Marketing',
                legalBasis: 'Consent',
                dataUsed: 'Email, Preferences',
                retention: 'Until consent withdrawn',
                canObject: true
            },
            {
                purpose: 'Security',
                legalBasis: 'Legal Obligation',
                dataUsed: 'IP address, Login attempts',
                retention: '1 year',
                canObject: false
            }
        ];
        
        activitiesContainer.innerHTML = `
            <div class="processing-activities-card">
                <h3>How We Process Your Data</h3>
                <table class="activities-table">
                    <thead>
                        <tr>
                            <th>Purpose</th>
                            <th>Legal Basis</th>
                            <th>Data Used</th>
                            <th>Retention</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activities.map(activity => `
                            <tr>
                                <td>${activity.purpose}</td>
                                <td>${activity.legalBasis}</td>
                                <td>${activity.dataUsed}</td>
                                <td>${activity.retention}</td>
                                <td>
                                    ${activity.canObject ? 
                                        `<button class="object-btn" data-purpose="${activity.purpose}">Object</button>` :
                                        `<span class="required-badge">Required</span>`
                                    }
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        // Add object button listeners
        document.querySelectorAll('.object-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.objectToActivity(e.target.dataset.purpose);
            });
        });
    }
    
    displayConsentHistory() {
        const historyContainer = document.getElementById('consentHistoryContainer');
        if (!historyContainer) return;
        
        const history = this.getConsentRecords();
        
        historyContainer.innerHTML = `
            <div class="consent-history-card">
                <h3>Your Consent History</h3>
                <div class="history-timeline">
                    ${history.map(record => `
                        <div class="history-item">
                            <div class="history-date">${new Date(record.timestamp).toLocaleDateString()}</div>
                            <div class="history-details">
                                <strong>${record.action}</strong>
                                <p>Categories: ${record.categories.join(', ')}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getConsentRecords() {
        const records = JSON.parse(localStorage.getItem('consentHistory') || '[]');
        return records;
    }
    
    exportUserData() {
        if (!this.currentUser) {
            alert('Please log in to export your data');
            return;
        }
        
        const userData = this.collectAllUserData();
        const dataStr = JSON.stringify(userData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportName = `freepromphub-data-${this.currentUser.email}-${Date.now()}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', exportName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        // Log the export
        this.logDataExport();
        
        // Show success message
        this.showNotification('Data exported successfully! Check your downloads folder.', 'success');
    }
    
    collectAllUserData() {
        const data = {
            exportDate: new Date().toISOString(),
            accountInfo: {
                id: this.currentUser.id,
                email: this.currentUser.email,
                name: this.currentUser.name,
                createdAt: this.currentUser.createdAt,
                lastLogin: this.currentUser.lastLogin
            },
            preferences: {
                favorites: this.currentUser.favorites || [],
                theme: localStorage.getItem('theme') || 'light',
                emailPreferences: this.getEmailPreferences()
            },
            activity: {
                history: this.currentUser.history || [],
                searchHistory: this.getSearchHistory(),
                ratings: this.getUserRatings()
            },
            consent: {
                current: this.getCurrentConsent(),
                history: this.getConsentRecords()
            },
            security: {
                loginHistory: this.getLoginHistory(),
                sessions: this.getActiveSessions()
            }
        };
        
        return data;
    }
    
    deleteAccount() {
        if (!this.currentUser) {
            alert('Please log in to delete your account');
            return;
        }
        
        const confirmation = confirm(
            'Are you sure you want to delete your account?\n\n' +
            'This action cannot be undone and will:\n' +
            '• Delete all your personal data\n' +
            '• Remove your favorites and history\n' +
            '• Cancel any email subscriptions\n' +
            '• Log you out permanently'
        );
        
        if (!confirmation) return;
        
        // Second confirmation for safety
        const email = prompt('Please type your email address to confirm deletion:');
        if (email !== this.currentUser.email) {
            alert('Email does not match. Account deletion cancelled.');
            return;
        }
        
        // Perform deletion
        this.performAccountDeletion();
    }
    
    performAccountDeletion() {
        // Log the deletion request
        this.logDeletionRequest();
        
        // Clear all user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter(u => u.id !== this.currentUser.id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Clear session
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('authToken');
        
        // Clear user-specific data
        this.clearUserSpecificData();
        
        // Show confirmation
        this.showNotification(
            'Your account has been successfully deleted. You will receive a confirmation email.',
            'success'
        );
        
        // Redirect to home after delay
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
    
    clearUserSpecificData() {
        // Clear favorites
        localStorage.removeItem(`favorites_${this.currentUser.id}`);
        
        // Clear history
        localStorage.removeItem(`history_${this.currentUser.id}`);
        
        // Clear ratings
        localStorage.removeItem(`ratings_${this.currentUser.id}`);
        
        // Clear preferences
        localStorage.removeItem(`preferences_${this.currentUser.id}`);
        
        // Clear consent
        localStorage.removeItem(`consent_${this.currentUser.id}`);
    }
    
    restrictProcessing() {
        const restriction = {
            userId: this.currentUser.id,
            timestamp: new Date().toISOString(),
            categories: ['analytics', 'marketing'],
            reason: 'User requested restriction'
        };
        
        localStorage.setItem(`restriction_${this.currentUser.id}`, JSON.stringify(restriction));
        
        this.showNotification(
            'Processing restricted. We will only process your data for essential services.',
            'success'
        );
        
        // Update UI to reflect restriction
        this.updateProcessingStatus('restricted');
    }
    
    objectToProcessing() {
        const objection = {
            userId: this.currentUser.id,
            timestamp: new Date().toISOString(),
            categories: ['marketing', 'profiling'],
            reason: 'User objection'
        };
        
        localStorage.setItem(`objection_${this.currentUser.id}`, JSON.stringify(objection));
        
        this.showNotification(
            'Objection recorded. We have stopped processing your data for marketing and profiling.',
            'success'
        );
        
        // Update consent
        const consent = this.getCurrentConsent();
        consent.marketing = false;
        consent.analytics = false;
        this.saveConsent(consent);
    }
    
    handleCorrection(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const corrections = {
            field: formData.get('field'),
            oldValue: formData.get('oldValue'),
            newValue: formData.get('newValue'),
            reason: formData.get('reason')
        };
        
        // Apply correction
        if (corrections.field === 'name') {
            this.currentUser.name = corrections.newValue;
        } else if (corrections.field === 'email') {
            this.currentUser.email = corrections.newValue;
        }
        
        // Save updated user
        this.authSystem.updateUser(this.currentUser);
        
        // Log correction
        this.logDataCorrection(corrections);
        
        this.showNotification('Your data has been corrected successfully.', 'success');
        
        // Refresh display
        this.displayUserInfo();
    }
    
    editField(field) {
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit ${field.charAt(0).toUpperCase() + field.slice(1)}</h3>
                <form id="editFieldForm">
                    <div class="form-group">
                        <label>Current Value:</label>
                        <input type="text" value="${this.currentUser[field]}" readonly>
                    </div>
                    <div class="form-group">
                        <label>New Value:</label>
                        <input type="text" name="newValue" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit">Save</button>
                        <button type="button" onclick="this.closest('.edit-modal').remove()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newValue = e.target.newValue.value;
            
            this.currentUser[field] = newValue;
            this.authSystem.updateUser(this.currentUser);
            
            modal.remove();
            this.displayUserInfo();
            this.showNotification(`${field} updated successfully`, 'success');
        });
    }
    
    attachCategoryListeners() {
        // View data buttons
        document.querySelectorAll('.view-data-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewCategoryData(e.target.dataset.category);
            });
        });
        
        // Download category buttons
        document.querySelectorAll('.download-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.downloadCategory(e.target.dataset.category);
            });
        });
        
        // Delete category buttons
        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteCategory(e.target.dataset.category);
            });
        });
    }
    
    viewCategoryData(category) {
        let data;
        
        switch(category) {
            case 'profile':
                data = {
                    name: this.currentUser.name,
                    email: this.currentUser.email,
                    created: this.currentUser.createdAt,
                    lastLogin: this.currentUser.lastLogin
                };
                break;
            case 'activity':
                data = this.currentUser.history || [];
                break;
            case 'preferences':
                data = this.currentUser.favorites || [];
                break;
            case 'consent':
                data = this.getConsentRecords();
                break;
        }
        
        // Display in modal
        this.showDataModal(category, data);
    }
    
    showDataModal(category, data) {
        const modal = document.createElement('div');
        modal.className = 'data-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)} Data</h3>
                <pre class="data-display">${JSON.stringify(data, null, 2)}</pre>
                <div class="modal-actions">
                    <button onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.textContent).then(() => alert('Copied to clipboard!'))">Copy</button>
                    <button onclick="this.closest('.data-modal').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    downloadCategory(category) {
        const data = this.getCategoryData(category);
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportName = `freepromphub-${category}-${Date.now()}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', exportName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        this.showNotification(`${category} data downloaded successfully`, 'success');
    }
    
    getCategoryData(category) {
        switch(category) {
            case 'profile':
                return {
                    name: this.currentUser.name,
                    email: this.currentUser.email,
                    created: this.currentUser.createdAt,
                    lastLogin: this.currentUser.lastLogin
                };
            case 'activity':
                return this.currentUser.history || [];
            case 'preferences':
                return this.currentUser.favorites || [];
            case 'consent':
                return this.getConsentRecords();
            default:
                return {};
        }
    }
    
    deleteCategory(category) {
        const confirm = window.confirm(`Are you sure you want to delete all ${category} data? This cannot be undone.`);
        
        if (!confirm) return;
        
        switch(category) {
            case 'activity':
                this.currentUser.history = [];
                break;
            case 'preferences':
                this.currentUser.favorites = [];
                break;
            default:
                this.showNotification(`Cannot delete ${category} data as it's required for account operation`, 'error');
                return;
        }
        
        this.authSystem.updateUser(this.currentUser);
        this.displayDataCategories();
        this.showNotification(`${category} data deleted successfully`, 'success');
    }
    
    objectToActivity(purpose) {
        const objections = JSON.parse(localStorage.getItem(`objections_${this.currentUser.id}`) || '[]');
        
        if (!objections.includes(purpose)) {
            objections.push(purpose);
            localStorage.setItem(`objections_${this.currentUser.id}`, JSON.stringify(objections));
            
            this.showNotification(`You have objected to processing for ${purpose}`, 'success');
            
            // Update UI
            this.displayProcessingActivities();
        }
    }
    
    getCurrentConsent() {
        const cookieConsent = new CookieConsent();
        return cookieConsent.getConsent();
    }
    
    saveConsent(consent) {
        const cookieConsent = new CookieConsent();
        cookieConsent.setConsent(consent);
    }
    
    getEmailPreferences() {
        return JSON.parse(localStorage.getItem(`emailPrefs_${this.currentUser.id}`) || '{}');
    }
    
    getSearchHistory() {
        return JSON.parse(localStorage.getItem(`searchHistory_${this.currentUser.id}`) || '[]');
    }
    
    getUserRatings() {
        return JSON.parse(localStorage.getItem(`userRatings_${this.currentUser.id}`) || '[]');
    }
    
    getLoginHistory() {
        return JSON.parse(localStorage.getItem(`loginHistory_${this.currentUser.id}`) || '[]');
    }
    
    getActiveSessions() {
        return JSON.parse(localStorage.getItem(`sessions_${this.currentUser.id}`) || '[]');
    }
    
    logDataExport() {
        const log = {
            action: 'data_export',
            timestamp: new Date().toISOString(),
            userId: this.currentUser.id
        };
        
        const logs = JSON.parse(localStorage.getItem('privacyLogs') || '[]');
        logs.push(log);
        localStorage.setItem('privacyLogs', JSON.stringify(logs));
    }
    
    logDeletionRequest() {
        const log = {
            action: 'account_deletion',
            timestamp: new Date().toISOString(),
            userId: this.currentUser.id,
            email: this.currentUser.email
        };
        
        const logs = JSON.parse(localStorage.getItem('deletionLogs') || '[]');
        logs.push(log);
        localStorage.setItem('deletionLogs', JSON.stringify(logs));
    }
    
    logDataCorrection(corrections) {
        const log = {
            action: 'data_correction',
            timestamp: new Date().toISOString(),
            userId: this.currentUser.id,
            corrections: corrections
        };
        
        const logs = JSON.parse(localStorage.getItem('correctionLogs') || '[]');
        logs.push(log);
        localStorage.setItem('correctionLogs', JSON.stringify(logs));
    }
    
    updateProcessingStatus(status) {
        const statusBadge = document.getElementById('processingStatus');
        if (statusBadge) {
            statusBadge.textContent = status;
            statusBadge.className = `status-badge status-${status}`;
        }
    }
    
    checkCompliance() {
        // Check user location for GDPR/CCPA
        const location = this.detectUserLocation();
        
        const complianceBadges = document.getElementById('complianceBadges');
        if (complianceBadges) {
            let badges = [];
            
            if (location.eu) {
                badges.push('<span class="compliance-badge gdpr">GDPR Protected</span>');
            }
            
            if (location.california) {
                badges.push('<span class="compliance-badge ccpa">CCPA Protected</span>');
            }
            
            if (location.uk) {
                badges.push('<span class="compliance-badge ukgdpr">UK GDPR Protected</span>');
            }
            
            complianceBadges.innerHTML = badges.join(' ');
        }
    }
    
    detectUserLocation() {
        // Simple detection based on timezone (in production, use proper geolocation)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        return {
            eu: timezone.includes('Europe'),
            california: timezone.includes('Los_Angeles') || timezone.includes('San_Francisco'),
            uk: timezone.includes('London')
        };
    }
    
    showLoginPrompt() {
        const container = document.querySelector('.user-rights-container');
        if (container) {
            container.innerHTML = `
                <div class="login-prompt">
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to access your privacy rights dashboard.</p>
                    <a href="/auth/login.html" class="btn btn-primary">Log In</a>
                    <a href="/auth/register.html" class="btn btn-secondary">Create Account</a>
                </div>
            `;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize on page load
if (document.querySelector('.user-rights-container')) {
    document.addEventListener('DOMContentLoaded', () => {
        new UserRightsManager();
    });
}