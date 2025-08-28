/**
 * Input Validation and Sanitization Library
 * Provides comprehensive protection against XSS, SQL injection, and other attacks
 */

class InputValidator {
    constructor() {
        this.errors = [];
        this.sanitizedData = {};
        
        // Validation patterns
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            phone: /^[\d\s\-\+\(\)]+$/,
            alphanumeric: /^[a-zA-Z0-9]+$/,
            alphabetic: /^[a-zA-Z]+$/,
            numeric: /^\d+$/,
            decimal: /^\d+\.?\d*$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            username: /^[a-zA-Z0-9_-]{3,20}$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            safeText: /^[a-zA-Z0-9\s\-.,!?'"]+$/,
            noScript: /<script|<iframe|javascript:|on\w+\s*=/gi,
            noSQL: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE|SCRIPT|TRUNCATE)\b)/gi,
            creditCard: /^\d{13,19}$/,
            cvv: /^\d{3,4}$/,
            postalCode: /^[A-Z0-9]{3,10}$/i,
            date: /^\d{4}-\d{2}-\d{2}$/,
            time: /^([01]\d|2[0-3]):([0-5]\d)$/,
            hexColor: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
            ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            ipv6: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
        };
        
        // Dangerous patterns to block
        this.dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<embed/gi,
            /<object/gi,
            /<applet/gi,
            /<meta/gi,
            /<link/gi,
            /<style/gi,
            /expression\s*\(/gi,
            /import\s+/gi,
            /document\./gi,
            /window\./gi,
            /eval\s*\(/gi,
            /setTimeout\s*\(/gi,
            /setInterval\s*\(/gi,
            /Function\s*\(/gi,
            /\.innerHTML/gi,
            /\.outerHTML/gi,
            /\.write/gi,
            /\.writeln/gi
        ];
        
        // HTML entities map
        this.htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
    }
    
    /**
     * Main validation method
     */
    validate(input, rules) {
        this.errors = [];
        this.sanitizedData = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = input[field];
            const sanitized = this.sanitizeInput(value, fieldRules);
            
            // Check required
            if (fieldRules.required && !sanitized) {
                this.addError(field, `${field} is required`);
                continue;
            }
            
            // Skip validation if empty and not required
            if (!sanitized && !fieldRules.required) {
                this.sanitizedData[field] = '';
                continue;
            }
            
            // Validate based on rules
            this.validateField(field, sanitized, fieldRules);
            this.sanitizedData[field] = sanitized;
        }
        
        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            data: this.sanitizedData
        };
    }
    
    /**
     * Validate individual field
     */
    validateField(field, value, rules) {
        // Type validation
        if (rules.type) {
            if (!this.validateType(value, rules.type)) {
                this.addError(field, `${field} must be a valid ${rules.type}`);
            }
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            this.addError(field, `${field} format is invalid`);
        }
        
        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.addError(field, `${field} must be at least ${rules.minLength} characters`);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            this.addError(field, `${field} must not exceed ${rules.maxLength} characters`);
        }
        
        // Numeric range validation
        if (rules.min !== undefined && parseFloat(value) < rules.min) {
            this.addError(field, `${field} must be at least ${rules.min}`);
        }
        
        if (rules.max !== undefined && parseFloat(value) > rules.max) {
            this.addError(field, `${field} must not exceed ${rules.max}`);
        }
        
        // Custom validation
        if (rules.custom && typeof rules.custom === 'function') {
            const customResult = rules.custom(value);
            if (customResult !== true) {
                this.addError(field, customResult || `${field} validation failed`);
            }
        }
        
        // Check for dangerous content
        if (rules.safe !== false && this.containsDangerousContent(value)) {
            this.addError(field, `${field} contains potentially dangerous content`);
        }
    }
    
    /**
     * Type-specific validation
     */
    validateType(value, type) {
        switch (type) {
            case 'email':
                return this.patterns.email.test(value);
            case 'url':
                return this.patterns.url.test(value);
            case 'phone':
                return this.patterns.phone.test(value);
            case 'username':
                return this.patterns.username.test(value);
            case 'password':
                return this.validatePassword(value);
            case 'number':
                return !isNaN(value) && isFinite(value);
            case 'integer':
                return Number.isInteger(Number(value));
            case 'date':
                return this.patterns.date.test(value) && !isNaN(Date.parse(value));
            case 'time':
                return this.patterns.time.test(value);
            case 'creditCard':
                return this.validateCreditCard(value);
            case 'cvv':
                return this.patterns.cvv.test(value);
            case 'postalCode':
                return this.patterns.postalCode.test(value);
            case 'ipv4':
                return this.patterns.ipv4.test(value);
            case 'ipv6':
                return this.patterns.ipv6.test(value);
            case 'hexColor':
                return this.patterns.hexColor.test(value);
            default:
                return true;
        }
    }
    
    /**
     * Password validation with strength checking
     */
    validatePassword(password) {
        const strength = this.getPasswordStrength(password);
        return strength.score >= 3; // Require at least "good" strength
    }
    
    /**
     * Get password strength
     */
    getPasswordStrength(password) {
        let score = 0;
        const feedback = [];
        
        if (!password) {
            return { score: 0, strength: 'none', feedback: ['Password is required'] };
        }
        
        // Length
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        else feedback.push('Use at least 12 characters');
        
        // Complexity
        if (/[a-z]/.test(password)) score++;
        else feedback.push('Include lowercase letters');
        
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('Include uppercase letters');
        
        if (/\d/.test(password)) score++;
        else feedback.push('Include numbers');
        
        if (/[@$!%*?&#]/.test(password)) score++;
        else feedback.push('Include special characters');
        
        // Common patterns to avoid
        if (!/(.)\1{2,}/.test(password)) score++; // No repeated characters
        else feedback.push('Avoid repeated characters');
        
        if (!/^(123|abc|password|qwerty)/i.test(password)) score++;
        else feedback.push('Avoid common patterns');
        
        // Determine strength level
        let strength;
        if (score <= 2) strength = 'weak';
        else if (score <= 4) strength = 'fair';
        else if (score <= 6) strength = 'good';
        else if (score <= 8) strength = 'strong';
        else strength = 'excellent';
        
        return { score, strength, feedback };
    }
    
    /**
     * Credit card validation (Luhn algorithm)
     */
    validateCreditCard(number) {
        number = number.replace(/\s/g, '');
        
        if (!this.patterns.creditCard.test(number)) {
            return false;
        }
        
        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    /**
     * Sanitize input based on rules
     */
    sanitizeInput(value, rules) {
        // Convert to string and trim
        let sanitized = String(value || '').trim();
        
        // Apply sanitization based on type
        if (rules.type) {
            sanitized = this.sanitizeByType(sanitized, rules.type);
        }
        
        // HTML encode if specified
        if (rules.htmlEncode !== false) {
            sanitized = this.htmlEncode(sanitized);
        }
        
        // Remove scripts and dangerous content
        if (rules.removeScripts !== false) {
            sanitized = this.removeScripts(sanitized);
        }
        
        // Strip HTML tags if specified
        if (rules.stripTags) {
            sanitized = this.stripTags(sanitized);
        }
        
        // Apply whitelist if provided
        if (rules.whitelist) {
            sanitized = this.applyWhitelist(sanitized, rules.whitelist);
        }
        
        // Apply blacklist if provided
        if (rules.blacklist) {
            sanitized = this.applyBlacklist(sanitized, rules.blacklist);
        }
        
        // Normalize whitespace
        if (rules.normalizeWhitespace) {
            sanitized = sanitized.replace(/\s+/g, ' ');
        }
        
        // Truncate if needed
        if (rules.maxLength) {
            sanitized = sanitized.substring(0, rules.maxLength);
        }
        
        return sanitized;
    }
    
    /**
     * Type-specific sanitization
     */
    sanitizeByType(value, type) {
        switch (type) {
            case 'email':
                return value.toLowerCase().replace(/[^a-z0-9.@_-]/gi, '');
            case 'username':
                return value.replace(/[^a-zA-Z0-9_-]/g, '');
            case 'number':
            case 'integer':
                return value.replace(/[^\d.-]/g, '');
            case 'phone':
                return value.replace(/[^\d\s()-+]/g, '');
            case 'url':
                try {
                    const url = new URL(value);
                    return url.href;
                } catch {
                    return '';
                }
            case 'postalCode':
                return value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');
            case 'hexColor':
                return value.replace(/[^#a-f0-9]/gi, '');
            default:
                return value;
        }
    }
    
    /**
     * HTML encode special characters
     */
    htmlEncode(str) {
        return str.replace(/[&<>"'`=\/]/g, (s) => this.htmlEntities[s]);
    }
    
    /**
     * HTML decode
     */
    htmlDecode(str) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    }
    
    /**
     * Remove script tags and dangerous content
     */
    removeScripts(str) {
        let cleaned = str;
        
        // Remove dangerous patterns
        for (const pattern of this.dangerousPatterns) {
            cleaned = cleaned.replace(pattern, '');
        }
        
        // Remove event handlers
        cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        cleaned = cleaned.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
        
        return cleaned;
    }
    
    /**
     * Strip HTML tags
     */
    stripTags(str, allowedTags = []) {
        if (allowedTags.length === 0) {
            return str.replace(/<\/?[^>]+(>|$)/g, '');
        }
        
        const allowed = allowedTags.map(tag => `</?${tag}\\b[^>]*>`).join('|');
        const regex = new RegExp(`</?(?!(${allowed}))[^>]+>`, 'gi');
        return str.replace(regex, '');
    }
    
    /**
     * Apply whitelist characters
     */
    applyWhitelist(str, whitelist) {
        const regex = new RegExp(`[^${whitelist}]`, 'g');
        return str.replace(regex, '');
    }
    
    /**
     * Apply blacklist characters
     */
    applyBlacklist(str, blacklist) {
        const regex = new RegExp(`[${blacklist}]`, 'g');
        return str.replace(regex, '');
    }
    
    /**
     * Check for dangerous content
     */
    containsDangerousContent(str) {
        for (const pattern of this.dangerousPatterns) {
            if (pattern.test(str)) {
                return true;
            }
        }
        
        // Check for SQL injection patterns
        if (this.patterns.noSQL.test(str)) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Validate file upload
     */
    validateFile(file, rules) {
        const errors = [];
        
        // Check file size
        if (rules.maxSize && file.size > rules.maxSize) {
            errors.push(`File size exceeds ${this.formatFileSize(rules.maxSize)}`);
        }
        
        if (rules.minSize && file.size < rules.minSize) {
            errors.push(`File size must be at least ${this.formatFileSize(rules.minSize)}`);
        }
        
        // Check file type
        if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed`);
        }
        
        // Check file extension
        if (rules.allowedExtensions) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!rules.allowedExtensions.includes(extension)) {
                errors.push(`File extension .${extension} is not allowed`);
            }
        }
        
        // Check for dangerous file types
        const dangerousExtensions = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'vbs', 'jar', 'com', 'scr', 'msi'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (dangerousExtensions.includes(extension)) {
            errors.push('Potentially dangerous file type detected');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
    
    /**
     * Add error message
     */
    addError(field, message) {
        this.errors.push({
            field: field,
            message: message
        });
    }
    
    /**
     * Get errors for specific field
     */
    getFieldErrors(field) {
        return this.errors.filter(error => error.field === field);
    }
    
    /**
     * Clear errors
     */
    clearErrors() {
        this.errors = [];
    }
    
    /**
     * Validate CSRF token
     */
    validateCSRFToken(token, sessionToken) {
        return token && sessionToken && token === sessionToken;
    }
    
    /**
     * Generate CSRF token
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    /**
     * Rate limiting check
     */
    checkRateLimit(key, limit = 5, windowMs = 60000) {
        const now = Date.now();
        const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
        
        // Remove old attempts outside the window
        const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        
        if (validAttempts.length >= limit) {
            const oldestAttempt = Math.min(...validAttempts);
            const waitTime = windowMs - (now - oldestAttempt);
            return {
                allowed: false,
                waitTime: Math.ceil(waitTime / 1000),
                message: `Too many attempts. Please wait ${Math.ceil(waitTime / 1000)} seconds.`
            };
        }
        
        // Add current attempt
        validAttempts.push(now);
        localStorage.setItem(`rateLimit_${key}`, JSON.stringify(validAttempts));
        
        return {
            allowed: true,
            remaining: limit - validAttempts.length
        };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputValidator;
}