/**
 * Modern Core JavaScript for FreePromptHub - ES2024 Features
 * Implements latest JavaScript patterns and performance optimizations
 */

// Modern class with private fields and static blocks
class FreePromptHub {
  // Private fields
  #theme = 'light';
  #analytics = null;
  #preferences = new Map();
  #observers = new Set();
  
  // Static initialization block
  static {
    console.log('FreePromptHub initialized');
  }
  
  constructor() {
    this.init();
  }
  
  async init() {
    try {
      // Initialize core functionality
      await Promise.allSettled([
        this.#initializeTheme(),
        this.#initializeServiceWorker(),
        this.#initializeAnalytics(),
        this.#initializePerformanceObserver(),
        this.#initializeIntersectionObserver(),
        this.#initializeErrorHandling()
      ]);
      
      console.log('FreePromptHub core initialized successfully');
    } catch (error) {
      this.#handleError('Initialization failed', error);
    }
  }
  
  // Theme management with modern CSS
  async #initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.#theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.setTheme(this.#theme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }
  
  setTheme(theme) {
    this.#theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme-color meta tag
    const themeColor = theme === 'dark' ? '#1a1d23' : '#0066CC';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    
    this.#notifyObservers('themeChanged', { theme });
  }
  
  toggleTheme() {
    const newTheme = this.#theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  // Service Worker registration with modern error handling
  async #initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.#showUpdateNotification();
            }
          });
        });
        
        console.log('Service Worker registered successfully');
      } catch (error) {
        this.#handleError('Service Worker registration failed', error);
      }
    }
  }
  
  #showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span>🚀 New version available!</span>
        <button onclick="window.location.reload()" class="btn btn-primary">Update Now</button>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => notification.remove(), 10000);
  }
  
  // Modern Analytics with privacy compliance
  async #initializeAnalytics() {
    const consent = localStorage.getItem('analytics-consent');
    if (consent === 'accepted') {
      this.#analytics = new ModernAnalytics();
      await this.#analytics.init();
    }
  }
  
  // Performance Observer for Core Web Vitals
  #initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      this.#observePerformanceMetric('largest-contentful-paint', (entries) => {
        const lcp = entries[entries.length - 1];
        this.#trackPerformance('LCP', lcp.startTime);
      });
      
      // First Input Delay (FID)
      this.#observePerformanceMetric('first-input', (entries) => {
        for (const entry of entries) {
          const fid = entry.processingStart - entry.startTime;
          this.#trackPerformance('FID', fid);
        }
      });
      
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      this.#observePerformanceMetric('layout-shift', (entries) => {
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.#trackPerformance('CLS', clsValue);
      });
    }
  }
  
  #observePerformanceMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => callback(list.getEntries()));
      observer.observe({ type, buffered: true });
      this.#observers.add(observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported`);
    }
  }
  
  #trackPerformance(metric, value) {
    // Send to analytics if available
    this.#analytics?.trackEvent('performance', {
      metric,
      value: Math.round(value),
      url: window.location.pathname
    });
    
    console.log(`${metric}: ${Math.round(value)}ms`);
  }
  
  // Intersection Observer for lazy loading and view tracking
  #initializeIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Lazy load images
          if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
            observer.unobserve(element);
          }
          
          // Track element views
          if (element.dataset.track) {
            this.#analytics?.trackEvent('view', {
              element: element.dataset.track,
              url: window.location.pathname
            });
          }
        }
      }
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });
    
    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    
    // Observe trackable elements
    document.querySelectorAll('[data-track]').forEach(el => observer.observe(el));
    
    this.#observers.add(observer);
  }
  
  // Modern error handling with reporting
  #initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.#handleError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.#handleError('Unhandled Promise Rejection', event.reason);
    });
  }
  
  #handleError(type, error) {
    console.error(type, error);
    
    // Track error in analytics (without sensitive data)
    this.#analytics?.trackEvent('error', {
      type,
      message: typeof error === 'string' ? error : error?.message || 'Unknown error',
      url: window.location.pathname,
      userAgent: navigator.userAgent.slice(0, 100) // Truncate for privacy
    });
    
    // Report to external service if configured
    if (window.errorReporter) {
      window.errorReporter.report(type, error);
    }
  }
  
  // Observer pattern for component communication
  addObserver(callback) {
    this.#observers.add(callback);
  }
  
  removeObserver(callback) {
    this.#observers.delete(callback);
  }
  
  #notifyObservers(event, data) {
    for (const observer of this.#observers) {
      if (typeof observer === 'function') {
        try {
          observer(event, data);
        } catch (error) {
          this.#handleError('Observer error', error);
        }
      }
    }
  }
  
  // Modern fetch with retry logic
  async fetch(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 5000);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      // Retry logic for network errors
      if (options.retry > 0 && error.name !== 'AbortError') {
        await this.#delay(1000);
        return this.fetch(url, { ...options, retry: options.retry - 1 });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  #delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Cleanup method
  destroy() {
    // Clean up observers
    for (const observer of this.#observers) {
      if (observer.disconnect) {
        observer.disconnect();
      }
    }
    this.#observers.clear();
  }
}

// Modern Analytics class with privacy focus
class ModernAnalytics {
  #config = {
    batchSize: 10,
    flushInterval: 5000,
    endpoint: '/api/analytics'
  };
  
  #queue = [];
  #intervalId = null;
  
  async init() {
    this.#intervalId = setInterval(() => this.#flush(), this.#config.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.#flush(true));
  }
  
  trackEvent(type, data = {}) {
    const event = {
      type,
      data,
      timestamp: Date.now(),
      url: window.location.pathname,
      referrer: document.referrer || null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
    
    this.#queue.push(event);
    
    if (this.#queue.length >= this.#config.batchSize) {
      this.#flush();
    }
  }
  
  async #flush(force = false) {
    if (this.#queue.length === 0) return;
    
    const events = this.#queue.splice(0, this.#config.batchSize);
    
    try {
      if (force && 'sendBeacon' in navigator) {
        // Use sendBeacon for reliable delivery on page unload
        navigator.sendBeacon(
          this.#config.endpoint,
          JSON.stringify({ events })
        );
      } else {
        await fetch(this.#config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events })
        });
      }
    } catch (error) {
      console.warn('Analytics flush failed:', error);
      // Put events back in queue for retry
      this.#queue.unshift(...events);
    }
  }
  
  destroy() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
    }
    this.#flush(true);
  }
}

// Module exports using ES2024 features
export { FreePromptHub, ModernAnalytics };

// Initialize global instance
if (typeof window !== 'undefined') {
  window.freePromptHub = new FreePromptHub();
  
  // Add global theme toggle
  window.toggleTheme = () => window.freePromptHub.toggleTheme();
}