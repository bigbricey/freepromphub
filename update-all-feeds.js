#!/usr/bin/env node

/**
 * Automated Update Script for Sitemaps and RSS Feeds
 * Run this script to regenerate all sitemaps and feeds
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting automated update of sitemaps and RSS feeds...\n');
console.log('=' .repeat(50));

// Track results
const results = {
    success: [],
    failed: [],
    startTime: Date.now()
};

// Function to run a generator script
function runGenerator(scriptName, description) {
    console.log(`\n📋 ${description}...`);
    
    try {
        const output = execSync(`node ${scriptName}`, {
            cwd: __dirname,
            encoding: 'utf8'
        });
        
        // Check if output indicates success
        if (output.includes('✅') || output.includes('complete')) {
            results.success.push(description);
            console.log(`✅ ${description} completed successfully`);
            return true;
        } else {
            throw new Error('No success indicator in output');
        }
    } catch (error) {
        results.failed.push({ task: description, error: error.message });
        console.error(`❌ Failed to ${description.toLowerCase()}`);
        console.error(`   Error: ${error.message}`);
        return false;
    }
}

// 1. Generate XML Sitemaps
runGenerator('generate-sitemap.js', 'Generating XML sitemaps');

// 2. Generate RSS Feeds
runGenerator('generate-rss.js', 'Generating RSS feeds');

// 3. Update timestamps
const timestamp = new Date().toISOString();
const updateInfo = {
    lastUpdated: timestamp,
    sitemaps: {
        updated: results.success.includes('Generating XML sitemaps'),
        files: ['sitemap.xml', 'sitemap-prompts.xml', 'sitemap.html']
    },
    rss: {
        updated: results.success.includes('Generating RSS feeds'),
        files: ['rss.xml', 'atom.xml', 'feed.json']
    },
    executionTime: Date.now() - results.startTime
};

// Save update info
fs.writeFileSync(
    path.join(__dirname, 'last-update.json'),
    JSON.stringify(updateInfo, null, 2)
);

// 4. Verify files exist
console.log('\n📁 Verifying generated files...');

const requiredFiles = [
    'sitemap.xml',
    'sitemap-prompts.xml',
    'sitemap.html',
    'rss.xml',
    'atom.xml',
    'feed.json',
    'robots.txt'
];

const categoryFeeds = [
    'rss-business.xml',
    'rss-content.xml',
    'rss-everyday.xml',
    'rss-health.xml',
    'rss-money.xml',
    'rss-relationships.xml',
    'rss-coding.xml',
    'rss-ai-art.xml'
];

const allFiles = [...requiredFiles, ...categoryFeeds];
let allFilesExist = true;

for (const file of allFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`  ✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
        console.log(`  ❌ ${file} - NOT FOUND`);
        allFilesExist = false;
    }
}

// 5. Generate summary report
console.log('\n' + '=' .repeat(50));
console.log('\n📊 Update Summary Report\n');

console.log(`⏱️  Execution time: ${((Date.now() - results.startTime) / 1000).toFixed(2)} seconds`);
console.log(`✅ Successful tasks: ${results.success.length}`);
console.log(`❌ Failed tasks: ${results.failed.length}`);

if (results.success.length > 0) {
    console.log('\nCompleted:');
    results.success.forEach(task => console.log(`  • ${task}`));
}

if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach(({task, error}) => {
        console.log(`  • ${task}`);
        console.log(`    └─ ${error}`);
    });
}

// 6. Check file ages and recommend next update
console.log('\n📅 Update Schedule:');

const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;

// Check sitemap age
if (fs.existsSync(path.join(__dirname, 'sitemap.xml'))) {
    const sitemapStats = fs.statSync(path.join(__dirname, 'sitemap.xml'));
    const sitemapAge = Date.now() - sitemapStats.mtime.getTime();
    
    if (sitemapAge > oneWeek) {
        console.log('  ⚠️  Sitemap is over a week old - consider updating');
    } else {
        const daysUntilUpdate = Math.ceil((oneWeek - sitemapAge) / oneDay);
        console.log(`  ✅ Sitemap is fresh (next update in ${daysUntilUpdate} days)`);
    }
}

// Check RSS feed age
if (fs.existsSync(path.join(__dirname, 'rss.xml'))) {
    const rssStats = fs.statSync(path.join(__dirname, 'rss.xml'));
    const rssAge = Date.now() - rssStats.mtime.getTime();
    
    if (rssAge > oneDay * 3) {
        console.log('  ⚠️  RSS feed is over 3 days old - consider updating');
    } else {
        const hoursUntilUpdate = Math.ceil((oneDay * 3 - rssAge) / (60 * 60 * 1000));
        console.log(`  ✅ RSS feed is fresh (next update in ${hoursUntilUpdate} hours)`);
    }
}

// 7. Create cron job suggestion
console.log('\n⚙️  Automation Suggestion:');
console.log('  Add this to your crontab for automatic updates:');
console.log('  0 3 * * * cd /path/to/freeprompthub && node update-all-feeds.js');
console.log('  (This runs daily at 3 AM)');

console.log('\n' + '=' .repeat(50));

if (allFilesExist && results.failed.length === 0) {
    console.log('\n✨ All feeds and sitemaps updated successfully!');
    process.exit(0);
} else {
    console.log('\n⚠️  Update completed with some issues. Please review above.');
    process.exit(1);
}