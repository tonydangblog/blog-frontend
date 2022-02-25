/* Relay Results: Results Tests. */
import fetchMock from 'jest-fetch-mock';

import { flash } from '../common/message-flashing';
import { generateChart, resultsChart } from './results';

jest.mock('../common/message-flashing');

describe('generateChart', () => {
  it('generates results chart in DOM', () => {
    expect.assertions(1);

    // GIVEN SVG element in DOM and data.
    document.body.innerHTML = '<svg id="relay-results__results-chart"></svg>';
    const data = {
      keys: ['1', '2'],
      members_per_team: 2,
      team_names: ['A', 'B'],
      team_results: [
        { 1: 10, 2: 10, runners: { 1: 'Jay', 2: 'Nicole' }, team: 'A', total_time: 20 },
        { 1: 20, 2: 20, runners: { 1: 'Tony', 2: 'Allen' }, team: 'B', total_time: 40 },
      ],
      xMax: 40,
    };

    // WHEN generateChart is called with valid data.
    generateChart(data);

    // THEN Chart is generated in DOM.
    expect(document.body.innerHTML).toContain('relay-results__results-chart__runner-1');
  });
});

describe('resultsChart', () => {
  it('generates chart if data available', async () => {
    expect.assertions(1);

    // GIVEN SVG element in DOM and data with UNEVEN team members.
    document.body.innerHTML = '<svg id="relay-results__results-chart"></svg>';
    const data = {
      keys: ['1', '2'],
      members_per_team: 2,
      team_names: ['A', 'B'],
      team_results: [
        { 1: 10, 2: 10, runners: { 1: 'Jay', 2: 'Nicole' }, team: 'A', total_time: 20 },
        { 1: 20, runners: { 1: 'Tony', 2: 'Allen' }, team: 'B', total_time: 40 },
      ],
      xMax: 40,
    };

    // WHEN resultsChart call receives valid data.
    fetchMock.mockResponseOnce(JSON.stringify(data), { status: 200 });
    await resultsChart('yyyy-mm-dd');

    // THEN Chart is generated in DOM.
    expect(document.body.innerHTML).toContain('relay-results__results-chart__runner-1');
  });
  it('handles errors', async () => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN Error occurs during resultsChart call.
    fetchMock.mockAbortOnce();
    await resultsChart('yyyy-mm-dd');

    // THEN flash is called to handle error message.
    expect(flash).toHaveBeenCalledWith('AbortError: The operation was aborted. ');
  });
});
