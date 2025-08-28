#!/usr/bin/env python3
"""
Script to fix placeholder '#' links in Related Prompts sections
Maps them to actual existing prompt pages or removes broken links
"""

import os
import re

def get_existing_prompts():
    """Get a list of all existing prompt HTML files"""
    root_dir = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\prompts'
    prompts = {}
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html') and file != 'index.html' and file != 'template.html':
                # Get category from directory name
                category = os.path.basename(root)
                if category == 'prompts':
                    continue
                
                # Store as category -> list of files
                if category not in prompts:
                    prompts[category] = []
                prompts[category].append(file)
    
    return prompts

def fix_placeholder_links(filepath, existing_prompts):
    """Fix placeholder links in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all placeholder links
        placeholder_pattern = r'<a href="#"([^>]*)>(.*?)</a>'
        
        # Common mappings for missing prompts
        link_mappings = {
            'Pitch Deck Creator': '/prompts/business/business-plan.html',
            'Financial Model Builder': '/prompts/money/budget-optimizer.html',
            'Lead Generation System': '/prompts/business/cold-email.html',
            'Customer Journey Map': '/prompts/business/customer-survey.html',
            'Brand Voice Guide': '/prompts/content/copywriting.html',
            'Content Audit': '/prompts/content/blog-post.html',
            'Ad Copy Generator': '/prompts/content/copywriting.html',
            'Landing Page Copy': '/prompts/content/copywriting.html',
            'SEO Content Brief': '/prompts/content/blog-post.html',
            'Video Script Writer': '/prompts/content/youtube-script.html',
            'API Documentation': '/prompts/coding/api-builder.html',
            'Database Designer': '/prompts/coding/sql-optimizer.html',
            'Docker Setup': '/prompts/coding/python-automation.html',
            'CI/CD Pipeline': '/prompts/coding/python-automation.html',
            'Security Audit': '/prompts/coding/code-reviewer.html',
            'Performance Optimizer': '/prompts/coding/code-reviewer.html',
            'Investment Tracker': '/prompts/money/investment-analyzer.html',
            'Tax Optimizer': '/prompts/money/budget-optimizer.html',
            'Retirement Planner': '/prompts/money/investment-analyzer.html',
            'Crypto Portfolio': '/prompts/money/investment-analyzer.html',
            'Real Estate Calculator': '/prompts/money/investment-analyzer.html',
            'Passive Income Ideas': '/prompts/money/side-income.html',
            'Dividend Strategy': '/prompts/money/investment-analyzer.html',
            'Dating First Message': '/prompts/relationships/dating-app-messages.html',
            'Long Distance Tips': '/prompts/relationships/couple-arguments.html',
            'Marriage Proposal': '/prompts/relationships/first-date-ideas.html',
            'Parenting Advice': '/prompts/relationships/family-drama.html',
            'Friend Reconnection': '/prompts/relationships/toxic-friend.html',
            'Conflict Resolution': '/prompts/relationships/couple-arguments.html',
            'Love Languages': '/prompts/relationships/couple-arguments.html',
        }
        
        changes_made = False
        
        # Process each placeholder link
        for match in re.finditer(placeholder_pattern, content):
            full_match = match.group(0)
            link_text = match.group(2)
            
            # Extract the title from the h3 tag if present
            title_match = re.search(r'<h3>([^<]+)</h3>', link_text)
            if title_match:
                title = title_match.group(1)
                
                # Check if we have a mapping for this title
                if title in link_mappings:
                    new_link = full_match.replace('href="#"', f'href="{link_mappings[title]}"')
                    content = content.replace(full_match, new_link)
                    changes_made = True
                    print(f"  ✅ Fixed link: {title} -> {link_mappings[title]}")
        
        # Write back if changes were made
        if changes_made:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"  ❌ Error processing {filepath}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    root_dir = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub'
    existing_prompts = get_existing_prompts()
    
    print("Starting placeholder link fixes...")
    print("=" * 50)
    print(f"Found {sum(len(v) for v in existing_prompts.values())} existing prompt pages")
    print()
    
    fixed_count = 0
    checked_count = 0
    
    # Process all HTML files
    for root, dirs, files in os.walk(os.path.join(root_dir, 'prompts')):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                checked_count += 1
                if fix_placeholder_links(filepath, existing_prompts):
                    fixed_count += 1
                    print(f"Fixed: {os.path.relpath(filepath, root_dir)}")
    
    print("\n" + "=" * 50)
    print(f"Link Fix Complete!")
    print(f"  Files checked: {checked_count}")
    print(f"  Files fixed: {fixed_count}")

if __name__ == "__main__":
    main()