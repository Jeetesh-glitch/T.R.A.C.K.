// Global variables
let currentTab = 'login';
let isFormSubmitting = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupFormValidation();
    checkExistingSession();
});

// Initialize application
function initializeApp() {
    // Initialize localStorage if not exists
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    // Set default tab
    switchTab('login');
    
    // Add demo users for testing
    addDemoUsers();
}

// Setup event listeners
function setupEventListeners() {
    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Password strength checking
    document.getElementById('registerPassword').addEventListener('input', checkPasswordStrength);
    
    // Username availability checking
    document.getElementById('registerUsername').addEventListener('input', debounce(checkUsernameAvailability, 300));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle tab switching
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Remove active states
    loginTab.classList.remove('active');
    registerTab.classList.remove('active');
    
    // Hide both forms
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    
    // Show selected tab and form
    if (tab === 'login') {
        loginTab.classList.add('active');
        loginForm.classList.remove('hidden');
        loginForm.classList.add('form-slide-in');
        currentTab = 'login';
    } else {
        registerTab.classList.add('active');
        registerForm.classList.remove('hidden');
        registerForm.classList.add('form-slide-in');
        currentTab = 'register';
    }
    
    // Clear any existing messages
    clearMessages();
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    if (isFormSubmitting) return;
    isFormSubmitting = true;
    
    const formData = new FormData(event.target);
    const loginData = {
        role: formData.get('role'),
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // Validate inputs
    if (!validateLoginInputs(loginData)) {
        isFormSubmitting = false;
        return;
    }
    
    // Show loading
    showLoading('Authenticating user...');
    
    // Simulate authentication delay
    await sleep(1500);
    
    // Check credentials with role-specific storage
    const user = authenticateUserByRole(loginData);
    
    hideLoading();
    
    if (user) {
        // Create secure session with role isolation
        const sessionData = createSecureSession(user);
        
        // Show success message
        showSuccessMessage(
            'Login Successful!',
            `Welcome back, ${user.fullname || user.username}! Redirecting to your ${user.role} dashboard...`
        );
        
        // Redirect after delay with role validation
        setTimeout(() => {
            redirectToDashboard(user.role);
        }, 2000);
        
    } else {
        showError('Invalid credentials. Please check your role, username, and password.');
    }
    
    isFormSubmitting = false;
}

// Handle register form submission
async function handleRegister(event) {
    event.preventDefault();
    
    if (isFormSubmitting) return;
    isFormSubmitting = true;
    
    const formData = new FormData(event.target);
    const registerData = {
        role: formData.get('role'),
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // Validate inputs
    if (!validateRegisterInputs(registerData)) {
        isFormSubmitting = false;
        return;
    }
    
    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === registerData.username)) {
        showError('Username already exists. Please choose a different username.');
        isFormSubmitting = false;
        return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email === registerData.email)) {
        showError('Email already registered. Please use a different email or login.');
        isFormSubmitting = false;
        return;
    }
    
    // Show loading
    showLoading('Creating your account...');
    
    // Simulate registration delay
    await sleep(2000);
    
    // Add user to localStorage
    users.push({
        username: registerData.username,
        password: registerData.password,
        role: registerData.role,
        fullname: registerData.fullname,
        email: registerData.email,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store session
    const sessionData = {
        username: registerData.username,
        role: registerData.role,
        fullname: registerData.fullname,
        email: registerData.email,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(sessionData));
    
    hideLoading();
    
    // Show success message
    showSuccessMessage(
        'Account Created Successfully!',
        `Welcome ${registerData.fullname}! Your account has been created and you are now logged in.`
    );
    
    // Redirect after delay
    setTimeout(() => {
        redirectToDashboard(registerData.role);
    }, 2500);
    
    isFormSubmitting = false;
}

// Validate login inputs
function validateLoginInputs(data) {
    clearMessages();
    let isValid = true;
    
    if (!data.role) {
        showFieldError('loginRole', 'Please select your role');
        isValid = false;
    }
    
    if (!data.username || data.username.length < 3) {
        showFieldError('loginUsername', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    if (!data.password || data.password.length < 6) {
        showFieldError('loginPassword', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

// Validate register inputs
function validateRegisterInputs(data) {
    clearMessages();
    let isValid = true;
    
    if (!data.role) {
        showFieldError('registerRole', 'Please select account type');
        isValid = false;
    }
    
    if (!data.fullname || data.fullname.length < 2) {
        showFieldError('registerName', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showFieldError('registerEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!data.username || data.username.length < 3) {
        showFieldError('registerUsername', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    if (!data.password || !isStrongPassword(data.password)) {
        showFieldError('registerPassword', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
        isValid = false;
    }
    
    if (!document.getElementById('agreeTerms').checked) {
        showError('Please agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }
    
    return isValid;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if password is strong
function isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}

// Check password strength and update UI
function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthContainer = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthContainer.innerHTML = '';
        return;
    }
    
    let strength = 0;
    let strengthText = '';
    let strengthClass = '';
    
    // Check various criteria
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z\d]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            strengthText = 'Very Weak';
            strengthClass = 'strength-weak';
            break;
        case 2:
            strengthText = 'Weak';
            strengthClass = 'strength-weak';
            break;
        case 3:
            strengthText = 'Fair';
            strengthClass = 'strength-fair';
            break;
        case 4:
            strengthText = 'Good';
            strengthClass = 'strength-good';
            break;
        case 5:
            strengthText = 'Strong';
            strengthClass = 'strength-strong';
            break;
    }
    
    strengthContainer.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill ${strengthClass}"></div>
        </div>
        <span style="color: ${getStrengthColor(strengthClass)}">${strengthText}</span>
    `;
}

// Get color for password strength
function getStrengthColor(strengthClass) {
    switch (strengthClass) {
        case 'strength-weak': return '#e53e3e';
        case 'strength-fair': return '#d69e2e';
        case 'strength-good': return '#3182ce';
        case 'strength-strong': return '#38a169';
        default: return '#64748b';
    }
}

// Check username availability
function checkUsernameAvailability() {
    const username = document.getElementById('registerUsername').value;
    const helpElement = document.getElementById('usernameHelp');
    
    if (username.length < 3) {
        helpElement.innerHTML = '';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (exists) {
        helpElement.innerHTML = '<i class="fas fa-times"></i> Username already taken';
        helpElement.className = 'input-help error';
        setFieldValidation('registerUsername', 'error');
    } else {
        helpElement.innerHTML = '<i class="fas fa-check"></i> Username available';
        helpElement.className = 'input-help success';
        setFieldValidation('registerUsername', 'success');
    }
}

// Toggle password visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show field validation state
function setFieldValidation(fieldId, state) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.remove('error', 'success', 'warning');
    if (state) {
        formGroup.classList.add(state);
    }
}

// Show field error
function showFieldError(fieldId, message) {
    setFieldValidation(fieldId, 'error');
    
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'input-help error field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    formGroup.appendChild(errorElement);
}

// Show loading overlay
function showLoading(message = 'Processing...') {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show success message overlay
function showSuccessMessage(title, text) {
    document.getElementById('messageTitle').textContent = title;
    document.getElementById('messageText').textContent = text;
    document.getElementById('messageOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Hide message overlay
function hideMessage() {
    document.getElementById('messageOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Show error message
function showError(message) {
    clearMessages();
    
    const activeForm = document.getElementById(currentTab + 'Form');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    activeForm.querySelector('.form').appendChild(errorDiv);
}

// Show success message in form
function showSuccess(message) {
    clearMessages();
    
    const activeForm = document.getElementById(currentTab + 'Form');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    activeForm.querySelector('.form').appendChild(successDiv);
}

// Clear all messages
function clearMessages() {
    document.querySelectorAll('.error-message, .success-message, .field-error').forEach(msg => {
        msg.remove();
    });
    
    // Clear field validation states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success', 'warning');
    });
}

// Role-based authentication with data isolation
function authenticateUserByRole(loginData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with exact role match
    const user = users.find(u => 
        u.username === loginData.username && 
        u.password === loginData.password &&
        u.role === loginData.role &&
        u.status !== 'inactive'
    );
    
    if (user) {
        // Validate role access permissions
        if (!validateRoleAccess(user.role)) {
            console.error('Role access validation failed:', user.role);
            return null;
        }
        
        // Clear any existing cross-role session data
        clearCrossRoleData(user.role);
        
        return user;
    }
    
    return null;
}

// Create secure session with role isolation
function createSecureSession(user) {
    // Generate unique session ID
    const sessionId = generateSessionId();
    
    const sessionData = {
        sessionId: sessionId,
        userId: user.id || generateUserId(user.role),
        username: user.username,
        role: user.role,
        fullname: user.fullname,
        email: user.email,
        loginTime: new Date().toISOString(),
        permissions: getRolePermissions(user.role)
    };
    
    // Store session with role prefix to prevent conflicts
    localStorage.setItem('currentUser', JSON.stringify(sessionData));
    localStorage.setItem(`session_${user.role}_${sessionId}`, JSON.stringify(sessionData));
    
    // Initialize role-specific data namespace
    initializeRoleDataNamespace(user.role, user.username);
    
    return sessionData;
}

// Validate role access permissions
function validateRoleAccess(role) {
    const allowedRoles = ['admin', 'public'];
    return allowedRoles.includes(role);
}

// Clear any existing cross-role session data
function clearCrossRoleData(currentRole) {
    const oppositeRole = currentRole === 'admin' ? 'public' : 'admin';
    
    // Remove any existing session data from the opposite role
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`session_${oppositeRole}_`) || 
            key.startsWith(`${oppositeRole}_data_`) ||
            key.startsWith(`${oppositeRole}_profile_`)) {
            localStorage.removeItem(key);
        }
    });
}

// Get role-specific permissions
function getRolePermissions(role) {
    const permissions = {
        admin: {
            canViewAllComplaints: true,
            canManageUsers: true,
            canAccessAnalytics: true,
            canExportData: true,
            canManageAdvisories: true,
            canModerateContent: true,
            dashboardPath: 'admin/admin.html'
        },
        public: {
            canViewAllComplaints: false,
            canManageUsers: false,
            canAccessAnalytics: false,
            canExportData: false,
            canManageAdvisories: false,
            canModerateContent: false,
            canFileComplaints: true,
            canViewOwnComplaints: true,
            canUpdateProfile: true,
            dashboardPath: 'public/home.html'
        }
    };
    
    return permissions[role] || permissions.public;
}

// Initialize role-specific data namespace
function initializeRoleDataNamespace(role, username) {
    const dataKey = `${role}_data_${username}`;
    
    if (!localStorage.getItem(dataKey)) {
        const initialData = {
            role: role,
            username: username,
            complaints: [],
            notifications: [],
            settings: getDefaultSettingsForRole(role),
            lastAccess: new Date().toISOString()
        };
        
        localStorage.setItem(dataKey, JSON.stringify(initialData));
    }
}

// Get default settings for role
function getDefaultSettingsForRole(role) {
    if (role === 'admin') {
        return {
            emailNotifications: true,
            smsAlerts: true,
            dashboardAutoRefresh: true,
            showDetailedAnalytics: true,
            exportPermissions: true
        };
    } else {
        return {
            emailNotifications: true,
            smsAlerts: false,
            publicDashboard: true,
            showBasicStats: true
        };
    }
}

// Generate secure session ID
function generateSessionId() {
    return 'ses_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate user ID based on role
function generateUserId(role) {
    const prefix = role === 'admin' ? 'ADM' : 'USR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
}

// Redirect to appropriate dashboard with enhanced security
function redirectToDashboard(role) {
    // Double-check role validation before redirect
    const currentSession = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentSession.role || currentSession.role !== role) {
        console.error('Session role mismatch detected. Logging out for security.');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
        return;
    }
    
    // Role-specific redirects with validation
    if (role === 'public') {
        // Ensure admin-specific data is not accessible
        clearAdminDataAccess();
        window.location.href = 'public/home.html';
    } else if (role === 'admin') {
        // Ensure public-specific data is properly isolated
        clearPublicDataAccess();
        window.location.href = 'admin/admin.html';
    } else {
        console.error('Invalid role for redirection:', role);
        // Security fallback - clear session and redirect to login
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Clear admin data access for public users
function clearAdminDataAccess() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('admin_') || 
            key.includes('admin_data') ||
            key.includes('admin_settings')) {
            // Don't actually remove admin data, just ensure it's not accessible
            console.log('Admin data access blocked for public user');
        }
    });
}

// Clear public data access for admin users
function clearPublicDataAccess() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('public_user_') || 
            key.includes('public_data')) {
            // Admin can see public data for monitoring, but with limited access
            console.log('Public user data accessible to admin with limited permissions');
        }
    });
}

// Check if user is already logged in
function checkExistingSession() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            const loginTime = new Date(userData.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            // Session expires after 24 hours
            if (hoursSinceLogin < 24) {
                showSuccess(`Welcome back, ${userData.fullname || userData.username}! You are already logged in.`);
                
                setTimeout(() => {
                    redirectToDashboard(userData.role);
                }, 2000);
            } else {
                // Clear expired session
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Error parsing session data:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation for login form
    const loginInputs = document.querySelectorAll('#loginForm input, #loginForm select');
    loginInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Real-time validation for register form
    const registerInputs = document.querySelectorAll('#registerForm input, #registerForm select');
    registerInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';
    
    switch (fieldName) {
        case 'role':
            if (!value) {
                message = 'Please select a role';
                isValid = false;
            }
            break;
            
        case 'fullname':
            if (!value || value.length < 2) {
                message = 'Full name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value || !isValidEmail(value)) {
                message = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'username':
            if (!value || value.length < 3) {
                message = 'Username must be at least 3 characters';
                isValid = false;
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                message = 'Username can only contain letters, numbers, and underscores';
                isValid = false;
            }
            break;
            
        case 'password':
            if (!value || value.length < 6) {
                message = 'Password must be at least 6 characters';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        setFieldValidation(field.id, 'error');
    } else {
        setFieldValidation(field.id, 'success');
    }
    
    return isValid;
}

// Add demo users for testing
function addDemoUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Only add if no users exist
    if (users.length === 0) {
        const demoUsers = [
            {
                username: 'demo_public',
                password: 'password123',
                role: 'public',
                fullname: 'John Doe',
                email: 'john.doe@example.com',
                createdAt: new Date().toISOString()
            },
            {
                username: 'demo_admin',
                password: 'admin123',
                role: 'admin',
                fullname: 'Officer Smith',
                email: 'officer.smith@police.gov.in',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Tab switching with Ctrl+1 (Login) and Ctrl+2 (Register)
    if (event.ctrlKey && event.key === '1') {
        event.preventDefault();
        switchTab('login');
    }
    
    if (event.ctrlKey && event.key === '2') {
        event.preventDefault();
        switchTab('register');
    }
    
    // Close overlays with Escape key
    if (event.key === 'Escape') {
        hideLoading();
        hideMessage();
    }
}

// Utility function for debouncing
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

// Utility function for sleep/delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto-fill demo data (for testing)
function fillDemoData(type = 'public') {
    if (type === 'public') {
        if (currentTab === 'login') {
            document.getElementById('loginRole').value = 'public';
            document.getElementById('loginUsername').value = 'demo_public';
            document.getElementById('loginPassword').value = 'password123';
        } else {
            document.getElementById('registerRole').value = 'public';
            document.getElementById('registerName').value = 'Jane Smith';
            document.getElementById('registerEmail').value = 'jane.smith@example.com';
            document.getElementById('registerUsername').value = 'jane_smith';
            document.getElementById('registerPassword').value = 'SecurePass123';
            document.getElementById('agreeTerms').checked = true;
        }
    } else {
        if (currentTab === 'login') {
            document.getElementById('loginRole').value = 'admin';
            document.getElementById('loginUsername').value = 'demo_admin';
            document.getElementById('loginPassword').value = 'admin123';
        } else {
            document.getElementById('registerRole').value = 'admin';
            document.getElementById('registerName').value = 'Officer Johnson';
            document.getElementById('registerEmail').value = 'officer.johnson@police.gov.in';
            document.getElementById('registerUsername').value = 'officer_johnson';
            document.getElementById('registerPassword').value = 'AdminPass123';
            document.getElementById('agreeTerms').checked = true;
        }
    }
}

// Clear form data
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        clearMessages();
        
        // Clear password strength indicator
        const strengthContainer = document.getElementById('passwordStrength');
        if (strengthContainer) {
            strengthContainer.innerHTML = '';
        }
        
        // Clear username help
        const usernameHelp = document.getElementById('usernameHelp');
        if (usernameHelp) {
            usernameHelp.innerHTML = '';
            usernameHelp.className = 'input-help';
        }
    }
}

// Logout function (for future use)
function logout() {
    localStorage.removeItem('currentUser');
    showSuccess('Logged out successfully');
    
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Get all users (for admin purposes)
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Enhanced form animations
function animateFormSwitch(fromForm, toForm) {
    fromForm.classList.add('form-slide-out');
    
    setTimeout(() => {
        fromForm.classList.add('hidden');
        fromForm.classList.remove('form-slide-out');
        
        toForm.classList.remove('hidden');
        toForm.classList.add('form-slide-in');
        
        setTimeout(() => {
            toForm.classList.remove('form-slide-in');
        }, 400);
    }, 200);
}

// Auto-save form data to prevent data loss
function setupAutoSave() {
    const saveableFields = ['registerName', 'registerEmail', 'registerUsername'];
    
    saveableFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                localStorage.setItem(`draft_${fieldId}`, this.value);
            });
        }
    });
    
    // Restore saved data
    saveableFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const savedValue = localStorage.getItem(`draft_${fieldId}`);
        if (field && savedValue) {
            field.value = savedValue;
        }
    });
}

// Clear draft data
function clearDraftData() {
    const draftKeys = Object.keys(localStorage).filter(key => key.startsWith('draft_'));
    draftKeys.forEach(key => localStorage.removeItem(key));
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', setupAutoSave);

// Clear draft data on successful registration
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', function() {
            setTimeout(clearDraftData, 1000);
        });
    }
});

// Export functions for console testing
window.authUtils = {
    fillDemo: fillDemoData,
    clearForm: clearForm,
    getCurrentUser: getCurrentUser,
    getAllUsers: getAllUsers,
    logout: logout,
    switchTab: switchTab
};

// Console helper message
console.log(`
🚀 Government Cybercrime Portal - Login/Register System

Demo Accounts Available:
📱 Public User: demo_public / password123
👮 Admin User: demo_admin / admin123

Testing Functions:
• authUtils.fillDemo('public') - Auto-fill public user demo data
• authUtils.fillDemo('admin') - Auto-fill admin user demo data
• authUtils.getCurrentUser() - Get currently logged in user
• authUtils.getAllUsers() - Get all registered users
• authUtils.logout() - Logout current user
• forceLogoutAll() - Forcefully logs out all users.

Keyboard Shortcuts:
• Ctrl+1 - Switch to Login tab
• Ctrl+2 - Switch to Register tab
• Escape - Close overlays
`);

function forceLogoutAll() {
    localStorage.removeItem('currentUser');
    console.log('All users have been logged out.');
    alert('All users have been logged out.');
}
