/**
 * Abhay Tank - Minimalist Portfolio Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initISTClock();
});

/**
 * Handles Light/Dark Theme Switching and Storage across multiple buttons (mobile & desktop)
 */
function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-toggle');
  if (themeButtons.length === 0) return;

  // Retrieve current preference or fallback to system settings
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  // Utility to update all toggle button texts
  const updateButtons = (theme) => {
    themeButtons.forEach(btn => {
      btn.textContent = `[mode: ${theme}]`;
    });
  };

  // Set initial state
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateButtons('dark');
  } else {
    document.documentElement.classList.remove('dark');
    updateButtons('light');
  }

  // Handle toggling on click
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDarkNow = document.documentElement.classList.toggle('dark');
      const targetTheme = isDarkNow ? 'dark' : 'light';
      
      // Store user preference
      localStorage.setItem('theme', targetTheme);
      updateButtons(targetTheme);
    });
  });
}

/**
 * Live Clock that displays current time in IST (UTC+5:30)
 */
function initISTClock() {
  const timeElement = document.getElementById('ist-time');
  if (!timeElement) return;

  const updateClock = () => {
    const now = new Date();
    // Convert current time to UTC and offset to IST (UTC+5.5)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (3600000 * 5.5));

    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // 12-hour format conversion
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');

    timeElement.textContent = `${formattedHours}:${minutes} ${ampm}`;
  };

  updateClock();
  // Update every minute (60 seconds)
  setInterval(updateClock, 60000);
}


