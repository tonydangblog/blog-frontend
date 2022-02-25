/* Settings: Account Deletion Form - accountDeletionFormListener Tests. */
import { flash } from '../common/message-flashing';
import { startSpinner } from '../common/spinner';
import { disableForm } from '../utils/form-submission-disable';
import { postForm } from '../utils/form-submission-post';
import { accountDeletionFormListener, successHandler } from './account-deletion-form';
import { setupDOM } from './account-deletion-form.setup';

jest.mock('../common/spinner');
jest.mock('../utils/form-submission-disable');
jest.mock('../utils/form-submission-post');

describe('accountDeletionFormListener', () => {
  it('handles account deletion form submission', () => {
    expect.assertions(4);

    // GIVEN DOM with account deletion form and accountDeletionFormListener.
    const dom = setupDOM();
    accountDeletionFormListener();

    // WHEN Form is submitted.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    dom.button.dispatchEvent(event);

    // THEN Form submission is handled by formSubmissionListener.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(disableForm).toHaveBeenCalledWith(dom.form);
    expect(startSpinner).toHaveBeenCalledWith('#delete-form .button__spinner');
    expect(postForm).toHaveBeenCalledWith(
      '/account/delete',
      dom.form,
      successHandler,
      flash
    );
  });
});
