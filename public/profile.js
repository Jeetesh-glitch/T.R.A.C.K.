// Profile Management for Public Users
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!DataUtils.requireAuth()) {
        return;
    }

    initializeProfile();
    setupEventListeners();
    loadUserData();
});

let isEditing = false;
let originalData = {};

function initializeProfile() {
    const currentUser = DataUtils.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }

    // Update header display
    document.getElementById('userDisplayName').textContent = currentUser.fullname || currentUser.username;
    
    // Show profile-related navigation items
    document.getElementById('profileLink').style.display = 'block';
    document.getElementById('profileMenuItem').style.display = 'block';
    document.getElementById('logoutMenuItem').style.display = 'block';
    document.getElementById('loginMenuItem').style.display = 'none';
}

function setupEventListeners() {
    // Profile navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchProfileSection(section);
        });
    });

    // Edit profile button
    document.getElementById('editProfileBtn').addEventListener('click', toggleEditMode);
    
    // Cancel edit button
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
    
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', saveProfile);
    
    // Change password button
    document.getElementById('changePasswordBtn').addEventListener('click', showChangePasswordForm);
    
    // Cancel password change
    document.getElementById('cancelPasswordBtn').addEventListener('click', hideChangePasswordForm);
    
    // Password form submission
    document.getElementById('passwordForm').addEventListener('submit', changePassword);
    
    // New password strength checking
    document.getElementById('newPassword').addEventListener('input', checkNewPasswordStrength);
    
    // Notification settings
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (['emailNotifications', 'advisoryAlerts', 'statusUpdates'].includes(checkbox.id)) {
            checkbox.addEventListener('change', saveNotificationSettings);
        }
    });
}

function loadUserData() {
    const currentUser = DataUtils.getCurrentUser();
    if (!currentUser) return;

    // Ensure user can only access their own profile data
    if (currentUser.role !== 'public') {
        console.error('Profile access denied: User is not a public user');
        window.location.href = '../index.html';
        return;
    }

    // Get full user data using secure access
    const fullUserData = window.dataManager.getUserByUsername(currentUser.username);
    if (!fullUserData) {
        console.error('User data not found');
        DataUtils.logout();
        return;
    }

    // Validate user can only see their own data
    if (fullUserData.username !== currentUser.username) {
        console.error('Data access violation detected');
        DataUtils.logout();
        return;
    }

    // Update profile display
    document.getElementById('profileName').textContent = fullUserData.fullname || fullUserData.username;
    document.getElementById('profileRole').textContent = 'Public User';
    
    // Update form fields with validated data
    document.getElementById('fullname').value = fullUserData.fullname || '';
    document.getElementById('username').value = fullUserData.username || '';
    document.getElementById('email').value = fullUserData.email || '';
    document.getElementById('phone').value = fullUserData.phone || '';
    document.getElementById('joinDate').value = formatDate(fullUserData.createdAt);
    document.getElementById('status').value = fullUserData.status || 'Active';

    // Load user statistics (only own data)
    loadUserStatistics(fullUserData.id);
    
    // Load user complaints (only own complaints)
    loadUserComplaints(fullUserData.id);
    
    // Load active sessions (only own sessions)
    loadActiveSessions(fullUserData.id);
    
    // Initialize role-specific data storage
    initializePublicUserData(fullUserData);
}

// Initialize public user data storage
function initializePublicUserData(userData) {
    const publicDataKey = `public_user_${userData.username}`;
    
    // Check if user data already exists
    const existingData = localStorage.getItem(publicDataKey);
    
    if (!existingData) {
        const publicUserData = {
            userId: userData.id,
            username: userData.username,
            role: 'public',
            profileData: {
                fullname: userData.fullname,
                email: userData.email,
                phone: userData.phone
            },
            complaintHistory: [],
            notificationSettings: {
                emailNotifications: true,
                advisoryAlerts: true,
                statusUpdates: true
            },
            preferences: {
                language: 'en',
                timezone: 'Asia/Kolkata',
                dashboardLayout: 'compact'
            },
            lastProfileUpdate: new Date().toISOString(),
            securitySettings: {
                twoFactorEnabled: false,
                loginNotifications: true
            }
        };
        
        localStorage.setItem(publicDataKey, JSON.stringify(publicUserData));
        console.log('Public user data initialized:', userData.username);
    } else {
        // Update last access time
        const existingUserData = JSON.parse(existingData);
        existingUserData.lastAccess = new Date().toISOString();
        localStorage.setItem(publicDataKey, JSON.stringify(existingUserData));
    }
}

function loadUserStatistics(userId) {
    const complaints = window.dataManager.getComplaints();
    const userComplaints = complaints.filter(c => c.reporterId === userId);
    const resolvedComplaints = userComplaints.filter(c => c.status === 'resolved');
    
    document.getElementById('complaintCount').textContent = userComplaints.length;
    document.getElementById('resolvedCount').textContent = resolvedComplaints.length;
}

function loadUserComplaints(userId) {
    const complaints = window.dataManager.getComplaints();
    const userComplaints = complaints.filter(c => c.reporterId === userId);
    const complaintsContainer = document.getElementById('myComplaintsList');
    
    if (userComplaints.length === 0) {
        complaintsContainer.innerHTML = `
            <div class="no-complaints">
                <i class="fas fa-file-alt"></i>
                <h3>No Complaints Filed</h3>
                <p>You haven't filed any complaints yet.</p>
                <a href="../report/report.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    File Your First Complaint
                </a>
            </div>
        `;
        return;
    }

    complaintsContainer.innerHTML = userComplaints.map(complaint => `
        <div class="complaint-card">
            <div class="complaint-header">
                <h4>${complaint.title}</h4>
                <span class="status-badge status-${complaint.status}">${complaint.status}</span>
            </div>
            <div class="complaint-details">
                <p><strong>Complaint ID:</strong> ${complaint.id}</p>
                <p><strong>Type:</strong> ${complaint.type.replace('-', ' ')}</p>
                <p><strong>Filed:</strong> ${formatDate(complaint.createdAt)}</p>
                <p><strong>Last Update:</strong> ${formatDate(complaint.updatedAt)}</p>
            </div>
            <div class="complaint-actions">
                <a href="../complaint/complaint status.html?id=${complaint.id}" class="btn btn-outline">
                    <i class="fas fa-eye"></i>
                    View Status
                </a>
            </div>
        </div>
    `).join('');
}

function loadActiveSessions(userId) {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const userSessions = sessions.filter(s => s.userId === userId);
    const sessionsContainer = document.getElementById('sessionsList');
    
    if (userSessions.length === 0) {
        sessionsContainer.innerHTML = `
            <div class="no-sessions">
                <i class="fas fa-devices"></i>
                <p>No active sessions found.</p>
            </div>
        `;
        return;
    }

    sessionsContainer.innerHTML = userSessions.map((session, index) => `
        <div class="session-card ${session.sessionId === DataUtils.getCurrentUser().sessionId ? 'current-session' : ''}">
            <div class="session-info">
                <div class="session-device">
                    <i class="fas fa-${getDeviceIcon()}"></i>
                    <div class="session-details">
                        <h4>${session.sessionId === DataUtils.getCurrentUser().sessionId ? 'Current Session' : 'Other Session'}</h4>
                        <p>Logged in: ${formatDateTime(session.loginTime)}</p>
                        <p>Browser: ${getBrowserInfo()}</p>
                    </div>
                </div>
                <div class="session-actions">
                    ${session.sessionId === DataUtils.getCurrentUser().sessionId ? 
                        '<span class="current-badge">Current</span>' : 
                        '<button class="btn btn-danger btn-small" onclick="terminateSession(\'' + session.sessionId + '\')"><i class="fas fa-times"></i> Terminate</button>'
                    }
                </div>
            </div>
        </div>
    `).join('');
}

function switchProfileSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Load section-specific data
    if (sectionId === 'my-complaints') {
        const currentUser = DataUtils.getCurrentUser();
        const fullUserData = window.dataManager.getUserByUsername(currentUser.username);
        loadUserComplaints(fullUserData.id);
    } else if (sectionId === 'sessions') {
        const currentUser = DataUtils.getCurrentUser();
        const fullUserData = window.dataManager.getUserByUsername(currentUser.username);
        loadActiveSessions(fullUserData.id);
    }
}

function toggleEditMode() {
    if (!isEditing) {
        startEditing();
    } else {
        cancelEdit();
    }
}

function startEditing() {
    isEditing = true;
    
    // Store original data
    originalData = {
        fullname: document.getElementById('fullname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };
    
    // Enable form fields (except username)
    document.getElementById('fullname').removeAttribute('readonly');
    document.getElementById('email').removeAttribute('readonly');
    document.getElementById('phone').removeAttribute('readonly');
    
    // Update UI
    document.getElementById('editProfileBtn').innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
    document.getElementById('formActions').style.display = 'block';
    
    // Add editing class for styling
    document.querySelector('.profile-form').classList.add('editing');
}

function cancelEdit() {
    isEditing = false;
    
    // Restore original data
    document.getElementById('fullname').value = originalData.fullname;
    document.getElementById('email').value = originalData.email;
    document.getElementById('phone').value = originalData.phone;
    
    // Disable form fields
    document.getElementById('fullname').setAttribute('readonly', true);
    document.getElementById('email').setAttribute('readonly', true);
    document.getElementById('phone').setAttribute('readonly', true);
    
    // Update UI
    document.getElementById('editProfileBtn').innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
    document.getElementById('formActions').style.display = 'none';
    
    // Remove editing class
    document.querySelector('.profile-form').classList.remove('editing');
}

function saveProfile(event) {
    event.preventDefault();
    
    const currentUser = DataUtils.getCurrentUser();
    const formData = new FormData(event.target);
    
    const updatedData = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    // Validate data
    if (!updatedData.fullname.trim()) {
        showNotification('Full name is required', 'error');
        return;
    }
    
    if (!validateEmail(updatedData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Update user data
    const fullUserData = window.dataManager.getUserByUsername(currentUser.username);
    const updated = window.dataManager.updateUser(fullUserData.id, updatedData);
    
    if (updated) {
        // Update session data
        const sessionData = { ...currentUser, ...updatedData };
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        
        showNotification('Profile updated successfully!', 'success');
        cancelEdit();
        
        // Refresh display
        loadUserData();
    } else {
        showNotification('Failed to update profile', 'error');
    }
}

function showChangePasswordForm() {
    document.getElementById('changePasswordForm').style.display = 'block';
    document.getElementById('changePasswordBtn').style.display = 'none';
}

function hideChangePasswordForm() {
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('changePasswordBtn').style.display = 'block';
    document.getElementById('passwordForm').reset();
    document.getElementById('newPasswordStrength').innerHTML = '';
}

function changePassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (!isStrongPassword(newPassword)) {
        showNotification('Password must be at least 8 characters with uppercase, lowercase, and numbers', 'error');
        return;
    }
    
    // Verify current password
    const currentUser = DataUtils.getCurrentUser();
    const fullUserData = window.dataManager.getUserByUsername(currentUser.username);
    
    if (fullUserData.password !== currentPassword) {
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    // Update password
    const updated = window.dataManager.updateUser(fullUserData.id, { 
        password: newPassword,
        lastPasswordChange: new Date().toISOString()
    });
    
    if (updated) {
        showNotification('Password changed successfully!', 'success');
        hideChangePasswordForm();
        document.getElementById('lastPasswordChange').textContent = 'Just now';
    } else {
        showNotification('Failed to change password', 'error');
    }
}

function checkNewPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthContainer = document.getElementById('newPasswordStrength');
    
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

function saveNotificationSettings() {
    const settings = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        advisoryAlerts: document.getElementById('advisoryAlerts').checked,
        statusUpdates: document.getElementById('statusUpdates').checked
    };
    
    // In a real application, you would save these to the user's profile
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    showNotification('Notification preferences saved', 'success');
}

function terminateSession(sessionId) {
    if (confirm('Are you sure you want to terminate this session?')) {
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        const updatedSessions = sessions.filter(s => s.sessionId !== sessionId);
        localStorage.setItem('sessions', JSON.stringify(updatedSessions));
        
        showNotification('Session terminated successfully', 'success');
        
        // Reload sessions display
        const currentUser = DataUtils.getCurrentUser();
        const fullUserData = window.dataManager.getUserByUsername(currentUser.username);
        loadActiveSessions(fullUserData.id);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        DataUtils.logout();
    }
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}

function getStrengthColor(strengthClass) {
    switch (strengthClass) {
        case 'strength-weak': return '#e53e3e';
        case 'strength-fair': return '#d69e2e';
        case 'strength-good': return '#3182ce';
        case 'strength-strong': return '#38a169';
        default: return '#64748b';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getDeviceIcon() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) return 'mobile-alt';
    if (userAgent.includes('tablet')) return 'tablet-alt';
    return 'desktop';
}

function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    return browser;
}

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
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : type === 'error' ? '#dc2626' : '#3b82f6'};
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

// Add CSS for notifications and profile-specific styles
const profileStyles = document.createElement('style');
profileStyles.textContent = `
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

    .profile-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        margin-top: 2rem;
    }

    .profile-sidebar {
        position: sticky;
        top: 100px;
        height: fit-content;
    }

    .profile-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }

    .profile-avatar {
        font-size: 4rem;
        color: #3b82f6;
        margin-bottom: 1rem;
    }

    .profile-stats {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }

    .stat-item {
        text-align: center;
    }

    .stat-number {
        display: block;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e3a8a;
    }

    .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .profile-nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        text-decoration: none;
        color: #374151;
        border-radius: 8px;
        transition: all 0.2s ease;
        margin-bottom: 4px;
    }

    .nav-item:hover {
        background: #f3f4f6;
        color: #1e3a8a;
    }

    .nav-item.active {
        background: #dbeafe;
        color: #1e3a8a;
        font-weight: 500;
    }

    .profile-content {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .profile-section {
        display: none;
        padding: 2rem;
    }

    .profile-section.active {
        display: block;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .profile-form {
        max-width: 600px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
    }

    .form-group input {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 16px;
    }

    .form-group input:read-only {
        background: #f9fafb;
        color: #6b7280;
    }

    .form-group input:not(:read-only) {
        border-color: #3b82f6;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
    }

    .btn-primary {
        background: #3b82f6;
        color: white;
    }

    .btn-primary:hover {
        background: #2563eb;
    }

    .btn-secondary {
        background: #6b7280;
        color: white;
    }

    .btn-outline {
        background: transparent;
        color: #3b82f6;
        border: 1px solid #3b82f6;
    }

    .btn-danger {
        background: #dc2626;
        color: white;
    }

    .btn-small {
        padding: 8px 16px;
        font-size: 14px;
    }

    .security-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1.5rem;
    }

    .security-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .security-item:last-child {
        border-bottom: none;
    }

    .change-password-form {
        margin-top: 2rem;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 2rem;
    }

    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .setting-item:last-child {
        border-bottom: none;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #3b82f6;
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }

    .session-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb;
    }

    .current-session {
        border-color: #3b82f6;
        background: #dbeafe;
    }

    .session-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .session-device {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .session-device i {
        font-size: 2rem;
        color: #6b7280;
    }

    .current-badge {
        background: #3b82f6;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.875rem;
    }

    .complaint-card {
        background: #f9fafb;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb;
    }

    .complaint-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-pending {
        background: #fef3c7;
        color: #92400e;
    }

    .status-investigating {
        background: #dbeafe;
        color: #1e40af;
    }

    .status-resolved {
        background: #d1fae5;
        color: #065f46;
    }

    .complaint-details p {
        margin: 0.5rem 0;
        color: #6b7280;
    }

    .complaint-actions {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }

    .no-complaints, .no-sessions {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
    }

    .no-complaints i, .no-sessions i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #d1d5db;
    }

    @media (max-width: 768px) {
        .profile-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(profileStyles);
