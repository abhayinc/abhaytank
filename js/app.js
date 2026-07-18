/**
 * Abhay Tank - Minimalist Portfolio Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
});

/**
 * Handles Light/Dark Theme Switching and Storage
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve current preference or fallback to system settings
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  // Set initial state
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggleBtn.textContent = '[mode: dark]';
  } else {
    document.documentElement.classList.remove('dark');
    themeToggleBtn.textContent = '[mode: light]';
  }

  // Handle toggling on click
  themeToggleBtn.addEventListener('click', () => {
    const isDarkNow = document.documentElement.classList.toggle('dark');
    const targetTheme = isDarkNow ? 'dark' : 'light';
    
    // Store user preference
    localStorage.setItem('theme', targetTheme);
    themeToggleBtn.textContent = `[mode: ${targetTheme}]`;
  });
}
