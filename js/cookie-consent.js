// Cookie Consent Manager for FreePromptHub
(function() {
    'use strict';

    class CookieConsent {
        constructor() {
            this.consentKey = 'fph_cookie_consent';
            this.preferencesKey = 'fph_cookie_preferences';
            this.consentVersion = '1.0';
            this.init();
        }

        init() {
            // Check if consent has been given
            const consent = this.getConsent();
            
            if (!consent || consent.version !== this.consentVersion) {
                this.showConsentBanner();
            } else {
                this.applyPreferences(consent.preferences);
            }

            // Add manage cookies link handler
            this.setupManageLink();
        }

        getConsent() {
            const stored = localStorage.getItem(this.consentKey);
            return stored ? JSON.parse(stored) : null;
        }

        setConsent(preferences) {
            const consent = {
                timestamp: new Date().toISOString(),
                version: this.consentVersion,
                preferences: preferences
            };
            localStorage.setItem(this.consentKey, JSON.stringify(consent));
            this.applyPreferences(preferences);
        }

        getPreferences() {
            const consent = this.getConsent();
            return consent ? consent.preferences : this.getDefaultPreferences();
        }

        getDefaultPreferences() {
            return {
                necessary: true, // Always enabled
                analytics: false,
                marketing: false,
                preferences: true
            };
        }

        applyPreferences(preferences) {
            // Apply necessary cookies (always on)
            this.enableNecessaryCookies();

            // Apply analytics
            if (preferences.analytics) {
                this.enableAnalytics();
            } else {
                this.disableAnalytics();
            }

            // Apply marketing
            if (preferences.marketing) {
                this.enableMarketing();
            } else {
                this.disableMarketing();
            }

            // Apply preference cookies
            if (preferences.preferences) {
                this.enablePreferences();
            } else {
                this.disablePreferences();
            }
        }

        enableNecessaryCookies() {
            // Session cookies, security tokens - always enabled
            console.log('Necessary cookies enabled');
        }

        enableAnalytics() {
            // Enable Simple Analytics (cookieless, but respect preference)
            if (window.simpleanalytics) {
                window.simpleanalytics.enabled = true;
            }
            console.log('Analytics enabled');
        }

        disableAnalytics() {
            // Disable analytics
            if (window.simpleanalytics) {
                window.simpleanalytics.enabled = false;
            }
            // Remove any analytics cookies
            this.deleteCookies(['_sa_']);
            console.log('Analytics disabled');
        }

        enableMarketing() {
            // Enable affiliate tracking
            window.fph_marketing_enabled = true;
            console.log('Marketing cookies enabled');
        }

        disableMarketing() {
            // Disable marketing cookies
            window.fph_marketing_enabled = false;
            this.deleteCookies(['_cb_', 'aff_']);
            console.log('Marketing cookies disabled');
        }

        enablePreferences() {
            // User preferences already in localStorage
            console.log('Preference storage enabled');
        }

        disablePreferences() {
            // Clear non-essential preferences
            const essentials = ['theme', this.consentKey];
            Object.keys(localStorage).forEach(key => {
                if (!essentials.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('Preference storage disabled');
        }

        showConsentBanner() {
            // Create banner HTML
            const banner = document.createElement('div');
            banner.id = 'cookie-consent-banner';
            banner.className = 'cookie-banner';
            banner.setAttribute('role', 'dialog');
            banner.setAttribute('aria-label', 'Cookie consent');
            
            banner.innerHTML = `
                <div class="cookie-banner-content">
                    <div class="cookie-banner-text">
                        <h3>🍪 We value your privacy</h3>
                        <p>We use cookies to enhance your browsing experience, analyze site traffic, and serve personalized content. By clicking "Accept All", you consent to our use of cookies.</p>
                        <a href="/cookie-policy" target="_blank">Learn more about our Cookie Policy</a>
                    </div>
                    <div class="cookie-banner-actions">
                        <button id="cookie-accept-all" class="btn-primary">Accept All</button>
                        <button id="cookie-accept-necessary" class="btn-secondary">Necessary Only</button>
                        <button id="cookie-customize" class="btn-secondary">Customize</button>
                    </div>
                </div>
            `;

            // Add styles
            this.addBannerStyles();

            // Add to page
            document.body.appendChild(banner);

            // Add event listeners
            document.getElementById('cookie-accept-all').addEventListener('click', () => {
                this.acceptAll();
            });

            document.getElementById('cookie-accept-necessary').addEventListener('click', () => {
                this.acceptNecessary();
            });

            document.getElementById('cookie-customize').addEventListener('click', () => {
                this.showCustomizeModal();
            });

            // Announce to screen readers
            this.announceToScreenReader('Cookie consent banner is displayed. Please make your cookie preferences selection.');
        }

        showCustomizeModal() {
            const modal = document.createElement('div');
            modal.id = 'cookie-customize-modal';
            modal.className = 'cookie-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-label', 'Customize cookie preferences');

            const currentPrefs = this.getPreferences();

            modal.innerHTML = `
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h2>Cookie Preferences</h2>
                        <button class="close-modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="cookie-modal-body">
                        <p>Manage your cookie preferences below. You can enable or disable different types of cookies based on your preference.</p>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-switch">
                                    <input type="checkbox" checked disabled>
                                    <span class="cookie-slider"></span>
                                </label>
                                <div>
                                    <h3>Necessary Cookies</h3>
                                    <span class="cookie-badge">Always Enabled</span>
                                </div>
                            </div>
                            <p>These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
                            <details>
                                <summary>View cookies</summary>
                                <ul>
                                    <li>Session ID (maintains your session)</li>
                                    <li>CSRF Token (security)</li>
                                    <li>Cookie Consent (remembers your choice)</li>
                                </ul>
                            </details>
                        </div>

                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-switch">
                                    <input type="checkbox" id="pref-analytics" ${currentPrefs.analytics ? 'checked' : ''}>
                                    <span class="cookie-slider"></span>
                                </label>
                                <div>
                                    <h3>Analytics Cookies</h3>
                                    <span class="cookie-badge">Optional</span>
                                </div>
                            </div>
                            <p>These cookies help us understand how visitors interact with our website by collecting anonymous information.</p>
                            <details>
                                <summary>View cookies</summary>
                                <ul>
                                    <li>Simple Analytics (privacy-focused, no personal data)</li>
                                    <li>Page view tracking</li>
                                    <li>Session duration</li>
                                </ul>
                            </details>
                        </div>

                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-switch">
                                    <input type="checkbox" id="pref-marketing" ${currentPrefs.marketing ? 'checked' : ''}>
                                    <span class="cookie-slider"></span>
                                </label>
                                <div>
                                    <h3>Marketing Cookies</h3>
                                    <span class="cookie-badge">Optional</span>
                                </div>
                            </div>
                            <p>These cookies track your activity to help deliver advertising more relevant to you and measure campaign effectiveness.</p>
                            <details>
                                <summary>View cookies</summary>
                                <ul>
                                    <li>Affiliate tracking (ClickBank)</li>
                                    <li>Conversion tracking</li>
                                    <li>Remarketing tags</li>
                                </ul>
                            </details>
                        </div>

                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <label class="cookie-switch">
                                    <input type="checkbox" id="pref-preferences" ${currentPrefs.preferences ? 'checked' : ''}>
                                    <span class="cookie-slider"></span>
                                </label>
                                <div>
                                    <h3>Preference Cookies</h3>
                                    <span class="cookie-badge">Recommended</span>
                                </div>
                            </div>
                            <p>These cookies remember your preferences and choices to provide a personalized experience.</p>
                            <details>
                                <summary>View cookies</summary>
                                <ul>
                                    <li>Theme preference (dark/light mode)</li>
                                    <li>Language preference</li>
                                    <li>Saved favorites</li>
                                    <li>Usage history</li>
                                </ul>
                            </details>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button id="save-preferences" class="btn-primary">Save Preferences</button>
                        <button id="accept-all-modal" class="btn-secondary">Accept All</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event listeners
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.remove();
            });

            document.getElementById('save-preferences').addEventListener('click', () => {
                this.saveCustomPreferences();
                modal.remove();
            });

            document.getElementById('accept-all-modal').addEventListener('click', () => {
                this.acceptAll();
                modal.remove();
            });

            // Click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Focus management
            modal.querySelector('.close-modal').focus();
        }

        saveCustomPreferences() {
            const preferences = {
                necessary: true,
                analytics: document.getElementById('pref-analytics').checked,
                marketing: document.getElementById('pref-marketing').checked,
                preferences: document.getElementById('pref-preferences').checked
            };

            this.setConsent(preferences);
            this.hideBanner();
            this.showConfirmation('Your cookie preferences have been saved');
        }

        acceptAll() {
            const preferences = {
                necessary: true,
                analytics: true,
                marketing: true,
                preferences: true
            };

            this.setConsent(preferences);
            this.hideBanner();
            this.showConfirmation('All cookies accepted');
        }

        acceptNecessary() {
            const preferences = {
                necessary: true,
                analytics: false,
                marketing: false,
                preferences: false
            };

            this.setConsent(preferences);
            this.hideBanner();
            this.showConfirmation('Only necessary cookies accepted');
        }

        hideBanner() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.style.animation = 'slideDown 0.3s ease-out forwards';
                setTimeout(() => banner.remove(), 300);
            }
        }

        showConfirmation(message) {
            const confirmation = document.createElement('div');
            confirmation.className = 'cookie-confirmation';
            confirmation.textContent = message;
            document.body.appendChild(confirmation);

            setTimeout(() => {
                confirmation.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => confirmation.remove(), 300);
            }, 3000);
        }

        setupManageLink() {
            // Add event listener for "Manage Cookies" links
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-manage-cookies]')) {
                    e.preventDefault();
                    this.showCustomizeModal();
                }
            });
        }

        deleteCookies(patterns) {
            document.cookie.split(';').forEach(cookie => {
                const name = cookie.split('=')[0].trim();
                if (patterns.some(pattern => name.startsWith(pattern))) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            });
        }

        announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.className = 'sr-only';
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.textContent = message;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }

        addBannerStyles() {
            if (document.getElementById('cookie-consent-styles')) return;

            const styles = document.createElement('style');
            styles.id = 'cookie-consent-styles';
            styles.textContent = `
                .cookie-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: var(--bg-primary, white);
                    border-top: 2px solid var(--primary, #0066CC);
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
                    z-index: 9999;
                    animation: slideUp 0.3s ease-out;
                }

                .cookie-banner-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }

                .cookie-banner-text {
                    flex: 1;
                    min-width: 300px;
                }

                .cookie-banner-text h3 {
                    margin-bottom: 10px;
                    color: var(--text-primary);
                }

                .cookie-banner-text p {
                    margin-bottom: 10px;
                    color: var(--text-secondary);
                }

                .cookie-banner-text a {
                    color: var(--primary);
                    text-decoration: underline;
                }

                .cookie-banner-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .cookie-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease-out;
                }

                .cookie-modal-content {
                    background: var(--bg-primary);
                    border-radius: 8px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    animation: scaleIn 0.3s ease-out;
                }

                .cookie-modal-header {
                    padding: 20px;
                    border-bottom: 1px solid var(--border-light);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .cookie-modal-body {
                    padding: 20px;
                }

                .cookie-modal-footer {
                    padding: 20px;
                    border-top: 1px solid var(--border-light);
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .close-modal {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text-secondary);
                }

                .cookie-category {
                    margin-bottom: 25px;
                    padding: 15px;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }

                .cookie-category-header {
                    display: flex;
                    gap: 15px;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }

                .cookie-category h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }

                .cookie-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    background: var(--primary);
                    color: white;
                    border-radius: 4px;
                    font-size: 0.75rem;
                }

                .cookie-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }

                .cookie-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .cookie-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }

                .cookie-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }

                input:checked + .cookie-slider {
                    background-color: var(--primary);
                }

                input:checked + .cookie-slider:before {
                    transform: translateX(26px);
                }

                input:disabled + .cookie-slider {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .cookie-confirmation {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: var(--success, #4CAF50);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10001;
                    animation: slideInRight 0.3s ease-out;
                }

                details summary {
                    cursor: pointer;
                    color: var(--primary);
                    margin-top: 10px;
                }

                details ul {
                    margin-top: 10px;
                    margin-left: 20px;
                    color: var(--text-secondary);
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }

                @keyframes slideDown {
                    from { transform: translateY(0); }
                    to { transform: translateY(100%); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }

                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                @media (max-width: 768px) {
                    .cookie-banner-content {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .cookie-banner-actions {
                        justify-content: stretch;
                    }

                    .cookie-banner-actions button {
                        flex: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Initialize cookie consent when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.cookieConsent = new CookieConsent();
        });
    } else {
        window.cookieConsent = new CookieConsent();
    }
})();