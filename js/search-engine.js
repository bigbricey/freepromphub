// Advanced Search Engine for FreePromptHub
class SearchEngine {
    constructor() {
        this.searchIndex = [];
        this.categories = new Set();
        this.tags = new Set();
        this.initialized = false;
        this.initializeSearch();
    }

    // Initialize search index with all prompts
    async initializeSearch() {
        // Define all prompts with full metadata
        this.searchIndex = [
            // Business Category
            {
                id: '/prompts/business/business-plan.html',
                title: 'One-Page Business Plan',
                category: 'Business',
                tags: ['strategy', 'startup', 'planning', 'investor', 'pitch'],
                description: 'Transform your idea into a clear, actionable business plan. Perfect for startups, funding, and strategic planning.',
                content: 'business plan startup funding investor pitch deck strategy market analysis revenue model competitive advantage',
                difficulty: 'intermediate',
                timeToComplete: '20 min',
                useCases: ['Startup planning', 'Investor pitch', 'Strategic planning'],
                popularity: 95
            },
            {
                id: '/prompts/business/marketing-strategy.html',
                title: 'Marketing Strategy Generator',
                category: 'Business',
                tags: ['marketing', 'growth', 'strategy', 'campaigns', 'roi'],
                description: 'Create a complete marketing plan with channels, budgets, campaigns, and KPIs.',
                content: 'marketing strategy digital advertising social media content marketing email campaigns seo sem growth hacking',
                difficulty: 'advanced',
                timeToComplete: '30 min',
                useCases: ['Marketing planning', 'Campaign strategy', 'Growth planning'],
                popularity: 92
            },
            {
                id: '/prompts/business/email-templates.html',
                title: 'Sales Email Templates',
                category: 'Business',
                tags: ['sales', 'email', 'outreach', 'conversion', 'templates'],
                description: 'Generate cold outreach, follow-up, and nurture sequences that get 40%+ open rates.',
                content: 'cold email outreach sales follow up nurture sequence conversion copywriting templates',
                difficulty: 'beginner',
                timeToComplete: '10 min',
                useCases: ['Sales outreach', 'Lead nurturing', 'Customer engagement'],
                popularity: 88
            },
            {
                id: '/prompts/business/social-media.html',
                title: 'Social Media Content Calendar',
                category: 'Business',
                tags: ['social media', 'content', 'calendar', 'engagement', 'posting'],
                description: 'Get a month of strategic social content with captions, hashtags, and posting schedules.',
                content: 'social media instagram facebook linkedin twitter content calendar hashtags captions engagement',
                difficulty: 'beginner',
                timeToComplete: '15 min',
                useCases: ['Content planning', 'Social strategy', 'Brand building'],
                popularity: 85
            },
            {
                id: '/prompts/business/competitor-analysis.html',
                title: 'Competitor Analysis Framework',
                category: 'Business',
                tags: ['analysis', 'competition', 'market research', 'strategy', 'swot'],
                description: 'Analyze competitors systematically to find gaps and opportunities.',
                content: 'competitor analysis swot market research competitive advantage differentiation positioning',
                difficulty: 'intermediate',
                timeToComplete: '25 min',
                useCases: ['Market research', 'Strategic planning', 'Product positioning'],
                popularity: 78
            },

            // Content Category
            {
                id: '/prompts/content/blog-post.html',
                title: 'SEO Blog Post Writer',
                category: 'Content',
                tags: ['seo', 'blog', 'writing', 'content', 'traffic'],
                description: 'Create comprehensive, Google-optimized blog posts with perfect keyword density.',
                content: 'seo blog post writing content creation keyword optimization lsi keywords meta description headers',
                difficulty: 'intermediate',
                timeToComplete: '20 min',
                useCases: ['Blog writing', 'SEO content', 'Traffic generation'],
                popularity: 96
            },
            {
                id: '/prompts/content/youtube-script.html',
                title: 'YouTube Script Generator',
                category: 'Content',
                tags: ['youtube', 'video', 'script', 'viral', 'retention'],
                description: 'Write scripts that hook viewers instantly and maintain high retention.',
                content: 'youtube script video content creation hooks retention engagement viral content storytelling',
                difficulty: 'advanced',
                timeToComplete: '25 min',
                useCases: ['Video creation', 'YouTube content', 'Educational videos'],
                popularity: 91
            },
            {
                id: '/prompts/content/newsletter.html',
                title: 'Email Newsletter Creator',
                category: 'Content',
                tags: ['newsletter', 'email', 'engagement', 'subscribers', 'content'],
                description: 'Build newsletters subscribers eagerly anticipate with high open rates.',
                content: 'newsletter email marketing subscriber engagement content curation copywriting',
                difficulty: 'beginner',
                timeToComplete: '15 min',
                useCases: ['Email marketing', 'Audience building', 'Content distribution'],
                popularity: 83
            },
            {
                id: '/prompts/content/copywriting.html',
                title: 'Sales Copy Writer',
                category: 'Content',
                tags: ['copywriting', 'sales', 'conversion', 'persuasion', 'marketing'],
                description: 'Write sales copy using psychological triggers that convert browsers into buyers.',
                content: 'sales copy copywriting conversion persuasion psychology marketing landing page',
                difficulty: 'advanced',
                timeToComplete: '30 min',
                useCases: ['Sales pages', 'Landing pages', 'Ad copy'],
                popularity: 89
            },
            {
                id: '/prompts/content/instagram-caption.html',
                title: 'Instagram Caption Writer',
                category: 'Content',
                tags: ['instagram', 'social media', 'captions', 'engagement', 'hashtags'],
                description: 'Create scroll-stopping captions that drive engagement and grow followers.',
                content: 'instagram captions social media engagement hashtags storytelling brand voice',
                difficulty: 'beginner',
                timeToComplete: '5 min',
                useCases: ['Instagram posts', 'Social engagement', 'Brand building'],
                popularity: 87
            },

            // Money Category
            {
                id: '/prompts/money/budget-optimizer.html',
                title: 'AI Budget Optimizer',
                category: 'Money',
                tags: ['budget', 'finance', 'savings', 'money management', 'expenses'],
                description: 'Analyze income and expenses to find hidden savings and optimize spending.',
                content: 'budget optimization personal finance expense tracking savings money management',
                difficulty: 'beginner',
                timeToComplete: '15 min',
                useCases: ['Budgeting', 'Expense reduction', 'Financial planning'],
                popularity: 94
            },
            {
                id: '/prompts/money/investment-analyzer.html',
                title: 'Investment Portfolio Analyzer',
                category: 'Money',
                tags: ['investing', 'portfolio', 'stocks', 'analysis', 'risk'],
                description: 'Get institutional-grade portfolio analysis with risk assessment.',
                content: 'investment portfolio analysis stocks bonds etf risk management asset allocation',
                difficulty: 'advanced',
                timeToComplete: '30 min',
                useCases: ['Portfolio review', 'Investment planning', 'Risk assessment'],
                popularity: 86
            },
            {
                id: '/prompts/money/debt-payoff.html',
                title: 'Debt Avalanche Calculator',
                category: 'Money',
                tags: ['debt', 'payoff', 'finance', 'strategy', 'interest'],
                description: 'Create strategic debt elimination plan and save thousands in interest.',
                content: 'debt payoff avalanche snowball strategy interest savings credit cards loans',
                difficulty: 'intermediate',
                timeToComplete: '20 min',
                useCases: ['Debt reduction', 'Financial planning', 'Interest savings'],
                popularity: 90
            },
            {
                id: '/prompts/money/tax-optimizer.html',
                title: 'Tax Deduction Finder',
                category: 'Money',
                tags: ['taxes', 'deductions', 'savings', 'filing', 'optimization'],
                description: 'Find overlooked deductions and credits to minimize tax burden.',
                content: 'tax deductions credits optimization filing savings business personal',
                difficulty: 'intermediate',
                timeToComplete: '25 min',
                useCases: ['Tax planning', 'Deduction finding', 'Tax savings'],
                popularity: 88
            },
            {
                id: '/prompts/money/retirement-planner.html',
                title: 'Retirement Calculator & Planner',
                category: 'Money',
                tags: ['retirement', 'planning', '401k', 'investing', 'future'],
                description: 'Calculate retirement needs and create personalized savings plan.',
                content: 'retirement planning 401k ira investing compound interest savings goals',
                difficulty: 'intermediate',
                timeToComplete: '20 min',
                useCases: ['Retirement planning', 'Long-term savings', 'Investment strategy'],
                popularity: 85
            },

            // Coding Category
            {
                id: '/prompts/coding/code-reviewer.html',
                title: 'AI Code Reviewer',
                category: 'Coding',
                tags: ['code review', 'debugging', 'best practices', 'refactoring', 'quality'],
                description: 'Get expert code reviews with bug detection and optimization suggestions.',
                content: 'code review debugging refactoring optimization best practices clean code',
                difficulty: 'intermediate',
                timeToComplete: '15 min',
                useCases: ['Code review', 'Quality assurance', 'Learning'],
                popularity: 93
            },
            {
                id: '/prompts/coding/api-builder.html',
                title: 'REST API Generator',
                category: 'Coding',
                tags: ['api', 'rest', 'backend', 'endpoints', 'documentation'],
                description: 'Generate complete REST APIs with documentation and best practices.',
                content: 'rest api endpoints crud backend node express python flask documentation',
                difficulty: 'advanced',
                timeToComplete: '30 min',
                useCases: ['API development', 'Backend creation', 'Prototyping'],
                popularity: 87
            },
            {
                id: '/prompts/coding/sql-optimizer.html',
                title: 'SQL Query Optimizer',
                category: 'Coding',
                tags: ['sql', 'database', 'optimization', 'performance', 'queries'],
                description: 'Optimize slow queries and improve database performance.',
                content: 'sql query optimization database performance indexes joins aggregate functions',
                difficulty: 'advanced',
                timeToComplete: '20 min',
                useCases: ['Database optimization', 'Performance tuning', 'Query writing'],
                popularity: 82
            },
            {
                id: '/prompts/coding/regex-builder.html',
                title: 'Regex Pattern Generator',
                category: 'Coding',
                tags: ['regex', 'patterns', 'validation', 'parsing', 'expressions'],
                description: 'Create and explain complex regex patterns for any use case.',
                content: 'regex regular expressions pattern matching validation parsing text processing',
                difficulty: 'intermediate',
                timeToComplete: '10 min',
                useCases: ['Pattern matching', 'Validation', 'Text processing'],
                popularity: 79
            },
            {
                id: '/prompts/coding/unit-test.html',
                title: 'Unit Test Generator',
                category: 'Coding',
                tags: ['testing', 'unit tests', 'tdd', 'quality', 'coverage'],
                description: 'Generate comprehensive unit tests with edge cases and mocks.',
                content: 'unit testing test driven development jest mocha pytest coverage mocking',
                difficulty: 'intermediate',
                timeToComplete: '15 min',
                useCases: ['Test creation', 'Quality assurance', 'TDD'],
                popularity: 84
            },

            // Health Category
            {
                id: '/prompts/health/workout-plan.html',
                title: 'Custom Workout Plan',
                category: 'Health',
                tags: ['fitness', 'workout', 'exercise', 'training', 'gym'],
                description: 'Get personalized workout plans based on your goals and equipment.',
                content: 'workout fitness exercise training strength cardio home gym bodyweight',
                difficulty: 'beginner',
                timeToComplete: '10 min',
                useCases: ['Fitness planning', 'Home workouts', 'Gym routines'],
                popularity: 91
            },
            {
                id: '/prompts/health/meal-prep-beginner.html',
                title: 'Healthy Meal Prep',
                category: 'Health',
                tags: ['meal prep', 'nutrition', 'healthy eating', 'cooking', 'diet'],
                description: 'Simple meal prep plans that save time and support health goals.',
                content: 'meal prep nutrition healthy eating cooking recipes diet weight loss',
                difficulty: 'beginner',
                timeToComplete: '15 min',
                useCases: ['Meal planning', 'Healthy eating', 'Time saving'],
                popularity: 89
            },
            {
                id: '/prompts/health/sleep-better.html',
                title: 'Sleep Optimization Guide',
                category: 'Health',
                tags: ['sleep', 'rest', 'recovery', 'insomnia', 'health'],
                description: 'Fix sleep problems with science-backed techniques and routines.',
                content: 'sleep optimization insomnia rest recovery circadian rhythm sleep hygiene',
                difficulty: 'beginner',
                timeToComplete: '10 min',
                useCases: ['Sleep improvement', 'Recovery', 'Health optimization'],
                popularity: 86
            },
            {
                id: '/prompts/health/stress-management.html',
                title: 'Stress Management Toolkit',
                category: 'Health',
                tags: ['stress', 'mental health', 'relaxation', 'mindfulness', 'wellness'],
                description: 'Evidence-based techniques for managing stress and anxiety.',
                content: 'stress management anxiety relaxation mindfulness meditation breathing wellness',
                difficulty: 'beginner',
                timeToComplete: '10 min',
                useCases: ['Stress reduction', 'Mental wellness', 'Work-life balance'],
                popularity: 88
            },

            // Everyday Category
            {
                id: '/prompts/everyday/meal-planner.html',
                title: 'Weekly Meal Planner on a Budget',
                category: 'Everyday',
                tags: ['meal planning', 'budget', 'groceries', 'cooking', 'savings'],
                description: 'Create complete week of meals with grocery list to save money.',
                content: 'meal planning budget groceries recipes cooking savings waste reduction',
                difficulty: 'beginner',
                timeToComplete: '15 min',
                useCases: ['Meal planning', 'Budget saving', 'Grocery shopping'],
                popularity: 95
            },
            {
                id: '/prompts/everyday/resume-fixer.html',
                title: 'Resume That Gets Interviews',
                category: 'Everyday',
                tags: ['resume', 'job search', 'career', 'interviews', 'ats'],
                description: 'Transform your resume to beat ATS systems and impress hiring managers.',
                content: 'resume cv job search career ats optimization keywords hiring interviews',
                difficulty: 'intermediate',
                timeToComplete: '25 min',
                useCases: ['Job applications', 'Career change', 'Resume updates'],
                popularity: 92
            },
            {
                id: '/prompts/everyday/side-hustle.html',
                title: 'Side Hustle Starter Pack',
                category: 'Everyday',
                tags: ['side hustle', 'income', 'freelance', 'money', 'business'],
                description: 'Find legitimate side hustles you can start today with zero investment.',
                content: 'side hustle extra income freelance gig economy passive income business',
                difficulty: 'beginner',
                timeToComplete: '10 min',
                useCases: ['Extra income', 'Side business', 'Financial goals'],
                popularity: 90
            },

            // AI Art Category
            {
                id: '/prompts/ai-art/consistent-character.html',
                title: 'Consistent Character Creator',
                category: 'AI Art',
                tags: ['character design', 'midjourney', 'consistency', 'illustration', 'art'],
                description: 'Maintain character consistency across multiple AI image generations.',
                content: 'character design midjourney stable diffusion consistency seed reference illustration',
                difficulty: 'advanced',
                timeToComplete: '20 min',
                useCases: ['Character design', 'Story illustration', 'Brand mascots'],
                popularity: 88
            },
            {
                id: '/prompts/ai-art/logo-designer.html',
                title: 'Logo Designer',
                category: 'AI Art',
                tags: ['logo', 'branding', 'design', 'business', 'graphics'],
                description: 'Design professional logos that capture brand essence.',
                content: 'logo design branding identity minimalist modern typography vector graphics',
                difficulty: 'intermediate',
                timeToComplete: '15 min',
                useCases: ['Brand creation', 'Logo design', 'Visual identity'],
                popularity: 93
            },
            {
                id: '/prompts/ai-art/product-mockup.html',
                title: 'Product Mockup Generator',
                category: 'AI Art',
                tags: ['product', 'mockup', 'photography', 'ecommerce', 'marketing'],
                description: 'Generate professional product photography without a studio.',
                content: 'product mockup photography ecommerce marketing hero shots lifestyle rendering',
                difficulty: 'intermediate',
                timeToComplete: '15 min',
                useCases: ['Product photos', 'Marketing materials', 'E-commerce'],
                popularity: 86
            },

            // Relationships Category
            {
                id: '/prompts/relationships/difficult-conversation.html',
                title: 'Difficult Conversation Guide',
                category: 'Relationships',
                tags: ['communication', 'conflict', 'relationships', 'dialogue', 'resolution'],
                description: 'Navigate tough conversations with empathy and clarity.',
                content: 'difficult conversation conflict resolution communication empathy active listening',
                difficulty: 'intermediate',
                timeToComplete: '10 min',
                useCases: ['Conflict resolution', 'Work discussions', 'Family talks'],
                popularity: 87
            },
            {
                id: '/prompts/relationships/apology-letter.html',
                title: 'Sincere Apology Writer',
                category: 'Relationships',
                tags: ['apology', 'relationships', 'communication', 'forgiveness', 'healing'],
                description: 'Craft genuine apologies that repair relationships.',
                content: 'apology forgiveness reconciliation relationships communication healing trust',
                difficulty: 'beginner',
                timeToComplete: '10 min',
                useCases: ['Personal apologies', 'Professional mistakes', 'Relationship repair'],
                popularity: 82
            }
        ];

        // Extract unique categories and tags
        this.searchIndex.forEach(prompt => {
            this.categories.add(prompt.category);
            prompt.tags.forEach(tag => this.tags.add(tag));
        });

        this.initialized = true;
        this.saveToLocalStorage();
    }

    // Perform advanced search with filters
    search(query, filters = {}) {
        if (!this.initialized) return [];

        const {
            category = null,
            tags = [],
            difficulty = null,
            minRating = null,
            sortBy = 'relevance',
            maxResults = 50
        } = filters;

        let results = [...this.searchIndex];

        // Filter by category
        if (category) {
            results = results.filter(item => item.category === category);
        }

        // Filter by tags
        if (tags.length > 0) {
            results = results.filter(item => 
                tags.some(tag => item.tags.includes(tag))
            );
        }

        // Filter by difficulty
        if (difficulty) {
            results = results.filter(item => item.difficulty === difficulty);
        }

        // Filter by minimum rating
        if (minRating && window.FPH?.ratingSystem) {
            results = results.filter(item => {
                const rating = window.FPH.ratingSystem.getRating(item.id);
                return rating.average >= minRating;
            });
        }

        // Search query matching
        if (query && query.trim() !== '') {
            const searchTerms = query.toLowerCase().split(' ');
            
            results = results.map(item => {
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const descLower = item.description.toLowerCase();
                const contentLower = item.content.toLowerCase();
                const tagsString = item.tags.join(' ').toLowerCase();

                searchTerms.forEach(term => {
                    // Title matches (highest weight)
                    if (titleLower.includes(term)) {
                        score += 10;
                        if (titleLower.startsWith(term)) score += 5;
                    }
                    
                    // Tag matches (high weight)
                    if (tagsString.includes(term)) {
                        score += 7;
                    }
                    
                    // Description matches (medium weight)
                    if (descLower.includes(term)) {
                        score += 5;
                    }
                    
                    // Content matches (low weight)
                    if (contentLower.includes(term)) {
                        score += 3;
                    }

                    // Category match
                    if (item.category.toLowerCase().includes(term)) {
                        score += 8;
                    }
                });

                return { ...item, relevanceScore: score };
            });

            // Filter out zero-score results
            results = results.filter(item => item.relevanceScore > 0);
        } else {
            // Add default scores for sorting
            results = results.map(item => ({ 
                ...item, 
                relevanceScore: item.popularity || 0 
            }));
        }

        // Sort results
        switch (sortBy) {
            case 'relevance':
                results.sort((a, b) => b.relevanceScore - a.relevanceScore);
                break;
            case 'popularity':
                results.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'rating':
                if (window.FPH?.ratingSystem) {
                    results.sort((a, b) => {
                        const ratingA = window.FPH.ratingSystem.getRating(a.id).average;
                        const ratingB = window.FPH.ratingSystem.getRating(b.id).average;
                        return ratingB - ratingA;
                    });
                }
                break;
            case 'newest':
                // In real app, would use creation date
                results.reverse();
                break;
            case 'title':
                results.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'difficulty':
                const diffOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                results.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
                break;
        }

        // Limit results
        return results.slice(0, maxResults);
    }

    // Get search suggestions based on partial input
    getSuggestions(query, limit = 10) {
        if (!query || query.length < 2) return [];

        const queryLower = query.toLowerCase();
        const suggestions = new Set();

        // Add matching titles
        this.searchIndex.forEach(item => {
            if (item.title.toLowerCase().includes(queryLower)) {
                suggestions.add(item.title);
            }
        });

        // Add matching tags
        this.tags.forEach(tag => {
            if (tag.includes(queryLower)) {
                suggestions.add(tag);
            }
        });

        // Add matching categories
        this.categories.forEach(cat => {
            if (cat.toLowerCase().includes(queryLower)) {
                suggestions.add(cat);
            }
        });

        return Array.from(suggestions).slice(0, limit);
    }

    // Get popular searches
    getPopularSearches() {
        return [
            'business plan',
            'resume',
            'meal planning',
            'budget',
            'marketing',
            'seo blog',
            'workout',
            'side hustle',
            'email templates',
            'logo design'
        ];
    }

    // Get trending prompts
    getTrendingPrompts(limit = 5) {
        return [...this.searchIndex]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit);
    }

    // Get related prompts
    getRelatedPrompts(promptId, limit = 3) {
        const current = this.searchIndex.find(p => p.id === promptId);
        if (!current) return [];

        return this.searchIndex
            .filter(p => p.id !== promptId && p.category === current.category)
            .sort((a, b) => {
                // Score by shared tags
                const sharedTags = a.tags.filter(t => current.tags.includes(t)).length;
                const bSharedTags = b.tags.filter(t => current.tags.includes(t)).length;
                return bSharedTags - sharedTags;
            })
            .slice(0, limit);
    }

    // Get prompts by category
    getByCategory(category) {
        return this.searchIndex.filter(p => p.category === category);
    }

    // Get all categories
    getCategories() {
        return Array.from(this.categories);
    }

    // Get all tags
    getTags() {
        return Array.from(this.tags).sort();
    }

    // Get filters for current results
    getAvailableFilters(results) {
        const filters = {
            categories: new Set(),
            tags: new Set(),
            difficulties: new Set()
        };

        results.forEach(item => {
            filters.categories.add(item.category);
            item.tags.forEach(tag => filters.tags.add(tag));
            filters.difficulties.add(item.difficulty);
        });

        return {
            categories: Array.from(filters.categories),
            tags: Array.from(filters.tags),
            difficulties: Array.from(filters.difficulties)
        };
    }

    // Save search index to localStorage for offline use
    saveToLocalStorage() {
        try {
            localStorage.setItem('fph_search_index', JSON.stringify(this.searchIndex));
            localStorage.setItem('fph_search_version', '1.0');
        } catch (e) {
            console.error('Failed to save search index:', e);
        }
    }

    // Load search index from localStorage
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('fph_search_index');
            const version = localStorage.getItem('fph_search_version');
            
            if (stored && version === '1.0') {
                this.searchIndex = JSON.parse(stored);
                this.initialized = true;
                return true;
            }
        } catch (e) {
            console.error('Failed to load search index:', e);
        }
        return false;
    }
}

// Initialize search engine
const searchEngine = new SearchEngine();

// Export for use
window.FPH = window.FPH || {};
window.FPH.searchEngine = searchEngine;