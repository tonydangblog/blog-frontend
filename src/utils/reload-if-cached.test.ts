/* Utils: Reload if Cached Tests. */
import { reloadIfCachedListener } from './reload-if-cached';

describe('reloadIfCachedListener', () => {
  it.each`
    persisted | expected
    ${true}   | ${1}
    ${false}  | ${0}
  `('calls location.reload if page is cached', ({ persisted, expected }) => {
    expect.assertions(1);

    // GIVEN reloadIfCachedListener set.
    reloadIfCachedListener();

    // WHEN pageshow event occurs with persisted boolean.
    const event = new Event('pageshow');
    Object.defineProperty(event, 'persisted', { value: persisted });
    window.dispatchEvent(event);

    // THEN location.reload is called if persisted boolean is true.
    expect(window.location.reload).toHaveBeenCalledTimes(expected);
  });
});
