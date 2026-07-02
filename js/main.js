/**
 * Abhay Tank — Creator Card Profile
 * Mobile-first interactive logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initGalleryLightbox();
  initAccordion();
  initShare();
  initSubscribe();
});

/* ─────────────────────────────────────────────────────────────────
   0. Lenis Smooth Scroll
───────────────────────────────────────────────────────────────── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ─────────────────────────────────────────────────────────────────
   1. Gallery Lightbox — opens on "Recent Works" card click
───────────────────────────────────────────────────────────────── */
function initGalleryLightbox() {
  const galleryCard  = document.getElementById('recent-works-card');
  const lightbox     = document.getElementById('gallery-lightbox');
  const closeBtn     = document.getElementById('lightbox-close-btn');
  const prevBtn      = document.getElementById('lightbox-prev-btn');
  const nextBtn      = document.getElementById('lightbox-next-btn');
  const dotsWrap     = document.getElementById('lightbox-dots');
  const slides       = lightbox ? lightbox.querySelectorAll('.lightbox-slide') : [];

  if (!galleryCard || !lightbox || slides.length === 0) return;

  let currentSlide = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'lb-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dotsWrap.appendChild(dot);
  });

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dotsWrap.querySelectorAll('.lb-dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function openLightbox() {
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    showSlide(0);
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    galleryCard.querySelector('.gallery-preview').focus?.();
  }

  // Open on card click (anywhere on the gallery preview area)
  galleryCard.querySelector('.gallery-preview').addEventListener('click', openLightbox);

  // Close
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation
  prevBtn.addEventListener('click', () => {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  });
  nextBtn.addEventListener('click', () => {
    showSlide((currentSlide + 1) % slides.length);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  showSlide((currentSlide - 1 + slides.length) % slides.length);
    if (e.key === 'ArrowRight') showSlide((currentSlide + 1) % slides.length);
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) showSlide((currentSlide + 1) % slides.length);
      else          showSlide((currentSlide - 1 + slides.length) % slides.length);
    }
  }, { passive: true });

  // Init first slide
  showSlide(0);
}

/* ─────────────────────────────────────────────────────────────────
   2. Accordion — "How I Help" services card
───────────────────────────────────────────────────────────────── */
function initAccordion() {
  const toggleBtn = document.getElementById('acc-toggle-btn');
  const body      = document.getElementById('acc-services-body');
  if (!toggleBtn || !body) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    body.hidden = isExpanded;

    // Animate height for smooth open/close
    if (!isExpanded) {
      body.hidden = false;
      body.style.maxHeight = body.scrollHeight + 'px';
    } else {
      body.style.maxHeight = '0';
      setTimeout(() => { body.hidden = true; body.style.maxHeight = ''; }, 280);
    }
  });

  // Keyboard: Enter / Space
  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBtn.click();
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   3. Share Button — Web Share API with clipboard fallback
───────────────────────────────────────────────────────────────── */
function initShare() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'Abhay Tank — Travel Tech & Marketing',
      text: 'Building Websites for Travel Brands',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {
        // user cancelled — ignore
      }
    } else {
      // Clipboard fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      } catch (_) {
        showToast('Copy this URL: ' + window.location.href);
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   4. Subscribe Button — simple feedback
───────────────────────────────────────────────────────────────── */
function initSubscribe() {
  const subscribeBtn = document.getElementById('subscribe-btn');
  if (!subscribeBtn) return;

  subscribeBtn.addEventListener('click', () => {
    // Could open a modal / newsletter form here
    showToast('Thanks for subscribing! 🎉');
    subscribeBtn.textContent = 'Subscribed ✓';
    subscribeBtn.style.background = 'rgba(60,107,90,0.9)';
    subscribeBtn.style.color = '#fff';
  });
}

/* ─────────────────────────────────────────────────────────────────
   UTILITY: Toast Notification
───────────────────────────────────────────────────────────────── */
function showToast(message) {
  // Remove existing toast
  const existing = document.getElementById('__toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = '__toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '9rem',
    left:         '50%',
    transform:    'translateX(-50%) translateY(8px)',
    background:   '#1A1A18',
    color:        '#fff',
    padding:      '1rem 2rem',
    borderRadius: '50px',
    fontSize:     '1.35rem',
    fontFamily:   "'Plus Jakarta Sans', sans-serif",
    fontWeight:   '600',
    zIndex:       '9999',
    boxShadow:    '0 8px 24px rgba(0,0,0,0.3)',
    opacity:      '0',
    transition:   'opacity 0.25s ease, transform 0.25s ease',
    whiteSpace:   'nowrap',
    pointerEvents:'none',
  });

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}
