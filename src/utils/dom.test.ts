/* Utils: DOM Tests. */
import { addClassesOn, disableKeysOn, focusOn } from './dom';
import { sleep } from './time';

describe('addClassesOn', () => {
  it.each`
    element   | rootClassName
    ${'html'} | ${'class0 class1 class2'}
    ${'div'}  | ${'class0'}
  `('adds temporary class(es) to an element', async ({ element, rootClassName }) => {
    expect.assertions(2);

    // GIVEN Root element with existing class.
    document.documentElement.classList.add('class0');

    // WHEN Additional classes are added to an element with optional milliseconds.
    addClassesOn(element, ['class1', 'class2'], 500);

    // THEN Element has new classes if element exists.
    expect(document.documentElement.className).toBe(rootClassName);

    // AND Newly added classes are removed after given milliseconds.
    await sleep(500);
    expect(document.documentElement.className).toBe('class0');
  });
});

describe('disableKeysOn', () => {
  it.each`
    element   | preventDefaultCalls
    ${'body'} | ${2}
    ${'div'}  | ${0}
  `('disables keys on an HTMLElement', ({ element, preventDefaultCalls }) => {
    expect.assertions(1);

    // GIVEN DOM with certain keys disabled on an element.
    disableKeysOn(element, ['Enter', 'x']);

    // WHEN Keypress events are dispatched.
    const event = new Event('keypress');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    Object.defineProperty(event, 'key', { value: 'Enter', writable: true });
    document.body.dispatchEvent(event);
    Object.defineProperty(event, 'key', { value: 'x', writable: true });
    document.body.dispatchEvent(event);
    Object.defineProperty(event, 'key', { value: 't', writable: true });
    document.body.dispatchEvent(event);

    // THEN preventDefault is called if element exists and a disabled key is dispatched.
    expect(preventDefaultSpy).toHaveBeenCalledTimes(preventDefaultCalls);
  });
});

describe('focusOn', () => {
  it.each`
    elementToFocusOn | expectedElementWithFocus
    ${'input'}       | ${() => document.querySelector('input')}
    ${'div'}         | ${() => document.querySelector('body')}
  `(
    'puts focus on an HTMLElement',
    ({ elementToFocusOn, expectedElementWithFocus }) => {
      expect.assertions(2);

      // GIVEN DOM with HTMLElement that can be focused on.
      document.body.innerHTML = '<input>';
      expect(document.body).toBe(document.activeElement);

      // WHEN focusOn is called on an HTMLElement.
      focusOn(elementToFocusOn);

      // THEN The HTMLElement has focus if it exists else focus stays on body.
      expect(document.activeElement).toBe(expectedElementWithFocus());
    }
  );
});
