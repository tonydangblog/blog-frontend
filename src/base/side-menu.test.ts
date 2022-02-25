/* Base: Side Menu Tests. */
import { resetSideMenuListener, sideMenuToggleListener } from './side-menu';

function setupDOM() {
  document.body.innerHTML = `
    <div class="hamburger-button hamburger-button--expand"></div>
    <div class="site-side-menu" style="display: block;"></div>
  `;
  return {
    button: document.querySelector('.hamburger-button')!,
    menu: document.querySelector('.site-side-menu') as HTMLElement,
  };
}

describe('resetSideMenuListener', () => {
  it.each`
    width  | className                                      | display
    ${639} | ${'hamburger-button hamburger-button--expand'} | ${'block'}
    ${640} | ${'hamburger-button hamburger-button--expand'} | ${'block'}
    ${641} | ${'hamburger-button'}                          | ${'none'}
  `('closes side menu if viewport is > 640px', ({ width, className, display }) => {
    expect.assertions(2);

    // GIVEN DOM with expanded hamburgerButton and siteSideMenu, and
    //       resetSideMenuListener.
    const dom = setupDOM();
    resetSideMenuListener();

    // WHEN Viewport is resized.
    global.innerWidth = width;
    window.dispatchEvent(new Event('resize'));

    // THEN hamburgerButton is collapsed and siteSideMenu is closed if viewport > 640px.
    expect(dom.button.className).toBe(className);
    expect(dom.menu.style.display).toBe(display);
  });
});

describe('sideMenuToggleListener', () => {
  it('opens and closes site side menu', () => {
    expect.assertions(4);

    // GIVEN DOM with expanded hamburgerButton and siteSideMenu, and
    //       sideMenuToggleListener.
    const dom = setupDOM();
    sideMenuToggleListener();

    // WHEN hamburgerButton is clicked.
    dom.button.dispatchEvent(new Event('click'));

    // THEN hamburgerButton is collapsed and siteSideMenu is closed.
    expect(dom.button.classList.value).toBe('hamburger-button');
    expect(dom.menu.style.display).toBe('none');

    // AND WHEN hamburgerButton is clicked again.
    dom.button.dispatchEvent(new Event('click'));

    // AND THEN hamburgerButton is expanded and siteSideMenu is opened.
    expect(dom.button.classList.value).toBe(
      'hamburger-button hamburger-button--expand'
    );
    expect(dom.menu.style.display).toBe('block');
  });
  it('takes no action if site side menu is missing from DOM', () => {
    expect.assertions(1);

    // GIVEN DOM with only expanded hamburgerButton and sideMenuToggleListener.
    document.body.innerHTML = `
      <div class="hamburger-button hamburger-button--expand"></div>
    `;
    const button = document.querySelector('.hamburger-button')!;
    sideMenuToggleListener();

    // WHEN hamburgerButton is clicked.
    button.dispatchEvent(new Event('click'));

    // THEN hamburgerButton stays expanded.
    expect(button.classList.value).toBe('hamburger-button hamburger-button--expand');
  });
});
