// Main Application Logic
class LegalServicesApp {
    constructor() {
        this.isLoaded = false;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        console.log('Legal Services App initializing...');
        
        // Initialize components
        this.initializeComponents();
        
        // Load dynamic content
        this.loadDynamicContent();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize theme
        this.initializeTheme();
        
        // Mark as loaded
        this.isLoaded = true;
        
        console.log('Legal Services App initialized successfully');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('contact')) return 'contact';
        if (path.includes('help')) return 'help';
        return 'home';
    }

    initializeComponents() {
        // Initialize navigation
        if (typeof Navigation !== 'undefined') {
            this.navigation = new Navigation();
        }

        // Initialize theme toggle
        if (typeof ThemeToggle !== 'undefined') {
            this.themeToggle = new ThemeToggle();
        }

        // Initialize smooth scroll
        if (typeof SmoothScroll !== 'undefined') {
            this.smoothScroll = new SmoothScroll();
        }

        // Initialize form handler (only on contact page)
        if (this.currentPage === 'contact' && typeof FormHandler !== 'undefined') {
            this.formHandler = new FormHandler();
        }
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));

        // Handle scroll events
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 16));

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle beforeunload for cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    initializeTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = Storage.get('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Storage.get('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        // Update theme toggle button if it exists
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
        }
    }

    async loadDynamicContent() {
        try {
            // Load services data for home page
            if (this.currentPage === 'home') {
                await this.loadServicesPreview();
                await this.loadTestimonialsPreview();
            }

            // Load full services for services page
            if (this.currentPage === 'services') {
                await this.loadAllServices();
            }

            // Load testimonials for about page
            if (this.currentPage === 'about') {
                await this.loadAllTestimonials();
            }

        } catch (error) {
            console.error('Error loading dynamic content:', error);
            this.showErrorMessage('Failed to load some content. Please refresh the page.');
        }
    }

    async loadServicesPreview() {
        try {
            const servicesGrid = document.getElementById('services-grid');
            if (!servicesGrid) return;

            // Load services data
            const services = await this.fetchServicesData();
            
            // Show only first 3 services for preview
            const previewServices = services.slice(0, 3);
            
            servicesGrid.innerHTML = previewServices.map(service => `
                <div class="service-card">
                    <div class="service-icon">${service.icon}</div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading services preview:', error);
        }
    }

    async loadTestimonialsPreview() {
        try {
            const testimonialsGrid = document.getElementById('testimonials-grid');
            if (!testimonialsGrid) return;

            const testimonials = await this.fetchTestimonialsData();
            
            // Show only first 2 testimonials for preview
            const previewTestimonials = testimonials.slice(0, 2);
            
            testimonialsGrid.innerHTML = previewTestimonials.map(testimonial => `
                <div class="testimonial-card">
                    <div class="testimonial-quote">${testimonial.quote}</div>
                    <div class="testimonial-author">
                        <div class="author-avatar">${testimonial.author.initials}</div>
                        <div class="author-info">
                            <h4>${testimonial.author.name}</h4>
                            <p>${testimonial.author.title}</p>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading testimonials preview:', error);
        }
    }

    async fetchServicesData() {
        // In a real app, this would fetch from an API or JSON file
        // For now, return static data
        return [
            {
                icon: '📋',
                title: 'Civil Matters',
                description: 'Expert cost drafting for personal injury claims, contract disputes, commercial litigation, and debt recovery cases.'
            },
            {
                icon: '🏠',
                title: 'Housing Disputes',
                description: 'Specialized drafting for landlord/tenant disputes, property litigation, housing benefit cases, and possession proceedings.'
            },
            {
                icon: '⚖️',
                title: 'Interparty Bills',
                description: 'Detailed assessment preparation when one party must pay the other side\'s legal costs. Court-ready submissions.'
            },
            {
                icon: '📊',
                title: 'Cost Analysis',
                description: 'Comprehensive cost analysis and budget preparation for complex litigation matters.'
            },
            {
                icon: '🔍',
                title: 'Bill Review',
                description: 'Thorough review and audit of legal bills to ensure accuracy and compliance with court rules.'
            },
            {
                icon: '📝',
                title: 'Consultation',
                description: 'Expert consultation on cost rules, procedure, and strategy for optimal cost recovery.'
            }
        ];
    }

    async fetchTestimonialsData() {
        return [
            {
                quote: "Mix Legal Services helped us recover 30% more in costs than our previous provider. Their attention to detail is exceptional.",
                author: {
                    name: "James Smith",
                    title: "Partner, Smith & Associates",
                    initials: "JS"
                }
            },
            {
                quote: "Professional, reliable, and always delivered on time. They understand the complexities of housing law costs.",
                author: {
                    name: "Maria Johnson",
                    title: "Housing Solicitor",
                    initials: "MJ"
                }
            },
            {
                quote: "Their expertise in interparty bills saved us significant time and increased our recovery rate substantially.",
                author: {
                    name: "David Wilson",
                    title: "Senior Partner, Wilson & Co",
                    initials: "DW"
                }
            },
            {
                quote: "Outstanding service and deep knowledge of cost drafting. Highly recommend for complex commercial matters.",
                author: {
                    name: "Sarah Thompson",
                    title: "Commercial Litigation Lead",
                    initials: "ST"
                }
            }
        ];
    }

    handleResize() {
        // Handle responsive adjustments
        const isMobile = window.innerWidth < 768;
        
        // Update navigation if needed
        if (this.navigation) {
            this.navigation.handleResize(isMobile);
        }

        // Adjust layouts if needed
        this.adjustLayoutForScreenSize();
    }

    handleScroll() {
        // Handle scroll-based animations and effects
        const scrollY = window.scrollY;
        
        // Add/remove header shadow based on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (scrollY > 10) {
                header.style.boxShadow = 'var(--shadow-lg)';
            } else {
                header.style.boxShadow = 'var(--shadow)';
            }
        }

        // Update navigation active state based on scroll position
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        // Only for single page navigation (home page)
        if (this.currentPage !== 'home') return;

        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    adjustLayoutForScreenSize() {
        // Implement any dynamic layout adjustments
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Add classes based on screen size
        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-tablet', isTablet);
        document.body.classList.toggle('is-desktop', !isMobile && !isTablet);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            this.pauseAnimations();
        } else {
            // Page is visible
            this.resumeAnimations();
        }
    }

    pauseAnimations() {
        // Pause any ongoing animations to save resources
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        // Resume animations
        document.body.style.animationPlayState = 'running';
    }

    showErrorMessage(message) {
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        
        // Insert at top of page
        const main = document.querySelector('main') || document.body;
        main.insertBefore(errorDiv, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    cleanup() {
        // Cleanup event listeners and resources
        if (this.navigation) {
            this.navigation.cleanup();
        }
        
        if (this.themeToggle) {
            this.themeToggle.cleanup();
        }
        
        if (this.formHandler) {
            this.formHandler.cleanup();
        }
    }
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize the application
const app = new LegalServicesApp();