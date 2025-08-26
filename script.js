// Copy to Clipboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copy-button');
    const promptTextarea = document.getElementById('prompt-text');
    
    if (copyButton && promptTextarea) {
        copyButton.addEventListener('click', function() {
            copyToClipboard(promptTextarea.value);
        });
    }
});

function copyToClipboard(text) {
    const copyButton = document.getElementById('copy-button');
    
    // Modern clipboard API (preferred method)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopySuccess();
        }).catch(function(err) {
            // Fallback to older method if modern API fails
            fallbackCopyToClipboard(text);
        });
    } else {
        // Use fallback method for older browsers
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    // Create a temporary textarea element
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    tempTextarea.style.position = 'fixed';
    tempTextarea.style.left = '-9999px';
    tempTextarea.style.top = '0';
    tempTextarea.setAttribute('readonly', '');
    
    document.body.appendChild(tempTextarea);
    
    // Select the text
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        // Execute copy command
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            console.error('Failed to copy text');
        }
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
    
    // Remove temporary textarea
    document.body.removeChild(tempTextarea);
}

function showCopySuccess() {
    const copyButton = document.getElementById('copy-button');
    
    // Add success state
    copyButton.classList.add('copied');
    
    // Remove success state after 2 seconds
    setTimeout(function() {
        copyButton.classList.remove('copied');
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

// Optional: Track copy events for analytics
function trackCopyEvent() {
    // Add your analytics tracking code here
    // Example: gtag('event', 'copy', { 'event_category': 'prompt' });
    console.log('Prompt copied successfully');
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
