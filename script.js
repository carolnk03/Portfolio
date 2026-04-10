// funcionalidade de idiomas
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
    
    // Atualiza o estilo do botão ativo
    this.langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // mostrar/esconder os elementos baseado no idioma
    if (lang === 'pt') {
      this.ptElements.forEach(el => el.style.display = '');
      this.enElements.forEach(el => el.style.display = 'none');
    } else {
      this.ptElements.forEach(el => el.style.display = 'none');
      this.enElements.forEach(el => el.style.display = '');
    }
    
    // Atualiza atributo de idioma HTML
    document.documentElement.lang = lang === 'pt' ? 'pt-br' : 'en';
    
    // Salva a preferência do usuário
    localStorage.setItem('preferred-language', lang);
  }
}

// Classe Carrossel com suporte para toque em dispositivos móveis
class Carousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelector('.carousel-slides');
    this.totalSlides = document.querySelectorAll('.slide').length;
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.dots = document.querySelectorAll('.dot');
    
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    if (this.dots.length) {
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });
    }
    
    // Adiciona suporte a toque para dispositivos móveis
    const container = document.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }
    
    // Deslizamento automático
    this.startAutoSlide();
    
    // Pausa o deslizamento automático ao passar o cursor (pc) e ao tocar (dispositivo móvel)
    if (container) {
      container.addEventListener('mouseenter', () => this.stopAutoSlide());
      container.addEventListener('mouseleave', () => this.startAutoSlide());
      container.addEventListener('touchstart', () => this.stopAutoSlide());
      container.addEventListener('touchend', () => {
        // Restart auto slide after 10 seconds of inactivity on mobile
        setTimeout(() => this.startAutoSlide(), 10000);
      });
    }
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }
  
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // próximo slide
        this.nextSlide();
      } else {
        // slide anterior
        this.prevSlide();
      }
    }
  }
  
  updateCarousel() {
    if (!this.slides) return;
    // Atualiza a posição do slide
    this.slides.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    
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
    if (!this.autoSlideInterval) {
      this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// Animação ao rolar com otimização de desempenho
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      // Animar as barras de habilidade quando elas aparecerem na tela
      if (entry.target.classList.contains('skill-item')) {
        const progressBar = entry.target.querySelector('.skill-progress');
        if (progressBar && !progressBar.dataset.animated) {
          const width = progressBar.style.width;
          progressBar.style.width = '0';
          progressBar.dataset.animated = 'true';
          setTimeout(() => {
            progressBar.style.width = width;
          }, 100);
        }
      }
      
      // Desobserve após a animação para melhorar o desempenho
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observa todas as seções e itens de habilidade
document.querySelectorAll('section, .timeline-item, .skill-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Inicializa tudo quando for carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o seletor de idiomas
  const langSwitcher = new LanguageSwitcher();
  
  // Verifica se há preferências de idioma salvas
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang && savedLang !== 'pt') {
    langSwitcher.switchLanguage(savedLang);
  }
  
  // Inicializa o carrossel
  new Carousel();
});

// Adiciona efeito de foco para itens da linha do tempo
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
