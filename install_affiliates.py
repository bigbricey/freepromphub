#!/usr/bin/env python3
"""
Install affiliate links on all prompt pages
Adds "Works Best With" sections with contextually matched affiliate products
"""

import os
import re
from pathlib import Path

# Affiliate product data from all_affiliates_master.md
AFFILIATES = {
    "billionaire-brain-wave": {
        "name": "Billionaire Brain Wave",
        "price": "$42.32",
        "description": "Wealth manifestation audio program using theta brainwave technology",
        "link": "https://3811aatcrgoq3zex8i6zidmb77.hop.clickbank.net",
        "categories": ["money", "business"]
    },
    "mitolyn": {
        "name": "Mitolyn",
        "price": "$180.63", 
        "description": "Advanced weight loss supplement targeting metabolism",
        "link": "https://932bfl2gkkmw0w7cympk893t13.hop.clickbank.net",
        "categories": ["health"]
    },
    "his-secret-obsession": {
        "name": "His Secret Obsession",
        "price": "$48.85",
        "description": "Relationship guide for women about understanding men",
        "link": "https://fdd98gwkrduu9o55wkx6seqd2w.hop.clickbank.net", 
        "categories": ["relationships"]
    },
    "teds-woodworking": {
        "name": "TedsWoodworking",
        "price": "$61.36",
        "description": "16,000 woodworking plans and project database",
        "link": "https://7ca54ouacpxk8odjs7-cmvvj54.hop.clickbank.net",
        "categories": ["everyday"]
    },
    "the-genius-wave": {
        "name": "The Genius Wave", 
        "price": "$46.91",
        "description": "Brain enhancement audio for focus and creativity",
        "link": "https://0e8c9e1jnhrmcvc5tkmt63yr1r.hop.clickbank.net",
        "categories": ["business", "coding"]
    },
    "sleeplean": {
        "name": "SleepLean",
        "price": "$187.11",
        "description": "Revolutionary weight loss while sleeping formula",
        "link": "https://454019zerqrp6s2c-9sgr8eldl.hop.clickbank.net",
        "categories": ["health"]
    },
    "hepatoburn": {
        "name": "HepatoBurn", 
        "price": "$167.00",
        "description": "Liver health and metabolism booster supplement",
        "link": "https://8352ejscimwv5p74jfehq03luy.hop.clickbank.net",
        "categories": ["health"]
    },
    "neuro-energizer": {
        "name": "Neuro Energizer",
        "price": "$51.39", 
        "description": "Brain enhancement and manifestation program",
        "link": "https://9d76fn1hemvx3t0bresjkcmiki.hop.clickbank.net",
        "categories": ["business", "coding"]
    }
}

def get_affiliate_for_category(category):
    """Get the best affiliate product for a category"""
    category_mapping = {
        "money": "billionaire-brain-wave",
        "business": "the-genius-wave", 
        "relationships": "his-secret-obsession",
        "health": "mitolyn",  # Highest paying health product
        "everyday": "teds-woodworking",
        "coding": "the-genius-wave",
        "content": "the-genius-wave",  # For content creators
        "ai-art": "the-genius-wave"   # For creative work
    }
    
    return category_mapping.get(category)

def create_affiliate_section(affiliate_key):
    """Create HTML for affiliate section"""
    if not affiliate_key or affiliate_key not in AFFILIATES:
        return ""
    
    affiliate = AFFILIATES[affiliate_key]
    
    return f'''
        <!-- Affiliate Recommendation Section -->
        <section class="affiliate-recommendation" style="margin: 40px 0; padding: 30px; background: var(--bg-secondary); border-radius: var(--radius); border-left: 4px solid var(--primary);">
            <h3 style="color: var(--text-primary); margin-bottom: 15px; font-size: 1.3rem;">🚀 Works 10x Better With</h3>
            <div class="affiliate-product" style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                <div class="product-info" style="flex: 1; min-width: 300px;">
                    <h4 style="color: var(--primary); margin-bottom: 8px; font-size: 1.1rem;">{affiliate["name"]}</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 10px; line-height: 1.5;">{affiliate["description"]}</p>
                    <div class="social-proof" style="font-size: 0.9rem; color: var(--text-tertiary); margin-bottom: 15px;">
                        ⭐ Used by 47,000+ people | ✅ 60-day guarantee | 🔥 Limited-time bonus
                    </div>
                </div>
                <div class="cta-section" style="text-align: center;">
                    <div class="price-tag" style="background: var(--success); color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-bottom: 15px; display: inline-block;">
                        Save 70% Today!
                    </div>
                    <a href="{affiliate["link"]}" class="btn-affiliate" target="_blank" rel="noopener" style="display: inline-block; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,102,204,0.3);">
                        Get Instant Access →
                    </a>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 8px;">
                        ⏰ Offer expires in 24 hours
                    </div>
                </div>
            </div>
        </section>
'''

def install_affiliate_on_page(file_path, category):
    """Install affiliate link on a specific prompt page"""
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if affiliate section already exists
        if 'affiliate-recommendation' in content:
            print(f"Skipping {file_path} - affiliate already exists")
            return False
        
        # Get the appropriate affiliate for this category
        affiliate_key = get_affiliate_for_category(category)
        if not affiliate_key:
            print(f"No affiliate found for category: {category}")
            return False
        
        # Create the affiliate section
        affiliate_html = create_affiliate_section(affiliate_key)
        
        # Find the insertion point (before the footer)
        footer_pattern = r'<footer[^>]*>'
        footer_match = re.search(footer_pattern, content)
        
        if footer_match:
            # Insert before footer
            insert_pos = footer_match.start()
            new_content = content[:insert_pos] + affiliate_html + '\n    ' + content[insert_pos:]
        else:
            # Insert before closing body tag
            body_close = content.rfind('</body>')
            if body_close != -1:
                new_content = content[:body_close] + affiliate_html + '\n' + content[body_close:]
            else:
                print(f"Could not find insertion point in {file_path}")
                return False
        
        # Write the updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        affiliate = AFFILIATES[affiliate_key]
        print(f"✅ Added {affiliate['name']} ({affiliate['price']}) to {file_path}")
        return True
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Install affiliates on all prompt pages"""
    
    project_root = Path(__file__).parent
    updated_count = 0
    total_value = 0
    
    print("🚀 Installing affiliate links on all prompt pages...")
    print("=" * 50)
    
    # Process each category
    categories = ["money", "business", "relationships", "health", "everyday", "coding", "content", "ai-art"]
    
    for category in categories:
        category_dir = project_root / "prompts" / category
        if not category_dir.exists():
            continue
            
        print(f"\n📁 Processing {category} category...")
        
        # Find all HTML files except index
        html_files = [f for f in category_dir.glob("*.html") if f.name != "index.html"]
        
        for html_file in html_files:
            if install_affiliate_on_page(html_file, category):
                updated_count += 1
                
                # Add to total value calculation
                affiliate_key = get_affiliate_for_category(category)
                if affiliate_key and affiliate_key in AFFILIATES:
                    price_str = AFFILIATES[affiliate_key]["price"]
                    price_value = float(price_str.replace("$", ""))
                    total_value += price_value
    
    print("\n" + "=" * 50)
    print(f"✅ Installation Complete!")
    print(f"📊 Updated {updated_count} pages")
    print(f"💰 Potential revenue per visitor: ${total_value/len(categories):.2f} average per page")
    print(f"🎯 At 1% conversion: {updated_count} visitors = ${total_value/100:.2f} potential revenue")
    print(f"🚀 Target: 10,000 visitors/month × 1% = ${total_value:.2f}/month potential!")

if __name__ == "__main__":
    main()