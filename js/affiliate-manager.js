// Affiliate Manager for FreePromptHub
// Strategic placement and rotation of affiliate offers

(function() {
    'use strict';

    // Affiliate offers database with contextual matching
    const affiliateOffers = {
        // Business & Productivity
        business: {
            primary: {
                title: "📚 Business Strategy Templates",
                description: "Professional templates and frameworks for business planning, marketing, and operations. Save time with proven structures.",
                cta: "View Templates →",
                url: "https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net",
                color: "#4CAF50"
            },
            secondary: {
                title: "📊 Business Analytics Tools",
                description: "Data-driven insights for better business decisions. Analyze performance and identify growth opportunities.",
                cta: "Explore Tools →",
                url: "https://example.clickbank.net",
                color: "#2196F3"
            }
        },
        
        // Money & Finance
        money: {
            primary: {
                title: "💰 Personal Finance Course",
                description: "Learn practical money management strategies. Build savings, reduce debt, and plan for your financial future.",
                cta: "Start Learning →",
                url: "https://finance.clickbank.net",
                color: "#FFD700"
            },
            secondary: {
                title: "📈 Investment Education",
                description: "Understand investment basics and risk management. Make informed decisions about your portfolio.",
                cta: "Learn Investing →",
                url: "https://investing.clickbank.net",
                color: "#00C853"
            }
        },
        
        // Health & Fitness
        health: {
            primary: {
                title: "🥗 Nutrition Guide",
                description: "Evidence-based nutrition information for better health. Practical meal planning and healthy eating strategies.",
                cta: "Get Nutrition Guide →",
                url: "https://nutrition.clickbank.net",
                color: "#FF5722"
            },
            secondary: {
                title: "💪 Fitness Program",
                description: "Structured workout plans for different fitness levels. Build strength and improve your health sustainably.",
                cta: "Start Fitness Journey →",
                url: "https://fitness.clickbank.net",
                color: "#FF9800"
            }
        },
        
        // Relationships & Dating
        relationships: {
            primary: {
                title: "💕 Relationship Communication",
                description: "Improve communication skills for better relationships. Learn active listening and conflict resolution techniques.",
                cta: "Improve Communication →",
                url: "https://relationships.clickbank.net",
                color: "#E91E63"
            },
            secondary: {
                title: "💬 Dating Confidence",
                description: "Build confidence in dating and social situations. Practical tips for authentic connection.",
                cta: "Build Confidence →",
                url: "https://dating.clickbank.net",
                color: "#9C27B0"
            }
        },
        
        // Content & Writing
        content: {
            primary: {
                title: "✍️ Content Creation Course",
                description: "Learn to create engaging content for blogs and social media. Practical writing techniques and strategies.",
                cta: "Learn Content Creation →",
                url: "https://content.clickbank.net",
                color: "#3F51B5"
            },
            secondary: {
                title: "📝 Writing Skills Workshop",
                description: "Improve your writing for business and marketing. Clear communication and persuasive writing techniques.",
                cta: "Improve Writing →",
                url: "https://writing.clickbank.net",
                color: "#673AB7"
            }
        },
        
        // Coding & Tech
        coding: {
            primary: {
                title: "💻 Programming Fundamentals",
                description: "Learn programming basics with structured lessons. Build practical skills for web development.",
                cta: "Start Learning →",
                url: "https://programming.clickbank.net",
                color: "#00BCD4"
            },
            secondary: {
                title: "🚀 Web Development Course",
                description: "Comprehensive web development training. Learn HTML, CSS, JavaScript, and modern frameworks.",
                cta: "Learn Web Dev →",
                url: "https://webdev.clickbank.net",
                color: "#009688"
            }
        },
        
        // Everyday Life
        everyday: {
            primary: {
                title: "🎯 Productivity System",
                description: "Organize your life with proven productivity methods. Time management and goal-setting strategies.",
                cta: "Get Organized →",
                url: "https://productivity.clickbank.net",
                color: "#795548"
            },
            secondary: {
                title: "📖 Personal Development",
                description: "Build better habits and reach your goals. Practical self-improvement strategies that work.",
                cta: "Start Growing →",
                url: "https://development.clickbank.net",
                color: "#607D8B"
            }
        },
        
        // AI Art & Creative
        'ai-art': {
            primary: {
                title: "🎨 Digital Art Course",
                description: "Learn digital art creation techniques. From basics to advanced methods for creating stunning visuals.",
                cta: "Learn Digital Art →",
                url: "https://digitalart.clickbank.net",
                color: "#FF4081"
            },
            secondary: {
                title: "🖼️ Creative Skills Training",
                description: "Develop your creative abilities with structured practice. Techniques for visual thinking and design.",
                cta: "Develop Creativity →",
                url: "https://creative.clickbank.net",
                color: "#7C4DFF"
            }
        },
        
        // Universal (fallback)
        universal: {
            primary: {
                title: "📚 Skills Development Library",
                description: "Access courses and resources for personal and professional growth. Learn at your own pace.",
                cta: "Browse Library →",
                url: "https://learning.clickbank.net",
                color: "#4CAF50"
            },
            secondary: {
                title: "💡 Online Learning Platform",
                description: "Expand your knowledge with quality educational content. Various subjects and skill levels available.",
                cta: "Start Learning →",
                url: "https://education.clickbank.net",
                color: "#2196F3"
            }
        }
    };

    class AffiliateManager {
        constructor() {
            this.currentCategory = this.detectCategory();
            this.placement = this.getOptimalPlacement();
            this.init();
        }

        init() {
            // Add affiliate sections to pages
            this.insertAffiliateBlocks();
            
            // Track impressions
            this.trackImpressions();
            
            // A/B testing rotation
            this.setupRotation();
        }

        detectCategory() {
            // Detect category from URL or page content
            const path = window.location.pathname;
            const categories = ['business', 'money', 'health', 'relationships', 'content', 'coding', 'everyday', 'ai-art'];
            
            for (let category of categories) {
                if (path.includes(`/${category}/`)) {
                    return category;
                }
            }
            
            return 'universal';
        }

        getOptimalPlacement() {
            // Determine optimal placement based on page type
            const path = window.location.pathname;
            
            if (path === '/' || path.includes('/index.html')) {
                return 'homepage';
            } else if (path.includes('/prompts/') && path.endsWith('.html')) {
                return 'prompt';
            } else if (path.includes('/prompts/') && !path.endsWith('.html')) {
                return 'category';
            }
            
            return 'other';
        }

        getOffer(position = 'primary') {
            const categoryOffers = affiliateOffers[this.currentCategory] || affiliateOffers.universal;
            const offer = categoryOffers[position] || categoryOffers.primary;
            
            // A/B test different offers
            if (Math.random() > 0.5 && categoryOffers.secondary) {
                return categoryOffers.secondary;
            }
            
            return offer;
        }

        createAffiliateSection(position = 'top', style = 'banner') {
            const offer = this.getOffer();
            
            const styles = {
                banner: `
                    background: linear-gradient(135deg, ${offer.color}ee 0%, ${offer.color}cc 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 12px;
                    margin: 30px 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                `,
                inline: `
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-left: 4px solid ${offer.color};
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                `,
                sidebar: `
                    background: white;
                    border: 2px solid ${offer.color};
                    padding: 20px;
                    border-radius: 8px;
                    position: sticky;
                    top: 100px;
                `,
                native: `
                    background: var(--bg-secondary);
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                `
            };
            
            const section = document.createElement('section');
            section.className = `affiliate-section affiliate-${position} affiliate-${style}`;
            section.setAttribute('data-category', this.currentCategory);
            section.setAttribute('data-offer', offer.title);
            section.style.cssText = styles[style] || styles.banner;
            
            // Add animation
            section.style.animation = 'fadeIn 0.5s ease-in';
            
            section.innerHTML = `
                ${style === 'banner' ? '<div class="affiliate-glow" style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite;"></div>' : ''}
                <h2 style="${style === 'banner' ? 'color: white;' : `color: ${offer.color};`} margin-bottom: 15px; font-size: 1.5rem; position: relative; z-index: 1;">
                    ${offer.title}
                </h2>
                <p style="${style === 'banner' ? 'color: white;' : 'color: var(--text-primary);'} margin-bottom: 20px; line-height: 1.6; position: relative; z-index: 1;">
                    ${offer.description}
                </p>
                <a href="${offer.url}" 
                   target="_blank" 
                   rel="noopener noreferrer sponsored"
                   class="affiliate-cta"
                   data-action="click"
                   data-category="${this.currentCategory}"
                   style="display: inline-block; background: ${style === 'banner' ? 'white' : offer.color}; color: ${style === 'banner' ? offer.color : 'white'}; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: all 0.3s ease; position: relative; z-index: 1;">
                    ${offer.cta}
                </a>
                <p style="${style === 'banner' ? 'color: rgba(255,255,255,0.8);' : 'color: var(--text-secondary);'} font-size: 12px; margin-top: 15px; position: relative; z-index: 1;">
                    <em>*Partner content - We may earn a commission if you purchase. This helps us keep all prompts free.</em>
                </p>
            `;
            
            // Add hover effect to CTA
            const cta = section.querySelector('.affiliate-cta');
            cta.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });
            cta.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
            
            return section;
        }

        insertAffiliateBlocks() {
            // Skip if already has affiliate sections
            if (document.querySelector('.affiliate-section')) {
                return;
            }
            
            switch(this.placement) {
                case 'homepage':
                    this.insertHomepageAffiliates();
                    break;
                case 'prompt':
                    this.insertPromptPageAffiliates();
                    break;
                case 'category':
                    this.insertCategoryPageAffiliates();
                    break;
                default:
                    // No affiliates on other pages
                    break;
            }
        }

        insertHomepageAffiliates() {
            // After hero section
            const hero = document.querySelector('.hero');
            if (hero && hero.parentNode) {
                const topBanner = this.createAffiliateSection('hero', 'banner');
                hero.parentNode.insertBefore(topBanner, hero.nextSibling);
            }
            
            // Between category sections
            const categories = document.querySelector('.categories');
            if (categories) {
                const categoryCards = categories.querySelectorAll('.category-card');
                if (categoryCards.length > 4) {
                    const midPoint = Math.floor(categoryCards.length / 2);
                    const nativeAd = this.createAffiliateSection('mid', 'native');
                    categoryCards[midPoint].parentNode.insertBefore(nativeAd, categoryCards[midPoint].nextSibling);
                }
            }
        }

        insertPromptPageAffiliates() {
            // Top of content (after breadcrumb)
            const breadcrumb = document.querySelector('.breadcrumb');
            if (breadcrumb && breadcrumb.parentNode) {
                const topBanner = this.createAffiliateSection('top', 'banner');
                breadcrumb.parentNode.insertBefore(topBanner, breadcrumb.nextSibling);
            }
            
            // After prompt content (before related)
            const relatedSection = document.querySelector('.related-prompts');
            if (relatedSection && relatedSection.parentNode) {
                const bottomInline = this.createAffiliateSection('bottom', 'inline');
                relatedSection.parentNode.insertBefore(bottomInline, relatedSection);
            }
        }

        insertCategoryPageAffiliates() {
            // After category header
            const header = document.querySelector('h1');
            if (header && header.parentNode) {
                const topBanner = this.createAffiliateSection('top', 'banner');
                header.parentNode.insertBefore(topBanner, header.nextSibling);
            }
            
            // In the middle of prompt grid
            const promptGrid = document.querySelector('.prompt-grid');
            if (promptGrid) {
                const prompts = promptGrid.querySelectorAll('.prompt-card');
                if (prompts.length > 6) {
                    const insertPoint = 3;
                    const nativeAd = this.createAffiliateSection('mid', 'native');
                    prompts[insertPoint].parentNode.insertBefore(nativeAd, prompts[insertPoint]);
                }
            }
        }

        trackImpressions() {
            // Track when affiliate sections come into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        const data = {
                            event: 'affiliate_impression',
                            category: section.dataset.category,
                            offer: section.dataset.offer,
                            position: section.className,
                            timestamp: new Date().toISOString()
                        };
                        
                        // Store impression data
                        this.logEvent(data);
                        
                        // Only track once
                        observer.unobserve(section);
                    }
                });
            }, { threshold: 0.5 });
            
            // Observe all affiliate sections
            document.querySelectorAll('.affiliate-section').forEach(section => {
                observer.observe(section);
            });
        }

        setupRotation() {
            // Rotate offers every 30 seconds for engaged users
            let rotationCount = 0;
            const maxRotations = 3;
            
            setInterval(() => {
                if (rotationCount >= maxRotations) return;
                
                // Only rotate if user has scrolled
                if (window.scrollY > 100) {
                    const sections = document.querySelectorAll('.affiliate-section');
                    sections.forEach(section => {
                        // Fade out
                        section.style.opacity = '0';
                        
                        setTimeout(() => {
                            // Get new offer
                            const newOffer = this.getOffer(rotationCount % 2 === 0 ? 'secondary' : 'primary');
                            
                            // Update content
                            section.querySelector('h2').textContent = newOffer.title;
                            section.querySelector('p').textContent = newOffer.description;
                            const cta = section.querySelector('.affiliate-cta');
                            cta.textContent = newOffer.cta;
                            cta.href = newOffer.url;
                            
                            // Fade in
                            section.style.opacity = '1';
                        }, 300);
                    });
                    
                    rotationCount++;
                }
            }, 30000); // 30 seconds
        }

        logEvent(data) {
            // Store in localStorage for analytics
            const events = JSON.parse(localStorage.getItem('affiliateEvents') || '[]');
            events.push(data);
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.shift();
            }
            
            localStorage.setItem('affiliateEvents', JSON.stringify(events));
        }

        // Public API
        getStats() {
            const events = JSON.parse(localStorage.getItem('affiliateEvents') || '[]');
            const clicks = events.filter(e => e.event === 'affiliate_click').length;
            const impressions = events.filter(e => e.event === 'affiliate_impression').length;
            const ctr = impressions > 0 ? (clicks / impressions * 100).toFixed(2) : 0;
            
            return {
                impressions,
                clicks,
                ctr: `${ctr}%`,
                topCategory: this.getTopCategory(events),
                topOffer: this.getTopOffer(events)
            };
        }

        getTopCategory(events) {
            const categories = {};
            events.forEach(e => {
                categories[e.category] = (categories[e.category] || 0) + 1;
            });
            return Object.keys(categories).sort((a, b) => categories[b] - categories[a])[0];
        }

        getTopOffer(events) {
            const offers = {};
            events.forEach(e => {
                if (e.offer) {
                    offers[e.offer] = (offers[e.offer] || 0) + 1;
                }
            });
            return Object.keys(offers).sort((a, b) => offers[b] - offers[a])[0];
        }
    }

    // Track clicks on affiliate links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('.affiliate-cta');
        if (link) {
            const data = {
                event: 'affiliate_click',
                category: link.dataset.category,
                offer: link.closest('.affiliate-section').dataset.offer,
                url: link.href,
                timestamp: new Date().toISOString()
            };
            
            // Log the click
            const manager = window.affiliateManager;
            if (manager) {
                manager.logEvent(data);
            }
        }
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .affiliate-section {
            transition: opacity 0.3s ease;
        }
        
        .affiliate-cta {
            position: relative;
            overflow: hidden;
        }
        
        .affiliate-cta::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .affiliate-cta:hover::before {
            width: 300px;
            height: 300px;
        }
        
        /* Dark mode support */
        [data-theme="dark"] .affiliate-section.affiliate-native {
            background: var(--bg-secondary);
        }
        
        [data-theme="dark"] .affiliate-section.affiliate-inline {
            background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.affiliateManager = new AffiliateManager();
        });
    } else {
        window.affiliateManager = new AffiliateManager();
    }
})();