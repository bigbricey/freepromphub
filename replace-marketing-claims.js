const fs = require('fs');
const path = require('path');

// Define replacements for marketing claims with factual benefits
const replacements = [
    // Index.html replacements
    {
        old: '2X conversion rates, write $10K proposals, automate 80% of emails',
        new: 'Improve conversion rates, write professional proposals, automate routine emails'
    },
    {
        old: '10X writing speed, viral hooks that work, LinkedIn posts that get 1000+ views',
        new: 'Write faster, create engaging content, improve social media engagement'
    },
    {
        old: 'Debug in minutes not hours, generate production-ready code, learn 3X faster',
        new: 'Debug more efficiently, generate clean code, accelerate learning'
    },
    
    // Business category replacements
    {
        old: 'Replace $10,000 consultants with prompts that generated $50M+ in revenue for real businesses. Get the exact frameworks used by McKinsey consultants, Y Combinator startups, and Fortune 500 growth teams.',
        new: 'Professional business frameworks and templates used by consultants and successful companies. Save time and money with proven strategies for growth and operations.'
    },
    {
        old: 'The same framework that grew a SaaS from $0 to $2M ARR. Includes channel prioritization, CAC/LTV models, and week-by-week execution.',
        new: 'Comprehensive marketing framework with channel prioritization, customer acquisition models, and detailed execution plans.'
    },
    {
        old: 'Worth $15K agency fee',
        new: 'Professional quality'
    },
    {
        old: 'The template that raised $500K+ for 12 startups. Passes investor sniff test in 30 seconds. Includes financials that actually make sense.',
        new: 'Professional business plan template with investor-ready format. Includes financial projections and clear value propositions.'
    },
    {
        old: 'Raised $6M total',
        new: 'Investor-tested'
    },
    
    // Content category replacements
    {
        old: 'Write 10X faster. Rank #1 on Google 3X more often. Get 500% more engagement. These prompts generated 100M+ views and $2M+ in content revenue. Stop struggling with blank pages.',
        new: 'Create content more efficiently with proven templates. Improve SEO rankings and engagement rates. Overcome writer\'s block with structured frameworks.'
    },
    
    // Copywriting prompt replacements
    {
        old: 'You are a world-class direct response copywriter who has generated over $100M in sales through your copy.',
        new: 'You are an experienced copywriter specializing in persuasive and conversion-focused content.'
    },
    {
        old: 'You are a world-class sales copywriter who has written email campaigns generating over $50M in revenue with average open rates of 40% and reply rates of 15%.',
        new: 'You are an experienced email marketing specialist who understands how to write engaging campaigns with strong open and response rates.'
    },
    {
        old: 'You are a Chief Marketing Officer with 20 years of experience growing businesses from startup to $100M+ in revenue.',
        new: 'You are an experienced marketing strategist with deep knowledge of growth strategies across different business stages.'
    },
    
    // Everyday category replacements
    {
        old: 'Save $2,400/year on groceries. Land jobs paying 30% more. Build emergency funds from nothing. These aren\'t generic tips - they\'re exact scripts that solved real problems for 10,000+ people just like you.',
        new: 'Practical strategies to reduce grocery costs, improve job applications, and build savings. Specific scripts and templates based on real-world experience.'
    },
    {
        old: 'Beat 95% of applicants with ATS-optimized format + psychological triggers that make recruiters call. Average: 3X more interviews.',
        new: 'ATS-optimized resume format with professional keywords that help you stand out. Improve your interview callback rate.'
    },
    
    // Money category replacements
    {
        old: 'Users saved average $18,000/year using these prompts. Find hidden tax deductions worth $3,000+. Optimize investments for 2-3% higher returns. Build wealth 5X faster than traditional advice.',
        new: 'Practical financial strategies to reduce expenses, find tax deductions, and optimize investments. Build wealth systematically with proven approaches.'
    },
    {
        old: 'Same analysis hedge funds pay $10K for. Reduce risk 40% while maintaining returns. Beat 92% of retail investors.',
        new: 'Professional investment analysis framework. Balance risk and returns with systematic evaluation methods.'
    },
    {
        old: 'Worth $10K analysis',
        new: 'Professional analysis'
    },
    {
        old: 'Build 6-month emergency fund 3X faster. Automated savings plan that actually works. Sleep better knowing you\'re covered.',
        new: 'Structured approach to building an emergency fund. Create automated savings habits for financial security.'
    },
    {
        old: '3X faster savings',
        new: 'Accelerated savings'
    },
    
    // Health category replacements
    {
        old: 'Build visible muscle in 20 min/day. The routine that got 500+ couch potatoes doing pushups. See results in 14 days guaranteed.',
        new: 'Efficient 20-minute daily workout routine. Progressive exercises suitable for beginners. Track improvements over time.'
    },
    
    // Specific dollar amount replacements
    {
        old: 'Your members ask about nutrition 10x more than equipment. We can solve that problem and add $2,000/month to your revenue with zero effort from your staff.',
        new: 'Your members frequently ask about nutrition. We can provide a solution that generates additional monthly revenue with minimal staff involvement.'
    },
    {
        old: 'Convenience items that cost 300% more than homemade',
        new: 'Convenience items that cost significantly more than homemade alternatives'
    }
];

// Function to process HTML files
function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            // Recursively process subdirectories
            processHtmlFiles(filePath);
        } else if (file.name.endsWith('.html')) {
            // Process HTML file
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            
            replacements.forEach(replacement => {
                if (content.includes(replacement.old)) {
                    content = content.replace(new RegExp(replacement.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.new);
                    modified = true;
                    console.log(`✓ Updated ${filePath}`);
                }
            });
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    });
}

// Start processing
console.log('Replacing marketing claims with factual benefits...\n');
processHtmlFiles('.');
console.log('\n✅ All marketing claims have been replaced with factual benefits.');