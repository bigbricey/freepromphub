const fs = require('fs');
const path = require('path');

// Script references to add to HTML files
const validationScripts = `
    <!-- Input Validation Scripts -->
    <script src="/js/input-validator.js"></script>
    <script src="/js/form-validation.js"></script>
    <link rel="stylesheet" href="/css/form-validation.css">`;

// Function to add validation to HTML file
function addValidation(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if validation is already added
    if (content.includes('input-validator.js')) {
        console.log(`✓ Already has validation: ${filePath}`);
        return false;
    }
    
    // Check if file has forms
    if (!content.includes('<form') && !content.includes('<input') && !content.includes('<textarea')) {
        console.log(`⊘ No forms found: ${filePath}`);
        return false;
    }
    
    // Add validation scripts before closing </body>
    if (content.includes('</body>')) {
        content = content.replace('</body>', validationScripts + '\n</body>');
    } else {
        // If no body tag, add at the end
        content += validationScripts;
    }
    
    // Update form elements with proper attributes
    
    // Add required attributes to common fields
    content = content.replace(/<input([^>]*?)type="email"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('required')) {
            return `<input${p1}type="email"${p2} required>`;
        }
        return match;
    });
    
    content = content.replace(/<input([^>]*?)type="password"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('required')) {
            return `<input${p1}type="password"${p2} required>`;
        }
        return match;
    });
    
    // Add maxlength to text inputs
    content = content.replace(/<input([^>]*?)type="text"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('maxlength')) {
            return `<input${p1}type="text"${p2} maxlength="200">`;
        }
        return match;
    });
    
    // Add maxlength to textareas
    content = content.replace(/<textarea([^>]*?)>/gi, (match, p1) => {
        if (!match.includes('maxlength')) {
            return `<textarea${p1} maxlength="5000">`;
        }
        return match;
    });
    
    // Add autocomplete attributes for better UX and security
    content = content.replace(/<input([^>]*?)type="email"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('autocomplete')) {
            return match.replace('>', ' autocomplete="email">');
        }
        return match;
    });
    
    content = content.replace(/<input([^>]*?)type="password"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('autocomplete')) {
            // Check if it's a login or register form
            if (content.includes('login') || content.includes('signin')) {
                return match.replace('>', ' autocomplete="current-password">');
            } else {
                return match.replace('>', ' autocomplete="new-password">');
            }
        }
        return match;
    });
    
    content = content.replace(/<input([^>]*?)name="name"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('autocomplete')) {
            return match.replace('>', ' autocomplete="name">');
        }
        return match;
    });
    
    // Add pattern attributes for common fields
    content = content.replace(/<input([^>]*?)type="tel"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('pattern')) {
            return match.replace('>', ' pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="Format: 123-456-7890">');
        }
        return match;
    });
    
    // Add min/max for number inputs
    content = content.replace(/<input([^>]*?)type="number"([^>]*?)>/gi, (match, p1, p2) => {
        if (!match.includes('min=') && !match.includes('max=')) {
            return match.replace('>', ' min="0" max="999999">');
        }
        return match;
    });
    
    // Add form-group wrapper to inputs if not already wrapped
    const formGroupRegex = /<label[^>]*>([^<]*)<\/label>\s*<input([^>]*?)>/gi;
    content = content.replace(formGroupRegex, (match, labelText, inputAttrs) => {
        if (!content.includes('form-group')) {
            return `<div class="form-group">
                <label>${labelText}</label>
                <input${inputAttrs}>
            </div>`;
        }
        return match;
    });
    
    // Add aria-required to required fields
    content = content.replace(/required>/gi, 'required aria-required="true">');
    
    // Add role="form" to forms without it
    content = content.replace(/<form([^>]*?)>/gi, (match, attrs) => {
        if (!match.includes('role=')) {
            return `<form${attrs} role="form">`;
        }
        return match;
    });
    
    // Add novalidate to forms to use custom validation
    content = content.replace(/<form([^>]*?)>/gi, (match, attrs) => {
        if (!match.includes('novalidate')) {
            return match.replace('>', ' novalidate>');
        }
        return match;
    });
    
    // Write the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added validation to: ${filePath}`);
    return true;
}

// Process all HTML files
function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let updatedCount = 0;
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip certain directories
            if (!['js', 'css', 'images', 'node_modules', '.git'].includes(file)) {
                updatedCount += processDirectory(filePath);
            }
        } else if (file.endsWith('.html')) {
            if (addValidation(filePath)) {
                updatedCount++;
            }
        }
    }
    
    return updatedCount;
}

// Run the script
console.log('Adding input validation to all HTML pages...\n');
const rootDir = 'C:\\Users\\bigbr\\OneDrive\\Desktop\\claude_workspace\\projects\\FreePromptHub';
const updatedFiles = processDirectory(rootDir);
console.log(`\n✨ Complete! Updated ${updatedFiles} files with input validation.`);