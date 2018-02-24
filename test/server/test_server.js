/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
const request = require ('request');
const server = require ('../../dist/server');

before (function () {
  server.start (3999);
});

describe ('test server', function () {
  describe ('/', function () {
    it ('should return 200 with home page', function (done) {
      request.get ('http://localhost:3999/', function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          if (body.indexOf ('<title>Stock Tracker</title>') !== -1) {
            return done ();
          } else {
            return (done (new Error ('Invalid body', body)));
          }
        }
        return done (new Error ('Invalid response', res.statusCode));
      });
    });
  });

  describe ('invalid URL content', function () {
    it ('should return 200 with instructions', function (done) {
      request.get ('http://localhost:3999/dummy', function (err, res) {
        if (err) { return done (err); }
        if (res.statusCode === 404) {
          return done ();
        }
        return done (new Error ('Invalid response', res.statusCode));
      });
    });
  });

  describe ('valid register stock request', function () {
    it ('should register stock', function (done) {
      request.put ('http://localhost:3999/api/stocks/AAPL', function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          const data = JSON.parse (body);
          if (data.errorCode === 0) {
            return done ();
          } else {
            return done (new Error (`Invalid errorCode ${data.errorCode}`));
          }
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ('valid deregister stock request', function () {
    it ('should deregister stock', function (done) {
      request.del ('http://localhost:3999/api/stocks/AAPL', function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          const data = JSON.parse (body);
          if (data.errorCode === 0) {
            return done ();
          } else {
            return done (new Error (`Invalid errorCode ${data.errorCode}`));
          }
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });
});
