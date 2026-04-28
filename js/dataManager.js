// Global Data Management System for Cybercrime Portal
// This file manages all data operations including users, complaints, and admin functions

class DataManager {
    constructor() {
        this.initializeStorage();
        this.setupDemoData();
    }

    // Initialize localStorage structure
    initializeStorage() {
        const requiredKeys = [
            'users',
            'complaints', 
            'admins',
            'advisories',
            'sessions',
            'notifications',
            'settings'
        ];

        requiredKeys.forEach(key => {
            if (!localStorage.getItem(key)) {
                switch(key) {
                    case 'users':
                    case 'complaints':
                    case 'admins':
                    case 'advisories':
                    case 'sessions':
                    case 'notifications':
                        localStorage.setItem(key, JSON.stringify([]));
                        break;
                    case 'settings':
                        localStorage.setItem(key, JSON.stringify({
                            autoAssign: true,
                            emailNotifications: true,
                            smsAlerts: true,
                            aiThreshold: 75,
                            escalationTime: 48
                        }));
                        break;
                }
            }
        });
    }

    // Setup initial demo data
    setupDemoData() {
        this.setupDemoUsers();
        this.setupDemoComplaints();
        this.setupDemoAdvisories();
    }

    // User Management
    setupDemoUsers() {
        const users = this.getUsers();
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: 'USR001',
                    username: 'demo_public',
                    password: 'password123',
                    role: 'public',
                    fullname: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+91-9876543210',
                    createdAt: new Date().toISOString(),
                    status: 'active'
                },
                {
                    id: 'ADM001', 
                    username: 'demo_admin',
                    password: 'admin123',
                    role: 'admin',
                    fullname: 'Officer Smith',
                    email: 'officer.smith@police.gov.in',
                    phone: '+91-9876543211',
                    department: 'Cyber Crime Cell',
                    badgeNumber: 'CC001',
                    createdAt: new Date().toISOString(),
                    status: 'active'
                }
            ];
            localStorage.setItem('users', JSON.stringify(demoUsers));
        }
    }

    // Complaint Management
    setupDemoComplaints() {
        const complaints = this.getComplaints();
        if (complaints.length === 0) {
            const demoComplaints = [
                {
                    id: 'CC2024001',
                    reporterId: 'USR001',
                    type: 'fake-news',
                    title: 'Fake COVID vaccine news spreading on WhatsApp',
                    description: 'False information about COVID vaccines causing deaths being circulated in WhatsApp groups',
                    evidence: ['screenshot1.jpg'],
                    socialUrl: 'https://example.com/fake-post',
                    status: 'pending',
                    priority: 'high',
                    assignedOfficer: 'Officer Smith',
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    updatedAt: new Date().toISOString(),
                    actionLog: [
                        {
                            action: 'Complaint submitted',
                            timestamp: new Date(Date.now() - 86400000).toISOString(),
                            officer: 'System'
                        }
                    ]
                },
                {
                    id: 'CC2024002',
                    reporterId: 'USR001',
                    type: 'abusive-content',
                    title: 'Harassment on social media platform',
                    description: 'User posting threatening messages and hate speech',
                    evidence: ['screenshot2.jpg'],
                    socialUrl: 'https://twitter.com/example',
                    status: 'investigating',
                    priority: 'medium',
                    assignedOfficer: 'Officer Patel',
                    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    updatedAt: new Date(Date.now() - 86400000).toISOString(),
                    actionLog: [
                        {
                            action: 'Complaint submitted',
                            timestamp: new Date(Date.now() - 172800000).toISOString(),
                            officer: 'System'
                        },
                        {
                            action: 'Assigned to investigating officer',
                            timestamp: new Date(Date.now() - 86400000).toISOString(),
                            officer: 'Officer Patel'
                        }
                    ]
                }
            ];
            localStorage.setItem('complaints', JSON.stringify(demoComplaints));
        }
    }

    // Advisory Management
    setupDemoAdvisories() {
        const advisories = this.getAdvisories();
        if (advisories.length === 0) {
            const demoAdvisories = [
                {
                    id: 'ADV001',
                    title: 'WhatsApp Lottery Scam Alert',
                    category: 'fraud-scams',
                    description: 'Beware of messages claiming lottery wins. These are fraudulent attempts to steal personal information.',
                    content: 'Detailed advisory content about WhatsApp lottery scams...',
                    severity: 'high',
                    publishedBy: 'Cyber Crime Cell',
                    publishedAt: new Date(Date.now() - 86400000).toISOString(),
                    views: 1234,
                    shares: 89,
                    reports: 156
                },
                {
                    id: 'ADV002',
                    title: 'Banking SMS Phishing Prevention',
                    category: 'safety-guidelines',
                    description: 'Learn how to identify and protect yourself from banking SMS scams.',
                    content: 'Detailed guidelines for banking security...',
                    severity: 'medium',
                    publishedBy: 'Financial Crimes Unit',
                    publishedAt: new Date(Date.now() - 172800000).toISOString(),
                    views: 892,
                    shares: 45,
                    reports: 23
                }
            ];
            localStorage.setItem('advisories', JSON.stringify(demoAdvisories));
        }
    }

    // User Operations
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId('USR'),
            ...userData,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    getUserById(id) {
        return this.getUsers().find(user => user.id === id);
    }

    getUserByUsername(username) {
        return this.getUsers().find(user => user.username === username);
    }

    updateUser(id, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('users', JSON.stringify(users));
            return users[userIndex];
        }
        return null;
    }

    // Authentication with role-based data isolation
    authenticateUser(username, password, role) {
        const users = this.getUsers();
        const user = users.find(user => 
            user.username === username && 
            user.password === password && 
            user.role === role &&
            user.status === 'active'
        );
        
        if (user) {
            // Initialize role-specific data storage
            this.initializeRoleDataStorage(user);
            return user;
        }
        
        return null;
    }
    
    // Initialize role-specific data storage
    initializeRoleDataStorage(user) {
        const roleKey = `${user.role}_data`;
        const userDataKey = `${user.role}_user_${user.username}`;
        
        // Initialize role-level data if not exists
        if (!localStorage.getItem(roleKey)) {
            const roleData = {
                role: user.role,
                users: [],
                complaints: [],
                notifications: [],
                settings: this.getDefaultRoleSettings(user.role),
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(roleKey, JSON.stringify(roleData));
        }
        
        // Initialize user-specific data within role
        if (!localStorage.getItem(userDataKey)) {
            const userData = {
                userId: user.id,
                username: user.username,
                role: user.role,
                personalComplaints: [],
                personalNotifications: [],
                personalSettings: this.getDefaultUserSettings(user.role),
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem(userDataKey, JSON.stringify(userData));
        }
    }
    
    // Get default settings based on role
    getDefaultRoleSettings(role) {
        if (role === 'admin') {
            return {
                autoAssignComplaints: true,
                emailNotifications: true,
                smsAlerts: true,
                dashboardRefreshInterval: 30,
                showAllUserData: true,
                exportPermissions: true,
                moderationTools: true
            };
        } else {
            return {
                emailNotifications: true,
                advisoryAlerts: true,
                statusUpdates: true,
                publicDashboard: true,
                limitedDataAccess: true
            };
        }
    }
    
    // Get default user settings based on role
    getDefaultUserSettings(role) {
        if (role === 'admin') {
            return {
                dashboardLayout: 'detailed',
                notificationFrequency: 'immediate',
                dataExportFormat: 'excel',
                autoRefresh: true,
                advancedFilters: true
            };
        } else {
            return {
                dashboardLayout: 'simple',
                notificationFrequency: 'daily',
                publicReports: true,
                basicFilters: true
            };
        }
    }

    // Session Management
    createSession(user) {
        const sessionData = {
            userId: user.id,
            username: user.username,
            role: user.role,
            fullname: user.fullname,
            email: user.email,
            loginTime: new Date().toISOString(),
            sessionId: this.generateId('SES')
        };
        
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        
        // Store in sessions array for admin tracking
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        sessions.push(sessionData);
        localStorage.setItem('sessions', JSON.stringify(sessions));
        
        return sessionData;
    }

    getCurrentSession() {
        const sessionData = localStorage.getItem('currentUser');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            // Check if session is still valid (24 hours)
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursSinceLogin < 24) {
                return session;
            } else {
                this.clearSession();
                return null;
            }
        }
        return null;
    }

    clearSession() {
        localStorage.removeItem('currentUser');
    }

    // Complaint Operations
    getComplaints() {
        return JSON.parse(localStorage.getItem('complaints') || '[]');
    }

    addComplaint(complaintData) {
        const complaints = this.getComplaints();
        const newComplaint = {
            id: this.generateComplaintId(),
            ...complaintData,
            status: 'pending',
            priority: this.calculatePriority(complaintData),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            actionLog: [{
                action: 'Complaint submitted',
                timestamp: new Date().toISOString(),
                officer: 'System'
            }]
        };
        
        complaints.push(newComplaint);
        localStorage.setItem('complaints', JSON.stringify(complaints));
        return newComplaint;
    }

    getComplaintById(id) {
        return this.getComplaints().find(complaint => complaint.id === id);
    }

    updateComplaintStatus(id, status, officerName = '', notes = '') {
        const complaints = this.getComplaints();
        const complaintIndex = complaints.findIndex(complaint => complaint.id === id);
        
        if (complaintIndex !== -1) {
            complaints[complaintIndex].status = status;
            complaints[complaintIndex].updatedAt = new Date().toISOString();
            
            // Add to action log
            complaints[complaintIndex].actionLog.push({
                action: `Status changed to ${status}`,
                timestamp: new Date().toISOString(),
                officer: officerName || 'System',
                notes: notes
            });

            localStorage.setItem('complaints', JSON.stringify(complaints));
            return complaints[complaintIndex];
        }
        return null;
    }

    // Advisory Operations
    getAdvisories() {
        return JSON.parse(localStorage.getItem('advisories') || '[]');
    }

    addAdvisory(advisoryData) {
        const advisories = this.getAdvisories();
        const newAdvisory = {
            id: this.generateId('ADV'),
            ...advisoryData,
            publishedAt: new Date().toISOString(),
            views: 0,
            shares: 0,
            reports: 0
        };
        
        advisories.push(newAdvisory);
        localStorage.setItem('advisories', JSON.stringify(advisories));
        return newAdvisory;
    }

    // Statistics
    getStatistics() {
        const complaints = this.getComplaints();
        const users = this.getUsers();
        const advisories = this.getAdvisories();

        const totalComplaints = complaints.length;
        const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
        const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
        const urgentComplaints = complaints.filter(c => c.priority === 'high').length;

        const complaintsByType = {
            'fake-news': complaints.filter(c => c.type === 'fake-news').length,
            'abusive-content': complaints.filter(c => c.type === 'abusive-content').length,
            'spam': complaints.filter(c => c.type === 'spam').length,
            'harassment': complaints.filter(c => c.type === 'harassment').length,
            'other': complaints.filter(c => c.type === 'other').length
        };

        return {
            totalComplaints,
            pendingComplaints,
            resolvedComplaints,
            urgentComplaints,
            complaintsByType,
            totalUsers: users.length,
            totalAdvisories: advisories.length,
            activeAdmins: users.filter(u => u.role === 'admin' && u.status === 'active').length
        };
    }

    // Utility Functions
    generateId(prefix = '') {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `${prefix}${timestamp.slice(-6)}${random}`;
    }

    generateComplaintId() {
        const year = new Date().getFullYear();
        const complaints = this.getComplaints();
        const count = complaints.length + 1;
        return `CC${year}${String(count).padStart(6, '0')}`;
    }

    calculatePriority(complaintData) {
        // Simple priority calculation based on type and keywords
        const highPriorityTypes = ['harassment', 'abusive-content'];
        const urgentKeywords = ['threat', 'violence', 'suicide', 'bomb', 'terrorist'];
        
        if (highPriorityTypes.includes(complaintData.type)) {
            return 'high';
        }
        
        const text = (complaintData.description || '').toLowerCase();
        const hasUrgentKeywords = urgentKeywords.some(keyword => text.includes(keyword));
        
        if (hasUrgentKeywords) {
            return 'high';
        }
        
        return 'medium';
    }

    // Search and Filter Functions
    searchComplaints(query, filters = {}) {
        let complaints = this.getComplaints();
        
        // Apply text search
        if (query) {
            const searchTerm = query.toLowerCase();
            complaints = complaints.filter(complaint => 
                complaint.title.toLowerCase().includes(searchTerm) ||
                complaint.description.toLowerCase().includes(searchTerm) ||
                complaint.id.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply filters
        if (filters.status) {
            complaints = complaints.filter(c => c.status === filters.status);
        }
        
        if (filters.type) {
            complaints = complaints.filter(c => c.type === filters.type);
        }
        
        if (filters.dateFrom) {
            complaints = complaints.filter(c => new Date(c.createdAt) >= new Date(filters.dateFrom));
        }
        
        if (filters.dateTo) {
            complaints = complaints.filter(c => new Date(c.createdAt) <= new Date(filters.dateTo));
        }
        
        return complaints;
    }

    // Notification System
    addNotification(userId, message, type = 'info') {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = {
            id: this.generateId('NOT'),
            userId: userId,
            message: message,
            type: type,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return notification;
    }

    getUserNotifications(userId) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    markNotificationAsRead(notificationId) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notificationIndex = notifications.findIndex(n => n.id === notificationId);
        
        if (notificationIndex !== -1) {
            notifications[notificationIndex].read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }

    // Settings Management
    getSettings() {
        return JSON.parse(localStorage.getItem('settings') || '{}');
    }

    updateSettings(newSettings) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        localStorage.setItem('settings', JSON.stringify(updatedSettings));
        return updatedSettings;
    }

    // Data Export
    exportData(type, format = 'json') {
        let data;
        let filename;
        
        switch(type) {
            case 'complaints':
                data = this.getComplaints();
                filename = `complaints_export_${new Date().toISOString().split('T')[0]}`;
                break;
            case 'users':
                data = this.getUsers().map(u => ({ ...u, password: '[HIDDEN]' })); // Hide passwords
                filename = `users_export_${new Date().toISOString().split('T')[0]}`;
                break;
            case 'statistics':
                data = this.getStatistics();
                filename = `statistics_export_${new Date().toISOString().split('T')[0]}`;
                break;
            default:
                throw new Error('Invalid export type');
        }
        
        if (format === 'csv') {
            return this.convertToCSV(data, filename);
        } else {
            return this.downloadJSON(data, filename);
        }
    }

    convertToCSV(data, filename) {
        if (!data.length) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
            }).join(','))
        ].join('\n');
        
        this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    }

    downloadJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // AI Mock Functions (for demo purposes)
    mockAIFactCheck(content) {
        // Simulate AI fact-checking
        const fakeNewsKeywords = ['fake', 'false', 'hoax', 'scam', 'fraud', 'misinformation'];
        const text = content.toLowerCase();
        
        let score = 50; // Base score
        
        // Adjust score based on keywords
        fakeNewsKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                score -= 15;
            }
        });
        
        // Add some randomness for demo
        score += Math.random() * 20 - 10;
        score = Math.max(0, Math.min(100, score));
        
        return {
            credibilityScore: Math.round(score),
            verdict: score > 70 ? 'Likely Authentic' : score > 30 ? 'Uncertain' : 'Likely Fake',
            confidence: score > 80 || score < 20 ? 'High' : score > 60 || score < 40 ? 'Medium' : 'Low',
            references: [
                'NDTV - Similar report found',
                'PIB Fact Check - Verified'
            ]
        };
    }

    mockToxicityAnalysis(content) {
        // Simulate toxicity analysis
        const toxicKeywords = ['hate', 'kill', 'stupid', 'idiot', 'threat', 'violence'];
        const text = content.toLowerCase();
        
        let score = 0;
        toxicKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                score += 20;
            }
        });
        
        score = Math.min(100, score + Math.random() * 10);
        
        return {
            toxicityScore: Math.round(score),
            classification: score > 80 ? 'Highly Toxic' : score > 50 ? 'Moderately Toxic' : score > 20 ? 'Mildly Toxic' : 'Non-Toxic'
        };
    }

    // Role-based data access methods
    getRoleSpecificData(role, username) {
        const dataKey = `${role}_user_${username}`;
        const userData = localStorage.getItem(dataKey);
        return userData ? JSON.parse(userData) : null;
    }
    
    updateRoleSpecificData(role, username, data) {
        const dataKey = `${role}_user_${username}`;
        const currentData = this.getRoleSpecificData(role, username) || {};
        const updatedData = { ...currentData, ...data, lastUpdated: new Date().toISOString() };
        localStorage.setItem(dataKey, JSON.stringify(updatedData));
        return updatedData;
    }
    
    // Get complaints specific to user role
    getRoleFilteredComplaints(userRole, userId = null) {
        const allComplaints = this.getComplaints();
        
        if (userRole === 'admin') {
            // Admins can see all complaints
            return allComplaints;
        } else if (userRole === 'public') {
            // Public users can only see their own complaints
            return userId ? allComplaints.filter(c => c.reporterId === userId) : [];
        }
        
        return [];
    }
    
    // Get users based on requester role
    getRoleFilteredUsers(requesterRole) {
        const allUsers = this.getUsers();
        
        if (requesterRole === 'admin') {
            // Admins can see all users but with sanitized data for public users
            return allUsers.map(user => {
                if (user.role === 'public') {
                    // Sanitize sensitive data for public users
                    const { password, ...sanitizedUser } = user;
                    return sanitizedUser;
                }
                return user;
            });
        } else {
            // Public users can only see their own data
            return [];
        }
    }
    
    // Validate data access permissions
    hasPermission(userRole, action, targetData = null) {
        const permissions = {
            admin: {
                'view_all_complaints': true,
                'manage_users': true,
                'access_analytics': true,
                'export_data': true,
                'moderate_content': true,
                'manage_advisories': true
            },
            public: {
                'view_own_complaints': true,
                'file_complaints': true,
                'update_own_profile': true,
                'view_advisories': true
            }
        };
        
        return permissions[userRole] && permissions[userRole][action] === true;
    }
    
    // Secure data retrieval with role validation
    getSecureData(dataType, userRole, userId = null) {
        if (!this.hasPermission(userRole, `view_${dataType}`)) {
            console.warn(`Access denied: ${userRole} cannot access ${dataType}`);
            return null;
        }
        
        switch(dataType) {
            case 'complaints':
            case 'all_complaints':
                return this.getRoleFilteredComplaints(userRole, userId);
            case 'users':
                return this.getRoleFilteredUsers(userRole);
            case 'own_complaints':
                return this.getRoleFilteredComplaints('public', userId);
            default:
                return null;
        }
    }
}

// Create global instance
window.dataManager = new DataManager();

// Enhanced utility functions with role-based access
window.DataUtils = {
    getCurrentUser: () => window.dataManager.getCurrentSession(),
    isLoggedIn: () => !!window.dataManager.getCurrentSession(),
    isAdmin: () => {
        const user = window.dataManager.getCurrentSession();
        return user && user.role === 'admin';
    },
    isPublicUser: () => {
        const user = window.dataManager.getCurrentSession();
        return user && user.role === 'public';
    },
    logout: () => {
        const currentUser = window.dataManager.getCurrentSession();
        if (currentUser) {
            // Clear role-specific session data
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(`session_${currentUser.role}_`) ||
                    key.startsWith(`${currentUser.role}_temp_`)) {
                    localStorage.removeItem(key);
                }
            });
        }
        window.dataManager.clearSession();
        window.location.href = '../index.html';
    },
    requireAuth: (adminOnly = false) => {
        const user = window.dataManager.getCurrentSession();
        if (!user) {
            window.location.href = '../index.html';
            return false;
        }
        if (adminOnly && user.role !== 'admin') {
            alert('Access denied. Admin privileges required.');
            window.location.href = '../public/home.html';
            return false;
        }
        return true;
    },
    // New role-specific data access methods
    getMyData: (dataType) => {
        const user = window.dataManager.getCurrentSession();
        if (!user) return null;
        return window.dataManager.getSecureData(dataType, user.role, user.userId);
    },
    hasPermission: (action) => {
        const user = window.dataManager.getCurrentSession();
        if (!user) return false;
        return window.dataManager.hasPermission(user.role, action);
    },
    getRoleData: () => {
        const user = window.dataManager.getCurrentSession();
        if (!user) return null;
        return window.dataManager.getRoleSpecificData(user.role, user.username);
    },
    updateRoleData: (data) => {
        const user = window.dataManager.getCurrentSession();
        if (!user) return null;
        return window.dataManager.updateRoleSpecificData(user.role, user.username, data);
    }
};

console.log('🔧 Data Management System Initialized');
console.log('Available functions:', Object.keys(window.DataUtils));
