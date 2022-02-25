/* Base: Copyright Year. */
function updateCopyrightYear(): void {
  // Display current copyright year.
  const copyrightYear = document.querySelector('.site-footer__copyright-year');
  if (copyrightYear) copyrightYear.innerHTML = `${new Date().getFullYear()}`;
}

export { updateCopyrightYear };
