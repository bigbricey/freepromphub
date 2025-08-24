import os
import re

def fix_paths_in_file(filepath):
    """Fix relative paths to absolute paths in HTML files"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Track if we made changes
    original_content = content
    
    # Fix CSS link
    content = content.replace('href="../../style.css"', 'href="/style.css"')
    content = content.replace('href="../style.css"', 'href="/style.css"')
    
    # Fix JavaScript links
    content = content.replace('src="../../script.js"', 'src="/script.js"')
    content = content.replace('src="../../search.js"', 'src="/search.js"')
    content = content.replace('src="../script.js"', 'src="/script.js"')
    
    # Fix home links
    content = content.replace('href="../../index.html"', 'href="/"')
    content = content.replace('href="../index.html"', 'href="/"')
    
    # Fix navigation links in header
    content = re.sub(r'<h1><a href="[^"]*">FreePromptHub</a></h1>', 
                     '<h1><a href="/">FreePromptHub</a></h1>', content)
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filepath}")
        return True
    return False

def process_directory(directory):
    """Process all HTML files in directory and subdirectories"""
    fixed_count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                if fix_paths_in_file(filepath):
                    fixed_count += 1
    return fixed_count

# Fix all HTML files in prompts directory
prompts_dir = r"C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\prompts"
fixed = process_directory(prompts_dir)
print(f"\nTotal files fixed: {fixed}")

# Also fix the main index.html if needed
index_file = r"C:\Users\bigbr\OneDrive\Desktop\claude_workspace\projects\FreePromptHub\index.html"
if os.path.exists(index_file):
    if fix_paths_in_file(index_file):
        print("Fixed main index.html")
