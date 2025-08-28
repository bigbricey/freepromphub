// Enhanced Feedback System for FreePromptHub
// Provides toast notifications, loading states, and error handling

class FeedbackSystem {
    constructor() {
        this.toastContainer = null;
        this.activeToasts = new Map();
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toast-container';
            this.toastContainer.className = 'toast-container';
            this.toastContainer.setAttribute('aria-live', 'polite');
            this.toastContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.toastContainer);
        } else {
            this.toastContainer = document.getElementById('toast-container');
        }
    }

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const toastId = Date.now().toString();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        // Icons for different types
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            loading: '⏳'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            ${type !== 'loading' ? '<button class="toast-close" aria-label="Close">×</button>' : ''}
        `;

        // Add to container
        this.toastContainer.appendChild(toast);
        this.activeToasts.set(toastId, toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.removeToast(toastId));
        }

        // Auto remove for non-loading toasts
        if (type !== 'loading' && duration > 0) {
            setTimeout(() => this.removeToast(toastId), duration);
        }

        return toastId;
    }

    // Remove toast
    removeToast(toastId) {
        const toast = this.activeToasts.get(toastId);
        if (toast) {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.activeToasts.delete(toastId);
            }, 300);
        }
    }

    // Update existing toast
    updateToast(toastId, message, type = 'info') {
        const toast = this.activeToasts.get(toastId);
        if (toast) {
            const messageEl = toast.querySelector('.toast-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
            
            // Update type class
            toast.className = `toast toast-${type} toast-show`;
            
            // Update icon
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️',
                loading: '⏳'
            };
            const iconEl = toast.querySelector('.toast-icon');
            if (iconEl) {
                iconEl.textContent = icons[type] || icons.info;
            }

            // Add close button if changing from loading
            if (type !== 'loading' && !toast.querySelector('.toast-close')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'toast-close';
                closeBtn.setAttribute('aria-label', 'Close');
                closeBtn.textContent = '×';
                closeBtn.addEventListener('click', () => this.removeToast(toastId));
                toast.appendChild(closeBtn);
            }

            // Auto remove after update
            if (type !== 'loading') {
                setTimeout(() => this.removeToast(toastId), 3000);
            }
        }
    }

    // Show loading state on element
    setLoading(element, isLoading = true, loadingText = 'Loading...') {
        if (!element) return;

        if (isLoading) {
            element.classList.add('is-loading');
            element.setAttribute('aria-busy', 'true');
            element.setAttribute('disabled', 'true');
            
            // Store original content
            if (!element.dataset.originalContent) {
                element.dataset.originalContent = element.innerHTML;
            }
            
            // Add spinner
            element.innerHTML = `
                <span class="spinner"></span>
                <span>${loadingText}</span>
            `;
        } else {
            element.classList.remove('is-loading');
            element.removeAttribute('aria-busy');
            element.removeAttribute('disabled');
            
            // Restore original content
            if (element.dataset.originalContent) {
                element.innerHTML = element.dataset.originalContent;
                delete element.dataset.originalContent;
            }
        }
    }

    // Show error state on element
    setError(element, error = null, message = 'An error occurred') {
        if (!element) return;

        element.classList.add('has-error');
        element.setAttribute('aria-invalid', 'true');

        // Create or update error message
        let errorEl = element.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.setAttribute('role', 'alert');
            element.parentElement.appendChild(errorEl);
        }
        
        errorEl.textContent = error ? error.message || message : message;

        // Remove error after 5 seconds
        setTimeout(() => this.clearError(element), 5000);
    }

    // Clear error state
    clearError(element) {
        if (!element) return;

        element.classList.remove('has-error');
        element.removeAttribute('aria-invalid');

        const errorEl = element.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // Show success state with animation
    showSuccess(element, message = 'Success!') {
        if (!element) return;

        element.classList.add('success-pulse');
        
        // Create success indicator
        const successEl = document.createElement('span');
        successEl.className = 'success-indicator';
        successEl.textContent = '✓';
        element.appendChild(successEl);

        // Animate and remove
        setTimeout(() => {
            element.classList.remove('success-pulse');
            if (successEl.parentNode) {
                successEl.remove();
            }
        }, 2000);
    }

    // Validate input with feedback
    validateInput(input, rules = {}) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (rules.required && !value) {
            isValid = false;
            errorMessage = rules.requiredMessage || 'This field is required';
        }

        // Min length check
        if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.minLengthMessage || `Minimum ${rules.minLength} characters required`;
        }

        // Max length check
        if (rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.maxLengthMessage || `Maximum ${rules.maxLength} characters allowed`;
        }

        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.patternMessage || 'Invalid format';
        }

        // Email check
        if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Show feedback
        if (!isValid) {
            this.setError(input, null, errorMessage);
        } else {
            this.clearError(input);
            input.classList.add('is-valid');
            setTimeout(() => input.classList.remove('is-valid'), 2000);
        }

        return isValid;
    }

    // Confirm action with modal
    async confirm(message, title = 'Confirm Action') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            modal.innerHTML = `
                <div class="confirm-modal-content">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="confirm-modal-buttons">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-confirm">Confirm</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Animate in
            requestAnimationFrame(() => {
                modal.classList.add('confirm-modal-show');
            });

            // Button handlers
            const confirmBtn = modal.querySelector('.btn-confirm');
            const cancelBtn = modal.querySelector('.btn-cancel');

            const closeModal = (result) => {
                modal.classList.remove('confirm-modal-show');
                setTimeout(() => {
                    modal.remove();
                    resolve(result);
                }, 300);
            };

            confirmBtn.addEventListener('click', () => closeModal(true));
            cancelBtn.addEventListener('click', () => closeModal(false));
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(false);
                }
            });
        });
    }

    // Progress bar for long operations
    showProgress(title = 'Processing...', steps = []) {
        const progressModal = document.createElement('div');
        progressModal.className = 'progress-modal';
        progressModal.innerHTML = `
            <div class="progress-modal-content">
                <h3>${title}</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
                <p class="progress-status">Initializing...</p>
                <div class="progress-steps">
                    ${steps.map((step, i) => `
                        <div class="progress-step" data-step="${i}">
                            <span class="step-icon">○</span>
                            <span class="step-text">${step}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(progressModal);

        // Animate in
        requestAnimationFrame(() => {
            progressModal.classList.add('progress-modal-show');
        });

        return {
            update: (percent, status) => {
                const fill = progressModal.querySelector('.progress-bar-fill');
                const statusEl = progressModal.querySelector('.progress-status');
                if (fill) fill.style.width = `${percent}%`;
                if (statusEl) statusEl.textContent = status;
            },
            completeStep: (stepIndex) => {
                const step = progressModal.querySelector(`[data-step="${stepIndex}"]`);
                if (step) {
                    step.classList.add('step-complete');
                    step.querySelector('.step-icon').textContent = '✓';
                }
            },
            close: () => {
                progressModal.classList.remove('progress-modal-show');
                setTimeout(() => progressModal.remove(), 300);
            }
        };
    }
}

// Initialize feedback system
const feedback = new FeedbackSystem();

// Enhanced copy button functionality with better feedback
function enhancedCopyToClipboard(text, button) {
    // Disable button during operation
    button.disabled = true;
    button.classList.add('copying');
    
    // Store original button content
    const originalContent = button.innerHTML;
    button.innerHTML = '<span class="spinner-small"></span> Copying...';
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Success feedback
                button.classList.remove('copying');
                button.classList.add('copied');
                button.innerHTML = '<span class="success-icon">✓</span> Copied!';
                feedback.showToast('Prompt copied to clipboard!', 'success');
                
                // Track analytics
                if (window.simpleAnalytics && window.simpleAnalytics.trackPromptCopy) {
                    const promptTitle = document.querySelector('.prompt-title')?.textContent || 'Unknown';
                    const category = document.querySelector('.breadcrumb a:last-of-type')?.textContent || 'general';
                    window.simpleAnalytics.trackPromptCopy(promptTitle, category);
                }
                
                // Reset button after delay
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
            })
            .catch((err) => {
                // Error feedback
                console.error('Clipboard API failed:', err);
                button.classList.remove('copying');
                button.classList.add('error');
                button.innerHTML = '<span class="error-icon">⚠</span> Failed';
                feedback.showToast('Failed to copy. Please try selecting and copying manually.', 'error', 5000);
                
                // Reset button
                setTimeout(() => {
                    button.classList.remove('error');
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
                
                // Fallback to legacy method
                fallbackCopy(text, button, originalContent);
            });
    } else {
        // Use fallback for older browsers
        fallbackCopy(text, button, originalContent);
    }
}

// Fallback copy method with feedback
function fallbackCopy(text, button, originalContent) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    
    try {
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        const success = document.execCommand('copy');
        
        if (success) {
            button.classList.remove('copying');
            button.classList.add('copied');
            button.innerHTML = '<span class="success-icon">✓</span> Copied!';
            feedback.showToast('Prompt copied!', 'success');
        } else {
            throw new Error('execCommand failed');
        }
    } catch (err) {
        button.classList.remove('copying');
        button.classList.add('error');
        button.innerHTML = '<span class="error-icon">⚠</span> Failed';
        feedback.showToast('Copy failed. Please select the text and press Ctrl+C.', 'error', 5000);
    } finally {
        document.body.removeChild(textarea);
        setTimeout(() => {
            button.classList.remove('copied', 'error');
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 2000);
    }
}

// Export for use in other scripts
window.feedback = feedback;
window.enhancedCopyToClipboard = enhancedCopyToClipboard;