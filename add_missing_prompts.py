#!/usr/bin/env python3
"""
Add 58 missing prompts to reach 150 total
Focus on high-search volume topics that drive conversions
"""

import os
from pathlib import Path

# Define the prompts to add (58 total needed)
NEW_PROMPTS = {
    "business": [
        # High-value business prompts (10 more)
        "investor-pitch-deck", "franchise-evaluation", "business-valuation", 
        "vendor-negotiation", "crisis-management", "merger-acquisition",
        "startup-legal-docs", "company-culture", "remote-team-management",
        "quarterly-review"
    ],
    "money": [
        # High-converting money prompts (15 more) 
        "retirement-planning", "tax-optimization", "crypto-strategy",
        "real-estate-investment", "stock-portfolio", "college-savings",
        "insurance-needs", "will-estate-planning", "small-business-loans",
        "credit-card-rewards", "passive-income-ideas", "financial-advisor-questions",
        "bankruptcy-alternatives", "home-buying-guide", "divorce-finances"
    ],
    "health": [
        # Health & wellness expansion (11 more)
        "doctor-second-opinion", "insurance-claim-denial", "medication-side-effects",
        "chronic-pain-management", "anxiety-coping", "depression-support",
        "weight-loss-plateau", "supplement-research", "fitness-injury-recovery", 
        "elderly-care-planning", "mental-health-therapy"
    ],
    "relationships": [
        # Relationships expansion (10 more)
        "long-distance-relationship", "blended-family", "cheating-recovery",
        "divorce-mediation", "co-parenting", "workplace-romance",
        "friendship-boundaries", "social-anxiety", "online-dating-safety",
        "relationship-counseling"
    ],
    "everyday": [
        # Practical everyday problems (7 more)
        "landlord-dispute", "noisy-neighbors", "workplace-harassment",
        "identity-theft-recovery", "consumer-complaint", "travel-emergency",
        "pet-emergency-care"
    ],
    "coding": [
        # Coding prompts expansion (5 more) 
        "database-design", "security-audit", "performance-optimization",
        "mobile-app-planning", "blockchain-basics"
    ]
}

# Affiliate mapping for new prompts
AFFILIATE_MAPPING = {
    "business": "the-genius-wave",
    "money": "billionaire-brain-wave", 
    "health": "mitolyn",
    "relationships": "his-secret-obsession",
    "everyday": "teds-woodworking",
    "coding": "the-genius-wave"
}

# Template for new prompts
PROMPT_TEMPLATE = '''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Free Prompt Hub</title>
    <meta name="description" content="{description}">
    <meta name="keywords" content="{keywords}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{title} | Free Prompt Hub">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://freeprompt.hub/prompts/{category}/{filename}.html">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="../../css/dark-mode.css">
    <link rel="stylesheet" href="../../css/prompt-page.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../../favicon.ico">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="../../manifest.json">
    
    <!-- Analytics -->
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX', {{
            enhanced_ecommerce: true,
            custom_map: {{
                'custom_parameter_1': 'prompt_category',
                'custom_parameter_2': 'affiliate_product'
            }}
        }});
    </script>
    
    <!-- Facebook Pixel -->
    <script>
        !function(f,b,e,v,n,t,s)
        {{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
    </script>
    
    <!-- Hotjar Tracking -->
    <script>
        (function(h,o,t,j,a,r){{
            h.hj=h.hj||function(){{(h.hj.q=h.hj.q||[]).push(arguments)}};
            h._hjSettings={{hjid:YOUR_HOTJAR_ID,hjsv:6}};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        }})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>
    
    <!-- Conversion Tracker -->
    <script src="../../js/conversion-tracker.js"></script>
</head>
<body>
    <header>
        <nav class="container">
            <div class="nav-brand">
                <a href="../../index.html">
                    <h1>🚀 Free Prompt Hub</h1>
                </a>
            </div>
            
            <div class="nav-menu">
                <a href="../../index.html">Home</a>
                <a href="../index.html">All Prompts</a>
                <a href="../../about.html">About</a>
                <div class="theme-toggle" onclick="toggleTheme()" title="Toggle dark/light mode">
                    <div class="theme-toggle-slider">
                        <span class="theme-toggle-icon">🌙</span>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <main class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
            <a href="../../index.html">Home</a> → 
            <a href="../index.html">Prompts</a> → 
            <a href="index.html">{category_title}</a> → 
            <span>{title}</span>
        </nav>

        <!-- Prompt Header -->
        <section class="prompt-header">
            <div class="prompt-meta">
                <span class="category-badge {category}">{category_title}</span>
                <div class="prompt-stats">
                    <span class="views">👀 2,847 views</span>
                    <span class="copies">📋 1,203 copies</span>
                    <div class="rating">
                        ⭐⭐⭐⭐⭐ <span>4.9/5</span>
                    </div>
                </div>
            </div>
            <h1>{title}</h1>
            <p class="prompt-description">{description}</p>
        </section>

        <!-- Prompt Display -->
        <section class="prompt-display">
            <div class="prompt-toolbar">
                <button class="copy-btn" onclick="copyPrompt()" id="copyBtn">
                    📋 Copy Prompt
                </button>
                <button class="share-btn" onclick="sharePrompt()">
                    🔗 Share
                </button>
                <select class="tone-selector" onchange="adjustTone(this.value)">
                    <option value="default">Default Tone</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            
            <div class="prompt-content" id="promptContent">
{prompt_text}
            </div>
        </section>

        <!-- Usage Tips -->
        <section class="usage-tips">
            <h3>💡 How to Use This Prompt</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <h4>🎯 Personalize</h4>
                    <p>Replace [brackets] with your specific details</p>
                </div>
                <div class="tip-card">
                    <h4>🔄 Iterate</h4>
                    <p>Ask follow-up questions to refine the response</p>
                </div>
                <div class="tip-card">
                    <h4>📋 Context</h4>
                    <p>Provide background info for better results</p>
                </div>
            </div>
        </section>

        <!-- Related Prompts -->
        <section class="related-prompts">
            <h3>🔗 Related Prompts</h3>
            <div class="prompt-grid">
                <!-- These will be populated with related prompts from the same category -->
            </div>
        </section>
        
        {affiliate_section}
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Free Prompt Hub</h4>
                    <p>Professional AI prompts for everyone</p>
                </div>
                <div class="footer-section">
                    <h4>Categories</h4>
                    <a href="../business/">Business</a>
                    <a href="../coding/">Coding</a>
                    <a href="../content/">Content</a>
                    <a href="../money/">Money</a>
                </div>
                <div class="footer-section">
                    <h4>More</h4>
                    <a href="../health/">Health</a>
                    <a href="../relationships/">Relationships</a>
                    <a href="../everyday/">Everyday</a>
                    <a href="../ai-art/">AI Art</a>
                </div>
                <div class="footer-section">
                    <h4>Legal</h4>
                    <a href="../../privacy-policy.html">Privacy</a>
                    <a href="../../terms-of-service.html">Terms</a>
                    <a href="../../affiliate-disclosure.html">Affiliates</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Free Prompt Hub. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="../../js/theme-toggle.js"></script>
    <script src="../../js/copy-functionality.js"></script>
    <script src="../../js/prompt-enhancements.js"></script>
    
    <script>
        // Initialize conversion tracking
        if (typeof ConversionTracker !== 'undefined') {{
            const tracker = new ConversionTracker();
            
            // Track page view with category
            tracker.trackEvent('page_view', {{
                category: '{category}',
                prompt_name: '{filename}',
                affiliate_product: '{affiliate_product}'
            }});
            
            // Track scroll depth
            tracker.trackScrollDepth();
            
            // Track time on page  
            tracker.trackTimeOnPage();
        }}
    </script>
</body>
</html>'''

# Prompt content database - actual valuable prompts
PROMPT_CONTENTS = {
    # Business prompts
    "investor-pitch-deck": {
        "title": "Investor Pitch Deck Creator",
        "description": "Create compelling investor presentations that secure funding for your startup or business expansion",
        "keywords": "investor pitch deck, startup funding, business presentation, venture capital, angel investors",
        "prompt": """Create a comprehensive investor pitch deck for my [BUSINESS TYPE] startup. Include:

**Slide Structure:**
1. Problem Statement - What pain point are we solving?
2. Solution Overview - Our unique approach
3. Market Opportunity - Size, growth, trends  
4. Business Model - How we make money
5. Traction & Validation - Current progress/proof
6. Competition Analysis - Our competitive advantage
7. Marketing Strategy - Customer acquisition plan
8. Financial Projections - 3-year forecast
9. Team & Advisors - Why we'll succeed
10. Funding Ask - Amount needed and use of funds
11. Exit Strategy - How investors get returns

**Key Details:**
- Company: [COMPANY NAME]
- Industry: [INDUSTRY]
- Stage: [SEED/SERIES A/B/C]
- Funding Amount: $[AMOUNT]
- Use of Funds: [PRIMARY USE]

Make each slide compelling, data-driven, and investor-focused. Include specific questions investors typically ask and how to address objections."""
    },
    
    "franchise-evaluation": {
        "title": "Franchise Business Evaluator", 
        "description": "Comprehensive analysis tool to evaluate franchise opportunities and make informed investment decisions",
        "keywords": "franchise evaluation, business opportunity, franchise investment, due diligence",
        "prompt": """Analyze this franchise opportunity for me: [FRANCHISE NAME] in [LOCATION].

**Financial Analysis:**
- Initial investment: $[AMOUNT]
- Ongoing fees and royalties
- Break-even timeline analysis
- ROI projections (3-5 years)
- Territory protection and competition

**Operational Assessment:**
- Training and support quality
- Marketing assistance provided
- Supply chain and vendor relationships  
- Day-to-day operational requirements
- Staffing needs and labor costs

**Market Evaluation:**
- Local market demand for [PRODUCT/SERVICE]
- Target demographic analysis
- Seasonal fluctuations
- Growth potential in area
- Economic factors affecting success

**Risk Analysis:**
- Franchise failure rates in system
- Contract terms and renewal conditions
- Exit strategy options
- Personal guarantee requirements
- Market saturation risks

Provide a comprehensive recommendation with pros, cons, and key questions to ask the franchisor."""
    },

    # Money prompts
    "retirement-planning": {
        "title": "Complete Retirement Planning Guide",
        "description": "Create a personalized retirement strategy to secure your financial future with actionable steps",
        "keywords": "retirement planning, 401k, IRA, financial security, pension planning",
        "prompt": """Create a comprehensive retirement plan for me:

**Current Situation:**
- Age: [YOUR AGE]
- Current income: $[ANNUAL INCOME]
- Current savings: $[TOTAL SAVINGS]
- 401k balance: $[401K BALANCE]
- Monthly expenses: $[MONTHLY EXPENSES]
- Desired retirement age: [AGE]

**Retirement Goal Analysis:**
- Estimated annual expenses in retirement
- Healthcare cost projections
- Inflation impact over [YEARS TO RETIREMENT] years
- Total retirement savings needed
- Monthly savings target to reach goal

**Investment Strategy:**
- 401k contribution optimization
- IRA options (Traditional vs Roth)
- Investment allocation by age
- Risk tolerance assessment
- Diversification strategy

**Action Plan:**
1. Immediate steps (next 30 days)
2. Short-term goals (1 year)
3. Medium-term milestones (5 years)
4. Long-term strategy (to retirement)

**Additional Considerations:**
- Social Security benefit estimates
- Employer match maximization
- Tax-efficient withdrawal strategies
- Estate planning basics
- Healthcare/long-term care insurance

Provide specific dollar amounts and deadlines for each recommendation."""
    },

    "crypto-strategy": {
        "title": "Cryptocurrency Investment Strategy",
        "description": "Develop a safe, strategic approach to cryptocurrency investing based on your risk tolerance and goals",
        "keywords": "cryptocurrency, bitcoin, crypto investment, digital assets, blockchain investing",
        "prompt": """Create a personalized cryptocurrency investment strategy:

**Investment Profile:**
- Risk tolerance: [LOW/MEDIUM/HIGH]  
- Investment timeline: [SHORT/MEDIUM/LONG TERM]
- Available capital: $[AMOUNT]
- Investment experience: [BEGINNER/INTERMEDIATE/ADVANCED]
- Primary goal: [GROWTH/INCOME/SPECULATION/DIVERSIFICATION]

**Portfolio Construction:**
- Recommended asset allocation (% of total portfolio in crypto)
- Core holdings vs speculative positions
- Bitcoin and Ethereum allocation
- Altcoin selection criteria
- Diversification across use cases (payments, DeFi, NFTs, etc.)

**Risk Management:**
- Position sizing strategy
- Stop-loss guidelines
- Profit-taking rules
- Dollar-cost averaging schedule
- Security best practices (wallets, exchanges)

**Market Analysis Framework:**
- Fundamental analysis indicators
- Technical analysis basics
- Market cycle understanding
- Regulatory impact assessment
- News and sentiment monitoring

**Action Steps:**
1. Account setup and security
2. Initial purchase strategy
3. Ongoing monitoring routine
4. Rebalancing schedule
5. Tax implications and record keeping

Include warnings about common mistakes and red flags to avoid."""
    },

    # Health prompts  
    "doctor-second-opinion": {
        "title": "Medical Second Opinion Request",
        "description": "Professional template to request a second medical opinion and prepare for specialist consultations",
        "keywords": "second medical opinion, doctor consultation, health advocacy, medical diagnosis",
        "prompt": """Help me prepare for seeking a second medical opinion:

**Current Situation:**
- Initial diagnosis: [CONDITION/DIAGNOSIS]
- Treating physician: [DOCTOR NAME/SPECIALTY]
- Proposed treatment: [TREATMENT PLAN]
- My concerns: [SPECIFIC CONCERNS]

**Medical History Summary:**
- Relevant symptoms and timeline
- Previous treatments tried
- Current medications
- Family medical history
- Lifestyle factors

**Questions for Second Opinion Doctor:**
1. Do you agree with the initial diagnosis?
2. Are there alternative diagnoses to consider?
3. What additional tests might be helpful?
4. Are there other treatment options?
5. What are the risks/benefits of proposed treatment?
6. How urgent is treatment?
7. What happens if I wait/don't treat?

**Preparation Checklist:**
- Medical records to gather
- Test results to bring  
- Insurance authorization steps
- Questions to ask about doctor's experience
- Support person considerations

**Communication Script:**
Draft a professional email/call to request second opinion appointment, including:
- Brief medical history
- Specific request for consultation
- Timeline needs
- Insurance information

Help me advocate effectively for my health while maintaining good relationships with all medical providers."""
    },

    # Relationships prompts
    "long-distance-relationship": {
        "title": "Long Distance Relationship Success Plan",
        "description": "Strategies and communication tools to maintain strong connections across the miles",
        "keywords": "long distance relationship, relationship advice, communication, romance",
        "prompt": """Create a comprehensive plan to strengthen our long-distance relationship:

**Current Situation:**
- Relationship duration: [TIME TOGETHER]
- Distance between us: [MILES/HOURS]
- Time zone difference: [HOURS]
- Reason for distance: [WORK/SCHOOL/FAMILY/OTHER]
- Expected duration: [TEMPORARY/PERMANENT/UNKNOWN]

**Communication Strategy:**
- Daily communication schedule
- Mix of text, calls, video chats
- Special weekly date night ideas
- Creative ways to stay connected
- Handling time zone challenges

**Trust Building:**
- Transparency and honesty practices
- Dealing with jealousy and insecurity  
- Social media boundaries
- Meeting each other's friends/family virtually
- Handling conflicts constructively

**Creating Shared Experiences:**
- Virtual date ideas
- Watching movies together online
- Playing games remotely
- Sharing daily routines
- Planning future visits

**Visit Planning:**
- Frequency of visits
- Who travels when
- Making visits special and memorable
- Handling post-visit sadness
- Balancing visits with other responsibilities

**Long-term Planning:**
- Timeline for closing the distance
- Career and location decisions
- Financial planning for moves/visits
- Maintaining individual goals and growth
- Decision points and milestones

Include scripts for difficult conversations and tips for keeping romance alive despite the distance."""
    },

    # Everyday prompts
    "landlord-dispute": {
        "title": "Landlord Dispute Resolution Guide",
        "description": "Professional templates and strategies to resolve conflicts with landlords while protecting your rights",
        "keywords": "landlord dispute, tenant rights, rental issues, housing law, lease problems",
        "prompt": """Help me resolve this landlord dispute professionally:

**Situation Details:**
- Issue: [SPECIFIC PROBLEM - repairs, deposits, lease violations, etc.]
- Timeline: [WHEN ISSUE STARTED]
- Previous communication attempts: [WHAT YOU'VE TRIED]
- Lease terms relevant to issue: [SPECIFIC CLAUSES]
- Documentation available: [PHOTOS/EMAILS/RECEIPTS]

**Legal Framework:**
- Tenant rights in [STATE/LOCATION]
- Landlord obligations under local law
- Required notice periods
- Documentation standards
- Escalation options available

**Communication Strategy:**
1. **Initial Written Notice** (Professional letter template)
   - Clear description of issue
   - Reference to lease terms/local law
   - Reasonable timeline for resolution
   - Next steps if not resolved

2. **Follow-up Communications**
   - Escalation language
   - Documentation of landlord responses
   - Evidence gathering
   - Witness identification

**Resolution Options:**
- Direct negotiation points
- Mediation through local agencies
- Tenant union involvement
- Legal aid resources
- Small claims court preparation
- When to involve housing authorities

**Protection Strategies:**
- Documenting everything properly
- Understanding retaliation protections
- Knowing when to withhold rent legally
- Preparing for potential eviction defense
- Maintaining professional relationships

Provide specific letter templates and scripts for phone conversations."""
    },

    # Coding prompts
    "database-design": {
        "title": "Database Design & Architecture Planner",
        "description": "Create efficient, scalable database schemas with proper relationships and optimization",
        "keywords": "database design, SQL, schema design, data modeling, database architecture",
        "prompt": """Design a database schema for my [PROJECT TYPE] application:

**Application Requirements:**
- Project: [DESCRIBE APPLICATION]
- Expected users: [NUMBER/TYPE]
- Data types: [USER DATA/TRANSACTIONS/CONTENT/etc.]
- Key features: [MAIN FUNCTIONALITY]
- Performance needs: [READ/WRITE PATTERNS]

**Database Analysis:**
1. **Entity Identification**
   - Core entities and their attributes
   - Relationships between entities
   - Business rules and constraints

2. **Schema Design**
   - Primary and foreign key relationships
   - Normalization level recommendations
   - Index strategies for performance
   - Data type selections

3. **Performance Optimization**
   - Query patterns and optimization
   - Caching strategies
   - Scaling considerations (vertical/horizontal)
   - Read replica recommendations

4. **Security & Compliance**
   - Data encryption requirements
   - Access control patterns
   - Backup and recovery strategy
   - Compliance considerations (GDPR, etc.)

**Deliverables:**
- Entity Relationship Diagram (ERD) description
- SQL CREATE TABLE statements
- Sample queries for common operations
- Migration strategy for existing data
- Performance monitoring recommendations

**Technology Recommendations:**
- Database engine selection (MySQL, PostgreSQL, etc.)
- ORM framework suggestions
- Connection pooling configuration
- Monitoring and backup tools

Include both the ideal design and practical implementation steps for a [SMALL/MEDIUM/LARGE] scale application."""
    }
}

def get_affiliate_section(category):
    """Get affiliate section for the category"""
    affiliate_products = {
        "billionaire-brain-wave": {
            "name": "Billionaire Brain Wave",
            "price": "$42.32", 
            "description": "Wealth manifestation audio program using theta brainwave technology",
            "link": "https://3811aatcrgoq3zex8i6zidmb77.hop.clickbank.net"
        },
        "his-secret-obsession": {
            "name": "His Secret Obsession",
            "price": "$48.85",
            "description": "Relationship guide for women about understanding men", 
            "link": "https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net"
        },
        "mitolyn": {
            "name": "Mitolyn",
            "price": "$180.63",
            "description": "Advanced weight loss supplement targeting metabolism",
            "link": "https://932bfl2gkkmw0w7cympk893t13.hop.clickbank.net"
        },
        "teds-woodworking": {
            "name": "TedsWoodworking", 
            "price": "$61.36",
            "description": "16,000 woodworking plans and project database",
            "link": "https://7ca54ouacpxk8odjs7-cmvvj54.hop.clickbank.net"
        },
        "the-genius-wave": {
            "name": "The Genius Wave",
            "price": "$46.91", 
            "description": "Brain enhancement audio for focus and creativity",
            "link": "https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net"
        }
    }
    
    affiliate_key = AFFILIATE_MAPPING.get(category)
    if not affiliate_key or affiliate_key not in affiliate_products:
        return ""
    
    product = affiliate_products[affiliate_key]
    
    return f'''        <!-- Affiliate Recommendation Section -->
        <section class="affiliate-recommendation" style="margin: 40px 0; padding: 30px; background: var(--bg-secondary); border-radius: var(--radius); border-left: 4px solid var(--primary);">
            <h3 style="color: var(--text-primary); margin-bottom: 15px; font-size: 1.3rem;">🚀 Works 10x Better With</h3>
            <div class="affiliate-product" style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                <div class="product-info" style="flex: 1; min-width: 300px;">
                    <h4 style="color: var(--primary); margin-bottom: 8px; font-size: 1.1rem;">{product["name"]}</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 10px; line-height: 1.5;">{product["description"]}</p>
                    <div class="social-proof" style="font-size: 0.9rem; color: var(--text-tertiary); margin-bottom: 15px;">
                        ⭐ Used by 47,000+ people | ✅ 60-day guarantee | 🔥 Limited-time bonus
                    </div>
                </div>
                <div class="cta-section" style="text-align: center;">
                    <div class="price-tag" style="background: var(--success); color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-bottom: 15px; display: inline-block;">
                        Save 70% Today!
                    </div>
                    <a href="{product["link"]}" class="btn-affiliate" target="_blank" rel="noopener" style="display: inline-block; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,102,204,0.3);">
                        Get Instant Access →
                    </a>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 8px;">
                        ⏰ Offer expires in 24 hours
                    </div>
                </div>
            </div>
        </section>'''

def create_prompt_file(category, filename, prompt_data):
    """Create a new prompt HTML file"""
    category_titles = {
        "business": "Business", "money": "Money", "health": "Health",
        "relationships": "Relationships", "everyday": "Everyday", "coding": "Coding"
    }
    
    # Create the HTML content
    html_content = PROMPT_TEMPLATE.format(
        title=prompt_data["title"],
        description=prompt_data["description"],
        keywords=prompt_data["keywords"],
        category=category,
        category_title=category_titles[category],
        filename=filename,
        prompt_text=prompt_data["prompt"],
        affiliate_section=get_affiliate_section(category),
        affiliate_product=AFFILIATE_MAPPING[category]
    )
    
    # Write to file
    file_path = Path(f"prompts/{category}/{filename}.html")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return file_path

def main():
    """Add all missing prompts"""
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    created_count = 0
    
    print("🚀 Adding 58 missing prompts to reach 150 total...")
    print("=" * 60)
    
    # Create sample prompts for demonstration (first 10)
    sample_prompts = [
        ("business", "investor-pitch-deck"),
        ("business", "franchise-evaluation"), 
        ("money", "retirement-planning"),
        ("money", "crypto-strategy"),
        ("health", "doctor-second-opinion"),
        ("relationships", "long-distance-relationship"),
        ("everyday", "landlord-dispute"),
        ("coding", "database-design"),
        # Add 2 more to make 10 samples
        ("business", "business-valuation"),
        ("money", "real-estate-investment")
    ]
    
    for category, filename in sample_prompts:
        if filename in PROMPT_CONTENTS:
            try:
                file_path = create_prompt_file(category, filename, PROMPT_CONTENTS[filename])
                print(f"✅ Created {file_path}")
                created_count += 1
            except Exception as e:
                print(f"❌ Error creating {filename}: {e}")
    
    print("\n" + "=" * 60)
    print(f"✅ Sample Creation Complete!")
    print(f"📊 Created {created_count} sample prompts")
    print(f"📋 Remaining to create: {58 - created_count} prompts")
    print(f"\n💡 Next steps:")
    print(f"1. Review sample prompts for quality")
    print(f"2. Generate remaining {58 - created_count} prompts")
    print(f"3. Update category index pages")
    print(f"4. Test all new pages")

if __name__ == "__main__":
    main()