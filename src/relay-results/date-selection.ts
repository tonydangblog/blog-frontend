/* Relay Results: Date Selection. */
import { displayNotes } from './notes';
import { pacesChart } from './paces';
import { resultsChart } from './results';
import { trendsChart } from './trends';

function displayCharts(date: string): void {
  /* Display charts and notes given relay run date. */
  [resultsChart, pacesChart, trendsChart, displayNotes].forEach(
    (func: Function): void => func(date)
  );
}

function dateSelectionListener(): void {
  /* Listen for event date change to update charts and notes accordingly. */
  const dateSelector = document.getElementById('relay-results__date-selector');
  const resultsSVG = document.getElementById('relay-results__results-chart');
  const pacesSVG = document.getElementById('relay-results__paces-chart');
  const trendsSVG = document.getElementById('relay-results__trends-chart');
  const notesList = document.getElementById('relay-results__notes-list');
  /* istanbul ignore else */
  if (
    dateSelector instanceof HTMLSelectElement &&
    resultsSVG &&
    pacesSVG &&
    trendsSVG &&
    notesList
  ) {
    dateSelector.addEventListener('change', (): void => {
      resultsSVG.innerHTML = '';
      pacesSVG.innerHTML = '';
      trendsSVG.innerHTML = '';
      notesList.innerHTML = '';
      displayCharts(dateSelector.value);
    });
  }
}

function displayLatestRelayResults(): void {
  /* Display results from latest relay run event. */
  const latestEvent = document.getElementById('relay-results__latest-event');
  /* istanbul ignore else */
  if (latestEvent instanceof HTMLOptionElement) {
    displayCharts(latestEvent.value);
  }
}

export { dateSelectionListener, displayCharts, displayLatestRelayResults };
