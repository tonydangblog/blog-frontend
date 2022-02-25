/* Settings: Info Update Form. */
import { flash } from '../common/message-flashing';
import { startSpinner, stopSpinner } from '../common/spinner';
import { formSubmissionListener } from '../utils/form-submission-listener';

interface Data {
  name?: string[];
  preferred_name?: string[]; // eslint-disable-line camelcase
}

function successHandler(data: Data): void {
  // Success handler for info update form.
  stopSpinner('#info-update-form .button__spinner');
  const h1 = document.querySelector('h1');
  const name = document.getElementById('info-update-form__name');
  const preferredName = document.getElementById('info-update-form__preferred-name');
  if (
    Object.keys(data).length === 0 &&
    h1 &&
    name instanceof HTMLInputElement &&
    preferredName instanceof HTMLInputElement
  ) {
    if (preferredName.value === '') {
      [preferredName.value] = name.value.split(' ') as [string, ...string[]];
    }
    h1.innerHTML = `Hi ${preferredName.value} &#x1F44B;`;
    flash('Your info has been saved!');
  } else if (data.name && data.name[0]) {
    flash(data.name[0]);
  } else if (data.preferred_name && data.preferred_name[0]) {
    flash(data.preferred_name[0]);
  }
}

function infoUpdateFormListener(): void {
  // Listen for info update form submission.
  formSubmissionListener(
    '#info-update-form',
    '#info-update-form button',
    () => startSpinner('#info-update-form .button__spinner'),
    () => '/account/info-update',
    successHandler,
    flash
  );
}

export { infoUpdateFormListener, successHandler };
