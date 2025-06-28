// Form Validation Utilities
class Validation {
    constructor() {
        this.rules = new Map();
        this.messages = new Map();
        this.setupDefaultMessages();
    }

    setupDefaultMessages() {
        this.messages.set('required', 'This field is required');
        this.messages.set('email', 'Please enter a valid email address');
        this.messages.set('phone', 'Please enter a valid phone number');
        this.messages.set('minLength', 'This field must be at least {min} characters long');
        this.messages.set('maxLength', 'This field must be no more than {max} characters long');
        this.messages.set('pattern', 'Please enter a valid format');
        this.messages.set('url', 'Please enter a valid URL');
        this.messages.set('number', 'Please enter a valid number');
        this.messages.set('min', 'Value must be at least {min}');
        this.messages.set('max', 'Value must be no more than {max}');
    }

    // Add validation rule for a field
    addRule(fieldName, ruleName, ruleValue = true, customMessage = null) {
        if (!this.rules.has(fieldName)) {
            this.rules.set(fieldName, new Map());
        }
        
        this.rules.get(fieldName).set(ruleName, ruleValue);
        
        if (customMessage) {
            this.setMessage(fieldName, ruleName, customMessage);
        }
        
        return this;
    }

    // Set custom error message
    setMessage(fieldName, ruleName, message) {
        const key = `${fieldName}.${ruleName}`;
        this.messages.set(key, message);
        return this;
    }

    // Get error message for a field and rule
    getMessage(fieldName, ruleName, ruleValue = null) {
        const customKey = `${fieldName}.${ruleName}`;
        
        if (this.messages.has(customKey)) {
            let message = this.messages.get(customKey);
            if (ruleValue && typeof ruleValue === 'number') {
                message = message.replace(`{${ruleName}}`, ruleValue);
                message = message.replace('{min}', ruleValue);
                message = message.replace('{max}', ruleValue);
            }
            return message;
        }
        
        if (this.messages.has(ruleName)) {
            let message = this.messages.get(ruleName);
            if (ruleValue && typeof ruleValue === 'number') {
                message = message.replace(`{${ruleName}}`, ruleValue);
                message = message.replace('{min}', ruleValue);
                message = message.replace('{max}', ruleValue);
            }
            return message;
        }
        
        return 'Invalid input';
    }

    // Validate a single field
    validateField(fieldName, value, rules = null) {
        const fieldRules = rules || this.rules.get(fieldName);
        
        if (!fieldRules) {
            return { isValid: true, errors: [] };
        }

        const errors = [];

        // Required validation
        if (fieldRules.has('required') && fieldRules.get('required')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors.push(this.getMessage(fieldName, 'required'));
            }
        }

        // Skip other validations if field is empty and not required
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return { isValid: errors.length === 0, errors };
        }

        // Email validation
        if (fieldRules.has('email') && fieldRules.get('email')) {
            if (!this.isValidEmail(value)) {
                errors.push(this.getMessage(fieldName, 'email'));
            }
        }

        // Phone validation
        if (fieldRules.has('phone') && fieldRules.get('phone')) {
            if (!this.isValidPhone(value)) {
                errors.push(this.getMessage(fieldName, 'phone'));
            }
        }

        // URL validation
        if (fieldRules.has('url') && fieldRules.get('url')) {
            if (!this.isValidUrl(value)) {
                errors.push(this.getMessage(fieldName, 'url'));
            }
        }

        // Number validation
        if (fieldRules.has('number') && fieldRules.get('number')) {
            if (!this.isValidNumber(value)) {
                errors.push(this.getMessage(fieldName, 'number'));
            }
        }

        // Minimum length validation
        if (fieldRules.has('minLength')) {
            const minLength = fieldRules.get('minLength');
            if (value.length < minLength) {
                errors.push(this.getMessage(fieldName, 'minLength', minLength));
            }
        }

        // Maximum length validation
        if (fieldRules.has('maxLength')) {
            const maxLength = fieldRules.get('maxLength');
            if (value.length > maxLength) {
                errors.push(this.getMessage(fieldName, 'maxLength', maxLength));
            }
        }

        // Minimum value validation
        if (fieldRules.has('min')) {
            const min = fieldRules.get('min');
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue < min) {
                errors.push(this.getMessage(fieldName, 'min', min));
            }
        }

        // Maximum value validation
        if (fieldRules.has('max')) {
            const max = fieldRules.get('max');
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue > max) {
                errors.push(this.getMessage(fieldName, 'max', max));
            }
        }

        // Pattern validation
        if (fieldRules.has('pattern')) {
            const pattern = fieldRules.get('pattern');
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                errors.push(this.getMessage(fieldName, 'pattern'));
            }
        }

        // Custom validation function
        if (fieldRules.has('custom')) {
            const customFn = fieldRules.get('custom');
            if (typeof customFn === 'function') {
                const customResult = customFn(value);
                if (customResult !== true) {
                    errors.push(typeof customResult === 'string' ? customResult : 'Invalid input');
                }
            }
        }

        return { isValid: errors.length === 0, errors };
    }

    // Validate entire form
    validateForm(formData) {
        const results = {};
        let isFormValid = true;

        for (const [fieldName, value] of Object.entries(formData)) {
            const result = this.validateField(fieldName, value);
            results[fieldName] = result;
            
            if (!result.isValid) {
                isFormValid = false;
            }
        }

        return { isValid: isFormValid, fields: results };
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation (UK format)
    isValidPhone(phone) {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Check various UK phone number formats
        const ukPatterns = [
            /^(\+44|0044|44)?[1-9]\d{8,9}$/, // General UK format
            /^(\+44|0044|44)?7\d{9}$/, // UK Mobile
            /^(\+44|0044|44)?[12]\d{9}$/, // UK Landline
            /^(\+44|0044|44)?800\d{7}$/, // UK Freephone
        ];

        return ukPatterns.some(pattern => pattern.test(cleanPhone));
    }

    // URL validation
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Number validation
    isValidNumber(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    // Validate specific field types with common rules
    validateEmailField(email) {
        return this.validateField('email', email, new Map([
            ['required', true],
            ['email', true]
        ]));
    }

    validatePhoneField(phone) {
        return this.validateField('phone', phone, new Map([
            ['phone', true]
        ]));
    }

    validateNameField(name) {
        return this.validateField('name', name, new Map([
            ['required', true],
            ['minLength', 2],
            ['maxLength', 50],
            ['pattern', '^[a-zA-Z\\s\'-]+$']
        ]));
    }

    validateMessageField(message) {
        return this.validateField('message', message, new Map([
            ['required', true],
            ['minLength', 10],
            ['maxLength', 1000]
        ]));
    }

    // Real-time validation setup
    setupRealTimeValidation(form) {
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const fieldName = input.name || input.id;
            
            // Validate on blur
            input.addEventListener('blur', () => {
                const value = input.value;
                const result = this.validateField(fieldName, value);
                this.displayFieldError(input, result);
            });

            // Clear errors on focus
            input.addEventListener('focus', () => {
                this.clearFieldError(input);
            });

            // Validate on input for certain fields
            if (input.type === 'email' || input.type === 'tel') {
                input.addEventListener('input', this.debounce(() => {
                    const value = input.value;
                    if (value.length > 3) { // Only validate after some input
                        const result = this.validateField(fieldName, value);
                        this.displayFieldError(input, result);
                    }
                }, 300));
            }
        });
    }

    // Display field error
    displayFieldError(input, validationResult) {
        const errorElement = document.getElementById(`${input.name || input.id}-error`);
        
        if (validationResult.isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = validationResult.errors[0];
                errorElement.style.display = 'block';
            }
        }
    }

    // Clear field error
    clearFieldError(input) {
        const errorElement = document.getElementById(`${input.name || input.id}-error`);
        
        input.classList.remove('error', 'valid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Debounce utility
    debounce(func, wait) {
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

    // Get form data as object
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Validate and sanitize form data
    validateAndSanitizeForm(form) {
        const rawData = this.getFormData(form);
        const sanitizedData = {};
        
        // Sanitize all string inputs
        for (const [key, value] of Object.entries(rawData)) {
            sanitizedData[key] = this.sanitizeInput(value);
        }
        
        // Validate sanitized data
        const validationResult = this.validateForm(sanitizedData);
        
        return {
            data: sanitizedData,
            validation: validationResult
        };
    }
}

// Create global instance
window.Validator = new Validation();