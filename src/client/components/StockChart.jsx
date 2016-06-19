/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React from 'react';
import d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {dateOffset} from './util';

// array indexes for stock data
const DATE = 0;
const CLOSE = 11;

export default class StockChart extends React.Component {
  constructor (props) {
    super (props);
  }

  /**
   * Render the SVG chart.
   */
  render () {
    // set shell rendering flag for empty dataset
    let noData = (this.props.stocks.length === 0);

    // extract chart stock data from dataset
    let stocks = [];
    if (! noData) {
      let startDate = dateOffset (new Date (), this.props.months);
      for (let stock of this.props.stocks) {
        // adjust date format
        stock.data.forEach (function (d) {
          if (typeof (d[DATE]) === 'string') {
            d[DATE] = d3.time.format('%Y-%m-%d').parse (d[DATE]);
          }
        });

        stocks.push ({
          symbol: stock.symbol,
          name: stock.name,
          color: stock.color,
          data: stock.data.filter (d => {
            return (d[DATE] > startDate);
          })
        });
      }
    }

    let margin = {top: 10, right: 10, bottom: 60, left: 80};
    let width = this.props.width - margin.left - margin.right;
    let height = this.props.height - margin.top - margin.bottom;

    // set default x and y axis values if no data
    let maxDate = new Date ();
    let minDate = new Date ();
    minDate.setFullYear (maxDate.getFullYear () - 3);
    let min = 0;
    let max = 100;

    // set x scale by date, y scale by closing price
    if (! noData) {
      let data = stocks[0].data;
      minDate = new Date (data[0][DATE]);
      maxDate = new Date (data[data.length - 1][DATE]);

      min = d3.min (stocks, (d1) => {
        return d3.min (d1.data, (d2) => {
          return d2[CLOSE];
        })
      });
      max = d3.max (stocks, (d1) => {
        return d3.max (d1.data, (d2) => {
          return d2[CLOSE];
        })
      });
    }

    let xScale = d3.time.scale ()
      .domain ([minDate, maxDate])
      .range ([0, width]);
    let yScale = d3.scale.linear ()
      .domain ([min, max])
      .range ([height, 0]);

    // define x and y axis
    let xAxis = d3.svg.axis ()
      .scale (xScale)
      .orient ('bottom');
    let yAxis = d3.svg.axis ()
      .scale (yScale)
      .orient ('left');

    // create svg parent element
    let node = ReactFauxDOM.createElement('svg');
    let chart = d3.select (node)
      .attr ('width', width + margin.left + margin.right)
      .attr ('height', height + margin.top + margin.bottom)
      .append ('g')
        .attr ('class', 'g_chart')
        .attr ('transform', 'translate (' + margin.left + ',' + margin.top + ')');

    // add x and y axis
    chart.append ('g')
      .attr ('class', 'x axis')
      .attr ('transform', 'translate (0,' + height + ')')
      .call (xAxis);
    chart.append ('g')
      .attr ('class', 'y axis')
      .call (yAxis);

    // line point calculation
    let line = d3.svg.line ()
      .x ((d) => { return xScale (d[DATE]); })
      .y ((d) => { return yScale (d[CLOSE]); })
      .interpolate ('basis');

    // add a bar for each quarter, with hover tooltip
    if (! noData) {
      // set up mouse tracker for vertical line and tooltip display
      setupMouseTracker (chart, stocks, margin, width, height, xScale);

      // chart each stock
      for (let stock of stocks) {
        chart.append('path')
          .datum (stock.data)
          .attr ('class', 'line')
          .attr ('d', line)
          .attr ('stroke', stock.color);
      }
    }

    // add axis labels
    chart.append ('text')
      .attr ('x', width / 2)
      .attr ('y', margin.top + height + 28)
      .attr ('text-anchor', 'middle')
      .text ('Date');
    chart.append ('text')
      .attr ('x', 0)
      .attr ('y', 0)
      .attr ('text-anchor', 'middle')
      .attr ('transform', 'translate(-40, 60) rotate(-90)')
      .text ('Closing price');

    return (
      <div style={{ width:this.props.width, height: this.props.height }}>
        {node.toReact ()}
      </div>
    );
  }
}

/**
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
  chart.on('mousemove', function () {
    // calculate index item
    let x = xScale.invert (d3.event.pageX - margin.left - 8);
    let bisect = d3.bisector (d => { return d[0]; }).left;
    let index = bisect (stocks[0].data, x, 1);

    // populate tooltip content
    let date = stocks[0].data[index][0];
    let text = `${date.getFullYear ()}-${date.getMonth () + 1}-${date.getDate ()}`;
    for (let stock of stocks) {
      if (stock.data[index]) {
        text += `<br/>${stock.symbol}: ${stock.data[index][CLOSE].toFixed (2)}`;
      }
    }
    tooltip.attr ('height', stocks.length * 14 + 4);  // calc tooltip height
    tooltip.transition ()
      .duration (200)
      .style ('opacity', 0.9);
    tooltip.html (text)
      .style ('left', (d3.event.pageX + 5) + 'px')
      .style ('top', (d3.event.pageY - 28) + 'px');
    tooltipLine
      .style ('opacity', 0.9)
      .style ('left', (d3.event.pageX) + 'px');
  })
  .on ('mouseover', function () {
    d3.selectAll ('.line_over').style ('display', 'block');
  })
  .on ('mouseout', function () {
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

Range.propTypes = {
  // stock data
  stocks: React.PropTypes.arrayOf (React.PropTypes.object).isRequired,
  // months in range
  months: React.PropTypes.number.isRequired,
  // chart width
  width: React.PropTypes.number.isRequired,
  // chart height
  height: React.PropTypes.number.isRequired
}
