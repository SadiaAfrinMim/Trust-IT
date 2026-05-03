/**
 * Navigation Manager - Handles mobile menu and smooth scrolling
 */
class NavigationManager {
    constructor() {
        this.mobileMenuButton = null;
        this.mobileMenu = null;
        this.navLinks = null;
        this.init();
    }

    init() {
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');

        this.bindEvents();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuButton && this.mobileMenu) {
            this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking on a link
        const mobileLinks = this.mobileMenu?.querySelectorAll('a');
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e, link));
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => this.handleScroll());
    }

    toggleMobileMenu() {
        const isExpanded = this.mobileMenu.classList.toggle('hidden');
        this.mobileMenuButton.setAttribute('aria-expanded', !isExpanded.toString());

        // Update button icon (hamburger/close)
        const icon = this.mobileMenuButton.querySelector('svg');
        if (icon) {
            const isOpen = !isExpanded;
            icon.innerHTML = isOpen
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    }

    closeMobileMenu() {
        if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
            this.mobileMenu.classList.add('hidden');
            this.mobileMenuButton.setAttribute('aria-expanded', 'false');

            // Reset hamburger icon
            const icon = this.mobileMenuButton.querySelector('svg');
            if (icon) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        }
    }

    handleNavClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            this.closeMobileMenu();
        }
    }

    handleScroll() {
        const nav = document.querySelector('.animated-nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }
}

// Export for use in other modules
window.NavigationManager = NavigationManager;