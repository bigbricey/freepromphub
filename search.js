// Search functionality for FreePromptHub
document.addEventListener('DOMContentLoaded', function() {
    // All available prompts with their metadata
    const prompts = [
        // Everyday Life Category (MOST POPULAR)
        {
            title: 'Weekly Meal Planner on a Budget',
            category: 'Everyday',
            url: '/prompts/everyday/meal-planner.html',
            description: '7-day meals with grocery list'
        },
        {
            title: 'Resume That Gets Interviews',
            category: 'Everyday',
            url: '/prompts/everyday/resume-fixer.html',
            description: 'Beat ATS and impress hiring managers'
        },
        {
            title: 'Fix My Budget in 30 Days',
            category: 'Everyday',
            url: '/prompts/everyday/budget-emergency.html',
            description: 'Emergency budget when money is tight'
        },
        {
            title: 'Difficult Conversation Script',
            category: 'Everyday',
            url: '/prompts/everyday/difficult-conversation.html',
            description: 'Exact words for tough talks'
        },
        {
            title: 'Get Fit in My Living Room',
            category: 'Everyday',
            url: '/prompts/everyday/workout-home.html',
            description: 'No gym needed workout plan'
        },
        {
            title: 'Side Hustle Starter Pack',
            category: 'Everyday',
            url: '/prompts/everyday/side-hustle.html',
            description: 'Make extra money fast with what you have'
        },
        {
            title: 'Clean & Organize My Chaos',
            category: 'Everyday',
            url: '/prompts/everyday/clean-organize.html',
            description: 'Declutter any space step by step'
        },
        
        // Business Category
        {
            title: 'Marketing Strategy Generator',
            category: 'Business',
            url: '/prompts/business/marketing-strategy.html',
            description: '12-section marketing plan generator'
        },
        {
            title: 'Business Plan Creator',
            category: 'Business', 
            url: '/prompts/business/business-plan.html',
            description: 'One-page business plan generator'
        },
        {
            title: 'Sales Email Templates',
            category: 'Business',
            url: '/prompts/business/email-templates.html',
            description: 'Cold email and follow-up templates'
        },
        {
            title: 'Social Media Content Calendar',
            category: 'Business',
            url: '/prompts/business/social-media.html',
            description: '30-day content calendar creator'
        },
        {
            title: 'Competitor Analysis',
            category: 'Business',
            url: '/prompts/business/competitor-analysis.html',
            description: 'Comprehensive competitor research'
        },
        
        // Money Category
        {
            title: 'Personal Budget Optimizer',
            category: 'Money',
            url: '/prompts/money/budget-optimizer.html',
            description: '50/30/20 budget analysis and optimization'
        },
        {
            title: 'Debt Payoff Strategy',
            category: 'Money',
            url: '/prompts/money/debt-payoff.html',
            description: 'Avalanche vs snowball debt elimination'
        },
        {
            title: 'Investment Portfolio Analyzer',
            category: 'Money',
            url: '/prompts/money/investment-analyzer.html',
            description: 'Portfolio optimization and rebalancing'
        },
        {
            title: 'Emergency Fund Calculator',
            category: 'Money',
            url: '/prompts/money/emergency-fund.html',
            description: 'Personalized emergency fund planning'
        },
        
        // Content Category
        {
            title: 'SEO Blog Post Writer',
            category: 'Content',
            url: '/prompts/content/blog-post.html',
            description: 'Google-optimized blog content creator'
        },
        {
            title: 'YouTube Script Generator',
            category: 'Content',
            url: '/prompts/content/youtube-script.html',
            description: 'High-retention video scripts'
        },
        {
            title: 'Email Newsletter Creator',
            category: 'Content',
            url: '/prompts/content/newsletter.html',
            description: 'Engaging newsletter templates'
        },
        {
            title: 'Sales Copy Writer',
            category: 'Content',
            url: '/prompts/content/copywriting.html',
            description: 'High-converting sales copy'
        }
    ];

    const searchInput = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;

    let searchTimeout;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase().trim();
        
        // Hide results if query is empty
        if (query === '') {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        // Debounce search to avoid too many updates
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 200);
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Reopen results when focusing on search with existing query
    searchInput.addEventListener('focus', function() {
        if (this.value.trim() !== '') {
            performSearch(this.value.toLowerCase().trim());
        }
    });

    function performSearch(query) {
        // Search through prompts
        const results = prompts.filter(prompt => {
            return prompt.title.toLowerCase().includes(query) ||
                   prompt.category.toLowerCase().includes(query) ||
                   prompt.description.toLowerCase().includes(query);
        });

        // Display results
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-title">${highlightMatch(result.title, query)}</div>
                    <div class="search-result-category">${result.category} • ${result.description}</div>
                </a>
            `).join('');
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="no-results">No prompts found. Try different keywords.</div>';
            searchResults.classList.add('active');
        }
    }

    function highlightMatch(text, query) {
        // Simple highlight function - case insensitive
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
});