/**
 * LandingLens - Main JavaScript
 * Handles navigation, animations, and general UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all UI components
    initNavigation();
    initScrollAnimations();
    initFAQAccordion();
    initFlashMessages();
    
    /**
     * Initialize navigation functionality
     */
    function initNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Toggle mobile menu
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                document.body.classList.toggle('menu-open');
            });
        }
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle anchor links
                if (href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        // Close mobile menu if open
                        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                            document.body.classList.remove('menu-open');
                        }
                        
                        // Smooth scroll to section
                        targetSection.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Update active navigation link based on scroll position
        window.addEventListener('scroll', updateActiveNavLink);
        
        function updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100; // Offset for header
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to corresponding link
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }
    }
    
    /**
     * Initialize scroll-based animations
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Check if elements are in viewport on page load
        checkViewportAnimations();
        
        // Listen for scroll events
        window.addEventListener('scroll', checkViewportAnimations);
        
        // Check if elements are in viewport and animate them
        function checkViewportAnimations() {
            animatedElements.forEach(element => {
                if (isElementInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                }
            });
        }
        
        // Check if element is in viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
                rect.bottom >= 0
            );
        }
    }
    
    /**
     * Initialize FAQ accordion functionality
     */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-question');
            const content = item.querySelector('.faq-answer');
            
            header.addEventListener('click', function() {
                // Toggle current item
                content.classList.toggle('hidden');
                header.classList.toggle('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector('.faq-answer');
                        const otherHeader = otherItem.querySelector('.faq-question');
                        
                        if (!otherContent.classList.contains('hidden')) {
                            otherContent.classList.add('hidden');
                            otherHeader.classList.remove('active');
                        }
                    }
                });
            });
        });
    }
    
    /**
     * Initialize flash messages functionality
     */
    function initFlashMessages() {
        const flashMessages = document.querySelectorAll('.flash-message');
        
        flashMessages.forEach(message => {
            const closeButton = message.querySelector('.flash-close');
            
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    message.remove();
                });
            }
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 5000);
        });
    }
    
    /**
     * Animated counter for statistics
     */
    const counterElements = document.querySelectorAll('.counter');
    
    counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 16)); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
            } else {
                counter.textContent = current.toLocaleString();
                requestAnimationFrame(updateCounter);
            }
        };
        
        // Start counter animation when element is in viewport
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        
        observer.observe(counter);
    });
});