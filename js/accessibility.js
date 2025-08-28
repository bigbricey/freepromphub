// Accessibility Enhancement System for FreePromptHub
(function() {
    'use strict';

    class AccessibilityManager {
        constructor() {
            this.focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
            this.currentFocusIndex = 0;
            this.init();
        }

        init() {
            // Add skip navigation links
            this.addSkipLinks();
            
            // Enhance keyboard navigation
            this.setupKeyboardNavigation();
            
            // Add ARIA live regions
            this.addAriaLiveRegions();
            
            // Enhance focus management
            this.enhanceFocusManagement();
            
            // Add screen reader announcements
            this.setupScreenReaderAnnouncements();
            
            // Improve form accessibility
            this.enhanceFormAccessibility();
            
            // Add landmark roles
            this.addLandmarkRoles();
            
            // Setup focus trap for modals
            this.setupModalFocusTrap();
            
            // Add keyboard shortcuts help
            this.addKeyboardShortcuts();
        }

        addSkipLinks() {
            // Check if skip links already exist
            if (document.querySelector('.skip-links')) return;
            
            // Create skip links container
            const skipLinks = document.createElement('div');
            skipLinks.className = 'skip-links';
            skipLinks.setAttribute('role', 'navigation');
            skipLinks.setAttribute('aria-label', 'Skip links');
            
            skipLinks.innerHTML = `
                <a href="#main-content" class="skip-link">Skip to main content</a>
                <a href="#main-navigation" class="skip-link">Skip to navigation</a>
                <a href="#search" class="skip-link">Skip to search</a>
                <a href="#footer" class="skip-link">Skip to footer</a>
            `;
            
            // Insert at the beginning of body
            document.body.insertBefore(skipLinks, document.body.firstChild);
            
            // Add corresponding IDs to elements if missing
            const main = document.querySelector('main');
            if (main && !main.id) main.id = 'main-content';
            
            const nav = document.querySelector('header nav');
            if (nav && !nav.id) nav.id = 'main-navigation';
            
            const footer = document.querySelector('footer');
            if (footer && !footer.id) footer.id = 'footer';
            
            const search = document.querySelector('.search-input, input[type="search"]');
            if (search && !search.id) search.id = 'search';
        }

        setupKeyboardNavigation() {
            // Global keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // Alt + S: Jump to search
                if (e.altKey && e.key === 's') {
                    e.preventDefault();
                    const search = document.querySelector('#search, .search-input');
                    if (search) {
                        search.focus();
                        this.announceToScreenReader('Search field focused');
                    }
                }
                
                // Alt + M: Jump to main content
                if (e.altKey && e.key === 'm') {
                    e.preventDefault();
                    const main = document.querySelector('#main-content');
                    if (main) {
                        main.setAttribute('tabindex', '-1');
                        main.focus();
                        this.announceToScreenReader('Main content focused');
                    }
                }
                
                // Alt + N: Jump to navigation
                if (e.altKey && e.key === 'n') {
                    e.preventDefault();
                    const nav = document.querySelector('#main-navigation');
                    if (nav) {
                        const firstLink = nav.querySelector('a');
                        if (firstLink) {
                            firstLink.focus();
                            this.announceToScreenReader('Navigation menu focused');
                        }
                    }
                }
                
                // Escape key closes modals/dropdowns
                if (e.key === 'Escape') {
                    this.closeActiveModal();
                    this.closeMobileMenu();
                }
                
                // ? key shows keyboard shortcuts (when not in input)
                if (e.key === '?' && !this.isInputFocused()) {
                    e.preventDefault();
                    this.showKeyboardShortcuts();
                }
            });
            
            // Arrow key navigation for menus
            this.setupArrowKeyNavigation();
            
            // Tab trap for modals
            this.setupTabTrap();
        }

        setupArrowKeyNavigation() {
            const menus = document.querySelectorAll('.main-nav, .category-grid, .prompt-grid');
            
            menus.forEach(menu => {
                const items = menu.querySelectorAll('a, button');
                
                menu.addEventListener('keydown', (e) => {
                    const currentIndex = Array.from(items).indexOf(document.activeElement);
                    
                    if (currentIndex === -1) return;
                    
                    let nextIndex = currentIndex;
                    
                    switch(e.key) {
                        case 'ArrowRight':
                        case 'ArrowDown':
                            e.preventDefault();
                            nextIndex = (currentIndex + 1) % items.length;
                            break;
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            e.preventDefault();
                            nextIndex = (currentIndex - 1 + items.length) % items.length;
                            break;
                        case 'Home':
                            e.preventDefault();
                            nextIndex = 0;
                            break;
                        case 'End':
                            e.preventDefault();
                            nextIndex = items.length - 1;
                            break;
                    }
                    
                    if (nextIndex !== currentIndex) {
                        items[nextIndex].focus();
                    }
                });
            });
        }

        addAriaLiveRegions() {
            // Create announcement region for screen readers
            if (!document.querySelector('#aria-live-region')) {
                const liveRegion = document.createElement('div');
                liveRegion.id = 'aria-live-region';
                liveRegion.className = 'sr-only';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                document.body.appendChild(liveRegion);
            }
            
            // Create alert region for important messages
            if (!document.querySelector('#aria-alert-region')) {
                const alertRegion = document.createElement('div');
                alertRegion.id = 'aria-alert-region';
                alertRegion.className = 'sr-only';
                alertRegion.setAttribute('role', 'alert');
                alertRegion.setAttribute('aria-live', 'assertive');
                document.body.appendChild(alertRegion);
            }
        }

        announceToScreenReader(message, priority = 'polite') {
            const region = priority === 'assertive' 
                ? document.querySelector('#aria-alert-region')
                : document.querySelector('#aria-live-region');
                
            if (region) {
                region.textContent = message;
                // Clear after announcement
                setTimeout(() => {
                    region.textContent = '';
                }, 1000);
            }
        }

        enhanceFocusManagement() {
            // Add visible focus indicators
            const style = document.createElement('style');
            style.textContent = `
                /* Enhanced focus indicators */
                *:focus {
                    outline: 3px solid var(--primary, #0066CC);
                    outline-offset: 2px;
                }
                
                /* Skip links */
                .skip-links {
                    position: absolute;
                    top: -40px;
                    left: 0;
                    z-index: 10000;
                    padding: 8px;
                    background: var(--bg-primary, white);
                }
                
                .skip-link {
                    position: absolute;
                    left: -10000px;
                    top: auto;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                    padding: 10px 15px;
                    background: var(--primary, #0066CC);
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                }
                
                .skip-link:focus {
                    position: absolute;
                    left: 10px;
                    top: 10px;
                    width: auto;
                    height: auto;
                    z-index: 10001;
                }
                
                /* Screen reader only text */
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                /* Focus trap indicator */
                .focus-trap-active {
                    position: relative;
                }
                
                .focus-trap-active::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    z-index: 998;
                }
                
                .focus-trap-active > * {
                    position: relative;
                    z-index: 999;
                }
                
                /* Keyboard focus only (not mouse clicks) */
                .js-focus-visible :focus:not(.focus-visible) {
                    outline: none;
                }
                
                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    *:focus {
                        outline-width: 4px;
                        outline-style: solid;
                    }
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Track focus source (keyboard vs mouse)
            this.trackFocusSource();
        }

        trackFocusSource() {
            let hadKeyboardEvent = false;
            
            const onPointerDown = () => {
                hadKeyboardEvent = false;
            };
            
            const onKeyDown = (e) => {
                if (e.key === 'Tab') {
                    hadKeyboardEvent = true;
                }
            };
            
            const onFocus = (e) => {
                if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
                    e.target.classList.add('focus-visible');
                }
            };
            
            const onBlur = (e) => {
                e.target.classList.remove('focus-visible');
            };
            
            document.addEventListener('keydown', onKeyDown, true);
            document.addEventListener('mousedown', onPointerDown, true);
            document.addEventListener('focus', onFocus, true);
            document.addEventListener('blur', onBlur, true);
        }

        enhanceFormAccessibility() {
            // Add labels to unlabeled form controls
            const inputs = document.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Skip if already has label
                if (input.labels && input.labels.length > 0) return;
                if (input.getAttribute('aria-label')) return;
                
                // Try to find associated text
                const placeholder = input.getAttribute('placeholder');
                const name = input.getAttribute('name');
                const type = input.getAttribute('type');
                
                // Set appropriate aria-label
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                } else if (name) {
                    const label = name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    input.setAttribute('aria-label', label);
                } else if (type) {
                    input.setAttribute('aria-label', `${type} input`);
                }
                
                // Add required indicator
                if (input.hasAttribute('required')) {
                    const currentLabel = input.getAttribute('aria-label') || '';
                    input.setAttribute('aria-label', currentLabel + ' (required)');
                    input.setAttribute('aria-required', 'true');
                }
            });
            
            // Enhance error messages
            this.enhanceErrorMessages();
        }

        enhanceErrorMessages() {
            // Watch for form submissions
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    const errors = form.querySelectorAll('.error, .invalid');
                    if (errors.length > 0) {
                        e.preventDefault();
                        
                        // Announce errors to screen reader
                        this.announceToScreenReader(
                            `Form submission failed. ${errors.length} error${errors.length > 1 ? 's' : ''} found.`,
                            'assertive'
                        );
                        
                        // Focus first error
                        const firstError = errors[0];
                        if (firstError.matches('input, select, textarea')) {
                            firstError.focus();
                        } else {
                            const input = firstError.querySelector('input, select, textarea');
                            if (input) input.focus();
                        }
                    }
                });
                
                // Add aria-describedby for error messages
                form.addEventListener('blur', (e) => {
                    if (e.target.matches('input, select, textarea')) {
                        const error = e.target.parentElement.querySelector('.error-message');
                        if (error) {
                            if (!error.id) {
                                error.id = `error-${Date.now()}`;
                            }
                            e.target.setAttribute('aria-describedby', error.id);
                            e.target.setAttribute('aria-invalid', 'true');
                        } else {
                            e.target.removeAttribute('aria-describedby');
                            e.target.removeAttribute('aria-invalid');
                        }
                    }
                }, true);
            });
        }

        addLandmarkRoles() {
            // Add ARIA landmark roles to major sections
            const header = document.querySelector('header');
            if (header && !header.hasAttribute('role')) {
                header.setAttribute('role', 'banner');
            }
            
            const nav = document.querySelector('nav.main-nav, header nav');
            if (nav && !nav.hasAttribute('role')) {
                nav.setAttribute('role', 'navigation');
                nav.setAttribute('aria-label', 'Main navigation');
            }
            
            const main = document.querySelector('main');
            if (main && !main.hasAttribute('role')) {
                main.setAttribute('role', 'main');
            }
            
            const footer = document.querySelector('footer');
            if (footer && !footer.hasAttribute('role')) {
                footer.setAttribute('role', 'contentinfo');
            }
            
            const search = document.querySelector('.search-container, .search-section');
            if (search && !search.hasAttribute('role')) {
                search.setAttribute('role', 'search');
                search.setAttribute('aria-label', 'Site search');
            }
            
            // Add complementary role to sidebars
            document.querySelectorAll('aside, .sidebar').forEach(sidebar => {
                if (!sidebar.hasAttribute('role')) {
                    sidebar.setAttribute('role', 'complementary');
                }
            });
            
            // Add region roles to major sections
            document.querySelectorAll('.categories, .hero, .features').forEach(section => {
                if (!section.hasAttribute('role')) {
                    section.setAttribute('role', 'region');
                    
                    // Try to find a heading to use as label
                    const heading = section.querySelector('h1, h2, h3');
                    if (heading) {
                        if (!heading.id) {
                            heading.id = `heading-${Date.now()}`;
                        }
                        section.setAttribute('aria-labelledby', heading.id);
                    }
                }
            });
        }

        setupModalFocusTrap() {
            // Watch for modals
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.matches('.modal, [role="dialog"]')) {
                            this.trapFocus(node);
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        trapFocus(element) {
            const focusableElements = element.querySelectorAll(this.focusableElements);
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            // Store previous focus
            const previousFocus = document.activeElement;
            
            // Focus first element
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Trap focus
            const trapHandler = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            };
            
            element.addEventListener('keydown', trapHandler);
            
            // Add close handler
            const closeButton = element.querySelector('.close, [aria-label="Close"]');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    element.remove();
                    if (previousFocus) {
                        previousFocus.focus();
                    }
                });
            }
            
            // Mark as focus trap active
            element.classList.add('focus-trap-active');
            
            // Clean up on removal
            const removalObserver = new MutationObserver(() => {
                if (!document.body.contains(element)) {
                    element.removeEventListener('keydown', trapHandler);
                    element.classList.remove('focus-trap-active');
                    removalObserver.disconnect();
                    if (previousFocus) {
                        previousFocus.focus();
                    }
                }
            });
            
            removalObserver.observe(element.parentNode, {
                childList: true
            });
        }

        setupTabTrap() {
            // Prevent tabbing outside of modal when active
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const modal = document.querySelector('.modal:not([hidden]), [role="dialog"]:not([hidden])');
                    if (modal) {
                        const focusables = modal.querySelectorAll(this.focusableElements);
                        if (focusables.length === 0) return;
                        
                        const firstFocusable = focusables[0];
                        const lastFocusable = focusables[focusables.length - 1];
                        
                        if (e.shiftKey && document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
        }

        addKeyboardShortcuts() {
            // Create keyboard shortcuts help modal
            const shortcutsModal = document.createElement('div');
            shortcutsModal.id = 'keyboard-shortcuts-modal';
            shortcutsModal.className = 'modal';
            shortcutsModal.setAttribute('role', 'dialog');
            shortcutsModal.setAttribute('aria-label', 'Keyboard shortcuts');
            shortcutsModal.setAttribute('hidden', 'true');
            
            shortcutsModal.innerHTML = `
                <div class="modal-content" style="max-width: 600px; margin: 50px auto; background: var(--bg-primary); padding: 30px; border-radius: 8px;">
                    <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
                    <button class="close" aria-label="Close shortcuts dialog">&times;</button>
                    <div class="shortcuts-list">
                        <h3>Navigation</h3>
                        <dl>
                            <dt><kbd>Alt</kbd> + <kbd>S</kbd></dt>
                            <dd>Jump to search</dd>
                            <dt><kbd>Alt</kbd> + <kbd>M</kbd></dt>
                            <dd>Jump to main content</dd>
                            <dt><kbd>Alt</kbd> + <kbd>N</kbd></dt>
                            <dd>Jump to navigation</dd>
                            <dt><kbd>Tab</kbd></dt>
                            <dd>Navigate to next element</dd>
                            <dt><kbd>Shift</kbd> + <kbd>Tab</kbd></dt>
                            <dd>Navigate to previous element</dd>
                        </dl>
                        
                        <h3>Actions</h3>
                        <dl>
                            <dt><kbd>Enter</kbd></dt>
                            <dd>Activate button or link</dd>
                            <dt><kbd>Space</kbd></dt>
                            <dd>Check checkbox or activate button</dd>
                            <dt><kbd>Escape</kbd></dt>
                            <dd>Close modal or menu</dd>
                            <dt><kbd>?</kbd></dt>
                            <dd>Show this help</dd>
                        </dl>
                        
                        <h3>Lists and Menus</h3>
                        <dl>
                            <dt><kbd>↑</kbd> <kbd>↓</kbd></dt>
                            <dd>Navigate through menu items</dd>
                            <dt><kbd>←</kbd> <kbd>→</kbd></dt>
                            <dd>Navigate through horizontal items</dd>
                            <dt><kbd>Home</kbd></dt>
                            <dd>Jump to first item</dd>
                            <dt><kbd>End</kbd></dt>
                            <dd>Jump to last item</dd>
                        </dl>
                    </div>
                    <p style="margin-top: 20px; font-size: 0.9em; color: var(--text-secondary);">
                        Press <kbd>Escape</kbd> to close this dialog
                    </p>
                </div>
            `;
            
            document.body.appendChild(shortcutsModal);
            
            // Style keyboard keys
            const kbdStyle = document.createElement('style');
            kbdStyle.textContent = `
                kbd {
                    display: inline-block;
                    padding: 3px 6px;
                    font-size: 0.85em;
                    line-height: 1;
                    color: var(--text-primary);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-medium);
                    border-radius: 3px;
                    box-shadow: inset 0 -1px 0 var(--border-dark);
                    font-family: monospace;
                }
                
                .shortcuts-list {
                    max-height: 400px;
                    overflow-y: auto;
                    margin: 20px 0;
                }
                
                .shortcuts-list h3 {
                    margin-top: 20px;
                    color: var(--primary);
                }
                
                .shortcuts-list dl {
                    display: grid;
                    grid-template-columns: 150px 1fr;
                    gap: 10px;
                    margin: 10px 0;
                }
                
                .shortcuts-list dt {
                    text-align: right;
                    font-weight: 500;
                }
                
                .shortcuts-list dd {
                    margin: 0;
                    color: var(--text-secondary);
                }
            `;
            document.head.appendChild(kbdStyle);
        }

        showKeyboardShortcuts() {
            const modal = document.querySelector('#keyboard-shortcuts-modal');
            if (modal) {
                modal.removeAttribute('hidden');
                this.trapFocus(modal);
                this.announceToScreenReader('Keyboard shortcuts dialog opened');
            }
        }

        closeActiveModal() {
            const modal = document.querySelector('.modal:not([hidden]), [role="dialog"]:not([hidden])');
            if (modal) {
                modal.setAttribute('hidden', 'true');
                this.announceToScreenReader('Dialog closed');
            }
        }

        closeMobileMenu() {
            const mobileMenu = document.querySelector('.mobile-menu-toggle.active');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                const nav = document.querySelector('.main-nav');
                if (nav) {
                    nav.classList.remove('active');
                }
                this.announceToScreenReader('Mobile menu closed');
            }
        }

        isInputFocused() {
            const activeElement = document.activeElement;
            return activeElement && activeElement.matches('input, textarea, select, [contenteditable]');
        }

        setupScreenReaderAnnouncements() {
            // Announce page changes for SPAs
            const announcePageChange = () => {
                const title = document.title;
                this.announceToScreenReader(`Page loaded: ${title}`);
            };
            
            // Watch for title changes
            const titleObserver = new MutationObserver(() => {
                announcePageChange();
            });
            
            titleObserver.observe(document.querySelector('title'), {
                childList: true
            });
            
            // Announce copy actions
            document.addEventListener('click', (e) => {
                if (e.target.matches('.copy-button, .copy-btn')) {
                    setTimeout(() => {
                        if (e.target.textContent.includes('Copied')) {
                            this.announceToScreenReader('Prompt copied to clipboard');
                        }
                    }, 100);
                }
            });
            
            // Announce rating changes
            document.addEventListener('click', (e) => {
                if (e.target.matches('.star-rating .star')) {
                    const rating = e.target.dataset.rating;
                    this.announceToScreenReader(`Rated ${rating} stars`);
                }
            });
            
            // Announce search results
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', () => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        const results = document.querySelectorAll('.search-result');
                        if (results.length > 0) {
                            this.announceToScreenReader(`${results.length} search results found`);
                        } else if (searchInput.value.length > 0) {
                            this.announceToScreenReader('No search results found');
                        }
                    }, 500);
                });
            }
        }

        // Public API
        focusElement(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.focus();
                return true;
            }
            return false;
        }

        announce(message, priority = 'polite') {
            this.announceToScreenReader(message, priority);
        }

        enableFocusTrap(element) {
            this.trapFocus(element);
        }

        disableFocusTrap(element) {
            element.classList.remove('focus-trap-active');
        }
    }

    // Initialize accessibility manager
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.accessibilityManager = new AccessibilityManager();
        });
    } else {
        window.accessibilityManager = new AccessibilityManager();
    }

    // Export for use in other scripts
    window.FPH = window.FPH || {};
    window.FPH.accessibility = {
        announce: (message, priority) => {
            if (window.accessibilityManager) {
                window.accessibilityManager.announce(message, priority);
            }
        },
        focus: (selector) => {
            if (window.accessibilityManager) {
                return window.accessibilityManager.focusElement(selector);
            }
            return false;
        }
    };
})();