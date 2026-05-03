/**
 * Theme Manager - Handles dark/light mode switching
 */
class ThemeManager {
    constructor() {
        this.themeKey = 'color-theme';
        this.darkModeToggle = null;
        this.mobileDarkModeToggle = null;
        this.init();
    }

    init() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');

        this.loadSavedTheme();
        this.bindEvents();
    }

    loadSavedTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem(this.themeKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.setDarkMode();
        } else {
            this.setLightMode();
        }
    }

    bindEvents() {
        if (this.darkModeToggle) {
            this.darkModeToggle.addEventListener('click', () => this.toggleTheme());
        }

        if (this.mobileDarkModeToggle) {
            this.mobileDarkModeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');

        if (isDark) {
            this.setLightMode();
        } else {
            this.setDarkMode();
        }

        this.updateButtonStates();
        this.saveThemePreference();
        this.logThemeChange();
    }

    setDarkMode() {
        document.documentElement.classList.add('dark');
        this.updateIcon(true);
    }

    setLightMode() {
        document.documentElement.classList.remove('dark');
        this.updateIcon(false);
    }

    updateIcon(isDark) {
        const icons = [this.darkModeToggle?.querySelector('i'), this.mobileDarkModeToggle?.querySelector('i')];
        icons.forEach(icon => {
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        });

        // Update accessibility attributes
        [this.darkModeToggle, this.mobileDarkModeToggle].forEach(btn => {
            if (btn) {
                btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
            }
        });
    }

    updateButtonStates() {
        const isDark = document.documentElement.classList.contains('dark');
        [this.darkModeToggle, this.mobileDarkModeToggle].forEach(btn => {
            if (btn) {
                btn.setAttribute('aria-pressed', isDark.toString());
            }
        });
    }

    saveThemePreference() {
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    }

    logThemeChange() {
        const isDark = document.documentElement.classList.contains('dark');
        console.log(`${isDark ? '🌙' : '☀️'} Switched to ${isDark ? 'dark' : 'light'} mode`);
    }
}

// Export for use in other modules
window.ThemeManager = ThemeManager;