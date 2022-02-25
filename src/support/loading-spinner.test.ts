/* Support: Loading Spinner Tests. */
import { loadingSpinnerListener } from './loading-spinner';

describe('loadingSpinnerListener', () => {
  it('displays loading spinner when submit button is clicked', () => {
    expect.assertions(2);

    // GIVEN DOM and loadingSpinnerListener set.
    document.body.innerHTML = `
      <button class="button--center support__one-time__submit-button">
        <span class="button__text">SUPPORT $5</span>
        <img
          class="button__spinner"
          src="{{ static_file('gif/spinner.gif') }}"
          alt="loading spinner"
        />
      </button>
    `;
    const button = document.querySelector('.support__one-time__submit-button')!;
    const spinner = document.querySelector(
      '.support__one-time__submit-button img'
    ) as HTMLElement;
    loadingSpinnerListener();

    // WHEN Submit button is clicked.
    expect(spinner.style.display).toBe('');
    button.dispatchEvent(new Event('click'));

    // THEN Loading spinner is displayed.
    expect(spinner.style.display).toBe('inline');
  });
});
