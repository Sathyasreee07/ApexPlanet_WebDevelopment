// Image Carousel functionality
class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.autoplayBtn = document.getElementById('autoplay-btn');
        this.counter = document.querySelector('.carousel-counter');
        
        this.currentSlide = 0;
        this.isAutoplay = true;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        // Start autoplay
        this.startAutoplay();
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        // Keyboard navigation
        this.addKeyboardSupport();
        
        // Update counter
        this.updateCounter();
    }
    
    goToSlide(slideIndex) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Update current slide index
        this.currentSlide = slideIndex;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        
        // Update counter
        this.updateCounter();
        
        // Reset autoplay timer
        if (this.isAutoplay) {
            this.resetAutoplay();
        }
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
        
        this.isAutoplay = true;
        this.autoplayBtn.textContent = '⏸️ Pause';
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        
        this.isAutoplay = false;
        this.autoplayBtn.textContent = '▶️ Play';
    }
    
    toggleAutoplay() {
        if (this.isAutoplay) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }
    
    resetAutoplay() {
        if (this.isAutoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    updateCounter() {
        this.counter.textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
    }
    
    addTouchSupport() {
        const carousel = document.querySelector('.carousel');
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only respond to horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Only respond to arrow keys when carousel is in view
            const carouselSection = document.getElementById('carousel');
            const rect = carouselSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInView) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoplay();
                }
            }
        });
    }
}

// Global functions for button clicks
function goToSlide(index) {
    if (window.carousel) {
        window.carousel.goToSlide(index);
    }
}

function nextSlide() {
    if (window.carousel) {
        window.carousel.nextSlide();
    }
}

function previousSlide() {
    if (window.carousel) {
        window.carousel.previousSlide();
    }
}

function toggleAutoplay() {
    if (window.carousel) {
        window.carousel.toggleAutoplay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.carousel = new Carousel();
});