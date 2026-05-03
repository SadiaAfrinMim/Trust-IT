/**
 * Scroll Manager - Handles scroll progress and related functionality
 */
class ScrollManager {
    constructor() {
        this.scrollProgress = null;
        this.lastScrollTop = 0;
        this.ticking = false;
        this.init();
    }

    init() {
        this.scrollProgress = document.getElementById('scrollProgress');
        this.bindEvents();
    }

    bindEvents() {
        // Throttled scroll event for better performance
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollProgress();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

        this.scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;

        // Update scroll direction for potential future features
        this.lastScrollTop = scrollTop;
    }

    // Utility method to scroll to element
    scrollToElement(element, offset = 0) {
        if (!element) return;

        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementTop - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Get current scroll position
    getScrollPosition() {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    }

    // Check if element is in viewport
    isElementInViewport(element, threshold = 0) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    }
}

// Export for use in other modules
window.ScrollManager = ScrollManager;