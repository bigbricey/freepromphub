/**
 * Form Validation Implementation
 * Applies input validation to all forms on the site
 */

class FormValidation {
    constructor() {
        this.validator = new InputValidator();
        this.forms = new Map();
        this.csrfToken = this.validator.generateCSRFToken();
        
        // Store CSRF token in session
        sessionStorage.setItem('csrfToken', this.csrfToken);
        
        // Initialize forms on page load
        this.init();
    }
    
    init() {
        // Auto-detect and enhance all forms
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceAllForms();
            this.addCSRFTokens();
            this.setupEventListeners();
        });
    }
    
    /**
     * Enhance all forms on the page
     */
    enhanceAllForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const formId = form.id || `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            form.id = formId;
            
            // Determine form type and apply rules
            const formType = this.detectFormType(form);
            const rules = this.getValidationRules(formType);
            
            this.forms.set(formId, {
                element: form,
                type: formType,
                rules: rules
            });
            
            this.enhanceForm(form, rules);
        });
    }
    
    /**
     * Detect form type based on inputs
     */
    detectFormType(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const fieldNames = Array.from(inputs).map(input => input.name || input.id);
        
        // Check for specific form types
        if (fieldNames.some(name => /email/i.test(name)) && 
            fieldNames.some(name => /password/i.test(name))) {
            return fieldNames.some(name => /confirm|register|signup/i.test(name)) ? 'register' : 'login';
        }
        
        if (fieldNames.some(name => /search/i.test(name))) {
            return 'search';
        }
        
        if (fieldNames.some(name => /email|name|message|subject/i.test(name))) {
            return 'contact';
        }
        
        if (fieldNames.some(name => /comment|review|feedback/i.test(name))) {
            return 'comment';
        }
        
        if (fieldNames.some(name => /card|cvv|billing/i.test(name))) {
            return 'payment';
        }
        
        return 'generic';
    }
    
    /**
     * Get validation rules based on form type
     */
    getValidationRules(formType) {
        const rules = {
            login: {
                email: {
                    required: true,
                    type: 'email',
                    maxLength: 255
                },
                password: {
                    required: true,
                    minLength: 8,
                    maxLength: 128,
                    htmlEncode: true
                }
            },
            register: {
                name: {
                    required: true,
                    minLength: 2,
                    maxLength: 100,
                    pattern: /^[a-zA-Z\s'-]+$/,
                    htmlEncode: true
                },
                email: {
                    required: true,
                    type: 'email',
                    maxLength: 255
                },
                password: {
                    required: true,
                    type: 'password',
                    minLength: 8,
                    maxLength: 128
                },
                confirmPassword: {
                    required: true,
                    custom: (value) => {
                        const password = document.querySelector('[name="password"]')?.value;
                        return value === password || 'Passwords do not match';
                    }
                }
            },
            search: {
                query: {
                    required: true,
                    minLength: 1,
                    maxLength: 200,
                    stripTags: true,
                    removeScripts: true
                }
            },
            contact: {
                name: {
                    required: true,
                    minLength: 2,
                    maxLength: 100,
                    pattern: /^[a-zA-Z\s'-]+$/,
                    htmlEncode: true
                },
                email: {
                    required: true,
                    type: 'email',
                    maxLength: 255
                },
                subject: {
                    required: false,
                    maxLength: 200,
                    stripTags: true
                },
                message: {
                    required: true,
                    minLength: 10,
                    maxLength: 5000,
                    stripTags: true,
                    removeScripts: true
                }
            },
            comment: {
                name: {
                    required: false,
                    maxLength: 100,
                    pattern: /^[a-zA-Z0-9\s'-]+$/,
                    htmlEncode: true
                },
                email: {
                    required: false,
                    type: 'email',
                    maxLength: 255
                },
                comment: {
                    required: true,
                    minLength: 1,
                    maxLength: 2000,
                    stripTags: true,
                    removeScripts: true
                },
                rating: {
                    required: false,
                    type: 'number',
                    min: 1,
                    max: 5
                }
            },
            payment: {
                cardNumber: {
                    required: true,
                    type: 'creditCard',
                    removeScripts: true
                },
                cardName: {
                    required: true,
                    pattern: /^[a-zA-Z\s'-]+$/,
                    maxLength: 100
                },
                expiryDate: {
                    required: true,
                    pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    custom: (value) => {
                        const [month, year] = value.split('/');
                        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                        const now = new Date();
                        return expiry > now || 'Card has expired';
                    }
                },
                cvv: {
                    required: true,
                    type: 'cvv'
                },
                billingAddress: {
                    required: true,
                    maxLength: 200,
                    stripTags: true
                },
                postalCode: {
                    required: true,
                    type: 'postalCode'
                }
            },
            generic: {
                // Default rules for unknown forms
                text: {
                    maxLength: 1000,
                    stripTags: true,
                    removeScripts: true
                },
                email: {
                    type: 'email',
                    maxLength: 255
                },
                url: {
                    type: 'url',
                    maxLength: 500
                },
                number: {
                    type: 'number'
                }
            }
        };
        
        return rules[formType] || rules.generic;
    }
    
    /**
     * Enhance individual form
     */
    enhanceForm(form, rules) {
        // Add novalidate to use custom validation
        form.setAttribute('novalidate', 'true');
        
        // Add validation on submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, rules);
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input, rules[input.name] || {});
            });
            
            // Clear errors on focus
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });
            
            // Real-time validation for certain fields
            if (input.type === 'email' || input.type === 'url') {
                input.addEventListener('input', debounce(() => {
                    this.validateField(input, rules[input.name] || {});
                }, 500));
            }
        });
        
        // Add password strength indicator
        const passwordInput = form.querySelector('input[type="password"]');
        if (passwordInput && form.querySelector('[name="confirmPassword"]')) {
            this.addPasswordStrengthIndicator(passwordInput);
        }
        
        // Add character counter for textareas
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (rules[textarea.name]?.maxLength) {
                this.addCharacterCounter(textarea, rules[textarea.name].maxLength);
            }
        });
    }
    
    /**
     * Handle form submission
     */
    async handleFormSubmit(form, rules) {
        // Check rate limiting
        const formId = form.id;
        const rateLimit = this.validator.checkRateLimit(`form_${formId}`, 5, 60000);
        
        if (!rateLimit.allowed) {
            this.showFormError(form, rateLimit.message);
            return;
        }
        
        // Clear previous errors
        this.clearFormErrors(form);
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate CSRF token
        const csrfToken = data.csrfToken || form.querySelector('[name="csrfToken"]')?.value;
        if (!this.validator.validateCSRFToken(csrfToken, this.csrfToken)) {
            this.showFormError(form, 'Security validation failed. Please refresh and try again.');
            return;
        }
        
        // Validate all fields
        const validation = this.validator.validate(data, rules);
        
        if (!validation.isValid) {
            // Show field errors
            validation.errors.forEach(error => {
                const field = form.querySelector(`[name="${error.field}"]`);
                if (field) {
                    this.showFieldError(field, error.message);
                }
            });
            
            // Focus first error field
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.querySelector('input, textarea, select')?.focus();
            }
            
            return;
        }
        
        // Show loading state
        this.setFormLoading(form, true);
        
        try {
            // Submit sanitized data
            await this.submitForm(form, validation.data);
            
            // Show success message
            this.showFormSuccess(form, 'Form submitted successfully!');
            
            // Reset form
            form.reset();
            
            // Regenerate CSRF token
            this.csrfToken = this.validator.generateCSRFToken();
            sessionStorage.setItem('csrfToken', this.csrfToken);
            this.updateCSRFTokens();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError(form, 'An error occurred. Please try again.');
        } finally {
            this.setFormLoading(form, false);
        }
    }
    
    /**
     * Validate individual field
     */
    validateField(input, rules) {
        const value = input.value;
        const fieldRules = { [input.name]: rules };
        const validation = this.validator.validate({ [input.name]: value }, fieldRules);
        
        if (!validation.isValid) {
            this.showFieldError(input, validation.errors[0].message);
        } else {
            this.clearFieldError(input);
            
            // Show success indicator
            const wrapper = input.closest('.form-group') || input.parentElement;
            wrapper.classList.add('success');
        }
    }
    
    /**
     * Show field error
     */
    showFieldError(input, message) {
        const wrapper = input.closest('.form-group') || input.parentElement;
        wrapper.classList.add('error');
        wrapper.classList.remove('success');
        
        // Remove existing error message
        const existingError = wrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        
        input.parentNode.insertBefore(errorElement, input.nextSibling);
        
        // Add ARIA attributes
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `${input.id}-error`);
        errorElement.id = `${input.id}-error`;
    }
    
    /**
     * Clear field error
     */
    clearFieldError(input) {
        const wrapper = input.closest('.form-group') || input.parentElement;
        wrapper.classList.remove('error');
        
        const errorMessage = wrapper.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    }
    
    /**
     * Clear all form errors
     */
    clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });
        
        form.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
        
        form.querySelectorAll('[aria-invalid]').forEach(element => {
            element.removeAttribute('aria-invalid');
            element.removeAttribute('aria-describedby');
        });
    }
    
    /**
     * Show form-level error
     */
    showFormError(form, message) {
        const existingAlert = form.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = 'form-alert form-alert-error';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <strong>Error:</strong> ${message}
            <button type="button" class="alert-close" aria-label="Close">&times;</button>
        `;
        
        form.insertBefore(alert, form.firstChild);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => alert.remove(), 10000);
        
        // Close button
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
    }
    
    /**
     * Show form success message
     */
    showFormSuccess(form, message) {
        const existingAlert = form.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = 'form-alert form-alert-success';
        alert.setAttribute('role', 'alert');
        alert.innerHTML = `
            <strong>Success:</strong> ${message}
            <button type="button" class="alert-close" aria-label="Close">&times;</button>
        `;
        
        form.insertBefore(alert, form.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => alert.remove(), 5000);
        
        // Close button
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
    }
    
    /**
     * Set form loading state
     */
    setFormLoading(form, loading) {
        const submitButton = form.querySelector('[type="submit"]');
        
        if (loading) {
            form.classList.add('loading');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.dataset.originalText = submitButton.textContent;
                submitButton.textContent = 'Processing...';
            }
        } else {
            form.classList.remove('loading');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset.originalText || 'Submit';
            }
        }
    }
    
    /**
     * Add CSRF tokens to all forms
     */
    addCSRFTokens() {
        document.querySelectorAll('form').forEach(form => {
            if (!form.querySelector('[name="csrfToken"]')) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrfToken';
                input.value = this.csrfToken;
                form.appendChild(input);
            }
        });
    }
    
    /**
     * Update CSRF tokens
     */
    updateCSRFTokens() {
        document.querySelectorAll('[name="csrfToken"]').forEach(input => {
            input.value = this.csrfToken;
        });
    }
    
    /**
     * Add password strength indicator
     */
    addPasswordStrengthIndicator(input) {
        const indicator = document.createElement('div');
        indicator.className = 'password-strength';
        indicator.innerHTML = `
            <div class="strength-meter">
                <div class="strength-bar"></div>
            </div>
            <div class="strength-text"></div>
            <ul class="strength-requirements"></ul>
        `;
        
        input.parentNode.insertBefore(indicator, input.nextSibling);
        
        const updateStrength = () => {
            const strength = this.validator.getPasswordStrength(input.value);
            const bar = indicator.querySelector('.strength-bar');
            const text = indicator.querySelector('.strength-text');
            const requirements = indicator.querySelector('.strength-requirements');
            
            // Update bar
            bar.style.width = `${(strength.score / 9) * 100}%`;
            bar.className = `strength-bar strength-${strength.strength}`;
            
            // Update text
            text.textContent = `Strength: ${strength.strength}`;
            text.className = `strength-text strength-${strength.strength}`;
            
            // Update requirements
            requirements.innerHTML = strength.feedback
                .map(item => `<li>${item}</li>`)
                .join('');
        };
        
        input.addEventListener('input', updateStrength);
        input.addEventListener('focus', () => indicator.style.display = 'block');
    }
    
    /**
     * Add character counter
     */
    addCharacterCounter(textarea, maxLength) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.textContent = `0 / ${maxLength}`;
        
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        const updateCounter = () => {
            const length = textarea.value.length;
            counter.textContent = `${length} / ${maxLength}`;
            
            if (length > maxLength) {
                counter.classList.add('exceeded');
            } else if (length > maxLength * 0.9) {
                counter.classList.add('warning');
                counter.classList.remove('exceeded');
            } else {
                counter.classList.remove('warning', 'exceeded');
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    /**
     * Submit form (override this for actual submission)
     */
    async submitForm(form, data) {
        // This would be replaced with actual API call
        console.log('Submitting sanitized form data:', data);
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
    
    /**
     * Setup additional event listeners
     */
    setupEventListeners() {
        // Prevent form resubmission on page refresh
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
        
        // Warn before leaving with unsaved changes
        let formChanged = false;
        
        document.addEventListener('input', () => {
            formChanged = true;
        });
        
        document.addEventListener('submit', () => {
            formChanged = false;
        });
        
        window.addEventListener('beforeunload', (e) => {
            if (formChanged) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize form validation
const formValidation = new FormValidation();