const request = require ('request');

// socket.io and stock data
let io;
let stocks = [];

/**
 * Initialize. Setup Socket.io connection listener, sending current current
 * data to newly connecting client.
 * @param {Object} _io Socket.io instance
 * @return {void}
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
 * @param {Object} req Request
 * @param {Object} res Response
 * @return {void}
 */
function registerStock (req, res) {
  let result;
  let symbol = req.params.symbol;
  if (symbol) {
    // add if symbol not already active
    symbol = symbol.toString ().trim ().toUpperCase ();
    let found = false;
    for (const stock of stocks) {
      if (symbol === stock.symbol) {
        found = true;
        break;
      }
    }
    if (! found) {
      addStock (symbol);
    }
    result = { errorCode: 0 };
  } else {
    result = { errorCode: 1, message: 'Symbol missing' };
  }
  res.status (200).json (result);
}

/**
 * Deregister interest in a stock to track.
 * @param {Object} req Request
 * @param {Object} res Response
 * @return {void}
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
    result = { errorCode: 0 };
  } else {
    result = { errorCode: 1, message: 'Symbol missing' };
  }
  res.status (200).json (result);
}

/**
 * Add a stock, fetching its historical data (async)
 * @param {string} symbol Stock trading symbol
 * @return {void}
 */
function addStock (symbol) {
  process.nextTick (() => {
    // calculate start / end dates (3 year history)
    const date = new Date ();
    date.setFullYear (date.getFullYear () - 3);
    const startDate = `${date.getFullYear ()}-${date.getMonth () + 1}-${date.getDate ()}`;
    const dates = `start_date=${startDate}`;

    // construct url and retrieve data
    const key = process.env.QKEY;
    const keyParam = (key) ? `&api_key=${key}` : '';
    const base = `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}.json`;
    const url = `${base}?order=asc&${dates}${keyParam}`;
    request.get (url, (err, res, body) => {
      if (! err) {
        if (res.statusCode === 200) {
          const data = JSON.parse (body);
          const index = data.dataset.name.indexOf ('(');
          const name = (index === -1) ? data.dataset.name : data.dataset.name.substring (0, index - 1);
          // add stock to set of tracked stocks, broadcast to connected clients
          stocks.push ({
            status: 0,
            symbol,
            name,
            data: data.dataset.data,
          });
          broadcast ();
          console.log (`${symbol} now being tracked`);
        } else {
          stocks.push ({
            status: res.statusCode,
            symbol,
            name: null,
            data: null,
          });
          console.log ('Fetch error: status code ', res.statusCode);
          const data = JSON.parse (body);
          console.log ('  Detailed msg', data);
          broadcast ();
        }
      } else {
        stocks.push ({
          status: 1,
          symbol,
          name: null,
          data: null,
        });
        console.log ('Fetch error:', err);
        broadcast ();
      }
    });
  });
}

/**
 * Broadcast tracked stocks to all connected clients (async)
 * @return {void}
 */
function broadcast () {
  process.nextTick (() => {
    if (io) {
      console.log ('broadcast', stocks.length, 'tracked stocks');
      io.emit ('update', JSON.stringify (stocks));

      // clean up any error records after each broadcast
      stocks = stocks.filter (a => (a.status === 0));
    }
  });
}

exports.init = init;
exports.registerStock = registerStock;
exports.deregisterStock = deregisterStock;
