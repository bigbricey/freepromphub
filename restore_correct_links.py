#!/usr/bin/env python3
import os
import re
import glob

# RESTORE THE CORRECT LINKS FROM YOUR ORIGINAL LIST
CORRECT_LINKS = {
    'business': 'https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net',  # The Genius Wave
    'everyday': 'https://7ca54ouacpux8odjs7-cmvvj54.hop.clickbank.net',  # TedsWoodworking  
    'content': 'https://13f75e6ccbuz3u04ikq7xmpr5b.hop.clickbank.net',  # Java Burn 2.0
    'coding': 'https://9d76fn1hemvx3t0bresjkcmiki.hop.clickbank.net',  # Neuro Energizer
    'relationships': 'https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net',  # His Secret Obsession
    'health': 'https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net'  # SleepLean
}

def restore_link_in_file(filepath, category):
    """Restore the correct affiliate link"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if category not in CORRECT_LINKS:
            print(f"  ⚠️ No link for category: {category}")
            return False
        
        correct_link = CORRECT_LINKS[category]
        
        # Find and replace any clickbank links
        pattern = r'href="https?://[^"]*clickbank[^"]*"'
        
        if re.search(pattern, content):
            # Replace with the correct link
            new_content = re.sub(
                pattern,
                f'href="{correct_link}"',
                content
            )
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  ✓ Restored correct link in: {os.path.basename(filepath)}")
            return True
        else:
            print(f"  - No ClickBank link found in: {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {os.path.basename(filepath)}: {e}")
        return False

def main():
    print("RESTORING YOUR ORIGINAL CORRECT CLICKBANK LINKS\n")
    print("These ARE the right format - the cryptic ones!")
    print("=" * 50)
    
    categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health']
    
    total_fixed = 0
    
    for category in categories:
        print(f"\n📁 Restoring {category.upper()} category...")
        print(f"   Correct link: {CORRECT_LINKS[category]}")
        
        folder_path = f'prompts/{category}'
        html_files = glob.glob(os.path.join(folder_path, '*.html'))
        prompt_files = [f for f in html_files if not f.endswith('index.html')]
        
        if not prompt_files:
            print(f"  No prompt files found in {category}")
            continue
            
        fixed_count = 0
        for filepath in prompt_files:
            if restore_link_in_file(filepath, category):
                fixed_count += 1
                total_fixed += 1
        
        print(f"  Summary: Fixed {fixed_count}/{len(prompt_files)} files in {category}")
    
    print("\n" + "=" * 50)
    print(f"✅ TOTAL: Restored {total_fixed} files")
    print("\nThese links are NOW CORRECT!")
    print("\nRun:")
    print("  git add -A")
    print("  git commit -m 'RESTORE: Put back correct ClickBank hop links'")
    print("  git push")

if __name__ == "__main__":
    main()