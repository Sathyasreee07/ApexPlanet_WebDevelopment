// Authentication System (Simulation)

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.loadUserFromStorage();
    this.setupEventListeners();
    this.updateAuthUI();
  }

  setupEventListeners() {
    // Login button
    document.getElementById('login-btn').addEventListener('click', () => {
      if (this.currentUser) {
        this.logout();
      } else {
        this.showAuthModal();
      }
    });

    // Auth modal controls
    document.getElementById('close-auth-modal').addEventListener('click', () => {
      this.closeAuthModal();
    });

    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchAuthTab(e.target.dataset.tab);
      });
    });

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin(e.target);
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleRegister(e.target);
    });

    // Close modal when clicking outside
    document.getElementById('auth-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeAuthModal();
      }
    });
  }

  showAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('active');
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('active');
  }

  switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
  }

  handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email') || form.querySelector('input[type="email"]').value;
    const password = formData.get('password') || form.querySelector('input[type="password"]').value;

    // Validate inputs
    if (!email || !password) {
      Utils.showToast('Login Failed', 'Please fill in all fields', 'error');
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Utils.showToast('Login Failed', 'Please enter a valid email address', 'error');
      return;
    }

    // Simulate login process
    setTimeout(() => {
      this.login({
        id: Utils.generateId(),
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      });

      Utils.showToast('Welcome Back!', `Successfully logged in as ${email}`, 'success');
      this.closeAuthModal();
    }, 1000);
  }

  handleRegister(form) {
    const formData = new FormData(form);
    const name = formData.get('name') || form.querySelector('input[type="text"]').value;
    const email = formData.get('email') || form.querySelector('input[type="email"]').value;
    const password = formData.get('password') || form.querySelector('input[type="password"]').value;

    // Validate inputs
    if (!name || !email || !password) {
      Utils.showToast('Registration Failed', 'Please fill in all fields', 'error');
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Utils.showToast('Registration Failed', 'Please enter a valid email address', 'error');
      return;
    }

    if (password.length < 6) {
      Utils.showToast('Registration Failed', 'Password must be at least 6 characters', 'error');
      return;
    }

    // Simulate registration process
    setTimeout(() => {
      this.login({
        id: Utils.generateId(),
        email: email,
        name: name,
        registrationTime: new Date().toISOString()
      });

      Utils.showToast('Account Created!', `Welcome to TechStore, ${name}!`, 'success');
      this.closeAuthModal();
    }, 1000);
  }

  login(user) {
    this.currentUser = user;
    this.saveUserToStorage();
    this.updateAuthUI();
  }

  logout() {
    this.currentUser = null;
    this.clearUserFromStorage();
    this.updateAuthUI();
    Utils.showToast('Logged Out', 'You have been successfully logged out', 'success');
  }

  updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    
    if (this.currentUser) {
      loginBtn.textContent = `Hi, ${this.currentUser.name}`;
      loginBtn.className = 'btn btn-outline logged-in';
    } else {
      loginBtn.textContent = 'Login';
      loginBtn.className = 'btn btn-outline';
    }
  }

  saveUserToStorage() {
    Utils.setLocalStorage('user', this.currentUser);
  }

  loadUserFromStorage() {
    const savedUser = Utils.getLocalStorage('user');
    if (savedUser) {
      this.currentUser = savedUser;
    }
  }

  clearUserFromStorage() {
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.warn('Error clearing user from storage:', e);
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Simulate user preferences and personalization
  getUserPreferences() {
    const defaultPreferences = {
      currency: 'USD',
      language: 'en',
      notifications: true,
      theme: 'light'
    };

    if (this.currentUser) {
      const saved = Utils.getLocalStorage(`preferences_${this.currentUser.id}`);
      return saved || defaultPreferences;
    }

    return defaultPreferences;
  }

  saveUserPreferences(preferences) {
    if (this.currentUser) {
      Utils.setLocalStorage(`preferences_${this.currentUser.id}`, preferences);
    }
  }
}

// Initialize auth manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
  });
} else {
  window.authManager = new AuthManager();
}