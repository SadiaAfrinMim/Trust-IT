/**
 * Main Application Entry Point
 * Initializes all managers and components
 */

// Global managers
let themeManager;
let navigationManager;
let scrollManager;
let componentLoader;

/**
 * Initialize all components and managers after DOM is ready
 */
function initializeComponents() {
    // Prevent multiple initializations
    if (window.componentsInitialized) return;
    window.componentsInitialized = true;

    try {
        // Initialize all managers
        themeManager = new ThemeManager();
        navigationManager = new NavigationManager();
        scrollManager = new ScrollManager();

        // Initialize form validation and other component-specific features
        initializeFormValidation();
        initializeVideoFallback();
        initializeScrollAnimations();

        console.log('🚀 All components initialized successfully');

    } catch (error) {
        console.error('❌ Error initializing components:', error);
    }
}

/**
 * Initialize contact form validation
 */
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const formElements = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message'),
        nameError: document.getElementById('nameError'),
        emailError: document.getElementById('emailError'),
        messageError: document.getElementById('messageError')
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const validation = validateForm(formElements);
        if (validation.isValid) {
            handleFormSuccess(contactForm);
        }
    });

    // Real-time validation
    Object.keys(formElements).forEach(key => {
        if (key.includes('Input') && formElements[key]) {
            formElements[key].addEventListener('blur', () => {
                validateField(key.replace('Input', '').toLowerCase(), formElements);
            });
        }
    });
}

/**
 * Validate entire form
 */
function validateForm(elements) {
    let isValid = true;

    // Name validation
    if (!validateField('name', elements)) isValid = false;

    // Email validation
    if (!validateField('email', elements)) isValid = false;

    // Message validation
    if (!validateField('message', elements)) isValid = false;

    return { isValid };
}

/**
 * Validate individual field
 */
function validateField(fieldName, elements) {
    const input = elements[fieldName + 'Input'];
    const error = elements[fieldName + 'Error'];

    if (!input || !error) return true;

    let isValid = true;
    const value = input.value.trim();

    switch (fieldName) {
        case 'name':
            isValid = value.length >= 2;
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
            break;
        case 'message':
            isValid = value.length >= 10;
            break;
    }

    if (isValid) {
        error.classList.add('hidden');
        input.classList.remove('border-red-500');
        input.classList.add('border-green-500');
    } else {
        error.classList.remove('hidden');
        input.classList.remove('border-green-500');
        input.classList.add('border-red-500');
    }

    return isValid;
}

/**
 * Handle successful form submission
 */
function handleFormSuccess(form) {
    // Show success message
    showNotification('Thank you for your message! We will get back to you soon.', 'success');

    // Reset form
    form.reset();

    // Reset validation states
    form.querySelectorAll('.border-red-500, .border-green-500').forEach(el => {
        el.classList.remove('border-red-500', 'border-green-500');
    });
}

/**
 * Initialize video fallback for hero section
 */
function initializeVideoFallback() {
    const heroVideo = document.querySelector('#hero video');
    if (!heroVideo) return;

    let fallbackTimeout;

    heroVideo.addEventListener('error', function() {
        console.log('Hero video failed to load, showing fallback background');
        clearTimeout(fallbackTimeout);
        this.style.display = 'none';
        showNotification('Video failed to load, showing fallback content', 'warning');
    });

    heroVideo.addEventListener('loadeddata', function() {
        console.log('Hero video loaded successfully');
        clearTimeout(fallbackTimeout);
    });

    // Fallback if video doesn't load within 5 seconds
    fallbackTimeout = setTimeout(() => {
        if (heroVideo.readyState === 0) {
            console.log('Hero video taking too long to load, showing fallback');
            heroVideo.style.display = 'none';
        }
    }, 5000);
}

/**
 * Initialize scroll-triggered animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Utility function for debounced execution
 */
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

/**
 * Utility function for throttled execution
 */
function throttle(func, wait) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}

// Expose globally for index.html
window.initializeComponents = initializeComponents;

// Initialize component loader immediately
document.addEventListener('DOMContentLoaded', () => {
    componentLoader = new ComponentLoader();
});