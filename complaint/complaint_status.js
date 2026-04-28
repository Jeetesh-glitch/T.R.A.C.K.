document.addEventListener('DOMContentLoaded', function() {
    const statusForm = document.getElementById('statusForm');
    if (statusForm) {
        statusForm.addEventListener('submit', handleStatusCheck);
    }
});

function handleStatusCheck(event) {
    event.preventDefault();

    const complaintIdInput = document.getElementById('complaintIdInput');
    const complaintId = complaintIdInput.value.trim();

    if (!complaintId) {
        alert('Please enter a complaint ID.');
        return;
    }

    const complaint = window.dataManager.getComplaintById(complaintId);

    const statusResult = document.getElementById('statusResult');
    const statusResultTitle = document.getElementById('statusResultTitle');
    const statusResultDescription = document.getElementById('statusResultDescription');
    const statusTimeline = document.getElementById('statusTimeline');

    if (complaint) {
        statusResultTitle.textContent = `Status for Complaint #${complaint.id}`;
        statusResultDescription.textContent = `Your report is currently: ${complaint.status}`;

        let timelineHTML = '';
        complaint.actionLog.forEach((log, index) => {
            timelineHTML += `
                <div class="timeline-item ${index === complaint.actionLog.length - 1 ? 'active' : ''}">
                    <div class="timeline-item-content">
                        <div class="timeline-item-title">${log.action}</div>
                        <div class="timeline-item-date">${new Date(log.timestamp).toLocaleString()}</div>
                        ${log.notes ? `<p class="timeline-item-notes">Notes: ${log.notes}</p>` : ''}
                    </div>
                </div>
            `;
        });

        statusTimeline.innerHTML = timelineHTML;
        statusResult.style.display = 'block';
    } else {
        statusResultTitle.textContent = 'Complaint Not Found';
        statusResultDescription.textContent = `No complaint found with the ID: ${complaintId}`;
        statusTimeline.innerHTML = '';
        statusResult.style.display = 'block';
    }
}
