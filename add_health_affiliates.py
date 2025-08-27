#!/usr/bin/env python3
import os
import re
import glob

# SleepLean affiliate section for Health prompts
HEALTH_SECTION = '''
                <!-- Affiliate Recommendation -->
                <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <h2 style="color: white; margin-bottom: 15px;">😴 Lose Weight While You Sleep</h2>
                    <p style="color: white; margin-bottom: 20px;">Health starts with quality sleep. SleepLean optimizes your metabolism during rest, helping you burn fat overnight while improving sleep quality. Wake up refreshed, energized, and closer to your health goals - all while you sleep.</p>
                    <a href="https://hop.clickbank.net/?vendor=sleeplean&affiliate=bigbricey" target="_blank" style="display: inline-block; background: white; color: #667eea; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Start Losing Weight Tonight →</a>
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
            r'\1' + HEALTH_SECTION + r'\n\1\2',
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
    # Path to health prompts folder
    health_path = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\prompts\health'
    
    # Get all HTML files in the health folder
    html_files = glob.glob(os.path.join(health_path, '*.html'))
    
    # Filter out index.html
    prompt_files = [f for f in html_files if not f.endswith('index.html')]
    
    print(f"Found {len(prompt_files)} prompt files in Health category")
    print("Adding SleepLean affiliate section to each...\n")
    
    success_count = 0
    for filepath in prompt_files:
        if add_affiliate_to_file(filepath):
            success_count += 1
    
    print(f"\n✅ Successfully updated {success_count}/{len(prompt_files)} files")
    
    if success_count == len(prompt_files):
        print("🎉 All Health prompts updated with SleepLean affiliate!")
    elif success_count > 0:
        print("⚠️ Some files were already updated or had issues")

if __name__ == "__main__":
    main()