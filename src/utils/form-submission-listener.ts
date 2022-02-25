/* Utils: Form Submission - Listener. */
import { disableForm } from './form-submission-disable';
import { postForm } from './form-submission-post';

function formSubmissionListener(
  formSelector: string,
  submitButtonSelector: string,
  sideEffects: Function,
  url: () => string,
  successHandler: Function,
  errorHandler: Function
): void {
  // Listen for and handle form submission.
  const form = document.querySelector(formSelector);
  const submitButton = document.querySelector(submitButtonSelector);
  if (form instanceof HTMLFormElement && submitButton) {
    submitButton.addEventListener('click', (e: Event): void => {
      e.preventDefault();
      disableForm(form);
      sideEffects();
      postForm(url(), form, successHandler, errorHandler);
    });
  }
}

export { formSubmissionListener };
