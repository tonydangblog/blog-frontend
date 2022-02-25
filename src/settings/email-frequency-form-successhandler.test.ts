/* Settings: Email Frequency Form - successHandler Tests. */
import { startSpinner } from '../common/spinner';
import { successHandler } from './email-frequency-form';
import { setupDOM } from './email-frequency-form.setup';

describe('successHandler', () => {
  it.each`
    data                                        | expectedMsg
    ${{}}                                       | ${'Your email frequency preference has been updated!'}
    ${{ mailing_list: ['mailing list error'] }} | ${'mailing list error'}
    ${{ unknown: ['unknown error'] }}           | ${''}
  `('handles successful return data from server', ({ data, expectedMsg }) => {
    expect.assertions(3);

    // GIVEN DOM with email frequency form and started spinner.
    const dom = setupDOM();
    startSpinner('#settings__email-frequency-form .button__spinner');
    expect(dom.spinner.style.display).toBe('inline');

    // WHEN successHandler is called with successful response data.
    successHandler(data);

    // THEN Loading spinner is stopped.
    expect(dom.spinner.style.display).toBe('none');
    // AND Message is flashed.
    expect(document.body.innerHTML).toContain(expectedMsg);
  });
});
