/* Base: Copyright Year Tests. */
import { updateCopyrightYear } from './copyright-year';

describe('updateCopyrightYear', () => {
  it('updates current copyright year in DOM', () => {
    expect.assertions(2);

    // GIVEN DOM without copyright year.
    document.body.innerHTML = '<span class="site-footer__copyright-year"></span>';
    const copyrightYear = document.querySelector('.site-footer__copyright-year')!;
    expect(copyrightYear.innerHTML).toBe('');

    // WHEN updateCopyrightYear is called.
    updateCopyrightYear();

    // THEN Copyright year is present in DOM.
    expect(copyrightYear.innerHTML).toBe(`${new Date().getFullYear()}`);
  });
  it('takes no action if invalid copyright year span is present', () => {
    expect.assertions(2);

    // GIVEN DOM with invalid copyright span.
    document.body.innerHTML = '<span id="site-footer__copyright-year"></span>';
    const copyrightYear = document.querySelector('#site-footer__copyright-year')!;
    expect(copyrightYear.innerHTML).toBe('');

    // WHEN updateCopyrightYear is called.
    updateCopyrightYear();

    // THEN Copyright year is present in DOM.
    expect(copyrightYear.innerHTML).toBe('');
  });
});
