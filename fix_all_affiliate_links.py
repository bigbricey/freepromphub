#!/usr/bin/env python3
import os
import re
import glob

# CORRECT ClickBank hop link format with YOUR affiliate ID
# Format should be: https://AFFILIATE.VENDOR.hop.clickbank.net

# Map of products to their VENDOR IDs (extracted from the cryptic hop links)
VENDOR_MAP = {
    'business': {
        'vendor': 'geniuswave',  # The Genius Wave
        'old_link': 'https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net',
        'new_link': 'https://bigbricey.geniuswave.hop.clickbank.net'
    },
    'everyday': {
        'vendor': 'tedswoodpln',  # TedsWoodworking  
        'old_link': 'https://16ee2y2mig1i7p30o9m9zj-i6b.hop.clickbank.net',
        'new_link': 'https://bigbricey.tedswoodpln.hop.clickbank.net'
    },
    'content': {
        'vendor': 'javaburn',  # Java Burn
        'old_link': 'hop.clickbank.net/?vendor=javaburn&affiliate=bigbricey&lid=coffee2',
        'new_link': 'https://bigbricey.javaburn.hop.clickbank.net'
    },
    'coding': {
        'vendor': 'neuroenerg',  # Neuro Energizer
        'old_link': 'hop.clickbank.net/?vendor=neuroenerg&affiliate=bigbricey',
        'new_link': 'https://bigbricey.neuroenerg.hop.clickbank.net'
    },
    'relationships': {
        'vendor': 'hissecret',  # His Secret Obsession
        'old_link': 'https://3ed8fy7qkfql3rcikpuqefkt5g.hop.clickbank.net',
        'new_link': 'https://bigbricey.hissecret.hop.clickbank.net'
    },
    'health': {
        'vendor': 'sleeplean',  # SleepLean
        'old_link': 'hop.clickbank.net/?vendor=sleeplean&affiliate=bigbricey',
        'new_link': 'https://bigbricey.sleeplean.hop.clickbank.net'
    }
}

def fix_links_in_file(filepath, category):
    """Fix affiliate links in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if category not in VENDOR_MAP:
            print(f"  ⚠️ No vendor mapping for category: {category}")
            return False
        
        vendor_info = VENDOR_MAP[category]
        
        # Count how many links we're replacing
        old_count = content.count('href="http')
        
        # Replace any ClickBank links with the correct format
        patterns = [
            r'href="https?://[^"]*clickbank[^"]*"',
            r'href="https?://hop\.clickbank\.net[^"]*"'
        ]
        
        replaced = False
        for pattern in patterns:
            if re.search(pattern, content):
                # Replace with the correct link
                new_content = re.sub(
                    pattern,
                    f'href="{vendor_info["new_link"]}"',
                    content
                )
                if new_content != content:
                    content = new_content
                    replaced = True
        
        if replaced:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Fixed links in: {os.path.basename(filepath)}")
            return True
        else:
            print(f"  - No ClickBank links found in: {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {os.path.basename(filepath)}: {e}")
        return False

def main():
    print("FIXING ALL CLICKBANK AFFILIATE LINKS\n")
    print("Your ClickBank ID: bigbricey")
    print("=" * 50)
    
    categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health']
    
    total_fixed = 0
    
    for category in categories:
        print(f"\n📁 Processing {category.upper()} category...")
        
        folder_path = f'prompts/{category}'
        html_files = glob.glob(os.path.join(folder_path, '*.html'))
        prompt_files = [f for f in html_files if not f.endswith('index.html')]
        
        if not prompt_files:
            print(f"  No prompt files found in {category}")
            continue
            
        fixed_count = 0
        for filepath in prompt_files:
            if fix_links_in_file(filepath, category):
                fixed_count += 1
                total_fixed += 1
        
        print(f"  Summary: Fixed {fixed_count}/{len(prompt_files)} files in {category}")
    
    print("\n" + "=" * 50)
    print(f"✅ TOTAL: Fixed {total_fixed} files")
    print("\nIMPORTANT: Now run:")
    print("  git add -A")
    print("  git commit -m 'FIX: Corrected all ClickBank affiliate links'")
    print("  git push")

if __name__ == "__main__":
    main()