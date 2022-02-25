/* Base: Subscription Form successHandler Tests. */
import { startSpinner } from '../common/spinner';
import { successHandler } from './subscription-form';
import { setupDOM } from './subscription-form.setup';

describe('successHandler', () => {
  const successMsg = `Thank you for signing up for my mailing list! Please check for a
           confirmation sent to your inbox to verify your email.`;
  const nameError = { name: ['name error'] };
  const emailError = { email: ['email error'] };
  const unknownError = { unknown: ['unknown error'] };
  it.each`
    data            | initialName | initialEmail | expectedName | expectedEmail | expectedMsg
    ${{}}           | ${'Tony'}   | ${'t@t.t'}   | ${''}        | ${''}         | ${successMsg}
    ${nameError}    | ${'Tony'}   | ${'t@t.t'}   | ${'Tony'}    | ${'t@t.t'}    | ${nameError.name[0]}
    ${emailError}   | ${'Tony'}   | ${'t@t.t'}   | ${'Tony'}    | ${'t@t.t'}    | ${emailError.email[0]}
    ${unknownError} | ${'Tony'}   | ${'t@t.t'}   | ${'Tony'}    | ${'t@t.t'}    | ${''}
  `(
    'handles successful return data from server',
    ({ data, initialName, initialEmail, expectedName, expectedEmail, expectedMsg }) => {
      expect.assertions(5);

      // GIVEN DOM with subscription form, started spinner, and name & email inputs.
      const dom = setupDOM();
      startSpinner('.subscription-form .button__spinner');
      expect(dom.spinner.style.display).toBe('inline');
      dom.name.value = initialName;
      dom.email.value = initialEmail;

      // WHEN successHandler is called with successful response data.
      successHandler(data);

      // THEN Loading spinner is stopped.
      expect(dom.spinner.style.display).toBe('none');
      // AND Name & email is reset if needed.
      expect(dom.name.value).toBe(expectedName);
      expect(dom.email.value).toBe(expectedEmail);
      // AND Message is flashed.
      expect(document.body.innerHTML).toContain(expectedMsg);
    }
  );
  it('takes no action if name/email input is missing from DOM', () => {
    expect.assertions(1);
    // GIVEN DOM with subscription form with name, but email input missing.
    const dom = setupDOM();
    dom.name.value = 'Tony';
    dom.email.remove();

    // WHEN successHandler is called with successful response data.
    successHandler({});

    // THEN Name is not reset.
    expect(dom.name.value).toBe('Tony');
  });
});
