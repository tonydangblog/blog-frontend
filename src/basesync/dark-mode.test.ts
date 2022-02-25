/* Base (Sync): Dark Mode Tests. */
import { sleep } from '../utils/time';
import {
  checkAndSetTheme,
  darkModeToggleListener,
  setDarkModeToggle,
  watchForDarkModeToggle,
} from './dark-mode';

function setupDOM() {
  document.body.innerHTML = `
    <div class="site-header__dark-mode-toggle">
      <div class="toggle">
        <input id="dark-mode-toggle" class="toggle__checkbox" type="checkbox" />
        <label for="dark-mode-toggle" class="toggle__label"></label>
      </div>
    </div>
  `;
  return {
    toggle: document.getElementById('dark-mode-toggle') as HTMLInputElement,
  };
}

describe('checkAndSetTheme', () => {
  it.each`
    initialTheme   | expectedClass   | expectedTheme
    ${undefined}   | ${''}           | ${'light'}
    ${'dark'}      | ${'html--dark'} | ${'dark'}
    ${'light'}     | ${''}           | ${'light'}
    ${'asdfghjkl'} | ${''}           | ${'light'}
  `(
    'check localStorage theme and set html class and localStorage theme accordingly',
    ({ initialTheme, expectedClass, expectedTheme }) => {
      expect.assertions(2);

      // GIVEN Theme set in localStorage.
      localStorage.setItem('theme', initialTheme);

      // WHEN checkAndSetTheme is called.
      checkAndSetTheme();

      // THEN Expected class and theme is set.
      expect(document.documentElement.className).toBe(expectedClass);
      // eslint-disable-next-line dot-notation
      expect(localStorage['theme']).toBe(expectedTheme);
    }
  );
});

describe('darkModeToggleListener', () => {
  it.each`
    initialTheme   | expectedClass   | expectedChecked | expectedTheme
    ${undefined}   | ${''}           | ${false}        | ${'light'}
    ${'light'}     | ${'html--dark'} | ${true}         | ${'dark'}
    ${'dark'}      | ${''}           | ${false}        | ${'light'}
    ${'asdfghjkl'} | ${''}           | ${false}        | ${'light'}
  `(
    'handles dark mode theme switching',
    ({ initialTheme, expectedClass, expectedChecked, expectedTheme }) => {
      expect.assertions(3);

      // GIVEN Theme in localStorage, dark mode toggle in DOM, and
      //       darkModeToggleListener.
      localStorage.setItem('theme', initialTheme);
      const dom = setupDOM();
      darkModeToggleListener();

      // WHEN Dark mode toggle is clicked.
      dom.toggle.dispatchEvent(new Event('click'));

      // THEN Theme, HTML class, and toggle checked boolean is updated.
      expect(document.documentElement.className).toBe(expectedClass);
      expect(dom.toggle.checked).toBe(expectedChecked);
      // eslint-disable-next-line dot-notation
      expect(localStorage['theme']).toBe(expectedTheme);
    }
  );
});

describe('setDarkModeToggle', () => {
  it.each`
    theme          | expected
    ${undefined}   | ${false}
    ${'dark'}      | ${true}
    ${'light'}     | ${false}
    ${'asdfghjkl'} | ${false}
  `('sets dark mode toggle', ({ theme, expected }) => {
    expect.assertions(1);

    // GIVEN Theme in localStorage and dark mode toggle in DOM.
    localStorage.setItem('theme', theme);
    const dom = setupDOM();

    // WHEN setDarkModeToggle is called.
    setDarkModeToggle([], new MutationObserver(setDarkModeToggle));

    // THEN Dark mode toggle checkbox is checked if theme is 'dark'.
    expect(dom.toggle.checked).toBe(expected);
  });
});

describe('watchForDarkModeToggle', () => {
  it.each`
    theme          | expected
    ${undefined}   | ${false}
    ${'dark'}      | ${true}
    ${'light'}     | ${false}
    ${'asdfghjkl'} | ${false}
  `('calls setDarkModeToggle on DOM mutation', async ({ theme, expected }) => {
    expect.assertions(2);

    // GIVEN Theme in localStorage and watchForDarkModeToggle observer.
    localStorage.setItem('theme', theme);
    watchForDarkModeToggle();

    // WHEN Dark mode toggle is added to the DOM.
    let dom = setupDOM();
    await sleep(1); // Wait for mutation to be handled.

    // THEN Observer calls setDarkModeToggle, resulting in toggle being checked.
    expect(dom.toggle.checked).toBe(expected);

    // AND Observer is disconnected.
    dom = setupDOM();
    await sleep(1); // Wait for mutation to be handled.
    expect(dom.toggle.checked).toBe(false);
  });
});
