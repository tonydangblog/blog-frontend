/* Settings: Account Deletion Form successHandler Tests. */
import { startSpinner } from '../common/spinner';
import { successHandler } from './account-deletion-form';
import { setupDOM } from './account-deletion-form.setup';

describe('successHandler', () => {
  it('handles successful return data from server', () => {
    expect.assertions(3);

    // GIVEN DOM with account deletion form and started spinner.
    const dom = setupDOM();
    startSpinner('#delete-form .button__spinner');
    expect(dom.spinner.style.display).toBe('inline');

    // WHEN successHandler is called with successful response data.
    successHandler({});

    // THEN Loading spinner is stopped.
    expect(dom.spinner.style.display).toBe('none');
    // AND Window is refreshed for Flask flash message.
    expect(window.location.replace).toHaveBeenCalledWith('/auth/register');
  });
  it.each`
    data                              | expectedMsg
    ${{ email: ['email error'] }}     | ${'email error'}
    ${{ unknown: ['unknown error'] }} | ${''}
  `('handles form error returned from server', ({ data, expectedMsg }) => {
    expect.assertions(3);

    // GIVEN DOM with account deletion form and started spinner.
    const dom = setupDOM();
    startSpinner('#delete-form .button__spinner');
    expect(dom.spinner.style.display).toBe('inline');

    // WHEN successHandler is called with error response.
    successHandler(data);

    // THEN Loading spinner is stopped.
    expect(dom.spinner.style.display).toBe('none');
    // AND Error message is flashed.
    expect(document.body.innerHTML).toContain(expectedMsg);
  });
});
