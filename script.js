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
const galleryEmptyState = document.querySelector('.gallery-empty-state');

if (filterButtons.length > 0 && galleryEntries.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const matchCount = Array.from(galleryEntries).filter(entry => {
                return filterValue === 'all' || entry.getAttribute('data-category') === filterValue;
            }).length;

            if (galleryEmptyState) {
                galleryEmptyState.classList.toggle('show', matchCount === 0);
            }

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

// Cycle gallery card images when a gallery entry provides a data-images list
const initGallerySlideshows = () => {
    const entries = document.querySelectorAll('.gallery-entry[data-images]');

    entries.forEach(entry => {
        const imagePaths = (entry.getAttribute('data-images') || '')
            .split('|')
            .map(path => path.trim())
            .filter(Boolean);

        if (imagePaths.length <= 1) {
            return;
        }

        const imageEl = entry.querySelector('.gallery-image img');
        if (!imageEl) {
            return;
        }

        const imageWrapper = imageEl.parentElement;
        if (!imageWrapper) {
            return;
        }

        // Preload each image once so rotations don't flash while waiting on network/disk.
        imagePaths.forEach(path => {
            const preload = new Image();
            preload.src = path;
        });

        imageEl.classList.add('gallery-slide', 'is-active');

        const secondaryImage = imageEl.cloneNode(true);
        secondaryImage.classList.remove('is-active');
        secondaryImage.classList.add('gallery-slide');
        imageWrapper.appendChild(secondaryImage);

        let currentIndex = 0;
        let activeImage = imageEl;
        let inactiveImage = secondaryImage;
        const intervalMs = 2800;
        const transitionMs = 450;
        let isTransitioning = false;

        setInterval(() => {
            if (isTransitioning) {
                return;
            }

            const nextIndex = (currentIndex + 1) % imagePaths.length;
            const nextSrc = imagePaths[nextIndex];
            const preloader = new Image();

            isTransitioning = true;
            preloader.onload = () => {
                inactiveImage.src = nextSrc;
                inactiveImage.alt = activeImage.alt;

                requestAnimationFrame(() => {
                    inactiveImage.classList.add('is-active');
                    activeImage.classList.remove('is-active');

                    setTimeout(() => {
                        const previousActive = activeImage;
                        activeImage = inactiveImage;
                        inactiveImage = previousActive;
                        currentIndex = nextIndex;
                        isTransitioning = false;
                    }, transitionMs);
                });
            };

            preloader.onerror = () => {
                isTransitioning = false;
            };

            preloader.src = nextSrc;
        }, intervalMs);
    });
};

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const loadReveal = document.querySelectorAll('.reveal-on-load');
    const scrollReveal = document.querySelectorAll('.reveal-on-scroll');
    const animatedElements = document.querySelectorAll('.activity-card, .team-member, .gallery-entry, .sponsor-logo, .benefit-item');

    loadReveal.forEach(el => {
        requestAnimationFrame(() => {
            el.classList.add('is-visible');
        });
    });

    scrollReveal.forEach(el => {
        observer.observe(el);
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    initGallerySlideshows();
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

