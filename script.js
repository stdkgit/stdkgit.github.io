// Smooth scroll behavior and active nav highlighting + mobile nav toggle

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-links a');
  const hamburger = document.querySelector('.hamburger');
  const body = document.body;
  const navbar = document.querySelector('.navbar');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      // Close mobile nav after click (if open)
      if (hamburger && hamburger.getAttribute('aria-expanded') === 'true') {
        toggleMobileNav(false);
      }

      if (targetSection) {
        // Adjust scroll position to account for fixed header
        const offsetTop = targetSection.offsetTop - (navbar.offsetHeight + 8); 
        window.scrollTo({
            top: offsetTop, 
            behavior: 'smooth' 
        });
      }
    });
  });

  // Mobile hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      toggleMobileNav(!expanded);
    });
  }

  function toggleMobileNav(open) {
    if (open) {
      document.documentElement.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      document.documentElement.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  // Close mobile nav on outside tap or on resize > mobile
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && document.documentElement.classList.contains('nav-open')) {
      toggleMobileNav(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) toggleMobileNav(false);
    updateActiveNav();
  });

  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    updateActiveNav();
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('.section');
    let current = '';
    const offset = navbar ? navbar.offsetHeight + 10 : 100; // Compensate for sticky navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - offset) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  updateActiveNav(); // Initial call to set active state

  // Bitcoin Address Copy Handler
  const bitcoinAddressElement = document.getElementById('bitcoin-address');
  if (bitcoinAddressElement) {
    const fullAddress = bitcoinAddressElement.getAttribute('data-address');
    
    bitcoinAddressElement.style.cursor = 'pointer'; // Make it look clickable
    
    bitcoinAddressElement.addEventListener('click', () => {
      if (navigator.clipboard && fullAddress) {
        navigator.clipboard.writeText(fullAddress).then(() => {
          // Provide temporary feedback
          const originalText = bitcoinAddressElement.textContent;
          bitcoinAddressElement.textContent = 'Copied!';
          setTimeout(() => {
            bitcoinAddressElement.textContent = originalText;
          }, 1500);
        }).catch(err => {
          console.error('Could not copy text: ', err);
          // Fallback if clipboard API fails (rare on modern browsers)
          alert(`Could not copy address automatically. Please copy manually: ${fullAddress}`);
        });
      }
    });
  }



  // --- Scroll Reveal Logic (Text appears slowly as user scrolls) ---
  const revealElements = document.querySelectorAll('.reveal-text');

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -10% 0px', // Trigger when element is 90% in view (or 10% from bottom)
    threshold: 0.05 // Trigger early
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to trigger CSS transition
        entry.target.classList.add('visible');
        
        // Remove observer once visible to save performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    // Apply a slight delay based on document position to fake staggered load
    const delay = index * 50; // 50ms stagger per element
    el.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(el);
  });
  // --- End Scroll Reveal Logic ---

});