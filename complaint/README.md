# Complaint Status Checker - Cyber Crime Cell

A professional, responsive web application for tracking complaint status in the Cyber Crime Cell system.

## Features ✨

### 🎨 Design
- **Clean Government Theme**: Professional blue/white color scheme
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Modern UI**: Card-based layout with smooth animations and transitions

### 🔍 Core Functionality
- **Status Search**: Enter complaint ID to check current status
- **Progress Tracking**: Visual timeline showing complaint journey
- **Status Badges**: Color-coded status indicators (Pending, In Progress, Resolved, Rejected)
- **Quick Actions**: Download acknowledgement, subscribe to updates, submit additional info

### 📱 User Experience
- **Smart Input**: Auto-formatting and validation for complaint IDs
- **Loading States**: Professional loading animations
- **Error Handling**: Clear error messages and validation
- **FAQ Section**: Collapsible frequently asked questions

## File Structure

```
E:\complaint\
├── complaint-status.html    # Main HTML file
├── styles.css              # Complete CSS styling
├── script.js               # JavaScript functionality
└── README.md              # This file
```

## How to Use

1. **Open the Page**: Double-click `complaint-status.html` to open in your browser
2. **Test with Sample Data**: Use these sample complaint IDs:
   - `CC2024001234` - In Progress case
   - `CC2024001235` - Resolved case
   - `CC2024001236` - Pending case
   - `CC2024001237` - Rejected case

## Demo Instructions 🚀

### Quick Test:
1. Open `complaint-status.html` in your browser
2. Enter `CC2024001234` in the Complaint ID field
3. Click "Check Status" to see the full interface in action

### Mobile Testing:
- Resize browser window or use browser developer tools to test responsive design
- All features work seamlessly on mobile devices

## Features Breakdown

### 🏛️ Header Navigation
- Professional government-style header with logo
- Navigation menu with active state for "Complaint Status"
- Mobile-responsive hamburger menu

### 🎯 Hero Section
- Clear title and description
- Search icon for visual appeal
- Centered, trustworthy design

### 📋 Status Search Form
- Complaint ID input with auto-formatting
- Optional contact field for verification
- Professional styling with focus states

### 📊 Status Results
- **Complaint Details**: All relevant information displayed clearly
- **Status Badges**: Color-coded for quick recognition
  - Grey = Pending
  - Blue = In Progress  
  - Green = Resolved
  - Red = Rejected/Closed
- **Progress Tracker**: 4-step timeline with animations
- **Authority Info**: Shows which department is handling the case

### ⚡ Quick Actions
- **Download Acknowledgement**: Generates printable PDF-style acknowledgement
- **Subscribe/Unsubscribe**: Toggle email/SMS notifications
- **Submit Additional Info**: Link to provide more details

### ❓ FAQ Section
- Collapsible accordion design
- Common questions about complaint process
- Helpful information about resolution times and departments

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet) and 480px (mobile)
- Touch-friendly interface on mobile devices

## Technical Details

### JavaScript Features:
- Form validation and auto-formatting
- Simulated API calls with loading states
- Progress tracker animations
- FAQ accordion functionality
- Mobile menu handling
- Keyboard shortcuts (Ctrl+Enter to submit)

### CSS Features:
- CSS Grid and Flexbox for layouts
- CSS animations and transitions
- Custom color scheme matching government standards
- Shadow and border styling for depth
- Responsive typography

### Sample Data:
The application includes 4 sample complaints for testing different status states and scenarios.

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements
- Real API integration
- PDF generation library
- Email/SMS notification system
- Database connectivity
- User authentication
- Advanced search filters

---

**Created for**: Cyber Crime Cell - Government of India  
**Contact**: Helpline 1930 (24x7) | complaints@cybercrime.gov.in
