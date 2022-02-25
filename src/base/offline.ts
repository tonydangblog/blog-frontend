/* Base: Offline. */
import { flash } from '../common/message-flashing';

function offlineHandler(): void {
  // Flash offline message and clear message when back online.
  flash('You are currently offline.');
  const offlineMessage = document.querySelector('.flash-messages__message');
  window.addEventListener('online', (): void => {
    /* istanbul ignore else */
    if (offlineMessage) offlineMessage.remove();
  });
}

function offlineListener(): void {
  // Listen for offline connection.
  if (!navigator.onLine) offlineHandler();
  window.addEventListener('offline', offlineHandler);
}

export { offlineHandler, offlineListener };
