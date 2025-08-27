#!/usr/bin/env python3
import os
import re
import glob

# CORRECT LINKS FROM YOUR FIXED MASTER FILE
CORRECT_LINKS = {
    # The Genius Wave for Business (20 pages)
    'https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net': 'https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net',  # This one is already correct
    
    # TedsWoodworking for Everyday (20 pages) - THIS IS THE BROKEN ONE
    'https://7ca54ouacpux8odjs7-cmvvj54.hop.clickbank.net': 'https://6c0e5c0dqlol4ufpg9yjr0xl50.hop.clickbank.net',
    
    # Java Burn for Content (10 pages)
    'https://13f75e6ccbuz3u04ikq7xmpr5b.hop.clickbank.net': 'https://13f75e6ccbuz3u04ikq7xmpr5b.hop.clickbank.net',  # Check if correct
    
    # Neuro Energizer for Coding (10 pages)
    'https://9d76fn1hemvx3t0bresjkcmiki.hop.clickbank.net': 'https://9d76fn1hemvx3t0bresjkcmiki.hop.clickbank.net',  # Check if correct
    
    # His Secret Obsession for Relationships (10 pages)
    'https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net': 'https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net',  # Check if correct
    
    # SleepLean for Health (8 pages)
    'https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net': 'https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net',  # Check if correct
}

def fix_links_in_file(filepath):
    """Replace old broken links with new working ones"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = False
        
        # Replace each broken link with the correct one
        for old_link, new_link in CORRECT_LINKS.items():
            if old_link in content:
                content = content.replace(old_link, new_link)
                changes_made = True
                print(f"  Fixed: {old_link[:30]}... → {new_link[:30]}...")
        
        if changes_made:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"  Error processing {filepath}: {e}")
        return False

print("FIXING ALL CLICKBANK LINKS FROM MASTER FILE")
print("=" * 50)

# Find all HTML files
categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health']
total_fixed = 0

for category in categories:
    pattern = f'prompts/{category}/*.html'
    files = glob.glob(pattern)
    
    # Skip index.html files
    prompt_files = [f for f in files if not f.endswith('index.html')]
    
    if prompt_files:
        print(f"\n{category.upper()} ({len(prompt_files)} files):")
        category_fixed = 0
        
        for filepath in prompt_files:
            filename = os.path.basename(filepath)
            if fix_links_in_file(filepath):
                print(f"  ✓ {filename}")
                category_fixed += 1
            else:
                print(f"  - {filename} (no changes needed)")
        
        total_fixed += category_fixed
        print(f"  Fixed {category_fixed} files in {category}")

print(f"\n{'=' * 50}")
print(f"TOTAL: Fixed {total_fixed} files")
print("\nNow the links should match your working master file!")
