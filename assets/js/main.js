// ===== MAIN JAVASCRIPT FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initForms();
    initFAQ();
    initStats();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Navbar scroll effects
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.program-card, .curriculum-item, .benefit-item, .testimonial-card, .story-card, .week-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .progress-fill {
            animation: fillProgress 2s ease-out;
        }
        
        @keyframes fillProgress {
            from { width: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== FORMS =====
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contact');
        });
    }
    
    // Enrollment forms
    const enrollmentForms = document.querySelectorAll('.enrollment-form-fields');
    enrollmentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'enrollment');
        });
    });
    
    // Form validation
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if field is empty
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (if provided)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Add error styling if not exists
    if (!document.querySelector('.field-error-style')) {
        const errorStyle = document.createElement('style');
        errorStyle.className = 'field-error-style';
        errorStyle.textContent = `
            .form-group input.error,
            .form-group select.error,
            .form-group textarea.error {
                border-color: #e53e3e;
                box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
            }
        `;
        document.head.appendChild(errorStyle);
    }
    
    // Show error message
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = 'color: #e53e3e; font-size: 0.875rem; margin-top: 0.5rem;';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function handleFormSubmission(form, type) {
    // Validate all required fields
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Show success message
        if (type === 'contact') {
            showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
        } else if (type === 'enrollment') {
            showNotification('Enrollment request submitted! You\'ll receive confirmation details shortly.', 'success');
        }
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    if (!document.querySelector('.notification-style')) {
        const notificationStyle = document.createElement('style');
        notificationStyle.className = 'notification-style';
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                background: #f0fff4;
                border-left: 4px solid #48bb78;
                color: #22543d;
            }
            
            .notification-error {
                background: #fed7d7;
                border-left: 4px solid #e53e3e;
                color: #742a2a;
            }
            
            .notification-info {
                background: #ebf8ff;
                border-left: 4px solid #3182ce;
                color: #2a4365;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                padding: 0.25rem;
                border-radius: 4px;
            }
            
            .notification-close:hover {
                opacity: 1;
                background: rgba(0, 0, 0, 0.1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(notificationStyle);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Add FAQ styles
    if (!document.querySelector('.faq-style')) {
        const faqStyle = document.createElement('style');
        faqStyle.className = 'faq-style';
        faqStyle.textContent = `
            .faq-item {
                background: white;
                border-radius: 10px;
                margin-bottom: 1rem;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .faq-question {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                cursor: pointer;
                background: white;
                border: none;
                width: 100%;
                text-align: left;
                transition: all 0.3s ease;
            }
            
            .faq-question:hover {
                background: #f7fafc;
            }
            
            .faq-question h3 {
                margin: 0;
                color: #2d3748;
                font-size: 1.125rem;
            }
            
            .faq-question i {
                color: #3182ce;
                transition: transform 0.3s ease;
            }
            
            .faq-item.active .faq-question i {
                transform: rotate(180deg);
            }
            
            .faq-answer {
                padding: 0 1.5rem;
                max-height: 0;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .faq-item.active .faq-answer {
                padding: 0 1.5rem 1.5rem;
                max-height: 200px;
            }
            
            .faq-answer p {
                color: #4a5568;
                margin: 0;
                line-height: 1.6;
            }
        `;
        document.head.appendChild(faqStyle);
    }
}

// ===== ANIMATED STATISTICS =====
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number, .result-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateNumber(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    const suffix = text.replace(/[0-9]/g, '');
    
    if (number === 0) return;
    
    const duration = 2000;
    const increment = number / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        // Format large numbers
        if (displayValue >= 1000000) {
            displayValue = (displayValue / 1000000).toFixed(1) + 'M';
        } else if (displayValue >= 1000) {
            displayValue = (displayValue / 1000).toFixed(1) + 'K';
        }
        
        element.textContent = displayValue + suffix.replace(/[0-9.MK]/g, '');
    }, 16);
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy loading for images (if needed in future)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
// initLazyLoading();

console.log('Tom West\'s Land Investment Academy website loaded successfully! 🏞️💰');
