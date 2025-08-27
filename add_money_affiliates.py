#!/usr/bin/env python3
import os
import re
import glob

# Billionaire Brain Wave affiliate section
MONEY_SECTION = '''
                <!-- Affiliate Recommendation -->
                <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #00c853 0%, #00e676 100%); border-radius: 10px;">
                    <h2 style="color: white; margin-bottom: 15px;">💰 Ready for Wealth Breakthrough?</h2>
                    <p style="color: white; margin-bottom: 20px;">This prompt helps manage money better. Want to actually attract wealth? The Billionaire Brain Wave uses neuroscience to rewire your mind for abundance in just 7 minutes a day.</p>
                    <a href="https://3811aatcrgoq3zex8i6zidmb77.hop.clickbank.net" target="_blank" style="display: inline-block; background: white; color: #00c853; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Activate Your Billionaire Brain →</a>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;"><em>*Sponsored - We may earn a commission if you purchase. This helps us keep all prompts free.</em></p>
                </section>'''

# Find all money HTML files
money_files = glob.glob('prompts/money/*.html')
money_files = [f for f in money_files if not f.endswith('index.html')]

print(f"Found {len(money_files)} money prompt files")

for filepath in money_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<!-- Affiliate Recommendation -->' not in content:
            pattern = r'(                </section>\s*</article>\s*</div>\s*</main>\s*\n\s*<footer>)'
            replacement = f'                </section>\n{MONEY_SECTION}\n            </article>\n        </div>\n    </main>\n\n    <footer>'
            
            new_content = re.sub(pattern, replacement, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated: {filepath}")
        else:
            print(f"⏭️ Skipped: {filepath}")

print(f"\nDone! All money pages now have Billionaire Brain Wave ($42 per sale).")