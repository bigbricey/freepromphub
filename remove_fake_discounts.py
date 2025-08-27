#!/usr/bin/env python3
import os
import glob
import re

def fix_affiliate_messaging(filepath):
    """Remove fake discount claims and use honest messaging"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Remove all variations of fake discount claims
        replacements = [
            ('⚠️ 67% OFF TODAY - ', ''),
            ('67% OFF TODAY - ', ''),
            ('⚠️ 67% OFF - ', ''),
            ('67% OFF - ', ''),
            ('Get 67% Off Today Only →', 'Learn More →'),
            ('67% off today only!', 'Special offer available'),
        ]
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        # If changes were made, write back
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"  Error in {filepath}: {e}")
        return False

print("REMOVING ILLEGAL DISCOUNT CLAIMS FROM ALL PAGES")
print("=" * 50)
print("Replacing fake '67% OFF' with honest messaging\n")

categories = ['business', 'everyday', 'content', 'coding', 'relationships', 'health', 'money']
total_fixed = 0

for category in categories:
    files = glob.glob(f'prompts/{category}/*.html')
    prompts = [f for f in files if not f.endswith('index.html')]
    
    if prompts:
        print(f"{category.upper()} ({len(prompts)} files):")
        fixed = 0
        for filepath in prompts:
            if fix_affiliate_messaging(filepath):
                print(f"  Fixed: {os.path.basename(filepath)}")
                fixed += 1
        
        if fixed > 0:
            print(f"  Removed fake discounts from {fixed} files")
            total_fixed += fixed
        else:
            print(f"  No fake discounts found")
        print()

print("=" * 50)
print(f"TOTAL: Fixed {total_fixed} pages")
print("\nAll affiliate sections now use honest messaging!")
print("No more illegal discount claims that could get you in trouble.")
