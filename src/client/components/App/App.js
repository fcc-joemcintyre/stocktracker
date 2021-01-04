import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Page } from '../home/Page';

const socket = io ();

export const App = () => {
  const [months, setMonths] = useState (1);
  const [data, setData] = useState ({ data: [], errors: [] });
  const [retrieving, setRetrieving] = useState ([]);

  /**
   * At start, establish socket connection with monitoring server
   * @return {void}
   */
  useEffect (() => {
    socket.on ('update', update);

    /**
     * On receipt of monitor broadcast, update retrieving list and then
     * set new data.
     * @param {string} input Data from monitoring server
     * @return {void}
     */
    function update (input) {
      const d = JSON.parse (input);

      // divide error and completed data items
      const errors = [];
      const filtered = d.filter ((item) => {
        if (item.status !== 0) {
          const text = (item.status >= 500) ? 'Stock quote service unavailable' :
            (item.status === 404) ? 'Stock symbol not found' :
              (item.status === 429) ? 'Request limit reached' : 'Unknown';
          errors.push (`[Stock:${item.symbol} Error:${item.status} (${text})]`);
          return false;
        }
        return true;
      });

      // convert dates in data items to Date objects
      filtered.forEach ((a) => {
        a.data.forEach ((b) => {
          b[0] = new Date (b[0]); // eslint-disable-line no-param-reassign
        });
      });

      setData ({ data: filtered, errors });
    }
  }, [setData]);

  /**
   * Add a stock to set of monitored stocks. Initially add it to the list
   * of requests in process (retrieving). The update function will change
   * the state from retrieving to monitored.
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  function onAddStock (symbol) {
    server ('PUT', symbol);
    setRetrieving ([...retrieving, symbol]);
  }

  /**
   * Remove stock from interest (remove from retrieving or monitored set).
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  function onRemoveStock (symbol) {
    server ('DELETE', symbol);
  }

  /**
   * Initiate interaction with server. Data will be received through
   * the update function from broadcasts from the monitoring server.
   * @param {string} action PUT or DELETE
   * @param {string} symbol Stock trading symbol
   * @return {void}
   */
  function server (action, symbol) {
    const req = new XMLHttpRequest ();
    req.onreadystatechange = (() => {
      if (req.readyState === 4) {
        if (req.status !== 200) {
          setData ({ ...data, errors: data.errors.concat (`Error processing ${symbol}`) });
        }
      }
    });
    req.open (action, `api/stocks/${symbol}`, true);
    req.send ();
  }

  /**
   * Change range of months to display
   * @param {number} value Number of months in range
   * @return {void}
   */
  function onRangeChanged (value) {
    setMonths (value);
  }

  const left = retrieving.filter ((a) => (data.data.find ((b) => b.symbol === a) === undefined));
  return (
    <Page
      data={data.data}
      months={months}
      retrieving={left}
      errors={data.errors}
      onRangeChanged={onRangeChanged}
      onAddStock={onAddStock}
      onRemoveStock={onRemoveStock}
    />
  );
};
