const fs = require('fs');
const path = require('path');

// Function to add feed links to HTML file
function addFeedLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if feed links are already added
    if (content.includes('sitemap.html') || content.includes('rss.xml')) {
        console.log(`✓ Already has feed links: ${filePath}`);
        return false;
    }
    
    // Check if file has a footer
    if (!content.includes('<footer') && !content.includes('footer-section')) {
        console.log(`⊘ No footer found: ${filePath}`);
        return false;
    }
    
    // Add feed links to the Resources or last footer section
    const feedLinksHTML = `
                        <li><a href="/sitemap.html">Sitemap</a></li>
                        <li><a href="/rss.xml">RSS Feed</a></li>`;
    
    // Try to add to Resources section first
    if (content.includes('<h4>Resources</h4>')) {
        content = content.replace(
            /<h4>Resources<\/h4>\s*<ul>([\s\S]*?)<\/ul>/,
            (match, listContent) => {
                // Add before the closing </ul>
                return match.replace('</ul>', feedLinksHTML + '\n                    </ul>');
            }
        );
    } 
    // Or try to add to Legal section
    else if (content.includes('<h4>Legal</h4>')) {
        content = content.replace(
            /<h4>Legal<\/h4>\s*<ul>([\s\S]*?)<\/ul>/,
            (match, listContent) => {
                return match.replace('</ul>', feedLinksHTML + '\n                    </ul>');
            }
        );
    }
    // Or add a new Resources section if neither exists
    else if (content.includes('footer-section')) {
        const newSection = `
                <div class="footer-section">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="/sitemap.html">Sitemap</a></li>
                        <li><a href="/rss.xml">RSS Feed</a></li>
                        <li><a href="/atom.xml">Atom Feed</a></li>
                    </ul>
                </div>`;
        
        // Add before the last footer section
        content = content.replace(
            /<div class="footer-bottom">/,
            newSection + '\n            </div>\n            <div class="footer-bottom">'
        );
    }
    
    // Also add feed autodiscovery links to <head> section
    const feedDiscoveryLinks = `
    <!-- Feed Autodiscovery -->
    <link rel="alternate" type="application/rss+xml" title="FreePromptHub RSS Feed" href="/rss.xml">
    <link rel="alternate" type="application/atom+xml" title="FreePromptHub Atom Feed" href="/atom.xml">
    <link rel="alternate" type="application/json" title="FreePromptHub JSON Feed" href="/feed.json">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">`;
    
    if (!content.includes('rel="alternate"') && content.includes('</head>')) {
        content = content.replace('</head>', feedDiscoveryLinks + '\n</head>');
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added feed links to: ${filePath}`);
    return true;
}

// Process key HTML files
function processMainPages() {
    const mainPages = [
        'index.html',
        'about.html',
        'contact.html',
        'search/index.html',
        'privacy-policy.html',
        'terms-of-service.html',
        'prompts/business/index.html',
        'prompts/content/index.html',
        'prompts/everyday/index.html',
        'prompts/health/index.html',
        'prompts/money/index.html',
        'prompts/relationships/index.html',
        'prompts/coding/index.html',
        'prompts/ai-art/index.html'
    ];
    
    let updatedCount = 0;
    const rootDir = 'C:\\Users\\bigbr\\OneDrive\\Desktop\\claude_workspace\\projects\\FreePromptHub';
    
    for (const page of mainPages) {
        const filePath = path.join(rootDir, page);
        
        if (fs.existsSync(filePath)) {
            if (addFeedLinks(filePath)) {
                updatedCount++;
            }
        } else {
            console.log(`⚠️  File not found: ${page}`);
        }
    }
    
    return updatedCount;
}

// Run the script
console.log('Adding sitemap and RSS feed links to main pages...\n');
const updatedFiles = processMainPages();
console.log(`\n✨ Complete! Updated ${updatedFiles} files with feed links.`);