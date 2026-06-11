/**
 * TourismMarketier — Minimalist Interactive Workspace Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initContactForm();
  initPortfolioModal();
  initScrollspyTOC();
});

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
 * 2. Contact Form Custom Submit States
 */
function initContactForm() {
  const form = document.getElementById('tm-notion-form');
  const resultMsg = document.querySelector('.form-feedback-message');
  
  if (!form || !resultMsg) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.textContent.trim();
    
    // UI Loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    
    const name = document.getElementById('form-name').value;
    
    setTimeout(() => {
      // Success state UI changes
      submitBtn.textContent = 'Submitted';
      
      resultMsg.innerHTML = `✓ Request submitted. Thank you, <strong>${name}</strong>. I will review your details shortly.`;
      resultMsg.className = 'form-feedback-message success';
      resultMsg.style.display = 'block';
      
      form.reset();
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        resultMsg.style.display = 'none';
      }, 5000);
      
    }, 1000);
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
 * 4. TOC Scrollspy Observer
 */
function initScrollspyTOC() {
  const sections = document.querySelectorAll('.workspace-section');
  const tocLinks = document.querySelectorAll('#toc-links a');
  
  if (sections.length === 0 || tocLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is around top-middle of page
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}
