#!/usr/bin/env python3
import os
import re
import glob

# MAPPING OF OLD BROKEN LINKS TO NEW WORKING LINKS FROM YOUR MASTER FILE
LINK_FIXES = {
    # TedsWoodworking - THIS IS THE MAIN BROKEN ONE
    'https://7ca54ouacpux8odjs7-cmvvj54.hop.clickbank.net': 'https://6c0e5c0dqlol4ufpg9yjr0xl50.hop.clickbank.net',
    
    # Just in case there are other old links, let's map them too
    # The Genius Wave (Business) - already correct
    # 'https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net': 'https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net',
    
    # Java Burn (Content) - already correct
    # 'https://13f75e6ccbuz3u04ikq7xmpr5b.hop.clickbank.net': 'https://13f75e6ccbuz3u04ikq7xmpr5b.hop.clickbank.net',
    
    # Neuro Energizer (Coding) - already correct
    # 'https://9d76fn1hemvx3t0bresjkcmiki.hop.clickbank.net': 'https://9d76fn1hemvx3t0bresjkcmiki.hop.clickbank.net',
    
    # His Secret Obsession (Relationships) - already correct
    # 'https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net': 'https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net',
    
    # SleepLean (Health) - already correct
    # 'https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net': 'https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net',
}

def fix_links_in_file(filepath):
    """Replace old broken links with new working ones"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = False
        
        # Replace each broken link with the correct one
        for old_link, new_link in LINK_FIXES.items():
            if old_link in content:
                content = content.replace(old_link, new_link)
                changes_made = True
                print(f"  Fixed link in {os.path.basename(filepath)}")
        
        if changes_made:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"  Error processing {filepath}: {e}")
        return False

print("FIXING BROKEN TEDSWOOD WORKING LINKS")
print("=" * 50)

# Find all HTML files
categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health', 'money']
total_fixed = 0

for category in categories:
    pattern = f'prompts/{category}/*.html'
    files = glob.glob(pattern)
    
    # Skip index.html files
    prompt_files = [f for f in files if not f.endswith('index.html')]
    
    if prompt_files:
        print(f"\nChecking {category.upper()} ({len(prompt_files)} files):")
        category_fixed = 0
        
        for filepath in prompt_files:
            if fix_links_in_file(filepath):
                category_fixed += 1
        
        if category_fixed > 0:
            total_fixed += category_fixed
            print(f"  Fixed {category_fixed} files in {category}")

print(f"\n{'=' * 50}")
print(f"TOTAL: Fixed {total_fixed} files")

if total_fixed > 0:
    print("\nThe TedsWoodworking link has been updated!")
    print("Old broken: https://7ca54ouacpux8odjs7-cmvvj54.hop.clickbank.net")
    print("New working: https://6c0e5c0dqlol4ufpg9yjr0xl50.hop.clickbank.net")
else:
    print("\nNo files needed fixing - links might already be correct")
