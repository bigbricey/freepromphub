// Enhanced Search UI for homepage and all pages
(function() {
    // Wait for search engine to load
    function initSearchUI() {
        if (typeof searchEngine === 'undefined' || !window.FPH || !window.FPH.searchEngine) {
            setTimeout(initSearchUI, 100);
            return;
        }

        // Get search input on homepage
        const searchBar = document.getElementById('searchBar');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchBar) return;

        // Create enhanced search results container
        if (!searchResults) {
            const resultsDiv = document.createElement('div');
            resultsDiv.id = 'searchResults';
            resultsDiv.className = 'search-results-dropdown';
            resultsDiv.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                margin-top: 5px;
                max-height: 500px;
                overflow-y: auto;
                display: none;
                z-index: 1000;
            `;
            searchBar.parentElement.appendChild(resultsDiv);
        }

        let searchTimeout;
        let currentQuery = '';

        // Enhanced search function
        function performSearch(query) {
            currentQuery = query;
            
            if (!query || query.trim().length < 2) {
                hideResults();
                return;
            }

            // Search with the engine
            const results = searchEngine.search(query, {
                maxResults: 8,
                sortBy: 'relevance'
            });

            // Get suggestions too
            const suggestions = searchEngine.getSuggestions(query, 3);

            displayResults(results, suggestions, query);
        }

        // Display search results
        function displayResults(results, suggestions, query) {
            const container = document.getElementById('searchResults');
            
            if (results.length === 0 && suggestions.length === 0) {
                container.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #6c757d;">
                        <p>No prompts found for "${query}"</p>
                        <a href="/search?q=${encodeURIComponent(query)}" style="color: #0066CC;">
                            Try advanced search →
                        </a>
                    </div>
                `;
                showResults();
                return;
            }

            let html = '';

            // Add quick actions
            html += `
                <div style="padding: 10px 15px; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.9rem; color: #6c757d;">
                        Press Enter for advanced search
                    </span>
                    <a href="/search?q=${encodeURIComponent(query)}" style="color: #0066CC; font-size: 0.9rem; text-decoration: none;">
                        View all results →
                    </a>
                </div>
            `;

            // Add suggestions if any
            if (suggestions.length > 0) {
                html += `
                    <div style="padding: 10px 15px; border-bottom: 1px solid #dee2e6;">
                        <div style="font-size: 0.85rem; color: #6c757d; margin-bottom: 8px;">Suggestions</div>
                        ${suggestions.map(s => `
                            <a href="#" onclick="event.preventDefault(); document.getElementById('searchBar').value='${s}'; return false;" 
                               style="display: inline-block; margin: 2px; padding: 4px 10px; background: #f8f9fa; border-radius: 15px; color: #333; text-decoration: none; font-size: 0.9rem;">
                                ${s}
                            </a>
                        `).join('')}
                    </div>
                `;
            }

            // Add search results
            if (results.length > 0) {
                html += `<div style="padding: 10px 0;">`;
                
                results.forEach(result => {
                    // Highlight matching terms
                    const highlightedTitle = highlightTerms(result.title, query);
                    const highlightedDesc = highlightTerms(result.description, query);
                    
                    html += `
                        <a href="${result.id}" class="search-result-item" style="
                            display: block;
                            padding: 12px 20px;
                            text-decoration: none;
                            color: inherit;
                            transition: background 0.2s;
                            border-bottom: 1px solid #f0f0f0;
                        " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; color: #212529; margin-bottom: 4px;">
                                        ${highlightedTitle}
                                    </div>
                                    <div style="font-size: 0.9rem; color: #6c757d; line-height: 1.4;">
                                        ${highlightedDesc}
                                    </div>
                                    <div style="margin-top: 6px;">
                                        <span style="display: inline-block; padding: 2px 8px; background: #e3f2fd; color: #1976d2; border-radius: 10px; font-size: 0.8rem; margin-right: 8px;">
                                            ${result.category}
                                        </span>
                                        <span style="font-size: 0.8rem; color: #9e9e9e;">
                                            ${result.difficulty} • ${result.timeToComplete}
                                        </span>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 0.85rem; color: #ff6b6b; font-weight: 500;">
                                        ${result.popularity}% match
                                    </div>
                                </div>
                            </div>
                        </a>
                    `;
                });
                
                html += `</div>`;
            }

            // Add popular searches footer
            html += `
                <div style="padding: 12px 20px; background: #f8f9fa; border-top: 1px solid #dee2e6;">
                    <div style="font-size: 0.85rem; color: #6c757d; margin-bottom: 8px;">Popular searches</div>
                    <div>
                        ${searchEngine.getPopularSearches().slice(0, 5).map(term => `
                            <a href="/search?q=${encodeURIComponent(term)}" 
                               style="display: inline-block; margin: 2px; padding: 4px 10px; background: white; border: 1px solid #dee2e6; border-radius: 15px; color: #333; text-decoration: none; font-size: 0.85rem;">
                                ${term}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;

            container.innerHTML = html;
            showResults();
        }

        // Highlight search terms in text
        function highlightTerms(text, query) {
            const terms = query.toLowerCase().split(' ');
            let highlighted = text;
            
            terms.forEach(term => {
                if (term.length > 2) {
                    const regex = new RegExp(`(${term})`, 'gi');
                    highlighted = highlighted.replace(regex, '<mark style="background: #fff59d; padding: 0 2px;">$1</mark>');
                }
            });
            
            return highlighted;
        }

        // Show/hide results
        function showResults() {
            const container = document.getElementById('searchResults');
            if (container) {
                container.style.display = 'block';
            }
        }

        function hideResults() {
            const container = document.getElementById('searchResults');
            if (container) {
                container.style.display = 'none';
            }
        }

        // Event listeners
        searchBar.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            
            if (query.length < 2) {
                hideResults();
                return;
            }
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });

        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value;
                if (query) {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                }
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideResults();
            }
        });

        // Focus search with keyboard shortcut (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchBar.focus();
                searchBar.select();
            }
        });

        // Add search hint
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !document.querySelector('.search-hint')) {
            const hint = document.createElement('div');
            hint.className = 'search-hint';
            hint.style.cssText = `
                text-align: center;
                margin-top: 8px;
                font-size: 0.85rem;
                color: #6c757d;
            `;
            hint.innerHTML = `
                <span>Press <kbd style="padding: 2px 6px; background: #f4f4f4; border: 1px solid #ccc; border-radius: 3px; font-family: monospace;">Ctrl+K</kbd> to search anytime</span>
            `;
            searchContainer.appendChild(hint);
        }

        // Add trending section below search on homepage
        const categoriesSection = document.querySelector('.categories');
        if (categoriesSection && !document.querySelector('.trending-prompts')) {
            const trending = searchEngine.getTrendingPrompts(5);
            
            const trendingSection = document.createElement('section');
            trendingSection.className = 'trending-prompts';
            trendingSection.style.cssText = `
                margin: 40px auto;
                max-width: 800px;
                text-align: center;
            `;
            
            trendingSection.innerHTML = `
                <h3 style="margin-bottom: 20px; color: #212529; font-size: 1.8rem; font-weight: 700;">🔥 Trending Prompts</h3>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    ${trending.map(prompt => `
                        <a href="${prompt.id}" style="
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            padding: 10px 20px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white !important;
                            border-radius: 25px;
                            text-decoration: none;
                            font-size: 1rem;
                            font-weight: 600;
                            transition: transform 0.2s, box-shadow 0.2s;
                            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                            opacity: 1 !important;
                        " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)'">
                            <span>${prompt.title}</span>
                            <span style="background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 700;">
                                ${prompt.popularity}%
                            </span>
                        </a>
                    `).join('')}
                </div>
                <div style="margin-top: 25px;">
                    <a href="/search" style="color: #0066CC; text-decoration: none; font-size: 1rem; font-weight: 600;">
                        Explore all prompts with advanced search →
                    </a>
                </div>
            `;
            
            categoriesSection.parentNode.insertBefore(trendingSection, categoriesSection);
        }
    }

    // Initialize
    initSearchUI();
})();