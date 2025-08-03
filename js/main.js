// Binyasir Logistics - Main JavaScript File
// Author: Binyasir Logistics Development Team
// Description: Handles all interactive functionality for the website

(function() {
    'use strict';

    // Global variables
    let navbar, navToggle, navMenu, backToTopBtn;
    let isMenuOpen = false;
    let scrollPosition = 0;

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeElements();
        setupEventListeners();
        initializeAnimations();
        setActiveNavigation();
        initializeBackToTop();
        initializeForms();
        initializeFAQ();
    });

    /**
     * Initialize DOM elements
     */
    function initializeElements() {
        navbar = document.querySelector('.navbar');
        navToggle = document.querySelector('.nav-toggle');
        navMenu = document.querySelector('.nav-menu');
        backToTopBtn = document.getElementById('backToTop');
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Mobile navigation toggle
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking on nav links
        if (navMenu) {
            navMenu.addEventListener('click', function(e) {
                if (e.target.classList.contains('nav-link')) {
                    closeMobileMenu();
                }
            });
        }

        // Scroll events
        window.addEventListener('scroll', handleScroll);

        // Resize events
        window.addEventListener('resize', handleResize);

        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    /**
     * Open mobile menu
     */
    function openMobileMenu() {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;

        // Animate menu items
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.style.animation = `slideInFromRight 0.3s ease-in-out ${index * 0.1}s both`;
        });
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;

        // Reset animations
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        scrollPosition = window.pageYOffset;

        // Update navbar appearance
        updateNavbarAppearance();

        // Update back to top button visibility
        updateBackToTopVisibility();

        // Update scroll animations
        updateScrollAnimations();
    }

    /**
     * Update navbar appearance on scroll
     */
    function updateNavbarAppearance() {
        if (navbar) {
            if (scrollPosition > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    /**
     * Update back to top button visibility
     */
    function updateBackToTopVisibility() {
        if (backToTopBtn) {
            if (scrollPosition > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close mobile menu on larger screens
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyDown(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }

        // Handle Enter key on interactive elements
        if (e.key === 'Enter') {
            const target = e.target;
            if (target.classList.contains('faq-question')) {
                toggleFAQItem(target.parentElement);
            }
        }
    }

    /**
     * Initialize scroll animations using Intersection Observer
     */
    function initializeAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(el => el.classList.add('animated'));
            return;
        }

        // Create intersection observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add stagger delay for multiple elements
                    const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                    const index = Array.from(siblings).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with animation class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Update scroll animations
     */
    function updateScrollAnimations() {
        // Add additional scroll-based animations here if needed
        const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    }

    /**
     * Set active navigation based on current page
     */
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize back to top functionality
     */
    function initializeBackToTop() {
        if (!backToTopBtn) return;

        // Smooth scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Add click event listener
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    /**
     * Scroll to top function
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize all forms
     */
    function initializeForms() {
        const contactForm = document.getElementById('contactForm');
        const carrierForm = document.getElementById('carrierForm');

        if (contactForm) {
            initializeContactForm(contactForm);
        }

        if (carrierForm) {
            initializeCarrierForm(carrierForm);
        }
    }

    /**
     * Initialize contact form
     */
    function initializeContactForm(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(form);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });

            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });
    }

    /**
     * Initialize carrier form
     */
    function initializeCarrierForm(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCarrierFormSubmission(form);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });

            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });

        // Save form data to localStorage
        saveFormDataToLocalStorage(form);
    }

    /**
     * Handle contact form submission
     */
    function handleContactFormSubmission(form) {
        const submitBtn = form.querySelector('.form-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        // Validate form
        if (!validateForm(form)) {
            showFormError('Please correct the errors above and try again.');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            const successDiv = document.getElementById('formSuccess');
            if (successDiv) {
                successDiv.style.display = 'block';
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Store submission data
            const formData = new FormData(form);
            const submissionData = {
                timestamp: new Date().toISOString(),
                type: 'contact',
                data: Object.fromEntries(formData)
            };
            
            // Save to localStorage
            const submissions = getStoredSubmissions();
            submissions.push(submissionData);
            localStorage.setItem('binyasir_submissions', JSON.stringify(submissions));

            // Reset loading state
            submitBtn.classList.remove('loading');
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;

        }, 2000);
    }

    /**
     * Handle carrier form submission
     */
    function handleCarrierFormSubmission(form) {
        const submitBtn = form.querySelector('.form-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        // Validate form
        if (!validateForm(form)) {
            showFormError('Please correct the errors above and try again.');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Hide form and show success message
            form.style.display = 'none';
            const successDiv = document.getElementById('carrierFormSuccess');
            if (successDiv) {
                successDiv.style.display = 'block';
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Store submission data
            const formData = new FormData(form);
            const submissionData = {
                timestamp: new Date().toISOString(),
                type: 'carrier',
                data: Object.fromEntries(formData)
            };
            
            // Save to localStorage
            const submissions = getStoredSubmissions();
            submissions.push(submissionData);
            localStorage.setItem('binyasir_submissions', JSON.stringify(submissions));

            // Clear saved form data
            localStorage.removeItem('binyasir_carrier_form');

            // Reset loading state
            submitBtn.classList.remove('loading');
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;

        }, 3000);
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        // Clear previous errors
        clearFormErrors(form);

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Additional custom validations
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address.');
                isValid = false;
            }
        });

        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number.');
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');

        // Clear previous error
        clearFieldError(field);

        // Required field validation
        if (isRequired && !value) {
            showFieldError(field, 'This field is required.');
            return false;
        }

        // Skip further validation if field is empty and not required
        if (!value && !isRequired) {
            return true;
        }

        // Email validation
        if (fieldType === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }

        // Phone validation
        if (fieldType === 'tel' && !isValidPhone(value)) {
            showFieldError(field, 'Please enter a valid phone number.');
            return false;
        }

        // Checkbox validation
        if (fieldType === 'checkbox' && isRequired && !field.checked) {
            showFieldError(field, 'Please check this box to continue.');
            return false;
        }

        // Select validation
        if (field.tagName === 'SELECT' && isRequired && !value) {
            showFieldError(field, 'Please select an option.');
            return false;
        }

        // Text length validation
        if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                showFieldError(field, `This field must be at least ${minLength} characters long.`);
                return false;
            }
        }

        return true;
    }

    /**
     * Show field error
     */
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }

    /**
     * Clear field error
     */
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    /**
     * Clear all form errors
     */
    function clearFormErrors(form) {
        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }

    /**
     * Show form error message
     */
    function showFormError(message) {
        // Create or update error message element
        let errorDiv = document.querySelector('.form-error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.style.cssText = `
                background: #fee;
                color: #c53030;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border: 1px solid #feb2b2;
            `;
        }
        
        errorDiv.textContent = message;
        
        // Insert at the top of the form
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation
     */
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    /**
     * Save form data to localStorage
     */
    function saveFormDataToLocalStorage(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                localStorage.setItem('binyasir_carrier_form', JSON.stringify(data));
            });
        });

        // Load saved data on page load
        const savedData = localStorage.getItem('binyasir_carrier_form');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
            } catch (e) {
                console.error('Error loading saved form data:', e);
            }
        }
    }

    /**
     * Get stored form submissions
     */
    function getStoredSubmissions() {
        try {
            const stored = localStorage.getItem('binyasir_submissions');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error retrieving stored submissions:', e);
            return [];
        }
    }

    /**
     * Initialize FAQ functionality
     */
    function initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    toggleFAQItem(item);
                });
            }
        });
    }

    /**
     * Toggle FAQ item
     */
    function toggleFAQItem(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        const allFaqItems = document.querySelectorAll('.faq-item');
        allFaqItems.forEach(faq => {
            if (faq !== item) {
                faq.classList.remove('active');
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }

    /**
     * Smooth scroll for anchor links
     */
    function initializeSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize lazy loading for images
     */
    function initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Initialize performance optimizations
     */
    function initializePerformanceOptimizations() {
        // Preload critical resources
        const criticalResources = [
            '/css/style.css',
            '/js/main.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });

        // Initialize smooth scroll
        initializeSmoothScroll();

        // Initialize lazy loading
        initializeLazyLoading();
    }

    /**
     * Error handling and logging
     */
    function initializeErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript Error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }

    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-blue);
            color: white;
            padding: 8px;
            z-index: 1000;
            text-decoration: none;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }

        // Enhance form accessibility
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const label = form.querySelector(`label[for="${field.id}"]`);
                if (label && !label.textContent.includes('*')) {
                    label.innerHTML += ' <span aria-label="required">*</span>';
                }
            });
        });
    }

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializePerformanceOptimizations();
        initializeErrorHandling();
        initializeAccessibility();
    });

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }

        .animate-pulse {
            animation: pulse 2s infinite;
        }

        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);

    // Export functions for global access if needed
    window.BinyasirLogistics = {
        toggleMobileMenu,
        scrollToTop,
        validateForm,
        showFormError,
        clearFormErrors
    };

})();

// Additional utility functions for enhanced functionality

/**
 * Debounce function to limit how often a function can fire
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle function to limit how often a function can fire
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Format phone number
 */
function formatPhoneNumber(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}

/**
 * Local storage wrapper with error handling
 */
const storage = {
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error getting from localStorage:', e);
            return null;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error setting to localStorage:', e);
            return false;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    }
};

// Make utility functions available globally
window.BinyasirUtils = {
    debounce,
    throttle,
    isInViewport,
    formatPhoneNumber,
    storage
};