// Search functionality for FreePromptHub
document.addEventListener('DOMContentLoaded', function() {
    // Build search index from sitemap, with a small fallback list to avoid 0 results
    let prompts = [];
    const fallbackPrompts = [
        { title: 'Weekly Meal Planner on a Budget', category: 'Everyday', url: '/prompts/everyday/meal-planner.html', description: '7-day meals with grocery list' },
        { title: 'Resume That Gets Interviews', category: 'Everyday', url: '/prompts/everyday/resume-fixer.html', description: 'Beat ATS and impress hiring managers' },
        { title: 'Fix My Budget in 30 Days', category: 'Everyday', url: '/prompts/everyday/budget-emergency.html', description: 'Emergency budget when money is tight' },
        { title: 'Marketing Strategy Generator', category: 'Business', url: '/prompts/business/marketing-strategy.html', description: '12-section marketing plan generator' },
        { title: 'Sales Email Templates', category: 'Business', url: '/prompts/business/email-templates.html', description: 'Cold email and follow-up templates' },
        { title: 'Personal Budget Optimizer', category: 'Money', url: '/prompts/money/budget-optimizer.html', description: '50/30/20 budget optimization' },
        { title: 'Emergency Fund Calculator', category: 'Money', url: '/prompts/money/emergency-fund.html', description: 'Personalized emergency fund planning' },
        { title: 'SEO Blog Post Writer', category: 'Content', url: '/prompts/content/blog-post.html', description: 'Google-optimized blog content creator' },
        { title: 'YouTube Script Generator', category: 'Content', url: '/prompts/content/youtube-script.html', description: 'High-retention video scripts' },
        { title: 'Debugging Assistant', category: 'Coding', url: '/prompts/coding/debug-master.html', description: 'Systematic bug investigation' }
    ];

    const searchInput = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;

    let searchTimeout;
    let lastQuery = '';

    // Prefetch sitemap to populate prompts
    fetch('/sitemap.xml')
        .then(r => r.ok ? r.text() : Promise.reject(new Error('sitemap fetch failed')))
        .then(xmlText => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlText, 'application/xml');
            const urlNodes = Array.from(doc.getElementsByTagName('loc'));
            const urls = urlNodes.map(n => n.textContent || '');
            const promptUrls = urls.filter(u => /\/prompts\/[a-z-]+\/.+\.html$/i.test(u));

            const generated = promptUrls.map(u => {
                const a = document.createElement('a');
                a.href = u;
                const path = a.pathname; // e.g., /prompts/everyday/meal-planner.html
                const parts = path.split('/').filter(Boolean);
                const category = parts[1] || '';
                const file = (parts[2] || '').replace('.html','');
                return {
                    title: slugToTitle(file),
                    category: slugToTitle(category),
                    url: path,
                    description: defaultDescriptionFor(category)
                };
            });

            // Merge with fallback and de-dupe
            const byUrl = new Map();
            [...generated, ...fallbackPrompts].forEach(p => { if (!byUrl.has(p.url)) byUrl.set(p.url, p); });
            prompts = Array.from(byUrl.values());

            // If user already typed something, rerun search with new index
            if (lastQuery) performSearch(lastQuery);
        })
        .catch(() => {
            prompts = fallbackPrompts;
        });

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
            lastQuery = query;
            performSearch(query);
        }, 200);
    });

    // Also trigger search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.toLowerCase().trim();
            if (query !== '') {
                lastQuery = query;
                performSearch(query);
            }
        }
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

        // Track search with simple analytics
        if (window.simpleAnalytics && window.simpleAnalytics.trackSearch) {
            window.simpleAnalytics.trackSearch(results.length > 0);
        }

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

    function slugToTitle(slug) {
        if (!slug) return '';
        return slug
            .replace(/[-_]+/g, ' ')
            .replace(/\b([a-z])/g, (m, c) => c.toUpperCase());
    }

    function defaultDescriptionFor(category) {
        const map = {
            'everyday': 'Practical everyday help',
            'business': 'Marketing, sales, and strategy',
            'money': 'Budgeting and personal finance',
            'relationships': 'Dating, family, friendships',
            'content': 'Writing and social media',
            'coding': 'Programming and debugging',
            'health': 'Fitness, nutrition, wellness',
            'ai-art': 'Midjourney, DALL·E, SD prompts'
        };
        const key = category.toLowerCase();
        return map[key] || 'AI prompt';
    }
});
