// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeComponents();
    setupNavigationHandlers();
});

function initializeComponents() {
    // Initialize all interactive components
    setupMobileMenu();
    setupProfileDropdown();
    setupSmoothScrolling();
    setupCounterAnimation();
    setupTickerAnimation();
    setupScrollEffects();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            
            // Animate hamburger menu
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('show')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking on navigation links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// Profile Dropdown
function setupProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (profileBtn && dropdownMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Close dropdown when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active navigation
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Update Active Navigation
function updateActiveNavigation(activeId) {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

// Counter Animation
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100; // Animate over 100 steps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 30); // Update every 30ms for smooth animation
        });
        
        hasAnimated = true;
    }

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                animateCounters();
            }
        });
    }, {
        threshold: 0.5
    });

    const impactSection = document.querySelector('.impact');
    if (impactSection) {
        observer.observe(impactSection);
    }
}

// Enhanced Ticker Animation with Pause on Hover
function setupTickerAnimation() {
    const tickerContent = document.getElementById('tickerContent');
    
    if (tickerContent) {
        // Duplicate content for seamless loop
        const originalContent = tickerContent.innerHTML;
        tickerContent.innerHTML = originalContent + originalContent;
        
        // Pause animation on hover
        const alertsSection = document.querySelector('.alerts');
        if (alertsSection) {
            alertsSection.addEventListener('mouseenter', function() {
                tickerContent.style.animationPlayState = 'paused';
            });
            
            alertsSection.addEventListener('mouseleave', function() {
                tickerContent.style.animationPlayState = 'running';
            });
        }
    }
}

// Scroll Effects and Active Section Detection
function setupScrollEffects() {
    // Header background opacity on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Header background effect
        if (scrolled > 50) {
            header.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
            header.style.backdropFilter = 'none';
        }
        
        // Update active navigation based on scroll position
        updateNavigationOnScroll();
    });
}

// Update Navigation Based on Scroll Position
function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Intersection Observer for Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .stat-card, .feature-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Button Click Handlers
function setupButtonHandlers() {
    // Hero CTA buttons
    const reportBtn = document.querySelector('.btn-primary');
    const policeLoginBtn = document.querySelector('.btn-secondary');
    
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            showNotification('Redirecting to Report Form...', 'info');
            // In a real application, this would redirect to the report form
            setTimeout(() => {
                window.location.href = '#report';
            }, 1000);
        });
    }
    
    if (policeLoginBtn) {
        policeLoginBtn.addEventListener('click', function() {
            showNotification('Opening Police Login Portal...', 'info');
            // In a real application, this would open the login modal or redirect
            setTimeout(() => {
                alert('Police Login Portal would open here');
            }, 500);
        });
    }

    // Service card links
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceName = this.closest('.service-card').querySelector('h3').textContent;
            showNotification(`Opening ${serviceName} service...`, 'info');
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'info' ? '#3b82f6' : '#dc2626'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s ease;
    }

    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Performance Optimization: Debounced Scroll Handler
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

// Apply debouncing to scroll handler
const debouncedScrollHandler = debounce(() => {
    updateNavigationOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key closes dropdowns and mobile menu
    if (e.key === 'Escape') {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const navMenu = document.getElementById('navMenu');
        
        if (dropdownMenu) dropdownMenu.classList.remove('show');
        if (navMenu) navMenu.classList.remove('show');
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        // Ensure focus is visible
        document.body.classList.add('using-keyboard');
    }
});

// Mouse interaction removes keyboard focus indication
document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
});

// Check user authentication and update UI
function checkAuthentication() {
    // Wait for dataManager to be initialized
    if (!window.dataManager || !window.DataUtils) {
        setTimeout(checkAuthentication, 100);
        return;
    }
    
    const currentUser = DataUtils.getCurrentUser();
    
    if (currentUser) {
        // User is logged in
        document.getElementById('userDisplayName') && (document.getElementById('userDisplayName').textContent = currentUser.fullname || currentUser.username);
        
        // Show profile-related items
        const profileLink = document.getElementById('profileLink');
        const profileMenuItem = document.getElementById('profileMenuItem');
        const logoutMenuItem = document.getElementById('logoutMenuItem');
        const loginMenuItem = document.getElementById('loginMenuItem');
        
        if (profileLink) profileLink.style.display = 'block';
        if (profileMenuItem) profileMenuItem.style.display = 'block';
        if (logoutMenuItem) logoutMenuItem.style.display = 'block';
        if (loginMenuItem) loginMenuItem.style.display = 'none';
        
        // Update hero buttons based on user role
        updateHeroButtons(currentUser.role);
    } else {
        // User is not logged in
        const profileLink = document.getElementById('profileLink');
        const profileMenuItem = document.getElementById('profileMenuItem');
        const logoutMenuItem = document.getElementById('logoutMenuItem');
        const loginMenuItem = document.getElementById('loginMenuItem');
        
        if (profileLink) profileLink.style.display = 'none';
        if (profileMenuItem) profileMenuItem.style.display = 'none';
        if (logoutMenuItem) logoutMenuItem.style.display = 'none';
        if (loginMenuItem) loginMenuItem.style.display = 'block';
    }
}

function updateHeroButtons(userRole) {
    const primaryBtn = document.querySelector('.hero-actions .btn-primary');
    const secondaryBtn = document.querySelector('.hero-actions .btn-secondary');
    
    if (userRole === 'admin') {
        if (primaryBtn) {
            primaryBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Admin Dashboard';
            primaryBtn.onclick = () => window.location.href = '../admin/admin.html';
        }
        if (secondaryBtn) {
            secondaryBtn.innerHTML = '<i class="fas fa-user"></i> My Profile';
            secondaryBtn.onclick = () => window.location.href = 'profile.html';
        }
    } else if (userRole === 'public') {
        if (primaryBtn) {
            primaryBtn.innerHTML = '<i class="fas fa-flag"></i> Report Incident';
            primaryBtn.onclick = () => window.location.href = '../report/report.html';
        }
        if (secondaryBtn) {
            secondaryBtn.innerHTML = '<i class="fas fa-user"></i> My Profile';
            secondaryBtn.onclick = () => window.location.href = 'profile.html';
        }
    }
}

function setupNavigationHandlers() {
    // Service card navigation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        const link = card.querySelector('.service-link');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                switch(index) {
                    case 0: // Fake News Reporting
                        window.location.href = '../report/report.html';
                        break;
                    case 1: // Fact-Checking
                        window.location.href = '../advisories/advisories.html';
                        break;
                    case 2: // Monitoring & Analytics
                        if (DataUtils.isAdmin()) {
                            window.location.href = '../admin/admin.html';
                        } else {
                            showNotification('Admin access required for monitoring dashboard', 'error');
                        }
                        break;
                    case 3: // Helpline & Awareness
                        showNotification('Redirecting to helpline information...', 'info');
                        break;
                }
            });
        }
    });
    
    // Update dropdown handlers
    const loginMenuItem = document.getElementById('loginMenuItem');
    const adminMenuItem = document.getElementById('adminMenuItem');
    
    if (loginMenuItem) {
        loginMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../index.html';
        });
    }
    
    if (adminMenuItem) {
        adminMenuItem.addEventListener('click', function(e) {
            e.preventDefault();
            if (DataUtils.isAdmin()) {
                window.location.href = '../admin/admin.html';
            } else {
                window.location.href = '../index.html';
            }
        });
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        DataUtils.logout();
    }
}

// Initialize button handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupButtonHandlers();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// Add loading screen functionality
function showLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner">
                <i class="fas fa-shield-alt"></i>
            </div>
            <h3>Government Cybercrime Portal</h3>
            <p>Loading secure environment...</p>
        </div>
    `;
    
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        text-align: center;
    `;

    document.body.appendChild(loadingScreen);

    // Remove loading screen after page load
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1500);
}

// Form Validation Utilities (for future forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add skip navigation link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #1e3a8a;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
        z-index: 1001;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.setAttribute('id', 'main-content');
        hero.setAttribute('role', 'main');
    }

    // Enhance form accessibility (for future forms)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id || 'label-' + Math.random().toString(36).substr(2, 9));
                }
            }
        });
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('An error occurred. Please refresh the page if issues persist.', 'error');
});

// Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                if (loadTime > 3000) {
                    console.warn('Slow page load detected');
                }
            }, 0);
        });
    }
}

measurePerformance();

// Initialize loading screen
// showLoadingScreen(); // Uncomment if you want loading screen

// Utility Functions
const utils = {
    // Format numbers with commas
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Smooth scroll to element
    scrollToElement: function(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export utils for potential future use
window.CybercrimePortal = {
    utils: utils,
    showNotification: showNotification
};
