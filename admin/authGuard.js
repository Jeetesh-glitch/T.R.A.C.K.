// Admin Authentication Guard
// This file ensures only admin users can access admin pages

(function() {
    'use strict';

    // Check authentication immediately when script loads
    function checkAdminAuthentication() {
        const currentUser = DataUtils.getCurrentUser();
        
        if (!currentUser) {
            // No user logged in - redirect to login
            console.warn('No authenticated user found. Redirecting to login.');
            window.location.href = '../index.html';
            return false;
        }
        
        if (currentUser.role !== 'admin') {
            // User is not admin - redirect to appropriate dashboard
            console.warn('Non-admin user attempted to access admin area. Redirecting to public dashboard.');
            alert('Access Denied: You do not have admin privileges.');
            
            if (currentUser.role === 'public') {
                window.location.href = '../public/home.html';
            } else {
                // Unknown role - logout for security
                DataUtils.logout();
            }
            return false;
        }
        
        // Validate session integrity
        if (!validateSessionIntegrity(currentUser)) {
            console.error('Session integrity check failed. Logging out for security.');
            DataUtils.logout();
            return false;
        }
        
        // Admin authenticated successfully
        console.log('Admin authentication successful:', currentUser.username);
        initializeAdminSession(currentUser);
        return true;
    }
    
    // Validate session integrity
    function validateSessionIntegrity(user) {
        // Check if session data is consistent
        const sessionKeys = ['username', 'role', 'loginTime'];
        const hasRequiredFields = sessionKeys.every(key => user.hasOwnProperty(key));
        
        if (!hasRequiredFields) {
            console.error('Session missing required fields');
            return false;
        }
        
        // Check login time validity
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            console.warn('Session expired');
            return false;
        }
        
        // Check for role tampering
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const userRecord = storedUsers.find(u => u.username === user.username);
        
        if (!userRecord || userRecord.role !== 'admin') {
            console.error('Role validation failed - user record mismatch');
            return false;
        }
        
        return true;
    }
    
    // Initialize admin-specific session data
    function initializeAdminSession(user) {
        // Set up admin-specific data namespace
        const adminDataKey = `admin_session_${user.username}`;
        const adminData = {
            sessionStart: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            permissions: getAdminPermissions(user),
            securityLevel: 'high'
        };
        
        localStorage.setItem(adminDataKey, JSON.stringify(adminData));
        
        // Update UI with admin info
        updateAdminUI(user);
        
        // Set up session monitoring
        setupSessionMonitoring(user);
    }
    
    // Get admin-specific permissions
    function getAdminPermissions(user) {
        return {
            canViewAllComplaints: true,
            canManageUsers: true,
            canAccessAnalytics: true,
            canExportData: true,
            canManageAdvisories: true,
            canModerateContent: true,
            canManageSettings: true,
            canViewLogs: true,
            canEscalateIssues: true
        };
    }
    
    // Update UI with admin information
    function updateAdminUI(user) {
        // Update user display elements if they exist
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(element => {
            element.textContent = user.fullname || user.username;
        });
        
        const userRoleElements = document.querySelectorAll('[data-user-role]');
        userRoleElements.forEach(element => {
            element.textContent = 'Administrator';
        });
        
        // Add admin-specific styling
        document.body.classList.add('admin-user');
        document.body.classList.remove('public-user');
        
        // Show admin-specific navigation items
        const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
        adminOnlyElements.forEach(element => {
            element.style.display = 'block';
        });
        
        // Hide public-only elements
        const publicOnlyElements = document.querySelectorAll('[data-public-only]');
        publicOnlyElements.forEach(element => {
            element.style.display = 'none';
        });
    }
    
    // Set up session monitoring for security
    function setupSessionMonitoring(user) {
        // Monitor for tab/window focus to update last activity
        let isActive = true;
        
        window.addEventListener('focus', function() {
            isActive = true;
            updateLastActivity(user.username);
        });
        
        window.addEventListener('blur', function() {
            isActive = false;
        });
        
        // Periodic session validation
        setInterval(function() {
            if (isActive) {
                const currentUser = DataUtils.getCurrentUser();
                if (!currentUser || currentUser.role !== 'admin') {
                    console.warn('Session validation failed during monitoring');
                    window.location.href = '../index.html';
                    return;
                }
                updateLastActivity(user.username);
            }
        }, 300000); // Check every 5 minutes
        
        // Monitor for suspicious localStorage changes
        let lastStorageCheck = Date.now();
        setInterval(function() {
            const currentTime = Date.now();
            if (currentTime - lastStorageCheck > 60000) { // Check every minute
                const currentUser = DataUtils.getCurrentUser();
                if (!currentUser || !validateSessionIntegrity(currentUser)) {
                    console.error('Session integrity compromised');
                    DataUtils.logout();
                    return;
                }
                lastStorageCheck = currentTime;
            }
        }, 60000);
    }
    
    // Update last activity timestamp
    function updateLastActivity(username) {
        const adminDataKey = `admin_session_${username}`;
        const adminData = JSON.parse(localStorage.getItem(adminDataKey) || '{}');
        adminData.lastActivity = new Date().toISOString();
        localStorage.setItem(adminDataKey, JSON.stringify(adminData));
    }
    
    // Prevent access to public-specific functions
    function blockPublicFunctions() {
        // Override functions that should not be accessible to admins in admin context
        window.blockUnauthorizedPublicAccess = function() {
            console.warn('Public-specific function blocked in admin context');
            return false;
        };
    }
    
    // Set up beforeunload handler for admin sessions
    function setupAdminBeforeUnload() {
        window.addEventListener('beforeunload', function(e) {
            const currentUser = DataUtils.getCurrentUser();
            if (currentUser && currentUser.role === 'admin') {
                // Log admin session end
                console.log('Admin session ending:', currentUser.username);
                
                // Update session data
                updateLastActivity(currentUser.username);
            }
        });
    }
    
    // Initialize admin guard
    function initializeAdminGuard() {
        // Check authentication
        if (!checkAdminAuthentication()) {
            return; // Redirect already handled
        }
        
        // Set up additional security measures
        blockPublicFunctions();
        setupAdminBeforeUnload();
        
        // Dispatch event for admin modules to initialize
        document.dispatchEvent(new CustomEvent('adminAuthComplete', {
            detail: { user: DataUtils.getCurrentUser() }
        }));
    }
    
    // Run guard immediately if DataUtils is available
    if (typeof DataUtils !== 'undefined') {
        initializeAdminGuard();
    } else {
        // Wait for DataUtils to load
        document.addEventListener('DOMContentLoaded', function() {
            // Check again if DataUtils is loaded
            if (typeof DataUtils !== 'undefined') {
                initializeAdminGuard();
            } else {
                console.error('DataUtils not loaded. Redirecting to login.');
                window.location.href = '../index.html';
            }
        });
    }
    
    // Export for potential external use
    window.AdminAuthGuard = {
        checkAuthentication: checkAdminAuthentication,
        validateSession: validateSessionIntegrity,
        updateActivity: updateLastActivity
    };
    
})();
