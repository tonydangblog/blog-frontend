/* Common: Spinner. */
function startSpinner(selector: string): void {
  // Start loading spinner.
  const spinner = document.querySelector(selector);
  if (spinner instanceof HTMLElement) spinner.style.display = 'inline';
}

function stopSpinner(selector: string): void {
  // Stop loading spinner.
  const spinner = document.querySelector(selector);
  if (spinner instanceof HTMLElement) spinner.style.display = 'none';
}

export { startSpinner, stopSpinner };
