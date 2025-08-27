#!/usr/bin/env python3
import os
import re
import glob

# His Secret Obsession affiliate section for Relationships prompts
RELATIONSHIPS_SECTION = '''
            <!-- Affiliate Recommendation -->
            <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%); border-radius: 10px;">
                <h2 style="color: white; margin-bottom: 15px;">💕 Unlock the Secret to Lasting Love</h2>
                <p style="color: white; margin-bottom: 20px;">Want to understand what makes relationships thrive? His Secret Obsession reveals the hidden desires that create deep emotional bonds. Learn the psychological triggers that make someone feel truly valued, understood, and irreplaceable in any relationship.</p>
                <a href="https://3ed8fy7qkfql3rcikpuqefkt5g.hop.clickbank.net" target="_blank" style="display: inline-block; background: white; color: #e91e63; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Discover the Secret →</a>
                <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;"><em>*Sponsored - We may earn a commission if you purchase. This helps us keep all prompts free.</em></p>
            </section>'''

def add_affiliate_to_file(filepath):
    """Add affiliate section before the closing </div></main> tags"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if affiliate section already exists
        if 'affiliate-section' in content:
            print(f"  ✓ Already has affiliate section: {os.path.basename(filepath)}")
            return False
        
        # Find the pattern: </div> before </main>
        pattern = r'(\s*)(</div>\s*</main>)'
        
        if not re.search(pattern, content):
            print(f"  ✗ No </div></main> pattern found: {os.path.basename(filepath)}")
            return False
        
        # Add the affiliate section before </div></main>
        new_content = re.sub(
            pattern,
            r'\1' + RELATIONSHIPS_SECTION + r'\n\1\2',
            content,
            count=1
        )
        
        # Write the updated content back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✓ Added affiliate section to: {os.path.basename(filepath)}")
        return True
        
    except Exception as e:
        print(f"  ✗ Error processing {os.path.basename(filepath)}: {e}")
        return False

def main():
    # Path to relationships prompts folder
    relationships_path = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\prompts\relationships'
    
    # Get all HTML files in the relationships folder
    html_files = glob.glob(os.path.join(relationships_path, '*.html'))
    
    # Filter out index.html
    prompt_files = [f for f in html_files if not f.endswith('index.html')]
    
    print(f"Found {len(prompt_files)} prompt files in Relationships category")
    print("Adding His Secret Obsession affiliate section to each...\n")
    
    success_count = 0
    for filepath in prompt_files:
        if add_affiliate_to_file(filepath):
            success_count += 1
    
    print(f"\n✅ Successfully updated {success_count}/{len(prompt_files)} files")
    
    if success_count == len(prompt_files):
        print("🎉 All Relationships prompts updated with His Secret Obsession affiliate!")
    elif success_count > 0:
        print("⚠️ Some files were already updated or had issues")

if __name__ == "__main__":
    main()