/* Relay Results: Notes. */
import * as d3 from 'd3';

import { flash } from '../common/message-flashing';

async function displayNotes(date: string): Promise<void> {
  /* Fetch data then display notes. */
  try {
    const data: string[] | undefined = await d3.json(`/relay-results/notes/${date}`);
    const notes = document.getElementById('relay-results__notes');
    const notesList = document.getElementById('relay-results__notes-list');
    /* istanbul ignore else */
    if (notes) {
      if (data && data.length > 0 && notesList) {
        data.forEach((note: string): void => {
          const li = document.createElement('li');
          li.innerHTML = note;
          notesList.appendChild(li);
        });
        notes.style.display = 'block';
      } else {
        notes.style.display = 'none';
      }
    }
  } catch (error: unknown) {
    /* istanbul ignore else */
    if (error instanceof Error) flash(`${error}`);
  }
}

export { displayNotes };
