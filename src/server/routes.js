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
