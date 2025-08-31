// Utility Functions for Performance and Cross-browser Compatibility

class Utils {
  // Debounce function for search optimization
  static debounce(func, wait) {
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

  // Throttle function for scroll events
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Format currency with proper locale support
  static formatCurrency(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (e) {
      // Fallback for older browsers
      return `$${amount.toFixed(2)}`;
    }
  }

  // Sanitize HTML to prevent XSS
  static sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  // Generate unique IDs
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Check if element is in viewport (for lazy loading)
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Lazy load images with intersection observer fallback
  static lazyLoadImage(img, src) {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = src;
            lazyImage.classList.add('loaded');
            observer.unobserve(lazyImage);
          }
        });
      });
      imageObserver.observe(img);
    } else {
      // Fallback for older browsers
      img.src = src;
      img.classList.add('loaded');
    }
  }

  // Local Storage with error handling
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Local storage not available:', e);
      return false;
    }
  }

  static getLocalStorage(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn('Error reading from local storage:', e);
      return null;
    }
  }

  // Animation frame optimization
  static requestAnimationFrame(callback) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(callback);
    } else {
      // Fallback for older browsers
      return setTimeout(callback, 16);
    }
  }

  // Cross-browser event handling
  static addEventListener(element, event, handler) {
    if (element.addEventListener) {
      element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
      // IE8 and below
      element.attachEvent('on' + event, handler);
    }
  }

  // Show toast notification
  static showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
      <div class="toast-title">${Utils.sanitizeHTML(title)}</div>
      <div class="toast-message">${Utils.sanitizeHTML(message)}</div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'toastSlideOut 0.3s ease-out';
        setTimeout(() => {
          container.removeChild(toast);
        }, 300);
      }
    }, 5000);
  }

  // Smooth scroll to element
  static scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      if (window.requestAnimationFrame && element.scrollIntoView) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback for older browsers
        const targetPosition = element.offsetTop - 100;
        window.scrollTo(0, targetPosition);
      }
    }
  }

  // Performance monitoring
  static measurePerformance(name, fn) {
    const start = performance.now ? performance.now() : Date.now();
    const result = fn();
    const end = performance.now ? performance.now() : Date.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Format rating stars
  static formatStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    if (hasHalfStar) {
      stars += '☆';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }
    
    return stars;
  }

  // Optimize images for different screen sizes
  static getOptimizedImageUrl(baseUrl, width = 400) {
    // For Pexels images, we can add size parameters
    if (baseUrl.includes('pexels.com')) {
      return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}`;
    }
    return baseUrl;
  }

  // Check browser capabilities
  static getBrowserCapabilities() {
    return {
      localStorage: typeof Storage !== 'undefined',
      intersectionObserver: 'IntersectionObserver' in window,
      requestAnimationFrame: 'requestAnimationFrame' in window,
      fetch: 'fetch' in window,
      promise: 'Promise' in window,
      es6: typeof Symbol !== 'undefined'
    };
  }
}

// CSS Animation Keyframes (added dynamically for better performance)
const cssAnimations = `
@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// Inject animations into the page
const style = document.createElement('style');
style.textContent = cssAnimations;
document.head.appendChild(style);

// Global scroll to products function
window.scrollToProducts = function() {
  Utils.scrollToElement('products');
};