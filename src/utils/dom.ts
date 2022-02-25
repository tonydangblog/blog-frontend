/* Utils: DOM. */
function addClassesOn(
  selector: string,
  classes: string[],
  milliseconds?: number
): void {
  // Add (optionally temporary) classes on an element.
  const element = document.querySelector(selector);
  if (element) {
    classes.forEach((className: string): void => {
      element.classList.add(className);
      if (milliseconds) {
        setTimeout((): void => element.classList.remove(className), milliseconds);
      }
    });
  }
}

function disableKeysOn(selector: string, keys: string[]): void {
  // Disable given keys on an HTMLElement.
  const element = document.querySelector(selector);
  if (element instanceof HTMLElement) {
    element.addEventListener('keypress', (e: KeyboardEvent): void => {
      if (keys.includes(e.key)) e.preventDefault();
    });
  }
}

function focusOn(selector: string): void {
  // Focus on an HTMLElement.
  const element = document.querySelector(selector);
  if (element instanceof HTMLElement) element.focus();

}

export { addClassesOn, disableKeysOn, focusOn };
