# Stock Tracker

[![Build Status](https://travis-ci.org/fcc-joemcintyre/stocktracker.svg?branch=master)](https://travis-ci.org/fcc-joemcintyre/stocktracker)

Stock tracking, showing the historical closing prices for stocks selected by
the users.

The server component interacts with a stock information service (Quandl) to
fetch the data for the displayed stocks. It provides a client that allows
stocks to be added and removed from the list of tracked stocks, and
broadcasts changes to all connected clients.

The client component provides an interactive display of the stock information,

- date range can be selected (1m, 3m, 6m, 1y, 3y)
- up to 8 stocks can be tracked

If multiple clients are using the application, the display is
synchronized across the clients (a client adding or removing a stock will
result in all clients seeing the changed set of stocks).

## Live instance

The application can be used at https://stocktracker-jm.herokuapp.com

## Development setup

```
git clone https://github.com/fcc-joemcintyre/stocktracker.git
cd stocktracker
npm install
```

### Continuous Build

In one terminal, continuous build can be activated width

```
npm build
```

### Continuous server

In another terminal, continuous server updating can be activated width

```
npm start
```

### Client

Open browser to http://localhost:3000

## License
MIT
