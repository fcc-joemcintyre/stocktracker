import fs from 'fs';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { Server } from 'socket.io';

type Dataset = {
  name: string,
  data: string,
};

type Stock = {
  symbol: string,
  status: number,
  name: string | null,
  data: string | null,
};

// socket.io and stock data
let io: Server;
let stocks: Stock[] = [];

/**
 * Initialize. Setup Socket.io connection listener, sending current current
 * data to newly connecting client.
 * @param _io Socket.io instance
 */
export function setSocket (_io: Server): void {
  io = _io;
  io.on ('connection', (socket) => {
    console.log ('added connection');
    socket.emit ('update', JSON.stringify (stocks));
  });
}

/**
 * Register interest in a stock to track.
 * @param {object} req Request
 * @param {object} res Response
 * @returns {void}
 */
export async function registerStock (req: Request, res: Response) {
  console.log ('registerStock');
  let result = { errorCode: 0, message: '' };
  let { symbol } = req.params;
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
    if (!found) {
      const added = await addStock (symbol);
      if (!added) {
        result = { errorCode: 1, message: 'Symbol not found' };
      }
    }
  } else {
    result = { errorCode: 1, message: 'Symbol missing' };
  }
  res.status (200).json (result);
}

/**
 * Deregister interest in a stock to track.
 * @param {object} req Request
 * @param {object} res Response
 * @returns {void}
 */
export function deregisterStock (req: Request, res: Response) {
  console.log ('deregisterStock');
  let result = { errorCode: 0, message: '' };
  let { symbol } = req.params;
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
  } else {
    result = { errorCode: 1, message: 'Symbol missing' };
  }
  res.status (200).json (result);
}

/**
 * Add a stock, fetching its historical data (async)
 * @param symbol Stock trading symbol
 * @returns Symbol added or not
 */
async function addStock (symbol: string): Promise<boolean> {
  console.log ('addStock', symbol);
  // if not production, use test files as data source
  if (process.env.NODE_ENV === 'test') {
    const names: Record<string, string> = {
      IBM: 'IBM Corporation',
      MSFT: 'Microsoft Corporation',
    };

    // navigate from server running from build, or test runner
    const cwd = process.cwd ();
    const dir = cwd.endsWith ('/dist') ? '../app/server/test' : '../test';
    const filename = `${dir}/${symbol.toUpperCase ()}.json`;

    let result = true;
    try {
      const data = fs.readFileSync (filename, { encoding: 'utf-8' });
      stocks.push ({
        status: 0,
        symbol,
        name: names[symbol] || symbol.toUpperCase (),
        data: JSON.parse (data),
      });
      console.log (`${symbol} now being tracked`);
    } catch (err) {
      console.log ('Error reading test file', filename);
      stocks.push ({
        status: 404,
        symbol,
        name: null,
        data: null,
      });
      result = false;
    }
    broadcast ();
    return result;
  }

  const key = process.env.QKEY;
  if (!key) {
    console.log ('Quandl key not set up');
    return false;
  }

  // calculate start / end dates (3 year history)
  const date = new Date (2018, 2, 26);
  date.setFullYear (date.getFullYear () - 3);
  const startDate = `${date.getFullYear ()}-${date.getMonth () + 1}-${date.getDate ()}`;
  const dates = `start_date=${startDate}`;

  // construct url and retrieve data
  const keyParam = (key) ? `&api_key=${key}` : '';
  const base = `https://www.quandl.com/api/v3/datasets/WIKI/${symbol}.json`;
  const url = `${base}?order=asc&${dates}${keyParam}`;
  const res = await fetch (url, {
    method: 'GET',
  });
  const data = await res.json () as { dataset: Dataset };
  if (res.ok) {
    const index = data.dataset.name.indexOf ('(');
    const name = (index === -1) ? data.dataset.name : data.dataset.name.substring (0, index - 1);
    // add stock to set of tracked stocks, broadcast to connected clients
    stocks.push ({
      status: 0,
      symbol,
      name,
      data: data.dataset.data,
    });
    console.log (`${symbol} now being tracked`);
    // uncomment next line for development data recording
    // fs.writeFileSync (`${symbol}.json`, JSON.stringify (data.dataset.data));
  } else {
    stocks.push ({
      status: res.status,
      symbol,
      name: null,
      data: null,
    });
    console.log ('Fetch error: status code ', res.status);
    console.log ('  Detailed msg', data);
  }
  broadcast ();
  return res.ok;
}

/**
 * Broadcast tracked stocks to all connected clients (async)
 */
function broadcast (): void {
  process.nextTick (() => {
    if (io) {
      console.log ('broadcast', stocks.length, 'tracked stocks');
      io.emit ('update', JSON.stringify (stocks));

      // clean up any error records after each broadcast
      stocks = stocks.filter ((a) => a.status === 0);
    }
  });
}
