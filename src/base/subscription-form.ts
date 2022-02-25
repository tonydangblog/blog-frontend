/* Base: Subscription Form. */
import { flash } from '../common/message-flashing';
import { startSpinner, stopSpinner } from '../common/spinner';
import { formSubmissionListener } from '../utils/form-submission-listener';

interface Data {
  name?: string[];
  email?: string[];
}

function successHandler(data: Data): void {
  // Success handler for subscription form.
  stopSpinner('.subscription-form .button__spinner');
  const name = document.querySelector('.subscription-form__name');
  const email = document.querySelector('.subscription-form__email');
  if (
    Object.keys(data).length === 0 &&
    name instanceof HTMLInputElement &&
    email instanceof HTMLInputElement
  ) {
    name.value = '';
    email.value = '';
    flash(`Thank you for signing up for my mailing list! Please check for a
           confirmation sent to your inbox to verify your email.`);
  } else if (data.name && data.name[0]) {
    flash(data.name[0]);
  } else if (data.email && data.email[0]) {
    flash(data.email[0]);
  }
}

function subscriptionFormListener(): void {
  // Listen for subscription form submission.
  formSubmissionListener(
    '.subscription-form',
    '.subscription-form button',
    () => startSpinner('.subscription-form .button__spinner'),
    () => '/subscription/subscription-form',
    successHandler,
    flash
  );
}

export { subscriptionFormListener, successHandler };
