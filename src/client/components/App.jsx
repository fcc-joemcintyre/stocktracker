/**
 * Copyright (c) Joe McIntyre, 2016-2018
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import io from 'socket.io-client';
import { Titlebar } from './Titlebar.jsx';
import { Range } from './Range.jsx';
import { StockChart } from './StockChart.jsx';
import { Stock } from './Stock.jsx';
import { StockEntry } from './StockEntry.jsx';
import { Status } from './Status.jsx';

export default class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      errors: [],
      retrieving: [],
      data: [],
      months: 12,
      colors: ['blue', 'green', 'lightblue', 'lightgreen', 'purple', 'orange',
        'lightpurple', 'steelblue'],
      chartKey: 1,
    };
    this.addStock = this.addStock.bind (this);
    this.server = this.server.bind (this);
    this.removeStock = this.removeStock.bind (this);
    this.update = this.update.bind (this);
    this.onRangeChanged = this.onRangeChanged.bind (this);
  }

  /**
   * On component mount, establish socket connection with monitoring server
   * @return {void}
   */
  componentDidMount () {
    const socket = io.connect ();
    socket.on ('update', this.update);
  }

  /**
   * Change range of months to display
   * @param {number} months Number of months in range
   * @return {void}
   */
  onRangeChanged (months) {
    this.setState ({ months });
  }

  /**
   * Add a stock to set of monitored stocks. Initially add it to the list
   * of requests in process (retrieving). The update function will change
   * the state from retrieving to monitored.
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  addStock (symbol) {
    this.server ('PUT', symbol);
    this.state.retrieving.push (symbol);
    this.forceUpdate ();
  }

  /**
   * Initiate interaction with server. Data will be received through
   * the update function from broadcasts from the monitoring server.
   * @param {string} action PUT or DELETE
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  server (action, symbol) {
    const req = new XMLHttpRequest ();
    req.onreadystatechange = (() => {
      if (req.readyState === 4) {
        if (req.status !== 200) {
          this.setState (prev => ({ errors: prev.errors.concat (`Error processing ${symbol}`) }));
        }
      }
    });
    req.open (action, `api/stocks/${symbol}`, true);
    req.send ();
  }

  /**
   * Remove stock from interest (remove from retrieving or monitored set).
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  removeStock (symbol) {
    this.server ('DELETE', symbol);
  }

  /**
   * On receipt of monitor broadcast, update retrieving list and then
   * set new data.
   * @param {string} input Data from monitoring server
   * @return {void}
   */
  update (input) {
    const data = JSON.parse (input);
    this.setState ((prev) => {
      // remove retrieving items as received
      const retrieving = prev.retrieving.filter ((a) => {
        for (const item of data) {
          if (item.symbol === a) {
            return false;
          }
        }
        return true;
      });

      // divide error and completed data items
      const errors = [];
      const filtered = data.filter ((item) => {
        if (item.status !== 0) {
          const text = (item.status >= 500) ? 'Stock quote service unavailable' :
            (item.status === 404) ? 'Stock symbol not found' :
              (item.status === 429) ? 'Request limit reached' : 'Unknown';
          errors.push (`[Stock:${item.symbol} Error:${item.status} (${text})]`);
          return false;
        }
        return true;
      });
      return ({
        retrieving,
        data: filtered,
        errors,
        chartKey: prev.chartKey + 1,
      });
    });
  }

  render () {
    const stocks = [];
    let color = 0;
    for (const item of this.state.data) {
      // assign color to item
      item.color = this.state.colors[color];
      stocks.push (
        <Stock
          key={item.symbol}
          symbol={item.symbol}
          name={item.name}
          color={item.color}
          removeStock={this.removeStock}
        />
      );
      color += 1;
    }

    // if not all tracking slots (8) are taken, show entry component
    const stockEntry = (stocks.length < 8) ? <StockEntry addStock={this.addStock} /> : null;

    return (
      <div>
        <Titlebar />
        <Range months={this.state.months} onRangeChanged={this.onRangeChanged} />
        <StockChart
          key={this.state.chartKey}
          className='stockChart'
          width={900}
          height={500}
          months={this.state.months}
          stocks={this.state.data}
        />
        <div className='stockArea'>
          {stocks}
          {stockEntry}
        </div>
        <Status requests={this.state.retrieving} errors={this.state.errors} />
      </div>
    );
  }
}

render (<App />, document.getElementById ('app'));
