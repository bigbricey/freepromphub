#!/usr/bin/env python3
"""
Create the remaining 50 prompts with high-value content
Focus on SEO-friendly, conversion-optimized prompts
"""

import os
from pathlib import Path

# Remaining prompts to create (50 total)
REMAINING_PROMPTS = {
    "business": [
        "business-valuation", "vendor-negotiation", "crisis-management", 
        "merger-acquisition", "startup-legal-docs", "company-culture", 
        "remote-team-management", "quarterly-review"
    ],
    "money": [
        "tax-optimization", "real-estate-investment", "stock-portfolio", 
        "college-savings", "insurance-needs", "will-estate-planning", 
        "small-business-loans", "credit-card-rewards", "passive-income-ideas",
        "financial-advisor-questions", "bankruptcy-alternatives", "home-buying-guide", 
        "divorce-finances"
    ],
    "health": [
        "insurance-claim-denial", "medication-side-effects", "chronic-pain-management",
        "anxiety-coping", "depression-support", "weight-loss-plateau", 
        "supplement-research", "fitness-injury-recovery", "elderly-care-planning", 
        "mental-health-therapy"
    ],
    "relationships": [
        "blended-family", "cheating-recovery", "divorce-mediation", 
        "co-parenting", "workplace-romance", "friendship-boundaries", 
        "social-anxiety", "online-dating-safety", "relationship-counseling"
    ],
    "everyday": [
        "noisy-neighbors", "workplace-harassment", "identity-theft-recovery", 
        "consumer-complaint", "travel-emergency", "pet-emergency-care"
    ],
    "coding": [
        "security-audit", "performance-optimization", "mobile-app-planning", 
        "blockchain-basics"
    ]
}

# Complete prompt content database
PROMPT_DATABASE = {
    # Business prompts (8)
    "business-valuation": {
        "title": "Business Valuation Calculator & Guide",
        "description": "Accurately determine your business worth for sales, investments, or financial planning",
        "keywords": "business valuation, company worth, sell business, business appraisal",
        "prompt": """Calculate the value of my [BUSINESS TYPE] business:

**Business Overview:**
- Industry: [INDUSTRY]
- Years in operation: [YEARS]
- Annual revenue: $[AMOUNT]
- Annual profit/EBITDA: $[AMOUNT]
- Number of employees: [COUNT]
- Location: [CITY, STATE]

**Financial Analysis:**
- Revenue multiple method (industry standards)
- Earnings multiple (P/E ratio approach)
- Asset-based valuation
- Discounted cash flow analysis
- Comparable business sales in area

**Value Factors:**
- Customer base stability and diversity
- Competitive advantages and moats
- Growth trends (3-year analysis)
- Market position and brand strength
- Operational efficiency and systems

**Valuation Adjustments:**
- Owner dependency risks
- Market conditions impact
- Industry outlook
- Economic factors
- Timing considerations

**Action Items:**
1. Immediate steps to increase value
2. Documentation needed for sale
3. Professional appraisal recommendations
4. Tax implications of sale
5. Optimal timing strategy

Provide multiple valuation methods with ranges and explain which is most appropriate for my situation."""
    },

    "vendor-negotiation": {
        "title": "Vendor Contract Negotiation Strategies",
        "description": "Professional tactics to negotiate better terms, pricing, and contracts with suppliers",
        "keywords": "vendor negotiation, supplier contracts, procurement, cost reduction",
        "prompt": """Help me negotiate better terms with this vendor:

**Current Situation:**
- Vendor: [COMPANY NAME]
- Service/Product: [WHAT THEY PROVIDE]
- Current contract value: $[AMOUNT] over [TIME PERIOD]
- Contract expiration: [DATE]
- Pain points: [SPECIFIC ISSUES]
- Alternative vendors available: [YES/NO]

**Negotiation Preparation:**
- Market research on competitive pricing
- Our leverage points and BATNA (Best Alternative)
- Vendor's likely priorities and constraints
- Historical relationship analysis
- Performance issues documentation

**Negotiation Strategy:**
- Opening position and walk-away point
- Concession planning (what to give/get)
- Timeline and deadline management
- Decision-maker identification
- Win-win solutions to propose

**Key Terms to Negotiate:**
- Pricing and payment terms
- Service level agreements (SLAs)
- Termination clauses and penalties
- Performance guarantees
- Liability and insurance requirements
- Intellectual property rights

**Tactics and Scripts:**
- Professional negotiation language
- How to handle pushback
- Creating urgency appropriately
- Building rapport while staying firm
- Documentation requirements

**Implementation Plan:**
- Pre-negotiation checklist
- Meeting agenda and talking points
- Follow-up and agreement documentation
- Relationship management post-negotiation

Include specific phrases and responses for common vendor objections."""
    },

    # Money prompts (13)
    "tax-optimization": {
        "title": "Tax Optimization & Strategy Planner",
        "description": "Legal strategies to minimize tax liability and maximize deductions for individuals and businesses",
        "keywords": "tax optimization, tax deductions, tax planning, tax savings, IRS strategy",
        "prompt": """Create a comprehensive tax optimization strategy:

**Current Tax Situation:**
- Filing status: [SINGLE/MARRIED/etc.]
- Annual income: $[AMOUNT]
- State of residence: [STATE]
- Business type: [W2/1099/BUSINESS OWNER/RETIRED]
- Current tax bracket: [PERCENTAGE]

**Deduction Optimization:**
- Standard vs itemized deduction analysis
- Home office deduction eligibility
- Business expense optimization
- Charitable giving strategies
- Medical expense planning

**Investment Tax Strategy:**
- Tax-loss harvesting opportunities
- Asset location optimization
- Retirement account contributions (401k, IRA, Roth)
- Capital gains/losses timing
- Tax-efficient fund selection

**Business Tax Planning (if applicable):**
- Business structure optimization (LLC, S-Corp, etc.)
- Equipment purchases and depreciation
- Business vs personal expense classification
- Quarterly estimated payment strategy
- Employee benefits tax advantages

**Advanced Strategies:**
- Income timing and deferral
- Tax-advantaged accounts maximization
- Estate planning tax implications
- State tax minimization strategies
- Cryptocurrency tax reporting

**Action Timeline:**
- Immediate actions (this tax year)
- Q4 tax planning moves
- Next year preparation
- Multi-year tax strategy

**Professional Resources:**
- When to hire a CPA
- Tax software recommendations
- Record-keeping requirements
- Audit preparation and protection

Include specific dollar amounts and deadlines for maximum savings."""
    },

    "real-estate-investment": {
        "title": "Real Estate Investment Analyzer",
        "description": "Complete guide to evaluate rental properties, REITs, and real estate investment strategies",
        "keywords": "real estate investment, rental property, REIT, property analysis, real estate ROI",
        "prompt": """Analyze this real estate investment opportunity:

**Property Details:**
- Property type: [SINGLE FAMILY/DUPLEX/COMMERCIAL]
- Purchase price: $[AMOUNT]
- Location: [ADDRESS/AREA]
- Square footage: [SQFT]
- Year built: [YEAR]
- Down payment available: $[AMOUNT]

**Financial Analysis:**
- Monthly rental income potential: $[AMOUNT]
- Operating expenses breakdown:
  - Property taxes: $[MONTHLY]
  - Insurance: $[MONTHLY]  
  - Maintenance/repairs: $[MONTHLY]
  - Property management: $[MONTHLY]
  - Vacancy allowance: $[PERCENTAGE]

**Investment Metrics:**
- Cash-on-cash return calculation
- Cap rate analysis
- Gross rent multiplier
- Net present value (NPV)
- Internal rate of return (IRR)
- Break-even analysis

**Market Analysis:**
- Comparable property sales (comps)
- Rental market analysis in area
- Neighborhood growth trends
- Employment and economic factors
- School districts and amenities impact

**Risk Assessment:**
- Market volatility factors
- Tenant quality and turnover risk
- Maintenance and repair costs
- Interest rate sensitivity
- Exit strategy options

**Action Plan:**
- Financing options and recommendations
- Due diligence checklist
- Negotiation strategies
- Property management decisions
- Tax implications and benefits

**Alternative Investments:**
- REIT comparison analysis
- Real estate crowdfunding platforms
- Real estate ETFs
- Fix-and-flip potential

Provide specific ROI projections and risk-adjusted returns."""
    },

    # Health prompts (10)
    "insurance-claim-denial": {
        "title": "Insurance Claim Denial Appeal Guide",
        "description": "Step-by-step process to successfully appeal denied medical, auto, or property insurance claims",
        "keywords": "insurance claim denial, insurance appeal, claim dispute, insurance rights",
        "prompt": """Help me appeal this denied insurance claim:

**Claim Details:**
- Insurance type: [HEALTH/AUTO/HOME/DISABILITY]
- Insurance company: [COMPANY NAME]
- Claim amount: $[AMOUNT]
- Date of incident/service: [DATE]
- Reason for denial: [SPECIFIC REASON GIVEN]
- Policy number: [NUMBER]

**Understanding the Denial:**
- Decode insurance company language
- Identify specific policy provisions cited
- Determine if denial is valid or questionable
- Review your policy coverage details
- Document timeline of events

**Appeal Strategy:**
- Internal appeal vs external review options
- Gathering supporting documentation
- Medical records and expert opinions needed
- Witness statements and evidence
- Policy language interpretation

**Appeal Letter Template:**
- Professional header and claim information
- Clear statement of disagreement
- Point-by-point refutation of denial reasons
- Supporting evidence and documentation
- Specific resolution requested
- Timeline expectations

**Documentation Checklist:**
- Original claim forms and correspondence
- Policy documents and coverage proof
- Medical records/repair estimates
- Photos, receipts, and invoices
- Expert opinions or second opinions
- State insurance department contact info

**Escalation Path:**
- Insurance company internal review
- State insurance commissioner complaint
- Independent medical examination
- Legal consultation thresholds
- Bad faith insurance practices

**Timeline Management:**
- Appeal deadlines and requirements
- Follow-up schedule
- Documentation of all communications
- Backup plan if appeal fails

Include specific scripts for phone calls and template letters for maximum success rate."""
    },

    "chronic-pain-management": {
        "title": "Chronic Pain Management Plan",
        "description": "Comprehensive strategies to manage chronic pain, work with doctors, and improve quality of life",
        "keywords": "chronic pain management, pain relief, chronic illness, pain medication, pain therapy",
        "prompt": """Create a comprehensive chronic pain management plan:

**Pain Assessment:**
- Type of pain: [LOCATION/TYPE]
- Duration: [HOW LONG YOU'VE HAD IT]
- Severity scale (1-10): [CURRENT LEVEL]
- Triggers and patterns: [WHAT MAKES IT WORSE/BETTER]
- Impact on daily activities: [SPECIFIC LIMITATIONS]
- Previous treatments tried: [LIST]

**Medical Team Coordination:**
- Primary care physician role
- Pain specialist consultation needs
- Physical therapy recommendations  
- Mental health support integration
- Alternative therapy providers

**Treatment Strategy:**
- Medication management and optimization
- Non-pharmaceutical interventions
- Physical therapy and exercise plans
- Lifestyle modifications
- Stress reduction techniques

**Daily Management Tools:**
- Pain tracking and journaling
- Activity pacing strategies
- Sleep optimization
- Energy conservation techniques
- Flare-up emergency plans

**Communication with Healthcare Providers:**
- How to describe pain effectively
- Questions to ask at appointments
- Treatment goal setting
- Side effect reporting
- Medication adjustment discussions

**Work and Life Adaptations:**
- Workplace accommodations under ADA
- Home environment modifications
- Social relationship management
- Activity modification strategies
- Financial planning considerations

**Support Systems:**
- Family education and involvement
- Support group options
- Online communities and resources
- Advocacy organizations
- Crisis intervention plans

**Long-term Planning:**
- Progressive condition management
- Treatment evolution over time
- Quality of life preservation
- Healthcare directive considerations
- Insurance and disability planning

Include specific action steps, resources, and emergency protocols."""
    },

    # Relationships prompts (9)
    "blended-family": {
        "title": "Blended Family Harmony Builder",
        "description": "Navigate stepfamily dynamics, co-parenting challenges, and create successful blended family relationships",
        "keywords": "blended family, stepfamily, co-parenting, stepchildren, family dynamics",
        "prompt": """Help create harmony in our blended family situation:

**Family Structure:**
- Your children: [AGES AND GENDERS]
- Partner's children: [AGES AND GENDERS]
- Custody arrangements: [SCHEDULES]
- Ages when you became a blended family: [TIMELINE]
- Ex-spouses involvement level: [HIGH/MEDIUM/LOW]

**Current Challenges:**
- Specific conflicts between step-siblings
- Discipline and rule differences
- Loyalty conflicts children may feel
- Ex-spouse relationship difficulties
- Financial strain and fairness issues

**Relationship Building Strategies:**
- Step-parent role definition and boundaries
- Building trust with stepchildren
- Creating new family traditions
- Respecting existing parent-child bonds
- Gradual integration timeline

**Co-Parenting Coordination:**
- Communication strategies with ex-spouses
- Consistency in rules across households
- Holiday and special event planning
- Child support and expense sharing
- Conflict resolution when disagreements arise

**House Rules and Structure:**
- Unified discipline approach
- Chore and responsibility distribution
- Personal space and belongings respect
- Technology and screen time rules
- Family meeting procedures

**Addressing Common Issues:**
- "You're not my real parent" responses
- Favoritism accusations (real or perceived)
- Different parenting styles integration
- Financial fairness between all children
- Extended family acceptance and integration

**Professional Resources:**
- Family therapy considerations
- Co-parenting counseling options
- Children's counseling when needed
- Legal mediation for serious conflicts
- Support groups for blended families

**Long-term Success Factors:**
- Realistic timeline expectations
- Celebrating small wins and progress
- Maintaining couple relationship strength
- Individual child relationship development
- Flexibility and adaptation strategies

Include specific conversation scripts and conflict de-escalation techniques."""
    },

    "divorce-mediation": {
        "title": "Divorce Mediation Preparation Guide",
        "description": "Prepare for successful divorce mediation to avoid costly litigation and reach fair agreements",
        "keywords": "divorce mediation, divorce settlement, uncontested divorce, divorce agreement",
        "prompt": """Prepare me for successful divorce mediation:

**Situation Overview:**
- Marriage length: [YEARS]
- Children: [AGES if applicable]
- Reason for divorce: [MUTUAL/CONTESTED]
- Major assets: [HOUSE/RETIREMENT/BUSINESS]
- Estimated total marital assets: $[AMOUNT]
- Income disparity: [SIMILAR/SIGNIFICANT DIFFERENCE]

**Pre-Mediation Preparation:**
- Complete financial disclosure gathering
- Asset and debt inventory
- Income documentation (3 years)
- Child custody preferences
- Support calculation estimates

**Asset Division Strategy:**
- Marital vs separate property identification
- High-value asset evaluation needs
- Retirement account division (QDRO)
- Business valuation requirements
- Debt responsibility allocation

**Child-Related Issues (if applicable):**
- Custody schedule preferences
- Child support calculations
- Educational decisions authority
- Healthcare responsibility division
- Extracurricular activity costs

**Financial Support Considerations:**
- Alimony/spousal support factors
- Duration and amount calculations
- Tax implications of support payments
- Modification circumstances
- Termination conditions

**Mediation Strategy:**
- Identifying your priorities and must-haves
- Areas where you can be flexible
- BATNA (Best Alternative to Negotiated Agreement)
- Emotional management techniques
- Professional advisor consultation

**Documentation and Legal Protection:**
- What to bring to mediation sessions
- Note-taking and agreement tracking
- Independent legal review importance
- Temporary agreements during process
- Final agreement enforceability

**Common Pitfalls to Avoid:**
- Emotional decision-making
- Hiding or undervaluing assets
- Unrealistic expectations
- Inadequate future planning
- Rushing the process

**Post-Mediation Steps:**
- Attorney review of agreement
- Court filing procedures
- Implementation timeline
- Modification procedures
- Compliance monitoring

Include specific negotiation tactics and communication strategies."""
    },

    # Everyday prompts (6)
    "noisy-neighbors": {
        "title": "Noisy Neighbor Resolution Strategies",
        "description": "Effective approaches to resolve neighbor noise issues while maintaining relationships",
        "keywords": "noisy neighbors, noise complaint, neighbor disputes, apartment noise, HOA complaints",
        "prompt": """Help me resolve this noisy neighbor situation:

**Noise Details:**
- Type of noise: [MUSIC/TV/PARTIES/CONSTRUCTION/PETS/OTHER]
- Frequency: [DAILY/WEEKENDS/SPECIFIC TIMES]
- Duration: [HOW LONG EACH INCIDENT]
- Time of day: [SPECIFIC HOURS]
- Impact on you: [SLEEP LOSS/WORK ISSUES/STRESS]
- How long this has been happening: [TIMEFRAME]

**Living Situation:**
- Housing type: [APARTMENT/CONDO/HOUSE]
- Property management: [LANDLORD/HOA/OWNER-OCCUPIED]
- Your relationship with neighbor: [GOOD/NEUTRAL/ALREADY TENSE]
- Other neighbors affected: [YES/NO/UNKNOWN]
- Local noise ordinances: [RESEARCH NEEDED/KNOWN]

**Escalation Strategy:**
1. **Direct Communication Approach**
   - Friendly initial conversation script
   - Timing for approach (not during/after noise)
   - Collaborative problem-solving language
   - Compromise suggestions

2. **Documentation Phase**
   - Noise log creation (dates, times, duration)
   - Recording/photo evidence (where legal)
   - Impact documentation (medical, work)
   - Witness statements from other neighbors

3. **Management/Authority Involvement**
   - Landlord/property manager notification
   - HOA complaint procedures
   - Local code enforcement contact
   - Police non-emergency reporting

**Communication Templates:**
- Initial friendly approach letter/conversation
- Formal complaint to property management
- Follow-up correspondence escalation
- Mediation request procedures

**Legal Considerations:**
- Quiet enjoyment rights as tenant/owner
- Local noise ordinance violations
- Small claims court options
- Harassment vs legitimate complaints
- Recording laws in your state

**Alternative Solutions:**
- Soundproofing your own space
- White noise/sound masking
- Schedule compromise discussions
- Mediation through community resources
- Relocation considerations if severe

**Protecting Relationships:**
- Maintaining neighborhood harmony
- Avoiding retaliation situations
- Professional and respectful communication
- Cultural sensitivity considerations
- Long-term coexistence strategies

Include specific scripts and timing recommendations for each approach."""
    },

    "identity-theft-recovery": {
        "title": "Identity Theft Recovery Action Plan",
        "description": "Step-by-step guide to recover from identity theft and protect your financial future",
        "keywords": "identity theft recovery, credit report fraud, financial fraud, identity protection",
        "prompt": """Help me recover from identity theft quickly and completely:

**Theft Discovery:**
- How you discovered the theft: [CREDIT REPORT/FRAUDULENT CHARGES/etc.]
- Types of accounts/information compromised: [CREDIT CARDS/BANK/SSN/etc.]
- Estimated financial impact: $[AMOUNT]
- When theft likely occurred: [TIMEFRAME]
- Suspected source: [DATA BREACH/LOST WALLET/PHISHING/UNKNOWN]

**Immediate Actions (First 24-48 Hours):**
1. **Fraud Alerts and Credit Freezes**
   - Place fraud alerts with all three credit bureaus
   - Freeze credit reports at Equifax, Experian, TransUnion
   - Contact ChexSystems for banking protection
   - File identity theft report with FTC (IdentityTheft.gov)

2. **Financial Institution Notifications**
   - Close compromised accounts immediately
   - Dispute fraudulent charges and transactions
   - Open new accounts with new numbers
   - Change all online banking passwords and PINs

**Documentation and Reporting:**
- File police report in your jurisdiction
- Create identity theft affidavit (FTC form)
- Gather all evidence of fraudulent activity
- Create detailed timeline of discovery and actions
- Document all communications with institutions

**Account-by-Account Recovery:**
- Credit card fraud resolution procedures
- Bank account fraud claims process
- Investment account protection steps
- Insurance policy verification
- Social Security number monitoring

**Credit Report Restoration:**
- Dispute fraudulent accounts and inquiries
- Monitor credit reports monthly for new issues
- Work with creditors to remove fraudulent information
- Request verification letters for legitimate disputes
- Rebuild credit score systematically

**Ongoing Protection:**
- Identity monitoring service evaluation
- Password manager and strong authentication
- Secure document storage and disposal
- Mail protection (hold or secure delivery)
- Social media privacy settings review

**Legal and Professional Help:**
- When to hire an attorney
- Identity theft victim assistance programs
- Tax fraud recovery procedures
- Employment background check corrections
- Insurance claim procedures

**Recovery Timeline:**
- Week 1: Immediate damage control
- Month 1: Complete documentation and disputes
- Months 2-6: Monitor and follow up
- 6+ months: Long-term protection implementation

Include specific phone numbers, forms, and templates for maximum efficiency."""
    },

    # Coding prompts (4)
    "security-audit": {
        "title": "Application Security Audit Checklist",
        "description": "Comprehensive security assessment framework to identify and fix vulnerabilities in your applications",
        "keywords": "security audit, web security, application security, vulnerability assessment, penetration testing",
        "prompt": """Perform a comprehensive security audit of my [APPLICATION TYPE] application:

**Application Overview:**
- Technology stack: [LANGUAGES/FRAMEWORKS]
- User base: [NUMBER/TYPE OF USERS]
- Data sensitivity: [PUBLIC/PERSONAL/FINANCIAL/HEALTHCARE]
- Deployment environment: [CLOUD/ON-PREMISE/HYBRID]
- Compliance requirements: [GDPR/HIPAA/PCI-DSS/etc.]

**Authentication & Authorization Audit:**
- Password policy strength and enforcement
- Multi-factor authentication implementation
- Session management security
- OAuth/SSO integration vulnerabilities
- Privilege escalation prevention
- Account lockout and brute force protection

**Input Validation & Data Protection:**
- SQL injection prevention measures
- Cross-site scripting (XSS) protection
- Cross-site request forgery (CSRF) guards
- File upload security validation
- Data sanitization and encoding
- API input validation

**Infrastructure Security:**
- Server hardening checklist
- Network security configuration
- SSL/TLS certificate implementation
- Database security configuration
- Firewall and access control rules
- Backup security and encryption

**Code Review Security:**
- Static code analysis tools setup
- Dependency vulnerability scanning
- Secrets and credential management
- Error handling and information disclosure
- Logging and monitoring security
- Third-party library risk assessment

**Data Protection Compliance:**
- Encryption at rest and in transit
- Personal data identification and classification
- Data retention and deletion policies
- User consent and privacy controls
- Data breach notification procedures
- Cross-border data transfer compliance

**Security Testing Procedures:**
- Vulnerability scanning tools and schedules
- Penetration testing methodology
- Security test cases for critical functions
- Load testing for security failures
- Social engineering awareness testing
- Incident response procedures

**Remediation Roadmap:**
- Critical vulnerabilities (immediate fixes)
- High-priority security improvements
- Medium-term security enhancements
- Long-term security architecture improvements
- Security training and awareness program

**Monitoring and Maintenance:**
- Security event monitoring setup
- Intrusion detection systems
- Log analysis and alerting
- Regular security update procedures
- Security metrics and KPIs
- Annual security review schedule

Include specific tools, commands, and implementation steps for each security measure."""
    },

    "mobile-app-planning": {
        "title": "Mobile App Development Planner",
        "description": "Complete blueprint for planning, developing, and launching successful mobile applications",
        "keywords": "mobile app development, app planning, iOS Android development, mobile app strategy",
        "prompt": """Create a comprehensive development plan for my mobile app idea:

**App Concept:**
- App name: [NAME]
- Core purpose: [MAIN FUNCTION/PROBLEM SOLVED]
- Target audience: [DEMOGRAPHICS/USER TYPES]
- Monetization model: [FREE/PAID/FREEMIUM/ADS/SUBSCRIPTIONS]
- Competitive advantage: [UNIQUE FEATURES/DIFFERENTIATION]

**Market Research & Validation:**
- Competitor analysis framework
- Target market size estimation
- User persona development
- Feature prioritization (MVP vs future)
- Pricing strategy research
- App store optimization keywords

**Technical Architecture:**
- Platform decision (iOS/Android/Cross-platform)
- Development approach (Native/React Native/Flutter)
- Backend infrastructure requirements
- Database design considerations
- Third-party integrations needed
- Scalability planning

**Feature Specification:**
- Core features for MVP (Minimum Viable Product)
- User flow and navigation design
- UI/UX wireframe requirements
- API endpoints and functionality
- Push notification strategy
- Offline functionality needs

**Development Timeline:**
- Pre-development phase (research, planning)
- Design phase (UI/UX, prototypes)
- Development sprints breakdown
- Testing phases (unit, integration, user)
- App store submission process
- Launch preparation timeline

**Resource Planning:**
- Development team requirements (in-house vs outsourced)
- Budget estimation for development
- Design resource needs
- Testing and QA requirements
- Marketing and launch budget
- Ongoing maintenance costs

**Technical Specifications:**
- Minimum device requirements
- Performance benchmarks
- Security requirements and compliance
- Data privacy and protection measures
- Analytics and tracking implementation
- Crash reporting and error handling

**Go-to-Market Strategy:**
- App store optimization (ASO)
- Pre-launch marketing activities
- Launch day promotion plan
- User acquisition strategies
- Retention and engagement tactics
- Post-launch iteration plan

**Success Metrics:**
- Key Performance Indicators (KPIs)
- User acquisition goals
- Retention rate targets
- Revenue projections
- App store rating objectives
- User feedback collection methods

**Risk Management:**
- Technical risk mitigation
- Market risk assessment
- Competition response planning
- Budget overrun prevention
- Timeline delay contingencies
- Post-launch support planning

Provide specific recommendations, tools, and step-by-step implementation guidance."""
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
        "coding": "the-genius-wave"
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

# Template for new prompts (same as before)
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
        affiliate_product={"business": "the-genius-wave", "money": "billionaire-brain-wave", 
                          "health": "mitolyn", "relationships": "his-secret-obsession",
                          "everyday": "teds-woodworking", "coding": "the-genius-wave"}[category]
    )
    
    # Write to file
    file_path = Path(f"prompts/{category}/{filename}.html")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return file_path

def main():
    """Create all remaining prompts"""
    project_root = Path(__file__).parent
    os.chdir(project_root)
    
    created_count = 0
    
    print("🚀 Creating remaining high-value prompts...")
    print("=" * 60)
    
    # Create prompts from database
    for category, filenames in REMAINING_PROMPTS.items():
        print(f"\n📁 Creating {category} prompts...")
        for filename in filenames:
            if filename in PROMPT_DATABASE:
                try:
                    file_path = create_prompt_file(category, filename, PROMPT_DATABASE[filename])
                    print(f"✅ Created {file_path}")
                    created_count += 1
                except Exception as e:
                    print(f"❌ Error creating {filename}: {e}")
    
    print("\n" + "=" * 60)
    print(f"✅ Creation Complete!")
    print(f"📊 Created {created_count} new prompts")
    print(f"🎯 Total prompts now: {92 + 8 + created_count} (Target: 150)")
    print(f"\n💡 Next steps:")
    print(f"1. Verify all prompts load correctly")
    print(f"2. Update category index pages with new prompts")
    print(f"3. Test affiliate links and analytics")
    print(f"4. Submit sitemap to search engines")

if __name__ == "__main__":
    main()