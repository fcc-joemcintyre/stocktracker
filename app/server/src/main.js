import { processCommand } from './cmd.js';
import { start } from './server.js';

/**
 * Process command line to start server.
 * @return {void}
 */
function main () {
  const command = processCommand (process.argv.slice (2));
  if (command.exit) {
    process.exit (command.code);
  }

  const port = process.env.PORT || command.port;
  start (port);
}

main ();
