// Initialize after components are loaded
function initializeComponents() {
    // Prevent multiple initializations
    if (window.componentsInitialized) return;
    window.componentsInitialized = true;
    // Hamburger menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.toggle('hidden');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');

    // Check for saved theme preference or default to light mode
    if (localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Function to handle dark mode toggle
    function toggleDarkMode() {
        // Toggle dark class
        document.documentElement.classList.toggle('dark');

        // Update button title for accessibility
        const isDark = document.documentElement.classList.contains('dark');
        if (darkModeToggle) {
            darkModeToggle.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }

        // Save preference to localStorage
        if (isDark) {
            localStorage.setItem('color-theme', 'dark');
            console.log('🌙 Switched to dark mode');
        } else {
            localStorage.setItem('color-theme', 'light');
            console.log('☀️ Switched to light mode');
        }
    }

    // Desktop dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Mobile dark mode toggle
    if (mobileDarkModeToggle) {
        mobileDarkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            menuToggle.setAttribute('aria-expanded', !isHidden);
        });
    }

    // Scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
        });
    }



    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 64; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    menuToggle.click();
                }
            }
        });
    });
}

// Expose globally for index.html
window.initializeComponents = initializeComponents;

// Components will be initialized after loading via window.initializeComponents()

// Video error handling
const heroVideo = document.querySelector('#hero video');
if (heroVideo) {
    heroVideo.addEventListener('error', function() {
        console.log('Hero video failed to load, showing fallback background');
        this.style.display = 'none';
    });

    heroVideo.addEventListener('loadeddata', function() {
        console.log('Hero video loaded successfully');
    });

    // Fallback if video doesn't load within 3 seconds
    setTimeout(() => {
        if (heroVideo.readyState === 0) {
            console.log('Hero video taking too long to load, showing fallback');
            heroVideo.style.display = 'none';
        }
    }, 3000);
}// Form validation
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name validation
    if (nameInput.value.trim() === '') {
        nameError.classList.remove('hidden');
        isValid = false;
    } else {
        nameError.classList.add('hidden');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.classList.remove('hidden');
        isValid = false;
    } else {
        emailError.classList.add('hidden');
    }

    // Message validation
    if (messageInput.value.trim() === '') {
        messageError.classList.remove('hidden');
        isValid = false;
    } else {
        messageError.classList.add('hidden');
    }

    if (isValid) {
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    }
});