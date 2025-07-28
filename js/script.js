/**
 * FastTrack Dispatch - Main JavaScript File
 * A responsive truck dispatching website
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize AOS Animation Library
    AOS.init({
        duration: 500,
        easing: 'ease',
        once: true,
        mirror: false
    });

    // DOM Elements
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.querySelector('.back-to-top');
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    const faqItems = document.querySelectorAll('.faq-item');
    const statCounters = document.querySelectorAll('.stat-number');
    const contactForm = document.getElementById('contactForm');
    const carrierSetupForm = document.getElementById('carrierSetupForm');

    // Header scroll effect
    function scrollHeader() {
        if (window.scrollY > 5) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', scrollHeader);

    // Mobile Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Back to Top Button
    function scrollBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    }
    window.addEventListener('scroll', scrollBackToTop);

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Testimonial Slider
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        if (index < 0) {
            currentTestimonial = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            currentTestimonial = 0;
        } else {
            currentTestimonial = index;
        }
        
        if (testimonials[currentTestimonial]) {
            testimonials[currentTestimonial].classList.add('active');
        }
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', function() {
            showTestimonial(currentTestimonial - 1);
        });
    }

    if (testimonialNext) {
        testimonialNext.addEventListener('click', function() {
            showTestimonial(currentTestimonial + 1);
        });
    }

    // Auto-rotate testimonials
    if (testimonials.length > 0) {
        setInterval(function() {
            showTestimonial(currentTestimonial + 1);
        }, 5000);
    }

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Stats Counter Animation
    function startCounters() {
        statCounters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // 2 seconds
            const step = target / duration * 10; // Update every 10ms
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 10);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Start counting when the stats section is in view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // Form Validation
    function validateForm(form, formId) {
        if (!form) return;

        const formStatus = document.getElementById('form-status');
        let isValid = true;

        // Reset previous errors
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
        });

        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                formGroup.classList.add('error');
                errorMessage.textContent = 'This agreement is required';
                errorMessage.style.display = 'block';
            } else if (field.value.trim() === '') {
                isValid = false;
                formGroup.classList.add('error');
                errorMessage.textContent = 'This field is required';
                errorMessage.style.display = 'block';
            }
        });

        // Validate email fields
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value.trim() !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value)) {
                    isValid = false;
                    const formGroup = field.closest('.form-group');
                    formGroup.classList.add('error');
                    const errorMessage = formGroup.querySelector('.error-message');
                    errorMessage.textContent = 'Please enter a valid email address';
                    errorMessage.style.display = 'block';
                }
            }
        });

        // Validate phone fields
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value.trim() !== '') {
                const phonePattern = /^[\d\s\-\(\)]+$/;
                if (!phonePattern.test(field.value)) {
                    isValid = false;
                    const formGroup = field.closest('.form-group');
                    formGroup.classList.add('error');
                    const errorMessage = formGroup.querySelector('.error-message');
                    errorMessage.textContent = 'Please enter a valid phone number';
                    errorMessage.style.display = 'block';
                }
            }
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Re-validate on submission
            isValid = validateForm(form, formId);
            
            if (isValid) {
                // In a real application, you would send the form data to a server here
                // For this example, we'll just simulate a successful submission
                
                formStatus.className = 'form-status success';
                
                if (formId === 'contactForm') {
                    formStatus.textContent = 'Thank you for your message! We will get back to you shortly.';
                } else if (formId === 'carrierSetupForm') {
                    formStatus.textContent = 'Thank you for submitting your application! Our team will review it and contact you soon.';
                }
                
                formStatus.style.display = 'block';
                
                // Reset form
                form.reset();
                
                // Scroll to the status message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please correct the errors in the form and try again.';
                formStatus.style.display = 'block';
                
                // Scroll to the first error
                const firstError = form.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        return isValid;
    }

    // Initialize form validation for contact form
    if (contactForm) {
        validateForm(contactForm, 'contactForm');
    }

    // Initialize form validation for carrier setup form
    if (carrierSetupForm) {
        validateForm(carrierSetupForm, 'carrierSetupForm');
    }

    // Handle Newsletter Form Submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            
            if (emailInput.value.trim() === '') {
                alert('Please enter your email address');
                return;
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, you would send the form data to a server here
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href') !== '#') {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // Set active navigation based on current page
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop();
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.parentElement.classList.add('active');
            } else if (currentPage === '' && href === 'index.html') {
                link.parentElement.classList.add('active');
            }
        });
    }
    
    setActiveNavItem();
});