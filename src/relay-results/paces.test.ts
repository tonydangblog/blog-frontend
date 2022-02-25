/* Relay Results: Paces Tests. */
import fetchMock from 'jest-fetch-mock';

import { flash } from '../common/message-flashing';
import { generateChart, pacesChart } from './paces';

jest.mock('../common/message-flashing');

describe('generateChart', () => {
  it('generates paces chart in DOM', () => {
    expect.assertions(1);

    // GIVEN SVG element in DOM and data.
    document.body.innerHTML = '<svg id="relay-results__paces-chart"></svg>';
    const data = [
      { name: 'Tony', pace: 60 * 8 },
      { name: 'Jay', pace: 60 * 6 },
    ];

    // WHEN generateChart is called with valid data.
    generateChart(data);

    // THEN Chart is generated in DOM.
    expect(document.body.innerHTML).toContain('relay-results__paces-chart__bar');
  });
});

describe('pacesChart', () => {
  it('generates chart if data available', async () => {
    expect.assertions(1);

    // GIVEN SVG element in DOM and data.
    document.body.innerHTML = '<svg id="relay-results__paces-chart"></svg>';
    const data = [
      { name: 'Tony', pace: 60 * 8 },
      { name: 'Jay', pace: 60 * 6 },
    ];

    // WHEN pacesChart call receives valid data.
    fetchMock.mockResponseOnce(JSON.stringify(data), { status: 200 });
    await pacesChart('yyyy-mm-dd');

    // THEN Chart is generated in DOM.
    expect(document.body.innerHTML).toContain('relay-results__paces-chart__bar');
  });
  it('handles errors', async () => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN Error occurs during pacesChart call.
    fetchMock.mockAbortOnce();
    await pacesChart('yyyy-mm-dd');

    // THEN flash is called to handle error message.
    expect(flash).toHaveBeenCalledWith('AbortError: The operation was aborted. ');
  });
});
