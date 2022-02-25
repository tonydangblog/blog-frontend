/* Utils: Form Submission - Disable Tests. */
import { disableEnterKey, disableForm, enableForm } from './form-submission-disable';

describe('disableEnterKey', () => {
  it.each`
    key        | preventDefaultCalls
    ${'Enter'} | ${1}
    ${'x'}     | ${0}
  `('disables event enter key', ({ key, preventDefaultCalls }) => {
    expect.assertions(1);

    // GIVEN Keypress event.
    const event = new Event('keypress');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    Object.defineProperty(event, 'key', { value: key });

    // WHEN Event is passed to disableEnterKey.
    disableEnterKey(event as KeyboardEvent);

    // THEN preventDefault is called if key is 'Enter'.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(preventDefaultCalls);
  });
});

describe('disableForm', () => {
  it('disables form submission', () => {
    expect.assertions(2);

    // GIVEN Form.
    const form = document.createElement('form');

    // WHEN Form is disabled.
    const addEventListenerSpy = jest.spyOn(form, 'addEventListener');
    disableForm(form);

    // THEN Form submission is disabled.
    expect(form.style.pointerEvents).toBe('none');
    expect(addEventListenerSpy).toHaveBeenCalledWith('keypress', disableEnterKey);
  });
});

describe('enableForm', () => {
  it('enables form submission', () => {
    expect.assertions(2);

    // GIVEN Form.
    const form = document.createElement('form');
    form.style.pointerEvents = 'none';

    // WHEN Form is enabled.
    const removeEventListenerSpy = jest.spyOn(form, 'removeEventListener');
    enableForm(form);

    // THEN Form submission is disabled.
    expect(form.style.pointerEvents).toBe('');
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keypress', disableEnterKey);
  });
});
