// Shopping Cart Management with Local Storage

class CartManager {
  constructor() {
    this.items = [];
    this.loadCartFromStorage();
    this.setupEventListeners();
    this.updateCartUI();
  }

  setupEventListeners() {
    // Cart toggle
    document.getElementById('cart-btn').addEventListener('click', () => {
      this.toggleCart();
    });

    document.getElementById('close-cart').addEventListener('click', () => {
      this.closeCart();
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
      this.processCheckout();
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      const cartSidebar = document.getElementById('cart-sidebar');
      const cartBtn = document.getElementById('cart-btn');
      
      if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        this.closeCart();
      }
    });
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCartToStorage();
    this.updateCartUI();
    this.animateCartButton();
    
    Utils.showToast(
      'Added to Cart',
      `${product.name} has been added to your cart`,
      'success'
    );
  }

  removeFromCart(productId) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      const item = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      this.saveCartToStorage();
      this.updateCartUI();
      
      Utils.showToast(
        'Removed from Cart',
        `${item.name} has been removed from your cart`,
        'warning'
      );
    }
  }

  updateQuantity(productId, newQuantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        this.saveCartToStorage();
        this.updateCartUI();
      }
    }
  }

  getCartTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Update cart count in header
    cartCount.textContent = this.getCartItemCount();

    // Update cart total
    cartTotal.textContent = this.getCartTotal().toFixed(2);

    // Render cart items
    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <h4>Your cart is empty</h4>
          <p>Add some products to get started!</p>
        </div>
      `;
    } else {
      cartItems.innerHTML = this.items.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
          <div class="cart-item-image">
            <img src="${Utils.getOptimizedImageUrl(item.image, 120)}" alt="${Utils.sanitizeHTML(item.name)}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title">${Utils.sanitizeHTML(item.name)}</div>
            <div class="cart-item-price">${Utils.formatCurrency(item.price)}</div>
            <div class="cart-item-controls">
              <button class="quantity-btn decrease-qty" data-product-id="${item.id}">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn increase-qty" data-product-id="${item.id}">+</button>
              <button class="remove-item" data-product-id="${item.id}">Remove</button>
            </div>
          </div>
        </div>
      `).join('');

      // Add event listeners for cart controls
      this.setupCartItemControls();
    }
  }

  setupCartItemControls() {
    // Quantity controls
    document.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        const item = this.items.find(item => item.id === productId);
        if (item) {
          this.updateQuantity(productId, item.quantity - 1);
        }
      });
    });

    document.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        const item = this.items.find(item => item.id === productId);
        if (item) {
          this.updateQuantity(productId, item.quantity + 1);
        }
      });
    });

    // Remove item controls
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        this.removeFromCart(productId);
      });
    });
  }

  toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
  }

  closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.remove('active');
  }

  animateCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
      cartBtn.style.animation = '';
    }, 500);
  }

  processCheckout() {
    if (this.items.length === 0) {
      Utils.showToast('Cart Empty', 'Please add items to your cart before checkout', 'warning');
      return;
    }

    // Simulate checkout process
    const total = this.getCartTotal();
    const itemCount = this.getCartItemCount();
    
    Utils.showToast(
      'Order Placed!',
      `Your order of ${itemCount} items (${Utils.formatCurrency(total)}) has been placed successfully!`,
      'success'
    );

    // Clear cart after successful checkout
    this.clearCart();
    this.closeCart();
  }

  clearCart() {
    this.items = [];
    this.saveCartToStorage();
    this.updateCartUI();
  }

  saveCartToStorage() {
    Utils.setLocalStorage('cart', this.items);
  }

  loadCartFromStorage() {
    const savedCart = Utils.getLocalStorage('cart');
    if (savedCart && Array.isArray(savedCart)) {
      this.items = savedCart;
    }
  }

  // Export cart data for analytics (performance monitoring)
  getCartAnalytics() {
    return {
      itemCount: this.getCartItemCount(),
      totalValue: this.getCartTotal(),
      categories: [...new Set(this.items.map(item => item.category))],
      averageItemPrice: this.items.length > 0 ? this.getCartTotal() / this.items.length : 0
    };
  }
}

// Initialize cart manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
  });
} else {
  window.cartManager = new CartManager();
}