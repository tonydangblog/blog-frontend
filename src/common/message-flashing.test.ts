/* Common: Message Flashing Tests. */
import { dismissFlashMessageListener, flash } from './message-flashing';

function setupDOM() {
  document.body.innerHTML = `
    <div class="flash-messages">
      <div class="flash-messages__message">
        <p class="flash-messages__text">uno</p>
        <div class="flash-messages__dismiss-button" title="Dismiss message.">
          &times;
        </div>
      </div>
      <div class="flash-messages__message">
        <p class="flash-messages__text">dos</p>
        <div class="flash-messages__dismiss-button" title="Dismiss message.">
          &times;
        </div>
      </div>
    </div>
  `;
}

describe('dismissFlashMessageListener', () => {
  it('handles dismissal of flash messages', () => {
    expect.assertions(2);

    // GIVEN Initial DOM with flash messages and dismissFlashMessageListener.
    setupDOM();
    dismissFlashMessageListener();

    // WHEN A flash message dismiss button is clicked.
    const dismissButton = document.querySelector('.flash-messages__dismiss-button')!;
    dismissButton.dispatchEvent(new Event('click'));

    // THEN Corresponding flash message is dismissed.
    expect(document.body.innerHTML).not.toContain('uno');
    expect(document.body.innerHTML).toContain('dos');
  });
});

describe('flash', () => {
  it.each`
    setup
    ${() => undefined}
    ${setupDOM}
  `('flashes given message and adds listener for dismissal', ({ setup }) => {
    expect.assertions(3);

    // GIVEN Initial DOM.
    setup();

    // WHEN flash is called.
    flash('test');

    // THEN Previous flash messages are dismissed.
    expect(document.body.innerHTML).not.toContain('uno');
    // AND New flash message is in DOM.
    expect(document.body.innerHTML).toContain('test');
    // AND Dismissal button is active.
    const dismissButton = document.querySelector('.flash-messages__dismiss-button')!;
    dismissButton.dispatchEvent(new Event('click'));
    expect(document.body.innerHTML).not.toContain('test');
  });
});
