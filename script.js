// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.site-header')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Copy to Clipboard Functionality with Enhanced Feedback
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copy-button');
    const promptTextarea = document.getElementById('prompt-text');
    
    if (copyButton && promptTextarea) {
        copyButton.addEventListener('click', function() {
            // Use enhanced copy if feedback system is loaded
            if (window.enhancedCopyToClipboard) {
                enhancedCopyToClipboard(promptTextarea.value, copyButton);
            } else {
                // Fallback to basic copy
                copyToClipboard(promptTextarea.value);
            }
        });
        
        // Add keyboard shortcut hint on hover
        copyButton.setAttribute('title', 'Copy prompt (Ctrl+Shift+C)');
    }
});

function copyToClipboard(text) {
    const copyButton = document.getElementById('copy-button');
    
    // Add visual feedback
    copyButton.disabled = true;
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copying...';
    
    // Modern clipboard API (preferred method)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopySuccess();
            copyButton.textContent = 'Copied!';
            
            // Show toast if feedback system is available
            if (window.feedback) {
                window.feedback.showToast('Prompt copied to clipboard!', 'success');
            }
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.disabled = false;
            }, 2000);
        }).catch(function(err) {
            // Show error feedback
            copyButton.textContent = 'Copy Failed';
            copyButton.classList.add('error');
            
            if (window.feedback) {
                window.feedback.showToast('Failed to copy. Try selecting and pressing Ctrl+C.', 'error');
            }
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.disabled = false;
                copyButton.classList.remove('error');
            }, 2000);
            
            // Try fallback
            fallbackCopyToClipboard(text);
        });
    } else {
        // Use fallback method for older browsers
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const copyButton = document.getElementById('copy-button');
    const originalText = copyButton.textContent;
    
    // Create a temporary textarea element
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    tempTextarea.style.position = 'fixed';
    tempTextarea.style.left = '-9999px';
    tempTextarea.style.top = '0';
    tempTextarea.setAttribute('readonly', '');
    tempTextarea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(tempTextarea);
    
    // Select the text
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        // Execute copy command
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
            copyButton.textContent = 'Copied!';
            
            if (window.feedback) {
                window.feedback.showToast('Prompt copied!', 'success');
            }
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Failed to copy text:', err);
        copyButton.classList.add('error');
        copyButton.textContent = 'Copy Failed';
        
        if (window.feedback) {
            window.feedback.showToast('Please select the text and press Ctrl+C to copy.', 'warning');
        }
    }
    
    // Remove temporary textarea
    document.body.removeChild(tempTextarea);
    
    // Reset button
    setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.disabled = false;
        copyButton.classList.remove('error');
    }, 2000);
}

function showCopySuccess() {
    const copyButton = document.getElementById('copy-button');
    
    // Add success state with animation
    copyButton.classList.add('copied');
    
    // Add checkmark temporarily
    const checkmark = document.createElement('span');
    checkmark.className = 'success-indicator';
    checkmark.textContent = '✓';
    checkmark.style.marginLeft = '5px';
    copyButton.appendChild(checkmark);
    
    // Track the copy event
    trackCopyEvent();
    
    // Remove success state after animation
    setTimeout(function() {
        copyButton.classList.remove('copied');
        if (checkmark.parentNode) {
            checkmark.remove();
        }
    }, 2000);
}

// Optional: Auto-resize textarea based on content
function autoResizeTextarea() {
    const textarea = document.getElementById('prompt-text');
    if (textarea) {
        // Reset height to recalculate
        textarea.style.height = 'auto';
        // Set new height based on scrollHeight
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}

// Track copy events for analytics
function trackCopyEvent() {
    // Get prompt title and category from page
    const promptTitle = document.querySelector('.prompt-title')?.textContent || 'Unknown Prompt';
    const breadcrumb = document.querySelector('.breadcrumb');
    let category = 'general';
    
    if (breadcrumb) {
        const links = breadcrumb.querySelectorAll('a');
        if (links.length > 1) {
            category = links[links.length - 1].textContent.toLowerCase();
        }
    }
    
    // Track with simple analytics if available
    if (window.simpleAnalytics && window.simpleAnalytics.trackPromptCopy) {
        window.simpleAnalytics.trackPromptCopy(promptTitle, category);
    }
    
    console.log('Prompt copied:', promptTitle, 'Category:', category);
}

// Optional: Highlight text when textarea is focused
document.addEventListener('DOMContentLoaded', function() {
    const promptTextarea = document.getElementById('prompt-text');
    
    if (promptTextarea) {
        promptTextarea.addEventListener('focus', function() {
            this.select();
        });
        
        // Auto-resize on load
        autoResizeTextarea();
    }
});

// Optional: Add keyboard shortcut for copying (Ctrl+Shift+C)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        const promptTextarea = document.getElementById('prompt-text');
        if (promptTextarea) {
            event.preventDefault();
            copyToClipboard(promptTextarea.value);
        }
    }
});

// Back to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create the back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Site-wide affiliate disclosure injection (keeps things honest and consistent)
document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.querySelector('footer .container');
    if (!footerContainer || document.querySelector('.site-disclosure')) return;
    const disclosure = document.createElement('div');
    disclosure.className = 'site-disclosure';
    disclosure.style.marginTop = '10px';
    disclosure.style.color = '#666';
    disclosure.style.fontSize = '0.9rem';
    disclosure.innerHTML = 'FreePromptHub is 100% free. Some links may be affiliate links. Your support keeps this free. <a href="/affiliate-disclosure.html">Learn more</a>.';
    footerContainer.insertBefore(disclosure, footerContainer.querySelector('nav'));
});
