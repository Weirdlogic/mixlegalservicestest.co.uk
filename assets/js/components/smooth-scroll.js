// Smooth Scroll Component
class SmoothScroll {
    constructor() {
        this.offset = 80; // Header height offset
        this.duration = 800; // Animation duration in ms
        this.easing = 'easeInOutCubic'; // Easing function
        this.init();
    }

    init() {
        // Set up smooth scrolling for anchor links
        this.setupAnchorLinks();
        
        // Set up back to top functionality
        this.setupBackToTop();
        
        // Handle browser back/forward buttons
        this.setupPopStateHandler();
        
        console.log('Smooth scroll initialized');
    }

    setupAnchorLinks() {
        // Find all anchor links that start with #
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleAnchorClick(e));
        });
    }

    setupBackToTop() {
        // Create back to top button if it doesn't exist
        let backToTopBtn = document.getElementById('back-to-top');
        
        if (!backToTopBtn) {
            backToTopBtn = this.createBackToTopButton();
            document.body.appendChild(backToTopBtn);
        }

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            this.handleBackToTopVisibility(backToTopBtn);
        });

        // Handle click
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
    }

    createBackToTopButton() {
        const button = document.createElement('button');
        button.id = 'back-to-top';
        button.className = 'back-to-top-btn';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-blue);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;
        
        return button;
    }

    handleAnchorClick(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        
        // Skip if href is just "#" or empty
        if (!href || href === '#') {
            event.preventDefault();
            return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            event.preventDefault();
            
            // Scroll to target
            this.scrollToElement(targetElement);
            
            // Update URL without page reload
            this.updateURL(href);
            
            // Update active navigation
            this.updateActiveNavigation(href);
        }
    }

    scrollToElement(element, customOffset = null) {
        if (!element) return;

        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - (customOffset || this.offset);
        
        this.animateScroll(offsetPosition);
    }

    scrollToTop() {
        this.animateScroll(0);
    }

    animateScroll(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const animateStep = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.duration, 1);
            
            // Apply easing function
            const easedProgress = this.applyEasing(progress);
            
            window.scrollTo(0, startPosition + (distance * easedProgress));

            if (timeElapsed < this.duration) {
                requestAnimationFrame(animateStep);
            }
        };

        requestAnimationFrame(animateStep);
    }

    applyEasing(t) {
        // Easing functions
        const easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeInQuart: t => t * t * t * t,
            easeOutQuart: t => 1 - (--t) * t * t * t,
            easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
        };

        return easingFunctions[this.easing] ? easingFunctions[this.easing](t) : t;
    }

    updateURL(hash) {
        // Update URL without triggering page reload
        if (history.pushState) {
            const newUrl = window.location.pathname + window.location.search + hash;
            history.pushState(null, null, newUrl);
        }
    }

    updateActiveNavigation(activeHash) {
        // Remove active class from all navigation links
        const navLinks = document.querySelectorAll('.nav-menu a, .help-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current link
        const activeLink = document.querySelector(`a[href="${activeHash}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    handleBackToTopVisibility(button) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    }

    setupPopStateHandler() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const hash = window.location.hash;
            
            if (hash) {
                const targetElement = document.getElementById(hash.substring(1));
                if (targetElement) {
                    // Small delay to ensure page is ready
                    setTimeout(() => {
                        this.scrollToElement(targetElement);
                        this.updateActiveNavigation(hash);
                    }, 100);
                }
            }
        });
    }

    // Public method to scroll to element by ID
    scrollTo(elementId, customOffset = null) {
        const element = document.getElementById(elementId);
        if (element) {
            this.scrollToElement(element, customOffset);
        }
    }

    // Public method to scroll to specific position
    scrollToPosition(position) {
        this.animateScroll(position);
    }

    // Public method to set offset (useful for dynamic header heights)
    setOffset(newOffset) {
        this.offset = newOffset;
    }

    // Public method to set animation duration
    setDuration(newDuration) {
        this.duration = newDuration;
    }

    // Public method to set easing function
    setEasing(newEasing) {
        this.easing = newEasing;
    }

    // Scroll spy functionality - highlights navigation based on scroll position
    initScrollSpy(sections = null, navLinks = null) {
        const defaultSections = sections || document.querySelectorAll('section[id]');
        const defaultNavLinks = navLinks || document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (!defaultSections.length || !defaultNavLinks.length) return;

        const handleScrollSpy = () => {
            const scrollPosition = window.scrollY + this.offset + 50;
            let currentSection = '';

            defaultSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active navigation
            defaultNavLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        };

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScrollSpy();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        handleScrollSpy();
    }

    // Scroll to hash on page load
    handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                const targetElement = document.getElementById(hash.substring(1));
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    this.updateActiveNavigation(hash);
                }
            }, 300);
        }
    }

    // Cleanup method
    cleanup() {
        // Remove event listeners
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.removeEventListener('click', this.handleAnchorClick);
        });

        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.remove();
        }

        window.removeEventListener('scroll', this.handleBackToTopVisibility);
        window.removeEventListener('popstate', this.setupPopStateHandler);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const smoothScroll = new SmoothScroll();
    
    // Handle initial hash if present
    smoothScroll.handleInitialHash();
    
    // Initialize scroll spy for single-page navigation
    if (document.querySelectorAll('section[id]').length > 1) {
        smoothScroll.initScrollSpy();
    }
    
    // Make available globally
    window.smoothScroll = smoothScroll;
});

// Additional CSS for back to top button hover effects
if (!document.querySelector('#smooth-scroll-styles')) {
    const style = document.createElement('style');
    style.id = 'smooth-scroll-styles';
    style.textContent = `
        .back-to-top-btn:hover {
            background: var(--secondary-blue) !important;
            transform: translateY(-2px);
        }
        
        .back-to-top-btn:active {
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .back-to-top-btn {
                width: 45px !important;
                height: 45px !important;
                bottom: 20px !important;
                right: 20px !important;
                font-size: 18px !important;
            }
        }
    `;
    document.head.appendChild(style);
}