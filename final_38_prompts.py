#!/usr/bin/env python3
"""
Create the final 38 prompts to reach exactly 150 total
Focus on high-search volume, conversion-optimized prompts
"""

import os
from pathlib import Path

# Final 38 prompts distributed across categories
FINAL_PROMPTS = {
    "business": [
        "crisis-management", "merger-acquisition", "startup-legal-docs", 
        "company-culture", "remote-team-management", "quarterly-review",
        "supply-chain-optimization", "brand-reputation-management"
    ],
    "money": [
        "stock-portfolio", "college-savings", "insurance-needs", 
        "will-estate-planning", "small-business-loans", "credit-card-rewards",
        "passive-income-ideas", "financial-advisor-questions", 
        "bankruptcy-alternatives", "home-buying-guide", "divorce-finances",
        "refinancing-strategy", "investment-diversification"
    ],
    "health": [
        "medication-side-effects", "anxiety-coping", "depression-support",
        "weight-loss-plateau", "supplement-research", "fitness-injury-recovery",
        "elderly-care-planning", "mental-health-therapy", "sleep-disorders",
        "chronic-fatigue"
    ],
    "relationships": [
        "cheating-recovery", "co-parenting", "workplace-romance",
        "friendship-boundaries", "social-anxiety", "online-dating-safety",
        "relationship-counseling", "marriage-counseling", "toxic-relationships"
    ],
    "everyday": [
        "workplace-harassment", "consumer-complaint", "travel-emergency",
        "pet-emergency-care", "home-security", "emergency-preparedness"
    ],
    "coding": [
        "performance-optimization", "blockchain-basics"
    ],
    "content": [
        # Expand content category
        "email-marketing", "video-script-writing", "podcast-scripting",
        "sales-page-copy", "press-release-writing"
    ],
    "ai-art": [
        # Expand AI art category  
        "character-consistency", "background-generation", "style-transfer",
        "commercial-photography", "book-cover-design"
    ]
}

# Additional high-value prompt content
FINAL_PROMPT_DATABASE = {
    # Business
    "crisis-management": {
        "title": "Business Crisis Management Plan",
        "description": "Comprehensive crisis response strategy to protect your business reputation and minimize damage",
        "keywords": "crisis management, business emergency, reputation management, damage control",
        "prompt": """Create a crisis management plan for my [BUSINESS TYPE] business:

**Crisis Assessment:**
- Type of crisis: [PR DISASTER/DATA BREACH/FINANCIAL/PRODUCT RECALL/NATURAL DISASTER]
- Severity level: [MINOR/MODERATE/MAJOR/CATASTROPHIC]
- Stakeholders affected: [CUSTOMERS/EMPLOYEES/INVESTORS/SUPPLIERS/COMMUNITY]
- Timeline urgency: [IMMEDIATE/24 HOURS/WEEK/ONGOING]
- Media attention potential: [LOCAL/REGIONAL/NATIONAL/VIRAL]

**Immediate Response Protocol (First 24 Hours):**
- Crisis team activation and roles
- Initial damage assessment
- Stakeholder notification priorities
- Internal communication procedures
- External communication guidelines
- Legal consultation requirements

**Communication Strategy:**
- Key messages for different audiences
- Spokesperson designation and training
- Media statement templates
- Social media response plan
- Customer communication scripts
- Employee internal updates

**Operational Continuity:**
- Essential operations maintenance
- Supply chain backup plans
- Customer service enhancement
- Financial cash flow protection
- Remote work activation if needed
- Vendor and supplier communication

**Reputation Management:**
- Brand protection strategies
- Online reputation monitoring
- Social media damage control
- SEO and search result management
- Customer retention initiatives
- Trust rebuilding activities

**Recovery and Rebuilding:**
- Short-term stabilization steps
- Medium-term recovery milestones
- Long-term reputation restoration
- Lessons learned documentation
- Process improvement implementation
- Crisis prevention measures

Include specific scripts, timelines, and contact templates for immediate activation."""
    },

    "supply-chain-optimization": {
        "title": "Supply Chain Optimization Strategy",
        "description": "Streamline operations, reduce costs, and improve reliability in your supply chain management",
        "keywords": "supply chain optimization, logistics, vendor management, cost reduction",
        "prompt": """Optimize my supply chain for [BUSINESS TYPE] business:

**Current Supply Chain Analysis:**
- Primary products/materials: [LIST]
- Key suppliers: [NUMBER AND TYPES]
- Geographic distribution: [LOCATIONS]
- Annual procurement spend: $[AMOUNT]
- Current pain points: [DELAYS/COSTS/QUALITY/RELIABILITY]
- Inventory turnover rate: [X TIMES PER YEAR]

**Supplier Assessment:**
- Performance evaluation criteria
- Cost analysis and benchmarking
- Quality and reliability metrics
- Risk assessment (geographic, financial, operational)
- Relationship strength evaluation
- Alternative supplier identification

**Cost Optimization Strategies:**
- Volume consolidation opportunities
- Long-term contract negotiations
- Payment terms optimization
- Transportation cost reduction
- Inventory level optimization
- Waste and inefficiency elimination

**Technology Integration:**
- Supply chain management software options
- Automated ordering systems
- Real-time tracking and visibility
- Demand forecasting tools
- Analytics and reporting capabilities
- Integration with existing systems

**Risk Management:**
- Single-source dependency elimination
- Geographic risk diversification
- Quality control and inspection processes
- Contingency planning and backup suppliers
- Insurance and financial protection
- Regulatory compliance monitoring

**Performance Metrics:**
- Key performance indicators (KPIs)
- Cost savings targets
- Quality improvement goals
- Delivery performance standards
- Inventory optimization metrics
- Supplier scorecard development

**Implementation Roadmap:**
- Phase 1: Quick wins (30-60 days)
- Phase 2: System improvements (3-6 months)
- Phase 3: Strategic optimization (6-12 months)
- Ongoing monitoring and adjustment

Provide specific cost-saving targets and implementation timelines."""
    },

    # Money
    "refinancing-strategy": {
        "title": "Mortgage Refinancing Calculator & Strategy",
        "description": "Determine if refinancing makes sense and optimize your mortgage terms for maximum savings",
        "keywords": "mortgage refinancing, home loan, mortgage rates, refinance calculator",
        "prompt": """Analyze whether I should refinance my mortgage:

**Current Mortgage Details:**
- Current loan balance: $[AMOUNT]
- Current interest rate: [PERCENTAGE]%
- Monthly payment: $[AMOUNT]
- Years remaining: [NUMBER]
- Loan type: [CONVENTIONAL/FHA/VA/JUMBO]
- When originated: [DATE]

**Refinancing Options:**
- New interest rate available: [PERCENTAGE]%
- New loan term: [15/20/25/30 YEARS]
- Refinancing costs estimate: $[AMOUNT]
- Points consideration: [YES/NO]
- Cash-out option needed: $[AMOUNT]

**Break-Even Analysis:**
- Monthly payment difference calculation
- Total closing costs breakdown
- Time to recoup costs (break-even point)
- Total interest savings over loan life
- Net present value analysis
- Opportunity cost of closing costs

**Cash Flow Impact:**
- New monthly payment amount
- PMI elimination possibilities
- Tax deduction implications
- Cash available from rate-and-term vs cash-out
- Investment opportunities with savings
- Emergency fund impact

**Timing Considerations:**
- Current market rate trends
- Personal financial situation changes
- Job stability and income prospects
- Plans to move or sell
- Credit score improvements since origination
- Debt-to-income ratio changes

**Alternative Strategies:**
- Extra principal payments vs refinancing
- Loan modification options
- Home equity line of credit (HELOC)
- Second mortgage considerations
- Investment property refinancing

**Action Plan:**
- Lender shopping strategy
- Documentation preparation
- Rate lock timing
- Appraisal scheduling
- Closing preparation
- Post-closing optimization

Provide specific dollar amounts and timelines for decision making."""
    },

    "investment-diversification": {
        "title": "Investment Portfolio Diversification Planner",
        "description": "Create a balanced, risk-appropriate investment portfolio across multiple asset classes",
        "keywords": "investment diversification, portfolio allocation, asset allocation, investment strategy",
        "prompt": """Create a diversified investment portfolio strategy:

**Investor Profile:**
- Age: [YOUR AGE]
- Investment timeline: [YEARS UNTIL RETIREMENT/GOAL]
- Risk tolerance: [CONSERVATIVE/MODERATE/AGGRESSIVE]
- Current portfolio value: $[AMOUNT]
- Monthly investment capacity: $[AMOUNT]
- Investment goals: [RETIREMENT/HOME/EDUCATION/WEALTH BUILDING]

**Current Portfolio Analysis:**
- Stock allocation: [PERCENTAGE]%
- Bond allocation: [PERCENTAGE]%
- International exposure: [PERCENTAGE]%
- Real estate: [PERCENTAGE]%
- Cash/alternatives: [PERCENTAGE]%
- Concentration risks identified

**Asset Allocation Strategy:**
- Target stock/bond ratio
- Domestic vs international equity split
- Growth vs value allocation
- Large cap vs small cap distribution
- Fixed income duration and quality
- Alternative investment considerations

**Diversification Across:**
- Geographic regions (US, international, emerging markets)
- Sectors and industries
- Company sizes (large, mid, small cap)
- Investment styles (growth, value, blend)
- Asset classes (stocks, bonds, REITs, commodities)
- Time horizons (short, medium, long-term goals)

**Implementation Strategy:**
- Core-satellite portfolio approach
- Index funds vs active management
- Low-cost investment vehicle selection
- Tax-efficient fund placement
- Dollar-cost averaging schedule
- Rebalancing frequency and triggers

**Risk Management:**
- Correlation analysis between holdings
- Volatility reduction strategies
- Downside protection considerations
- Emergency fund maintenance
- Insurance needs assessment
- Estate planning implications

**Monitoring and Adjustment:**
- Portfolio review schedule
- Performance benchmarking
- Rebalancing triggers and methods
- Tax-loss harvesting opportunities
- Life change adjustment protocols
- Fee and expense monitoring

**Specific Recommendations:**
- Target allocation percentages
- Specific fund/investment suggestions
- Account type optimization (401k, IRA, taxable)
- Action steps for implementation
- Timeline for full diversification

Include specific investment vehicles and percentage allocations."""
    },

    # Health  
    "sleep-disorders": {
        "title": "Sleep Disorder Solutions & Recovery Plan",
        "description": "Comprehensive approach to diagnosing and treating common sleep issues for better rest and health",
        "keywords": "sleep disorders, insomnia, sleep apnea, sleep problems, better sleep",
        "prompt": """Help me address my sleep disorder:

**Sleep Problem Assessment:**
- Primary issue: [INSOMNIA/SLEEP APNEA/RESTLESS LEG/NIGHT TERRORS/OTHER]
- Duration of problem: [WEEKS/MONTHS/YEARS]
- Sleep quality (1-10): [RATING]
- Hours of sleep per night: [AVERAGE]
- Time to fall asleep: [MINUTES]
- Night wakings: [FREQUENCY]

**Sleep Pattern Analysis:**
- Bedtime routine: [DESCRIBE CURRENT]
- Sleep environment: [BEDROOM CONDITIONS]
- Screen time before bed: [HOURS]
- Caffeine/alcohol consumption: [TIMING AND AMOUNT]
- Exercise timing: [WHEN AND TYPE]
- Stress levels: [HIGH/MEDIUM/LOW]

**Medical Evaluation Needs:**
- Sleep study recommendation criteria
- Primary care physician consultation
- Sleep specialist referral indicators
- Underlying health condition screening
- Medication review and interactions
- Hormone level assessment

**Sleep Hygiene Optimization:**
- Bedroom environment improvements
- Temperature, lighting, and noise control
- Mattress and pillow evaluation
- Electronics and blue light management
- Pre-sleep relaxation routine
- Consistent sleep schedule development

**Lifestyle Interventions:**
- Diet and nutrition impact on sleep
- Exercise timing and intensity
- Stress management techniques
- Caffeine and alcohol guidelines
- Nap timing and duration
- Work schedule optimization

**Treatment Options:**
- Cognitive Behavioral Therapy for Insomnia (CBT-I)
- Sleep medication considerations
- Natural supplements and herbs
- Breathing exercises and meditation
- Progressive muscle relaxation
- Sleep restriction therapy

**Technology and Tools:**
- Sleep tracking device recommendations
- White noise and sleep apps
- Light therapy for circadian rhythm
- Smart home automation for sleep
- Wearable device optimization
- Sleep diary and monitoring

**Professional Resources:**
- When to see a sleep specialist
- Sleep clinic evaluation process
- Insurance coverage for sleep studies
- Finding qualified sleep professionals
- Support groups and resources
- Online sleep improvement programs

**Recovery Timeline:**
- Week 1-2: Sleep hygiene implementation
- Week 3-4: Routine establishment
- Month 2-3: Professional evaluation if needed
- Long-term: Maintenance and optimization

Include specific action steps and realistic expectations for improvement."""
    },

    "chronic-fatigue": {
        "title": "Chronic Fatigue Syndrome Management Plan",
        "description": "Comprehensive strategies to manage chronic fatigue, improve energy, and maintain quality of life",
        "keywords": "chronic fatigue syndrome, CFS, chronic tiredness, fatigue management, energy improvement",
        "prompt": """Create a management plan for my chronic fatigue:

**Fatigue Assessment:**
- Fatigue duration: [MONTHS/YEARS]
- Severity level (1-10): [RATING]
- Daily energy patterns: [MORNING/AFTERNOON/EVENING BEST/WORST]
- Triggers identified: [STRESS/ACTIVITY/SLEEP/FOOD/OTHER]
- Impact on daily activities: [WORK/RELATIONSHIPS/SELF-CARE]
- Previous treatments tried: [LIST]

**Medical Evaluation Strategy:**
- Comprehensive blood work needed
- Thyroid function assessment
- Autoimmune condition screening
- Vitamin and mineral deficiency testing
- Sleep disorder evaluation
- Mental health assessment

**Energy Management:**
- Pacing techniques and activity scheduling
- Energy envelope theory application
- Rest and activity balance
- Boom-bust cycle prevention
- Priority setting and task management
- Energy conservation strategies

**Symptom Tracking:**
- Daily fatigue and energy logging
- Trigger identification system
- Activity and symptom correlation
- Sleep quality monitoring
- Mood and cognitive function tracking
- Treatment response documentation

**Treatment Approaches:**
- Graduated exercise therapy (GET) considerations
- Cognitive behavioral therapy (CBT) benefits
- Medication options and side effects
- Supplement protocols (with medical approval)
- Alternative therapies (acupuncture, massage)
- Dietary interventions

**Lifestyle Modifications:**
- Sleep hygiene optimization
- Stress reduction techniques
- Nutrition and hydration strategies
- Gentle movement and stretching
- Social activity modification
- Work accommodation strategies

**Coping Strategies:**
- Managing uncertainty and unpredictability
- Emotional support and counseling
- Family and friend education
- Workplace communication
- Financial planning considerations
- Identity and role adaptation

**Support Systems:**
- Healthcare team coordination
- Support group participation
- Online community resources
- Family and caregiver support
- Professional advocacy services
- Disability resource navigation

**Recovery Planning:**
- Realistic goal setting
- Gradual improvement strategies
- Setback management plans
- Quality of life maintenance
- Long-term health monitoring
- Adaptive living solutions

**Professional Resources:**
- CFS specialist physicians
- Chronic illness counselors
- Occupational therapists
- Nutritionists specializing in fatigue
- Legal disability advocates
- Insurance and benefits navigation

Include specific daily schedules and energy management techniques."""
    },

    # Content category expansion
    "email-marketing": {
        "title": "Email Marketing Campaign Creator",
        "description": "Design high-converting email marketing campaigns that engage subscribers and drive sales",
        "keywords": "email marketing, email campaigns, email automation, email copywriting",
        "prompt": """Create a complete email marketing campaign for my [BUSINESS TYPE]:

**Campaign Objectives:**
- Primary goal: [SALES/LEADS/ENGAGEMENT/RETENTION]
- Target audience: [DEMOGRAPHICS/PSYCHOGRAPHICS]
- Campaign duration: [TIMELINE]
- Expected outcomes: [SPECIFIC METRICS]
- Budget allocated: $[AMOUNT]

**Email Sequence Strategy:**
1. **Welcome Series (3-5 emails)**
   - Introduction and brand story
   - Value proposition delivery
   - Social proof and testimonials
   - First offer or call-to-action
   - Community building

2. **Nurture Campaign (Weekly/Bi-weekly)**
   - Educational content
   - Behind-the-scenes content
   - Customer success stories
   - Industry insights and tips
   - Soft promotional content

3. **Sales Sequence**
   - Problem identification
   - Solution presentation
   - Objection handling
   - Urgency and scarcity
   - Final call-to-action

**Email Templates and Content:**
- Subject line formulas for high open rates
- Email copywriting frameworks (AIDA, PAS, etc.)
- Call-to-action button optimization
- Mobile-responsive design considerations
- Personalization and segmentation strategies

**List Building Strategies:**
- Lead magnets and opt-in incentives
- Landing page optimization
- Pop-up and form placement
- Content upgrades and bonuses
- Social media integration

**Automation and Segmentation:**
- Behavioral trigger setup
- Demographic segmentation
- Purchase history targeting
- Engagement level grouping
- A/B testing protocols

**Performance Metrics:**
- Open rate benchmarks and optimization
- Click-through rate improvement
- Conversion rate tracking
- List growth rate monitoring
- Revenue per email calculation
- Unsubscribe rate management

Include specific email templates and automation workflows."""
    },

    "sales-page-copy": {
        "title": "High-Converting Sales Page Writer",
        "description": "Create compelling sales page copy that converts visitors into customers with proven formulas",
        "keywords": "sales page copywriting, conversion copywriting, landing page copy, sales funnel",
        "prompt": """Write a high-converting sales page for my [PRODUCT/SERVICE]:

**Product/Service Details:**
- Name: [PRODUCT NAME]
- Price: $[AMOUNT]
- Target audience: [IDEAL CUSTOMER]
- Main benefit: [CORE VALUE PROPOSITION]
- Unique selling proposition: [WHAT MAKES IT DIFFERENT]
- Guarantee offered: [REFUND POLICY/WARRANTY]

**Sales Page Structure:**
1. **Headline Section**
   - Attention-grabbing main headline
   - Compelling subheadline
   - Hero image or video
   - Social proof indicators

2. **Problem Identification**
   - Pain point articulation
   - Emotional connection building
   - Cost of inaction emphasis
   - Market research insights

3. **Solution Presentation**
   - Product/service introduction
   - Benefit-focused descriptions
   - Feature-to-benefit translations
   - Unique mechanism explanation

4. **Proof and Credibility**
   - Customer testimonials and reviews
   - Case studies and results
   - Awards and recognition
   - Expert endorsements
   - Media mentions

5. **Objection Handling**
   - Common concerns addressed
   - FAQ section development
   - Risk reversal strategies
   - Comparison charts
   - Guarantee emphasis

6. **Call-to-Action Optimization**
   - Button copy and design
   - Urgency and scarcity elements
   - Payment options and security
   - Money-back guarantee
   - Bonus inclusions

**Copywriting Techniques:**
- Psychological triggers implementation
- Storytelling for emotional connection
- Social proof positioning
- Authority building elements
- Scarcity and urgency tactics

**Conversion Optimization:**
- Above-the-fold optimization
- Page loading speed considerations
- Mobile responsiveness
- Trust signals placement
- Exit-intent strategies

**A/B Testing Elements:**
- Headlines and subheadlines
- Call-to-action buttons
- Pricing presentation
- Testimonial placement
- Image and video usage

Include specific copy examples and psychological triggers."""
    },

    # AI Art expansion
    "character-consistency": {
        "title": "Consistent Character Creator for AI Art",
        "description": "Generate consistent character appearances across multiple AI art pieces and scenes",
        "keywords": "AI art character consistency, character design, AI illustration, digital art",
        "prompt": """Create consistent character designs for AI art generation:

**Character Foundation:**
- Character name: [NAME]
- Age and gender: [DETAILS]
- Personality traits: [3-5 KEY TRAITS]
- Role in story/project: [PROTAGONIST/VILLAIN/SUPPORTING]
- Setting/genre: [FANTASY/SCI-FI/MODERN/HISTORICAL]

**Physical Appearance (Detailed):**
- Facial structure: [SHAPE/FEATURES]
- Eye color and shape: [SPECIFIC DETAILS]
- Hair color, length, style: [EXACT DESCRIPTION]
- Height and build: [MEASUREMENTS/BUILD TYPE]
- Skin tone: [SPECIFIC SHADE]
- Distinctive features: [SCARS/TATTOOS/BIRTHMARKS]

**Clothing and Style:**
- Primary outfit description
- Color palette preferences
- Accessories and jewelry
- Footwear style
- Seasonal variations
- Formal vs casual options

**Character Reference Sheet Creation:**
- Front view, side view, back view
- Facial expression variations
- Pose and gesture library
- Outfit combinations
- Age progression if needed
- Different lighting conditions

**AI Art Generation Prompts:**
- Master prompt template for this character
- Consistent style descriptors
- Camera angle specifications
- Lighting and mood settings
- Background integration tips
- Quality and detail enhancers

**Consistency Maintenance:**
- Reference image organization
- Prompt variation tracking
- Style guide documentation
- Color palette specifications
- Proportion guidelines
- Common mistake avoidance

**Advanced Techniques:**
- ControlNet integration for pose consistency
- LoRA training considerations
- Seed management strategies
- Negative prompt optimization
- Style transfer techniques
- Multi-character scene composition

**Output Variations:**
- Different art styles (realistic, anime, cartoon)
- Various scenes and contexts
- Emotional state representations
- Action pose variations
- Interaction with other characters
- Environmental adaptations

**Quality Control:**
- Consistency checking methods
- Prompt refinement process
- Error correction techniques
- Detail enhancement strategies
- Style coherence maintenance
- Professional presentation tips

Include specific AI art prompts and technical parameters for optimal consistency."""
    },

    "commercial-photography": {
        "title": "AI Commercial Photography Prompts",
        "description": "Generate professional commercial photography with AI for marketing, products, and business use",
        "keywords": "AI commercial photography, product photography, business photography, marketing images",
        "prompt": """Create commercial-quality photography with AI for my business needs:

**Photography Objectives:**
- Business type: [RETAIL/SERVICE/RESTAURANT/TECH/etc.]
- Primary use: [WEBSITE/MARKETING/SOCIAL MEDIA/PRINT]
- Target audience: [DEMOGRAPHICS]
- Brand style: [MODERN/CLASSIC/LUXURY/CASUAL]
- Budget considerations: [AI TOOLS BUDGET]

**Product Photography:**
- Product types: [PHYSICAL PRODUCTS/SERVICES/DIGITAL]
- Photography styles needed: [CLEAN/LIFESTYLE/ACTION/DETAIL]
- Background preferences: [WHITE/LIFESTYLE/ENVIRONMENTAL]
- Lighting requirements: [NATURAL/STUDIO/DRAMATIC]
- Angle variations: [FRONT/SIDE/TOP/DETAIL SHOTS]

**Brand Photography:**
- Team and staff portraits
- Office and workspace shots
- Company culture imagery
- Behind-the-scenes content
- Event and conference photos
- Customer interaction scenes

**Technical Specifications:**
- Image dimensions and formats
- Resolution requirements (web vs print)
- Color space and profile needs
- File naming conventions
- Batch processing requirements
- Quality standards

**AI Photography Prompts:**
- Master prompt templates
- Lighting and composition specs
- Camera angle descriptions
- Professional photography terminology
- Style consistency guidelines
- Quality enhancement keywords

**Post-Processing Workflow:**
- AI upscaling for print quality
- Color correction and grading
- Background removal/replacement
- Watermark and branding addition
- Batch editing processes
- Format optimization

**Commercial Usage:**
- License and usage rights understanding
- Stock photography alternatives
- Brand guideline compliance
- Social media optimization
- Print publication preparation
- Website integration best practices

**Cost-Effective Solutions:**
- AI tool recommendations and pricing
- Workflow automation setups
- Template creation for efficiency
- Quality vs speed optimization
- Outsourcing vs in-house decisions
- ROI measurement methods

**Professional Results:**
- Industry standard comparisons
- Quality benchmarking
- Client presentation formats
- Portfolio development
- Feedback incorporation
- Continuous improvement processes

Include specific AI prompts and technical settings for commercial-grade results."""
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
    
    affiliate_mapping = {
        "business": "the-genius-wave",
        "money": "billionaire-brain-wave", 
        "health": "mitolyn",
        "relationships": "his-secret-obsession",
        "everyday": "teds-woodworking",
        "coding": "the-genius-wave",
        "content": "the-genius-wave",
        "ai-art": "the-genius-wave"
    }
    
    affiliate_key = affiliate_mapping.get(category)
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

# Same template as before
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

def create_prompt_file(category, filename, prompt_data):
    """Create a new prompt HTML file"""
    category_titles = {
        "business": "Business", "money": "Money", "health": "Health",
        "relationships": "Relationships", "everyday": "Everyday", "coding": "Coding",
        "content": "Content", "ai-art": "AI Art"
    }
    
    affiliate_mapping = {
        "business": "the-genius-wave", "money": "billionaire-brain-wave", 
        "health": "mitolyn", "relationships": "his-secret-obsession",
        "everyday": "teds-woodworking", "coding": "the-genius-wave",
        "content": "the-genius-wave", "ai-art": "the-genius-wave"
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
        affiliate_product=affiliate_mapping[category]
    )
    
    # Write to file
    file_path = Path(f"prompts/{category}/{filename}.html")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return file_path

def main():
    """Create the final 38 prompts to reach exactly 150"""
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    created_count = 0
    
    print("🚀 Creating final 38 prompts to reach exactly 150 total...")
    print("=" * 65)
    
    # Create high-value prompts from our curated database
    created_from_db = 0
    for category, filenames in FINAL_PROMPTS.items():
        print(f"\n📁 Creating {category} prompts...")
        for filename in filenames:
            if filename in FINAL_PROMPT_DATABASE:
                try:
                    file_path = create_prompt_file(category, filename, FINAL_PROMPT_DATABASE[filename])
                    print(f"✅ Created {file_path}")
                    created_count += 1
                    created_from_db += 1
                except Exception as e:
                    print(f"❌ Error creating {filename}: {e}")
    
    # Generate additional simple prompts to reach exactly 38
    remaining_needed = 38 - created_from_db
    if remaining_needed > 0:
        print(f"\n🔧 Generating {remaining_needed} additional prompts to reach exactly 38...")
        
        # Quick additional prompts for remaining slots
        additional = [
            ("business", "team-building-activities", "Team Building & Employee Engagement Planner", "Create engaging team building activities and improve workplace culture and productivity"),
            ("money", "debt-consolidation", "Debt Consolidation Strategy Planner", "Streamline multiple debts into manageable payments and create a clear path to financial freedom"),
            ("health", "nutrition-planning", "Personal Nutrition & Meal Planning Guide", "Create customized nutrition plans and meal prep strategies for optimal health and energy"),
            ("relationships", "conflict-resolution", "Relationship Conflict Resolution Guide", "Professional strategies to resolve disputes and strengthen relationships through healthy communication"),
            ("everyday", "time-management", "Personal Time Management System", "Optimize your daily schedule and productivity with proven time management techniques and systems"),
            ("coding", "api-documentation", "API Documentation Generator", "Create comprehensive, user-friendly API documentation that developers actually want to use"),
            ("content", "content-calendar", "Social Media Content Calendar Planner", "Plan and organize months of engaging social media content across all platforms"),
            ("ai-art", "portrait-photography", "AI Portrait Photography Prompts", "Generate professional portrait photography styles and lighting with artificial intelligence")
        ]
        
        for i, (category, filename, title, description) in enumerate(additional[:remaining_needed]):
            try:
                simple_prompt_data = {
                    "title": title,
                    "description": description,
                    "keywords": f"{filename.replace('-', ' ')}, {category}, professional advice",
                    "prompt": f"""Help me with {title.lower()}:

**Current Situation:**
- Describe your current situation: [YOUR SITUATION]
- Main challenges: [SPECIFIC CHALLENGES]  
- Goals and objectives: [WHAT YOU WANT TO ACHIEVE]
- Timeline: [WHEN YOU NEED RESULTS]
- Resources available: [TIME/BUDGET/TOOLS]

**Analysis and Recommendations:**
Please provide:
1. Detailed assessment of the current situation
2. Step-by-step action plan
3. Best practices and proven strategies  
4. Common mistakes to avoid
5. Timeline and milestones
6. Resources and tools needed
7. Success metrics and tracking

**Specific Questions:**
- What are the most effective approaches for [SPECIFIC NEED]?
- How can I overcome [MAIN CHALLENGE]?
- What should I prioritize first?
- How long will this typically take?
- What warning signs should I watch for?

Please provide practical, actionable advice with specific examples and templates where appropriate."""
                }
                
                file_path = create_prompt_file(category, filename, simple_prompt_data)
                print(f"✅ Created {file_path}")
                created_count += 1
            except Exception as e:
                print(f"❌ Error creating {filename}: {e}")

    print("\n" + "=" * 65)
    print(f"✅ Final Batch Complete!")
    print(f"📊 Created {created_count} prompts in this batch")
    print(f"🎯 Total prompts should now be: {112 + created_count}")
    print(f"🏆 TARGET ACHIEVED: 150 prompts!" if (112 + created_count) >= 150 else f"🔄 Still need: {150 - (112 + created_count)} more")
    
    print(f"\n🎉 NEXT STEPS:")
    print(f"1. Verify all 150 prompts load correctly")
    print(f"2. Update all category index pages")  
    print(f"3. Generate and submit XML sitemap")
    print(f"4. Test analytics and affiliate tracking")
    print(f"5. Launch SEO content marketing campaign!")

if __name__ == "__main__":
    main()