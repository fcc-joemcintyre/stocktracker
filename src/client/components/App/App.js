import React, { Component } from 'react';
import io from 'socket.io-client';
import { Page } from './Page';

export class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      errors: [],
      retrieving: [],
      data: [],
      months: 12,
      chartKey: 1,
    };
    this.onRangeChanged = this.onRangeChanged.bind (this);
    this.onAddStock = this.onAddStock.bind (this);
    this.onRemoveStock = this.onRemoveStock.bind (this);
    this.server = this.server.bind (this);
    this.update = this.update.bind (this);
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
  onAddStock (symbol) {
    this.server ('PUT', symbol);
    this.state.retrieving.push (symbol);
    this.forceUpdate ();
  }

  /**
   * Remove stock from interest (remove from retrieving or monitored set).
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  onRemoveStock (symbol) {
    this.server ('DELETE', symbol);
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
      // convert dates in data itmes to Date objects
      const translated = filtered.map (
        a => Object.assign ({}, a, { data: a.data.map (
          b => Object.assign ({}, b, { 0: new Date (b[0]) })
        ) })
      );
      return ({
        retrieving,
        data: translated,
        errors,
        chartKey: prev.chartKey + 1,
      });
    });
  }

  render () {
    return (
      <Page
        data={this.state.data}
        months={this.state.months}
        retrieving={this.state.retrieving}
        errors={this.state.errors}
        chartKey={this.state.chartKey}
        onRangeChanged={this.onRangeChanged}
        onAddStock={this.onAddStock}
        onRemoveStock={this.onRemoveStock}
      />
    );
  }
}
