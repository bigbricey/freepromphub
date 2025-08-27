#!/usr/bin/env python3
import os
import re
import glob

def remove_works_best_section(filepath):
    """Remove the 'Works Best With' section from HTML files"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match the Works Best With section
        # It typically starts with <section class="works-best-with"> and ends with </section>
        pattern = r'<section class="works-best-with">.*?</section>'
        
        # Check if the section exists
        if re.search(pattern, content, re.DOTALL):
            # Remove the section
            new_content = re.sub(pattern, '', content, flags=re.DOTALL)
            
            # Also remove any "Related Prompts" sections that might exist
            pattern2 = r'<section class="tools-grid">.*?</section>'
            new_content = re.sub(pattern2, '', new_content, flags=re.DOTALL)
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  ✓ Removed competitor mentions from: {os.path.basename(filepath)}")
            return True
        else:
            print(f"  - No 'Works Best With' found in: {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")
        return False

def main():
    print("REMOVING ALL COMPETITOR MENTIONS")
    print("=" * 50)
    print("This stops sending YOUR traffic to ChatGPT Plus!\n")
    
    # Process all HTML files in all category folders
    categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health', 'money']
    
    total_fixed = 0
    
    for category in categories:
        folder = f'prompts/{category}'
        if not os.path.exists(folder):
            print(f"⚠️  Category folder doesn't exist: {folder}")
            continue
            
        print(f"\n📁 Processing {category.upper()} category...")
        
        # Get all HTML files
        html_files = glob.glob(os.path.join(folder, '*.html'))
        prompt_files = [f for f in html_files if not f.endswith('index.html')]
        
        if not prompt_files:
            print(f"  No prompt files found")
            continue
        
        fixed = 0
        for filepath in prompt_files:
            if remove_works_best_section(filepath):
                fixed += 1
                total_fixed += 1
        
        print(f"  Cleaned {fixed}/{len(prompt_files)} files")
    
    print("\n" + "=" * 50)
    print(f"✅ TOTAL: Removed competitor mentions from {total_fixed} files")
    print("\nNow YOUR site keeps the traffic instead of sending it away!")

if __name__ == "__main__":
    main()