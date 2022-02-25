/* Settings: Info Update Form infoUpdateFormListener Tests. */
import { flash } from '../common/message-flashing';
import { startSpinner } from '../common/spinner';
import { disableForm } from '../utils/form-submission-disable';
import { postForm } from '../utils/form-submission-post';
import { infoUpdateFormListener, successHandler } from './info-update-form';
import { setupDOM } from './info-update-form.setup';

jest.mock('../common/spinner');
jest.mock('../utils/form-submission-disable');
jest.mock('../utils/form-submission-post');

describe('infoUpdateFormListener', () => {
  it('handles info update form submission', () => {
    expect.assertions(4);

    // GIVEN DOM with info update form and infoUpdateFormListener.
    const dom = setupDOM();
    infoUpdateFormListener();

    // WHEN Form is submitted.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    dom.button.dispatchEvent(event);

    // THEN Form submission is handled by formSubmissionListener.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(disableForm).toHaveBeenCalledWith(dom.form);
    expect(startSpinner).toHaveBeenCalledWith('#info-update-form .button__spinner');
    expect(postForm).toHaveBeenCalledWith(
      '/account/info-update',
      dom.form,
      successHandler,
      flash
    );
  });
});
