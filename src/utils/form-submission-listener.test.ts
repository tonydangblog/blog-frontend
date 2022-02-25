/* Utils: Form Submission - Listener Tests. */
import { disableForm } from './form-submission-disable';
import { formSubmissionListener } from './form-submission-listener';
import { postForm } from './form-submission-post';

jest.mock('./form-submission-disable');
jest.mock('./form-submission-post');

describe('formSubmissionListener', () => {
  it('handles form submission', () => {
    expect.assertions(4);

    // GIVEN Form with submit button in DOM and formSubmissionListener set.
    document.body.innerHTML = `
      <form>
        <button></button>
      </form>
    `;
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button')!;
    const sideEffectsSpy = jest.fn();
    const successHandlerSpy = jest.fn();
    const errorHandlerSpy = jest.fn();
    formSubmissionListener(
      'form',
      'button',
      sideEffectsSpy,
      () => '/url',
      successHandlerSpy,
      errorHandlerSpy
    );

    // WHEN Form submit button is clicked.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    submitButton.dispatchEvent(event);

    // THEN preventDefault, disableForm, sideEffects, and postForm is called.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(disableForm).toHaveBeenCalledWith(form);
    expect(sideEffectsSpy).toHaveBeenCalledTimes(1);
    expect(postForm).toHaveBeenCalledWith(
      '/url',
      form,
      successHandlerSpy,
      errorHandlerSpy
    );
  });
  it('takes no action if form not present in DOM', () => {
    expect.assertions(1);

    // GIVEN Only submit button in DOM and formSubmissionListener set.
    document.body.innerHTML = '<button></button>';
    const submitButton = document.querySelector('button')!;
    formSubmissionListener('form', 'button', jest.fn, () => '/url', jest.fn, jest.fn);

    // WHEN Submit button is clicked.
    const event = new Event('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    submitButton.dispatchEvent(event);

    // THEN preventDefault is not called.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
  });
});
