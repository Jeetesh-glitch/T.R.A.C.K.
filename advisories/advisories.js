// Global variables
let allAdvisories = [];
let filteredAdvisories = [];
let currentPage = 1;
let advisoriesPerPage = 9;
let currentSearch = '';
let currentAdvisory = null;

// Profile Dropdown
function setupProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (profileBtn && dropdownMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Close dropdown when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// Mock advisory data
const mockAdvisories = [
    {
        id: 'adv001',
        title: 'Fake Loan App Scam Busted - 50+ Apps Removed from Play Store',
        category: 'fraud-scams',
        date: '2024-12-28',
        issuer: 'Cyber Cell Delhi Police',
        priority: 'high',
        summary: 'Delhi Police Cyber Cell has successfully identified and removed over 50 fraudulent loan applications from Google Play Store. These apps were charging exorbitant interest rates and using harassment tactics.',
        content: `
            <h3>Major Breakthrough in Fighting Online Loan Scams</h3>
            <p><strong>Date:</strong> December 28, 2024</p>
            <p><strong>Issued by:</strong> Cyber Cell Delhi Police</p>
            
            <h4>Key Details:</h4>
            <ul>
                <li>50+ fraudulent loan apps removed from Google Play Store</li>
                <li>Over 10,000 victims identified across multiple states</li>
                <li>₹25 crore estimated financial fraud amount</li>
                <li>15 arrests made in coordinated raids</li>
            </ul>
            
            <h4>How the Scam Worked:</h4>
            <p>The fraudulent apps appeared legitimate and offered instant loans with minimal documentation. However, they charged interest rates as high as 30% per week and used aggressive recovery tactics including:</p>
            <ul>
                <li>Accessing contact lists without permission</li>
                <li>Sending threatening messages to family and friends</li>
                <li>Morphing photos with objectionable content</li>
                <li>Creating fake legal notices</li>
            </ul>
            
            <h4>Red Flags to Watch For:</h4>
            <ul>
                <li>Apps asking for excessive permissions</li>
                <li>Interest rates above 36% per annum</li>
                <li>No proper registration or license details</li>
                <li>Pressure tactics for immediate approval</li>
            </ul>
            
            <h4>Action Taken:</h4>
            <p>In coordination with Google and various state police departments, all identified apps have been removed. Legal action has been initiated against the operators.</p>
            
            <h4>Prevention Tips:</h4>
            <ul>
                <li>Only use loans from RBI-registered institutions</li>
                <li>Read app permissions carefully before installation</li>
                <li>Report suspicious apps to cybercrime.gov.in</li>
                <li>Check company registration and license before applying</li>
            </ul>
        `,
        views: 2847,
        shares: 156,
        helpful: 89,
        location: 'national',
        tags: ['loan scam', 'mobile apps', 'fraud', 'delhi police']
    },
    {
        id: 'adv002',
        title: 'WhatsApp Lottery Scam: ₹2 Crore Fraudulent Network Dismantled',
        category: 'fake-news',
        date: '2024-12-27',
        issuer: 'Maharashtra Cyber Police',
        priority: 'high',
        summary: 'Maharashtra Cyber Police dismantled a major WhatsApp lottery scam network that defrauded victims of over ₹2 crores by sending fake lottery winning messages.',
        content: `
            <h3>WhatsApp Lottery Scam Network Busted</h3>
            <p><strong>Date:</strong> December 27, 2024</p>
            <p><strong>Issued by:</strong> Maharashtra Cyber Police</p>
            
            <h4>Operation Details:</h4>
            <ul>
                <li>₹2+ crore fraudulent transactions blocked</li>
                <li>500+ fake WhatsApp accounts identified</li>
                <li>8 arrests across Mumbai and Pune</li>
                <li>2,000+ victims from across India</li>
            </ul>
            
            <h4>How the Scam Operated:</h4>
            <p>Victims received WhatsApp messages claiming they had won international lotteries or KBC prizes. The messages appeared official with fake letterheads and logos.</p>
            
            <h4>Common Message Patterns:</h4>
            <ul>
                <li>"Congratulations! You've won ₹25 lakh in WhatsApp lottery"</li>
                <li>"KBC Winner - Claim your prize of ₹50 lakh"</li>
                <li>"International Lottery - You're our lucky winner"</li>
            </ul>
            
            <h4>Remember:</h4>
            <ul>
                <li>No legitimate lottery contacts winners via WhatsApp</li>
                <li>Never pay "processing fees" to claim prizes</li>
                <li>Verify through official channels before sharing information</li>
                <li>Report suspicious messages to 1930</li>
            </ul>
        `,
        views: 3521,
        shares: 289,
        helpful: 234,
        location: 'maharashtra',
        tags: ['whatsapp', 'lottery scam', 'kbc', 'fraud']
    },
    {
        id: 'adv003',
        title: 'Banking SMS Phishing: New Wave of Fake Bank Messages',
        category: 'fraud-scams',
        date: '2024-12-26',
        issuer: 'Reserve Bank of India',
        priority: 'medium',
        summary: 'RBI warns against sophisticated SMS phishing attacks impersonating major banks and asking customers to verify account details through fake links.',
        content: `
            <h3>Banking SMS Phishing Alert</h3>
            <p><strong>Date:</strong> December 26, 2024</p>
            <p><strong>Issued by:</strong> Reserve Bank of India</p>
            
            <h4>Alert Summary:</h4>
            <p>A new wave of sophisticated SMS phishing attacks is targeting bank customers across India. These messages appear to come from legitimate banks and request urgent account verification.</p>
            
            <h4>Common Fake Messages:</h4>
            <ul>
                <li>"Your account will be blocked in 24 hours. Click here to verify"</li>
                <li>"Suspicious activity detected. Update your KYC immediately"</li>
                <li>"Your debit card is temporarily blocked. Click to reactivate"</li>
                <li>"New RBI guidelines require account verification"</li>
            </ul>
            
            <h4>How to Identify Fake Messages:</h4>
            <ul>
                <li>Banks never ask for OTP, PIN, or passwords via SMS/email</li>
                <li>Check sender ID - legitimate banks use consistent IDs</li>
                <li>Look for spelling and grammar errors</li>
                <li>Verify links by typing bank URL directly in browser</li>
            </ul>
            
            <h4>If You Receive Such Messages:</h4>
            <ul>
                <li>Do not click any links in the message</li>
                <li>Do not share personal or banking information</li>
                <li>Contact your bank directly using official numbers</li>
                <li>Report to cybercrime.gov.in immediately</li>
            </ul>
        `,
        views: 1892,
        shares: 98,
        helpful: 145,
        location: 'national',
        tags: ['banking', 'sms phishing', 'rbi', 'account security']
    },
    {
        id: 'adv004',
        title: 'Social Media Account Hacking Prevention Guidelines',
        category: 'safety-guidelines',
        date: '2024-12-25',
        issuer: 'Ministry of Electronics & IT',
        priority: 'medium',
        summary: 'Official guidelines to protect your social media accounts from being hacked, including two-factor authentication and secure password practices.',
        content: `
            <h3>Social Media Security Guidelines</h3>
            <p><strong>Date:</strong> December 25, 2024</p>
            <p><strong>Issued by:</strong> Ministry of Electronics & IT</p>
            
            <h4>Essential Security Measures:</h4>
            
            <h5>1. Two-Factor Authentication (2FA)</h5>
            <ul>
                <li>Enable 2FA on all social media accounts</li>
                <li>Use authenticator apps instead of SMS when possible</li>
                <li>Keep backup codes in a secure location</li>
            </ul>
            
            <h5>2. Strong Password Practices</h5>
            <ul>
                <li>Use unique passwords for each platform</li>
                <li>Passwords should be at least 12 characters long</li>
                <li>Include mix of letters, numbers, and special characters</li>
                <li>Use password managers to generate and store passwords</li>
            </ul>
            
            <h5>3. Privacy Settings</h5>
            <ul>
                <li>Review and update privacy settings regularly</li>
                <li>Limit personal information visibility</li>
                <li>Be cautious about location sharing</li>
                <li>Review app permissions and third-party access</li>
            </ul>
            
            <h5>4. Warning Signs of Compromise</h5>
            <ul>
                <li>Unexpected posts or messages from your account</li>
                <li>Friends reporting strange messages from you</li>
                <li>Login notifications from unknown devices/locations</li>
                <li>Changes to account settings you didn't make</li>
            </ul>
            
            <h4>If Your Account is Hacked:</h4>
            <ol>
                <li>Change password immediately from a secure device</li>
                <li>Enable 2FA if not already active</li>
                <li>Review and revoke suspicious app permissions</li>
                <li>Inform friends and family about the compromise</li>
                <li>Report to the platform and file a cybercrime complaint</li>
            </ol>
        `,
        views: 1456,
        shares: 67,
        helpful: 201,
        location: 'national',
        tags: ['social media', 'account security', '2fa', 'password']
    },
    {
        id: 'adv005',
        title: 'COVID-19 Vaccine Misinformation: Fact vs Fiction Campaign',
        category: 'awareness-campaigns',
        date: '2024-12-24',
        issuer: 'Ministry of Health',
        priority: 'high',
        summary: 'Government launches awareness campaign to combat COVID-19 vaccine misinformation circulating on social media platforms.',
        content: `
            <h3>COVID-19 Vaccine: Separating Facts from Fiction</h3>
            <p><strong>Date:</strong> December 24, 2024</p>
            <p><strong>Issued by:</strong> Ministry of Health & Family Welfare</p>
            
            <h4>Common Myths Debunked:</h4>
            
            <h5>Myth 1: Vaccines alter DNA</h5>
            <p><strong>Fact:</strong> COVID-19 vaccines do not interact with or alter DNA in any way. mRNA vaccines work by instructing cells to make a protein that triggers immune response.</p>
            
            <h5>Myth 2: Natural immunity is better than vaccine immunity</h5>
            <p><strong>Fact:</strong> Vaccination provides more predictable and consistent protection without the risks associated with COVID-19 infection.</p>
            
            <h5>Myth 3: Vaccines cause fertility issues</h5>
            <p><strong>Fact:</strong> Extensive studies show no evidence of fertility problems in women or men after COVID-19 vaccination.</p>
            
            <h4>Trusted Information Sources:</h4>
            <ul>
                <li>Ministry of Health & Family Welfare official website</li>
                <li>WHO official communications</li>
                <li>ICMR guidelines and updates</li>
                <li>Registered medical practitioners</li>
            </ul>
            
            <h4>How to Verify Vaccine Information:</h4>
            <ul>
                <li>Check multiple authoritative medical sources</li>
                <li>Consult with qualified healthcare providers</li>
                <li>Verify claims through official government channels</li>
                <li>Be skeptical of sensational social media posts</li>
            </ul>
            
            <h4>Report Misinformation:</h4>
            <p>Help combat vaccine misinformation by reporting false claims to appropriate authorities and encouraging others to seek information from trusted sources.</p>
        `,
        views: 4128,
        shares: 312,
        helpful: 456,
        location: 'national',
        tags: ['covid-19', 'vaccine', 'misinformation', 'health']
    },
    {
        id: 'adv006',
        title: 'Telegram Channel Spreading Fake Government Job Notifications',
        category: 'fake-news',
        date: '2024-12-23',
        issuer: 'Employment Ministry',
        priority: 'medium',
        summary: 'Multiple Telegram channels caught spreading fake government job notifications and collecting registration fees from job seekers.',
        content: `
            <h3>Fake Government Job Telegram Channels Exposed</h3>
            <p><strong>Date:</strong> December 23, 2024</p>
            <p><strong>Issued by:</strong> Ministry of Employment & Labour</p>
            
            <h4>Scam Overview:</h4>
            <p>Several Telegram channels have been identified spreading fake government job notifications and collecting "registration fees" from unsuspecting job seekers.</p>
            
            <h4>Identified Fraudulent Channels:</h4>
            <ul>
                <li>@FakeGovtJobs2024 (Blocked)</li>
                <li>@IndiaJobsOfficial (Blocked)</li>
                <li>@SarkariResultToday (Blocked)</li>
                <li>@GovtJobUpdate (Blocked)</li>
            </ul>
            
            <h4>Red Flags:</h4>
            <ul>
                <li>Asking for registration or processing fees</li>
                <li>Promising guaranteed job placement</li>
                <li>Unofficial email addresses for applications</li>
                <li>Poor grammar and formatting in notifications</li>
            </ul>
            
            <h4>Legitimate Government Job Sources:</h4>
            <ul>
                <li>Official government department websites</li>
                <li>Employment News (official publication)</li>
                <li>State Public Service Commission websites</li>
                <li>Official social media accounts with verification</li>
            </ul>
            
            <h4>Protection Tips:</h4>
            <ul>
                <li>Never pay fees for government job applications</li>
                <li>Verify all job notifications through official channels</li>
                <li>Be wary of too-good-to-be-true offers</li>
                <li>Report suspicious channels to authorities</li>
            </ul>
        `,
        views: 2156,
        shares: 89,
        helpful: 167,
        location: 'national',
        tags: ['telegram', 'fake jobs', 'government employment', 'scam']
    },
    {
        id: 'adv007',
        title: 'UPI Payment Fraud: New QR Code Scam Techniques Identified',
        category: 'fraud-scams',
        date: '2024-12-22',
        issuer: 'National Payments Corporation',
        priority: 'high',
        summary: 'NPCI alerts users about sophisticated QR code scams where fraudsters replace legitimate payment QR codes with their own to steal money.',
        content: `
            <h3>UPI QR Code Fraud Alert</h3>
            <p><strong>Date:</strong> December 22, 2024</p>
            <p><strong>Issued by:</strong> National Payments Corporation of India</p>
            
            <h4>New Scam Techniques:</h4>
            <p>Fraudsters are using increasingly sophisticated methods to replace legitimate QR codes with their own, redirecting payments to their accounts.</p>
            
            <h5>Method 1: Physical QR Code Replacement</h5>
            <ul>
                <li>Sticking fake QR codes over genuine ones at shops</li>
                <li>Using similar-looking codes in parking areas</li>
                <li>Replacing codes at food stalls and small vendors</li>
            </ul>
            
            <h5>Method 2: Digital QR Code Manipulation</h5>
            <ul>
                <li>Sending fake QR codes via WhatsApp/SMS</li>
                <li>Creating fake payment request links</li>
                <li>Impersonating delivery personnel with fake codes</li>
            </ul>
            
            <h4>Safety Measures:</h4>
            <ul>
                <li>Always verify merchant details before scanning</li>
                <li>Check if the merchant name matches the shop/service</li>
                <li>Be cautious of handwritten or poorly printed QR codes</li>
                <li>Verify amount before confirming payment</li>
                <li>Use official UPI apps from trusted sources</li>
            </ul>
            
            <h4>Red Flags:</h4>
            <ul>
                <li>QR codes that look recently placed or temporary</li>
                <li>Mismatched merchant names</li>
                <li>Pressure to scan codes quickly</li>
                <li>Requests for OTP or PIN after scanning</li>
            </ul>
            
            <h4>Immediate Actions if Scammed:</h4>
            <ol>
                <li>Screenshot the fraudulent transaction</li>
                <li>Contact your bank immediately</li>
                <li>File complaint on cybercrime.gov.in</li>
                <li>Call 1930 for immediate assistance</li>
            </ol>
        `,
        views: 1743,
        shares: 134,
        helpful: 198,
        location: 'national',
        tags: ['upi', 'qr code', 'payment fraud', 'npci']
    },
    {
        id: 'adv008',
        title: 'Online Gaming Addiction & Fraud Prevention for Students',
        category: 'awareness-campaigns',
        date: '2024-12-21',
        issuer: 'Ministry of Education',
        priority: 'medium',
        summary: 'Educational campaign targeting students and parents about online gaming addiction risks and associated financial frauds.',
        content: `
            <h3>Online Gaming: Awareness for Students & Parents</h3>
            <p><strong>Date:</strong> December 21, 2024</p>
            <p><strong>Issued by:</strong> Ministry of Education</p>
            
            <h4>Growing Concerns:</h4>
            <p>Increasing reports of students falling victim to gaming addiction and associated financial frauds have prompted this awareness initiative.</p>
            
            <h4>Common Gaming Frauds:</h4>
            <ul>
                <li>Fake gaming apps promising real money rewards</li>
                <li>Fraudulent gaming tournaments with entry fees</li>
                <li>Fake gaming currency exchange platforms</li>
                <li>Identity theft through gaming platforms</li>
            </ul>
            
            <h4>Warning Signs of Gaming Addiction:</h4>
            <ul>
                <li>Excessive time spent gaming (>3 hours daily)</li>
                <li>Neglecting studies, sleep, or social activities</li>
                <li>Spending money on in-game purchases frequently</li>
                <li>Mood changes when gaming time is restricted</li>
            </ul>
            
            <h4>For Parents:</h4>
            <ul>
                <li>Monitor children's gaming time and spending</li>
                <li>Set up parental controls on devices</li>
                <li>Educate about online safety and fraud risks</li>
                <li>Encourage offline activities and hobbies</li>
            </ul>
            
            <h4>For Students:</h4>
            <ul>
                <li>Set time limits for gaming activities</li>
                <li>Never share personal or financial information</li>
                <li>Be skeptical of "easy money" gaming offers</li>
                <li>Discuss concerns with parents or teachers</li>
            </ul>
            
            <h4>Resources for Help:</h4>
            <ul>
                <li>National helpline: 1930</li>
                <li>School counselors and teachers</li>
                <li>Online addiction support groups</li>
                <li>Professional counseling services</li>
            </ul>
        `,
        views: 987,
        shares: 45,
        helpful: 89,
        location: 'national',
        tags: ['gaming addiction', 'student safety', 'education', 'fraud prevention']
    },
    {
        id: 'adv009',
        title: 'Cryptocurrency Investment Scams: Protect Your Savings',
        category: 'fraud-scams',
        date: '2024-12-20',
        issuer: 'Securities Exchange Board',
        priority: 'high',
        summary: 'SEBI warns investors about fraudulent cryptocurrency investment schemes promising unrealistic returns and guaranteed profits.',
        content: `
            <h3>Cryptocurrency Investment Fraud Alert</h3>
            <p><strong>Date:</strong> December 20, 2024</p>
            <p><strong>Issued by:</strong> Securities and Exchange Board of India</p>
            
            <h4>Current Threat Landscape:</h4>
            <p>Fraudulent cryptocurrency investment schemes are targeting retail investors with promises of guaranteed high returns and risk-free investments.</p>
            
            <h4>Common Scam Tactics:</h4>
            <ul>
                <li>Fake celebrity endorsements</li>
                <li>Guaranteed return promises (often 10-50% monthly)</li>
                <li>Pressure to invest immediately</li>
                <li>Fake trading platforms and apps</li>
                <li>Ponzi schemes disguised as crypto investments</li>
            </ul>
            
            <h4>Red Flags to Watch:</h4>
            <ul>
                <li>Promises of guaranteed profits</li>
                <li>Pressure to recruit friends/family</li>
                <li>Lack of proper registration or documentation</li>
                <li>Request for immediate large investments</li>
                <li>Overly complex or secretive investment strategies</li>
            </ul>
            
            <h4>Legitimate Investment Guidelines:</h4>
            <ul>
                <li>Research thoroughly before investing</li>
                <li>Only use SEBI-registered platforms</li>
                <li>Understand that all investments carry risk</li>
                <li>Never invest more than you can afford to lose</li>
                <li>Seek advice from qualified financial advisors</li>
            </ul>
            
            <h4>Reporting Fraudulent Schemes:</h4>
            <p>Report suspicious investment opportunities to SEBI and file complaints on cybercrime.gov.in. Your reports help protect other potential victims.</p>
        `,
        views: 2634,
        shares: 178,
        helpful: 289,
        location: 'national',
        tags: ['cryptocurrency', 'investment fraud', 'sebi', 'financial scam']
    },
    {
        id: 'adv010',
        title: 'Fake News About Natural Disasters: Verification Guidelines',
        category: 'fake-news',
        date: '2024-12-19',
        issuer: 'National Disaster Response Force',
        priority: 'medium',
        summary: 'NDRF issues guidelines to identify and verify news about natural disasters and emergency situations to prevent panic and misinformation.',
        content: `
            <h3>Natural Disaster Information Verification</h3>
            <p><strong>Date:</strong> December 19, 2024</p>
            <p><strong>Issued by:</strong> National Disaster Response Force</p>
            
            <h4>The Problem:</h4>
            <p>False information about natural disasters spreads rapidly on social media, causing unnecessary panic and hindering relief operations.</p>
            
            <h4>Common Types of Fake Disaster News:</h4>
            <ul>
                <li>Exaggerated casualty figures</li>
                <li>False evacuation orders</li>
                <li>Fake rescue operation videos</li>
                <li>Unverified damage assessments</li>
                <li>False weather predictions and warnings</li>
            </ul>
            
            <h4>Verification Steps:</h4>
            <ol>
                <li><strong>Check Official Sources:</strong> IMD, NDMA, state disaster management authorities</li>
                <li><strong>Verify Media Reports:</strong> Cross-check with multiple reliable news sources</li>
                <li><strong>Check Timestamps:</strong> Ensure images/videos are recent and relevant</li>
                <li><strong>Look for Context:</strong> Verify location and circumstances</li>
            </ol>
            
            <h4>Official Information Sources:</h4>
            <ul>
                <li>India Meteorological Department (IMD)</li>
                <li>National Disaster Management Authority (NDMA)</li>
                <li>State Disaster Management Authorities</li>
                <li>Official government social media accounts</li>
                <li>All India Radio and Doordarshan</li>
            </ul>
            
            <h4>What You Can Do:</h4>
            <ul>
                <li>Share only verified information</li>
                <li>Report false disaster news immediately</li>
                <li>Encourage others to verify before sharing</li>
                <li>Follow official emergency protocols</li>
            </ul>
            
            <h4>Emergency Contacts:</h4>
            <ul>
                <li>Disaster Helpline: 1078</li>
                <li>Police: 100</li>
                <li>Fire: 101</li>
                <li>Ambulance: 108</li>
                <li>Cybercrime: 1930</li>
            </ul>
        `,
        views: 1234,
        shares: 67,
        helpful: 134,
        location: 'national',
        tags: ['natural disaster', 'fake news', 'ndrf', 'emergency', 'verification']
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadAdvisories();
});

function initializePage() {
    // Set current date for date filters
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('toDate').value = today;
    
    // Set default from date (7 days ago)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    document.getElementById('fromDate').value = weekAgo.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search
    document.getElementById('searchInput').addEventListener('input', debounce(performSearch, 300));
    
    // Filter change listeners
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    document.getElementById('dateFilter').addEventListener('change', function() {
        toggleCustomDateRange();
        applyFilters();
    });
    
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applySorting);
    
    // Custom date range
    document.getElementById('fromDate').addEventListener('change', applyFilters);
    document.getElementById('toDate').addEventListener('change', applyFilters);
    
    // Load more functionality
    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreAdvisories);
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);
    
    // Modal close on background click
    document.getElementById('advisoryModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.getElementById('awarenessModal').addEventListener('click', function(e) {
        if (e.target === this) closeAwarenessModal();
    });
    
    document.getElementById('shareModal').addEventListener('click', function(e) {
        if (e.target === this) closeShareModal();
    });
}

// Advisory Loading and Management
function loadAdvisories() {
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        allAdvisories = [...mockAdvisories];
        applyFilters();
        showLoading(false);
    }, 1000);
}

function applyFilters() {
    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    
    // Get date filter
    const dateFilter = document.getElementById('dateFilter').value;
    
    // Get location filter
    const locationFilter = document.getElementById('locationFilter').value;
    
    // Filter advisories
    filteredAdvisories = allAdvisories.filter(advisory => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(advisory.category)) {
            return false;
        }
        
        // Date filter
        if (!passesDateFilter(advisory.date, dateFilter)) {
            return false;
        }
        
        // Location filter
        if (locationFilter !== 'all' && advisory.location !== locationFilter && advisory.location !== 'national') {
            return false;
        }
        
        // Search filter
        if (currentSearch && !passesSearchFilter(advisory, currentSearch)) {
            return false;
        }
        
        return true;
    });
    
    // Apply sorting
    applySorting();
    
    // Reset pagination
    currentPage = 1;
    
    // Render advisories
    renderAdvisories();
    updateAdvisoryCount();
}

function passesDateFilter(advisoryDate, filter) {
    const advDate = new Date(advisoryDate);
    const today = new Date();
    
    switch(filter) {
        case 'all':
            return true;
        case '7days':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return advDate >= weekAgo;
        case '30days':
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            return advDate >= monthAgo;
        case '90days':
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
            return advDate >= threeMonthsAgo;
        case 'custom':
            const fromDate = new Date(document.getElementById('fromDate').value);
            const toDate = new Date(document.getElementById('toDate').value);
            return advDate >= fromDate && advDate <= toDate;
        default:
            return true;
    }
}

function passesSearchFilter(advisory, searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    return (
        advisory.title.toLowerCase().includes(searchLower) ||
        advisory.summary.toLowerCase().includes(searchLower) ||
        advisory.issuer.toLowerCase().includes(searchLower) ||
        advisory.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
}

function applySorting() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredAdvisories.sort((a, b) => {
        switch(sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'relevance':
                // In a real app, this would be based on search relevance
                return b.views - a.views;
            case 'popularity':
                return (b.views + b.shares + b.helpful) - (a.views + a.shares + a.helpful);
            default:
                return 0;
        }
    });
}

function renderAdvisories() {
    const grid = document.getElementById('advisoryGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredAdvisories.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        document.getElementById('loadMoreBtn').style.display = 'none';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Calculate advisories to show
    const advisoriesToShow = filteredAdvisories.slice(0, currentPage * advisoriesPerPage);
    
    grid.innerHTML = advisoriesToShow.map(advisory => createAdvisoryCard(advisory)).join('');
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (advisoriesToShow.length < filteredAdvisories.length) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.innerHTML = `
            <i class="fas fa-chevron-down"></i>
            Load More Advisories (${filteredAdvisories.length - advisoriesToShow.length} remaining)
        `;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function createAdvisoryCard(advisory) {
    const categoryEmoji = {
        'fake-news': '📰',
        'fraud-scams': '💰',
        'safety-guidelines': '🛡️',
        'awareness-campaigns': '📢'
    };
    
    const priorityClass = `priority-${advisory.priority}`;
    const categoryClass = `category-${advisory.category}`;
    
    return `
        <div class="advisory-card ${categoryClass}" onclick="viewAdvisory('${advisory.id}')">
            <div class="advisory-header">
                <span class="advisory-category ${priorityClass}">
                    ${categoryEmoji[advisory.category]} ${getCategoryName(advisory.category)}
                </span>
                <span class="advisory-date">${formatDate(advisory.date)}</span>
            </div>
            
            <h3 class="advisory-title">${advisory.title}</h3>
            
            <div class="advisory-issuer">
                <i class="fas fa-building"></i>
                <span>${advisory.issuer}</span>
            </div>
            
            <p class="advisory-summary">${advisory.summary}</p>
            
            <div class="advisory-actions">
                <div class="advisory-meta">
                    <span><i class="fas fa-eye"></i> ${advisory.views}</span>
                    <span><i class="fas fa-share"></i> ${advisory.shares}</span>
                    <span><i class="fas fa-thumbs-up"></i> ${advisory.helpful}</span>
                </div>
                <button class="read-more-btn" onclick="event.stopPropagation(); viewAdvisory('${advisory.id}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            
            <div class="card-interactions">
                <div class="interaction-buttons">
                    <button class="interaction-btn" onclick="event.stopPropagation(); markAsHelpful('${advisory.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        Helpful
                    </button>
                    <button class="interaction-btn" onclick="event.stopPropagation(); shareAdvisoryDirect('${advisory.id}')">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                    <button class="interaction-btn" onclick="event.stopPropagation(); reportRelatedCase('${advisory.id}')">
                        <i class="fas fa-flag"></i>
                        Report Similar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const names = {
        'fake-news': 'Fake News',
        'fraud-scams': 'Fraud & Scams',
        'safety-guidelines': 'Safety Guidelines',
        'awareness-campaigns': 'Awareness'
    };
    return names[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Search Functionality
function performSearch() {
    currentSearch = document.getElementById('searchInput').value.trim();
    applyFilters();
}

function quickSearch(term) {
    document.getElementById('searchInput').value = term;
    currentSearch = term;
    applyFilters();
}

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

// Filter Management
function toggleCustomDateRange() {
    const dateFilter = document.getElementById('dateFilter').value;
    const customRange = document.getElementById('customDateRange');
    
    if (dateFilter === 'custom') {
        customRange.style.display = 'block';
    } else {
        customRange.style.display = 'none';
    }
}

function clearAllFilters() {
    // Reset categories
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = true);
    
    // Reset date filter
    document.getElementById('dateFilter').value = '7days';
    toggleCustomDateRange();
    
    // Reset location filter
    document.getElementById('locationFilter').value = 'all';
    
    // Reset search
    document.getElementById('searchInput').value = '';
    currentSearch = '';
    
    // Reapply filters
    applyFilters();
}

// Advisory Viewing
function viewAdvisory(advisoryId) {
    const advisory = allAdvisories.find(a => a.id === advisoryId);
    if (!advisory) return;
    
    currentAdvisory = advisory;
    
    // Populate modal
    document.getElementById('modalTitle').textContent = advisory.title;
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-advisory-meta">
            <div class="meta-row">
                <span><strong>Published:</strong> ${formatDate(advisory.date)}</span>
                <span><strong>Category:</strong> ${getCategoryName(advisory.category)}</span>
            </div>
            <div class="meta-row">
                <span><strong>Issued by:</strong> ${advisory.issuer}</span>
                <span><strong>Priority:</strong> ${advisory.priority.toUpperCase()}</span>
            </div>
        </div>
        <div class="advisory-full-content">
            ${advisory.content}
        </div>
        <div class="advisory-engagement">
            <div class="engagement-stats">
                <span><i class="fas fa-eye"></i> ${advisory.views} views</span>
                <span><i class="fas fa-share"></i> ${advisory.shares} shares</span>
                <span><i class="fas fa-thumbs-up"></i> ${advisory.helpful} found helpful</span>
            </div>
        </div>
    `;
    
    // Show modal
    document.getElementById('advisoryModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Update view count
    advisory.views++;
    updateAdvisoryCard(advisory.id);
}

function viewBreakingAdvisory() {
    // This would typically load the specific breaking advisory
    viewAdvisory('adv002'); // Using WhatsApp lottery scam as example
}

function closeModal() {
    document.getElementById('advisoryModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Awareness Modal Functions
function openAwarenessModal(type) {
    const content = getAwarenessContent(type);
    document.getElementById('awarenessModalTitle').textContent = content.title;
    document.getElementById('awarenessModalBody').innerHTML = content.body;
    document.getElementById('awarenessModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAwarenessModal() {
    document.getElementById('awarenessModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getAwarenessContent(type) {
    const content = {
        'spot-fake-news': {
            title: 'How to Spot Fake News',
            body: `
                <div class="awareness-content">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>Educational Video: Identifying Fake News</p>
                        <small>Duration: 5 minutes</small>
                    </div>
                    
                    <h4>Key Indicators of Fake News:</h4>
                    <ol>
                        <li><strong>Check the Source:</strong> Verify if the news comes from a credible, established news organization</li>
                        <li><strong>Look for Author Information:</strong> Legitimate articles have clear author attribution</li>
                        <li><strong>Examine the URL:</strong> Fake news sites often have suspicious URLs or domain names</li>
                        <li><strong>Check for Bias:</strong> Be wary of overly emotional or sensational language</li>
                        <li><strong>Verify with Multiple Sources:</strong> Cross-check the information with other reliable sources</li>
                        <li><strong>Check the Date:</strong> Ensure the news is current and not recycled old content</li>
                        <li><strong>Look for Supporting Evidence:</strong> Legitimate news includes quotes, data, and verifiable facts</li>
                    </ol>
                    
                    <h4>Fact-Checking Resources:</h4>
                    <ul>
                        <li>Government press releases and official websites</li>
                        <li>Established fact-checking organizations</li>
                        <li>Multiple credible news sources</li>
                        <li>Official social media accounts with verification</li>
                    </ul>
                </div>
            `
        },
        'suspicious-links': {
            title: 'Identifying Suspicious Links',
            body: `
                <div class="awareness-content">
                    <div class="infographic-placeholder">
                        <i class="fas fa-image"></i>
                        <p>Interactive Infographic: Link Safety Guide</p>
                    </div>
                    
                    <h4>Red Flags in URLs:</h4>
                    <ul>
                        <li><strong>Shortened URLs:</strong> bit.ly, tinyurl.com (hover to see full URL)</li>
                        <li><strong>Misspelled Domains:</strong> gooogle.com, amazom.com</li>
                        <li><strong>Suspicious Subdomains:</strong> security-update.microsoft-support.com</li>
                        <li><strong>Non-HTTPS:</strong> Links starting with http:// instead of https://</li>
                        <li><strong>Random Characters:</strong> URLs with excessive random letters/numbers</li>
                    </ul>
                    
                    <h4>Before Clicking Any Link:</h4>
                    <ol>
                        <li>Hover over the link to see the full URL</li>
                        <li>Check if the domain matches the supposed sender</li>
                        <li>Look for HTTPS and valid security certificates</li>
                        <li>Be especially careful with urgent or threatening messages</li>
                    </ol>
                    
                    <h4>Safe Browsing Tips:</h4>
                    <ul>
                        <li>Type URLs directly instead of clicking links</li>
                        <li>Use bookmarks for frequently visited sites</li>
                        <li>Keep your browser and security software updated</li>
                        <li>Enable browser security features and warnings</li>
                    </ul>
                </div>
            `
        },
        'safety-checklist': {
            title: 'Digital Safety Checklist',
            body: `
                <div class="awareness-content">
                    <h4>Daily Safety Practices:</h4>
                    <div class="checklist">
                        <label class="checklist-item">
                            <input type="checkbox"> Use strong, unique passwords for each account
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Enable two-factor authentication where possible
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Keep software and apps updated
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Be cautious about what you share on social media
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Verify before clicking links or downloading attachments
                        </label>
                    </div>
                    
                    <h4>Weekly Security Tasks:</h4>
                    <div class="checklist">
                        <label class="checklist-item">
                            <input type="checkbox"> Review privacy settings on social media
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Check for suspicious account activity
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Update security software and run scans
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Backup important data
                        </label>
                    </div>
                    
                    <h4>Monthly Security Review:</h4>
                    <div class="checklist">
                        <label class="checklist-item">
                            <input type="checkbox"> Review and remove unused apps and accounts
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Check credit reports for unauthorized activity
                        </label>
                        <label class="checklist-item">
                            <input type="checkbox"> Update emergency contacts and recovery options
                        </label>
                    </div>
                    
                    <p class="safety-note"><strong>Remember:</strong> Digital safety is an ongoing process, not a one-time setup. Stay vigilant and keep learning about new threats.</p>
                </div>
            `
        }
    };
    
    return content[type] || { title: 'Content Not Found', body: '<p>Content not available.</p>' };
}

// User Interactions
function markAsHelpful(advisoryId) {
    const advisory = allAdvisories.find(a => a.id === advisoryId);
    if (advisory) {
        advisory.helpful++;
        updateAdvisoryCard(advisoryId);
        showNotification('Marked as helpful!', 'success');
    }
}

function shareAdvisoryDirect(advisoryId) {
    const advisory = allAdvisories.find(a => a.id === advisoryId);
    if (advisory) {
        currentAdvisory = advisory;
        openShareModal();
    }
}

function reportRelatedCase(advisoryId) {
    // This would redirect to the report page with pre-filled information
    const advisory = allAdvisories.find(a => a.id === advisoryId);
    if (advisory) {
        const reportUrl = `../report/report.html?related=${advisoryId}&type=${advisory.category}`;
        window.open(reportUrl, '_blank');
        showNotification('Redirecting to report page...', 'info');
    }
}

function updateAdvisoryCard(advisoryId) {
    // Update the card in the grid
    renderAdvisories();
}

// Share Functionality
function shareAdvisory() {
    if (currentAdvisory) {
        openShareModal();
    }
}

function openShareModal() {
    if (!currentAdvisory) return;
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?advisory=${currentAdvisory.id}`;
    document.getElementById('shareUrl').value = shareUrl;
    document.getElementById('shareModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function shareOnPlatform(platform) {
    if (!currentAdvisory) return;
    
    const url = document.getElementById('shareUrl').value;
    const text = `${currentAdvisory.title} - Government Cybercrime Advisory`;
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        
        // Update share count
        currentAdvisory.shares++;
        updateAdvisoryCard(currentAdvisory.id);
    }
}

function copyLink() {
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.select();
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

// PDF Download
function downloadPDF() {
    if (!currentAdvisory) return;
    
    // Create PDF content
    const pdfContent = `
        GOVERNMENT CYBERCRIME PORTAL
        ============================
        
        OFFICIAL ADVISORY
        
        Title: ${currentAdvisory.title}
        Date: ${formatDate(currentAdvisory.date)}
        Issued by: ${currentAdvisory.issuer}
        Category: ${getCategoryName(currentAdvisory.category)}
        Priority: ${currentAdvisory.priority.toUpperCase()}
        
        ${currentAdvisory.summary}
        
        For full details, visit: cybercrime.gov.in
        
        ============================
        This is an official government advisory.
        Report cybercrime: 1930 | cybercrime.gov.in
    `;
    
    // Create and download file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Advisory_${currentAdvisory.id}_${currentAdvisory.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function downloadGuide(filename) {
    // Mock guide download
    const guideContent = `
        CYBERSECURITY GUIDE
        ===================
        
        ${filename.replace('.pdf', '').replace('-', ' ').toUpperCase()}
        
        This would contain the actual guide content in a real implementation.
        
        For now, this is a demo download showing how the feature would work.
        
        Visit cybercrime.gov.in for real guides and resources.
    `;
    
    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification(`${filename} downloaded successfully!`, 'success');
}

// Load More Functionality
function loadMoreAdvisories() {
    currentPage++;
    renderAdvisories();
}

// Update Advisory Count
function updateAdvisoryCount() {
    const count = filteredAdvisories.length;
    const countText = count === 1 ? '1 advisory found' : `${count} advisories found`;
    document.getElementById('advisoryCount').textContent = countText;
}

// Loading State
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#1e3a8a';
        navMenu.style.padding = '1rem';
        navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toggle.innerHTML = '<i class="fas fa-times"></i>';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 1rem; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Search Suggestions
function setupSearchSuggestions() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('focus', function() {
        // In a real app, this could show trending searches or recent searches
        showSearchSuggestions();
    });
    
    searchInput.addEventListener('blur', function() {
        // Hide suggestions after a delay to allow clicking
        setTimeout(hideSearchSuggestions, 200);
    });
}

function showSearchSuggestions() {
    // This would show a dropdown with suggestions in a real implementation
    console.log('Search suggestions would appear here');
}

function hideSearchSuggestions() {
    // Hide the suggestions dropdown
    console.log('Search suggestions would hide here');
}

// Advanced Search Features
function initializeAdvancedSearch() {
    const searchInput = document.getElementById('searchInput');
    
    // Auto-complete functionality
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length >= 2) {
            // In a real app, this would fetch suggestions from an API
            console.log(`Searching for: ${value}`);
        }
    });
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        if (document.getElementById('advisoryModal').classList.contains('active')) {
            closeModal();
        }
        if (document.getElementById('awarenessModal').classList.contains('active')) {
            closeAwarenessModal();
        }
        if (document.getElementById('shareModal').classList.contains('active')) {
            closeShareModal();
        }
    }
    
    // Ctrl+F focuses search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// Analytics and Tracking (Mock)
function trackAdvisoryView(advisoryId) {
    // In a real app, this would send analytics data
    console.log(`Advisory viewed: ${advisoryId}`);
}

function trackSearchQuery(query) {
    // In a real app, this would track search analytics
    console.log(`Search performed: ${query}`);
}

// URL Parameter Handling
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const advisoryId = urlParams.get('advisory');
    
    if (advisoryId) {
        // Auto-open specific advisory if URL parameter exists
        setTimeout(() => {
            viewAdvisory(advisoryId);
        }, 1500); // Wait for data to load
    }
}

// Real-time Updates (Mock)
function setupRealTimeUpdates() {
    // Simulate real-time advisory updates every 5 minutes
    setInterval(() => {
        // In a real app, this would check for new advisories
        updateStats();
    }, 5 * 60 * 1000);
}

function updateStats() {
    // Update sidebar stats with fresh data
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(',', ''));
        const newValue = currentValue + Math.floor(Math.random() * 5);
        stat.textContent = newValue.toLocaleString();
    });
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add ARIA labels dynamically
    document.querySelectorAll('.advisory-card').forEach((card, index) => {
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Advisory ${index + 1}`);
        card.setAttribute('tabindex', '0');
        
        // Add keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Add skip links for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    setupSearchSuggestions();
    initializeAdvancedSearch();
    handleUrlParameters();
    setupRealTimeUpdates();
    enhanceAccessibility();
});

// Add dynamic CSS for animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
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
    
    .modal-advisory-meta {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
    
    .meta-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }
    
    .meta-row:last-child {
        margin-bottom: 0;
    }
    
    .advisory-full-content {
        line-height: 1.6;
    }
    
    .advisory-full-content h4 {
        color: #1f2937;
        margin: 1.5rem 0 0.75rem 0;
        font-size: 1.1rem;
    }
    
    .advisory-full-content h5 {
        color: #374151;
        margin: 1rem 0 0.5rem 0;
        font-size: 1rem;
    }
    
    .advisory-full-content ul,
    .advisory-full-content ol {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .advisory-full-content li {
        margin-bottom: 0.25rem;
    }
    
    .advisory-engagement {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .engagement-stats {
        display: flex;
        gap: 2rem;
        font-size: 0.875rem;
        color: #6b7280;
    }
    
    .engagement-stats span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .video-placeholder,
    .infographic-placeholder {
        background: #f3f4f6;
        border-radius: 8px;
        padding: 3rem;
        text-align: center;
        margin-bottom: 2rem;
        border: 2px dashed #d1d5db;
    }
    
    .video-placeholder i,
    .infographic-placeholder i {
        font-size: 3rem;
        color: #6b7280;
        margin-bottom: 1rem;
    }
    
    .checklist {
        margin-bottom: 1.5rem;
    }
    
    .checklist-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.3s ease;
    }
    
    .checklist-item:hover {
        background: #f3f4f6;
    }
    
    .safety-note {
        background: #eff6ff;
        padding: 1rem;
        border-radius: 6px;
        border-left: 4px solid #3b82f6;
        margin-top: 1rem;
    }
    
    .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0,0,0,0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;

document.head.appendChild(dynamicStyles);

// Performance Optimization
function optimizePerformance() {
    // Lazy loading for images (if we had actual images)
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, observerOptions);
    
    // Apply to any images with data-src attributes
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Page error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Service Worker registration (for offline functionality in production)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register service worker for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}
