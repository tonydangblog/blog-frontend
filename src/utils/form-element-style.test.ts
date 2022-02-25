/* Utils: Form Element Style Tests. */
import { formElementStyleListener, styleFormElement } from './form-element-style';

describe('styleFormElement', () => {
  it.each`
    initialClass           | value          | expected
    ${''}                  | ${''}          | ${''}
    ${'random-class-name'} | ${''}          | ${''}
    ${''}                  | ${'non-empty'} | ${'random-class-name'}
    ${'random-class-name'} | ${'non-empty'} | ${'random-class-name'}
  `(
    'adds/removes given class name depending on element value',
    ({ initialClass, value, expected }) => {
      expect.assertions(1);

      // GIVEN DOM with form element.
      document.body.innerHTML = `
        <input type="text" class="${initialClass}" value="${value}">
      `;
      const element = document.querySelector('input')!;

      // WHEN styleFormElement is called.
      styleFormElement(element, 'random-class-name');

      // THEN Element has class name added/removed depending on element value.
      expect(element.className).toBe(expected);
    }
  );
});

describe('formElementStyleListener', () => {
  it.each`
    initialClass           | value          | expected
    ${''}                  | ${''}          | ${''}
    ${'random-class-name'} | ${''}          | ${''}
    ${''}                  | ${'non-empty'} | ${'random-class-name'}
    ${'random-class-name'} | ${'non-empty'} | ${'random-class-name'}
  `(
    'styles all form elements and listens for changes to update style',
    ({ initialClass, value, expected }) => {
      expect.assertions(9);

      // GIVEN DOM with form elements.
      document.body.innerHTML = `
        <input type="text" class="${initialClass}" value="${value}">
        <select class="${initialClass}">
          <option value="${value}" selected></option>
        </select>
        <textarea class="${initialClass}">${value}</textarea>
      `;
      const input = document.querySelector('input')!;
      const select = document.querySelector('select')!;
      const option = document.querySelector('option')!;
      const textarea = document.querySelector('textarea')!;

      // WHEN formElementStyleListener is called.
      formElementStyleListener('random-class-name');

      // THEN Form elements are styled depending on initial value.
      expect(input.className).toBe(expected);
      expect(select.className).toBe(expected);
      expect(textarea.className).toBe(expected);

      // AND WHEN Change event occurs with empty values.
      input.value = '';
      option.value = '';
      textarea.innerHTML = '';
      input.dispatchEvent(new Event('change'));
      select.dispatchEvent(new Event('change'));
      textarea.dispatchEvent(new Event('change'));

      // THEN Form element classes are removed.
      expect(input.className).toBe('');
      expect(select.className).toBe('');
      expect(textarea.className).toBe('');

      // AND WHEN Change event occurs with non-empty values.
      input.value = 'blah';
      option.value = 'blah';
      textarea.innerHTML = 'blah';
      input.dispatchEvent(new Event('change'));
      select.dispatchEvent(new Event('change'));
      textarea.dispatchEvent(new Event('change'));

      // THEN Form element classes are removed.
      expect(input.className).toBe('random-class-name');
      expect(select.className).toBe('random-class-name');
      expect(textarea.className).toBe('random-class-name');
    }
  );
});
