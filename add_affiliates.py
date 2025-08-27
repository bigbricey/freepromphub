#!/usr/bin/env python3
import os
import re

# Affiliate section HTML
SLEEPLEAN_SECTION = '''
                <!-- Affiliate Recommendation -->
                <section class="affiliate-section" style="margin-top: 60px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                    <h2 style="color: white; margin-bottom: 15px;">💡 Boost Your Results</h2>
                    <p style="color: white; margin-bottom: 20px;">This prompt gives you a personalized plan. Want to accelerate your results? SleepLean helps burn fat naturally while you sleep - the perfect complement to your healthy lifestyle.</p>
                    <a href="https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net" target="_blank" style="display: inline-block; background: white; color: #764ba2; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Discover SleepLean →</a>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin-top: 15px;"><em>*Sponsored - We may earn a commission if you purchase. This helps us keep all prompts free.</em></p>
                </section>'''

# Health files to update (excluding already done and index)
health_files = [
    'prompts/health/energy-boost.html',
    'prompts/health/habit-builder.html', 
    'prompts/health/home-workout.html',
    'prompts/health/meal-prep-beginner.html',
    'prompts/health/mental-health.html',
    'prompts/health/stress-relief.html'
]

for filepath in health_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if affiliate section already exists
        if '<!-- Affiliate Recommendation -->' not in content:
            # Find the closing of related-prompts section and add affiliate before article close
            pattern = r'(                </section>\s*</article>\s*</div>\s*</main>\s*\n\s*<footer>)'
            replacement = f'                </section>\n{SLEEPLEAN_SECTION}\n            </article>\n        </div>\n    </main>\n\n    <footer>'
            
            new_content = re.sub(pattern, replacement, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated: {filepath}")
        else:
            print(f"⏭️ Skipped (already has affiliate): {filepath}")

print("\nDone! All health pages now have SleepLean affiliate links.")