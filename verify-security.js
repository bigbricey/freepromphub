#!/usr/bin/env node

/**
 * Security Headers Verification Script
 * Checks that all security configurations are properly implemented
 */

const fs = require('fs');
const path = require('path');

// Security check results
const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Helper function to log results
function log(message, type = 'info') {
    const symbols = {
        pass: '✅',
        fail: '❌',
        warn: '⚠️',
        info: 'ℹ️'
    };
    console.log(`${symbols[type] || ''} ${message}`);
}

// Check 1: Verify .htaccess exists and contains security headers
function checkHtaccess() {
    const htaccessPath = path.join(__dirname, '.htaccess');
    
    if (fs.existsSync(htaccessPath)) {
        const content = fs.readFileSync(htaccessPath, 'utf8');
        
        const requiredHeaders = [
            'Strict-Transport-Security',
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
            'X-XSS-Protection',
            'Referrer-Policy',
            'Permissions-Policy'
        ];
        
        let allFound = true;
        requiredHeaders.forEach(header => {
            if (content.includes(header)) {
                results.passed.push(`.htaccess contains ${header}`);
            } else {
                results.failed.push(`.htaccess missing ${header}`);
                allFound = false;
            }
        });
        
        if (allFound) {
            log('.htaccess: All security headers configured', 'pass');
        } else {
            log('.htaccess: Some security headers missing', 'fail');
        }
    } else {
        results.warnings.push('.htaccess file not found (OK if not using Apache)');
        log('.htaccess not found (OK if not using Apache)', 'warn');
    }
}

// Check 2: Verify Vercel configuration
function checkVercel() {
    const vercelPath = path.join(__dirname, 'vercel.json');
    
    if (fs.existsSync(vercelPath)) {
        const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
        
        if (config.headers && config.headers.length > 0) {
            const mainHeaders = config.headers.find(h => h.source === '/(.*)');
            
            if (mainHeaders && mainHeaders.headers) {
                const headerKeys = mainHeaders.headers.map(h => h.key);
                const required = [
                    'Strict-Transport-Security',
                    'Content-Security-Policy',
                    'X-Frame-Options',
                    'X-Content-Type-Options'
                ];
                
                const missing = required.filter(h => !headerKeys.includes(h));
                
                if (missing.length === 0) {
                    results.passed.push('vercel.json has all required headers');
                    log('vercel.json: Security headers configured', 'pass');
                } else {
                    results.failed.push(`vercel.json missing: ${missing.join(', ')}`);
                    log('vercel.json: Missing some headers', 'fail');
                }
            }
        }
    } else {
        results.warnings.push('vercel.json not found (OK if not using Vercel)');
        log('vercel.json not found (OK if not using Vercel)', 'warn');
    }
}

// Check 3: Verify Netlify configuration
function checkNetlify() {
    const netlifyPath = path.join(__dirname, 'netlify.toml');
    
    if (fs.existsSync(netlifyPath)) {
        const content = fs.readFileSync(netlifyPath, 'utf8');
        
        if (content.includes('[[headers]]') && content.includes('Strict-Transport-Security')) {
            results.passed.push('netlify.toml has security headers');
            log('netlify.toml: Security headers configured', 'pass');
        } else {
            results.failed.push('netlify.toml missing security headers');
            log('netlify.toml: Missing security headers', 'fail');
        }
    } else {
        results.warnings.push('netlify.toml not found (OK if not using Netlify)');
        log('netlify.toml not found (OK if not using Netlify)', 'warn');
    }
}

// Check 4: Verify meta tag security headers in HTML files
function checkHTMLHeaders() {
    const htmlFiles = [];
    
    function findHTML(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !['node_modules', '.git', 'js', 'css', 'images'].includes(file)) {
                findHTML(filePath);
            } else if (file.endsWith('.html')) {
                htmlFiles.push(filePath);
            }
        }
    }
    
    findHTML(__dirname);
    
    let allHaveHeaders = true;
    let checkedCount = 0;
    const samplesToCheck = Math.min(10, htmlFiles.length);
    
    // Check a sample of HTML files
    for (let i = 0; i < samplesToCheck; i++) {
        const content = fs.readFileSync(htmlFiles[i], 'utf8');
        
        if (content.includes('Content-Security-Policy') && 
            content.includes('X-Frame-Options')) {
            checkedCount++;
        } else {
            allHaveHeaders = false;
            results.failed.push(`${path.basename(htmlFiles[i])} missing security meta tags`);
        }
    }
    
    if (allHaveHeaders && checkedCount > 0) {
        results.passed.push(`HTML files have security meta tags (checked ${samplesToCheck}/${htmlFiles.length})`);
        log(`HTML files: Security meta tags found (checked ${samplesToCheck} files)`, 'pass');
    } else if (checkedCount > 0) {
        log(`HTML files: Some missing security meta tags`, 'warn');
    }
}

// Check 5: Verify CSP is not too restrictive
function checkCSPPolicy() {
    const htaccessPath = path.join(__dirname, '.htaccess');
    
    if (fs.existsSync(htaccessPath)) {
        const content = fs.readFileSync(htaccessPath, 'utf8');
        const cspMatch = content.match(/Content-Security-Policy[^\n]+/);
        
        if (cspMatch) {
            const csp = cspMatch[0];
            
            // Check for unsafe-inline (needed for inline scripts/styles)
            if (csp.includes("'unsafe-inline'")) {
                results.warnings.push("CSP allows 'unsafe-inline' (may be needed for functionality)");
                log("CSP includes 'unsafe-inline' for compatibility", 'warn');
            }
            
            // Check for unsafe-eval (sometimes needed for frameworks)
            if (csp.includes("'unsafe-eval'")) {
                results.warnings.push("CSP allows 'unsafe-eval' (may be needed for some JS frameworks)");
                log("CSP includes 'unsafe-eval' for compatibility", 'warn');
            }
            
            // Ensure it's not blocking everything
            if (!csp.includes("'self'")) {
                results.failed.push("CSP doesn't include 'self' directive");
                log("CSP missing 'self' directive", 'fail');
            }
        }
    }
}

// Check 6: Verify HTTPS redirect is configured
function checkHTTPSRedirect() {
    const htaccessPath = path.join(__dirname, '.htaccess');
    
    if (fs.existsSync(htaccessPath)) {
        const content = fs.readFileSync(htaccessPath, 'utf8');
        
        if (content.includes('RewriteCond %{HTTPS} off') || 
            content.includes('Force HTTPS')) {
            results.passed.push('HTTPS redirect configured in .htaccess');
            log('HTTPS redirect configured', 'pass');
        } else {
            results.warnings.push('HTTPS redirect not found in .htaccess');
            log('HTTPS redirect not found', 'warn');
        }
    }
    
    // Check Netlify config
    const netlifyPath = path.join(__dirname, 'netlify.toml');
    if (fs.existsSync(netlifyPath)) {
        const content = fs.readFileSync(netlifyPath, 'utf8');
        
        if (content.includes('from = "http://') && content.includes('to = "https://')) {
            results.passed.push('HTTPS redirect configured in netlify.toml');
        }
    }
}

// Check 7: Verify sensitive files are protected
function checkSensitiveFiles() {
    const sensitivePatterns = [
        '.env',
        'config.json',
        'package.json',
        '.git'
    ];
    
    const htaccessPath = path.join(__dirname, '.htaccess');
    
    if (fs.existsSync(htaccessPath)) {
        const content = fs.readFileSync(htaccessPath, 'utf8');
        let protectedCount = 0;
        
        sensitivePatterns.forEach(pattern => {
            if (content.includes(pattern) && content.includes('Deny from all')) {
                protectedCount++;
            }
        });
        
        if (protectedCount > 0) {
            results.passed.push(`${protectedCount} sensitive file patterns protected`);
            log(`Sensitive files protected (${protectedCount} patterns)`, 'pass');
        } else {
            results.warnings.push('No sensitive file protection rules found');
            log('No sensitive file protection rules found', 'warn');
        }
    }
}

// Check 8: Verify security.txt file exists
function checkSecurityTxt() {
    const securityTxtPath = path.join(__dirname, '.well-known', 'security.txt');
    const rootSecurityTxt = path.join(__dirname, 'security.txt');
    
    if (fs.existsSync(securityTxtPath) || fs.existsSync(rootSecurityTxt)) {
        results.passed.push('security.txt file exists');
        log('security.txt file found', 'pass');
    } else {
        results.warnings.push('security.txt file not found (recommended for security researchers)');
        log('security.txt not found (recommended)', 'warn');
    }
}

// Main execution
console.log('\n🔒 Security Configuration Verification\n');
console.log('=' .repeat(50));

checkHtaccess();
checkVercel();
checkNetlify();
checkHTMLHeaders();
checkCSPPolicy();
checkHTTPSRedirect();
checkSensitiveFiles();
checkSecurityTxt();

// Summary
console.log('\n' + '=' .repeat(50));
console.log('\n📊 Summary:\n');
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);

if (results.failed.length > 0) {
    console.log('\n❌ Failed checks:');
    results.failed.forEach(item => console.log(`   - ${item}`));
}

if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(item => console.log(`   - ${item}`));
}

if (results.failed.length === 0) {
    console.log('\n🎉 All critical security headers are properly configured!');
} else {
    console.log('\n⚠️  Please address the failed checks to ensure proper security.');
}

// Exit with appropriate code
process.exit(results.failed.length > 0 ? 1 : 0);