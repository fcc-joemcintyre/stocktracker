import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { dateOffset } from './dateOffset';

// array indexes for stock data
const DATE = 0;
const CLOSE = 11;

export const StockChart = ({ stocks, months, width, height }) => {
  const node = useRef (null);

  useEffect (() => {
    if (node.current) {
      d3.select (node.current).selectAll ('*').remove ();
      draw (node.current, stocks, months, width, height);
    }
  }, [stocks, months, width, height]);

  return (
    <svg
      ref={node}
      height={height}
      width={width}
    />
  );
};

function draw (node, stocks, months, width, height) {
  if (node === null) {
    return;
  }

  // set shell rendering flag for empty dataset
  const noData = (stocks.length === 0);

  const margin = { top: 10, right: 10, bottom: 60, left: 80 };
  const contentWidth = width - margin.left - margin.right;
  const contentHeight = height - margin.top - margin.bottom;

  // set default x and y axis values if no data
  const minDate = dateOffset (new Date (), months);
  const maxDate = new Date ();
  let maxPrice = 100;

  // set x scale by date, y scale by closing price
  if (!noData) {
    maxPrice = d3.max (stocks, (d1) => d3.max (d1.data, (d2) => d2[CLOSE]));
  }

  const xScale = d3.scaleTime ()
    .domain ([minDate, maxDate])
    .rangeRound ([0, contentWidth]);
  const yScale = d3.scaleLinear ()
    .domain ([0, maxPrice * 1.1])
    .rangeRound ([contentHeight, 0]);

  const chart = d3.select (node)
    .attr ('width', contentWidth + margin.left + margin.right)
    .attr ('height', contentHeight + margin.top + margin.bottom)
    .append ('g')
    .attr ('class', 'g_chart')
    .attr ('transform', `translate (${margin.left},${margin.top})`);

  // add x and y axis
  chart.append ('g')
    .attr ('class', 'x axis')
    .attr ('transform', `translate (0, ${contentHeight})`)
    .call (d3.axisBottom (xScale))
    .select ('.domain')
    .remove ();
  chart.append ('g')
    .attr ('class', 'y axis')
    .call (d3.axisLeft (yScale));

  // line point calculation
  const line = d3.line ()
    .x ((d) => xScale (d[DATE]))
    .y ((d) => yScale (d[CLOSE]));

  // add a bar for each quarter, with hover tooltip
  if (!noData) {
    // set up mouse tracker for vertical line and tooltip display
    setupMouseTracker (chart, stocks, margin, contentWidth, contentHeight, xScale);

    // chart each stock
    for (const stock of stocks) {
      chart.append ('path')
        .datum (stock.data.filter ((a) => (a[DATE] >= minDate)))
        .attr ('fill', 'none')
        .attr ('stroke', stock.color)
        .attr ('stroke-width', 1.5)
        .attr ('d', line);
    }
  }

  // add axis labels
  chart.append ('text')
    .attr ('x', contentWidth / 2)
    .attr ('y', margin.top + contentHeight + 28)
    .attr ('text-anchor', 'middle')
    .text ('Date');
  chart.append ('text')
    .attr ('x', 0)
    .attr ('y', 0)
    .attr ('text-anchor', 'middle')
    .attr ('transform', 'translate(-40, 60) rotate(-90)')
    .text ('Closing price');
}

/*
 * Setup mouse tracking for the chart, displaying a vertical line and
 * tooltip containing information on all stocks for the hovered date.
 * Note: this is broken out into an internal function due to length and
 * relative complexity.
 */
function setupMouseTracker (chart, stocks, margin, width, height, xScale) {
  // use only one tooltip element
  let tooltip = d3.select ('.tooltip');
  if (tooltip.size () === 0) {
    tooltip = d3.select ('body').append ('div')
      .attr ('class', 'tooltip')
      .style ('opacity', 0);
  }
  let tooltipLine = d3.select ('.tooltip-line');
  if (tooltipLine.size () === 0) {
    tooltipLine = d3.select ('body').append ('div')
      .attr ('class', 'tooltip-line')
      .style ('opacity', 0);
  }

  // mouse capture implementation
  //  on mouse enter (mouseover) and leave (mouseout), enable/disable
  //  on mouse move (mousemove), adjust line/tooltip position and content
  chart.on ('mousemove', () => {
    // calculate index item
    const x = xScale.invert (d3.event.pageX - margin.left - 8);
    const bisect = d3.bisector ((d) => d[0]).left;
    const index = bisect (stocks[0].data, x, 1);

    if (stocks[0].data[index]) {
      // populate tooltip content
      const date = stocks[0].data[index][0];
      let text = `${date.getFullYear ()}-${date.getMonth () + 1}-${date.getDate ()}`;
      for (const stock of stocks) {
        if (stock.data[index]) {
          text += `<br/>${stock.symbol}: ${stock.data[index][CLOSE].toFixed (2)}`;
        }
      }
      tooltip.attr ('height', `${stocks.length * 14 + 4}px`); // calc tooltip height
      tooltip.transition ()
        .duration (200)
        .style ('opacity', 0.9);
      tooltip.html (text)
        .style ('left', `${(d3.event.pageX + 5)}px`)
        .style ('top', `${(d3.event.pageY - 28)}px`);
      tooltipLine
        .style ('opacity', 0.9)
        .style ('left', `${(d3.event.pageX)}px`);
    }
  });
  chart.on ('mouseover', () => {
    d3.selectAll ('.line_over').style ('display', 'block');
  });
  chart.on ('mouseout', () => {
    d3.selectAll ('.line_over').style ('display', 'none');
    tooltip.transition ()
      .duration (500)
      .style ('opacity', 0);
    tooltipLine
      .style ('opacity', 0);
  });

  // define mouse capture area for display area of chart. This is an
  // overlay, it has no visible content.
  chart.append ('rect')
    .attr ('class', 'mouse-capture')
    .style ('visibility', 'hidden')
    .attr ('x', 0)
    .attr ('y', 0)
    .attr ('width', width)
    .attr ('height', height);
}

StockChart.propTypes = {
  stocks: PropTypes.arrayOf (PropTypes.object).isRequired,
  months: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
