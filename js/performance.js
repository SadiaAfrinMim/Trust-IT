/**
 * Performance Utilities
 * Contains performance optimization helpers
 */

/**
 * Lazy load images with intersection observer
 */
class LazyImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.images.forEach(img => this.observer.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

/**
 * Preload critical resources
 */
class ResourcePreloader {
    constructor() {
        this.criticalResources = [
            'assets/logo.svg',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];
        this.init();
    }

    init() {
        // Preload critical resources
        this.preloadCriticalResources();

        // Preload components on idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.preloadComponents());
        } else {
            setTimeout(() => this.preloadComponents(), 2000);
        }
    }

    preloadCriticalResources() {
        this.criticalResources.forEach(resource => {
            if (resource.endsWith('.css')) {
                this.preloadCSS(resource);
            } else if (resource.endsWith('.svg') || resource.endsWith('.png') || resource.endsWith('.jpg')) {
                this.preloadImage(resource);
            }
        });
    }

    preloadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    }

    preloadImage(src) {
        const img = new Image();
        img.src = src;
    }

    preloadComponents() {
        const components = [
            'components/services.html',
            'components/about.html',
            'components/contact.html',
            'components/footer.html'
        ];

        components.forEach(component => {
            fetch(component, { priority: 'low' })
                .then(response => response.text())
                .then(() => console.log(`Preloaded: ${component}`))
                .catch(() => console.log(`Failed to preload: ${component}`));
        });
    }
}

/**
 * Service Worker registration for caching
 */
class ServiceWorkerManager {
    constructor() {
        this.init();
    }

    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                this.registerServiceWorker();
            });
        }
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registered successfully:', registration.scope);

            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                }
            });
        } catch (error) {
            console.log('ServiceWorker registration failed:', error);
        }
    }

    showUpdateNotification() {
        // Show notification about available update
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>New version available!</span>
                <button onclick="location.reload()" class="ml-4 bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
                    Update
                </button>
            </div>
        `;
        document.body.appendChild(notification);
    }
}

// Initialize performance utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize lazy loading
    new LazyImageLoader();

    // Initialize resource preloading
    new ResourcePreloader();

    // Initialize service worker
    new ServiceWorkerManager();
});

// Export utilities globally
window.LazyImageLoader = LazyImageLoader;
window.ResourcePreloader = ResourcePreloader;
window.ServiceWorkerManager = ServiceWorkerManager;