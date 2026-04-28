document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmit);
    }
});

function handleReportSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reportData = {
        type: formData.get('type'),
        title: formData.get('title'),
        description: formData.get('description'),
        evidence: formData.get('evidence').name ? [formData.get('evidence').name] : [],
        socialUrl: formData.get('socialUrl'),
    };

    const currentUser = DataUtils.getCurrentUser();
    if (currentUser) {
        reportData.reporterId = currentUser.userId;
    } else {
        // Handle anonymous reports if desired
        reportData.reporterId = 'anonymous';
    }

    const newComplaint = window.dataManager.addComplaint(reportData);

    showSuccessMessage(newComplaint.id);

    event.target.reset();
}

function showSuccessMessage(complaintId) {
    const messageOverlay = document.getElementById('messageOverlay');
    const messageTitle = document.getElementById('messageTitle');
    const messageText = document.getElementById('messageText');
    const complaintIdElement = document.getElementById('complaintId');

    if (messageOverlay && messageTitle && messageText && complaintIdElement) {
        messageTitle.textContent = 'Report Submitted Successfully!';
        messageText.textContent = 'Your complaint has been registered. You can track its status using the following ID:';
        complaintIdElement.textContent = complaintId;
        messageOverlay.style.display = 'flex';
    }
}

function hideMessage() {
    const messageOverlay = document.getElementById('messageOverlay');
    if (messageOverlay) {
        messageOverlay.style.display = 'none';
    }
}