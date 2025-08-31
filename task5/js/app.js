// Main Application Controller

class App {
  constructor() {
    this.isInitialized = false;
    this.performanceMetrics = {
      loadStart: performance.now ? performance.now() : Date.now(),
      loadEnd: null,
      resourcesLoaded: 0,
      totalResources: 0
    };
    
    this.init();
  }

  async init() {
    try {
      // Show loading spinner
      this.showLoadingSpinner();
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize core systems
      await this.initializeCore();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Initialize performance monitoring
      this.initializePerformanceMonitoring();
      
      // Hide loading spinner
      this.hideLoadingSpinner();
      
      this.isInitialized = true;
      
      // Track load performance
      this.performanceMetrics.loadEnd = performance.now ? performance.now() : Date.now();
      const loadTime = this.performanceMetrics.loadEnd - this.performanceMetrics.loadStart;
      console.log(`App initialized in ${loadTime.toFixed(2)}ms`);
      
    } catch (error) {
      console.error('App initialization failed:', error);
      this.handleInitError(error);
    }
  }

  async initializeCore() {
    // Ensure managers are initialized
    const maxRetries = 5;
    let retries = 0;
    
    while ((!window.productManager || !window.cartManager || !window.authManager) && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }
    
    if (!window.productManager || !window.cartManager || !window.authManager) {
      throw new Error('Failed to initialize core managers');
    }

    // Initial product render
    window.productManager.renderProducts();
  }

  setupGlobalEventListeners() {
    // Modal close handlers
    this.setupModalHandlers();
    
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Window resize handler (throttled for performance)
    const throttledResize = Utils.throttle(() => {
      this.handleWindowResize();
    }, 250);
    
    window.addEventListener('resize', throttledResize);
    
    // Scroll handlers for performance optimization
    const throttledScroll = Utils.throttle(() => {
      this.handleScroll();
    }, 100);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Page visibility API for performance
    if (document.visibilityState !== undefined) {
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });
    }

    // Network status monitoring
    if ('navigator' in window && 'onLine' in navigator) {
      window.addEventListener('online', () => {
        Utils.showToast('Connection Restored', 'You are back online', 'success');
      });
      
      window.addEventListener('offline', () => {
        Utils.showToast('Connection Lost', 'You are currently offline', 'warning');
      });
    }
  }

  setupModalHandlers() {
    // Product modal
    document.getElementById('close-modal').addEventListener('click', () => {
      document.getElementById('product-modal').classList.remove('active');
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
          modal.classList.remove('active');
        }
      });
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key closes modals
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
          modal.classList.remove('active');
        });
        
        // Close cart sidebar
        document.getElementById('cart-sidebar').classList.remove('active');
      }
      
      // Enter key on search
      if (e.key === 'Enter' && e.target.id === 'search-input') {
        e.preventDefault();
        window.productManager.filterProducts();
      }
    });
  }

  handleWindowResize() {
    // Optimize layout on resize
    const grid = document.getElementById('products-grid');
    if (grid) {
      // Trigger reflow optimization
      grid.style.display = 'none';
      grid.offsetHeight; // Trigger reflow
      grid.style.display = '';
    }
  }

  handleScroll() {
    // Add/remove header shadow based on scroll position
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause expensive operations
      this.pauseExpensiveOperations();
    } else {
      // Page is visible, resume operations
      this.resumeExpensiveOperations();
    }
  }

  pauseExpensiveOperations() {
    // Stop animations, timers, etc.
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.animationPlayState = 'paused';
    });
  }

  resumeExpensiveOperations() {
    // Resume animations
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.animationPlayState = 'running';
    });
  }

  showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
  }

  hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    setTimeout(() => {
      spinner.classList.add('hidden');
    }, 500);
  }

  handleInitError(error) {
    this.hideLoadingSpinner();
    
    const appDiv = document.getElementById('app');
    if (appDiv) {
      appDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #ef4444;">
          <h2>App Failed to Load</h2>
          <p>Please refresh the page and try again.</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }

  initializePerformanceMonitoring() {
    // Monitor Critical Web Vitals if supported
    if ('web-vital' in window) {
      // This would use the web-vitals library if available
      // For now, we'll use basic performance monitoring
    }

    // Monitor resource loading
    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.performanceMetrics.resourcesLoaded++;
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Performance monitoring not available:', e);
      }
    }

    // Monitor largest contentful paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently fail for unsupported browsers
      }
    }
  }

  // Optimize images based on device capabilities
  optimizeImagesForDevice() {
    const images = document.querySelectorAll('img[data-src]');
    const devicePixelRatio = window.devicePixelRatio || 1;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    images.forEach(img => {
      let width = 400;
      
      // Adjust image size based on device pixel ratio and connection
      if (devicePixelRatio > 1) {
        width = Math.floor(width * devicePixelRatio);
      }
      
      // Reduce quality on slow connections
      if (connection && connection.effectiveType === 'slow-2g') {
        width = Math.floor(width * 0.7);
      }
      
      const optimizedUrl = Utils.getOptimizedImageUrl(img.dataset.src, width);
      Utils.lazyLoadImage(img, optimizedUrl);
    });
  }

  // Browser compatibility checks
  checkBrowserCompatibility() {
    const capabilities = Utils.getBrowserCapabilities();
    const warnings = [];

    if (!capabilities.localStorage) {
      warnings.push('Local storage not supported - cart data will not persist');
    }

    if (!capabilities.fetch) {
      warnings.push('Fetch API not supported - using fallback for network requests');
    }

    if (!capabilities.intersectionObserver) {
      warnings.push('Intersection Observer not supported - using fallback for lazy loading');
    }

    if (warnings.length > 0) {
      console.warn('Browser compatibility warnings:', warnings);
    }

    return capabilities;
  }

  // Service Worker registration for caching (if available)
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        // Note: Service worker file would need to be created separately
        // This is just the registration logic
        console.log('Service Worker support detected');
        // const registration = await navigator.serviceWorker.register('/sw.js');
        // console.log('Service Worker registered successfully');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }
  }

  // Analytics tracking (simulation)
  trackEvent(eventName, eventData = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      user: window.authManager?.getCurrentUser()?.id || 'anonymous',
      ...eventData
    };
    
    // In a real app, this would send to analytics service
    console.log('Analytics Event:', event);
  }

  // Error handling and reporting
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', e.error);
      this.trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
      this.trackEvent('promise_rejection', {
        reason: e.reason
      });
    });
  }

  // App state management
  getAppState() {
    return {
      isInitialized: this.isInitialized,
      currentUser: window.authManager?.getCurrentUser(),
      cartItems: window.cartManager?.items || [],
      performanceMetrics: this.performanceMetrics
    };
  }
}

// CSS for additional animations and no-products state
const additionalCSS = `
.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-16);
  color: var(--gray-500);
}

.no-products h3 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.logged-in {
  background: var(--accent-50) !important;
  color: var(--accent-600) !important;
  border-color: var(--accent-600) !important;
}

.logged-in:hover {
  background: var(--accent-600) !important;
  color: white !important;
}

/* Loading states for better UX */
.btn.loading {
  opacity: 0.7;
  pointer-events: none;
}

.btn.loading::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: var(--space-2);
}

/* Improved focus management */
.modal.active .modal-content {
  outline: none;
}

.modal.active .modal-content:focus-within {
  box-shadow: 0 0 0 4px rgb(59 130 246 / 0.1);
}

/* Better loading placeholders */
.loading-placeholder {
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 2s infinite;
}

@keyframes loading-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Inject additional CSS
const additionalStyle = document.createElement('style');
additionalStyle.textContent = additionalCSS;
document.head.appendChild(additionalStyle);

// Initialize app when script loads
let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new App();
  });
} else {
  app = new App();
}

// Global error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  Utils.showToast('Error', 'Something went wrong. Please try refreshing the page.', 'error');
});

// Expose app instance globally for debugging
window.app = app;

// Optimize for older browsers
if (!Array.prototype.find) {
  Array.prototype.find = function(callback) {
    for (let i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement) {
    return this.indexOf(searchElement) !== -1;
  };
}

// Performance optimization: Preload critical resources
document.addEventListener('DOMContentLoaded', () => {
  // Preload first few product images
  const criticalImages = [
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
    'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = Utils.getOptimizedImageUrl(src, 400);
    document.head.appendChild(link);
  });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, Utils };
}