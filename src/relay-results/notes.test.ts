/* Relay Results: Notes Tests. */
import fetchMock from 'jest-fetch-mock';

import { flash } from '../common/message-flashing';
import { displayNotes } from './notes';

jest.mock('../common/message-flashing');

describe('displayNotes', () => {
  it.each`
    payload                     | expectedListItems                       | expectedDisplay
    ${['note_one', 'note_two']} | ${'<li>note_one</li><li>note_two</li>'} | ${'block'}
    ${[]}                       | ${''}                                   | ${'none'}
  `(
    'displays notes if available',
    async ({ payload, expectedListItems, expectedDisplay }) => {
      expect.assertions(2);

      // GIVEN DOM.
      document.body.innerHTML = `
        <section id="relay-results__notes" style="display: none">
          <h2>Notes*</h2>
          <ul id="relay-results__notes-list"></ul>
        </section>
      `;
      const notes = document.getElementById('relay-results__notes')!;
      const notesList = document.getElementById('relay-results__notes-list')!;

      // WHEN displayNotes is called.
      fetchMock.mockResponseOnce(JSON.stringify(payload), { status: 200 });
      await displayNotes('2019-08-11');

      // THEN Notes are displayed in DOM if available.
      expect(notesList.innerHTML).toBe(expectedListItems);
      expect(notes.style.display).toBe(expectedDisplay);
    }
  );
  it('handles errors', async () => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN Error occurs during displayNotes call.
    fetchMock.mockAbortOnce();
    await displayNotes('2019-08-11');

    // THEN flash is called to handle error message.
    expect(flash).toHaveBeenCalledWith('AbortError: The operation was aborted. ');
  });
});
