/* Relay Results: Paces Chart. */
import * as d3 from 'd3';

import { flash } from '../common/message-flashing';
import { secondsToString } from '../utils/time';

interface Run {
  name: string;
  pace: number;
}

function generateChart(data: Run[]): void {
  /* Generate paces chart. */

  // Set up chart dimensions.
  const margin = { top: 15, right: 50, bottom: 30, left: 85 };
  const barHeight = 30;
  const width = 640;
  const height = data.length * barHeight + margin.top + margin.bottom;
  const xMax = d3.max(data, (d: Run): number => d.pace)!;

  // Create SVG chart.
  const svg = d3
    .select('#relay-results__paces-chart')
    .attr('viewBox', `0, 0, ${width}, ${height}`);

  // Define scales.
  const xScale = d3
    .scaleLinear()
    .domain([0, xMax])
    .rangeRound([margin.left, width - margin.right]);
  const yScale = d3
    .scaleBand<number>()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1);

  // Add horizontal time bars.
  svg
    .append('g')
    .attr('class', 'relay-results__paces_chart__bars')
    .selectAll('rect.paces-bars')
    .data(data)
    .join('rect')
    .attr('class', 'relay-results__paces-chart__bar')
    .attr('x', xScale(0))
    .attr('y', (_d: Run, i: number): number => yScale(i)!)
    .attr('width', xScale(0))
    .attr('height', yScale.bandwidth())
    .transition()
    .delay((_d: Run, i: number): number => i * 100)
    .duration(1000)
    .attr('width', (d: Run): number => xScale(d.pace) - xScale(0));

  // Add horizontal time bar text.
  svg
    .append('g')
    .attr('class', 'relay-results__text')
    .attr('pointer-events', 'none')
    .selectAll('text.paces-text')
    .data(data)
    .join('text')
    .attr('x', xScale(0))
    .attr('y', (_d: Run, i: number): number => yScale(i)! + yScale.bandwidth() / 2)
    .attr('dy', '0.35em')
    .attr('dx', -4)
    .attr('opacity', 0)
    .text((d: Run): string => secondsToString(d.pace))
    .transition()
    .delay((_d: Run, i: number): number => i * 100)
    .duration(1000)
    .attr('opacity', 1)
    .attr('text-anchor', 'end')
    .attr('x', (d: Run): number => xScale(d.pace));

  // Add x-axis.
  const numTicks = Math.floor(xMax / 60) + 1;
  const tickValues = Array.from({ length: numTicks }, (_, i) => i * 60);
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
  const yAxis = d3
    .axisLeft(yScale)
    .tickSizeOuter(0)
    .tickFormat((i: number) => data[i]!.name);
  svg
    .append('g')
    .attr('class', 'relay-results__y-axis relay-results__text')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis);
}

async function pacesChart(date: string): Promise<void> {
  /* Fetch data then generate paces chart. */
  try {
    const data: Run[] | undefined = await d3.json(`/relay-results/paces/${date}`);
    /* istanbul ignore else */
    if (data && data.length > 0) generateChart(data);
  } catch (error: unknown) {
    /* istanbul ignore else */
    if (error instanceof Error) flash(`${error}`);
  }
}

export { generateChart, pacesChart };
