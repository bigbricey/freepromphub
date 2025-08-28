// Simple Privacy-Focused Analytics System
// No cookies, no personal data, no third-party services

class SimpleAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.apiEndpoint = '/api/analytics'; // You'll need to set up this endpoint
        
        // Initialize on page load
        this.trackPageView();
        this.setupEventListeners();
    }
    
    // Generate anonymous session ID (not stored, just for grouping events in same session)
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Track basic page view
    trackPageView() {
        const pageData = {
            type: 'pageview',
            path: window.location.pathname,
            referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.sendEvent(pageData);
    }
    
    // Track prompt copy events
    trackPromptCopy(promptName, category) {
        const eventData = {
            type: 'prompt_copy',
            promptName: promptName,
            category: category,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.sendEvent(eventData);
    }
    
    // Track category views
    trackCategoryView(categoryName) {
        const eventData = {
            type: 'category_view',
            category: categoryName,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.sendEvent(eventData);
    }
    
    // Track search queries (anonymized)
    trackSearch(hasResults) {
        const eventData = {
            type: 'search',
            hasResults: hasResults,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.sendEvent(eventData);
    }
    
    // Track affiliate link clicks
    trackAffiliateClick(productType, location) {
        const eventData = {
            type: 'affiliate_click',
            productType: productType, // Just the type, not specific product
            location: location, // Where on page (header, sidebar, inline)
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.sendEvent(eventData);
    }
    
    // Track time on page when leaving
    trackTimeOnPage() {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        
        const eventData = {
            type: 'time_on_page',
            duration: timeSpent,
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        // Use sendBeacon for reliability when page unloads
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
            navigator.sendBeacon(this.apiEndpoint, blob);
        } else {
            this.sendEvent(eventData);
        }
    }
    
    // Send event to server (or store locally)
    async sendEvent(eventData) {
        // For now, store in localStorage as a fallback
        // In production, you'd send to your server
        try {
            // Try to send to server
            if (this.apiEndpoint && window.location.hostname !== 'localhost') {
                await fetch(this.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventData)
                }).catch(() => {
                    // Silently fail, fallback to local storage
                    this.storeLocally(eventData);
                });
            } else {
                // Development mode - store locally
                this.storeLocally(eventData);
            }
        } catch (error) {
            // Fallback to local storage
            this.storeLocally(eventData);
        }
    }
    
    // Store analytics locally (for development or as fallback)
    storeLocally(eventData) {
        const storageKey = 'simple_analytics_' + new Date().toISOString().split('T')[0];
        const existing = localStorage.getItem(storageKey);
        const events = existing ? JSON.parse(existing) : [];
        events.push(eventData);
        
        // Keep only last 1000 events to prevent storage overflow
        if (events.length > 1000) {
            events.shift();
        }
        
        localStorage.setItem(storageKey, JSON.stringify(events));
        
        // Also log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Analytics Event:', eventData);
        }
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Track time on page when leaving
        window.addEventListener('beforeunload', () => this.trackTimeOnPage());
        
        // Track category clicks
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryName = card.querySelector('h3')?.textContent;
                if (categoryName) {
                    this.trackCategoryView(categoryName);
                }
            });
        });
        
        // Track affiliate clicks (anonymized)
        document.querySelectorAll('a[href*="clickbank"], a[href*="affiliate"]').forEach(link => {
            link.addEventListener('click', () => {
                const location = link.closest('.affiliate-section') ? 'affiliate-section' : 
                                link.closest('.hero') ? 'hero' : 'inline';
                const productType = link.closest('.affiliate-section') ? 'recommended' : 'contextual';
                this.trackAffiliateClick(productType, location);
            });
        });
    }
    
    // Get stored analytics for dashboard
    static getStoredAnalytics() {
        const analytics = {};
        const keys = Object.keys(localStorage).filter(k => k.startsWith('simple_analytics_'));
        
        keys.forEach(key => {
            const date = key.replace('simple_analytics_', '');
            analytics[date] = JSON.parse(localStorage.getItem(key) || '[]');
        });
        
        return analytics;
    }
    
    // Generate simple statistics
    static generateStats() {
        const analytics = SimpleAnalytics.getStoredAnalytics();
        const stats = {
            totalPageViews: 0,
            totalPromptCopies: 0,
            totalAffiliateClicks: 0,
            topPages: {},
            topPrompts: {},
            dailyStats: {}
        };
        
        Object.entries(analytics).forEach(([date, events]) => {
            stats.dailyStats[date] = {
                pageViews: 0,
                promptCopies: 0,
                affiliateClicks: 0
            };
            
            events.forEach(event => {
                if (event.type === 'pageview') {
                    stats.totalPageViews++;
                    stats.dailyStats[date].pageViews++;
                    stats.topPages[event.path] = (stats.topPages[event.path] || 0) + 1;
                } else if (event.type === 'prompt_copy') {
                    stats.totalPromptCopies++;
                    stats.dailyStats[date].promptCopies++;
                    stats.topPrompts[event.promptName] = (stats.topPrompts[event.promptName] || 0) + 1;
                } else if (event.type === 'affiliate_click') {
                    stats.totalAffiliateClicks++;
                    stats.dailyStats[date].affiliateClicks++;
                }
            });
        });
        
        return stats;
    }
}

// Initialize analytics on page load
let analytics;
document.addEventListener('DOMContentLoaded', () => {
    analytics = new SimpleAnalytics();
    
    // Make it available globally for other scripts
    window.simpleAnalytics = analytics;
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleAnalytics;
}