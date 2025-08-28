// Theme Switcher for FreePromptHub
(function() {
    'use strict';

    class ThemeSwitcher {
        constructor() {
            this.theme = this.getStoredTheme() || this.getSystemPreference();
            this.init();
        }

        init() {
            // Apply initial theme
            this.applyTheme(this.theme);
            
            // Add theme toggle to header
            this.addThemeToggle();
            
            // Listen for system theme changes
            this.watchSystemPreference();
            
            // Make theme switcher globally accessible
            window.themeSwitcher = this;
        }

        getStoredTheme() {
            return localStorage.getItem('theme');
        }

        setStoredTheme(theme) {
            localStorage.setItem('theme', theme);
        }

        getSystemPreference() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.theme = theme;
            this.updateToggleButton();
            
            // Update meta theme-color for mobile browsers
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.content = theme === 'dark' ? '#0F1419' : '#0066CC';
            }
        }

        toggleTheme() {
            const newTheme = this.theme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
            this.setStoredTheme(newTheme);
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: newTheme } 
            }));
        }

        addThemeToggle() {
            // Check if toggle already exists
            if (document.getElementById('theme-toggle-container')) {
                this.updateToggleButton();
                return;
            }

            // Find the header navigation
            const headerNav = document.querySelector('header nav');
            if (!headerNav) return;

            // Create toggle container
            const toggleContainer = document.createElement('div');
            toggleContainer.id = 'theme-toggle-container';
            toggleContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-left: auto;
                margin-right: 20px;
            `;

            // Create toggle button
            const toggleButton = document.createElement('button');
            toggleButton.id = 'theme-toggle';
            toggleButton.className = 'theme-toggle';
            toggleButton.setAttribute('aria-label', 'Toggle theme');
            toggleButton.setAttribute('title', 'Toggle dark/light mode');
            toggleButton.style.cssText = `
                position: relative;
                width: 60px;
                height: 30px;
                background: ${this.theme === 'dark' ? '#2A3040' : '#E9ECEF'};
                border-radius: 15px;
                border: 2px solid ${this.theme === 'dark' ? '#374151' : '#CED4DA'};
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                padding: 0;
                margin: 0;
            `;

            // Create slider
            const slider = document.createElement('span');
            slider.className = 'theme-toggle-slider';
            slider.style.cssText = `
                position: absolute;
                top: 2px;
                left: ${this.theme === 'dark' ? '32px' : '2px'};
                width: 22px;
                height: 22px;
                background: ${this.theme === 'dark' ? '#FFB74D' : '#FFC107'};
                border-radius: 50%;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;

            // Create icon
            const icon = document.createElement('span');
            icon.className = 'theme-toggle-icon';
            icon.innerHTML = this.theme === 'dark' ? '🌙' : '☀️';
            icon.style.cssText = `
                font-size: 12px;
                user-select: none;
            `;

            // Assemble toggle
            slider.appendChild(icon);
            toggleButton.appendChild(slider);
            toggleContainer.appendChild(toggleButton);

            // Add click handler
            toggleButton.addEventListener('click', () => this.toggleTheme());

            // Insert into header
            const searchLink = headerNav.querySelector('a[href="/search"]');
            if (searchLink) {
                headerNav.insertBefore(toggleContainer, searchLink.nextSibling);
            } else {
                headerNav.appendChild(toggleContainer);
            }

            // Add keyboard support
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        updateToggleButton() {
            const toggleButton = document.getElementById('theme-toggle');
            const slider = document.querySelector('.theme-toggle-slider');
            const icon = document.querySelector('.theme-toggle-icon');

            if (toggleButton) {
                toggleButton.style.background = this.theme === 'dark' ? '#2A3040' : '#E9ECEF';
                toggleButton.style.borderColor = this.theme === 'dark' ? '#374151' : '#CED4DA';
            }

            if (slider) {
                slider.style.left = this.theme === 'dark' ? '32px' : '2px';
                slider.style.background = this.theme === 'dark' ? '#FFB74D' : '#FFC107';
            }

            if (icon) {
                icon.innerHTML = this.theme === 'dark' ? '🌙' : '☀️';
            }
        }

        watchSystemPreference() {
            if (!window.matchMedia) return;

            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Modern browsers
            if (darkModeQuery.addEventListener) {
                darkModeQuery.addEventListener('change', (e) => {
                    // Only apply system preference if user hasn't set a preference
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            } 
            // Older browsers
            else if (darkModeQuery.addListener) {
                darkModeQuery.addListener((e) => {
                    if (!this.getStoredTheme()) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }

        // Public API methods
        setTheme(theme) {
            if (theme === 'light' || theme === 'dark') {
                this.applyTheme(theme);
                this.setStoredTheme(theme);
            }
        }

        getTheme() {
            return this.theme;
        }

        reset() {
            localStorage.removeItem('theme');
            this.theme = this.getSystemPreference();
            this.applyTheme(this.theme);
        }
    }

    // Initialize theme switcher when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ThemeSwitcher();
        });
    } else {
        new ThemeSwitcher();
    }

    // Add CSS for smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        /* Theme transition animations */
        html[data-theme] * {
            transition: background-color 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease,
                        box-shadow 0.3s ease !important;
        }
        
        /* Prevent transition on page load */
        html:not([data-theme]) * {
            transition: none !important;
        }
        
        /* Focus styles for accessibility */
        .theme-toggle:focus {
            outline: 2px solid var(--primary);
            outline-offset: 2px;
        }
        
        .theme-toggle:focus:not(:focus-visible) {
            outline: none;
        }
    `;
    document.head.appendChild(style);
})();