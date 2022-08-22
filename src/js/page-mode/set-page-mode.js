export const setPageMode = mode => {
  bodyClassRef = document.body.classList;
  switchRef = document.querySelector('[data-mode_switch]');

  if (mode === 'light' && bodyClassRef.contains('dark-mode')) {
    bodyClassRef.remove('dark-mode');
    switchRef.checked = false;
    return;
  }

  if (mode === 'dark' && !bodyClassRef.contains('dark-mode')) {
    bodyClassRef.add('dark-mode');
    switchRef.checked = true;
  }

  if (!bodyClassRef.contains('isLoaded'))
    setTimeout(() => bodyClassRef.add('isLoaded'), 250);
};
