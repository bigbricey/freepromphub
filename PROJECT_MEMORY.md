# FreePromptHub Project Memory

## 🚨 STOP! READ THIS BEFORE DOING ANYTHING

### THE SYSTEM - FOLLOW THIS OR STUFF BREAKS

#### BEFORE CREATING ANYTHING:
1. **CHECK WHAT ALREADY EXISTS**
   - Look at `/prompts/business/index.html` - THIS IS THE TEMPLATE
   - Look at existing prompt pages that WORK
   - DON'T REINVENT - COPY WHAT WORKS

#### WHEN CREATING NEW CATEGORY:
```
□ Copy business/index.html EXACTLY
□ Update category name and description
□ Fix ALL paths to absolute (/prompts/category/)
□ Test ONE prompt before making more
□ Add to homepage
□ Add to search.js
□ Git push
□ WAIT 2 minutes
□ TEST ON LIVE SITE
□ Only then make more prompts
```

#### WHEN CREATING NEW PROMPT:
```
□ Copy a WORKING prompt file (like business/marketing-strategy.html)
□ Change the content but KEEP THE STRUCTURE
□ Fix breadcrumb to: href="/prompts/[category]/"
□ Fix related links to absolute paths
□ Add to category index.html
□ Add to search.js
□ Update count on homepage
□ Push and TEST before making another
```

#### PATH RULES - MEMORIZE THESE:
- ✅ GOOD: `/prompts/everyday/meal-planner.html`
- ❌ BAD: `meal-planner.html`
- ✅ GOOD: `/style.css`
- ❌ BAD: `../../style.css`
- ✅ GOOD: `/prompts/everyday/`
- ❌ BAD: `index.html`

#### WORKING TEMPLATES TO COPY:
- **Category Page:** `/prompts/business/index.html` (has nice cards and styling)
- **Prompt Page:** `/prompts/business/marketing-strategy.html`
- **DON'T USE:** everyday/index.html (it's broken)

## What We Learned (DON'T REPEAT THESE MISTAKES)

### MISTAKES THAT KEEP HAPPENING:
1. **Making different layouts** - everyday looks different than business
2. **Relative paths** - causes 404s every time
3. **Making 7 things at once** - can't tell what's broken
4. **Not checking live site** - pushing broken stuff

### WRONG Approach (Content):
- SQL Query Optimizer prompts
- Complex business frameworks
- Investment portfolio analyzers
- Technical jargon-heavy prompts
- Prompts for tech experts

### RIGHT Approach (Content) - What People ACTUALLY Want:
1. **Meal Planning** (#1 most searched)
2. **Budget Help** (survival, not investing)
3. **Job Search** (resumes, interviews)
4. **Fitness at Home** (no gym required)
5. **Difficult Conversations** (relationships, work)
6. **Parenting Help**
7. **Side Hustles** (quick money)
8. **Organization** (decluttering)

## Project Structure
```
FreePromptHub/
├── prompts/
│   ├── everyday/     ← NEEDS FIXING (wrong template used)
│   ├── business/     ← WORKING TEMPLATE - copy this!
│   ├── money/        ← Working
│   ├── content/      ← Working
│   ├── health/       ← Empty
│   ├── coding/       ← Working
│   └── ai-art/       ← Empty
```

## Site Status
- **LIVE**: freepromphub.vercel.app
- **Domain**: freepromphub.com (working)
- **GitHub**: bigbricey/freepromphub
- **Vercel**: Auto-deploys on push (takes 1-2 minutes)

## Current Issues to Fix
1. **everyday/index.html** - Using wrong template, looks like crap
2. **Some 404s** - Check all prompt links work
3. **Need more categories** - Relationships, Parenting, Students

## Prompts Created
### Everyday (7 total but index is broken):
- meal-planner.html ✅
- resume-fixer.html ✅
- budget-emergency.html ✅
- difficult-conversation.html ✅
- workout-home.html ✅
- side-hustle.html ✅
- clean-organize.html ✅

### Business (5 total - all working):
- marketing-strategy.html ✅
- business-plan.html ✅
- email-templates.html ✅
- social-media.html ✅
- competitor-analysis.html ✅

## Monetization Ideas
- Meal planning apps ($30-60 commission)
- Budget apps (Mint, YNAB)
- Resume services ($100+ commission)
- Fitness apps ($20-40)
- Therapy/counseling services ($50+)

## Traffic Strategy
- Share individual prompts on X/Twitter
- "Here's the exact ChatGPT prompt I use for..."
- Target everyday problems, not business

## ONE THING AT A TIME RULE
1. Fix ONE thing
2. Test it
3. Confirm it works
4. THEN do the next thing

Don't do 7 things and hope they all work!

---
*Last Updated: August 24, 2025 - Added system to stop breaking things*