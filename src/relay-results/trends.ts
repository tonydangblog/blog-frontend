/* Relay Results: Trends Chart. */
import * as d3 from 'd3';
import { format } from 'date-fns';

import { flash } from '../common/message-flashing';
import { category12 } from '../utils/data-viz';
import { addDaysToDate, secondsToString } from '../utils/time';

interface DataPoint {
  date: Date;
  name: string;
  pace: number;
}

function generateChart(data: DataPoint[][], date: string): void {
  /* Generate trends chart. */

  // Set up chart dimensions.
  const runnerNames = data.map((d: DataPoint[]): string => d[0]!.name);
  const allPaces: number[] = [];
  data.forEach((runner: DataPoint[]): void => {
    runner.forEach((d: DataPoint): void => {
      allPaces.push(d.pace);
    });
  });
  const yMin = Math.min(...allPaces);
  const yMax = Math.max(...allPaces);
  const legendMargin = 80;
  const margin = {
    top: 15,
    right: 75,
    bottom: runnerNames.length * 16 + legendMargin,
    left: 85,
  };
  const width = 640;
  const height = 320 + margin.top + margin.bottom;

  // Create SVG chart.
  const svg = d3
    .select('#relay-results__trends-chart')
    .attr('viewBox', `0, 0, ${width}, ${height}`);

  // Define scales.
  const xScale = d3
    .scaleTime()
    .domain([
      new Date('2019-01-01T00:00:00-08:00'),
      addDaysToDate(`${date}T00:00:00-08:00`, 8 * 30),
    ])
    .rangeRound([margin.left, width - margin.right]);
  const yScale = d3
    .scaleLinear()
    .domain([yMin - 30, yMax + 30])
    .rangeRound([height - margin.bottom, margin.top]);

  // Define colors.
  const colors = d3.scaleOrdinal(category12).domain(runnerNames);

  // Add trend lines.
  const line = d3
    .line<DataPoint>()
    .x((d: DataPoint): number => xScale(d.date))
    .y((d: DataPoint): number => yScale(d.pace));
  svg
    .append('g')
    .attr('class', 'relay-results__trends-chart__paths')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('class', 'relay-results__trends-chart__path')
    .attr('d', (d: DataPoint[]): string | null => line(d))
    .attr('stroke', (d: DataPoint[]): string => colors(d[0]!.name))
    .attr('stroke-width', 4)
    .attr('fill', 'none')
    .attr('stroke-dasharray', function dashArray(): string {
      const path = d3.select(this).node();
      return path instanceof SVGPathElement
        ? /* istanbul ignore next */
          `${path.getTotalLength()} ${path.getTotalLength()}`
        : '0';
    })
    .attr('stroke-dashoffset', function dashOffset(): number {
      const path = d3.select(this).node();
      /* istanbul ignore next */
      return path instanceof SVGPathElement ? path.getTotalLength() : 0;
    })
    .transition()
    .duration(1500)
    .attr('stroke-dashoffset', 0);

  // Add data points.
  svg
    .append('g')
    .attr('class', 'relay-results__trends-chart__circles')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('fill', (d: DataPoint[]): string => colors(d[0]!.name))
    .selectAll('circle')
    .data((d: DataPoint[]): DataPoint[] => d)
    .join('circle')
    .attr('class', 'relay-results__trends-chart__circle')
    .attr('cx', (d: DataPoint): number => xScale(d.date))
    .attr('cy', (d: DataPoint): number => yScale(d.pace))
    .attr('r', 5)
    .attr('opacity', 0)
    .on('mouseover', function addTooltip(_e: Event, d: DataPoint): void {
      const xPosition = parseFloat(d3.select(this).attr('cx'));
      const yPosition = parseFloat(d3.select(this).attr('cy'));
      svg
        .append('rect')
        .attr('id', 'relay-results__trends-chart__tooltip-bg')
        .attr('class', 'relay-results__trends-chart__tooltip-bg')
        .attr('x', xPosition + 10)
        .attr('y', yPosition - 15)
        .attr('width', d.name.length * 10 + 15 + secondsToString(d.pace).length * 10)
        .attr('height', 40);
      svg
        .append('text')
        .attr('id', 'relay-results__trends-chart__tooltip-date')
        .attr('class', 'relay-results__small-text')
        .attr('x', xPosition + 15)
        .attr('y', yPosition)
        .text(`${format(d.date, 'MM/dd/yyyy')}`);
      svg
        .append('text')
        .attr('id', 'relay-results__trends-chart__tooltip-name-pace')
        .attr('class', 'relay-results__small-text')
        .attr('x', xPosition + 15)
        .attr('y', yPosition + 18)
        .text(`${d.name} - ${secondsToString(d.pace)}`);
    })
    .on('mouseout', (): void => {
      d3.select('#relay-results__trends-chart__tooltip-name-pace').remove();
      d3.select('#relay-results__trends-chart__tooltip-date').remove();
      d3.select('#relay-results__trends-chart__tooltip-bg').remove();
    })
    .transition()
    .delay((_d: DataPoint, i: number): number => i * 100)
    .duration(1500)
    .attr('opacity', 1);

  // Add legend.
  const legend = svg.append('g').attr('class', 'relay-results__trends-chart__legend');

  legend
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('class', 'relay-results__trends-chart__circle')
    .attr('cx', margin.left)
    .attr(
      'cy',
      (_d: DataPoint[], i: number) => height - margin.bottom + legendMargin + i * 16
    )
    .attr('r', 5)
    .attr('fill', (d: DataPoint[]): string => colors(d[0]!.name));

  legend
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('class', 'relay-results__text')
    .attr('x', margin.left + 15)
    .attr(
      'y',
      (_d: DataPoint[], i: number) => height - margin.bottom + legendMargin + 4 + i * 16
    )
    .text((d: DataPoint[]): string => d[0]!.name);

  // Add x-axis.
  svg
    .append('g')
    .attr('class', 'relay-results__x-axis relay-results__text')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .attr('text-anchor', 'end')
    .attr('x', -8)
    .attr('y', 8);

  // Add y-axis.
  const yAxis = d3
    .axisLeft(yScale)
    .tickSizeOuter(0)
    .tickFormat((d: d3.NumberValue): string => secondsToString(d as number));
  svg
    .append('g')
    .attr('class', 'relay-results__y-axis relay-results__text')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis);
}

async function trendsChart(date: string): Promise<void> {
  /* Fetch data then generate trends chart. */
  try {
    const rawData: DataPoint[][] | undefined = await d3.json(
      `/relay-results/trends/${date}`
    );
    const noTrendsP = document.getElementById('relay-results__no-trends-message');
    const trendsSVG = document.getElementById('relay-results__trends-chart');

    /* istanbul ignore else */
    if (noTrendsP && trendsSVG) {
      if (rawData && rawData.length > 0) {
        noTrendsP.style.display = 'none';
        trendsSVG.style.display = 'block';
        const data = rawData.map((runner: DataPoint[]): DataPoint[] =>
          runner.map(
            (d: DataPoint): DataPoint => ({
              date: new Date(d.date),
              name: d.name,
              pace: d.pace,
            })
          )
        );
        generateChart(data, date);
      } else {
        trendsSVG.style.display = 'none';
        noTrendsP.style.display = 'block';
      }
    }
  } catch (error: unknown) {
    /* istanbul ignore else */
    if (error instanceof Error) flash(`${error}`);
  }
}

export { generateChart, trendsChart };
