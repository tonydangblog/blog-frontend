/* Support: Qty Tests. */
import {
  qtyAddListener,
  qtyInputListener,
  qtyRemoveListener,
  updateOneTimeDonationQty,
  updateOneTimeDonationText,
} from './qty';

function setupDOM() {
  document.body.innerHTML = `
    <div class="support__one-time__qty-selector">
      <button class="support__one-time__qty-remove">-</button>
      <input
        class="support__one-time__qty-input"
        type="number"
        min="1"
        max="1000"
        step="1"
        value="1"
        autocomplete="off"
      />
      <button class="support__one-time__qty-add">+</button>
      <span class="support__one-time__coffee">&times; &#x2615;</span>
    </div>

    <form
      method="POST"
      action="{{ url_for('main.support_one_time_checkout') }}"
      autocomplete="off"
    >
      <input type="hidden" name="csrf_token" value="{{ csrf_token() }}" />
      <input id="support__one-time__qty" type="hidden" name="qty" value="1" />
      <button class="button--center support__one-time__submit-button">
        <span class="button__text">SUPPORT $5</span>
        <img
          class="button__spinner"
          src="{{ static_file('gif/spinner.gif') }}"
          alt="loading spinner"
        />
      </button>
    </form>
  `;

  return {
    removeButton: document.querySelector('.support__one-time__qty-remove')!,
    qtyInput: document.querySelector(
      '.support__one-time__qty-input'
    ) as HTMLInputElement,
    addButton: document.querySelector('.support__one-time__qty-add')!,
    oneTimeQty: document.getElementById('support__one-time__qty') as HTMLInputElement,
    submitButtonText: document.querySelector(
      `.support__one-time__submit-button .button__text`
    )!,
  };
}

describe('qtyAddListener', () => {
  it.each`
    inputValue | inputMax  | expectedInputValue | expectedQty | expectedText
    ${'1'}     | ${'1000'} | ${'2'}             | ${'2'}      | ${'SUPPORT $10'}
    ${'1000'}  | ${'1000'} | ${'1000'}          | ${'1000'}   | ${'SUPPORT $5000'}
  `(
    'adds qty if below max',
    ({ inputValue, inputMax, expectedInputValue, expectedQty, expectedText }) => {
      expect.assertions(3);

      // GIVEN DOM, initial input value/max, and qtyAddListener set.
      const dom = setupDOM();
      dom.qtyInput.value = inputValue;
      dom.qtyInput.max = inputMax;
      qtyAddListener();

      // WHEN Qty add button is clicked.
      dom.addButton.dispatchEvent(new Event('click'));

      // THEN Input value, button qty, and button text are updated accordingly.
      expect(dom.qtyInput.value).toBe(expectedInputValue);
      expect(dom.oneTimeQty.value).toBe(expectedQty);
      expect(dom.submitButtonText.innerHTML).toBe(expectedText);
    }
  );
});

describe('qtyInputListener', () => {
  it.each`
    inputValue | inputMax  | expectedInputValue | expectedQty | expectedText
    ${'a'}     | ${'1000'} | ${'1'}             | ${'1'}      | ${'SUPPORT $5'}
    ${'0'}     | ${'1000'} | ${'1'}             | ${'1'}      | ${'SUPPORT $5'}
    ${'9999'}  | ${'1000'} | ${'1000'}          | ${'1000'}   | ${'SUPPORT $5000'}
    ${'3'}     | ${'1000'} | ${'3'}             | ${'3'}      | ${'SUPPORT $15'}
  `(
    'update qty from change events',
    ({ inputValue, inputMax, expectedInputValue, expectedQty, expectedText }) => {
      expect.assertions(3);

      // GIVEN DOM, initial input value/max, and qtyInputListener set.
      const dom = setupDOM();
      dom.qtyInput.value = inputValue;
      dom.qtyInput.max = inputMax;
      qtyInputListener();

      // WHEN Change event occurs on qty input.
      dom.qtyInput.dispatchEvent(new Event('change'));

      // THEN Input value, button qty, and button text are updated accordingly.
      expect(dom.qtyInput.value).toBe(expectedInputValue);
      expect(dom.oneTimeQty.value).toBe(expectedQty);
      expect(dom.submitButtonText.innerHTML).toBe(expectedText);
    }
  );
});

describe('qtyRemoveListener', () => {
  it.each`
    inputValue | expectedInputValue | expectedQty | expectedText
    ${'1'}     | ${'1'}             | ${'1'}      | ${'SUPPORT $5'}
    ${'3'}     | ${'2'}             | ${'2'}      | ${'SUPPORT $10'}
  `(
    'remove qty if greater than one',
    ({ inputValue, expectedInputValue, expectedQty, expectedText }) => {
      expect.assertions(3);

      // GIVEN DOM, initial input value, and qtyRemoveListener set.
      const dom = setupDOM();
      dom.qtyInput.value = inputValue;
      qtyRemoveListener();

      // WHEN Qty remove button is clicked.
      dom.removeButton.dispatchEvent(new Event('click'));

      // THEN Input value, button qty, and button text are updated accordingly.
      expect(dom.qtyInput.value).toBe(expectedInputValue);
      expect(dom.oneTimeQty.value).toBe(expectedQty);
      expect(dom.submitButtonText.innerHTML).toBe(expectedText);
    }
  );
});

describe('updateOneTimeDonationQty', () => {
  it('updates qty of checkout button hidden field', () => {
    expect.assertions(1);

    // GIVEN DOM.
    const dom = setupDOM();

    // WHEN updateOneTimeDonationQty is called.
    updateOneTimeDonationQty(255);

    // THEN Qty of checkout button hidden field is updated.
    expect(dom.oneTimeQty.value).toBe('255');
  });
});

describe('updateOneTimeDonationText', () => {
  it('updates text of checkout button', () => {
    expect.assertions(1);

    // GIVEN DOM.
    const dom = setupDOM();

    // WHEN updateOneTimeDonationQty is called.
    updateOneTimeDonationText(5);

    // THEN Text of checkout button is updated.
    expect(dom.submitButtonText.innerHTML).toBe('SUPPORT $25');
  });
});
