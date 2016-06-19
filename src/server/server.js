/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
'use strict';
const express = require ('express');
const bodyParser = require ('body-parser');
const path = require ('path');
const http = require ('http');
const socketio = require ('socket.io');
const routes = require ('./routes');
const listener = require ('./listener');

/**
 * Start the Stock Tracker server.
 */
function start (port) {
  console.log ('Starting Stock Tracker server');

  // initialize and start server
  let app = express ();
  app.use (bodyParser.json ());
  app.use (bodyParser.urlencoded ({extended:false}));
  app.use (express.static (path.join (__dirname, 'public')));

  let server = http.createServer (app);
  let io = socketio.listen (server);

  listener.init (io);
  routes.init (app, listener);
  server.listen (port);

  console.log ('Stock Tracker server listening on port ' + port);
}

exports.start = start;
