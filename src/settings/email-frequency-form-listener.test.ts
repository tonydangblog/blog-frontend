/* Settings: Email Frequency Form - emailFrequencyFormListener Tests. */
import { flash } from '../common/message-flashing';
import { startSpinner } from '../common/spinner';
import { disableForm } from '../utils/form-submission-disable';
import { postForm } from '../utils/form-submission-post';
import { emailFrequencyFormListener, successHandler } from './email-frequency-form';
import { setupDOM } from './email-frequency-form.setup';

jest.mock('../common/spinner');
jest.mock('../utils/form-submission-disable');
jest.mock('../utils/form-submission-post');

describe('emailFrequencyFormListener', () => {
  it('handles email frequency form submission', () => {
    expect.assertions(4);

    // GIVEN DOM with email frequency form and emailFrequencyFormListener.
    const dom = setupDOM();
    emailFrequencyFormListener();

    // WHEN Form is submitted.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    dom.button.dispatchEvent(event);

    // THEN Form submission is handled by formSubmissionListener.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(disableForm).toHaveBeenCalledWith(dom.form);
    expect(startSpinner).toHaveBeenCalledWith(
      '#settings__email-frequency-form .button__spinner'
    );
    expect(postForm).toHaveBeenCalledWith(
      '/account/update-email-frequency',
      dom.form,
      successHandler,
      flash
    );
  });
});
