#!/usr/bin/env python3
"""
Set up comprehensive analytics and tracking for FreePromptHub
Includes Google Analytics 4, ClickBank tracking, conversion goals, and heat mapping
"""

import os
import re
from pathlib import Path

# Analytics configuration
GOOGLE_ANALYTICS_ID = "G-XXXXXXXXXX"  # User needs to provide their GA4 ID
GOOGLE_TAG_MANAGER_ID = "GTM-XXXXXXX"  # Optional GTM container ID

def create_analytics_code():
    """Create the analytics tracking code"""
    return f'''
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GOOGLE_ANALYTICS_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  
  // Configure GA4 with enhanced ecommerce
  gtag('config', '{GOOGLE_ANALYTICS_ID}', {{
    // Enhanced ecommerce settings
    send_page_view: true,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
    
    // Custom parameters
    custom_map: {{
      'custom_parameter_1': 'prompt_category',
      'custom_parameter_2': 'affiliate_product'
    }}
  }});
  
  // Track affiliate clicks
  function trackAffiliateClick(productName, category, revenue) {{
    gtag('event', 'affiliate_click', {{
      'event_category': 'Affiliate',
      'event_label': productName,
      'custom_parameter_1': category,
      'custom_parameter_2': productName,
      'value': revenue
    }});
  }}
  
  // Track prompt copies
  function trackPromptCopy(category) {{
    gtag('event', 'prompt_copy', {{
      'event_category': 'Engagement',
      'event_label': category,
      'custom_parameter_1': category
    }});
  }}
  
  // Track conversion funnel
  function trackConversionStep(step, category) {{
    gtag('event', 'conversion_step', {{
      'event_category': 'Conversion',
      'event_label': step,
      'custom_parameter_1': category,
      'custom_parameter_2': step
    }});
  }}
</script>

<!-- ClickBank Tracking Pixel -->
<script>
  // ClickBank conversion tracking
  function trackClickBankConversion(productId, amount, category) {{
    // Send conversion data to ClickBank
    var img = new Image();
    img.src = 'https://www.clickbank.com/track/conversion?pid=' + productId + 
               '&amount=' + amount + '&category=' + encodeURIComponent(category);
  }}
</script>

<!-- Facebook Pixel (for retargeting) -->
<script>
  !function(f,b,e,v,n,t,s)
  {{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  fbq('init', 'YOUR_PIXEL_ID'); // User needs to add their pixel ID
  fbq('track', 'PageView');
  
  // Track affiliate clicks on Facebook
  function trackFBAffiliate(productName, value) {{
    fbq('track', 'Lead', {{
      content_name: productName,
      value: value,
      currency: 'USD'
    }});
  }}
</script>

<!-- Hotjar Heat Mapping -->
<script>
    (function(h,o,t,j,a,r){{
        h.hj=h.hj||function(){{(h.hj.q=h.hj.q||[]).push(arguments)}};
        h._hjSettings={{hjid:YOUR_HOTJAR_ID,hjsv:6}}; // User needs to add Hotjar ID
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    }})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
'''

def create_conversion_tracking_script():
    """Create JavaScript for advanced conversion tracking"""
    return '''
<script>
// Enhanced conversion tracking for FreePromptHub

class ConversionTracker {
    constructor() {
        this.sessionStart = Date.now();
        this.pageViews = 0;
        this.promptCopies = 0;
        this.affiliateClicks = 0;
        this.category = this.getCurrentCategory();
        
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupScrollTracking();
        this.setupTimeOnPage();
        this.setupAffiliateTracking();
        this.setupPromptTracking();
    }
    
    getCurrentCategory() {
        const path = window.location.pathname;
        const matches = path.match(/\\/prompts\\/([^/]+)\\//);
        return matches ? matches[1] : 'homepage';
    }
    
    trackPageView() {
        this.pageViews++;
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_category': this.category
            });
        }
    }
    
    setupScrollTracking() {
        let scrollPercents = [25, 50, 75, 100];
        let tracked = [];
        
        window.addEventListener('scroll', () => {
            const scrolled = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            scrollPercents.forEach(percent => {
                if (scrolled >= percent && !tracked.includes(percent)) {
                    tracked.push(percent);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll', {
                            'event_category': 'Engagement',
                            'event_label': `${percent}%`,
                            'value': percent
                        });
                    }
                }
            });
        });
    }
    
    setupTimeOnPage() {
        // Track meaningful time milestones
        const milestones = [30, 60, 120, 300]; // seconds
        
        milestones.forEach(seconds => {
            setTimeout(() => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        'event_category': 'Engagement',
                        'event_label': `${seconds}s`,
                        'value': seconds
                    });
                }
            }, seconds * 1000);
        });
    }
    
    setupAffiliateTracking() {
        // Track all affiliate link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="hop.clickbank.net"]');
            if (link) {
                this.affiliateClicks++;
                
                const productName = this.getProductNameFromLink(link);
                const revenue = this.getRevenueFromProduct(productName);
                
                // Track in GA4
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'affiliate_click', {
                        'event_category': 'Affiliate',
                        'event_label': productName,
                        'value': revenue,
                        'currency': 'USD'
                    });
                }
                
                // Track in Facebook
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'InitiateCheckout', {
                        content_name: productName,
                        value: revenue,
                        currency: 'USD'
                    });
                }
                
                // Track conversion funnel step
                this.trackConversionStep('affiliate_click', productName);
            }
        });
    }
    
    setupPromptTracking() {
        // Track prompt copy events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.copy-button, .copy-button-top, #copy-button, #copy-button-top')) {
                this.promptCopies++;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'prompt_copy', {
                        'event_category': 'Engagement',
                        'event_label': this.category,
                        'value': 1
                    });
                }
                
                // This is a key conversion signal
                this.trackConversionStep('prompt_copy', this.category);
            }
        });
    }
    
    getProductNameFromLink(link) {
        // Extract product name from affiliate link or surrounding content
        const productSection = link.closest('.affiliate-recommendation, .affiliate-product');
        if (productSection) {
            const nameElement = productSection.querySelector('h4');
            return nameElement ? nameElement.textContent.trim() : 'Unknown Product';
        }
        return 'Unknown Product';
    }
    
    getRevenueFromProduct(productName) {
        // Map product names to commission amounts
        const revenueMap = {
            'Billionaire Brain Wave': 42.32,
            'Mitolyn': 180.63,
            'His Secret Obsession': 48.85,
            'TedsWoodworking': 61.36,
            'The Genius Wave': 46.91,
            'SleepLean': 187.11,
            'HepatoBurn': 167.00,
            'Neuro Energizer': 51.39
        };
        
        return revenueMap[productName] || 50; // Default value
    }
    
    trackConversionStep(step, detail) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion_step', {
                'event_category': 'Conversion Funnel',
                'event_label': step,
                'custom_parameter_1': this.category,
                'custom_parameter_2': detail,
                'value': this.getStepValue(step)
            });
        }
    }
    
    getStepValue(step) {
        const values = {
            'page_view': 1,
            'scroll_50': 2,
            'time_30s': 3,
            'prompt_copy': 5,
            'affiliate_click': 10
        };
        return values[step] || 1;
    }
    
    // Export session data for analysis
    getSessionData() {
        return {
            category: this.category,
            timeOnSite: Date.now() - this.sessionStart,
            pageViews: this.pageViews,
            promptCopies: this.promptCopies,
            affiliateClicks: this.affiliateClicks
        };
    }
}

// Initialize tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.conversionTracker = new ConversionTracker();
    
    // Global functions for manual tracking
    window.trackCopyEvent = function() {
        if (window.conversionTracker) {
            window.conversionTracker.trackConversionStep('prompt_copy', 
                window.conversionTracker.category);
        }
    };
    
    window.trackAffiliateClick = function(productName, revenue) {
        if (window.conversionTracker) {
            window.conversionTracker.trackConversionStep('affiliate_click', productName);
        }
    };
});

// Track page unload for session analysis
window.addEventListener('beforeunload', function() {
    if (window.conversionTracker && typeof gtag !== 'undefined') {
        const sessionData = window.conversionTracker.getSessionData();
        gtag('event', 'session_end', {
            'event_category': 'Session',
            'event_label': sessionData.category,
            'value': Math.round(sessionData.timeOnSite / 1000) // seconds
        });
    }
});
</script>
'''

def add_analytics_to_page(file_path):
    """Add analytics code to an HTML page"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if analytics already exists
        if 'gtag(' in content and 'ConversionTracker' in content:
            print(f"Skipping {file_path} - analytics already installed")
            return False
        
        # Find insertion points
        head_close = content.find('</head>')
        body_close = content.find('</body>')
        
        if head_close == -1 or body_close == -1:
            print(f"Could not find insertion points in {file_path}")
            return False
        
        # Insert analytics code in head
        analytics_code = create_analytics_code()
        content = content[:head_close] + analytics_code + '\\n' + content[head_close:]
        
        # Insert conversion tracking before closing body
        body_close = content.find('</body>')  # Find again after head insertion
        tracking_script = create_conversion_tracking_script()
        content = content[:body_close] + tracking_script + '\\n' + content[body_close:]
        
        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Added analytics to {file_path}")
        return True
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def create_analytics_dashboard():
    """Create a simple analytics dashboard page"""
    dashboard_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard - FreePromptHub</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/css/dark-mode.css">
    <style>
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .metric-card {
            background: var(--bg-secondary);
            padding: 20px;
            border-radius: var(--radius);
            border: 1px solid var(--border-light);
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary);
        }
        .metric-label {
            color: var(--text-secondary);
            margin-top: 5px;
        }
        .conversion-funnel {
            background: var(--bg-card);
            padding: 20px;
            border-radius: var(--radius);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="container header-content">
            <a class="brand" href="/">🚀 FreePromptHub</a>
            <nav class="main-nav">
                <a href="/">Home</a>
                <a href="/dashboard/">Dashboard</a>
            </nav>
        </div>
    </header>
    
    <main class="dashboard">
        <h1>Analytics Dashboard</h1>
        <p>Real-time tracking of your prompt hub performance</p>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value" id="pageViews">-</div>
                <div class="metric-label">Page Views Today</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="promptCopies">-</div>
                <div class="metric-label">Prompts Copied</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="affiliateClicks">-</div>
                <div class="metric-label">Affiliate Clicks</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="conversionRate">-</div>
                <div class="metric-label">Conversion Rate</div>
            </div>
        </div>
        
        <div class="conversion-funnel">
            <h2>Conversion Funnel</h2>
            <div id="funnelChart">
                <p>Loading analytics data...</p>
            </div>
        </div>
        
        <div class="category-performance">
            <h2>Performance by Category</h2>
            <div id="categoryChart">
                <p>Loading category data...</p>
            </div>
        </div>
    </main>
    
    <script>
        // Simple dashboard functionality
        // In production, this would connect to your analytics API
        document.addEventListener('DOMContentLoaded', function() {
            // Placeholder data - replace with real analytics API calls
            document.getElementById('pageViews').textContent = '1,234';
            document.getElementById('promptCopies').textContent = '456';
            document.getElementById('affiliateClicks').textContent = '23';
            document.getElementById('conversionRate').textContent = '5.1%';
            
            // You would integrate with Google Analytics API here
            // Example: gapi.analytics.ready(function() { ... });
        });
    </script>
</body>
</html>'''
    
    return dashboard_html

def main():
    """Set up analytics on all pages"""
    
    project_root = Path(__file__).parent
    
    print("🚀 Setting up comprehensive analytics tracking...")
    print("=" * 50)
    print("📊 Features being installed:")
    print("   • Google Analytics 4 with enhanced ecommerce")
    print("   • ClickBank conversion tracking")
    print("   • Facebook Pixel for retargeting")
    print("   • Hotjar heat mapping")
    print("   • Custom conversion funnel tracking")
    print("   • Scroll depth and time on page tracking")
    print("=" * 50)
    
    # Find all HTML files
    html_files = list(project_root.rglob('*.html'))
    updated_count = 0
    
    for html_file in html_files:
        # Skip certain files
        if any(skip in str(html_file) for skip in ['site-v2', 'node_modules', '.git']):
            continue
            
        if add_analytics_to_page(html_file):
            updated_count += 1
    
    # Create analytics dashboard
    dashboard_path = project_root / 'analytics-dashboard.html'
    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.write(create_analytics_dashboard())
    print(f"✅ Created analytics dashboard at {dashboard_path}")
    
    print("\\n" + "=" * 50)
    print("✅ Analytics Setup Complete!")
    print(f"📊 Updated {updated_count} pages")
    print("\\n📋 NEXT STEPS:")
    print("1. Get your Google Analytics 4 tracking ID from https://analytics.google.com")
    print("2. Replace 'G-XXXXXXXXXX' in the code with your actual GA4 ID")
    print("3. Optional: Set up Facebook Pixel and Hotjar accounts")
    print("4. Deploy to live site and test tracking")
    print("\\n🎯 TRACKING CAPABILITIES:")
    print("   • Page views and session data")
    print("   • Prompt copy events (key conversion signal)")
    print("   • Affiliate click tracking with revenue attribution")
    print("   • Scroll depth and engagement metrics")
    print("   • Complete conversion funnel analysis")
    print("   • Category performance comparison")
    print("\\n💡 Access your dashboard at: /analytics-dashboard.html")

if __name__ == "__main__":
    main()