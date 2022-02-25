/* Jest Setup. */
import fetchMock from 'jest-fetch-mock';
import MockDate from 'mockdate';

function clearDOM(): void {
  /* Clear physical DOM. */
  const html = document.documentElement;
  html.innerHTML = '';
  Array.from(html.attributes).forEach((attr) => html.removeAttribute(attr.name));
}

function mockGeolocation(): void {
  /* Mock geolocation methods (navigator.geolocation is undefined in jsdom). */
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    },
    writable: true,
  });
}

function mockWindowLocationMethods(): void {
  /* Replace jsdom window.location methods (reload & replace) with mocks. */
  const { location } = window;
  Reflect.deleteProperty(window, 'location');
  window.location = { ...location, reload: jest.fn(), replace: jest.fn() };
}

function mockWindowScrollMethods(): void {
  /* Add mocks for window scroll methods (not implemented in jsdom). */
  Object.defineProperties(window, {
    scrollTo: { value: jest.fn() },
    scrollBy: { value: jest.fn() },
  });
}

function mockScrollIntoView(): void {
  /* Add mock for scrollIntoView (not implemented in jsdom). */
  Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    value: jest.fn(),
    writable: true,
  });
}

function mockSVGElements(): void {
  /* Add mock for SVG elements (not implemented in jsdom). */
  // @ts-ignore
  window.SVGPathElement = class SVGPathElement extends HTMLElement {};
}

function setOnline(): void {
  /* Set connection to online. */
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
}

// eslint-disable-next-line jest/require-top-level-describe
beforeEach((): void => {
  jest.resetModules(); // Reset module imports.
  jest.restoreAllMocks(); // Restore original implementations and reset mock data.

  fetchMock.resetMocks(); // Reset fetch mock to give fresh mock data in between tests.
  fetchMock.enableMocks(); // Replace global fetch with fetchMock.

  MockDate.reset(); // Restore original Date object back to the native implementation.

  clearDOM();
  localStorage.clear();

  mockGeolocation();
  mockWindowLocationMethods();
  mockWindowScrollMethods();
  mockScrollIntoView();
  mockSVGElements();

  setOnline();
});
