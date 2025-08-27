#!/usr/bin/env python3
import os
import glob
import re

def move_money_affiliates_to_top(filepath):
    """Move affiliate sections in Money pages to TOP of content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find and extract the affiliate section
        affiliate_pattern = r'<!-- Affiliate Recommendation -->.*?</section>'
        affiliate_match = re.search(affiliate_pattern, content, re.DOTALL)
        
        if not affiliate_match:
            print(f"  No affiliate found in {os.path.basename(filepath)}")
            return False
        
        affiliate_section = affiliate_match.group()
        
        # Remove from current position
        content_without_affiliate = re.sub(affiliate_pattern, '', content, flags=re.DOTALL)
        
        # Find the right place to insert - after breadcrumb navigation
        # Money pages have different structure - look for the article tag
        insertion_point = '<article class="prompt-display">'
        
        if insertion_point in content_without_affiliate:
            # Insert AFTER the article opening tag, BEFORE the title
            content_with_affiliate = content_without_affiliate.replace(
                insertion_point,
                f'{insertion_point}\n{affiliate_section}\n'
            )
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content_with_affiliate)
            return True
        else:
            print(f"  Could not find insertion point in {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"  Error processing {filepath}: {e}")
        return False

print("MOVING MONEY CATEGORY AFFILIATES TO TOP")
print("=" * 50)

# Get all money prompt files
money_files = glob.glob('prompts/money/*.html')
money_prompts = [f for f in money_files if not f.endswith('index.html')]

print(f"Found {len(money_prompts)} money prompt pages\n")

fixed_count = 0
for filepath in money_prompts:
    print(f"Processing {os.path.basename(filepath)}...")
    if move_money_affiliates_to_top(filepath):
        print(f"  SUCCESS - Moved affiliate to top")
        fixed_count += 1
    print()

print("=" * 50)
print(f"RESULTS: Moved affiliates to TOP in {fixed_count}/{len(money_prompts)} files")

if fixed_count > 0:
    print("\nMoney pages now show affiliates FIRST!")
    print("Visitors see the offer immediately after clicking a prompt.")
