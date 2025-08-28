const fs = require('fs');
const path = require('path');

/**
 * Sitemap Generator for FreePromptHub
 * Generates XML sitemap with all pages, priorities, and change frequencies
 */

class SitemapGenerator {
    constructor() {
        this.baseUrl = 'https://www.freeprompthub.com';
        this.pages = [];
        this.excludePatterns = [
            /node_modules/,
            /\.git/,
            /test-/,
            /_backup/,
            /_old/,
            /generate-/,
            /add-/,
            /fix-/,
            /improve-/,
            /verify-/
        ];
        
        this.priorities = {
            'index.html': 1.0,
            'prompts': 0.9,
            'search': 0.8,
            'about': 0.7,
            'contact': 0.7,
            'privacy': 0.6,
            'terms': 0.6,
            'auth': 0.5,
            'dashboard': 0.5,
            'user-rights': 0.6,
            'data-processing': 0.5,
            'affiliate': 0.4,
            '404': 0.1
        };
        
        this.changeFrequencies = {
            'index.html': 'weekly',
            'prompts': 'weekly',
            'search': 'monthly',
            'about': 'monthly',
            'contact': 'monthly',
            'privacy': 'monthly',
            'terms': 'monthly',
            'auth': 'yearly',
            'dashboard': 'weekly',
            'default': 'monthly'
        };
    }
    
    /**
     * Scan directory for HTML files
     */
    scanDirectory(dir, baseDir = dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            // Check if should exclude
            if (this.excludePatterns.some(pattern => pattern.test(filePath))) {
                continue;
            }
            
            if (stat.isDirectory()) {
                // Skip certain directories
                if (!['js', 'css', 'images', 'fonts', 'node_modules', '.git'].includes(file)) {
                    this.scanDirectory(filePath, baseDir);
                }
            } else if (file.endsWith('.html')) {
                // Get relative path from base directory
                let relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
                
                // Skip test and utility files
                if (relativePath.includes('test') || 
                    relativePath.includes('template') ||
                    relativePath.includes('backup') ||
                    relativePath.includes('_old')) {
                    continue;
                }
                
                // Convert index.html to clean URLs
                if (relativePath.endsWith('index.html')) {
                    if (relativePath === 'index.html') {
                        relativePath = '';
                    } else {
                        relativePath = relativePath.replace('/index.html', '');
                    }
                } else {
                    // Remove .html extension for clean URLs
                    relativePath = relativePath.replace('.html', '');
                }
                
                // Get last modified date
                const lastModified = stat.mtime.toISOString().split('T')[0];
                
                // Determine priority
                const priority = this.getPriority(relativePath, file);
                
                // Determine change frequency
                const changeFreq = this.getChangeFrequency(relativePath, file);
                
                this.pages.push({
                    url: relativePath,
                    lastmod: lastModified,
                    changefreq: changeFreq,
                    priority: priority
                });
            }
        }
    }
    
    /**
     * Get priority for a page
     */
    getPriority(relativePath, filename) {
        // Check specific priorities
        for (const [key, priority] of Object.entries(this.priorities)) {
            if (filename === key || relativePath.includes(key)) {
                return priority;
            }
        }
        
        // Category pages get higher priority
        if (relativePath.includes('prompts/') && !relativePath.includes('/')) {
            return 0.8;
        }
        
        // Individual prompt pages
        if (relativePath.includes('prompts/')) {
            return 0.7;
        }
        
        return 0.5;
    }
    
    /**
     * Get change frequency for a page
     */
    getChangeFrequency(relativePath, filename) {
        for (const [key, freq] of Object.entries(this.changeFrequencies)) {
            if (filename === key || relativePath.includes(key)) {
                return freq;
            }
        }
        
        return this.changeFrequencies.default;
    }
    
    /**
     * Generate XML sitemap
     */
    generateXML() {
        // Sort pages by priority (highest first)
        this.pages.sort((a, b) => b.priority - a.priority);
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
        xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
        xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
        
        for (const page of this.pages) {
            const url = page.url ? `${this.baseUrl}/${page.url}` : this.baseUrl;
            
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
            xml += '  </url>\n';
        }
        
        xml += '</urlset>';
        
        return xml;
    }
    
    /**
     * Generate sitemap index if multiple sitemaps
     */
    generateSitemapIndex() {
        const timestamp = new Date().toISOString();
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        xml += '  <sitemap>\n';
        xml += `    <loc>${this.baseUrl}/sitemap.xml</loc>\n`;
        xml += `    <lastmod>${timestamp.split('T')[0]}</lastmod>\n`;
        xml += '  </sitemap>\n';
        xml += '  <sitemap>\n';
        xml += `    <loc>${this.baseUrl}/sitemap-prompts.xml</loc>\n`;
        xml += `    <lastmod>${timestamp.split('T')[0]}</lastmod>\n`;
        xml += '  </sitemap>\n';
        xml += '</sitemapindex>';
        
        return xml;
    }
    
    /**
     * Generate prompts-specific sitemap
     */
    generatePromptsSitemap() {
        const promptPages = this.pages.filter(page => page.url.includes('prompts/'));
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        for (const page of promptPages) {
            const url = `${this.baseUrl}/${page.url}`;
            
            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
            xml += '  </url>\n';
        }
        
        xml += '</urlset>';
        
        return xml;
    }
    
    /**
     * Generate HTML sitemap
     */
    generateHTML() {
        // Organize pages by category
        const categories = {
            'Main Pages': [],
            'Business Prompts': [],
            'Content Creation Prompts': [],
            'Everyday Life Prompts': [],
            'Health & Wellness Prompts': [],
            'Money & Finance Prompts': [],
            'Relationships Prompts': [],
            'Coding & Tech Prompts': [],
            'AI Art Prompts': [],
            'Legal & Privacy': [],
            'User Account': [],
            'Other': []
        };
        
        // Categorize pages
        for (const page of this.pages) {
            const url = page.url || 'Home';
            const title = this.getTitleFromUrl(url);
            
            if (!url || url === '' || url.includes('index')) {
                categories['Main Pages'].push({ url, title: 'Home' });
            } else if (url.includes('prompts/business')) {
                categories['Business Prompts'].push({ url, title });
            } else if (url.includes('prompts/content')) {
                categories['Content Creation Prompts'].push({ url, title });
            } else if (url.includes('prompts/everyday')) {
                categories['Everyday Life Prompts'].push({ url, title });
            } else if (url.includes('prompts/health')) {
                categories['Health & Wellness Prompts'].push({ url, title });
            } else if (url.includes('prompts/money')) {
                categories['Money & Finance Prompts'].push({ url, title });
            } else if (url.includes('prompts/relationships')) {
                categories['Relationships Prompts'].push({ url, title });
            } else if (url.includes('prompts/coding')) {
                categories['Coding & Tech Prompts'].push({ url, title });
            } else if (url.includes('prompts/ai-art')) {
                categories['AI Art Prompts'].push({ url, title });
            } else if (url.includes('privacy') || url.includes('terms') || url.includes('data-processing') || url.includes('user-rights')) {
                categories['Legal & Privacy'].push({ url, title });
            } else if (url.includes('auth') || url.includes('dashboard')) {
                categories['User Account'].push({ url, title });
            } else if (url.includes('about') || url.includes('contact') || url.includes('search')) {
                categories['Main Pages'].push({ url, title });
            } else {
                categories['Other'].push({ url, title });
            }
        }
        
        // Generate HTML
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap - FreePromptHub</title>
    <meta name="description" content="Complete sitemap of all pages and AI prompts available on FreePromptHub">
    <link rel="stylesheet" href="/css/styles.css">
    <style>
        .sitemap-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
        }
        
        .sitemap-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .sitemap-header h1 {
            color: #2c3e50;
            font-size: 36px;
            margin-bottom: 10px;
        }
        
        .sitemap-header p {
            color: #666;
            font-size: 18px;
        }
        
        .sitemap-category {
            background: white;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .sitemap-category h2 {
            color: #34495e;
            font-size: 24px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }
        
        .sitemap-links {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .sitemap-link {
            display: flex;
            align-items: center;
        }
        
        .sitemap-link a {
            color: #3498db;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 4px;
            transition: all 0.3s;
            display: block;
            width: 100%;
        }
        
        .sitemap-link a:hover {
            background: #ecf0f1;
            color: #2980b9;
            transform: translateX(5px);
        }
        
        .sitemap-stats {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .sitemap-stats h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }
        
        .stat-item {
            background: white;
            padding: 15px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: #3498db;
        }
        
        .stat-label {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="sitemap-container">
        <div class="sitemap-header">
            <h1>🗺️ FreePromptHub Sitemap</h1>
            <p>Browse all pages and AI prompts available on our site</p>
        </div>
        
        <div class="sitemap-stats">
            <h3>Site Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${this.pages.length}</div>
                    <div class="stat-label">Total Pages</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">8</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">AI Prompts</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">Weekly</div>
                    <div class="stat-label">Updates</div>
                </div>
            </div>
        </div>\n`;
        
        // Generate category sections
        for (const [category, pages] of Object.entries(categories)) {
            if (pages.length === 0) continue;
            
            html += `
        <div class="sitemap-category">
            <h2>${category} (${pages.length})</h2>
            <div class="sitemap-links">\n`;
            
            // Sort pages alphabetically
            pages.sort((a, b) => a.title.localeCompare(b.title));
            
            for (const page of pages) {
                const url = page.url ? `/${page.url}` : '/';
                html += `                <div class="sitemap-link">
                    <a href="${url}">${page.title}</a>
                </div>\n`;
            }
            
            html += `            </div>
        </div>\n`;
        }
        
        html += `    </div>
</body>
</html>`;
        
        return html;
    }
    
    /**
     * Convert URL to title
     */
    getTitleFromUrl(url) {
        if (!url || url === '') return 'Home';
        
        // Remove path and extension
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        
        // Convert hyphenated names to title case
        return lastPart
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace('.html', '');
    }
    
    /**
     * Generate all sitemaps
     */
    generate() {
        const rootDir = path.join(__dirname);
        
        console.log('Scanning for HTML files...');
        this.scanDirectory(rootDir);
        
        console.log(`Found ${this.pages.length} pages`);
        
        // Generate XML sitemap
        console.log('Generating XML sitemap...');
        const xmlSitemap = this.generateXML();
        fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xmlSitemap);
        console.log('✅ Generated sitemap.xml');
        
        // Generate prompts sitemap
        console.log('Generating prompts sitemap...');
        const promptsSitemap = this.generatePromptsSitemap();
        fs.writeFileSync(path.join(rootDir, 'sitemap-prompts.xml'), promptsSitemap);
        console.log('✅ Generated sitemap-prompts.xml');
        
        // Generate HTML sitemap
        console.log('Generating HTML sitemap...');
        const htmlSitemap = this.generateHTML();
        fs.writeFileSync(path.join(rootDir, 'sitemap.html'), htmlSitemap);
        console.log('✅ Generated sitemap.html');
        
        // Update last generation timestamp
        const timestamp = {
            generated: new Date().toISOString(),
            pages: this.pages.length
        };
        fs.writeFileSync(
            path.join(rootDir, 'sitemap-last-generated.json'),
            JSON.stringify(timestamp, null, 2)
        );
        
        return {
            pages: this.pages.length,
            xml: 'sitemap.xml',
            prompts: 'sitemap-prompts.xml',
            html: 'sitemap.html'
        };
    }
}

// Run generator
const generator = new SitemapGenerator();
const result = generator.generate();

console.log('\n✨ Sitemap generation complete!');
console.log(`Total pages indexed: ${result.pages}`);
console.log(`Files generated:`);
console.log(`  - ${result.xml}`);
console.log(`  - ${result.prompts}`);
console.log(`  - ${result.html}`);