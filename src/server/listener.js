/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
'use strict';
const request = require ('request');

// socket.io and stock data
let io;
let stocks = [];

/**
 * Initialize. Setup Socket.io connection listener, sending current current
 * data to newly connecting client.
 * @param _io Socket.io instance
 */
function init (_io) {
  io = _io;
  io.on ('connection', (socket) => {
    console.log ('added connection');
    socket.emit ('update', JSON.stringify (stocks));
  });
}

/**
 * Register interest in a stock to track.
 */
function registerStock (req, res) {
  let result;
  let symbol = req.params.symbol;
  if (symbol) {
    // add if symbol not already active
    symbol = symbol.toString ().trim ().toUpperCase ();
    let found = false;
    for (let stock of stocks) {
      if (symbol === stock.symbol) {
        found = true;
        break;
      }
    }
    if (! found) {
      addStock (symbol);
    }
    result = {errorCode:0};
  } else {
    result = {errorCode:1, message:'Symbol missing'};
  }
  res.status (200).json (result);
}

/**
 * Deregister interest in a stock to track.
 */
function deregisterStock (req, res) {
  let result;
  let symbol = req.params.symbol;
  if (symbol) {
    // if present, remove from stocks
    symbol = symbol.toString ().trim ().toUpperCase ();
    for (let i = 0; i < stocks.length; i ++) {
      if (symbol === stocks[i].symbol) {
        stocks.splice (i, 1);
        broadcast ();
        console.log (`${symbol} no longer being tracked`);
        break;
      }
    }
    result = {errorCode:0};
  } else {
    result = {errorCode:1, message:'Symbol missing'};
  }
  res.status (200).json (result);
}

/**
 * Add a stock, fetching its historical data (async)
 * @param symbol Stock trading symbol
 */
function addStock (symbol) {
  process.nextTick (() => {
    // calculate start / end dates (3 year history)
    let date = new Date ();
    date.setFullYear (date.getFullYear () - 3);
    let startDate = `${date.getFullYear ()}-${date.getMonth () + 1}-${date.getDate ()}`;
    let dates= `start_date=${startDate}`;

    // construct url and retrieve data
    let key = process.env.QKEY;
    let keyParam = (key) ? `&api_key=${key}` : '';
    let base = `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}.json`;
    let url = `${base}?order=asc&${dates}${keyParam}`;
    request.get (url, (err, res, body) => {
      if (! err) {
        if (res.statusCode === 200) {
          let data = JSON.parse (body);
          let index = data.dataset.name.indexOf ('(');
          let name = (index === -1) ? data.dataset.name : data.dataset.name.substring (0, index - 1);
          // add stock to set of tracked stocks, broadcast to connected clients
          stocks.push ({
            status: 0,
            symbol: symbol,
            name: name,
            data: data.dataset.data
          });
          broadcast ();
          console.log (`${symbol} now being tracked`);
        } else {
          stocks.push ({
            status: res.statusCode,
            symbol: symbol,
            name: undefined,
            data: undefined
          });
          console.log ('Fetch error: status code ', res.statusCode);
          let data = JSON.parse (body);
          console.log ('  Detailed msg', data);
          broadcast ();
        }
      } else {
        stocks.push ({
          status: 1,
          symbol: symbol,
          name: undefined,
          data: undefined
        });
        console.log ('Fetch error:', err);
        broadcast ();
      }
    });
  });
}

/**
 * Broadcast tracked stocks to all connected clients (async)
 */
function broadcast () {
  process.nextTick (() => {
    if (io) {
      console.log ('broadcast', stocks.length, 'tracked stocks');
      io.emit ('update', JSON.stringify (stocks));

      // clean up any error records after each broadcast
      stocks = stocks.filter (a => { return a.status === 0; });
    }
  });
}

exports.init = init;
exports.registerStock = registerStock;
exports.deregisterStock = deregisterStock;
