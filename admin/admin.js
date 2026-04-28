// Police Cybercrime Admin Dashboard JavaScript

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    initializeLucideIcons();
    initializeEventListeners();
});

// Dashboard Initialization
function initializeDashboard() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });

    // Initialize live alerts with auto-refresh
    startLiveAlerts();
}

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Tab Switching Functionality
function initializeEventListeners() {
    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // "New Complaint" button
    const newComplaintBtn = document.querySelector('#complaints .btn-primary');
    if (newComplaintBtn) {
        newComplaintBtn.addEventListener('click', function() {
            alert('This button will open a form to create a new complaint.');
        });
    }

    // Profile dropdown toggle
    const profileBtn = document.querySelector('.profile-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (profileBtn && dropdownMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.style.display = 'none';
        });
    }

    // Modal close on background click
    const modal = document.getElementById('complaintModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Filter functionality
    initializeFilters();

    // Load complaints on initial load
    loadComplaints();
}

// Tab Switching
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Initialize page-specific functionality
    if (tabName === 'analytics') {
        setTimeout(initializeAnalyticsCharts, 100);
    } else if (tabName === 'complaints') {
        loadComplaints();
    }
}

function loadComplaints() {
    const complaints = window.dataManager.getComplaints();
    const tableBody = document.getElementById('complaintsTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (complaints.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align: center;">No complaints found.</td>`;
        tableBody.appendChild(row);
        return;
    }

    complaints.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${complaint.reporterId}</td>
            <td><span class="badge type-${complaint.type.replace(' ', '-')}">${complaint.type}</span></td>
            <td><span class="badge status-${complaint.status}">${complaint.status}</span></td>
            <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
            <td>${complaint.assignedOfficer || 'N/A'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewComplaint('${complaint.id}')" title="View Details">
                        <i data-lucide="eye"></i>
                    </button>
                    <button class="btn-icon btn-verify" onclick="markAsGenuine('${complaint.id}')" title="Mark as Genuine">
                        <i data-lucide="check"></i>
                    </button>
                    <button class="btn-icon btn-escalate" onclick="markAsFake('${complaint.id}')" title="Mark as Fake">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    lucide.createIcons();
}

function markAsGenuine(complaintId) {
    if (confirm('Are you sure you want to mark this complaint as genuine?')) {
        window.dataManager.updateComplaintStatus(complaintId, 'genuine', 'Admin');
        loadComplaints();
        showNotification('Complaint marked as genuine.', 'success');
    }
}

function markAsFake(complaintId) {
    if (confirm('Are you sure you want to mark this complaint as fake?')) {
        window.dataManager.updateComplaintStatus(complaintId, 'fake', 'Admin');
        loadComplaints();
        showNotification('Complaint marked as fake.', 'warning');
    }
}

// Chart Initialization
function initializeCharts() {
    // Dashboard Complaint Breakdown Chart
    const complaintChartCtx = document.getElementById('complaintChart');
    if (complaintChartCtx) {
        new Chart(complaintChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Fake News', 'Abusive Content', 'Spam', 'Harassment', 'Others'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#DC2626', // Red for Fake News
                        '#F59E0B', // Orange for Abusive Content
                        '#3B82F6', // Blue for Spam
                        '#7C3AED', // Purple for Harassment
                        '#64748B'  // Gray for Others
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Analytics Charts
function initializeAnalyticsCharts() {
    // Trend Chart
    const trendChartCtx = document.getElementById('trendChart');
    if (trendChartCtx) {
        new Chart(trendChartCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Total Complaints',
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#1E3A8A',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Resolved',
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    // Type Distribution Chart
    const typeChartCtx = document.getElementById('typeChart');
    if (typeChartCtx) {
        new Chart(typeChartCtx, {
            type: 'bar',
            data: {
                labels: ['Fake News', 'Abusive Content', 'Spam', 'Harassment'],
                datasets: [{
                    label: 'Number of Cases',
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        '#DC2626',
                        '#F59E0B',
                        '#3B82F6',
                        '#7C3AED'
                    ],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Modal Functions
function viewComplaint(complaintId) {
    const modal = document.getElementById('complaintModal');
    if (modal) {
        modal.classList.add('active');
        // Load complaint data based on ID
        loadComplaintData(complaintId);
    }
}

function closeModal() {
    const modal = document.getElementById('complaintModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function loadComplaintData(complaintId) {
    const complaint = window.dataManager.getComplaintById(complaintId);
    if (!complaint) return;

    // Update modal content
    document.getElementById('reporterId').textContent = complaint.reporterId;
    document.getElementById('reporterName').textContent = 'N/A'; // This data is not available in the complaint object
    document.getElementById('reporterContact').textContent = 'N/A'; // This data is not available in the complaint object
    document.getElementById('complaintType').textContent = complaint.type;
    document.getElementById('complaintDescription').textContent = complaint.description;
}

// Fake News Detection
function checkAuthenticity() {
    const contentInput = document.getElementById('contentInput');
    const resultsSection = document.getElementById('resultsSection');
    const content = contentInput.value.trim();

    if (!content) {
        alert('Please enter content to check');
        return;
    }

    // Show loading state
    contentInput.disabled = true;
    const checkBtn = document.querySelector('.check-btn');
    checkBtn.innerHTML = '<i data-lucide="loader"></i> Analyzing...';
    checkBtn.disabled = true;

    // Simulate AI analysis (replace with actual API call)
    setTimeout(() => {
        const score = Math.floor(Math.random() * 100);
        const verdict = score > 70 ? 'Likely Authentic' : score > 40 ? 'Uncertain' : 'Likely Fake';
        const confidence = score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low';

        // Update results
        document.getElementById('scoreFill').style.width = score + '%';
        document.getElementById('scoreText').textContent = score + '%';
        document.getElementById('verdict').textContent = verdict;
        document.querySelector('.confidence').textContent = 'Confidence: ' + confidence;

        // Show results
        resultsSection.classList.remove('hidden');

        // Reset button
        checkBtn.innerHTML = '<i data-lucide="search"></i> Check Authenticity';
        checkBtn.disabled = false;
        contentInput.disabled = false;

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 2000);
}

// Filter Functionality
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const typeFilter = document.getElementById('typeFilter')?.value || '';
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

    const tableRows = document.querySelectorAll('#complaintsTableBody tr');
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 0) return;

        const statusBadge = cells[3].querySelector('.badge');
        const typeBadge = cells[2].querySelector('.badge');
        const complaintId = cells[0].textContent.toLowerCase();
        const reporterId = cells[1].textContent.toLowerCase();

        const statusMatch = !statusFilter || (statusBadge && statusBadge.classList.contains(`status-${statusFilter}`));
        const typeMatch = !typeFilter || (typeBadge && typeBadge.classList.contains(`type-${typeFilter}`));
        const searchMatch = !searchTerm || complaintId.includes(searchTerm) || reporterId.includes(searchTerm);

        if (statusMatch && typeMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('searchInput').value = '';
    applyFilters();
}

// Live Alerts System
function startLiveAlerts() {
    // Simulate live alerts (replace with WebSocket or real-time updates)
    setInterval(updateLiveAlerts, 30000); // Update every 30 seconds
}

function updateLiveAlerts() {
    const alertsList = document.querySelector('.alerts-list');
    if (!alertsList) return;

    // Sample new alert
    const newAlert = document.createElement('div');
    newAlert.className = 'alert-item';
    newAlert.innerHTML = `
        <div class="alert-icon">
            <i data-lucide="info"></i>
        </div>
        <div class="alert-content">
            <div class="alert-title">New Complaint Received</div>
            <div class="alert-time">Just now</div>
        </div>
    `;

    // Add to top of list
    alertsList.insertBefore(newAlert, alertsList.firstChild);

    // Keep only last 10 alerts
    const alerts = alertsList.querySelectorAll('.alert-item');
    if (alerts.length > 10) {
        alertsList.removeChild(alerts[alerts.length - 1]);
    }

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Utility Functions
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

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i data-lucide="x"></i>
        </button>
    `;

    // Add notification styles if not already present
    if (!document.querySelector('#notificationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'notificationStyles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                min-width: 300px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left: 4px solid #10B981; }
            .notification-warning { border-left: 4px solid #F59E0B; }
            .notification-error { border-left: 4px solid #DC2626; }
            .notification-info { border-left: 4px solid #3B82F6; }
            .notification-content { display: flex; align-items: center; gap: 0.5rem; }
            .notification-close { background: none; border: none; cursor: pointer; color: #64748B; }
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `;
        document.head.appendChild(styles);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);

    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'alert-triangle',
        error: 'x-circle',
        info: 'info'
    };
    return icons[type] || 'info';
}