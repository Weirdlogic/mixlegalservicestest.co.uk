// Navigation Component
class Navigation {
    constructor() {
        this.navMenu = document.getElementById('nav-menu');
        this.mobileToggle = document.getElementById('mobile-menu-toggle');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.isMenuOpen = false;
        this.isMobile = window.innerWidth < 768;
        
        this.init();
    }

    init() {
        if (!this.navMenu) return;
        
        // Set up mobile menu toggle
        this.setupMobileToggle();
        
        // Set up navigation links
        this.setupNavLinks();
        
        // Set active link based on current page
        this.setActiveLink();
        
        // Handle escape key for mobile menu
        this.setupKeyboardNavigation();
        
        // Handle clicks outside menu
        this.setupOutsideClickHandler();
        
        console.log('Navigation initialized');
    }

    setupMobileToggle() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => this.handleMobileToggle(e));
            this.mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
            this.mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }

    setupNavLinks() {
        this.navLinks.forEach(link => {
            // Add click handler for smooth scrolling on same page
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => this.handleAnchorClick(e));
            }
            
            // Close mobile menu when link is clicked
            link.addEventListener('click', () => {
                if (this.isMobile && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Close mobile menu on Escape
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
                this.mobileToggle?.focus();
            }
            
            // Handle arrow keys in mobile menu
            if (this.isMenuOpen && this.isMobile) {
                this.handleArrowKeys(e);
            }
        });
    }

    setupOutsideClickHandler() {
        document.addEventListener('click', (e) => {
            const header = document.querySelector('.header');
            if (this.isMenuOpen && header && !header.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    handleMobileToggle(event) {
        event.preventDefault();
        
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.navMenu.classList.add('active');
        this.mobileToggle?.classList.add('active');
        this.mobileToggle?.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item
        const firstLink = this.navMenu.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
        
        // Add animation class
        this.navMenu.style.animation = 'slideDown 0.3s ease-out';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.mobileToggle?.classList.remove('active');
        this.mobileToggle?.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Add closing animation
        this.navMenu.style.animation = 'slideUp 0.3s ease-out';
    }

    handleAnchorClick(event) {
        const href = event.target.getAttribute('href');
        
        // Only handle same-page anchors
        if (href.startsWith('#')) {
            event.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering page reload
                history.pushState(null, null, href);
                
                // Update active link
                this.setActiveLink(href);
            }
        }
    }

    handleArrowKeys(event) {
        if (!this.isMenuOpen) return;
        
        const focusableElements = this.navMenu.querySelectorAll('a, button');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % focusableElements.length;
                focusableElements[nextIndex].focus();
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
                focusableElements[prevIndex].focus();
                break;
                
            case 'Home':
                event.preventDefault();
                focusableElements[0].focus();
                break;
                
            case 'End':
                event.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
                break;
        }
    }

    setActiveLink(activeHref = null) {
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        let targetHref = activeHref;
        
        // If no specific href provided, determine from current page/section
        if (!targetHref) {
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;
            
            // For home page with hash
            if (currentPath.endsWith('index.html') || currentPath === '/' || currentPath === '') {
                if (currentHash) {
                    targetHref = currentHash;
                } else {
                    targetHref = '#home';
                }
            } else {
                // For other pages, match the pathname
                this.navLinks.forEach(link => {
                    const linkPath = link.getAttribute('href');
                    if (currentPath.includes(linkPath)) {
                        link.classList.add('active');
                    }
                });
                return;
            }
        }
        
        // Set active link for anchor links
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === targetHref) {
                link.classList.add('active');
            }
        });
    }

    handleResize(isMobile) {
        const wasMobile = this.isMobile;
        this.isMobile = isMobile;
        
        // If switching from mobile to desktop, close mobile menu
        if (wasMobile && !isMobile && this.isMenuOpen) {
            this.closeMobileMenu();
            document.body.style.overflow = '';
        }
        
        // Update ARIA attributes based on screen size
        if (this.mobileToggle) {
            if (isMobile) {
                this.mobileToggle.style.display = 'flex';
                this.navMenu.setAttribute('aria-hidden', this.isMenuOpen ? 'false' : 'true');
            } else {
                this.mobileToggle.style.display = 'none';
                this.navMenu.setAttribute('aria-hidden', 'false');
                this.navMenu.classList.remove('active');
            }
        }
    }

    // Method to programmatically navigate to a section
    navigateToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.setActiveLink(`#${sectionId}`);
        }
    }

    // Method to highlight navigation based on scroll position
    updateActiveOnScroll() {
        // Only for single page navigation
        if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
            return;
        }
        
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150; // Offset for header
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            this.setActiveLink(`#${currentSection}`);
        }
    }

    cleanup() {
        // Remove event listeners
        if (this.mobileToggle) {
            this.mobileToggle.removeEventListener('click', this.handleMobileToggle);
        }
        
        this.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleAnchorClick);
        });
        
        document.removeEventListener('keydown', this.handleArrowKeys);
        document.removeEventListener('click', this.setupOutsideClickHandler);
        
        // Restore body scroll if menu was open
        if (this.isMenuOpen) {
            document.body.style.overflow = '';
        }
    }
}

// CSS animations for mobile menu (if not already in CSS)
if (!document.querySelector('#navigation-styles')) {
    const style = document.createElement('style');
    style.id = 'navigation-styles';
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
        
        .nav-menu.active {
            display: flex !important;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
    `;
    document.head.appendChild(style);
}