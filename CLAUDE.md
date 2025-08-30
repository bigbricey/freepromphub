# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
FreePromptHub is a static AI prompt library and affiliate marketing site built with vanilla HTML, CSS, and JavaScript. It features 150+ prompts across 8 categories and is deployed on Vercel with auto-deployment from GitHub.

**Live Site:** https://freeprompthub.com  
**Repository:** bigbricey/freeprompthub  
**Deployment:** Vercel (auto-deploys from main branch)

## Architecture

### Core Technology Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+) - no frameworks
- **Build System:** None required (pure static site)
- **Hosting:** Vercel with security headers via vercel.json
- **Version Control:** Git with GitHub integration
- **PWA:** Progressive Web App enabled via manifest.json

### Site Structure
```
/                           # Homepage with category grid
/prompts/{category}/        # Individual prompt HTML pages
/css/                       # Modular stylesheets
/js/                        # Feature-specific JavaScript modules
/auth/                      # Authentication system
/search/                    # Search functionality
/dashboard/                 # User dashboard
```

### Content Categories (150+ prompts total)
- **Business** (28 prompts) - Professional, startup, marketing
- **Money** (23 prompts) - Finance, investing, wealth building
- **Health** (19 prompts) - Fitness, wellness, nutrition
- **Relationships** (19 prompts) - Communication, dating, family
- **Content** (15 prompts) - Writing, copywriting, social media
- **Coding** (15 prompts) - Development, debugging, optimization
- **AI Art** (12 prompts) - Creative generation, design
- **Everyday** (27 prompts) - Life skills, practical advice

## Essential Commands

### Development Workflow
```bash
# No build process required - direct file editing
# Open index.html in browser for local testing

# Generate sitemaps and feeds after content changes
node generate-sitemap.js
node generate-rss.js
node update-all-feeds.js

# Run maintenance scripts after affiliate updates
python fix_all_affiliate_links.py
python standardize_headers.py
python complete_missing_prompts.py

# Batch feed updates
update-feeds.bat  # Windows
```

### Deployment
- Automatic deployment via Vercel on push to main branch
- No build step required (static files served directly)
- DNS configured for both freeprompthub.com and www.freeprompthub.com

## Code Architecture

### CSS Organization
- **style.css** - Main stylesheet with CSS custom properties for theming
- **dark-mode.css** - Complete dark theme implementation
- **modern-architecture.css** - Modern CSS features and layouts
- **form-validation.css** - Form styling and validation feedback
- **button-fix.css** - Button visibility and interaction fixes

### JavaScript Modules
Core functionality is split into focused modules:
- **affiliate-manager.js** - Contextual affiliate offer placement and tracking
- **search-engine.js** - Client-side search functionality across all prompts
- **theme-switcher.js** - Dark/light mode toggle with localStorage
- **cookie-consent.js** - GDPR-compliant cookie management
- **form-validation.js** - Input validation and security
- **accessibility.js** - Screen reader support and keyboard navigation
- **rating-system.js** - Prompt rating and feedback collection
- **prompt-actions.js** - Copy-to-clipboard and sharing functionality

### Python Maintenance Scripts
Scripts for bulk operations and affiliate link management:
- **add_{category}_affiliates.py** - Add affiliate links by category
- **fix_all_affiliate_links.py** - Updates ClickBank affiliate links to bigbricey account
- **standardize_headers.py** - Ensure consistent HTML structure
- **complete_missing_prompts.py** - Bulk prompt generation using AI
- **remove_competitor_mentions.py** - Content cleanup scripts
- **move_affiliates_to_top.py** - Repositions affiliate content for visibility
- **setup_analytics.py** - Configures tracking and analytics

### Security Implementation
Comprehensive security headers via both vercel.json and netlify.toml:
- Content Security Policy (CSP) with specific source allowlists
- HTTP Strict Transport Security (HSTS) with preload
- X-Frame-Options to prevent clickjacking
- XSS protection and MIME type sniffing prevention
- Strict cache control for dynamic content

## Content Management

### Prompt Page Structure
Each prompt follows a standardized template with:
- Consistent HTML structure via template.html
- Copy-to-clipboard functionality for prompt text
- Breadcrumb navigation and category links
- Related prompts suggestions
- Affiliate product recommendations (contextually matched)
- FTC-compliant disclosure for affiliate content

### SEO & Feed Generation
- **XML Sitemaps:** Auto-generated with proper priorities
- **RSS Feeds:** Category-specific and master feeds
- **JSON Feed:** Alternative syndication format
- **Structured Data:** Schema.org markup for rich snippets
- Meta tags optimized for search engines and social sharing

### Affiliate Integration
Revenue model based on high-commission affiliate products:
- ClickBank integration with bigbricey account
- Product recommendations contextually matched to prompt categories
- Commission range: $42-$187 per sale
- FTC-compliant disclosure on all affiliate content
- Conversion tracking via Google Analytics 4 and Facebook Pixel
- A/B testing capabilities built-in

## Development Guidelines

### File Naming Conventions
- Prompt files: `{descriptive-name}.html` (kebab-case)
- Category indexes: `index.html` in category folders
- Scripts: `{action}_{target}.py` for maintenance scripts
- Minified files: `{name}.min.{ext}` for production assets

### Content Quality Standards
- Prompts must be tested and functional
- All HTML must validate and be accessible (WCAG 2.1 AA)
- Mobile-first responsive design required
- Progressive enhancement for JavaScript features
- Critical CSS inlined for performance

### Performance Optimization
- CSS and JS files minified (.min.js, .min.css versions)
- Critical CSS inlined in HTML for faster first paint
- Resource hints (preconnect, prefetch) for external resources
- Service worker enabled for offline functionality
- Aggressive caching for static assets

### Analytics & Tracking
- Google Analytics 4 (GA4) for traffic analysis
- Facebook Pixel for retargeting
- Hotjar for heatmapping and user behavior
- Custom event tracking for affiliate clicks and prompt copies
- Conversion funnel tracking

## Project Status
- **Phase 1 Complete:** Site structure and navigation
- **Phase 2 Complete:** 150+ prompts across 8 categories
- **Phase 3 Complete:** Affiliate monetization integrated
- **Phase 4 In Progress:** Traffic growth and optimization

## Troubleshooting

### Common Issues
- **Affiliate links not working:** Run `python fix_all_affiliate_links.py`
- **Inconsistent formatting:** Run `python standardize_headers.py`
- **Missing sitemaps:** Run `node generate-sitemap.js`
- **Outdated feeds:** Run `node update-all-feeds.js` or `update-feeds.bat`
- **Missing prompts:** Run `python complete_missing_prompts.py`

### Development Tips
- No build process means all changes are immediate
- Test locally before pushing to avoid broken deployments
- Use browser DevTools to verify CSP and security headers
- Check mobile responsiveness using device emulation
- Validate HTML using W3C validator
- Test affiliate links in incognito mode

This codebase prioritizes simplicity, performance, and maintainability while providing a comprehensive prompt library with integrated high-commission affiliate monetization strategy.