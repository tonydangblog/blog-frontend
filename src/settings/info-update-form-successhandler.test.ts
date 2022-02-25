/* Settings: Info Update Form - successHandler Tests. */
import { startSpinner } from '../common/spinner';
import { successHandler } from './info-update-form';
import { setupDOM } from './info-update-form.setup';

describe('successHandler', () => {
  const ogName = '{{ current_user.preferred_name }}';
  const successMsg = 'Your info has been saved!';
  const nameError = { name: ['name error'] };
  const pNameError = { preferred_name: ['preferred name error'] };
  const unknownError = { unknown: ['unknown error'] };
  it.each`
    data            | inputName | inputPName | expectedPName | expectedH1 | expectedMsg
    ${{}}           | ${'Tony'} | ${'Stoic'} | ${'Stoic'}    | ${'Stoic'} | ${successMsg}
    ${{}}           | ${'Tony'} | ${''}      | ${'Tony'}     | ${'Tony'}  | ${successMsg}
    ${nameError}    | ${'Tony'} | ${'Stoic'} | ${'Stoic'}    | ${ogName}  | ${nameError.name[0]}
    ${pNameError}   | ${'Tony'} | ${''}      | ${''}         | ${ogName}  | ${pNameError.preferred_name[0]}
    ${unknownError} | ${'Tony'} | ${''}      | ${''}         | ${ogName}  | ${''}
  `(
    'handles successful return data from server',
    ({ data, inputName, inputPName, expectedPName, expectedH1, expectedMsg }) => {
      expect.assertions(5);

      // GIVEN DOM with info update form, started spinner, and name & preferred name inputs.
      const dom = setupDOM();
      startSpinner('#info-update-form .button__spinner');
      expect(dom.spinner.style.display).toBe('inline');
      dom.name.value = inputName;
      dom.preferredName.value = inputPName;

      // WHEN successHandler is called with successful response data.
      successHandler(data);

      // THEN Loading spinner is stopped.
      expect(dom.spinner.style.display).toBe('none');
      // AND Preferred name and h1 are properly set.
      expect(dom.preferredName.value).toBe(expectedPName);
      expect(dom.h1.innerHTML).toBe(`Hi ${expectedH1} 👋`);
      // AND Message is flashed.
      expect(document.body.innerHTML).toContain(expectedMsg);
    }
  );
  it('takes no action if h1 or name/preferred_name input is missing from DOM', () => {
    expect.assertions(1);
    // GIVEN DOM with info update form, h1, and preferred name, but name input missing.
    const dom = setupDOM();
    dom.preferredName.value = 'asdfghjkl';
    dom.name.remove();

    // WHEN successHandler is called with successful response data.
    successHandler({});

    // THEN Name is not reset.
    expect(dom.h1.innerHTML).toBe('Hi {{ current_user.preferred_name }} 👋');
  });
});
