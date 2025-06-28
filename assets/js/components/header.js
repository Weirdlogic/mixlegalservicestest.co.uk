// Header Component
class Header {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.renderHeader();
        this.updateActiveNavigation();
        console.log('Header component initialized');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('contact')) return 'contact';
        if (path.includes('help')) return 'help';
        return 'home';
    }

    getNavigation() {
        const isSubPage = this.currentPage !== 'home';
        const basePath = isSubPage ? '../' : '';
        
        return [
            { label: 'Home', url: `${basePath}index.html`, id: 'home' },
            { label: 'About', url: `${basePath}pages/about.html`, id: 'about' },
            { label: 'Services', url: `${basePath}pages/services.html`, id: 'services' },
            { label: 'Contact', url: `${basePath}pages/contact.html`, id: 'contact' },
            { label: 'Help', url: `${basePath}pages/help.html`, id: 'help' }
        ];
    }

    renderHeader() {
        const navigation = this.getNavigation();
        
        const headerHTML = `
            <header class="header" id="header">
                <nav class="nav-container">
                    <div class="logo">
                        <div class="logo-icon">ML</div>
                        <span>Mix Legal Services</span>
                    </div>
                    <ul class="nav-menu" id="nav-menu">
                        ${navigation.map(item => `
                            <li>
                                <a href="${item.url}" data-page="${item.id}" ${item.id === this.currentPage ? 'class="active"' : ''}>
                                    ${item.label}
                                </a>
                            </li>
                        `).join('')}
                        <li><button class="theme-toggle" id="theme-toggle">🌙 Dark</button></li>
                    </ul>
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </header>
        `;

        // Insert header at the beginning of body or in placeholder
        const placeholder = document.getElementById('header-placeholder');
        if (placeholder) {
            placeholder.innerHTML = headerHTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }
    }

    updateActiveNavigation() {
        // This will be called after header is rendered
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-menu a[data-page]');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === this.currentPage) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Header();
});