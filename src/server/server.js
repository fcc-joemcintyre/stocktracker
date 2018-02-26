const express = require ('express');
const bodyParser = require ('body-parser');
const path = require ('path');
const http = require ('http');
const socketio = require ('socket.io');
const routes = require ('./routes');
const listener = require ('./listener');

/**
 * Start the Stock Tracker server.
 * @param {number} port Server port to listen on
 * @return {void}
 */
function start (port) {
  console.log ('Starting Stock Tracker server');

  try {
    // initialize and start server
    const app = express ();
    app.use (bodyParser.json ());
    app.use (bodyParser.urlencoded ({ extended: false }));
    app.use (express.static (path.join (__dirname, 'public')));

    const server = http.createServer (app);
    const io = socketio.listen (server);

    listener.init (io);
    routes.init (app, listener);
    server.listen (port, () => {
      console.log (`Stock Tracker server listening on port ${port}`);
    });
  } catch (err) {
    console.log ('ERROR Server startup', err);
    process.exit (1);
  }
}

exports.start = start;
