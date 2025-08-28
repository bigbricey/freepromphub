const fs = require('fs');
const path = require('path');

// Security headers to add as meta tags
const securityHeaders = `
    <!-- Security Headers via Meta Tags -->
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://api.affiliate-network.com; frame-src 'self' https://www.youtube.com https://player.vimeo.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;">
    
    <!-- X-Frame-Options -->
    <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
    
    <!-- X-Content-Type-Options -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    
    <!-- X-XSS-Protection -->
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    
    <!-- Referrer-Policy -->
    <meta name="referrer" content="strict-origin-when-cross-origin">
    
    <!-- Permissions Policy -->
    <meta http-equiv="Permissions-Policy" content="accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()">
`;

// Function to add security headers to HTML file
function addSecurityHeaders(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if security headers are already added
    if (content.includes('Security Headers via Meta Tags')) {
        console.log(`✓ Already has security headers: ${filePath}`);
        return false;
    }
    
    // Find the best place to insert security headers
    // After charset and viewport, but before other meta tags
    const viewportRegex = /<meta\s+name="viewport"[^>]*>/i;
    const viewportMatch = content.match(viewportRegex);
    
    if (viewportMatch) {
        // Insert after viewport meta tag
        const insertPosition = content.indexOf(viewportMatch[0]) + viewportMatch[0].length;
        content = content.slice(0, insertPosition) + securityHeaders + content.slice(insertPosition);
    } else {
        // Insert after charset if no viewport found
        const charsetRegex = /<meta\s+charset[^>]*>/i;
        const charsetMatch = content.match(charsetRegex);
        
        if (charsetMatch) {
            const insertPosition = content.indexOf(charsetMatch[0]) + charsetMatch[0].length;
            content = content.slice(0, insertPosition) + securityHeaders + content.slice(insertPosition);
        } else {
            // Insert right after <head> as fallback
            content = content.replace('<head>', '<head>' + securityHeaders);
        }
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added security headers to: ${filePath}`);
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
        } else if (file.endsWith('.html')) {
            if (addSecurityHeaders(filePath)) {
                updatedCount++;
            }
        }
    }
    
    return updatedCount;
}

// Run the script
console.log('Adding security headers to all HTML pages...\n');
const rootDir = 'C:\\Users\\bigbr\\OneDrive\\Desktop\\claude_workspace\\projects\\FreePromptHub';
const updatedFiles = processDirectory(rootDir);
console.log(`\n✨ Complete! Updated ${updatedFiles} files with security headers.`);