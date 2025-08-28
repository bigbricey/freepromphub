#!/usr/bin/env python3
"""
Script to standardize headers across all HTML pages in the FreePromptHub site.
Replaces old header structure with new mobile-friendly navigation header.
"""

import os
import re

# New standardized header HTML
NEW_HEADER = '''    <!-- Standardized Header with Mobile Navigation -->
    <header class="site-header">
        <div class="container header-content">
            <a class="brand" href="/">
                <span style="font-size: 1.5rem; margin-right: 5px;">🚀</span>
                FreePromptHub
            </a>
            <button class="mobile-menu-toggle" aria-label="Menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="main-nav" aria-label="Primary">
                <a href="/prompts/business/">Business</a>
                <a href="/prompts/content/">Content</a>
                <a href="/prompts/coding/">Coding</a>
                <a href="/about.html">About</a>
                <a class="btn-primary" href="/#categories">Get Prompts</a>
            </nav>
        </div>
    </header>'''

# Pattern to match old header structure
OLD_HEADER_PATTERN = r'<header>.*?</header>'

def update_file(filepath):
    """Update a single HTML file with standardized header"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has new header
        if 'site-header' in content and 'mobile-menu-toggle' in content:
            print(f"  ✓ Already updated: {filepath}")
            return False
        
        # Skip index.html as it already has the new header
        if filepath.endswith('index.html') and 'site-header' in content:
            print(f"  ✓ Skipping index.html (already has new header)")
            return False
        
        # Replace old header with new one
        updated_content = re.sub(
            OLD_HEADER_PATTERN,
            NEW_HEADER,
            content,
            flags=re.DOTALL
        )
        
        # Make sure script.js is included if not already
        if '/script.js' not in updated_content:
            # Add script.js before closing </head>
            updated_content = updated_content.replace(
                '</head>',
                '    <script src="/script.js" defer></script>\n</head>'
            )
        
        # Write updated content back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"  ✅ Updated: {filepath}")
        return True
    
    except Exception as e:
        print(f"  ❌ Error updating {filepath}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    root_dir = r'C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub'
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    print("Starting header standardization...")
    print("=" * 50)
    
    # Process HTML files in root directory
    print("\nProcessing root directory files...")
    for filename in os.listdir(root_dir):
        if filename.endswith('.html'):
            filepath = os.path.join(root_dir, filename)
            if update_file(filepath):
                updated_count += 1
            else:
                skipped_count += 1
    
    # Process HTML files in prompts directory and subdirectories
    prompts_dir = os.path.join(root_dir, 'prompts')
    if os.path.exists(prompts_dir):
        print("\nProcessing prompts directory files...")
        for root, dirs, files in os.walk(prompts_dir):
            for filename in files:
                if filename.endswith('.html'):
                    filepath = os.path.join(root, filename)
                    if update_file(filepath):
                        updated_count += 1
                    else:
                        skipped_count += 1
    
    print("\n" + "=" * 50)
    print(f"Header Standardization Complete!")
    print(f"  Files updated: {updated_count}")
    print(f"  Files skipped: {skipped_count}")
    print(f"  Errors: {error_count}")

if __name__ == "__main__":
    main()