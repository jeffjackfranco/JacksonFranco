// Main JavaScript file for the portfolio website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Initialize the office POV system
    initializeOfficePOV();
    
    // Add smooth scrolling for navigation links (if needed)
    addSmoothScrolling();
    
    // Initialize navbar behavior
    initializeNavbar();
    
    // Add project tile interactions
    initializeProjectTiles();
}

function addSmoothScrolling() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeNavbar() {
    // Change navbar appearance on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Highlight active navigation item
    window.addEventListener('scroll', highlightActiveNavItem);
}

function highlightActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initializeScrollAnimations() {
    // Create intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.project-card, .contact-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Demo loading functionality
function loadDemo(demoType) {
    const demoContainer = document.getElementById('demo-container');
    const demoTitle = document.getElementById('demo-title');
    const demoContent = document.getElementById('demo-content');
    
    // Hide main sections
    document.querySelector('body').style.overflow = 'hidden';
    demoContainer.classList.remove('d-none');
    
    // Set title and load appropriate demo
    switch(demoType) {
        case 'faiss':
            demoTitle.textContent = 'FAISS Document Similarity Demo';
            loadFaissDemo();
            break;
        case 'qa':
            demoTitle.textContent = 'Quality Assurance Analytics Demo';
            loadQADemo();
            break;
        case 'stock':
            demoTitle.textContent = 'Stock Trading Bot Demo';
            loadStockDemo();
            break;
        case 'thesis':
            demoTitle.textContent = 'Thesis Discussion Platform Demo';
            loadThesisDemo();
            break;
        default:
            demoContent.innerHTML = '<div class="container"><div class="alert alert-warning">Demo not found.</div></div>';
    }
    
    // Scroll to top of demo
    demoContainer.scrollTop = 0;
}

function closeDemo() {
    const demoContainer = document.getElementById('demo-container');
    
    // Show main sections
    document.querySelector('body').style.overflow = 'auto';
    demoContainer.classList.add('d-none');
    
    // Clear demo content
    document.getElementById('demo-content').innerHTML = '';
}

// Utility functions
function showLoading(message = 'Loading...') {
    return `
        <div class="d-flex justify-content-center align-items-center py-5">
            <div class="text-center">
                <div class="loading-spinner"></div>
                <p class="mt-3 text-muted">${message}</p>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Performance monitoring
window.addEventListener('load', function() {
    console.log('Office POV Portfolio loaded successfully');
});

// Office POV System
function initializeOfficePOV() {
    const officeEnvironment = document.getElementById('office-environment');
    const monitors = document.querySelectorAll('.monitor');
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Mouse movement for POV control and dynamic monitor tilting
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        targetX = mouseX * 20; // Max rotation in degrees
        targetY = mouseY * 15;
        
        // Update monitor tilts based on mouse position
        updateMonitorTilts(e.clientX, e.clientY);
    });
    
    // Dynamic monitor tilting based on mouse position
    function updateMonitorTilts(mouseClientX, mouseClientY) {
        monitors.forEach(monitor => {
            const rect = monitor.getBoundingClientRect();
            const monitorCenterX = rect.left + rect.width / 2;
            const monitorCenterY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to monitor center
            const distanceX = Math.abs(mouseClientX - monitorCenterX);
            const distanceY = Math.abs(mouseClientY - monitorCenterY);
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // Define max distance for full effect (adjust as needed)
            const maxDistance = 400;
            const normalizedDistance = Math.min(distance / maxDistance, 1);
            
            // Calculate tilt based on distance and monitor type
            let baseTilt = 0;
            let translateX = 0;
            
            if (monitor.classList.contains('monitor-left')) {
                baseTilt = 45 * normalizedDistance; // Max 45° when far, 0° when close
                translateX = -30 * normalizedDistance; // Reduce translation when close  
            } else if (monitor.classList.contains('monitor-right')) {
                baseTilt = -45 * normalizedDistance; // Max -45° when far, 0° when close
                translateX = 30 * normalizedDistance; // Reduce translation when close
            } else {
                baseTilt = 0; // Center monitor always faces forward
                translateX = 0;
            }
            
            // Apply the dynamic transform
            const rotateX = -5 + (2 * (1 - normalizedDistance)); // Slight adjustment for clarity
            const scale = monitor.matches(':hover') ? 1.05 : 1;
            
            monitor.style.transform = `rotateY(${baseTilt}deg) rotateX(${rotateX}deg) translateX(${translateX}px) scale(${scale})`;
        });
    }
    
    // Smooth camera movement
    function updatePOV() {
        const currentX = parseFloat(officeEnvironment.style.transform?.match(/rotateY\(([^)]+)deg\)/)?.[1] || 0);
        const currentY = parseFloat(officeEnvironment.style.transform?.match(/rotateX\(([^)]+)deg\)/)?.[1] || 0);
        
        const newX = currentX + (targetX - currentX) * 0.05;
        const newY = currentY + (targetY - currentY) * 0.05;
        
        officeEnvironment.style.transform = `rotateY(${newX}deg) rotateX(${-newY}deg)`;
        
        requestAnimationFrame(updatePOV);
    }
    
    updatePOV();
    
    // Monitor hover effects (simplified - main positioning handled by dynamic tilting)
    document.querySelectorAll('.monitor').forEach(monitor => {
        monitor.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(102, 126, 234, 0.4))';
        });
        
        monitor.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
}

// Project Tile Interactions
function initializeProjectTiles() {
    const projectTiles = document.querySelectorAll('.project-tile');
    
    projectTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const demoType = this.getAttribute('data-demo');
            if (demoType) {
                loadDemo(demoType);
            }
        });
        
        // 3D hover effect for tiles
        tile.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            this.style.transform = `translateZ(10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// Enhanced Demo Loading with Office Theme
function loadDemo(demoType) {
    const demoContainer = document.getElementById('demo-container');
    const demoTitle = document.getElementById('demo-title');
    
    // Add office-themed styling to demo container
    demoContainer.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    demoContainer.style.backdropFilter = 'blur(10px)';
    
    // Hide office environment
    document.getElementById('office-environment').style.opacity = '0.1';
    document.querySelector('body').style.overflow = 'hidden';
    demoContainer.classList.remove('d-none');
    
    // Set title and load appropriate demo
    switch(demoType) {
        case 'faiss':
            demoTitle.textContent = 'FAISS Document Similarity Demo';
            loadFaissDemo();
            break;
        case 'qa':
            demoTitle.textContent = 'Quality Assurance Analytics Demo';
            loadQADemo();
            break;
        case 'stock':
            demoTitle.textContent = 'Stock Trading Bot Demo';
            loadStockDemo();
            break;
        case 'thesis':
            demoTitle.textContent = 'Thesis Discussion Platform Demo';
            loadThesisDemo();
            break;
        default:
            document.getElementById('demo-content').innerHTML = '<div class="container"><div class="alert alert-warning">Demo not found.</div></div>';
    }
    
    // Scroll to top of demo
    demoContainer.scrollTop = 0;
}

// Enhanced Demo Closing
function closeDemo() {
    const demoContainer = document.getElementById('demo-container');
    
    // Show office environment
    document.getElementById('office-environment').style.opacity = '1';
    document.querySelector('body').style.overflow = 'hidden'; // Keep overflow hidden for office POV
    demoContainer.classList.add('d-none');
    
    // Clear demo content
    document.getElementById('demo-content').innerHTML = '';
}

// Navigation Functions for Office POV
function focusOnIntro() {
    const officeEnvironment = document.getElementById('office-environment');
    officeEnvironment.style.transition = 'transform 1s ease-out';
    officeEnvironment.style.transform = 'rotateY(0deg) rotateX(0deg)';
    
    // Reset transition after animation
    setTimeout(() => {
        officeEnvironment.style.transition = 'transform 0.1s ease-out';
    }, 1000);
}

function focusOnMonitor(monitorType) {
    const monitor = document.querySelector(`.monitor-${monitorType}`);
    const officeEnvironment = document.getElementById('office-environment');
    
    if (!monitor) return;
    
    let targetRotateY = 0;
    let targetRotateX = 0;
    
    // Calculate rotation based on monitor position in triple setup
    switch(monitorType) {
        case 'about':
            targetRotateY = 45;  // Look left for dramatically angled left monitor
            targetRotateX = -8;
            break;
        case 'projects':
            targetRotateY = 0;   // Look center
            targetRotateX = -5;
            break;
        case 'contact':
            targetRotateY = -45; // Look right for dramatically angled right monitor
            targetRotateX = -8;
            break;
    }
    
    officeEnvironment.style.transition = 'transform 1.5s ease-out';
    officeEnvironment.style.transform = `rotateY(${targetRotateY}deg) rotateX(${targetRotateX}deg)`;
    
    // Highlight the monitor (positioning handled by dynamic tilting)
    monitor.style.transition = 'all 0.5s ease';
    monitor.style.filter = 'brightness(1.4) drop-shadow(0 0 30px rgba(102, 126, 234, 0.8))';
    
    // Reset highlight after a moment
    setTimeout(() => {
        monitor.style.filter = 'brightness(1)';
    }, 2000);
    
    // Reset transition after animation
    setTimeout(() => {
        officeEnvironment.style.transition = 'transform 0.1s ease-out';
    }, 1500);
}

// 3D Mouse Interaction Effects
function initialize3DEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    const contactItems = document.querySelectorAll('.contact-item');
    
    // Add mouse move effect to project cards
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translateY(-15px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
    
    // Add mouse move effect to contact items
    contactItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            item.style.transform = `
                translateY(-10px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.05)
            `;
        });
        
        item.addEventListener('mouseleave', function() {
            item.style.transform = '';
        });
    });
}

// Parallax Scrolling Effects
function initializeParallax() {
    const heroSection = document.getElementById('home');
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = scrolled * 0.5;
        
        // Hero section parallax
        if (heroSection) {
            heroSection.style.transform = `translateY(${parallaxSpeed}px)`;
        }
        
        // Floating shapes parallax with different speeds
        floatingShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            const xPos = Math.sin(scrolled * 0.001 + index) * 20;
            
            shape.style.transform = `
                translateY(${yPos}px) 
                translateX(${xPos}px) 
                rotate(${scrolled * 0.1 + index * 45}deg)
            `;
        });
    });
}

// Dynamic Background Effects
function initializeDynamicBackground() {
    const heroSection = document.querySelector('.hero-section');
    
    // Add mouse move effect to hero background
    heroSection.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;
        
        heroSection.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    });
    
    // Add cursor trail effect
    addCursorTrail();
}

// Cursor Trail Effect
function addCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${6 - i * 0.2}px;
            height: ${6 - i * 0.2}px;
            background: radial-gradient(circle, rgba(102, 126, 234, ${1 - i * 0.05}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate trail
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.style.left = x - 3 + 'px';
            dot.style.top = y - 3 + 'px';
            
            x += (nextDot.offsetLeft - x) * 0.3;
            y += (nextDot.offsetTop - y) * 0.3;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Add some demo loading functions that will be implemented in separate files
function loadFaissDemo() {
    // This will be implemented in faiss-demo.js
    if (typeof initializeFaissDemo === 'function') {
        initializeFaissDemo();
    } else {
        document.getElementById('demo-content').innerHTML = `
            <div class="container">
                <div class="alert alert-info">
                    <h5>FAISS Demo Loading...</h5>
                    <p>Please wait while the demo initializes.</p>
                </div>
            </div>
        `;
    }
}

function loadQADemo() {
    // This will be implemented in qa-demo.js
    if (typeof initializeQADemo === 'function') {
        initializeQADemo();
    } else {
        document.getElementById('demo-content').innerHTML = `
            <div class="container">
                <div class="alert alert-info">
                    <h5>QA Demo Loading...</h5>
                    <p>Please wait while the demo initializes.</p>
                </div>
            </div>
        `;
    }
}

function loadStockDemo() {
    // This will be implemented in stock-demo.js
    if (typeof initializeStockDemo === 'function') {
        initializeStockDemo();
    } else {
        document.getElementById('demo-content').innerHTML = `
            <div class="container">
                <div class="alert alert-info">
                    <h5>Stock Demo Loading...</h5>
                    <p>Please wait while the demo initializes.</p>
                </div>
            </div>
        `;
    }
}

function loadThesisDemo() {
    // This will be implemented in thesis-demo.js
    if (typeof initializeThesisDemo === 'function') {
        initializeThesisDemo();
    } else {
        document.getElementById('demo-content').innerHTML = `
            <div class="container">
                <div class="alert alert-info">
                    <h5>Thesis Demo Loading...</h5>
                    <p>Please wait while the demo initializes.</p>
                </div>
            </div>
        `;
    }
} 