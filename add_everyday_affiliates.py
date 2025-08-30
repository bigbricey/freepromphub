#!/usr/bin/env python3
import os
import re
import glob

# TedsWoodworking affiliate section for Everyday prompts
EVERYDAY_SECTION = '''
                <!-- Affiliate Recommendation -->
                <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); border-radius: 10px;">
                    <h2 style="color: white; margin-bottom: 15px;">🔨 Master DIY Projects with 16,000 Plans</h2>
                    <p style="color: white; margin-bottom: 20px;">Want to build something amazing? TedsWoodworking gives you instant access to 16,000 professional woodworking plans. From simple weekend projects to elaborate furniture - complete blueprints, materials lists, and step-by-step instructions included.</p>
                    <a href="https://6c0e5c0dqlol4ufpg9yjr0xl50.hop.clickbank.net" target="_blank" style="display: inline-block; background: white; color: #8B4513; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Get 16,000 Woodworking Plans →</a>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;"><em>*Sponsored - We may earn a commission if you purchase. This helps us keep all prompts free.</em></p>
                </section>'''

def add_affiliate_to_file(filepath):
    """Add affiliate section before the closing article tag"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if affiliate section already exists
        if 'affiliate-section' in content:
            print(f"  ✓ Already has affiliate section: {os.path.basename(filepath)}")
            return False
        
        # Find the closing </article> tag
        pattern = r'(\s*)(</article>)'
        
        if not re.search(pattern, content):
            print(f"  ✗ No </article> tag found: {os.path.basename(filepath)}")
            return False
        
        # Add the affiliate section before </article>
        new_content = re.sub(
            pattern,
            r'\1' + EVERYDAY_SECTION + r'\n\1\2',
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
    # Path to everyday prompts folder
    everyday_path = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\prompts\everyday'
    
    # Get all HTML files in the everyday folder
    html_files = glob.glob(os.path.join(everyday_path, '*.html'))
    
    # Filter out index.html
    prompt_files = [f for f in html_files if not f.endswith('index.html')]
    
    print(f"Found {len(prompt_files)} prompt files in Everyday category")
    print("Adding TedsWoodworking affiliate section to each...\n")
    
    success_count = 0
    for filepath in prompt_files:
        if add_affiliate_to_file(filepath):
            success_count += 1
    
    print(f"\n✅ Successfully updated {success_count}/{len(prompt_files)} files")
    
    if success_count == len(prompt_files):
        print("🎉 All Everyday prompts updated with TedsWoodworking affiliate!")
    elif success_count > 0:
        print("⚠️ Some files were already updated or had issues")

if __name__ == "__main__":
    main()