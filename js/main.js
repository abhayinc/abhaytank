/**
 * TourismMarketier — Minimalist Interactive Workspace Logic
 */

let lenis;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initOverscrollBounce();
  initThemeToggle();
  initPortfolioModal();
});

/**
 * 0. Lenis Smooth Scroll Integration
 */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Recalculate layout size on accordion expand/collapse
  document.querySelectorAll('details').forEach((el) => {
    el.addEventListener('toggle', () => {
      lenis.resize();
    });
  });

  // Intercept hash anchors for smooth easing scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl);
      }
    });
  });
}

/**
 * 0b. Overscroll Elastic Bounce Effect
 */
function initOverscrollBounce() {
  const container = document.querySelector('.workspace-page');
  if (!container) return;

  let stretch = 0;
  let targetStretch = 0;
  const maxStretch = 60; // Max bounce distance in pixels
  const friction = 0.15; // Resistance to pulling

  // Wheel events
  window.addEventListener('wheel', (e) => {
    const isAtTop = lenis ? lenis.scroll <= 0 : window.scrollY <= 0;
    const isAtBottom = lenis ? lenis.scroll >= lenis.limit - 2 : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;

    if (isAtTop && e.deltaY < 0) {
      targetStretch = Math.min(maxStretch, targetStretch - e.deltaY * friction);
    } else if (isAtBottom && e.deltaY > 0) {
      targetStretch = Math.max(-maxStretch, targetStretch - e.deltaY * friction);
    }
  }, { passive: true });

  // Touch events for mobile
  let touchStart = 0;
  window.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchStart - touchY;
    touchStart = touchY;

    const isAtTop = lenis ? lenis.scroll <= 0 : window.scrollY <= 0;
    const isAtBottom = lenis ? lenis.scroll >= lenis.limit - 2 : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;

    if (isAtTop && deltaY < 0) {
      targetStretch = Math.min(maxStretch, targetStretch - deltaY * friction * 2);
    } else if (isAtBottom && deltaY > 0) {
      targetStretch = Math.max(-maxStretch, targetStretch - deltaY * friction * 2);
    }
  }, { passive: true });

  // Animation frame loop
  function updateBounce() {
    // Smoothly decay target stretch back to 0
    targetStretch = targetStretch * 0.82;
    
    // Lerp actual stretch to target
    stretch = stretch + (targetStretch - stretch) * 0.12;

    if (Math.abs(stretch) > 0.1) {
      container.style.transform = `translateY(${stretch}px)`;
      container.style.transformOrigin = stretch > 0 ? 'top center' : 'bottom center';
    } else {
      container.style.transform = '';
    }

    requestAnimationFrame(updateBounce);
  }

  updateBounce();
}

/**
 * 1. Dark/Light Theme Switching with localStorage persistence
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const htmlEl = document.documentElement;

  // Retrieve theme preference
  const savedTheme = localStorage.getItem('tm-theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);
  
  // Set initial button text based on theme to show what it will switch to
  toggleBtn.textContent = savedTheme === 'light' ? '☾' : '☼';

  toggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('tm-theme', newTheme);
    toggleBtn.textContent = newTheme === 'light' ? '☾' : '☼';
  });
}

/**
 * 3. Interactive Database-Pill Modal
 */
function initPortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  const modalTitle = document.getElementById('modal-title-text');
  const modalBadge = document.getElementById('modal-badge-text');
  const modalText = document.getElementById('modal-text-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const actionBtn = document.getElementById('modal-action-btn');
  const modalImg = document.getElementById('modal-img');
  const modalImgWrap = document.getElementById('modal-image-wrap');
  const links = document.querySelectorAll('.pill-link');

  if (!modal || !closeBtn || !actionBtn) return;

  // Click on item opens modal with data attributes loaded
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const title = link.getAttribute('data-title') || 'Project Item';
      const desc = link.getAttribute('data-desc') || 'No description provided yet.';
      const category = link.getAttribute('data-category') || 'Portfolio Showcase';
      const image = link.getAttribute('data-image');

      modalTitle.textContent = title;
      modalBadge.textContent = category;
      modalText.textContent = desc;

      if (modalImg && modalImgWrap) {
        if (image) {
          modalImg.src = image;
          modalImg.alt = title;
          modalImg.style.display = 'block';
          modalImgWrap.classList.remove('no-image');
        } else {
          modalImg.src = '';
          modalImg.alt = '';
          modalImg.style.display = 'none';
          modalImgWrap.classList.add('no-image');
        }
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close modal click handlers
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  };

  closeBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Action launcher button inside modal
  actionBtn.addEventListener('click', () => {
    alert(`Launching live workspace preview for: "${modalTitle.textContent}"...`);
    closeModal();
  });
}


