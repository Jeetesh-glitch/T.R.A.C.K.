// Public User Authentication Guard
// This file ensures proper authentication and prevents admin data access for public users

(function() {
    'use strict';

    // Check authentication and validate public user access
    function checkPublicAuthentication() {
        const currentUser = DataUtils.getCurrentUser();
        
        if (!currentUser) {
            // No user logged in - allow anonymous access to public pages
            console.log('Anonymous user accessing public page');
            setupAnonymousUser();
            return true;
        }
        
        if (currentUser.role === 'admin') {
            // Admin user accessing public page - redirect to admin dashboard
            console.warn('Admin user accessing public page. Redirecting to admin dashboard.');
            window.location.href = '../admin/admin.html';
            return false;
        }
        
        if (currentUser.role !== 'public') {
            // Unknown role - logout for security
            console.warn('Unknown user role detected. Logging out for security.');
            DataUtils.logout();
            return false;
        }
        
        // Validate session integrity for public users
        if (!validatePublicSessionIntegrity(currentUser)) {
            console.error('Public session integrity check failed. Logging out for security.');
            DataUtils.logout();
            return false;
        }
        
        // Public user authenticated successfully
        console.log('Public user authentication successful:', currentUser.username);
        initializePublicSession(currentUser);
        return true;
    }
    
    // Set up anonymous user (not logged in)
    function setupAnonymousUser() {
        // Update UI for anonymous users
        document.body.classList.add('anonymous-user');
        document.body.classList.remove('admin-user', 'public-user');
        
        // Hide user-specific elements
        const userOnlyElements = document.querySelectorAll('[data-user-only]');
        userOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Show login prompts
        const loginPromptElements = document.querySelectorAll('[data-login-prompt]');
        loginPromptElements.forEach(element => {
            element.style.display = 'block';
        });
        
        // Block admin functions
        blockAdminFunctions();
    }
    
    // Validate public user session integrity
    function validatePublicSessionIntegrity(user) {
        // Check if session data is consistent
        const sessionKeys = ['username', 'role', 'loginTime'];
        const hasRequiredFields = sessionKeys.every(key => user.hasOwnProperty(key));
        
        if (!hasRequiredFields) {
            console.error('Public session missing required fields');
            return false;
        }
        
        // Check login time validity
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            console.warn('Public session expired');
            return false;
        }
        
        // Check for role tampering
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userRecord = storedUsers.find(u => u.username === user.username);
        
        if (!userRecord || userRecord.role !== 'public') {
            console.error('Public role validation failed - user record mismatch');
            return false;
        }
        
        return true;
    }
    
    // Initialize public user session
    function initializePublicSession(user) {
        // Set up public user data namespace
        const publicDataKey = `public_session_${user.username}`;
        const publicData = {
            sessionStart: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            permissions: getPublicPermissions(user),
            securityLevel: 'standard'
        };
        
        localStorage.setItem(publicDataKey, JSON.stringify(publicData));
        
        // Update UI with public user info
        updatePublicUI(user);
        
        // Set up session monitoring
        setupPublicSessionMonitoring(user);
        
        // Block admin functions
        blockAdminFunctions();
    }
    
    // Get public user permissions
    function getPublicPermissions(user) {
        return {
            canViewOwnComplaints: true,
            canFileComplaints: true,
            canUpdateOwnProfile: true,
            canViewAdvisories: true,
            canViewPublicStatistics: true,
            
            // Explicitly denied permissions
            canViewAllComplaints: false,
            canManageUsers: false,
            canAccessAnalytics: false,
            canExportData: false,
            canManageAdvisories: false,
            canModerateContent: false
        };
    }
    
    // Update UI for public users
    function updatePublicUI(user) {
        // Update user display elements if they exist
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(element => {
            element.textContent = user.fullname || user.username;
        });
        
        const userRoleElements = document.querySelectorAll('[data-user-role]');
        userRoleElements.forEach(element => {
            element.textContent = 'Public User';
        });
        
        // Add public user styling
        document.body.classList.add('public-user');
        document.body.classList.remove('admin-user', 'anonymous-user');
        
        // Show public user elements
        const publicOnlyElements = document.querySelectorAll('[data-public-only]');
        publicOnlyElements.forEach(element => {
            element.style.display = 'block';
        });
        
        // Hide admin-only elements
        const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
        adminOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // Show user-specific elements
        const userOnlyElements = document.querySelectorAll('[data-user-only]');
        userOnlyElements.forEach(element => {
            element.style.display = 'block';
        });
        
        // Hide login prompts
        const loginPromptElements = document.querySelectorAll('[data-login-prompt]');
        loginPromptElements.forEach(element => {
            element.style.display = 'none';
        });
    }
    
    // Set up session monitoring for public users
    function setupPublicSessionMonitoring(user) {
        // Monitor for tab/window focus to update last activity
        let isActive = true;
        
        window.addEventListener('focus', function() {
            isActive = true;
            updatePublicLastActivity(user.username);
        });
        
        window.addEventListener('blur', function() {
            isActive = false;
        });
        
        // Periodic session validation (less frequent than admin)
        setInterval(function() {
            if (isActive) {
                const currentUser = DataUtils.getCurrentUser();
                if (currentUser && currentUser.role !== 'public') {
                    console.warn('Public session validation failed - role changed');
                    window.location.href = '../index.html';
                    return;
                }
                if (currentUser) {
                    updatePublicLastActivity(user.username);
                }
            }
        }, 600000); // Check every 10 minutes (less frequent than admin)
    }
    
    // Update last activity for public users
    function updatePublicLastActivity(username) {
        const publicDataKey = `public_session_${username}`;
        const publicData = JSON.parse(localStorage.getItem(publicDataKey) || '{}');
        publicData.lastActivity = new Date().toISOString();
        localStorage.setItem(publicDataKey, JSON.stringify(publicData));
    }
    
    // Block admin functions for public users
    function blockAdminFunctions() {
        // Override admin-specific functions to prevent access
        const adminFunctions = [
            'markAsVerified',
            'markAsFake', 
            'escalateComplaint',
            'dismissComplaint',
            'bulkDeleteSpam',
            'rateLimitUser',
            'flagBotAccount',
            'blockPost',
            'suspendUser',
            'addToWatchlist',
            'exportToPDF',
            'exportToCSV',
            'exportToExcel'
        ];
        
        adminFunctions.forEach(funcName => {
            if (window[funcName]) {
                window[funcName] = function() {
                    console.warn(`Access denied: Public users cannot access ${funcName}`);
                    alert('Access Denied: This function requires admin privileges.');
                    return false;
                };
            }
        });
        
        // Block access to admin data
        window.getAdminData = function() {
            console.warn('Admin data access blocked for public user');
            return null;
        };
    }
    
    // Secure public data access
    function setupSecureDataAccess(user) {
        // Override data access functions to be role-aware
        const originalGetComplaints = window.dataManager.getComplaints;
        window.dataManager.getComplaints = function() {
            const user = DataUtils.getCurrentUser();
            if (user && user.role === 'public') {
                // Return only user's own complaints
                const allComplaints = originalGetComplaints.call(this);
                return allComplaints.filter(complaint => complaint.reporterId === user.userId);
            }
            return originalGetComplaints.call(this);
        };
    }
    
    // Set up data protection for public users
    function setupDataProtection() {
        // Prevent access to admin data keys
        const originalGetItem = localStorage.getItem.bind(localStorage);
        localStorage.getItem = function(key) {
            const user = DataUtils.getCurrentUser();
            if (user && user.role === 'public') {
                // Block access to admin data
                if (key.startsWith('admin_') || 
                    key.includes('admin_data') || 
                    key.includes('admin_settings')) {
                    console.warn(`Public user blocked from accessing ${key}`);
                    return null;
                }
            }
            return originalGetItem(key);
        };
    }
    
    // Initialize public guard
    function initializePublicGuard() {
        // Check authentication
        if (!checkPublicAuthentication()) {
            return; // Redirect already handled
        }
        
        // Set up data protection
        setupDataProtection();
        
        const currentUser = DataUtils.getCurrentUser();
        if (currentUser && currentUser.role === 'public') {
            setupSecureDataAccess(currentUser);
        }
        
        // Dispatch event for public modules to initialize
        document.dispatchEvent(new CustomEvent('publicAuthComplete', {
            detail: { user: currentUser }
        }));
    }
    
    // Run guard immediately if DataUtils is available
    if (typeof DataUtils !== 'undefined') {
        initializePublicGuard();
    } else {
        // Wait for DataUtils to load
        document.addEventListener('DOMContentLoaded', function() {
            // Check again if DataUtils is loaded
            if (typeof DataUtils !== 'undefined') {
                initializePublicGuard();
            } else {
                // DataUtils not loaded - still allow access for anonymous users
                console.log('DataUtils not loaded - allowing anonymous access');
                setupAnonymousUser();
            }
        });
    }
    
    // Export for potential external use
    window.PublicAuthGuard = {
        checkAuthentication: checkPublicAuthentication,
        validateSession: validatePublicSessionIntegrity,
        updateActivity: updatePublicLastActivity,
        setupAnonymousAccess: setupAnonymousUser
    };
    
})();
