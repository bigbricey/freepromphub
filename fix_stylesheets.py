#!/usr/bin/env python3
"""
Fix missing stylesheet links in all HTML files.
Adds style.css and dark-mode.css to all pages that need them.
"""

import os
import re
from pathlib import Path

def add_stylesheets_to_html(file_path):
    """Add missing stylesheet links to an HTML file."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if style.css is already linked
    has_style_css = '<link rel="stylesheet" href="/style.css">' in content
    has_dark_mode_css = '<link rel="stylesheet" href="/css/dark-mode.css">' in content
    
    # If both stylesheets are present, skip this file
    if has_style_css and has_dark_mode_css:
        return False
    
    # Find the position to insert stylesheets (after the last meta tag or before </head>)
    # Look for the title tag as a reference point
    title_match = re.search(r'<title>.*?</title>', content)
    
    if title_match:
        # Insert after the title tag
        insert_pos = title_match.end()
        
        # Build the stylesheet links to add
        stylesheets = []
        if not has_style_css:
            stylesheets.append('    <link rel="stylesheet" href="/style.css">')
        if not has_dark_mode_css:
            stylesheets.append('    <link rel="stylesheet" href="/css/dark-mode.css">')
        
        if stylesheets:
            # Add a newline before and after for proper formatting
            stylesheet_block = '\n' + '\n'.join(stylesheets) + '\n'
            
            # Insert the stylesheets
            new_content = content[:insert_pos] + stylesheet_block + content[insert_pos:]
            
            # Write the updated content back to the file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✅ Updated: {file_path}")
            return True
    else:
        print(f"⚠️  Could not find title tag in: {file_path}")
        return False

def main():
    """Process all HTML files in the project."""
    
    # Get the current directory
    project_dir = Path.cwd()
    
    # Find all HTML files
    html_files = list(project_dir.rglob('*.html'))
    
    print(f"Found {len(html_files)} HTML files to check...")
    print()
    
    updated_count = 0
    
    for html_file in html_files:
        if add_stylesheets_to_html(html_file):
            updated_count += 1
    
    print()
    print(f"Summary: Updated {updated_count} files with missing stylesheets")

if __name__ == "__main__":
    main()