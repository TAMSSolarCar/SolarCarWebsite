// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Gallery Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryEntries = document.querySelectorAll('.gallery-entry');

if (filterButtons.length > 0 && galleryEntries.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryEntries.forEach(entry => {
                if (filterValue === 'all' || entry.getAttribute('data-category') === filterValue) {
                    entry.style.display = 'block';
                    setTimeout(() => {
                        entry.style.opacity = '1';
                        entry.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    entry.style.opacity = '0';
                    entry.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        entry.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.activity-card, .team-member, .gallery-entry, .sponsor-logo, .benefit-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Team Member Modal Functionality
const teamModal = document.getElementById('teamModal');
const clickablePhotos = document.querySelectorAll('.clickable-photo');
const modalPhoto = document.getElementById('modalPhoto');
const modalName = document.getElementById('modalName');
const modalRole = document.getElementById('modalRole');
const modalBio = document.getElementById('modalBio');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

if (teamModal && clickablePhotos.length > 0) {
    // Open modal when clicking on a team member photo
    clickablePhotos.forEach(photo => {
        photo.addEventListener('click', () => {
            const name = photo.getAttribute('data-member-name');
            const role = photo.getAttribute('data-member-role');
            const bio = photo.getAttribute('data-member-bio');
            const imageSrc = photo.getAttribute('data-member-image');
            
            // Set modal content
            modalPhoto.src = imageSrc;
            modalPhoto.alt = name;
            modalName.textContent = name;
            modalRole.textContent = role;
            modalBio.textContent = bio;
            
            // Show modal
            teamModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });
    
    // Close modal functions
    const closeModal = () => {
        teamModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    };
    
    // Close on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && teamModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Prevent modal content click from closing modal
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

