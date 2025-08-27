#!/usr/bin/env python3
import os
import re
import glob

# The Genius Wave affiliate section for Business prompts
BUSINESS_SECTION = '''
                <!-- Affiliate Recommendation -->
                <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); border-radius: 10px;">
                    <h2 style="color: white; margin-bottom: 15px;">🧠 Unlock Your Business Genius</h2>
                    <p style="color: white; margin-bottom: 20px;">This prompt helps with business strategy. Want to think like a CEO? The Genius Wave uses neuroscience to unlock your brain's full potential - enhancing creativity, focus, and decision-making in just 7 minutes.</p>
                    <a href="https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net" target="_blank" style="display: inline-block; background: white; color: #4CAF50; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Activate Your Genius Wave →</a>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;"><em>*Sponsored - We may earn a commission if you purchase. This helps us keep all prompts free.</em></p>
                </section>'''

# Find all business HTML files
business_files = glob.glob('prompts/business/*.html')
business_files = [f for f in business_files if not f.endswith('index.html')]

print(f"Found {len(business_files)} business prompt files")
print("Files to update:")
for f in business_files:
    print(f"  - {f}")

updated_count = 0
skipped_count = 0

for filepath in business_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if affiliate section already exists
        if '<!-- Affiliate Recommendation -->' not in content:
            # Find the closing of the article section before footer
            pattern = r'(</article>\s*</div>\s*</main>\s*\n\s*<footer>)'
            
            # Check if pattern exists
            if re.search(pattern, content):
                replacement = f'{BUSINESS_SECTION}\n            </article>\n        </div>\n    </main>\n\n    <footer>'
                new_content = re.sub(pattern, replacement, content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"✅ Updated: {os.path.basename(filepath)}")
                updated_count += 1
            else:
                print(f"⚠️ Pattern not found: {os.path.basename(filepath)}")
                skipped_count += 1
        else:
            print(f"⏭️ Skipped (already has affiliate): {os.path.basename(filepath)}")
            skipped_count += 1

print(f"\n✅ DONE! Updated {updated_count} business pages with The Genius Wave ($46/sale)")
print(f"⏭️ Skipped {skipped_count} pages")
print(f"\nPotential earnings: {updated_count} pages × 1 sale each = ${updated_count * 46}/month")