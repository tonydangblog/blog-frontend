/* Common: Spinner Tests. */
import { startSpinner, stopSpinner } from './spinner';

function setupDOM() {
  document.body.innerHTML = `
    <img
      class="button__spinner"
      src="{{ static_file('gif/spinner.gif') }}"
      alt="loading spinner"
    />
  `;
  return {
    spinner: document.querySelector('.button__spinner') as HTMLElement,
  };
}

describe('startSpinner', () => {
  it.each`
    selector              | expected
    ${'.button__spinner'} | ${'inline'}
    ${'#button__spinner'} | ${'none'}
  `('displays loading spinner in DOM', ({ selector, expected }) => {
    expect.assertions(1);

    // GIVEN DOM with spinner NOT displayed.
    const dom = setupDOM();
    dom.spinner.style.display = 'none';

    // WHEN startSpinner is called with selector.
    startSpinner(selector);

    // THEN Spinner gif is displayed in DOM if correct selector was used.
    expect(dom.spinner.style.display).toBe(expected);
  });
});

describe('stopSpinner', () => {
  it.each`
    selector              | expected
    ${'.button__spinner'} | ${'none'}
    ${'#button__spinner'} | ${'inline'}
  `('removes loading spinner from DOM', ({ selector, expected }) => {
    expect.assertions(1);

    // GIVEN DOM with spinner img displayed.
    const dom = setupDOM();
    dom.spinner.style.display = 'inline';

    // WHEN stopSpinner is called.
    stopSpinner(selector);

    // THEN Spinner gif is hidden from DOM.
    expect(dom.spinner.style.display).toBe(expected);
  });
});
