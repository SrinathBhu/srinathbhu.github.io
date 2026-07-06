document.addEventListener('DOMContentLoaded', () => {
  // Destructure Motion.dev helpers
  const { animate, inView } = Motion;

  // --- Hero Section Load Animation ---
  animate(
    '#hero-container > *',
    { opacity: [0, 1], y: [15, 0] },
    { duration: 0.8, delay: (info) => info * 0.1, easing: 'ease-out' }
  );

  // --- Scroll-Triggered Section Fade-Ins ---
  inView('section', ({ target }) => {
    animate(
      target.querySelectorAll('[data-animate]'),
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.6, delay: (info) => info * 0.12, easing: 'ease-out' }
    );
  });

  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });
  }

  // Close mobile menu on clicking any links
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    });
  });

  // --- Scroll Progress Indicator & Header BG Toggle ---
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.querySelector('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    // Toggle Header Background
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('shadcn-header');
      } else {
        header.classList.remove('shadcn-header');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    }
  });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Stats Counter Animation ---
  const stats = document.querySelectorAll('.stat-count');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const speed = 100; // lower is faster
    const increment = Math.ceil(target / speed);
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count >= target) {
        el.innerText = target.toLocaleString() + (el.getAttribute('data-suffix') || '');
      } else {
        el.innerText = count.toLocaleString() + (el.getAttribute('data-suffix') || '');
        setTimeout(updateCount, 15);
      }
    };
    updateCount();
  };

  inView('.stat-count', ({ target }) => {
    animateCounter(target);
  });

  // --- LinkedIn Carousel Slider ---
  const carouselTrack = document.getElementById('linkedin-carousel-track');
  const slides = carouselTrack ? carouselTrack.querySelectorAll('.carousel-slide') : [];
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicatorsContainer = document.getElementById('carousel-indicators');

  if (carouselTrack && slides.length > 0) {
    let currentIndex = 0;

    // Create Indicator Dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-zinc-50 w-4' : 'bg-zinc-700'}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      if (indicatorsContainer) {
        indicatorsContainer.appendChild(dot);
      }
    });

    const updateIndicators = () => {
      if (indicatorsContainer) {
        const dots = indicatorsContainer.querySelectorAll('button');
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('bg-zinc-50', 'w-4');
            dot.classList.remove('bg-zinc-700');
          } else {
            dot.classList.remove('bg-zinc-50', 'w-4');
            dot.classList.add('bg-zinc-700');
          }
        });
      }
    };

    const goToSlide = (index) => {
      currentIndex = index;
      if (currentIndex < 0) {
        currentIndex = slides.length - 1;
      } else if (currentIndex >= slides.length) {
        currentIndex = 0;
      }
      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateIndicators();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }
  }

  // --- Contact Form Submission Handler ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (formStatus) {
        formStatus.innerText = 'Sending message...';
        formStatus.className = 'mt-4 text-xs text-zinc-400 font-medium';
        
        setTimeout(() => {
          formStatus.innerText = 'Thank you! Your message has been sent successfully. Srinath will get back to you soon.';
          formStatus.className = 'mt-4 text-xs text-emerald-400 font-medium';
          contactForm.reset();
        }, 1500);
      }
    });
  }
});
