/* Base: Side Menu. */
function resetSideMenuListener(): void {
  // Close site side menu if viewport > 640px.
  const hamburgerButton = document.querySelector('.hamburger-button');
  const siteSideMenu = document.querySelector('.site-side-menu');
  window.addEventListener('resize', (): void => {
    if (
      window.innerWidth > 640 &&
      hamburgerButton &&
      siteSideMenu instanceof HTMLElement
    ) {
      hamburgerButton.classList.remove('hamburger-button--expand');
      siteSideMenu.style.display = 'none';
    }
  });
}

function sideMenuToggleListener(): void {
  // Handle site side menu toggles.
  const hamburgerButton = document.querySelector('.hamburger-button');
  const siteSideMenu = document.querySelector('.site-side-menu');
  if (hamburgerButton && siteSideMenu instanceof HTMLElement) {
    hamburgerButton.addEventListener('click', (): void => {
      if (siteSideMenu.style.display === 'none') {
        hamburgerButton.classList.add('hamburger-button--expand');
        siteSideMenu.style.display = 'block';
      } else {
        hamburgerButton.classList.remove('hamburger-button--expand');
        siteSideMenu.style.display = 'none';
      }
    });
  }
}

export { resetSideMenuListener, sideMenuToggleListener };
