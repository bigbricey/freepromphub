# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
FreePromptHub is a static AI prompt library and affiliate marketing site built with vanilla HTML, CSS, and JavaScript. It features 94 prompts across 8 categories and is deployed on Vercel with auto-deployment from GitHub.

**Live Site:** https://freeprompthub.com  
**Repository:** bigbricey/freeprompthub  
**Deployment:** Vercel (auto-deploys from main branch)

## Architecture

### Core Technology Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)  
- **Build System:** None required (static site)
- **Hosting:** Vercel with security headers via vercel.json
- **Version Control:** Git with GitHub integration
- **PWA:** Progressive Web App enabled via manifest.json

### Site Structure
```
/                     # Root - Homepage with category grid
/prompts/             # Category index pages
/prompts/{category}/  # Individual prompt pages
/auth/                # Authentication system (login/register)
/search/              # Search functionality
/dashboard/           # User dashboard
```

### Content Categories (94 prompts total)
- **AI Art** (5 prompts) - Creative generation prompts
- **Business** (20 prompts) - Startup, marketing, management
- **Coding** (10 prompts) - Development, debugging, optimization  
- **Content** (10 prompts) - Writing, copywriting, social media
- **Everyday** (20 prompts) - Life skills, practical advice
- **Health** (8 prompts) - Wellness, fitness, mental health
- **Money** (10 prompts) - Finance, budgeting, investing
- **Relationships** (11 prompts) - Communication, dating, family

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
```

### Deployment
- Automatic deployment via Vercel on push to main branch
- No build step required (static files served directly)
- DNS configured for both freeprompthub.com and www.freeprompthub.com

## Code Architecture

### CSS Organization
- **style.css** - Main stylesheet with CSS custom properties for theming
- **dark-mode.css** - Dark theme implementation  
- **button-fix.css** - Button visibility fixes
- **form-validation.css** - Form styling and validation feedback

### JavaScript Modules
Core functionality is split into focused modules:
- **script.js** - Mobile menu, copy-to-clipboard, core functionality
- **theme-switcher.js** - Dark/light mode toggle with localStorage
- **search-engine.js** - Client-side search functionality
- **rating-system.js** - Prompt rating backend logic
- **affiliate-manager.js** - Affiliate link management and tracking

### Python Maintenance Scripts
Scripts for bulk operations and affiliate link management:
- **add_{category}_affiliates.py** - Add affiliate links by category
- **fix_all_affiliate_links.py** - Repair broken or outdated links
- **standardize_headers.py** - Ensure consistent HTML structure
- **remove_competitor_mentions.py** - Content cleanup scripts

### Security Implementation
Comprehensive security headers via both vercel.json and netlify.toml:
- Content Security Policy with specific source allowlists
- HSTS with preload for HTTPS enforcement
- Frame options to prevent clickjacking
- XSS protection and MIME type sniffing prevention
- Strict cache control for dynamic content

## Content Management

### Prompt Page Structure
Each prompt follows a standardized template with:
- Consistent HTML structure via template.html
- Copy-to-clipboard functionality for prompt text
- Breadcrumb navigation and category links
- Related prompts suggestions
- Affiliate product recommendations (when applicable)

### SEO & Feed Generation
- **XML Sitemaps:** Auto-generated for all pages and categories
- **RSS Feeds:** Category-specific and master feeds
- **JSON Feed:** Alternative syndication format
- Meta tags optimized for search engines and social sharing

### Affiliate Integration
Revenue model based on affiliate commissions:
- Product recommendations contextually integrated into prompts
- FTC-compliant disclosure on all affiliate content
- Affiliate links managed via centralized tracking system
- Category-specific affiliate programs (SaaS, finance, health, etc.)

## Development Guidelines

### File Naming Conventions
- Prompt files: `{descriptive-name}.html` (kebab-case)
- Category indexes: `index.html` in category folders
- Scripts: `{action}_{target}.py` for maintenance scripts

### Content Quality Standards
- Prompts must be tested and functional
- All HTML must validate and be accessible
- Mobile-first responsive design required
- Progressive enhancement for JavaScript features

### Deployment Considerations
- No build process means all changes are immediate
- Test locally before pushing to avoid broken deployments
- Security headers configured at hosting level
- Static assets cached aggressively (images, fonts)

## Project Status
- **Phase 1 Complete:** Site structure and navigation
- **Phase 2 Complete:** 94 prompts across 8 categories  
- **Phase 3 In Progress:** Affiliate monetization
- **Phase 4 Planned:** Traffic growth and social media

## Troubleshooting

### Common Issues
- **Affiliate links not working:** Run `python fix_all_affiliate_links.py`
- **Inconsistent formatting:** Run `python standardize_headers.py`  
- **Missing sitemaps:** Run `node generate-sitemap.js`
- **Outdated feeds:** Run `node update-all-feeds.js`

### Performance Optimization
- CSS and JS files are minified (.min.js, .min.css versions available)
- Images should be optimized and properly sized
- Critical CSS inlined for faster first paint
- Service worker enabled for offline functionality

This codebase prioritizes simplicity, performance, and maintainability while providing a comprehensive prompt library with integrated monetization strategy.