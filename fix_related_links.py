#!/usr/bin/env python3
"""
Script to fix placeholder '#' links in Related Prompts sections
"""

import os
import re

# Mapping of titles to actual pages
LINK_MAPPINGS = {
    # Business related
    'Pitch Deck Creator': '/prompts/business/business-plan.html',
    'Financial Model Builder': '/prompts/money/budget-optimizer.html',
    'Lead Generation System': '/prompts/business/cold-email.html',
    'Customer Journey Map': '/prompts/business/customer-survey.html',
    'Brand Voice Guide': '/prompts/content/copywriting.html',
    'Content Audit': '/prompts/content/blog-post.html',
    'Meeting Minutes': '/prompts/business/meeting-agenda.html',
    
    # Content related  
    'Ad Copy Generator': '/prompts/content/copywriting.html',
    'Landing Page Copy': '/prompts/content/copywriting.html',
    'SEO Content Brief': '/prompts/content/blog-post.html',
    'Video Script Writer': '/prompts/content/youtube-script.html',
    'Press Release': '/prompts/content/blog-post.html',
    'Case Study Template': '/prompts/business/competitor-analysis.html',
    
    # Coding related
    'API Documentation': '/prompts/coding/api-builder.html',
    'Database Designer': '/prompts/coding/sql-optimizer.html',
    'Docker Setup': '/prompts/coding/python-automation.html',
    'CI/CD Pipeline': '/prompts/coding/python-automation.html',
    'Security Audit': '/prompts/coding/code-reviewer.html',
    'Performance Optimizer': '/prompts/coding/code-reviewer.html',
    
    # Money related
    'Investment Tracker': '/prompts/money/investment-analyzer.html',
    'Tax Optimizer': '/prompts/money/budget-optimizer.html',
    'Retirement Planner': '/prompts/money/investment-analyzer.html',
    'Crypto Portfolio': '/prompts/money/investment-analyzer.html',
    'Real Estate Calculator': '/prompts/money/investment-analyzer.html',
    'Passive Income Ideas': '/prompts/money/side-income.html',
    'Dividend Strategy': '/prompts/money/investment-analyzer.html',
    'Stock Screener': '/prompts/money/investment-analyzer.html',
    
    # Relationships related
    'Dating First Message': '/prompts/relationships/dating-app-messages.html',
    'Long Distance Tips': '/prompts/relationships/couple-arguments.html',
    'Marriage Proposal': '/prompts/relationships/first-date-ideas.html',
    'Parenting Advice': '/prompts/relationships/family-drama.html',
    'Friend Reconnection': '/prompts/relationships/toxic-friend.html',
    'Conflict Resolution': '/prompts/relationships/couple-arguments.html',
    'Love Languages': '/prompts/relationships/couple-arguments.html',
    
    # Health related
    'Keto Meal Planner': '/prompts/health/meal-prep-beginner.html',
    'Marathon Training': '/prompts/health/home-workout.html',
    'Meditation Guide': '/prompts/health/mental-health.html',
    'Supplement Stack': '/prompts/health/energy-boost.html',
    'Recovery Plan': '/prompts/health/sleep-better.html',
    
    # Everyday related
    'Moving Abroad': '/prompts/everyday/moving-checklist.html',
    'Career Change': '/prompts/everyday/resume-fixer.html',
    'Time Management': '/prompts/everyday/clean-organize.html',
    'Study Schedule': '/prompts/everyday/meal-planner.html',
}

def fix_file(filepath):
    """Fix placeholder links in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # Find all related cards with href="#"
        pattern = r'<a href="#"([^>]*?)>(.*?)</a>'
        
        for match in re.finditer(pattern, content, re.DOTALL):
            full_match = match.group(0)
            inner_content = match.group(2)
            
            # Extract title from h3 tag
            h3_match = re.search(r'<h3>([^<]+)</h3>', inner_content)
            if h3_match:
                title = h3_match.group(1).strip()
                
                # Check if we have a mapping
                if title in LINK_MAPPINGS:
                    new_link = full_match.replace('href="#"', f'href="{LINK_MAPPINGS[title]}"')
                    content = content.replace(full_match, new_link)
                    changes.append(f"    ✅ {title} -> {LINK_MAPPINGS[title]}")
        
        # Write back if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            if changes:
                print(f"\n📄 {os.path.basename(filepath)}:")
                for change in changes:
                    print(change)
            return True
            
        return False
        
    except Exception as e:
        print(f"  ❌ Error processing {filepath}: {e}")
        return False

def main():
    """Process all HTML files in prompts directory"""
    root_dir = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\prompts'
    
    print("Fixing Related Prompts placeholder links...")
    print("=" * 50)
    
    fixed_count = 0
    checked_count = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                checked_count += 1
                
                if fix_file(filepath):
                    fixed_count += 1
    
    print("\n" + "=" * 50)
    print(f"✅ Link Fix Complete!")
    print(f"   Files checked: {checked_count}")
    print(f"   Files fixed: {fixed_count}")

if __name__ == "__main__":
    main()