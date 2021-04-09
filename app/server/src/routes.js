import * as listener from './listener.js';

/**
 * Initialize routes.
 * @param {Object} app Express instance
 * @returns {void}
 */
export function init (app) {
  app.put ('/api/stocks/:symbol', listener.registerStock);
  app.delete ('/api/stocks/:symbol', listener.deregisterStock);
}
