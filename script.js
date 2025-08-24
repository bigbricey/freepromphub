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