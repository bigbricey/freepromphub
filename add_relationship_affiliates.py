#!/usr/bin/env python3
import os
import re
import glob

# His Secret Obsession affiliate section
RELATIONSHIP_SECTION = '''
                <!-- Affiliate Recommendation -->
                <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%); border-radius: 10px;">
                    <h2 style="color: white; margin-bottom: 15px;">💕 Want Deeper Connection?</h2>
                    <p style="color: white; margin-bottom: 20px;">This prompt helps with communication. Want to understand what really makes relationships work? His Secret Obsession reveals the #1 thing men secretly crave (that 99% of women miss).</p>
                    <a href="https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net" target="_blank" style="display: inline-block; background: white; color: #ff6b6b; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Discover His Secret Obsession →</a>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;"><em>*Sponsored - We may earn a commission if you purchase. This helps us keep all prompts free.</em></p>
                </section>'''

# Find all relationship HTML files
relationship_files = glob.glob('prompts/relationships/*.html')

# Remove index.html from the list
relationship_files = [f for f in relationship_files if not f.endswith('index.html')]

print(f"Found {len(relationship_files)} relationship prompt files")

for filepath in relationship_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if affiliate section already exists
        if '<!-- Affiliate Recommendation -->' not in content:
            # Find the closing of related-prompts section
            pattern = r'(                </section>\s*</article>\s*</div>\s*</main>\s*\n\s*<footer>)'
            replacement = f'                </section>\n{RELATIONSHIP_SECTION}\n            </article>\n        </div>\n    </main>\n\n    <footer>'
            
            new_content = re.sub(pattern, replacement, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated: {filepath}")
        else:
            print(f"⏭️ Skipped (already has affiliate): {filepath}")

print(f"\nDone! All relationship pages now have His Secret Obsession affiliate links ($48 per sale).")