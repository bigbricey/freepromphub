const fs = require('fs');
const path = require('path');

/**
 * RSS Feed Generator for FreePromptHub
 * Generates RSS 2.0 feed with latest prompts and updates
 */

class RSSGenerator {
    constructor() {
        this.baseUrl = 'https://www.freeprompthub.com';
        this.feedTitle = 'FreePromptHub - Latest AI Prompts';
        this.feedDescription = 'Get the latest AI prompts for ChatGPT, Claude, and other AI tools. Free, tested prompts that actually work.';
        this.feedLanguage = 'en-us';
        this.feedCopyright = `Copyright ${new Date().getFullYear()} FreePromptHub`;
        this.feedAuthor = 'FreePromptHub Team';
        this.feedEmail = 'contact@freeprompthub.com';
        this.items = [];
        
        this.categories = {
            'business': 'Business & Professional',
            'content': 'Content Creation',
            'everyday': 'Everyday Life',
            'health': 'Health & Wellness',
            'money': 'Money & Finance',
            'relationships': 'Relationships',
            'coding': 'Coding & Technology',
            'ai-art': 'AI Art & Design'
        };
    }
    
    /**
     * Scan for prompt pages
     */
    scanPrompts(dir) {
        const promptsDir = path.join(dir, 'prompts');
        
        if (!fs.existsSync(promptsDir)) {
            console.error('Prompts directory not found');
            return;
        }
        
        // Scan each category
        const categories = fs.readdirSync(promptsDir);
        
        for (const category of categories) {
            const categoryPath = path.join(promptsDir, category);
            const stat = fs.statSync(categoryPath);
            
            if (stat.isDirectory()) {
                const files = fs.readdirSync(categoryPath);
                
                for (const file of files) {
                    if (file.endsWith('.html') && file !== 'index.html') {
                        const filePath = path.join(categoryPath, file);
                        this.extractPromptData(filePath, category);
                    }
                }
            }
        }
    }
    
    /**
     * Extract data from prompt HTML file
     */
    extractPromptData(filePath, category) {
        const content = fs.readFileSync(filePath, 'utf8');
        const stat = fs.statSync(filePath);
        
        // Extract title
        const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].replace(' - FreePromptHub', '') : path.basename(filePath, '.html');
        
        // Extract description
        const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        const description = descMatch ? descMatch[1] : `AI prompt for ${title}`;
        
        // Extract first paragraph of content as extended description
        const contentMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
        const extendedDesc = contentMatch ? contentMatch[1] : description;
        
        // Generate URL
        const filename = path.basename(filePath, '.html');
        const url = `${this.baseUrl}/prompts/${category}/${filename}`;
        
        // Get last modified date
        const pubDate = stat.mtime;
        
        // Create RSS item
        this.items.push({
            title: title,
            description: description,
            content: extendedDesc,
            link: url,
            guid: url,
            category: this.categories[category] || category,
            pubDate: pubDate,
            author: this.feedAuthor
        });
    }
    
    /**
     * Generate RSS XML
     */
    generateRSS() {
        // Sort items by date (newest first)
        this.items.sort((a, b) => b.pubDate - a.pubDate);
        
        // Limit to 50 most recent items
        const feedItems = this.items.slice(0, 50);
        
        let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
        rss += '<rss version="2.0" \n';
        rss += '     xmlns:dc="http://purl.org/dc/elements/1.1/"\n';
        rss += '     xmlns:content="http://purl.org/rss/1.0/modules/content/"\n';
        rss += '     xmlns:atom="http://www.w3.org/2005/Atom">\n';
        rss += '  <channel>\n';
        
        // Channel information
        rss += `    <title>${this.escapeXML(this.feedTitle)}</title>\n`;
        rss += `    <link>${this.baseUrl}</link>\n`;
        rss += `    <description>${this.escapeXML(this.feedDescription)}</description>\n`;
        rss += `    <language>${this.feedLanguage}</language>\n`;
        rss += `    <copyright>${this.escapeXML(this.feedCopyright)}</copyright>\n`;
        rss += `    <managingEditor>${this.feedEmail} (${this.feedAuthor})</managingEditor>\n`;
        rss += `    <webMaster>${this.feedEmail} (${this.feedAuthor})</webMaster>\n`;
        rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
        rss += `    <generator>FreePromptHub RSS Generator 1.0</generator>\n`;
        rss += `    <atom:link href="${this.baseUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;
        
        // Add image
        rss += '    <image>\n';
        rss += `      <url>${this.baseUrl}/images/logo.png</url>\n`;
        rss += `      <title>${this.escapeXML(this.feedTitle)}</title>\n`;
        rss += `      <link>${this.baseUrl}</link>\n`;
        rss += '    </image>\n';
        
        // Add items
        for (const item of feedItems) {
            rss += '    <item>\n';
            rss += `      <title>${this.escapeXML(item.title)}</title>\n`;
            rss += `      <link>${item.link}</link>\n`;
            rss += `      <description>${this.escapeXML(item.description)}</description>\n`;
            rss += `      <content:encoded><![CDATA[${item.content}]]></content:encoded>\n`;
            rss += `      <guid isPermaLink="true">${item.guid}</guid>\n`;
            rss += `      <category>${this.escapeXML(item.category)}</category>\n`;
            rss += `      <pubDate>${item.pubDate.toUTCString()}</pubDate>\n`;
            rss += `      <dc:creator>${this.escapeXML(item.author)}</dc:creator>\n`;
            rss += '    </item>\n';
        }
        
        rss += '  </channel>\n';
        rss += '</rss>';
        
        return rss;
    }
    
    /**
     * Generate category-specific RSS feeds
     */
    generateCategoryRSS(category) {
        const categoryItems = this.items.filter(item => 
            item.link.includes(`/prompts/${category}/`)
        );
        
        // Sort by date
        categoryItems.sort((a, b) => b.pubDate - a.pubDate);
        
        const categoryName = this.categories[category] || category;
        
        let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
        rss += '<rss version="2.0">\n';
        rss += '  <channel>\n';
        rss += `    <title>FreePromptHub - ${categoryName} Prompts</title>\n`;
        rss += `    <link>${this.baseUrl}/prompts/${category}</link>\n`;
        rss += `    <description>Latest ${categoryName} AI prompts from FreePromptHub</description>\n`;
        rss += `    <language>${this.feedLanguage}</language>\n`;
        rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
        
        for (const item of categoryItems) {
            rss += '    <item>\n';
            rss += `      <title>${this.escapeXML(item.title)}</title>\n`;
            rss += `      <link>${item.link}</link>\n`;
            rss += `      <description>${this.escapeXML(item.description)}</description>\n`;
            rss += `      <guid>${item.guid}</guid>\n`;
            rss += `      <pubDate>${item.pubDate.toUTCString()}</pubDate>\n`;
            rss += '    </item>\n';
        }
        
        rss += '  </channel>\n';
        rss += '</rss>';
        
        return rss;
    }
    
    /**
     * Generate Atom feed (alternative format)
     */
    generateAtom() {
        // Sort items by date
        this.items.sort((a, b) => b.pubDate - a.pubDate);
        const feedItems = this.items.slice(0, 50);
        
        let atom = '<?xml version="1.0" encoding="UTF-8"?>\n';
        atom += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
        
        atom += `  <title>${this.escapeXML(this.feedTitle)}</title>\n`;
        atom += `  <link href="${this.baseUrl}" />\n`;
        atom += `  <link href="${this.baseUrl}/atom.xml" rel="self" />\n`;
        atom += `  <id>${this.baseUrl}/</id>\n`;
        atom += `  <updated>${new Date().toISOString()}</updated>\n`;
        atom += `  <subtitle>${this.escapeXML(this.feedDescription)}</subtitle>\n`;
        
        atom += '  <author>\n';
        atom += `    <name>${this.escapeXML(this.feedAuthor)}</name>\n`;
        atom += `    <email>${this.feedEmail}</email>\n`;
        atom += '  </author>\n';
        
        for (const item of feedItems) {
            atom += '  <entry>\n';
            atom += `    <title>${this.escapeXML(item.title)}</title>\n`;
            atom += `    <link href="${item.link}" />\n`;
            atom += `    <id>${item.guid}</id>\n`;
            atom += `    <updated>${item.pubDate.toISOString()}</updated>\n`;
            atom += `    <summary>${this.escapeXML(item.description)}</summary>\n`;
            atom += `    <content type="html">${this.escapeXML(item.content)}</content>\n`;
            atom += `    <category term="${this.escapeXML(item.category)}" />\n`;
            atom += '  </entry>\n';
        }
        
        atom += '</feed>';
        
        return atom;
    }
    
    /**
     * Generate JSON feed (modern alternative)
     */
    generateJSON() {
        // Sort items by date
        this.items.sort((a, b) => b.pubDate - a.pubDate);
        const feedItems = this.items.slice(0, 50);
        
        const jsonFeed = {
            version: "https://jsonfeed.org/version/1.1",
            title: this.feedTitle,
            home_page_url: this.baseUrl,
            feed_url: `${this.baseUrl}/feed.json`,
            description: this.feedDescription,
            icon: `${this.baseUrl}/images/logo.png`,
            favicon: `${this.baseUrl}/favicon.ico`,
            authors: [{
                name: this.feedAuthor,
                email: this.feedEmail
            }],
            language: this.feedLanguage,
            items: feedItems.map(item => ({
                id: item.guid,
                url: item.link,
                title: item.title,
                summary: item.description,
                content_html: item.content,
                date_published: item.pubDate.toISOString(),
                author: {
                    name: item.author
                },
                tags: [item.category]
            }))
        };
        
        return JSON.stringify(jsonFeed, null, 2);
    }
    
    /**
     * Escape XML special characters
     */
    escapeXML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    
    /**
     * Generate all feeds
     */
    generate() {
        const rootDir = path.join(__dirname);
        
        console.log('Scanning for prompt pages...');
        this.scanPrompts(rootDir);
        
        console.log(`Found ${this.items.length} prompts`);
        
        // Generate RSS 2.0 feed
        console.log('Generating RSS 2.0 feed...');
        const rssFeed = this.generateRSS();
        fs.writeFileSync(path.join(rootDir, 'rss.xml'), rssFeed);
        console.log('✅ Generated rss.xml');
        
        // Generate category RSS feeds
        console.log('Generating category RSS feeds...');
        for (const category of Object.keys(this.categories)) {
            const categoryRSS = this.generateCategoryRSS(category);
            fs.writeFileSync(path.join(rootDir, `rss-${category}.xml`), categoryRSS);
            console.log(`✅ Generated rss-${category}.xml`);
        }
        
        // Generate Atom feed
        console.log('Generating Atom feed...');
        const atomFeed = this.generateAtom();
        fs.writeFileSync(path.join(rootDir, 'atom.xml'), atomFeed);
        console.log('✅ Generated atom.xml');
        
        // Generate JSON feed
        console.log('Generating JSON feed...');
        const jsonFeed = this.generateJSON();
        fs.writeFileSync(path.join(rootDir, 'feed.json'), jsonFeed);
        console.log('✅ Generated feed.json');
        
        // Update last generation timestamp
        const timestamp = {
            generated: new Date().toISOString(),
            items: this.items.length
        };
        fs.writeFileSync(
            path.join(rootDir, 'rss-last-generated.json'),
            JSON.stringify(timestamp, null, 2)
        );
        
        return {
            items: this.items.length,
            feeds: {
                rss: 'rss.xml',
                atom: 'atom.xml',
                json: 'feed.json',
                categories: Object.keys(this.categories).length
            }
        };
    }
}

// Run generator
const generator = new RSSGenerator();
const result = generator.generate();

console.log('\n✨ RSS feed generation complete!');
console.log(`Total items indexed: ${result.items}`);
console.log(`Feeds generated:`);
console.log(`  - ${result.feeds.rss} (main RSS feed)`);
console.log(`  - ${result.feeds.atom} (Atom format)`);
console.log(`  - ${result.feeds.json} (JSON format)`);
console.log(`  - ${result.feeds.categories} category-specific RSS feeds`);