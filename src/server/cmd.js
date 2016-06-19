/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/stocktracker/LICENSE.txt)
 */
'use strict';

/**
 * Parse a string to an integer, returning null if not an integer
 * @param {String} value String to convert
 * @returns {Number} Converted number, or null
 */
function getInteger (value) {
  let result = null;
  if (/^(\-|\+)?([0-9])+$/.test (value)) {
    result = Number (value);
  }
  return result;
}

/**
 * Valid command options
 *  [-p | --port] port to listen on, default 3000
 * @param {[String]} Array of arguments
 * @returns {Object} code:{Integer}, exit:{Boolean}, port:{Integer}
 */
function processCommand (args) {
  let showHelp = false;
  let errors = [];
  let defaults = {
    port: 3000
  };
  let result = {
    code: 0,
    exit: false,
    port: 0
  };

  for (let arg of args) {
    // if a settings argument, it will contain an equals sign
    if (arg.indexOf ('=') > -1) {
      // divide argument into left and right sides, and assign
      let elements = arg.split ('=');
      let key = elements[0];
      if ((key === '-p') || (key === '--port')) {
        result.port = elements[1];
      } else{
        errors.push (`Error: Invalid option (${elements[0]})`);
      }
    } else {
      if (arg === '-h' || arg === '--help') {
        showHelp = true;
      } else {
        errors.push (`Error: Invalid option (${arg})`);
      }
    }
  }

  // validate arguments, assign defaults
  let port = getInteger (result.port);
  if ((port === null) || (port < 0) || (port > 65535)) {
    errors.push ('Invalid port number (${result.port}). Must be integer between 0 and 65535');
  } else if (port === 0) {
    result.port = defaults.port;
  } else {
    result.port = port;
  }

  // if help not an argument, output list of errors
  if ((showHelp === false) && (errors.length > 0)) {
    for (let error of errors) {
      console.log (error);
    }
  }

  // if help argument or errors, output usage message
  if ((showHelp === true) || (errors.length > 0)) {
    console.log (
`Usage: stocktracker [-p=port] [-h]
  -p or --port      Port number to listen on. Default: ${defaults.port}
  -h or --help      This message.`);
    result.code = (showHelp) ? 0 : 1;
    result.exit = true;
  }
  return result;
}

exports.processCommand = processCommand;
