class Portfolio {
    constructor() {
        this.initializeNavigation();
        this.initializeScrollAnimations();
        this.initializeContactForm();
        this.initializeProjectModal();
    }

    initializeNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling and active nav updates
        navLinks.forEach(link => {
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
                }
            });
        });

        // Update active nav on scroll and navbar background
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Update navbar background
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active navigation
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add animation classes and observe elements
        const animateElements = document.querySelectorAll(
            '.about-content, .skills-section, .project-card, .contact-grid, .experience-stats'
        );
        
        animateElements.forEach((el, index) => {
            if (el.classList.contains('about-content')) {
                el.classList.add('fade-in');
            } else if (el.classList.contains('project-card')) {
                el.classList.add('fade-in');
                el.style.animationDelay = `${index * 0.1}s`;
            } else if (el.classList.contains('contact-grid')) {
                el.classList.add('slide-in-left');
            } else {
                el.classList.add('fade-in');
            }
            observer.observe(el);
        });

        // Stagger project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }

    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.submitForm();
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        let isValid = true;

        if (!this.validateField(name)) isValid = false;
        if (!this.validateField(email)) isValid = false;
        if (!this.validateField(subject)) isValid = false;
        if (!this.validateField(message)) isValid = false;

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);

        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
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
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('show', !isValid);
        }

        field.style.borderColor = isValid ? 'rgba(255, 255, 255, 0.2)' : '#f87171';

        return isValid;
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }

    async submitForm() {
        const submitBtn = document.getElementById('submitBtn');
        const form = document.getElementById('contactForm');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            
            // Show success message
            this.showSuccessMessage(`Thank you ${name}! Your message has been sent successfully. I'll get back to you within 24 hours.`);
            
            // Reset form
            form.reset();
            
        } catch (error) {
            this.showErrorMessage('Something went wrong. Please try again later.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        notification.querySelector('button').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    initializeProjectModal() {
        const modal = document.getElementById('projectModal');
        const modalClose = document.getElementById('modalClose');
        const modalBody = document.getElementById('modalBody');

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Project data
        this.projectData = {
            ecommerce: {
                title: 'E-commerce Platform',
                description: 'A comprehensive e-commerce solution built with React and Node.js',
                fullDescription: `
                    This full-stack e-commerce platform demonstrates modern web development practices 
                    with a focus on user experience and security. The application features a responsive 
                    React frontend with Redux for state management, a robust Node.js backend with Express, 
                    and PostgreSQL for data persistence.
                `,
                features: [
                    'User authentication and authorization',
                    'Product catalog with advanced search',
                    'Shopping cart and checkout process',
                    'Stripe payment integration',
                    'Admin dashboard for inventory management',
                    'Real-time order tracking',
                    'Email notifications',
                    'Mobile-responsive design'
                ],
                technologies: ['React', 'Redux', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API', 'JWT', 'Bcrypt'],
                challenges: `
                    The main challenge was implementing secure payment processing while maintaining 
                    a smooth user experience. This required careful API design, comprehensive error 
                    handling, and extensive testing of the payment flow.
                `,
                github: '#',
                demo: '#'
            },
            weather: {
                title: 'Weather Dashboard',
                description: 'Interactive weather application with beautiful data visualizations',
                fullDescription: `
                    This weather dashboard showcases advanced frontend development skills using vanilla 
                    JavaScript and modern web APIs. The application provides real-time weather data 
                    with beautiful charts and an intuitive user interface.
                `,
                features: [
                    'Real-time weather data from OpenWeather API',
                    'Interactive charts using Chart.js',
                    'Location-based weather detection',
                    '7-day weather forecast',
                    'Weather alerts and notifications',
                    'Dark/light theme toggle',
                    'Responsive design for all devices',
                    'Offline functionality with service workers'
                ],
                technologies: ['JavaScript ES6+', 'Chart.js', 'CSS Grid', 'Service Workers', 'OpenWeather API', 'Geolocation API'],
                challenges: `
                    Creating smooth animations and transitions while maintaining performance was key. 
                    Implementing proper error handling for API failures and providing meaningful 
                    feedback to users required careful consideration.
                `,
                github: '#',
                demo: '#'
            },
            taskmanager: {
                title: 'Task Management System',
                description: 'Collaborative task management platform with real-time features',
                fullDescription: `
                    A comprehensive task management solution designed for modern distributed teams. 
                    The platform combines React's component architecture with Socket.io for real-time 
                    collaboration, creating an efficient workflow management tool.
                `,
                features: [
                    'Real-time collaboration with Socket.io',
                    'Drag-and-drop task organization',
                    'Team member management and permissions',
                    'Project timeline and milestone tracking',
                    'File attachment and commenting system',
                    'Advanced filtering and search',
                    'Email notifications and reminders',
                    'Analytics and reporting dashboard'
                ],
                technologies: ['React', 'Socket.io', 'Express', 'MongoDB', 'JWT', 'Nodemailer', 'React DnD', 'Chart.js'],
                challenges: `
                    The biggest challenge was ensuring data consistency across multiple users in 
                    real-time while maintaining optimal performance. This required implementing 
                    efficient state synchronization and conflict resolution strategies.
                `,
                github: '#',
                demo: '#'
            }
        };

        // Make openProjectModal globally available
        window.openProjectModal = (projectId) => {
            const project = this.projectData[projectId];
            if (project) {
                modalBody.innerHTML = this.generateProjectModalContent(project);
                modal.classList.add('active');
            }
        };
    }

    generateProjectModalContent(project) {
        return `
            <div class="modal-project">
                <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #1f2937;">${project.title}</h2>
                <p style="color: #6b7280; margin-bottom: 1.5rem; font-size: 1rem;">${project.description}</p>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #374151;">Project Overview</h3>
                    <p style="color: #6b7280; line-height: 1.6;">${project.fullDescription}</p>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: #374151;">Key Features</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${project.features.map(feature => `
                            <li style="padding: 0.5rem 0; color: #6b7280; position: relative; padding-left: 1.5rem;">
                                <span style="position: absolute; left: 0; color: #2563eb;">✓</span>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 1rem; color: #374151;">Technologies Used</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${project.technologies.map(tech => `
                            <span style="background: #eff6ff; color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #374151;">Challenges & Solutions</h3>
                    <p style="color: #6b7280; line-height: 1.6;">${project.challenges}</p>
                </div>

                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="${project.demo}" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.3s ease;">
                        View Live Demo
                    </a>
                    <a href="${project.github}" style="background: transparent; color: #2563eb; border: 2px solid #2563eb; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.3s ease;">
                        View Code
                    </a>
                </div>
            </div>
        `;
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Add dynamic styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);