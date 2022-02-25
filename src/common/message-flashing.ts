/* Common: Message Flashing. */
function dismissFlashMessageListener(): void {
  // Listen for dismissal of flash messages.
  Array.from(document.getElementsByClassName('flash-messages__dismiss-button')).map(
    (button: Element): void =>
      button.addEventListener('click', (): void => button.parentElement!.remove())
  );
}

function flash(message: string): void {
  // Flash message and add listener for dismissal.
  let flashMessages = document.querySelector('.flash-messages');
  if (flashMessages) flashMessages.remove();
  flashMessages = document.createElement('div');
  flashMessages.className = 'flash-messages';
  flashMessages.innerHTML = `
    <div class="flash-messages__message">
      <p class="flash-messages__text">${message}</p>
      <div class="flash-messages__dismiss-button" title="Dismiss message.">
        &times;
      </div>
    </div>
  `;
  document.body.prepend(flashMessages);
  dismissFlashMessageListener();
}

export { dismissFlashMessageListener, flash };
