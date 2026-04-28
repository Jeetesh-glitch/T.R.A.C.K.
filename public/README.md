# Government Cybercrime Portal - Homepage

A responsive and professional homepage for a Government Cybercrime Portal designed to fight against fake news and online exploitation.

## 🚀 Features

### 📱 Responsive Design
- Mobile-first approach with breakpoints for tablets and desktops
- Professional government-style theme (blue/white/grey)
- Touch-friendly interface for mobile devices

### 🎯 Key Sections
1. **Header** - Fixed navigation with logo, menu, and profile dropdown
2. **Hero Section** - Main call-to-action with reporting and login buttons
3. **Alert Ticker** - Scrolling real-time advisories about fake news
4. **Services Grid** - Four main service cards with hover effects
5. **About Section** - Mission and platform information
6. **Impact Stats** - Animated counters showing platform statistics
7. **Footer** - Contact information and quick links

### ⚡ Interactive Features
- Smooth scrolling navigation
- Animated statistics counters
- Mobile hamburger menu
- Profile dropdown with accessibility
- Scrolling news ticker with pause on hover
- Notification system for user feedback
- Keyboard navigation support

## 🛠 Technologies Used

- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with Flexbox and Grid
- **Vanilla JavaScript** - No external dependencies for core functionality
- **Font Awesome** - Icons for enhanced visual appeal
- **Google Fonts** - Inter font family for professional typography

## 📁 File Structure

```
E:\project123\
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles and responsive design
├── js/
│   └── script.js       # Interactive functionality
├── images/             # Placeholder for future assets
└── README.md           # This documentation file
```

## 🚀 Getting Started

1. **Open the homepage:**
   - Navigate to `E:\project123\`
   - Double-click `index.html` to open in your browser
   - Or use a local web server for best results

2. **For development:**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Then open:** `http://localhost:8000`

## 🎨 Design Specifications

### Color Scheme
- **Primary Blue:** #3b82f6 (Government blue)
- **Secondary Blue:** #1e3a8a (Dark blue)
- **Accent Gold:** #fbbf24 (Official accent)
- **Text:** #1e293b (Dark slate)
- **Background:** #f8f9fa (Light grey)

### Typography
- **Font Family:** Inter (Google Fonts)
- **Heading Sizes:** 2.5rem - 3.5rem
- **Body Text:** 1rem with 1.6 line height
- **Font Weights:** 300, 400, 500, 600, 700

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

## 🔧 Customization

### Adding New Alert Items
Edit the ticker content in `index.html`:
```html
<div class="alert-item">
    <span class="claim-false">❌ Claim: Your new fake news claim</span>
    <span class="fact-true">→ ✅ Fact: Your debunked information</span>
</div>
```

### Updating Statistics
Modify the `data-target` attributes in the stats section:
```html
<div class="stat-number" data-target="15000">0</div>
```

### Changing Contact Information
Update the footer section with new contact details, helpline numbers, or government addresses.

## 🛡 Security Features

- No external JavaScript dependencies (security-first approach)
- Proper input sanitization ready for forms
- HTTPS-ready structure
- Service Worker support for PWA capabilities
- Accessibility compliance (WCAG guidelines)

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance

- Optimized CSS with efficient selectors
- Debounced scroll handlers
- Intersection Observer for animations
- Lazy loading ready structure
- Minimal JavaScript footprint

## 🔮 Future Enhancements

1. **Backend Integration**
   - Connect to government databases
   - Real-time data feeds
   - User authentication system

2. **Additional Features**
   - Multi-language support
   - Dark mode toggle
   - Advanced search functionality
   - Real-time chat support

3. **PWA Features**
   - Offline functionality
   - Push notifications
   - App-like experience

## 📞 Support

For technical support or questions about this government portal:

- **Cybercrime Helpline:** 1930
- **Email:** cybercrime@gov.in
- **Address:** Ministry of Home Affairs, New Delhi

## 📄 License

This project is developed for Government of India - Ministry of Home Affairs.
All rights reserved © 2025.

---

*This is an official government portal. Report suspicious activities immediately.*
