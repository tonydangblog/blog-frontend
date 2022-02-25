/* Relay Results: Trends Tests. */
import fetchMock from 'jest-fetch-mock';

import { flash } from '../common/message-flashing';
import { generateChart, trendsChart } from './trends';

jest.mock('../common/message-flashing');

function setupDOM() {
  document.body.innerHTML = `
      <p id="relay-results__no-trends-message" style="display: none">
        No trends data for this run.
      </p>
      <svg id="relay-results__trends-chart"></svg>
    `;
  return {
    noTrendsP: document.getElementById('relay-results__no-trends-message')!,
    trendsSVG: document.getElementById('relay-results__trends-chart')!,
  };
}

function setUpData() {
  return [
    [
      { date: new Date('2021-08-27T00:00:00-08:00'), name: 'Tony', pace: 500 },
      { date: new Date('2022-08-27T00:00:00-08:00'), name: 'Tony', pace: 500 },
    ],
    [
      { date: new Date('2021-08-27T00:00:00-08:00'), name: 'Jay', pace: 500 },
      { date: new Date('2022-08-27T00:00:00-08:00'), name: 'Jay', pace: 500 },
    ],
  ];
}

describe('generateChart', () => {
  it('generates trends chart in DOM', () => {
    expect.assertions(1);

    // GIVEN DOM.
    setupDOM();

    // WHEN generateChart is called with valid data.
    generateChart(setUpData(), '2022-08-27');

    // THEN Chart is generated in DOM.
    expect(document.body.innerHTML).toContain('relay-results__trends-chart__legend');
  });
  it('listens for hover events', () => {
    expect.assertions(7);

    // GIVEN Data point in DOM.
    setupDOM();
    generateChart(setUpData(), '2022-08-27');
    const datapoint = document.querySelector('.relay-results__trends-chart__circle')!;
    expect(datapoint).not.toBeNull();

    // WHEN Mouseover event occurs on data point.
    datapoint.dispatchEvent(new Event('mouseover'));
    let bg = document.getElementById('relay-results__trends-chart__tooltip-bg');
    let date = document.getElementById('relay-results__trends-chart__tooltip-date');
    let namePace = document.getElementById(
      'relay-results__trends-chart__tooltip-name-pace'
    );

    // THEN Tooltip is present in DOM.
    expect(bg).not.toBeNull();
    expect(date).not.toBeNull();
    expect(namePace).not.toBeNull();

    // AND WHEN Mouseout event occurs on data point.
    datapoint.dispatchEvent(new Event('mouseout'));
    bg = document.getElementById('relay-results__trends-chart__tooltip-bg');
    date = document.getElementById('relay-results__trends-chart__tooltip-date');
    namePace = document.getElementById(
      'relay-results__trends-chart__tooltip-name-pace'
    );

    // THEN Tooltip is removed from DOM.
    expect(bg).toBeNull();
    expect(date).toBeNull();
    expect(namePace).toBeNull();
  });
});

describe('trendsChart', () => {
  it('generates chart if data available', async () => {
    expect.assertions(3);

    // GIVEN DOM.
    const dom = setupDOM();

    // WHEN trendsChart call receives valid data.
    fetchMock.mockResponseOnce(JSON.stringify(setUpData()), { status: 200 });
    await trendsChart('2022-08-27');

    // THEN Chart is generated in DOM.
    expect(dom.noTrendsP.style.display).toBe('none');
    expect(dom.trendsSVG.style.display).toBe('block');
    expect(document.body.innerHTML).toContain('relay-results__trends-chart__legend');
  });
  it('hides chart and displays message if data not available', async () => {
    expect.assertions(2);

    // GIVEN DOM.
    const dom = setupDOM();

    // WHEN trendsChart call receives empty data.
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });
    await trendsChart('2022-08-27');

    // THEN Chart is hidden and message displayed.
    expect(dom.trendsSVG.style.display).toBe('none');
    expect(dom.noTrendsP.style.display).toBe('block');
  });
  it('handles errors', async () => {
    expect.assertions(1);

    // GIVEN N/A.
    // WHEN Error occurs during trendsChart call.
    fetchMock.mockAbortOnce();
    await trendsChart('2022-08-27');

    // THEN flash is called to handle error message.
    expect(flash).toHaveBeenCalledWith('AbortError: The operation was aborted. ');
  });
});
