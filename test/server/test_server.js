import fetch from 'node-fetch';
import * as server from '../../src/server/server.js';

before (function () {
  server.start (3999);
});

after (async function () {
  await server.stop ();
});

describe ('test server', function () {
  describe ('/', function () {
    it ('should return 200 with home page', async () => {
      const res = await fetch ('http://localhost:3999/', { method: 'GET' });
      if (!res.ok) {
        throw new Error ('Invalid request');
      }
      if (res.status === 200) {
        const data = await res.text ();
        if (data.indexOf ('<title>Stock Tracker</title>') === -1) {
          throw new Error ('Invalid body', data);
        }
      } else {
        throw new Error ('Invalid response', res.status);
      }
    });
  });

  describe ('invalid URL content', function () {
    it ('should return 200 with home page', async () => {
      const res = await fetch ('http://localhost:3999/dummy', { method: 'GET' });
      if (!res.ok) {
        throw new Error ('Invalid request');
      }
      if (res.status === 200) {
        const data = await res.text ();
        if (data.indexOf ('<title>Stock Tracker</title>') === -1) {
          throw new Error ('Invalid body', data);
        }
      } else {
        throw new Error ('Invalid response', res.status);
      }
    });
  });

  describe ('valid register stock request', function () {
    it ('should register stock', async () => {
      const res = await fetch ('http://localhost:3999/api/stocks/AAPL', { method: 'PUT' });
      if (!res.ok) {
        throw new Error ('Invalid request');
      }
      if (res.status === 200) {
        const data = await res.json ();
        if (data.errorCode !== 0) {
          throw new Error ('Invalid errorCode', data.errorCode);
        }
      } else {
        throw new Error ('Invalid response', res.status);
      }
    });
  });

  describe ('valid deregister stock request', function () {
    it ('should deregister stock', async () => {
      const res = await fetch ('http://localhost:3999/api/stocks/AAPL', { method: 'DELETE' });
      if (!res.ok) {
        throw new Error ('Invalid request');
      }
      if (res.status === 200) {
        const data = await res.json ();
        if (data.errorCode !== 0) {
          throw new Error ('Invalid errorCode', data.errorCode);
        }
      } else {
        throw new Error ('Invalid response', res.status);
      }
    });
  });
});
