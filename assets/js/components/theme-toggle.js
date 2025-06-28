// Theme Toggle Component
class ThemeToggle {
    constructor() {
        this.button = document.getElementById('theme-toggle');
        this.currentTheme = this.getCurrentTheme();
        
        if (this.button) {
            this.init();
        }
    }

    init() {
        // Set initial button text
        this.updateButtonText();
        
        // Add event listener
        this.button.addEventListener('click', (e) => this.handleToggle(e));
        
        // Listen for system theme changes
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQuery.addEventListener('change', (e) => this.handleSystemThemeChange(e));
        
        console.log('Theme toggle initialized');
    }

    getCurrentTheme() {
        // Check for saved theme preference
        const savedTheme = Storage.get('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }

    handleToggle(event) {
        event.preventDefault();
        
        // Toggle theme
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add click animation
        this.animateButton();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        // Apply theme to document
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        // Save preference
        Storage.set('theme', theme);
        
        // Update button text
        this.updateButtonText();
        
        // Dispatch custom event
        this.dispatchThemeChangeEvent(theme);
        
        console.log(`Theme changed to: ${theme}`);
    }

    updateButtonText() {
        if (this.button) {
            this.button.textContent = this.currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
            this.button.setAttribute('aria-label', `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} theme`);
        }
    }

    animateButton() {
        if (!this.button) return;
        
        // Add animation class
        this.button.classList.add('animate-spin');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.button.classList.remove('animate-spin');
        }, 300);
    }

    handleSystemThemeChange(event) {
        // Only respond to system changes if user hasn't set a preference
        const userPreference = Storage.get('theme');
        if (!userPreference) {
            const systemTheme = event.matches ? 'dark' : 'light';
            this.setTheme(systemTheme);
        }
    }

    dispatchThemeChangeEvent(theme) {
        // Dispatch custom event for other components to listen to
        const event = new CustomEvent('themechange', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }

    // Public method to get current theme
    getTheme() {
        return this.currentTheme;
    }

    // Public method to set theme programmatically
    programmaticSetTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.setTheme(theme);
        }
    }

    cleanup() {
        if (this.button) {
            this.button.removeEventListener('click', this.handleToggle);
        }
        
        if (this.mediaQuery) {
            this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        }
    }
}

// CSS for spin animation (if not already in CSS)
if (!document.querySelector('#theme-toggle-styles')) {
    const style = document.createElement('style');
    style.id = 'theme-toggle-styles';
    style.textContent = `
        .animate-spin {
            animation: spin 0.3s ease-in-out;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(180deg); }
        }
    `;
    document.head.appendChild(style);
}