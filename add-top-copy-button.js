const fs = require('fs');
const path = require('path');

// Function to add top copy button to HTML files
function addTopCopyButton(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has top copy button
    if (content.includes('copy-button-top')) {
        console.log(`✓ ${filePath} already has top copy button`);
        return false;
    }
    
    // Find the prompt-content div and add copy button at the top
    const promptContentRegex = /(<div class="prompt-content">)/;
    
    if (promptContentRegex.test(content)) {
        const topCopyButton = `$1
                    <!-- Prominent Top Copy Button -->
                    <div class="copy-button-container-top">
                        <button id="copy-button-top" class="copy-button-top" aria-label="Copy prompt to clipboard">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span class="button-text">Copy Prompt</span>
                            <span class="success-text">✓ Copied!</span>
                        </button>
                        <span class="shortcut-hint">or press Ctrl+Shift+C</span>
                    </div>`;
        
        content = content.replace(promptContentRegex, topCopyButton);
        
        // Add the JavaScript to handle the top copy button
        const scriptAddition = `
    <!-- Top Copy Button Handler -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const topCopyButton = document.getElementById('copy-button-top');
            const bottomCopyButton = document.getElementById('copy-button');
            const promptTextarea = document.getElementById('prompt-text');
            
            if (topCopyButton && promptTextarea) {
                // Function to handle copy
                function handleCopy(button) {
                    const text = promptTextarea.value;
                    
                    // Visual feedback
                    button.classList.add('copying');
                    
                    // Copy to clipboard
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(function() {
                            // Success
                            button.classList.remove('copying');
                            button.classList.add('copied');
                            
                            // Track event
                            if (typeof trackCopyEvent === 'function') {
                                trackCopyEvent();
                            }
                            
                            setTimeout(() => {
                                button.classList.remove('copied');
                            }, 2000);
                        }).catch(function(err) {
                            // Error
                            button.classList.remove('copying');
                            button.classList.add('error');
                            console.error('Failed to copy:', err);
                            
                            setTimeout(() => {
                                button.classList.remove('error');
                            }, 2000);
                        });
                    }
                }
                
                // Add click handler to top button
                topCopyButton.addEventListener('click', function() {
                    handleCopy(this);
                });
                
                // Sync with bottom button if it exists
                if (bottomCopyButton) {
                    bottomCopyButton.addEventListener('click', function() {
                        handleCopy(topCopyButton);
                    });
                }
                
                // Add keyboard shortcut
                document.addEventListener('keydown', function(e) {
                    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                        e.preventDefault();
                        handleCopy(topCopyButton);
                    }
                });
            }
        });
    </script>`;
        
        // Add script before closing body tag
        content = content.replace('</body>', scriptAddition + '\n</body>');
        
        // Add CSS for the top copy button
        const cssAddition = `
    <style>
        /* Top Copy Button Styles */
        .copy-button-container-top {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            border: 2px solid #0284c7;
        }
        
        .copy-button-top {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }
        
        .copy-button-top:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
            background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
        }
        
        .copy-button-top:active {
            transform: translateY(0);
        }
        
        .copy-button-top svg {
            width: 20px;
            height: 20px;
        }
        
        .copy-button-top .success-text {
            display: none;
        }
        
        .copy-button-top.copying {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            animation: pulse 0.5s ease;
        }
        
        .copy-button-top.copied {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .copy-button-top.copied .button-text {
            display: none;
        }
        
        .copy-button-top.copied .success-text {
            display: inline;
        }
        
        .copy-button-top.error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        
        .shortcut-hint {
            color: #64748b;
            font-size: 14px;
            font-style: italic;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .copy-button-container-top {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            
            .copy-button-top {
                width: 100%;
                justify-content: center;
            }
            
            .shortcut-hint {
                display: none;
            }
        }
        
        /* Dark mode support */
        [data-theme="dark"] .copy-button-container-top {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-color: #0ea5e9;
        }
        
        [data-theme="dark"] .copy-button-top {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        }
        
        [data-theme="dark"] .shortcut-hint {
            color: #94a3b8;
        }
    </style>`;
        
        // Add CSS in head
        content = content.replace('</head>', cssAddition + '\n</head>');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${filePath}`);
        return true;
    } else {
        console.log(`⚠️ ${filePath} - Could not find prompt-content div`);
        return false;
    }
}

// Process all prompt HTML files
function processAllPromptFiles() {
    const promptsDir = path.join(__dirname, 'prompts');
    let updatedCount = 0;
    let totalCount = 0;
    
    // Get all subdirectories
    const categories = fs.readdirSync(promptsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log('Adding prominent copy buttons to all prompt pages...\n');
    
    categories.forEach(category => {
        const categoryDir = path.join(promptsDir, category);
        const files = fs.readdirSync(categoryDir);
        
        files.forEach(file => {
            if (file.endsWith('.html') && file !== 'index.html') {
                totalCount++;
                const filePath = path.join(categoryDir, file);
                if (addTopCopyButton(filePath)) {
                    updatedCount++;
                }
            }
        });
    });
    
    console.log(`\n✨ Complete! Updated ${updatedCount}/${totalCount} prompt files.`);
}

// Run the script
processAllPromptFiles();