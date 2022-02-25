/* Settings: Account Deletion Form. */
import { flash } from '../common/message-flashing';
import { startSpinner, stopSpinner } from '../common/spinner';
import { formSubmissionListener } from '../utils/form-submission-listener';

interface Data {
  email?: string[];
}

function successHandler(data: Data): void {
  // Success handler for account deletion form.
  stopSpinner('#delete-form .button__spinner');
  if (Object.keys(data).length === 0) window.location.replace('/auth/register');
  else if (data.email && data.email[0]) flash(data.email[0]);
}

function accountDeletionFormListener(): void {
  // Listen for account deletion form submission.
  formSubmissionListener(
    '#delete-form',
    '#delete-form button',
    () => startSpinner('#delete-form .button__spinner'),
    () => '/account/delete',
    successHandler,
    flash
  );
}

export { accountDeletionFormListener, successHandler };
