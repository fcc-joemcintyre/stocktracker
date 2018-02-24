/**
 * Copyright (c) Joe McIntyre, 2016-2018
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */

/**
 * Initialize routes.
 * @param {Object} app Express instance
 * @param {Object} listener Route implementations
 * @return {void}
 */
function init (app, listener) {
  app.put ('/api/stocks/:symbol', listener.registerStock);
  app.delete ('/api/stocks/:symbol', listener.deregisterStock);
}

exports.init = init;
