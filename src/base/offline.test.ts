/* Base: Offline Tests. */
import { offlineHandler, offlineListener } from './offline';

describe('offlineHandler', () => {
  it('flashes offline message and adds listener to clear message when online', () => {
    expect.assertions(2);

    // GIVEN N/A.
    // WHEN offlineHandler is called.
    offlineHandler();

    // THEN Offline message is flashed.
    expect(document.body.innerHTML).toContain('You are currently offline.');

    // AND WHEN 'online' event occurs.
    window.dispatchEvent(new Event('online'));

    // THEN Offline message is removed.
    expect(document.body.innerHTML).not.toContain('You are currently offline.');

    // AND WHEN 'online' event occurs without offline message, no exception occurs.
    window.dispatchEvent(new Event('online'));
  });
});

describe('offlineListener', () => {
  it.each`
    onLine   | contain                         | notContain
    ${true}  | ${''}                           | ${'You are currently offline.'}
    ${false} | ${'You are currently offline.'} | ${'blah'}
  `('listens for offline connection', ({ onLine, contain, notContain }) => {
    expect.assertions(3);

    // GIVEN Whether initial connection is online/offline.
    Object.defineProperty(navigator, 'onLine', { value: onLine });

    // WHEN offlineHandler is called.
    offlineListener();

    // THEN Offline message is flashed if offline.
    expect(document.body.innerHTML).toContain(contain);
    expect(document.body.innerHTML).not.toContain(notContain);

    // AND WHEN 'offline' event occurs.
    window.dispatchEvent(new Event('offline'));

    // THEN Offline message is flashed.
    expect(document.body.innerHTML).toContain('You are currently offline.');
  });
});
