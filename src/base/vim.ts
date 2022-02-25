/* Base: Vim. */
function vimBindingsListener(): void {
  // Listen for Vim keypresses.
  let cache: string;
  document.addEventListener('keypress', (e: KeyboardEvent): void => {
    if (document.activeElement !== document.body) return;
    if (e.key === 'g' && cache === 'g') {
      window.scrollTo(0, 0);
    } else if (e.key === 'G') {
      window.scrollTo(0, document.body.scrollHeight);
    } else if (e.key === 'j') {
      window.scrollBy(0, 50);
    } else if (e.key === 'k') {
      window.scrollBy(0, -50);
    } else {
      cache = e.key;
      return;
    }
    cache = '';
  });
}

export { vimBindingsListener };
