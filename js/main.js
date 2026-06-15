/**
 * TourismMarketier — Minimalist Interactive Workspace Logic
 */

let lenis;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initOverscrollBounce();
  initThemeToggle();
  initPortfolioModal();
  initPipelineSimulation();
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
  const savedTheme = localStorage.getItem('tm-theme') || 'light';
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

/**
 * 4. Travel Lead Pipeline Interactive Simulation
 */
function initPipelineSimulation() {
  const startBtn = document.getElementById('start-sim-btn');
  const consoleText = document.getElementById('sim-console-text');
  const badgeIndicator = document.getElementById('sim-badge-indicator');
  const progressLine = document.getElementById('pipeline-progress');
  const steps = document.querySelectorAll('.workflow-row');
  
  if (!startBtn || !consoleText || !badgeIndicator || !progressLine) return;

  const simulationData = [
    {
      step: 1,
      bubbleText: "Aditya sees your refreshed brand logo & tour brochure on Instagram and trusts it instantly.",
      consoleText: "Aditya (traveler) is captivated by your professional, trustworthy branding.",
      progress: "20%"
    },
    {
      step: 2,
      bubbleText: "He clicks the link and lands on your lightning-fast CMS website, browsing itineraries.",
      consoleText: "Aditya visits your website, browsing tour packages and departures without OTA distractions.",
      progress: "40%"
    },
    {
      step: 3,
      bubbleText: "He decides to enquire. The Meta Ads pixel captures his contact details & travel interests.",
      consoleText: "Meta Lead generation capture: Phone number and travel dates collected.",
      progress: "60%"
    },
    {
      step: 4,
      bubbleText: "Instantly, he receives the detailed itinerary & catalog on WhatsApp within 10 seconds.",
      consoleText: "WhatsApp Assistant fires: Pre-qualifies Aditya and keeps him warm immediately.",
      progress: "80%"
    },
    {
      step: 5,
      bubbleText: "A deal card is created in your CRM. Your sales team gets an alert to call and close!",
      consoleText: "CRM funnel updated: Sales team follows up to close the sale and handle travel operations.",
      progress: "100%"
    }
  ];

  let simInterval = null;
  let currentStepIdx = 0;

  function resetSimulation() {
    if (simInterval) clearInterval(simInterval);
    simInterval = null;
    currentStepIdx = 0;
    
    // Reset buttons and badges
    startBtn.disabled = false;
    startBtn.textContent = "[ Trace a Lead's Journey ]";
    badgeIndicator.classList.remove('active-sim');
    badgeIndicator.innerHTML = '<span class="pulse-dot"></span>Simulator Ready';
    
    // Reset steps visual classes
    steps.forEach(step => {
      step.classList.remove('active');
      const bubble = step.querySelector('.step-bubble');
      if (bubble) {
        bubble.classList.remove('show');
        const textSpan = bubble.querySelector('.bubble-text');
        if (textSpan) textSpan.textContent = '';
      }
    });

    // Reset progress line
    progressLine.style.width = '0%';
  }

  function runSimulationStep() {
    if (currentStepIdx >= simulationData.length) {
      // End of simulation
      clearInterval(simInterval);
      simInterval = null;
      consoleText.innerHTML = "<strong>Simulation Complete!</strong> Aditya is now a happy customer, and his trip operations are logged in the CRM. Click below to trace another lead's journey.";
      startBtn.disabled = false;
      startBtn.textContent = "[ Run Again ]";
      badgeIndicator.classList.remove('active-sim');
      badgeIndicator.innerHTML = '<span class="pulse-dot"></span>Finished';
      return;
    }

    const currentData = simulationData[currentStepIdx];
    
    // Deactivate previous steps' bubbles
    steps.forEach((step, idx) => {
      const bubble = step.querySelector('.step-bubble');
      if (bubble) bubble.classList.remove('show');
      
      // If we are past this step, keep it in an active track state
      if (idx < currentStepIdx) {
        step.classList.add('active');
      } else if (idx > currentStepIdx) {
        step.classList.remove('active');
      }
    });

    // Activate current step
    const currentStepEl = document.getElementById(`step-${currentData.step}`);
    if (currentStepEl) {
      currentStepEl.classList.add('active');
      
      const bubble = currentStepEl.querySelector('.step-bubble');
      if (bubble) {
        const textSpan = bubble.querySelector('.bubble-text');
        if (textSpan) textSpan.textContent = currentData.bubbleText;
        bubble.classList.add('show');
      }
      
      // Scroll smoothly to current step if needed (to keep in view)
      if (window.innerWidth < 768) {
        currentStepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Set progress bar width
    progressLine.style.width = currentData.progress;

    // Update console log
    consoleText.innerHTML = `<strong>Step 0${currentData.step}:</strong> ${currentData.consoleText}`;

    currentStepIdx++;
  }

  startBtn.addEventListener('click', () => {
    resetSimulation();
    
    startBtn.disabled = true;
    startBtn.textContent = "[ Simulating... ]";
    badgeIndicator.classList.add('active-sim');
    badgeIndicator.innerHTML = '<span class="pulse-dot"></span>Simulation Active';
    
    // Run first step immediately
    runSimulationStep();
    
    // Schedule subsequent steps
    simInterval = setInterval(runSimulationStep, 3500);
  });
}
