/* Base: Subscription Form subscriptionFormListener Tests. */
import { flash } from '../common/message-flashing';
import { startSpinner } from '../common/spinner';
import { disableForm } from '../utils/form-submission-disable';
import { postForm } from '../utils/form-submission-post';
import { subscriptionFormListener, successHandler } from './subscription-form';
import { setupDOM } from './subscription-form.setup';

jest.mock('../common/spinner');
jest.mock('../utils/form-submission-disable');
jest.mock('../utils/form-submission-post');

describe('subscriptionFormListener', () => {
  it('handles subscription form submission', () => {
    expect.assertions(4);

    // GIVEN DOM with subscription form and subscriptionFormListener.
    const dom = setupDOM();
    subscriptionFormListener();

    // WHEN Form is submitted.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    dom.button.dispatchEvent(event);

    // THEN Form submission is handled by formSubmissionListener.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(disableForm).toHaveBeenCalledWith(dom.form);
    expect(startSpinner).toHaveBeenCalledWith('.subscription-form .button__spinner');
    expect(postForm).toHaveBeenCalledWith(
      '/subscription/subscription-form',
      dom.form,
      successHandler,
      flash
    );
  });
});
