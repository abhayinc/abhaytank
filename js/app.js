/**
 * Abhay Tank - Minimalist Portfolio Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
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
