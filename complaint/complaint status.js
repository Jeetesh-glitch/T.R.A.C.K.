// Sample complaint data for demonstration
const sampleComplaints = {
    'CC2024001234': {
        id: 'CC2024001234',
        subject: 'Online Fraud - Unauthorized Transaction',
        dateSubmitted: 'March 15, 2024',
        status: 'in-progress',
        assignedAuthority: 'Cyber Crime Investigation Unit - Mumbai',
        latestUpdate: 'Investigation in progress. Documents under review by the investigating officer.',
        progress: 3
    },
    'CC2024001235': {
        id: 'CC2024001235',
        subject: 'Identity Theft - Social Media Impersonation',
        dateSubmitted: 'March 10, 2024',
        status: 'resolved',
        assignedAuthority: 'Cyber Investigation Unit - Delhi',
        latestUpdate: 'Case resolved. Fraudulent account has been suspended and legal action taken.',
        progress: 4
    },
    'CC2024001236': {
        id: 'CC2024001236',
        subject: 'Phishing Email - Banking Credentials Theft',
        dateSubmitted: 'March 20, 2024',
        status: 'pending',
        assignedAuthority: 'Economic Offences Wing - Bangalore',
        latestUpdate: 'Complaint received and registered. Awaiting initial assessment.',
        progress: 1
    },
    'CC2024001237': {
        id: 'CC2024001237',
        subject: 'Fake Online Shopping Website',
        dateSubmitted: 'March 8, 2024',
        status: 'rejected',
        assignedAuthority: 'Consumer Cyber Crime Unit - Chennai',
        latestUpdate: 'Complaint closed due to insufficient evidence. Contact helpline for guidance.',
        progress: 1
    }
};

// Status configuration
const statusConfig = {
    'pending': {
        className: 'pending',
        text: 'Pending',
        icon: 'fas fa-clock'
    },
    'in-progress': {
        className: 'in-progress',
        text: 'In Progress',
        icon: 'fas fa-spinner'
    },
    'resolved': {
        className: 'resolved',
        text: 'Resolved',
        icon: 'fas fa-check-circle'
    },
    'rejected': {
        className: 'rejected',
        text: 'Rejected',
        icon: 'fas fa-times-circle'
    }
};

// DOM Elements
const statusForm = document.getElementById('statusForm');
const resultSection = document.getElementById('resultSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupMobileMenu();
    setupQuickActions();
});

// Event Listeners
function initializeEventListeners() {
    statusForm.addEventListener('submit', handleStatusCheck);
}

// Handle status check form submission
async function handleStatusCheck(event) {
    event.preventDefault();
    
    const formData = new FormData(statusForm);
    const complaintId = formData.get('complaintId').trim();
    const contact = formData.get('contact').trim();
    
    // Validate complaint ID format
    if (!isValidComplaintId(complaintId)) {
        showErrorMessage('Please enter a valid complaint ID (e.g., CC2024001234)');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    hideLoading();
    
    // Check if complaint exists
    const complaint = sampleComplaints[complaintId.toUpperCase()];
    
    if (complaint) {
        displayComplaintStatus(complaint);
        scrollToResult();
    } else {
        showNotFoundMessage(complaintId);
    }
}

// Validate complaint ID format
function isValidComplaintId(id) {
    const pattern = /^CC\d{10}$/i;
    return pattern.test(id);
}

// Display complaint status
function displayComplaintStatus(complaint) {
    // Update complaint details
    document.getElementById('complaintIdDisplay').textContent = complaint.id;
    document.getElementById('complaintSubject').textContent = complaint.subject;
    document.getElementById('dateSubmitted').textContent = complaint.dateSubmitted;
    document.getElementById('assignedAuthority').textContent = complaint.assignedAuthority;
    document.getElementById('latestUpdate').textContent = complaint.latestUpdate;
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const statusInfo = statusConfig[complaint.status];
    
    statusBadge.className = `status-badge ${statusInfo.className}`;
    statusText.textContent = statusInfo.text;
    
    // Update progress tracker
    updateProgressTracker(complaint.progress, complaint.status);
    
    // Show result section
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');
    
    // Remove any existing error messages
    removeErrorMessages();
}

// Update progress tracker based on current step
function updateProgressTracker(currentStep, status) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Reset all timeline items
    timelineItems.forEach((item, index) => {
        const stepNumber = index + 1;
        item.classList.remove('completed', 'active');
        
        if (stepNumber < currentStep || (status === 'resolved' && stepNumber <= 4)) {
            item.classList.add('completed');
        } else if (stepNumber === currentStep && status !== 'resolved' && status !== 'rejected') {
            item.classList.add('active');
        }
        
        // Special handling for rejected status
        if (status === 'rejected' && stepNumber === 1) {
            item.classList.add('completed');
        }
    });
}

// Show loading overlay
function showLoading() {
    loadingOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show error message for invalid complaint ID
function showErrorMessage(message) {
    removeErrorMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    statusForm.appendChild(errorDiv);
}

// Show not found message
function showNotFoundMessage(complaintId) {
    removeErrorMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-search"></i>
        <div>
            <strong>Complaint not found!</strong><br>
            No complaint found with ID: <strong>${complaintId}</strong><br>
            Please verify your complaint ID or contact helpline 1930 for assistance.
        </div>
    `;
    
    statusForm.appendChild(errorDiv);
    
    // Hide result section if visible
    resultSection.style.display = 'none';
}

// Remove existing error messages
function removeErrorMessages() {
    const existingErrors = statusForm.querySelectorAll('.error-message, .success-message');
    existingErrors.forEach(error => error.remove());
}

// Scroll to result section smoothly
function scrollToResult() {
    resultSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Setup mobile menu functionality
function setupMobileMenu() {
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-wrapper')) {
                navMenu.classList.remove('mobile-active');
            }
        });
    }
}

// Setup quick actions functionality
function setupQuickActions() {
    // Download acknowledgement
    const downloadBtn = document.querySelector('.action-btn.primary');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            showSuccessMessage('Acknowledgement download will begin shortly...');
            // In real implementation, this would trigger a PDF download
            setTimeout(() => {
                // Simulate download
                console.log('Downloading acknowledgement PDF...');
            }, 500);
        });
    }
    
    // Subscribe for updates
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeText = document.getElementById('subscribeText');
    let isSubscribed = false;
    
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            if (!isSubscribed) {
                // Subscribe
                subscribeBtn.classList.remove('secondary');
                subscribeBtn.classList.add('primary');
                subscribeText.textContent = 'Subscribed ✓';
                showSuccessMessage('You will now receive email/SMS updates for this complaint.');
                isSubscribed = true;
            } else {
                // Unsubscribe
                subscribeBtn.classList.remove('primary');
                subscribeBtn.classList.add('secondary');
                subscribeText.textContent = 'Subscribe for Updates';
                showSuccessMessage('You have been unsubscribed from updates.');
                isSubscribed = false;
            }
        });
    }
    
    // Submit additional info
    const additionalInfoBtn = document.querySelector('.action-btn.tertiary');
    if (additionalInfoBtn) {
        additionalInfoBtn.addEventListener('click', function() {
            showSuccessMessage('Additional information form will open shortly...');
            // In real implementation, this would open a modal or redirect to a form
        });
    }
}

// Show success message
function showSuccessMessage(message) {
    removeErrorMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Add to quick actions section
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.appendChild(successDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
}

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const faqItem = element.parentNode;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't already active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Auto-fill demo functionality (for testing)
function fillDemoData() {
    document.getElementById('complaintId').value = 'CC2024001234';
    document.getElementById('contact').value = 'demo@example.com';
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (document.activeElement.closest('#statusForm')) {
            statusForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape key to close mobile menu
    if (event.key === 'Escape') {
        navMenu.classList.remove('mobile-active');
    }
});

// Form input enhancement
document.addEventListener('DOMContentLoaded', function() {
    const complaintIdInput = document.getElementById('complaintId');
    
    if (complaintIdInput) {
        // Auto-format complaint ID as user types
        complaintIdInput.addEventListener('input', function(event) {
            let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            // Auto-add CC prefix if not present and user starts typing numbers
            if (value.length > 0 && !value.startsWith('CC') && /^\d/.test(value)) {
                value = 'CC' + value;
            }
            
            // Limit to CC + 10 digits
            if (value.startsWith('CC') && value.length > 12) {
                value = value.substring(0, 12);
            }
            
            event.target.value = value;
        });
        
        // Validate on blur
        complaintIdInput.addEventListener('blur', function(event) {
            const value = event.target.value.trim();
            if (value && !isValidComplaintId(value)) {
                event.target.style.borderColor = '#dc2626';
                if (!document.querySelector('.error-message')) {
                    showErrorMessage('Please enter a valid complaint ID format (CC followed by 10 digits)');
                }
            } else {
                event.target.style.borderColor = '#e2e8f0';
                removeErrorMessages();
            }
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to status cards when they come into view
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        observer.observe(item);
    });
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Print functionality for acknowledgement
function printAcknowledgement() {
    const complaintId = document.getElementById('complaintIdDisplay').textContent;
    const subject = document.getElementById('complaintSubject').textContent;
    const dateSubmitted = document.getElementById('dateSubmitted').textContent;
    const authority = document.getElementById('assignedAuthority').textContent;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Complaint Acknowledgement - ${complaintId}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { text-align: center; margin-bottom: 40px; }
                .logo { font-size: 24px; font-weight: bold; color: #003366; }
                .details { margin: 20px 0; }
                .detail-row { margin: 10px 0; display: flex; }
                .label { font-weight: bold; width: 200px; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo">CYBER CRIME CELL</div>
                <div>Government of India - Police Department</div>
                <h2>Complaint Acknowledgement</h2>
            </div>
            <div class="details">
                <div class="detail-row">
                    <span class="label">Complaint ID:</span>
                    <span>${complaintId}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Subject:</span>
                    <span>${subject}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date Submitted:</span>
                    <span>${dateSubmitted}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Assigned Authority:</span>
                    <span>${authority}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Status:</span>
                    <span>Registered and Under Investigation</span>
                </div>
            </div>
            <div class="footer">
                <p>This is an auto-generated acknowledgement from the Cyber Crime Cell.</p>
                <p>For any queries, contact helpline: 1930 (24x7)</p>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Enhanced mobile menu with animation
function setupMobileMenu() {
    if (!mobileMenuToggle || !navMenu) return;
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('mobile-active');
        
        // Update hamburger icon
        const icon = this.querySelector('i');
        if (navMenu.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside or on a link
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-wrapper')) {
            navMenu.classList.remove('mobile-active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking on nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('mobile-active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Enhanced quick actions with better UX
function setupQuickActions() {
    // Only setup if we're on the status page and elements exist
    setTimeout(() => {
        const downloadBtn = document.querySelector('.action-btn.primary');
        const subscribeBtn = document.getElementById('subscribeBtn');
        const additionalInfoBtn = document.querySelector('.action-btn.tertiary');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
                
                setTimeout(() => {
                    printAcknowledgement();
                    this.innerHTML = '<i class="fas fa-download"></i> Download Acknowledgement';
                    showSuccessMessage('Acknowledgement generated successfully!');
                }, 1000);
            });
        }
        
        if (additionalInfoBtn) {
            additionalInfoBtn.addEventListener('click', function() {
                const complaintId = document.getElementById('complaintIdDisplay')?.textContent || 'your complaint';
                showSuccessMessage(`Additional information form for ${complaintId} will open in a new window.`);
                
                // In real implementation, this would open a modal or new page
                setTimeout(() => {
                    window.open('#', '_blank');
                }, 1000);
            });
        }
    }, 100);
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add some sample data access for quick testing
window.demoData = {
    fillForm: fillDemoData,
    sampleIds: Object.keys(sampleComplaints),
    showSample: function(id) {
        const complaint = sampleComplaints[id];
        if (complaint) {
            document.getElementById('complaintId').value = id;
            statusForm.dispatchEvent(new Event('submit'));
        }
    }
};

// Performance optimization - lazy load non-critical features
function initializeLazyFeatures() {
    // Initialize features that aren't immediately needed
    setupScrollAnimations();
    
    // Add keyboard navigation for FAQ
    document.addEventListener('keydown', function(event) {
        if (event.target.closest('.faq-question')) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleFAQ(event.target.closest('.faq-question'));
            }
        }
    });
}

// Initialize lazy features after page load
window.addEventListener('load', initializeLazyFeatures);

// Add accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question, index) => {
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        question.setAttribute('tabindex', '0');
        
        const answer = question.nextElementSibling;
        if (answer) {
            answer.setAttribute('id', `faq-answer-${index}`);
            answer.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Update ARIA attributes when FAQ is toggled
    const originalToggleFAQ = window.toggleFAQ;
    window.toggleFAQ = function(element) {
        originalToggleFAQ(element);
        
        const faqItem = element.parentNode;
        const isActive = faqItem.classList.contains('active');
        
        element.setAttribute('aria-expanded', isActive.toString());
        
        const answer = element.nextElementSibling;
        if (answer) {
            answer.setAttribute('aria-hidden', (!isActive).toString());
        }
    };
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);
