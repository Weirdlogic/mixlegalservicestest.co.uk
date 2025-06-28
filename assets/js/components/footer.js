// Footer Component
class Footer {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.renderFooter();
        console.log('Footer component initialized');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('contact')) return 'contact';
        if (path.includes('help')) return 'help';
        return 'home';
    }

    getFooterLinks() {
        const isSubPage = this.currentPage !== 'home';
        const basePath = isSubPage ? '../' : '';
        
        return {
            services: [
                { label: 'Civil Matters', url: `${basePath}pages/services.html#civil` },
                { label: 'Housing Disputes', url: `${basePath}pages/services.html#housing` },
                { label: 'Interparty Bills', url: `${basePath}pages/services.html#interparty` },
                { label: 'Cost Analysis', url: `${basePath}pages/services.html#analysis` }
            ],
            company: [
                { label: 'About Us', url: `${basePath}pages/about.html` },
                { label: 'Contact', url: `${basePath}pages/contact.html` },
                { label: 'Help & Support', url: `${basePath}pages/help.html` },
                { label: 'Privacy Policy', url: `${basePath}pages/privacy.html` }
            ]
        };
    }

    renderFooter() {
        const links = this.getFooterLinks();
        
        const footerHTML = `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <div class="logo">
                                <div class="logo-icon">ML</div>
                                <span>Mix Legal Services</span>
                            </div>
                            <p>Professional legal cost drafting services across the UK.</p>
                        </div>
                        
                        <div class="footer-section">
                            <h4>Services</h4>
                            <ul>
                                ${links.services.map(link => `
                                    <li><a href="${link.url}">${link.label}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4>Company</h4>
                            <ul>
                                ${links.company.map(link => `
                                    <li><a href="${link.url}">${link.label}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4>Contact Info</h4>
                            <p>📧 info@mixlegalservices.co.uk</p>
                            <p>📞 +44 (0) 20 1234 5678</p>
                            <p>📍 London, United Kingdom</p>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; 2025 Mix Legal Services. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;

        // Insert footer at the end of body or in placeholder
        const placeholder = document.getElementById('footer-placeholder');
        if (placeholder) {
            placeholder.innerHTML = footerHTML;
        } else {
            document.body.insertAdjacentHTML('beforeend', footerHTML);
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Footer();
});