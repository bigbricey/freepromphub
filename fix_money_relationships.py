#!/usr/bin/env python3
import os
import glob
import re

def move_affiliates_to_top(filepath):
    """Move affiliate sections to TOP and fix the discount claims"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the affiliate section
        affiliate_pattern = r'<!-- Affiliate Recommendation -->.*?</section>'
        affiliate_match = re.search(affiliate_pattern, content, re.DOTALL)
        
        if not affiliate_match:
            return False
            
        affiliate_section = affiliate_match.group()
        
        # Remove the fake "67% OFF TODAY" claim and replace with honest messaging
        affiliate_section = affiliate_section.replace('⚠️ 67% OFF TODAY - ', '')
        
        # Remove affiliate from current location
        content = re.sub(affiliate_pattern, '', content, flags=re.DOTALL)
        
        # Find where to insert (after breadcrumb, before main content)
        # Look for the end of breadcrumb navigation
        insertion_patterns = [
            r'</nav>\s*\n\s*<main>',  # After nav, before main
            r'</nav>\s*\n\s*<!-- Prompt Display -->',  # After nav, before prompt
            r'</nav>\s*\n\s*<article',  # After nav, before article
        ]
        
        inserted = False
        for pattern in insertion_patterns:
            if re.search(pattern, content):
                # Insert affiliate right after the nav
                content = re.sub(
                    pattern,
                    f'</nav>\n\n{affiliate_section}\n\n<main>',
                    content
                )
                inserted = True
                break
        
        if not inserted:
            # Fallback: try to insert after <main> opening
            content = content.replace('<main>', f'<main>\n{affiliate_section}\n')
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

print("FIXING MONEY & RELATIONSHIPS AFFILIATES")
print("=" * 50)
print("Moving to TOP and removing fake discount claims")
print()

# Fix Money pages
money_files = glob.glob('prompts/money/*.html')
money_prompts = [f for f in money_files if not f.endswith('index.html')]

print(f"MONEY CATEGORY ({len(money_prompts)} files):")
fixed = 0
for filepath in money_prompts:
    if move_affiliates_to_top(filepath):
        print(f"  ✓ {os.path.basename(filepath)}")
        fixed += 1
print(f"  Fixed {fixed} money pages\n")

# Fix Relationships pages
rel_files = glob.glob('prompts/relationships/*.html')
rel_prompts = [f for f in rel_files if not f.endswith('index.html')]

print(f"RELATIONSHIPS CATEGORY ({len(rel_prompts)} files):")
fixed = 0
for filepath in rel_prompts:
    if move_affiliates_to_top(filepath):
        print(f"  ✓ {os.path.basename(filepath)}")
        fixed += 1
print(f"  Fixed {fixed} relationship pages\n")

print("=" * 50)
print("DONE! Affiliates moved to TOP with honest messaging")
