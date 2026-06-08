/**
 * TourismMarketier Interaction & Animation Engine
 * Developed using Vanilla JS + GSAP animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initMobileNav();
  initScrollAnimations();
  initInteractiveCards();
  initContactForm();
});

/* ==========================================================================
   PAGE LOADING TIMELINE & INTRO
   ========================================================================== */
function initLoader() {
  const loader = document.querySelector('.intro-loader');
  const progressBar = document.querySelector('.intro-progress');
  const introLogo = document.querySelector('.intro-logo');
  
  if (!loader || !progressBar) return;
  
  // Slide in logo
  setTimeout(() => {
    introLogo.style.opacity = '1';
    introLogo.style.transform = 'translateY(0)';
    introLogo.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
  }, 100);

  let progress = 0;
  const interval = setInterval(() => {
    // Add variations to make it feel natural and dynamic
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Complete animation and hide
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        
        // Trigger initial GSAP entry animations once loader is gone
        setTimeout(() => {
          loader.remove();
          triggerHeroEntry();
        }, 800);
      }, 300);
    }
    progressBar.style.width = `${progress}%`;
  }, 120);
}

function triggerHeroEntry() {
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();
    tl.from('.nav-container', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.hero-tag', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3')
      .from('.hero-title span', { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power4.out' }, '-=0.4')
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-ctas .btn', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.scroll-indicator', { opacity: 0, y: 10, duration: 0.5 }, '-=0.1');
  }
}

/* ==========================================================================
   FLUID CUSTOM CURSOR (Physics Trail Lerping)
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  const label = document.querySelector('.cursor-label');
  
  if (!cursor || !follower) return;
  
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorCoords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let followerCoords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  // Track actual mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  // Smooth Lerp Physics Animation Loop
  function animateCursor() {
    // Lerping factor (0.1 for cursor, 0.08 for lagging trail follower)
    cursorCoords.x += (mouse.x - cursorCoords.x) * 0.2;
    cursorCoords.y += (mouse.y - cursorCoords.y) * 0.2;
    
    followerCoords.x += (mouse.x - followerCoords.x) * 0.09;
    followerCoords.y += (mouse.y - followerCoords.y) * 0.09;
    
    cursor.style.left = `${cursorCoords.x}px`;
    cursor.style.top = `${cursorCoords.y}px`;
    
    follower.style.left = `${followerCoords.x}px`;
    follower.style.top = `${followerCoords.y}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Bind hover states to premium elements
  const hoverElements = document.querySelectorAll('[data-cursor]');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const cursorText = el.getAttribute('data-cursor') || 'VIEW';
      label.textContent = cursorText;
      document.body.classList.add('hovering-interactive');
    });
    
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-interactive');
    });
  });
}

/* ==========================================================================
   MOBILE NAVIGATION BINDINGS
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.querySelector('.menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!menuBtn || !navMenu) return;
  
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger lines
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
  });
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 991 && !link.nextElementSibling) {
        navMenu.classList.remove('active');
        // Reset button
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });
}

/* ==========================================================================
   GSAP VIEWPOT SCROLL TRIGGER EFFECTS
   ========================================================================== */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Elegant fallback reveals using CSS IntersectionObserver if GSAP doesn't load
    initIntersectionObserverFallback();
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Section Headers Reveal
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.querySelectorAll('.section-subtitle, .section-title, .section-info p'), {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Portfolio Cards Reveal
  gsap.utils.toArray('.portfolio-card').forEach(card => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Services Rows Sequential Cascade Reveal
  gsap.from('.service-row', {
    y: 40,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services-container',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
  
  // Metrics counting animation
  gsap.utils.toArray('.metric-num').forEach(num => {
    const endVal = parseInt(num.textContent, 10);
    const hasPlus = num.textContent.includes('+');
    const hasSuffix = num.textContent.match(/[A-Za-z]+$/);
    const suffix = hasSuffix ? hasSuffix[0] : '';
    
    num.textContent = '0';
    
    gsap.to(num, {
      innerText: endVal,
      duration: 2,
      ease: 'power1.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: num,
        start: 'top 90%'
      },
      onUpdate: function() {
        num.innerHTML = num.innerText + suffix + (hasPlus ? '+' : '');
      }
    });
  });
}

function initIntersectionObserverFallback() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  // Apply visual trigger setups to cards and headers
  const animTargets = document.querySelectorAll('.portfolio-card, .service-row, .section-header');
  animTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    observer.observe(el);
  });
}

/* ==========================================================================
   DYNAMIC TEAM CARDS & INTERACTIVES
   ========================================================================== */
function initInteractiveCards() {
  // We can randomize team card default offsets slightly so they look scattered on load
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      // Dynamic shift of other layers
      teamCards.forEach(c => {
        if (c !== card) {
          c.style.opacity = '0.5';
          c.style.transform = c.style.transform + ' scale(0.95)';
        }
      });
    });
    
    card.addEventListener('mouseleave', () => {
      teamCards.forEach(c => {
        c.style.opacity = '1';
        // Reset card translations based on classes
        if (c.classList.contains('card-1')) {
          c.style.transform = 'rotate(-6deg) translateX(-30px) translateY(-10px)';
        } else if (c.classList.contains('card-2')) {
          c.style.transform = 'rotate(4deg) translateX(30px) translateY(10px)';
        } else if (c.classList.contains('card-3')) {
          c.style.transform = 'rotate(-2deg) translateY(20px)';
        }
      });
    });
  });
}

/* ==========================================================================
   PREMIUM CONTACT FORM LOGIC (AJAX MOCK & ANIMATION FEEDBACK)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('tm-lead-form');
  const feedback = document.querySelector('.form-feedback');
  
  if (!form || !feedback) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    
    // Show premium processing state
    submitBtn.textContent = 'CONNECTING TO TOURISM HORIZON...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Capture details
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    setTimeout(() => {
      // Successful animation response
      submitBtn.textContent = 'HORIZON ESTABLISHED!';
      submitBtn.style.backgroundColor = '#FFFFFF';
      submitBtn.style.color = '#000819';
      
      feedback.textContent = `Thank you ${name}! Our global travel strategist will reach out to ${email} within 2 hours. Let's create something extraordinary.`;
      feedback.classList.add('success');
      feedback.style.display = 'block';
      
      // Clear form
      form.reset();
      
      // Reset button state
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
      }, 4000);
      
    }, 1800);
  });
}
