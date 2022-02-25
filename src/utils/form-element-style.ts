/* Utils: Form Element Style. */
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function styleFormElement(element: FormElement, className: string): void {
  /* Style form element depending on whether element value is empty. */
  if (element.value === '') element.classList.remove(className);
  else element.classList.add(className);
}

function formElementStyleListener(className: string): void {
  /* Style all form elements then listen for changes to update style. */
  ['input', 'select', 'textarea'].forEach((tag: string): void => {
    Array.from(document.getElementsByTagName(tag)).forEach((element: Element): void => {
      /* istanbul ignore else */
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        styleFormElement(element, className);
        element.addEventListener('change', (): void =>
          styleFormElement(element, className)
        );
      }
    });
  });
}

export { formElementStyleListener, styleFormElement };
