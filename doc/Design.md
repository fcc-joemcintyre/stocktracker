# Stock Tracker Design

The *Stock Tracker* application is a full stack application project defined by
FreeCodeCamp at
http://www.freecodecamp.com/challenges/chart-the-stock-market

## License
This document is licensed under a Creative Commons Attribution 4.0
International License (CC-BY).

The source code for the project is made available under a MIT license,
https://www.github.com/fcc-joemcintyre/stocktracker/LICENSE.txt

# Overview

The *Stock Tracker* application tracks a set of stocks that can be managed
by any viewer of the application. All viewers will see the current set of
stocks being tracked.

An instance of the application is hosted on Heroku at
http://stocktracker-jm/herokuapp.com

## Functional Requirements

Client Loading:

- The server will serve a web application to a connecting browser

Client Display:

- If no stocks are currently being tracked, a blank chart will be shown
- If one or more stocks are being tracked, each will have,
-- A line in the chart showing historical close price
-- A stock tracker below the chart showing symbol, name, line color and
close button allowing it to be removed from the set of tracked stocks
-- A tooltip entry showing the symbol and closing price for the current position
- If less than eight stocks are being tracked, an entry box will be shown to
allow an additional stock to be added to the set of tracked stocks
- A range selector, allowing date range to be selected for the chart
- A status area
-- Showing list of outstanding requests for stock data
-- Showing list of errors from prior requests

Data Exchange:

- The server will accept REST calls to add and remove stocks to tracker
- The server will send the current dataset to a newly connecting client
- The server will broadcast updates to all connected clients when the set of
tracked stocks changes

## Non-Functional Requirements

The application processor, memory and storage requirements will fit within the
constraints to be hosted on a free Heroku dyno.

No redundancy or scaling features are implemented.

The heroku instance uses https for transport security between the browser and
application. Other deployments of this application may choose to use http or
https.

## Data Provider

Financial data is provided by Quandl, and is limited to the historical stock
quotation data available. Since updated data has not been available for some
time, the date ranges represent historical date ranges backward from the last
date present.

## Technology Selections

The server is implemented with Node.js version 16.x and uses Typescript
with ES2020 output.

The client interface is implemented with React 17.x using Typescript.

Socket.io is used for broadcast communications between the server and client.

Webpack is used for build.
