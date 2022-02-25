/* Relay Results: Results Chart. */
import * as d3 from 'd3';

import { flash } from '../common/message-flashing';
import { secondsToString } from '../utils/time';

interface Runners {
  [key: string]: string;
}

interface TeamResult {
  [key: string]: Runners | string | number;
  runners: Runners;
  team: string;
  total_time: number; // eslint-disable-line camelcase
}

interface Data {
  keys: string[];
  members_per_team: number; // eslint-disable-line camelcase
  team_names: string[]; // eslint-disable-line camelcase
  team_results: TeamResult[]; // eslint-disable-line camelcase
  xMax: number;
}

interface Series extends d3.Series<TeamResult, string> {}

interface SeriesPoint extends d3.SeriesPoint<TeamResult> {}

interface KeyedSeriesPoint extends d3.SeriesPoint<TeamResult> {
  key: string;
}

function generateChart(data: Data): void {
  /* Generate results chart. */

  // Stack and key each series point for stacked bar chart.
  const stack = d3.stack<TeamResult, string>().keys(data.keys);
  const stackedTeamTimes = stack(data.team_results).map((series: Series): Series => {
    series.forEach((seriesPoint: SeriesPoint): void => {
      const point = seriesPoint;
      if (Number.isNaN(seriesPoint.slice(-1)[0])) [point[1]] = seriesPoint;
      else Object.defineProperty(seriesPoint, 'key', { value: series.key });
    });
    return series;
  });

  // Set up chart dimensions.
  const margin = { top: 15, right: 75, bottom: 30, left: 85 };
  const barHeight = 50;
  const width = 640;
  const height = data.team_results.length * barHeight + margin.top + margin.bottom;

  // Create SVG chart.
  const svg = d3
    .select('#relay-results__results-chart')
    .attr('viewBox', `0, 0, ${width}, ${height}`);

  // Define scales.
  const xScale = d3
    .scaleLinear()
    .domain([0, data.xMax])
    .rangeRound([margin.left, width - margin.right]);
  const yScale = d3
    .scaleBand()
    .domain(data.team_names.map((name: string): string => `Team ${name}`))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.08);

  // Create groups for stacked bar data.
  const runnerPositionGroups = svg
    .selectAll('g.runner-groups')
    .data(stackedTeamTimes)
    .join('g')
    .attr(
      'class',
      (d: Series): string => `relay-results__results-chart__runner-${d.key}`
    );

  // Add individual runner bars.
  runnerPositionGroups
    .selectAll('rect.individual-runner')
    .data((d: Series): Series => d)
    .join('rect')
    .attr(
      'class',
      (d: SeriesPoint): string =>
        `relay-results__results-chart__${
          parseInt((d as KeyedSeriesPoint).key, 10) % 2 === 0
            ? 'even-runner'
            : 'odd-runner'
        }`
    )
    .attr('x', (d: SeriesPoint): number => xScale(d[0]))
    .attr('y', (d: SeriesPoint): number => yScale(`Team ${d.data.team}`)!)
    .attr('width', 0)
    .attr('height', yScale.bandwidth())
    .transition()
    .delay((_d: SeriesPoint, i: number): number => i * 100)
    .duration(1000)
    .attr('width', (d: SeriesPoint): number => xScale(d[1]) - xScale(d[0]));

  // Add bar text.
  function barText(selection: string, index: 0 | 1, dy: string, text: Function) {
    /* Add text to individual bars. */
    runnerPositionGroups
      .selectAll(selection)
      .data((d: Series): Series => d)
      .join('text')
      .attr('class', 'relay-results__text')
      .attr('x', (d: SeriesPoint): number => xScale(d[index]))
      .attr(
        'y',
        (d: SeriesPoint): number =>
          yScale(`Team ${d.data.team}`)! + yScale.bandwidth() / 2
      )
      .attr('dy', dy)
      .attr('dx', 10)
      .attr('opacity', 0)
      .text((d: SeriesPoint) => text(d))
      .transition()
      .delay((_d: SeriesPoint, i: number): number => i * 100)
      .duration(2000)
      .attr('opacity', 1);
  }

  barText('text.runner-name', 0, '-0.2em', (d: SeriesPoint): string =>
    d.data.runners[(d as KeyedSeriesPoint).key]
      ? `${d.data.runners[(d as KeyedSeriesPoint).key]}`
      : ''
  );
  barText('text.runner-time', 0, '1em', (d: SeriesPoint): string =>
    d.data.runners[(d as KeyedSeriesPoint).key]
      ? `${secondsToString(d.data[(d as KeyedSeriesPoint).key] as number)}`
      : ''
  );
  barText('text.total-time', 1, '0.35em', (d: SeriesPoint): string =>
    parseInt((d as KeyedSeriesPoint).key, 10) === data.members_per_team
      ? `${secondsToString(d.data.total_time)}`
      : ''
  );

  // Add x-axis.
  const numTicks = Math.floor(data.xMax / (60 * 15)) + 1;
  const tickValues = Array.from({ length: numTicks }, (_, i) => i * 60 * 15);
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(tickValues)
    .tickFormat((d: d3.NumberValue): string => secondsToString(d as number));
  svg
    .append('g')
    .attr('class', 'relay-results__x-axis relay-results__text')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .call(
      (
        g: d3.Selection<SVGGElement, unknown, HTMLElement, any>
      ): d3.Selection<d3.BaseType, unknown, HTMLElement, any> =>
        g.select('.domain').remove()
    );

  // Add y-axis.
  svg
    .append('g')
    .attr('class', 'relay-results__y-axis relay-results__text')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
}

async function resultsChart(date: string): Promise<void> {
  /* Fetch data then generate results chart. */
  try {
    const data: Data | undefined = await d3.json(`/relay-results/results/${date}`);
    /* istanbul ignore else */
    if (data) generateChart(data);
  } catch (error: unknown) {
    /* istanbul ignore else */
    if (error instanceof Error) flash(`${error}`);
  }
}

export { generateChart, resultsChart };
