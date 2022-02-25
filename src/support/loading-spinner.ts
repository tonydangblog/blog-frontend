/* Support: Loading Spinner. */
function loadingSpinnerListener(): void {
  /* Start loading spinner when submit button is clicked. */
  const button = document.querySelector('.support__one-time__submit-button');
  const spinner = document.querySelector('.support__one-time__submit-button img');
  /* istanbul ignore else */
  if (button && spinner instanceof HTMLElement) {
    button.addEventListener('click', (): void => {
      spinner.style.display = 'inline';
    });
  }
}

export { loadingSpinnerListener };
