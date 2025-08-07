/**
 * Professional Portfolio JavaScript
 * Enhanced interactivity and animations for Sai Kumar Polavaram's portfolio
 */

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Navigation functionality
class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navMenu = document.getElementById('nav-menu');
    this.hamburger = document.getElementById('hamburger');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateActiveLink();
  }
  
  setupEventListeners() {
    // Hamburger menu toggle
    this.hamburger.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Navigation link clicks
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavClick(link);
      });
    });
    
    // Scroll events
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
      this.updateActiveLink();
    }, 16));
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    }, 250));
  }
  
  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
    this.hamburger.classList.toggle('active');
    document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
  }
  
  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  handleNavClick(link) {
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    this.closeMobileMenu();
  }
  
  handleScroll() {
    const scrolled = window.scrollY > 50;
    this.navbar.classList.toggle('scrolled', scrolled);
  }
  
  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// Smooth animations and effects
class AnimationManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupTypingEffect();
    this.setupCounterAnimations();
  }
  
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
      .hero-content,
      .section-header,
      .about-content,
      .timeline-item,
      .skill-category,
      .cert-card,
      .contact-item
    `);
    
    animatedElements.forEach(element => {
      animateOnScroll.observe(element);
    });
  }
  
  setupHoverEffects() {
    // Skill items hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(12px) scale(1.02)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
      });
    });
    
    // Timeline items hover effect
    const timelineItems = document.querySelectorAll('.timeline-content');
    timelineItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
      });
    });
  }
  
  setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const titleLines = heroTitle.querySelectorAll('.title-line');
      titleLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          line.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, index * 200 + 500);
      });
    }
  }
  
  setupCounterAnimations() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + (target === 3 ? '+' : '');
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + (target > 10 ? '+' : '');
        }
      }, 16);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumber = entry.target;
          const targetValue = parseInt(statNumber.textContent);
          animateCounter(statNumber, targetValue);
          statsObserver.unobserve(statNumber);
        }
      });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
      statsObserver.observe(stat);
    });
  }
}

// Contact form handling
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.setupFormValidation();
      this.setupFormSubmission();
    }
  }
  
  setupFormValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }
    
    return isValid;
  }
  
  showFieldError(field, message) {
    this.clearFieldError(field);
    
    field.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
  }
  
  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }
  
  handleFormSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });
    
    if (isFormValid) {
      this.sendEmail(data);
    }
  }
  
  sendEmail(data) {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Create mailto link
    const subject = encodeURIComponent(`Portfolio Contact: ${data.subject}`);
    const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
    `);
    
    const mailtoLink = `mailto:saikumarpolavaram@outlook.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form and button
    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      this.form.reset();
      this.showSuccessMessage();
    }, 1000);
  }
  
  showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div style="
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
      ">
        <i class="fas fa-check-circle"></i>
        Thank you! Your email client will open to send the message.
      </div>
    `;
    
    this.form.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
}

// Scroll to top functionality
class ScrollToTop {
  constructor() {
    this.createButton();
    this.setupEventListeners();
  }
  
  createButton() {
    this.button = document.createElement('button');
    this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    this.button.className = 'scroll-to-top';
    this.button.setAttribute('aria-label', 'Scroll to top');
    
    // Styles
    Object.assign(this.button.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '50px',
      height: '50px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      zIndex: '1000',
      opacity: '0',
      visibility: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
      fontSize: '1rem'
    });
    
    document.body.appendChild(this.button);
  }
  
  setupEventListeners() {
    window.addEventListener('scroll', throttle(() => {
      this.toggleButton();
    }, 16));
    
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    this.button.addEventListener('mouseenter', () => {
      this.button.style.transform = 'translateY(-2px) scale(1.1)';
      this.button.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });
    
    this.button.addEventListener('mouseleave', () => {
      this.button.style.transform = '';
      this.button.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });
  }
  
  toggleButton() {
    const scrolled = window.scrollY > 300;
    this.button.style.opacity = scrolled ? '1' : '0';
    this.button.style.visibility = scrolled ? 'visible' : 'hidden';
  }
}

// Loading screen
class LoadingScreen {
  constructor() {
    this.createLoadingScreen();
    this.hideLoadingScreen();
  }
  
  createLoadingScreen() {
    this.loader = document.createElement('div');
    this.loader.className = 'loading-screen';
    this.loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <h2>Sai Kumar Polavaram</h2>
        <p>Loading Portfolio...</p>
      </div>
    `;
    
    // Styles
    Object.assign(this.loader.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '9999',
      transition: 'opacity 0.5s ease'
    });
    
    const loaderContent = this.loader.querySelector('.loader-content');
    Object.assign(loaderContent.style, {
      textAlign: 'center',
      color: 'white'
    });
    
    // Add spinner styles
    const spinnerStyles = document.createElement('style');
    spinnerStyles.textContent = `
      .loader-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyles);
    
    document.body.appendChild(this.loader);
  }
  
  hideLoadingScreen() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loader.style.opacity = '0';
        setTimeout(() => {
          this.loader.remove();
        }, 500);
      }, 800);
    });
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  preloadCriticalResources() {
    const criticalResources = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'style';
      document.head.appendChild(link);
    });
  }
}

// Theme manager (for future dark mode support)
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }
  
  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
  }
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  createThemeToggle() {
    // Theme toggle implementation for future use
    // Can be added to navigation or footer
  }
  
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  // new LoadingScreen(); // Disabled as requested
  new Navigation();
  new AnimationManager();
  new ContactForm();
  new ScrollToTop();
  new PerformanceOptimizer();
  new ThemeManager();
  
  // Additional interactive features
  initializeSkillsInteraction();
  initializeCertificationCards();
  initializeHeroAnimations();
});

// Skill interaction enhancements
function initializeSkillsInteraction() {
  const skillCategories = document.querySelectorAll('.skill-category');
  
  skillCategories.forEach(category => {
    const header = category.querySelector('.category-header');
    const items = category.querySelector('.skill-items');
    
    header.addEventListener('click', () => {
      category.classList.toggle('expanded');
      
      if (category.classList.contains('expanded')) {
        items.style.maxHeight = items.scrollHeight + 'px';
      } else {
        items.style.maxHeight = null;
      }
    });
  });
}

// Certification card interactions
function initializeCertificationCards() {
  const certCards = document.querySelectorAll('.cert-card');
  
  certCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-12px) rotateY(5deg)';
      card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

// Hero section animations
function initializeHeroAnimations() {
  const heroElements = {
    badge: document.querySelector('.hero-badge'),
    title: document.querySelector('.hero-title'),
    description: document.querySelector('.hero-description'),
    stats: document.querySelector('.hero-stats'),
    actions: document.querySelector('.hero-actions'),
    social: document.querySelector('.hero-social'),
    image: document.querySelector('.hero-image')
  };
  
  // Staggered animation for hero elements
  Object.values(heroElements).forEach((element, index) => {
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 150 + 800);
    }
  });
  
  // Floating animation for tech icons
  const techIcons = document.querySelectorAll('.tech-icon');
  techIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.5}s`;
  });
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('Portfolio Error:', e.error);
});

// Service worker registration for PWA support (future enhancement)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service worker can be implemented for offline support
    console.log('PWA support available');
  });
}

// Analytics and tracking (placeholder for future implementation)
function trackEvent(category, action, label) {
  // Google Analytics or other tracking implementation
  console.log('Event tracked:', { category, action, label });
}

// Accessibility enhancements
function initializeAccessibility() {
  // Skip link removed as requested
  
  // Keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Export for external use if needed
window.PortfolioApp = {
  Navigation,
  AnimationManager,
  ContactForm,
  ScrollToTop,
  ThemeManager,
  trackEvent
};
