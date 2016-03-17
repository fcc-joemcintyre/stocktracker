/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
"use strict";

/**
 * Initialize routes.
 */
function init (app, listener) {
  app.put ("/api/stocks/:symbol", listener.registerStock);
  app.delete ("/api/stocks/:symbol", listener.deregisterStock);
}

exports.init = init;
