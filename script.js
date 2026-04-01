// Language Switcher Functionality
class LanguageSwitcher {
  constructor() {
    this.ptElements = document.querySelectorAll('.pt');
    this.enElements = document.querySelectorAll('.en');
    this.langBtns = document.querySelectorAll('.lang-btn');
    this.currentLang = 'pt';
    
    this.init();
  }
  
  init() {
    this.langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        this.switchLanguage(lang);
      });
    });
  }
  
  switchLanguage(lang) {
    if (this.currentLang === lang) return;
    
    this.currentLang = lang;
    
    // Update active button styling
    this.langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Show/hide elements based on language
    if (lang === 'pt') {
      this.ptElements.forEach(el => el.style.display = '');
      this.enElements.forEach(el => el.style.display = 'none');
    } else {
      this.ptElements.forEach(el => el.style.display = 'none');
      this.enElements.forEach(el => el.style.display = '');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-br' : 'en';
    
    // Optional: Save user preference
    localStorage.setItem('preferred-language', lang);
  }
}

// O JavaScript permanece o mesmo, mas vou reenviar a parte do Carousel 
// para garantir que funcione com os 4 slides

class Carousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelector('.carousel-slides');
    this.totalSlides = document.querySelectorAll('.slide').length;
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.dots = document.querySelectorAll('.dot');
    
    this.init();
  }
  
  init() {
    // Add event listeners
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Add dot click events
    if (this.dots.length) {
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });
    }
    
    // Auto slide every 5 seconds
    this.startAutoSlide();
    
    // Pause auto slide on hover
    const container = document.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('mouseenter', () => this.stopAutoSlide());
      container.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }
  
  updateCarousel() {
    if (!this.slides) return;
    // Update slide position
    this.slides.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    
    // Update dots
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }
  
  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }
  
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }
}

// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      // Animate skill bars when they come into view
      if (entry.target.classList.contains('skill-item')) {
        const progressBar = entry.target.querySelector('.skill-progress');
        if (progressBar) {
          const width = progressBar.style.width;
          progressBar.style.width = '0';
          setTimeout(() => {
            progressBar.style.width = width;
          }, 100);
        }
      }
    }
  });
}, observerOptions);

// Observe all sections and skill items
document.querySelectorAll('section, .timeline-item, .skill-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize language switcher
  const langSwitcher = new LanguageSwitcher();
  
  // Check for saved language preference
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang && savedLang !== 'pt') {
    langSwitcher.switchLanguage(savedLang);
  }
  
  // Initialize carousel
  new Carousel();
});

// Add hover effect for timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const dot = item.querySelector('.timeline-dot');
    if (dot) dot.style.transform = 'scale(1.2)';
  });
  
  item.addEventListener('mouseleave', () => {
    const dot = item.querySelector('.timeline-dot');
    if (dot) dot.style.transform = 'scale(1)';
  });
});