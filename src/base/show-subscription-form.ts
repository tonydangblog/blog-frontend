/* Base: Show Subscription Form. */
import { addClassesOn } from '../utils/dom';

function showSubscriptionFormListener(): void {
  // Scroll to and highlight subscription form when subscription form link is clicked.
  const subscriptionFormLink = document.getElementById('subscription-form-link');
  const subscriptionForm = document.getElementById('subscription-form');
  if (subscriptionFormLink && subscriptionForm) {
    subscriptionFormLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      addClassesOn('html', ['html--smooth-scroll'], 500);
      subscriptionForm.scrollIntoView();
      addClassesOn('.subscription-form', ['subscription-form--highlight'], 500);
    });
  }
}

export { showSubscriptionFormListener };
