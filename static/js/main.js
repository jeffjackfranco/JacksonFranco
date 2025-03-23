// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap components if needed
    initializeTooltips();
    
    // Smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Add active class to current navigation link
    highlightCurrentNavLink();
});

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add active class to current navigation link
function highlightCurrentNavLink() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip hash links
        if (href.startsWith('#')) return;
        
        // Check if link matches current path
        if ((href === '/' && currentPath === '/') || 
            (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        }
    });
} 