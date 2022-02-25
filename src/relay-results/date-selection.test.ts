/* Relay Results: Date Selection Tests. */
import {
  dateSelectionListener,
  displayCharts,
  displayLatestRelayResults,
} from './date-selection';
import { displayNotes } from './notes';
import { pacesChart } from './paces';
import { resultsChart } from './results';
import { trendsChart } from './trends';

jest.mock('./notes');
jest.mock('./paces');
jest.mock('./results');
jest.mock('./trends');

describe('dateSelectionListener', () => {
  it('clears previous results and displays new results on selection change', () => {
    expect.assertions(12);

    // GIVEN DOM with select/svg/ul elements and dateSelectionListener set.
    document.body.innerHTML = `
      <select id="relay-results__date-selector" autocomplete="off">
        <option value="selected_date" selected></option>
      </select>
      <svg id="relay-results__results-chart">previous_results</svg>
      <svg id="relay-results__paces-chart">previous_paces</svg>
      <svg id="relay-results__trends-chart">previous_trends</svg>
      <ul id="relay-results__notes-list">previous_notes</ul>
    `;
    const dateSelector = document.getElementById('relay-results__date-selector')!;
    const resultsSVG = document.getElementById('relay-results__results-chart')!;
    const pacesSVG = document.getElementById('relay-results__paces-chart')!;
    const trendsSVG = document.getElementById('relay-results__trends-chart')!;
    const notesList = document.getElementById('relay-results__notes-list')!;
    dateSelectionListener();

    // WHEN Event date change occurs.
    expect(resultsSVG.innerHTML).toBe('previous_results');
    expect(pacesSVG.innerHTML).toBe('previous_paces');
    expect(trendsSVG.innerHTML).toBe('previous_trends');
    expect(notesList.innerHTML).toBe('previous_notes');
    dateSelector.dispatchEvent(new Event('change'));

    // THEN Previous charts and notes are cleared.
    expect(resultsSVG.innerHTML).toBe('');
    expect(pacesSVG.innerHTML).toBe('');
    expect(trendsSVG.innerHTML).toBe('');
    expect(notesList.innerHTML).toBe('');
    expect(resultsChart).toHaveBeenCalledWith('selected_date');
    expect(pacesChart).toHaveBeenCalledWith('selected_date');
    expect(trendsChart).toHaveBeenCalledWith('selected_date');
    expect(displayNotes).toHaveBeenCalledWith('selected_date');
  });
});

describe('displayCharts', () => {
  it('displays all charts and notes for given date', () => {
    expect.assertions(4);

    // GIVEN N/A.
    // WHEN displayCharts is called.
    displayCharts('yyyy-mm-dd');

    // THEN All chart and note display functions are called with given date.
    expect(resultsChart).toHaveBeenCalledWith('yyyy-mm-dd');
    expect(pacesChart).toHaveBeenCalledWith('yyyy-mm-dd');
    expect(trendsChart).toHaveBeenCalledWith('yyyy-mm-dd');
    expect(displayNotes).toHaveBeenCalledWith('yyyy-mm-dd');
  });
});

describe('displayLatestRelayResults', () => {
  it('displays latest event results', () => {
    expect.assertions(4);

    // GIVEN DOM with latest event date.
    document.body.innerHTML = `
      <select id="relay-results__date-selector" autocomplete="off">
        <option value="yyyy-mm-dd" selected></option>
        <option id="relay-results__latest-event" value="latest_event_date"></option>
      </select>
    `;

    // WHEN displayLatestRelayResults is called.
    displayLatestRelayResults();

    // THEN All chart and note display functions are called with latest event date.
    expect(resultsChart).toHaveBeenCalledWith('latest_event_date');
    expect(pacesChart).toHaveBeenCalledWith('latest_event_date');
    expect(trendsChart).toHaveBeenCalledWith('latest_event_date');
    expect(displayNotes).toHaveBeenCalledWith('latest_event_date');
  });
});
