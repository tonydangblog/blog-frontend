/* Base (Sync): Dark Mode. */

function checkAndSetTheme(): void {
  /* Check and set HTML class and local storage theme before page render. */

  // eslint-disable-next-line dot-notation
  if (localStorage['theme'] === 'dark') {
    document.documentElement.classList.add('html--dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

function darkModeToggleListener(): void {
  /* Listen for dark mode toggles. */

  const toggle = document.getElementById('dark-mode-toggle');
  /* istanbul ignore else */
  if (toggle instanceof HTMLInputElement) {
    toggle.addEventListener('click', (): void => {
      // eslint-disable-next-line dot-notation
      if (localStorage['theme'] === 'light') {
        document.documentElement.classList.add('html--dark');
        toggle.checked = true;
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('html--dark');
        toggle.checked = false;
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

function setDarkModeToggle(
  _mutationList: MutationRecord[],
  observer: MutationObserver
): void {
  /* Set dark mode toggle position once present in DOM and disconnect observer. */

  const toggle = document.getElementById('dark-mode-toggle');
  /* istanbul ignore else */
  if (toggle instanceof HTMLInputElement) {
    // eslint-disable-next-line dot-notation
    if (localStorage['theme'] === 'dark') toggle.checked = true;
    else toggle.checked = false;
    observer.disconnect();
  }
}

function watchForDarkModeToggle(): void {
  /* Watch HTML element for child list mutations until dark mode toggle added to DOM. */

  const observer = new MutationObserver(setDarkModeToggle);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

export {
  checkAndSetTheme,
  darkModeToggleListener,
  setDarkModeToggle,
  watchForDarkModeToggle,
};
