// Form Handler Component
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.validator = window.Validator;
        this.init();
    }

    init() {
        if (!this.validator) {
            console.error('Validator not found. Make sure validation.js is loaded.');
            return;
        }

        this.setupValidationRules();
        this.setupEventListeners();
        console.log('Form handler initialized');
    }

    setupValidationRules() {
        // Contact form validation rules
        this.validator
            .addRule('name', 'required', true, 'Please enter your full name')
            .addRule('name', 'minLength', 2, 'Name must be at least 2 characters')
            .addRule('name', 'maxLength', 50, 'Name must be less than 50 characters')
            .addRule('name', 'pattern', '^[a-zA-Z\\s\'-]+$', 'Name can only contain letters, spaces, hyphens and apostrophes')

            .addRule('email', 'required', true, 'Please enter your email address')
            .addRule('email', 'email', true, 'Please enter a valid email address')

            .addRule('phone', 'phone', true, 'Please enter a valid UK phone number')

            .addRule('company', 'maxLength', 100, 'Company name must be less than 100 characters')

            .addRule('service', 'required', true, 'Please select a service')

            .addRule('message', 'required', true, 'Please enter a message')
            .addRule('message', 'minLength', 10, 'Message must be at least 10 characters')
            .addRule('message', 'maxLength', 1000, 'Message must be less than 1000 characters')

            .addRule('consent', 'required', true, 'You must consent to being contacted');
    }

    setupEventListeners() {
        this.forms.forEach(form => {
            // Setup real-time validation
            this.validator.setupRealTimeValidation(form);

            // Handle form submission
            form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Handle input changes for better UX
            this.setupInputEnhancements(form);
        });
    }

    setupInputEnhancements(form) {
        const phoneInput = form.querySelector('input[type="tel"], input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        const emailInput = form.querySelector('input[type="email"], input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => this.normalizeEmail(e));
        }

        // Character counter for textarea
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            this.addCharacterCounter(textarea);
        });
    }

    formatPhoneNumber(event) {
        let value = event.target.value.replace(/\D/g, '');
        
        // Format UK phone numbers
        if (value.startsWith('44')) {
            value = '+' + value;
        } else if (value.startsWith('0')) {
            // Keep leading zero for UK numbers
        } else if (value.length > 0 && !value.startsWith('0') && !value.startsWith('44')) {
            value = '0' + value;
        }

        // Add spacing for readability
        if (value.startsWith('+44')) {
            value = value.replace(/(\+44)(\d{4})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        } else if (value.startsWith('0')) {
            value = value.replace(/(\d{5})(\d{3})(\d{3})/, '$1 $2 $3');
        }

        event.target.value = value;
    }

    normalizeEmail(event) {
        event.target.value = event.target.value.toLowerCase().trim();
    }

    addCharacterCounter(textarea) {
        const maxLength = textarea.getAttribute('maxlength') || 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            font-size: 0.875rem;
            color: var(--text-light);
            margin-top: 0.25rem;
            text-align: right;
        `;
        
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${textarea.value.length}/${maxLength}`;
            
            if (remaining < 50) {
                counter.style.color = 'var(--error-red)';
            } else if (remaining < 100) {
                counter.style.color = 'var(--warning-orange)';
            } else {
                counter.style.color = 'var(--text-light)';
            }
        };

        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        updateCounter();
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('[type="submit"]');
        const formMessages = document.getElementById('form-messages');

        // Validate form
        const result = this.validator.validateAndSanitizeForm(form);
        
        if (!result.validation.isValid) {
            this.displayFormErrors(form, result.validation);
            this.showMessage(formMessages, 'Please correct the errors below', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);
        this.clearFormErrors(form);

        try {
            // Simulate API call (replace with actual endpoint)
            const response = await this.submitForm(result.data);
            
            if (response.success) {
                this.showMessage(formMessages, 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.', 'success');
                form.reset();
                this.clearFormErrors(form);
                
                // Track form submission (if analytics is available)
                this.trackFormSubmission(form.id, 'success');
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(formMessages, 'Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
            
            // Track form submission error
            this.trackFormSubmission(form.id, 'error', error.message);
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async submitForm(formData) {
        // Simulate API call - replace with actual form submission logic
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success/failure
                const isSuccess = Math.random() > 0.1; // 90% success rate for demo
                
                if (isSuccess) {
                    resolve({
                        success: true,
                        message: 'Form submitted successfully'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Server error occurred'
                    });
                }
            }, 2000); // Simulate network delay
        });
    }

    displayFormErrors(form, validationResult) {
        Object.keys(validationResult.fields).forEach(fieldName => {
            const fieldResult = validationResult.fields[fieldName];
            const input = form.querySelector(`[name="${fieldName}"]`);
            
            if (input && !fieldResult.isValid) {
                this.validator.displayFieldError(input, fieldResult);
            }
        });
    }

    clearFormErrors(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.validator.clearFieldError(input);
        });
    }

    setLoadingState(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');

        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            if (btnText) btnText.textContent = 'Sending...';
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            if (btnText) btnText.textContent = 'Send Message';
            if (spinner) spinner.classList.add('hidden');
        }
    }

    showMessage(container, message, type = 'info') {
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }

        // Scroll to message
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    trackFormSubmission(formId, status, error = null) {
        // Integration with analytics (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                form_id: formId,
                status: status,
                error: error
            });
        }

        // Custom analytics tracking
        if (typeof window.analytics !== 'undefined') {
            window.analytics.track('Form Submission', {
                formId: formId,
                status: status,
                error: error,
                timestamp: new Date().toISOString()
            });
        }

        console.log('Form submission tracked:', { formId, status, error });
    }

    // Public method to validate specific form
    validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return null;

        const result = this.validator.validateAndSanitizeForm(form);
        this.displayFormErrors(form, result.validation);
        
        return result;
    }

    // Public method to reset form
    resetForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        form.reset();
        this.clearFormErrors(form);
        
        const formMessages = document.getElementById('form-messages');
        if (formMessages) {
            formMessages.innerHTML = '';
        }

        return true;
    }

    cleanup() {
        this.forms.forEach(form => {
            // Remove event listeners
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
        });
    }
}

// Add required CSS for form validation if not already present
if (!document.querySelector('#form-validation-styles')) {
    const style = document.createElement('style');
    style.id = 'form-validation-styles';
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: var(--error-red);
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .form-group input.valid,
        .form-group textarea.valid,
        .form-group select.valid {
            border-color: var(--success-green);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        
        .form-error {
            color: var(--error-red);
            font-size: var(--text-sm);
            margin-top: var(--space-1);
            display: none;
        }
        
        .character-counter {
            font-size: var(--text-sm);
            color: var(--text-light);
            margin-top: var(--space-1);
            text-align: right;
        }
        
        .checkbox-label {
            display: flex !important;
            align-items: flex-start;
            gap: var(--space-2);
            cursor: pointer;
        }
        
        .checkbox-label input[type="checkbox"] {
            width: auto !important;
            margin: 0;
        }
        
        .faq-section {
            background: var(--bg-gray);
            padding: var(--space-16) 0;
        }
        
        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--space-8);
        }
        
        .faq-item {
            background: var(--bg-white);
            padding: var(--space-6);
            border-radius: var(--rounded-lg);
            box-shadow: var(--shadow);
        }
        
        .faq-item h3 {
            color: var(--text-dark);
            margin-bottom: var(--space-3);
            font-size: var(--text-lg);
        }
        
        .faq-item p {
            color: var(--text-gray);
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
}