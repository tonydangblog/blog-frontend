/* Base: Show Subscription Form Tests. */
import { sleep } from '../utils/time';
import { showSubscriptionFormListener } from './show-subscription-form';

describe('showSubscriptionFormListener', () => {
  it('scrolls to and highlights subscription form', async () => {
    expect.assertions(6);

    // GIVEN DOM with subscription form link, subscription form, and
    //       showSubscriptionFormListener.
    document.body.innerHTML = `
      <a id="subscription-form-link" href="#subscription-form">mailing list</a>
      <form id="subscription-form" class="subscription-form" autocomplete="on"></form>
    `;
    const link = document.getElementById('subscription-form-link')!;
    const form = document.getElementById('subscription-form')!;
    showSubscriptionFormListener();

    // WHEN Subscription form link is clicked.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    link.dispatchEvent(event);

    // THEN Subscription form is visible and highlighted.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(document.documentElement.className).toBe('html--smooth-scroll');
    expect(form.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(form.className).toBe('subscription-form subscription-form--highlight');

    // AND Added classes are removed after 500 milliseconds.
    await sleep(500);
    expect(document.documentElement.className).toBe('');
    expect(form.className).toBe('subscription-form');
  });
  it('takes no action if subscription form not present', () => {
    expect.assertions(1);

    // GIVEN DOM with only subscription form link and showSubscriptionFormListener.
    document.body.innerHTML = `
      <a id="subscription-form-link" href="#subscription-form">mailing list</a>
    `;
    const link = document.getElementById('subscription-form-link')!;
    showSubscriptionFormListener();

    // WHEN Subscription form link is clicked.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    link.dispatchEvent(event);

    // THEN Subscription form is visible and highlighted.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
  });
});
