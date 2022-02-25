/* Utils: Form Submission - Disable. */
function disableEnterKey(event: KeyboardEvent): void {
  // Disable 'Enter' key on events.
  if (event.key === 'Enter') event.preventDefault();
}

function disableForm(formElement: HTMLFormElement): void {
  // Disable form submission.
  const form = formElement;
  form.style.pointerEvents = 'none';
  form.addEventListener('keypress', disableEnterKey);
}

function enableForm(formElement: HTMLFormElement): void {
  // Enable form submission.
  const form = formElement;
  form.style.pointerEvents = '';
  form.removeEventListener('keypress', disableEnterKey);
}

export { disableEnterKey, disableForm, enableForm };
