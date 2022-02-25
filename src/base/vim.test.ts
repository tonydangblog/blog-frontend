/* Base: Vim Tests. */
import { vimBindingsListener } from './vim';

describe('vimBindingsListener', () => {
  it('does not scroll if activeElement is not body', () => {
    expect.assertions(2);

    // GIVEN DOM with vimBindingsListener and focus NOT on body.
    document.body.innerHTML = '<input type="text" />';
    vimBindingsListener();
    document.querySelector('input')!.focus();
    expect(document.activeElement).not.toBe(document.body);

    // WHEN Registered key is entered.
    const event = new Event('keypress');
    Object.defineProperty(event, 'key', { value: 'G' });
    document.dispatchEvent(event);

    // THEN Corresponding window scroll function is NOT called.
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
  it.each`
    key    | times | method        | arg1 | arg2
    ${'g'} | ${2}  | ${'scrollTo'} | ${0} | ${0}
    ${'G'} | ${1}  | ${'scrollTo'} | ${0} | ${document.body.scrollHeight}
    ${'j'} | ${1}  | ${'scrollBy'} | ${0} | ${50}
    ${'k'} | ${1}  | ${'scrollBy'} | ${0} | ${-50}
  `('registers vim scroll bindings', ({ key, times, method, arg1, arg2 }) => {
    expect.assertions(2);

    // GIVEN DOM with vimBindingsListener and focus on body.
    vimBindingsListener();
    expect(document.activeElement).toBe(document.body);

    // WHEN Registered keys are entered.
    const event = new Event('keypress');
    Object.defineProperty(event, 'key', { value: key });
    let i = times;
    while (i) {
      document.dispatchEvent(event);
      i -= 1;
    }

    // THEN Corresponding window scroll function is called.
    const scrollMethod = method === 'scrollTo' ? window.scrollTo : window.scrollBy;
    expect(scrollMethod).toHaveBeenCalledWith(arg1, arg2);
  });
});
