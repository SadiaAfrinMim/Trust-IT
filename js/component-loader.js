/**
 * Component Loader - Handles dynamic loading of HTML components
 */
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.init();
    }

    init() {
        // Load all components when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllComponents());
        } else {
            this.loadAllComponents();
        }
    }

    async loadComponent(file, containerId) {
        try {
            const response = await fetch(file, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const container = document.getElementById(containerId);

            if (container) {
                container.innerHTML = html;
                this.loadedComponents.add(containerId);
                console.log(`✅ Component loaded: ${file}`);
                return true;
            } else {
                console.error(`❌ Container not found: ${containerId}`);
                return false;
            }

        } catch (error) {
            console.error(`❌ Error loading component ${file}:`, error);
            // Show fallback content
            this.showFallback(containerId);
            return false;
        }
    }

    async loadAllComponents() {
        const components = [
            { file: 'components/hero.html', container: 'hero-container' },
            { file: 'components/services.html', container: 'services-container' },
            { file: 'components/about.html', container: 'about-container' },
            { file: 'components/contact.html', container: 'contact-container' },
            { file: 'components/footer.html', container: 'footer-container' }
        ];

        try {
            const loadPromises = components.map(({ file, container }) =>
                this.loadComponent(file, container)
            );

            const results = await Promise.allSettled(loadPromises);

            // Check results and log any failures
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to load component: ${components[index].file}`, result.reason);
                }
            });

            // Initialize components after loading
            this.initializeComponents();

        } catch (error) {
            console.error('❌ Error loading components:', error);
        }
    }

    initializeComponents() {
        // Add loaded class for smooth animations
        const containers = ['hero-container', 'services-container', 'about-container', 'contact-container', 'footer-container'];

        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.classList.add('component-loaded');
            }
        });

        // Trigger initialization of components that depend on DOM elements
        if (window.initializeComponents) {
            window.initializeComponents();
        }

        console.log('🎉 All components initialized');
    }

    showFallback(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="flex items-center justify-center p-8 text-gray-500">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>Content loading failed. Please refresh the page.</p>
                    </div>
                </div>
            `;
        }
    }

    // Method to reload a specific component
    async reloadComponent(file, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('component-loaded');
            container.classList.add('component-loading');
        }

        const success = await this.loadComponent(file, containerId);

        if (success && container) {
            // Small delay for smooth transition
            setTimeout(() => {
                container.classList.add('component-loaded');
            }, 100);
        }

        return success;
    }

    // Check if component is loaded
    isComponentLoaded(containerId) {
        return this.loadedComponents.has(containerId);
    }
}

// Export for use in other modules
window.ComponentLoader = ComponentLoader;