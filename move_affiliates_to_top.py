#!/usr/bin/env python3
import os
import re
import glob

def move_affiliate_to_top(filepath):
    """Move affiliate section to top of page after breadcrumb"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find and extract the affiliate section
        affiliate_pattern = r'(<section class="affiliate-section"[^>]*>.*?</section>)'
        affiliate_match = re.search(affiliate_pattern, content, re.DOTALL)
        
        if not affiliate_match:
            print(f"  - No affiliate section in: {os.path.basename(filepath)}")
            return False
        
        # Extract the affiliate section
        affiliate_section = affiliate_match.group(1)
        
        # Remove affiliate from current location
        content_without_affiliate = re.sub(affiliate_pattern, '', content, flags=re.DOTALL)
        
        # Add urgency to the heading in affiliate section
        # Find all h2 tags in the affiliate section and add urgency
        updated_affiliate = re.sub(
            r'(<h2[^>]*>)(.*?)(</h2>)',
            r'\1⚠️ 67% OFF TODAY - \2\3',
            affiliate_section
        )
        
        # Remove any existing urgency text to avoid duplication
        updated_affiliate = re.sub(
            r'⚠️ 67% OFF TODAY - ⚠️ 67% OFF TODAY - ',
            '⚠️ 67% OFF TODAY - ',
            updated_affiliate
        )
        
        # Find position after breadcrumb navigation
        # Breadcrumb ends with </nav> and main content starts
        breadcrumb_pattern = r'(</nav>\s*<main[^>]*>\s*<div[^>]*>)'
        
        if re.search(breadcrumb_pattern, content_without_affiliate):
            # Insert affiliate right after the breadcrumb navigation
            new_content = re.sub(
                breadcrumb_pattern,
                r'\1\n                ' + updated_affiliate + '\n',
                content_without_affiliate,
                count=1
            )
        else:
            # Alternative pattern if structure is different
            main_pattern = r'(<main[^>]*>\s*<div[^>]*>)'
            if re.search(main_pattern, content_without_affiliate):
                new_content = re.sub(
                    main_pattern,
                    r'\1\n                ' + updated_affiliate + '\n',
                    content_without_affiliate,
                    count=1
                )
            else:
                print(f"  ✗ Could not find insertion point in: {os.path.basename(filepath)}")
                return False
        
        # Write the updated content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✓ Moved affiliate to TOP in: {os.path.basename(filepath)}")
        return True
        
    except Exception as e:
        print(f"  ✗ Error processing {os.path.basename(filepath)}: {e}")
        return False

def main():
    print("MOVING ALL AFFILIATE SECTIONS TO TOP OF PAGES")
    print("=" * 50)
    print("Adding urgency messaging for better conversions\n")
    
    categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health']
    
    total_moved = 0
    
    for category in categories:
        folder = f'prompts/{category}'
        if not os.path.exists(folder):
            print(f"⚠️ Category folder doesn't exist: {folder}")
            continue
            
        print(f"\n📁 Processing {category.upper()} category...")
        
        # Get all HTML files except index
        html_files = glob.glob(os.path.join(folder, '*.html'))
        prompt_files = [f for f in html_files if not f.endswith('index.html')]
        
        if not prompt_files:
            print(f"  No prompt files found")
            continue
        
        moved = 0
        for filepath in prompt_files:
            if move_affiliate_to_top(filepath):
                moved += 1
                total_moved += 1
        
        print(f"  Moved {moved}/{len(prompt_files)} affiliates to top")
    
    print("\n" + "=" * 50)
    print(f"✅ SUCCESS: Moved {total_moved} affiliate sections to TOP")
    print("Affiliates now appear FIRST with urgency messaging!")

if __name__ == "__main__":
    main()