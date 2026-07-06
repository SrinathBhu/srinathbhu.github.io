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

  // --- Mobile Menu Toggle (slide-down drawer) ---
  const menuBtn   = document.getElementById('menu-btn');
  const menuIcon  = document.getElementById('menu-icon');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  const openMenu = () => {
    menuOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    mobileMenu.style.opacity  = '1';
    menuIcon.classList.replace('fa-bars', 'fa-xmark');
    menuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    menuOpen = false;
    mobileMenu.style.maxHeight = '0';
    mobileMenu.style.opacity   = '0';
    menuIcon.classList.replace('fa-xmark', 'fa-bars');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuOpen ? closeMenu() : openMenu();
    });
  }

  // Close on any nav link click
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && e.target !== menuBtn) {
      closeMenu();
    }
  });

  // Close on scroll (after 60px)
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (menuOpen && Math.abs(window.scrollY - lastScrollY) > 60) {
      closeMenu();
    }
    lastScrollY = window.scrollY;
  }, { passive: true });

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

  // --- Copy Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = 'bhusrinath@gmail.com';
      navigator.clipboard.writeText(emailText).then(() => {
        const icon = copyEmailBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check text-xs text-secondary';
          setTimeout(() => {
            icon.className = 'fa-regular fa-copy text-xs';
          }, 2000);
        }
        
        // Show tooltip
        const tooltip = document.createElement('span');
        tooltip.innerText = 'Email Copied!';
        tooltip.className = 'absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none transition-all opacity-0 scale-95 duration-200';
        copyEmailBtn.style.position = 'relative';
        copyEmailBtn.appendChild(tooltip);
        
        // Trigger animation
        setTimeout(() => {
          tooltip.className = tooltip.className.replace('opacity-0 scale-95', 'opacity-100 scale-100');
        }, 50);

        setTimeout(() => {
          tooltip.className = tooltip.className.replace('opacity-100 scale-100', 'opacity-0 scale-95');
          setTimeout(() => tooltip.remove(), 200);
        }, 1800);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }
});
