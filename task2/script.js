// Global variables
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoFilter = 'all';

// DOM elements
const contactForm = document.getElementById('contact-form');
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-button');
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactForm();
    initializeTodoList();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                navMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });
}

// Contact form functionality with validation
function initializeContactForm() {
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });

    contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let errorMessage = '';

    // Clear previous styles
    field.classList.remove('error', 'success');

    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Full name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Name can only contain letters and spaces';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email address is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Please select a subject';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            } else if (value.length > 1000) {
                errorMessage = 'Message must be less than 1000 characters';
                isValid = false;
            }
            break;
    }

    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    field.classList.add(isValid ? 'success' : 'error');
    return isValid;
}

function clearError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement && field.classList.contains('error')) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

function validateForm() {
    const requiredFields = ['name', 'email', 'subject', 'message'];
    let isFormValid = true;

    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const submitButton = contactForm.querySelector('.submit-button');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const formSuccess = document.getElementById('form-success');

    // Show loading state
    submitButton.disabled = true;
    submitText.style.display = 'none';
    loadingSpinner.style.display = 'block';

    // Simulate form submission
    setTimeout(() => {
        // Hide form and show success message
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Reset form after delay
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            formSuccess.style.display = 'none';
            submitButton.disabled = false;
            submitText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            
            // Clear all validation classes
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('error', 'success');
            });
            
            // Clear error messages
            const errorMessages = contactForm.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
        }, 3000);
    }, 2000);
}

// Todo list functionality
function initializeTodoList() {
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            todoFilter = e.target.dataset.filter;
            updateFilterButtons();
            renderTodos();
        });
    });

    renderTodos();
    updateTaskCount();
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.unshift(todo);
    saveTodos();
    todoInput.value = '';
    renderTodos();
    updateTaskCount();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function editTodo(id, newText) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
    );
    saveTodos();
    renderTodos();
}

function getFilteredTodos() {
    switch (todoFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text" ondblclick="startEdit(this, ${todo.id})">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="todo-button edit-button" onclick="startEdit(this.previousElementSibling, ${todo.id})">Edit</button>
                <button class="todo-button delete-button" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        </li>
    `).join('');
}

function startEdit(textElement, id) {
    const currentText = textElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'todo-text';
    input.style.background = 'rgba(255, 255, 255, 0.1)';
    input.style.border = '2px solid #6366f1';
    input.style.borderRadius = '5px';
    input.style.padding = '5px';
    input.style.color = 'white';

    const finishEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            editTodo(id, newText);
        } else {
            textElement.textContent = currentText;
            textElement.style.display = 'block';
        }
        input.remove();
    };

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') finishEdit();
    });
    
    input.addEventListener('blur', finishEdit);

    textElement.style.display = 'none';
    textElement.parentNode.insertBefore(input, textElement.nextSibling);
    input.focus();
    input.select();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function updateFilterButtons() {
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === todoFilter);
    });
}

function updateTaskCount() {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeTodos} task${activeTodos !== 1 ? 's' : ''} remaining`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
    }
});

// Smooth scroll behavior for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

console.log('🚀 Dynamic To-Do List Application loaded successfully!');
console.log('✅ Features: Add, Edit, Delete, Filter, Local Storage');
console.log('📝 Contact form with real-time validation');
console.log('📱 Fully responsive design with Flexbox and Grid');
console.log('🎨 Modern glassmorphism design with smooth animations');