import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import * as routes from './routes.js';
import * as listener from './listener.js';

let server;
let io;

// ensure HTTPS is used for all interactions
const httpsOnly = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect (['https://', req.hostname, req.url].join (''));
  } else {
    next ();
  }
};

// Start the server
export function start (port) {
  try {
    console.log ('INFO Starting server');
    const app = express ();

    // if production deployment, only allow https connections
    if (process.env.NODE_ENV === 'production') {
      app.use (httpsOnly);
    }

    // Express security best practices
    app.use (helmet ({
      contentSecurityPolicy: false,
    }));

    // set up HTTP parsers and session manager
    app.use (express.json ());
    app.use (express.urlencoded ({ extended: true }));

    routes.init (app);

    app.get ('*.js', (req, res) => {
      const file = path.join (process.cwd (), `public${req.path}.gz`);
      if (req.acceptsEncodings ('gzip') && fs.existsSync (file)) {
        res.set ({
          'content-type': 'text/javascript',
          'content-encoding': 'gzip',
        });
        res.sendFile (file);
      } else {
        res.set ({
          'content-type': 'text/javascript',
        });
        res.sendFile (path.join (process.cwd (), `public${req.path}`));
      }
    });

    // static file handling
    app.use (express.static (path.join (process.cwd (), 'public')));

    // for not explicitly handled REST routes, return 404 message
    app.use ('/api/*', (req, res) => {
      res.status (404).json ({});
    });
    // for all other routes, let client react-router handle them
    app.get ('*', (req, res) => {
      res.sendFile (path.join (process.cwd (), 'public/index.html'));
    });

    server = http.createServer (app);
    io = new Server (server);
    listener.setSocket (io);

    server.listen (port, () => {
      console.log (`INFO Server listening on port ${port}`);
    });
  } catch (err) {
    console.log ('ERROR Server startup', err);
    process.exit (1);
  }
}

export function stop () {
  return new Promise ((resolve) => {
    server.close (() => {
      resolve ();
    });
  });
}
