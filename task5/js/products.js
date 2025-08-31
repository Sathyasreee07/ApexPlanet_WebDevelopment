// Product Data and Management

class ProductManager {
  constructor() {
    this.products = [];
    this.currentPage = 1;
    this.productsPerPage = 12;
    this.filteredProducts = [];
    this.isLoading = false;
    
    this.initializeProducts();
    this.setupEventListeners();
  }

  initializeProducts() {
    // Sample product data with Pexels images for performance
    this.products = [
      {
        id: 1,
        name: "iPhone 14 Pro",
        description: "Latest iPhone with A16 Bionic chip, Pro camera system, and Dynamic Island.",
        price: 999,
        category: "smartphones",
        rating: 4.8,
        image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
        badge: "New"
      },
      {
        id: 2,
        name: "MacBook Pro 14\"",
        description: "Powerful laptop with M2 Pro chip, stunning Liquid Retina XDR display.",
        price: 1999,
        category: "laptops",
        rating: 4.9,
        image: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg",
        badge: "Popular"
      },
      {
        id: 3,
        name: "AirPods Pro",
        description: "Premium wireless earbuds with active noise cancellation and spatial audio.",
        price: 249,
        category: "headphones",
        rating: 4.7,
        image: "https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg",
        badge: ""
      },
      {
        id: 4,
        name: "iPad Air",
        description: "Versatile tablet with M1 chip, perfect for creativity and productivity.",
        price: 599,
        category: "accessories",
        rating: 4.6,
        image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg",
        badge: ""
      },
      {
        id: 5,
        name: "Samsung Galaxy S23",
        description: "Android flagship with exceptional camera and performance capabilities.",
        price: 899,
        category: "smartphones",
        rating: 4.5,
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg",
        badge: ""
      },
      {
        id: 6,
        name: "Dell XPS 13",
        description: "Ultra-portable laptop with stunning InfinityEdge display and premium build.",
        price: 1299,
        category: "laptops",
        rating: 4.4,
        image: "https://images.pexels.com/photos/238118/pexels-photo-238118.jpeg",
        badge: ""
      },
      {
        id: 7,
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling headphones with exceptional sound quality.",
        price: 399,
        category: "headphones",
        rating: 4.8,
        image: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
        badge: "Bestseller"
      },
      {
        id: 8,
        name: "Apple Watch Series 8",
        description: "Advanced health monitoring, fitness tracking, and seamless connectivity.",
        price: 399,
        category: "accessories",
        rating: 4.6,
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        badge: ""
      },
      {
        id: 9,
        name: "Google Pixel 7",
        description: "Pure Android experience with computational photography excellence.",
        price: 699,
        category: "smartphones",
        rating: 4.4,
        image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
        badge: ""
      },
      {
        id: 10,
        name: "Surface Laptop 5",
        description: "Elegant Windows laptop with premium materials and all-day battery life.",
        price: 1499,
        category: "laptops",
        rating: 4.3,
        image: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg",
        badge: ""
      },
      {
        id: 11,
        name: "Bose QuietComfort 45",
        description: "Premium comfort meets world-class noise cancellation technology.",
        price: 329,
        category: "headphones",
        rating: 4.5,
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
        badge: ""
      },
      {
        id: 12,
        name: "Magic Keyboard",
        description: "Wireless keyboard with precise typing experience and long battery life.",
        price: 179,
        category: "accessories",
        rating: 4.2,
        image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
        badge: ""
      }
    ];

    this.filteredProducts = [...this.products];
  }

  setupEventListeners() {
    // Search functionality with debouncing
    const searchInput = document.getElementById('search-input');
    const debouncedSearch = Utils.debounce((value) => {
      this.filterProducts();
    }, 300);

    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });

    // Filter controls
    document.getElementById('category-filter').addEventListener('change', () => {
      this.filterProducts();
    });

    document.getElementById('price-filter').addEventListener('change', () => {
      this.filterProducts();
    });

    document.getElementById('sort-filter').addEventListener('change', () => {
      this.filterProducts();
    });

    // Load more button
    document.getElementById('load-more-btn').addEventListener('click', () => {
      this.loadMoreProducts();
    });
  }

  filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;

    // Filter products
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                          product.description.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      let matchesPrice = true;
      if (priceFilter) {
        if (priceFilter === '0-100') {
          matchesPrice = product.price <= 100;
        } else if (priceFilter === '100-500') {
          matchesPrice = product.price > 100 && product.price <= 500;
        } else if (priceFilter === '500-1000') {
          matchesPrice = product.price > 500 && product.price <= 1000;
        } else if (priceFilter === '1000+') {
          matchesPrice = product.price > 1000;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    this.sortProducts(sortFilter);

    // Reset pagination
    this.currentPage = 1;
    this.renderProducts();
  }

  sortProducts(sortBy) {
    switch (sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }

  renderProducts() {
    const grid = document.getElementById('products-grid');
    const productsToShow = this.filteredProducts.slice(0, this.currentPage * this.productsPerPage);
    
    grid.innerHTML = '';

    if (productsToShow.length === 0) {
      grid.innerHTML = `
        <div class="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    Utils.requestAnimationFrame(() => {
      productsToShow.forEach((product, index) => {
        const productCard = this.createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(productCard);
      });

      // Update load more button visibility
      const loadMoreContainer = document.getElementById('load-more-container');
      const hasMoreProducts = productsToShow.length < this.filteredProducts.length;
      loadMoreContainer.classList.toggle('hidden', !hasMoreProducts);
    });
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animation = 'slideInUp 0.6s ease-out both';
    
    const optimizedImageUrl = Utils.getOptimizedImageUrl(product.image, 400);
    
    card.innerHTML = `
      <div class="product-image">
        <img class="lazy-image" data-src="${optimizedImageUrl}" alt="${Utils.sanitizeHTML(product.name)}" loading="lazy">
        ${product.badge ? `<div class="product-badge">${Utils.sanitizeHTML(product.badge)}</div>` : ''}
      </div>
      <div class="product-info">
        <h3 class="product-title">${Utils.sanitizeHTML(product.name)}</h3>
        <p class="product-description">${Utils.sanitizeHTML(product.description)}</p>
        <div class="product-rating">
          <span class="stars">${Utils.formatStars(product.rating)}</span>
          <span class="rating-text">(${product.rating}/5)</span>
        </div>
        <div class="product-footer">
          <div class="product-price">${Utils.formatCurrency(product.price)}</div>
          <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;

    // Lazy load image
    const img = card.querySelector('.lazy-image');
    Utils.lazyLoadImage(img, optimizedImageUrl);

    // Add click handler for product details
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-to-cart')) {
        this.showProductDetail(product);
      }
    });

    // Add to cart handler
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.cartManager.addToCart(product);
    });

    return card;
  }

  loadMoreProducts() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.currentPage++;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      this.renderProducts();
      this.isLoading = false;
    }, 500);
  }

  showProductDetail(product) {
    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');
    
    const optimizedImageUrl = Utils.getOptimizedImageUrl(product.image, 600);
    
    modalBody.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-image">
          <img src="${optimizedImageUrl}" alt="${Utils.sanitizeHTML(product.name)}" loading="lazy">
        </div>
        <div class="product-detail-info">
          <h2>${Utils.sanitizeHTML(product.name)}</h2>
          <div class="product-detail-rating">
            <span class="stars">${Utils.formatStars(product.rating)}</span>
            <span class="rating-text">(${product.rating}/5)</span>
          </div>
          <p class="product-detail-description">${Utils.sanitizeHTML(product.description)}</p>
          <div class="product-detail-price">${Utils.formatCurrency(product.price)}</div>
          <button class="btn btn-primary btn-full add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    // Add to cart handler for modal
    const addToCartBtn = modalBody.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      window.cartManager.addToCart(product);
      modal.classList.remove('active');
    });

    modal.classList.add('active');
  }

  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }
}

// Initialize product manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
  });
} else {
  window.productManager = new ProductManager();
}