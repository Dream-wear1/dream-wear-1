// Simple Visitor Counter for Local Testing
// This tracks visitors in localStorage (browser-based)

// Initialize visitor counter
function initVisitorCounter() {
    // Get current visitor count
    let visitorCount = localStorage.getItem('visitorCount') || 0;
    let lastVisit = localStorage.getItem('lastVisit');
    let today = new Date().toDateString();
    
    // Check if this is a new visitor (different day or first time)
    if (lastVisit !== today) {
        visitorCount = parseInt(visitorCount) + 1;
        localStorage.setItem('visitorCount', visitorCount);
        localStorage.setItem('lastVisit', today);
        
        // Track this visit
        trackVisit();
    }
    
    // Display visitor count (optional)
    console.log(`Total visitors: ${visitorCount}`);
    
    return visitorCount;
}

// Track individual visit details
function trackVisit() {
    const visit = {
        date: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        timestamp: Date.now()
    };
    
    // Get existing visits
    let visits = JSON.parse(localStorage.getItem('siteVisits') || '[]');
    visits.push(visit);
    
    // Keep only last 100 visits to avoid storage issues
    if (visits.length > 100) {
        visits = visits.slice(-100);
    }
    
    localStorage.setItem('siteVisits', JSON.stringify(visits));
    
    // Log for debugging
    console.log('New visit tracked:', visit);
}

// Get visitor statistics
function getVisitorStats() {
    const visitorCount = localStorage.getItem('visitorCount') || 0;
    const visits = JSON.parse(localStorage.getItem('siteVisits') || '[]');
    
    // Calculate stats
    const today = new Date().toDateString();
    const todayVisits = visits.filter(visit => 
        new Date(visit.date).toDateString() === today
    ).length;
    
    const thisWeek = visits.filter(visit => {
        const visitDate = new Date(visit.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return visitDate > weekAgo;
    }).length;
    
    return {
        totalVisitors: parseInt(visitorCount),
        totalVisits: visits.length,
        todayVisits: todayVisits,
        thisWeekVisits: thisWeek,
        lastVisit: visits.length > 0 ? visits[visits.length - 1].date : null
    };
}

// Display stats in console (for debugging)
function showVisitorStats() {
    const stats = getVisitorStats();
    console.log('📊 Visitor Statistics:');
    console.log(`Total Visitors: ${stats.totalVisitors}`);
    console.log(`Total Visits: ${stats.totalVisits}`);
    console.log(`Today's Visits: ${stats.todayVisits}`);
    console.log(`This Week's Visits: ${stats.thisWeekVisits}`);
    if (stats.lastVisit) {
        console.log(`Last Visit: ${new Date(stats.lastVisit).toLocaleString()}`);
    }
}

// Track e-commerce events
function trackEcommerceEvent(eventType, data = {}) {
    const event = {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    // Get existing events
    let events = JSON.parse(localStorage.getItem('ecommerceEvents') || '[]');
    events.push(event);
    
    // Keep only last 200 events
    if (events.length > 200) {
        events = events.slice(-200);
    }
    
    localStorage.setItem('ecommerceEvents', JSON.stringify(events));
    
    console.log(`📈 E-commerce Event: ${eventType}`, data);
}

// Initialize counter when page loads
document.addEventListener('DOMContentLoaded', function() {
    initVisitorCounter();
    
    // Show stats in console for debugging
    setTimeout(() => {
        showVisitorStats();
    }, 1000);
});

// Export functions for use in other parts of the site
window.trackEcommerceEvent = trackEcommerceEvent;
window.getVisitorStats = getVisitorStats;
window.showVisitorStats = showVisitorStats;
