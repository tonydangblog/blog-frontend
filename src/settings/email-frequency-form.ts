/* Settings: Email Frequency Form. */
import { flash } from '../common/message-flashing';
import { startSpinner, stopSpinner } from '../common/spinner';
import { formSubmissionListener } from '../utils/form-submission-listener';

interface Data {
  mailing_list?: string[]; // eslint-disable-line camelcase
}

function successHandler(data: Data): void {
  /* Success handler for email frequency form. */
  stopSpinner('#settings__email-frequency-form .button__spinner');
  if (Object.keys(data).length === 0) {
    flash('Your email frequency preference has been updated!');
  } else if (data.mailing_list && data.mailing_list[0]) {
    flash(data.mailing_list[0]);
  }
}

function emailFrequencyFormListener(): void {
  /* Listen for email frequency form submission. */
  formSubmissionListener(
    '#settings__email-frequency-form',
    '#settings__email-frequency-form button',
    () => startSpinner('#settings__email-frequency-form .button__spinner'),
    () => '/account/update-email-frequency',
    successHandler,
    flash
  );
}

export { successHandler, emailFrequencyFormListener };
