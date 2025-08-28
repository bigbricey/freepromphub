const fs = require('fs');
const path = require('path');

// Function to add cookie consent to HTML file
function addCookieConsent(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if cookie consent is already added
    if (content.includes('cookie-consent.js')) {
        console.log(`✓ Already has cookie consent: ${filePath}`);
        return false;
    }
    
    // Add cookie consent CSS before closing </head>
    const cookieConsentCSS = `    <!-- Cookie Consent -->
    <style>
        .cookie-consent-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #2c3e50;
            color: white;
            padding: 20px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            animation: slideUp 0.3s ease-out;
        }
        
        .cookie-consent-banner.show {
            display: block;
        }
        
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        .cookie-consent-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .cookie-consent-text {
            flex: 1;
            min-width: 300px;
        }
        
        .cookie-consent-text p {
            margin: 0 0 10px 0;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .cookie-consent-text a {
            color: #3498db;
            text-decoration: underline;
        }
        
        .cookie-consent-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .cookie-consent-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .cookie-consent-btn.accept-all {
            background: #27ae60;
            color: white;
        }
        
        .cookie-consent-btn.accept-all:hover {
            background: #2ecc71;
        }
        
        .cookie-consent-btn.necessary-only {
            background: transparent;
            color: white;
            border: 1px solid white;
        }
        
        .cookie-consent-btn.necessary-only:hover {
            background: white;
            color: #2c3e50;
        }
        
        .cookie-consent-btn.manage {
            background: #95a5a6;
            color: white;
        }
        
        .cookie-consent-btn.manage:hover {
            background: #7f8c8d;
        }
    </style>
</head>`;
    
    content = content.replace('</head>', cookieConsentCSS);
    
    // Add cookie consent HTML and script before closing </body>
    const cookieConsentHTML = `    <!-- Cookie Consent Banner -->
    <div id="cookieConsentBanner" class="cookie-consent-banner">
        <div class="cookie-consent-content">
            <div class="cookie-consent-text">
                <p>
                    <strong>🍪 We value your privacy</strong><br>
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies. 
                    <a href="/privacy-policy.html">Privacy Policy</a> | 
                    <a href="/privacy-center.html">Privacy Center</a>
                </p>
            </div>
            <div class="cookie-consent-actions">
                <button class="cookie-consent-btn necessary-only" onclick="cookieConsent.acceptNecessaryOnly()">
                    Necessary Only
                </button>
                <button class="cookie-consent-btn manage" onclick="window.location.href='/privacy-center.html'">
                    Manage Preferences
                </button>
                <button class="cookie-consent-btn accept-all" onclick="cookieConsent.acceptAll()">
                    Accept All
                </button>
            </div>
        </div>
    </div>

    <!-- Cookie Consent Script -->
    <script src="/js/cookie-consent.js"></script>
    <script>
        // Initialize cookie consent
        const cookieConsent = new CookieConsent();
        
        // Check if banner should be shown
        window.addEventListener('DOMContentLoaded', function() {
            if (cookieConsent.shouldShowBanner()) {
                document.getElementById('cookieConsentBanner').classList.add('show');
            }
            
            // Apply consent preferences
            cookieConsent.applyConsent();
        });
    </script>
</body>`;
    
    content = content.replace('</body>', cookieConsentHTML);
    
    // Write the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added cookie consent to: ${filePath}`);
    return true;
}

// Process all HTML files
function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let updatedCount = 0;
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip certain directories
            if (!['js', 'css', 'images', 'node_modules', '.git'].includes(file)) {
                updatedCount += processDirectory(filePath);
            }
        } else if (file.endsWith('.html') && file !== 'privacy-center.html') {
            if (addCookieConsent(filePath)) {
                updatedCount++;
            }
        }
    }
    
    return updatedCount;
}

// Run the script
console.log('Adding cookie consent to all HTML pages...\n');
const rootDir = 'C:\\Users\\bigbr\\OneDrive\\Desktop\\claude_workspace\\projects\\FreePromptHub';
const updatedFiles = processDirectory(rootDir);
console.log(`\n✨ Complete! Updated ${updatedFiles} files with cookie consent.`);