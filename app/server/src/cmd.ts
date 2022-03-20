export type CommandResult = {
  code: number,
  exit: boolean,
  port: number,
};

type Options = {
  p?: string,
  h?: boolean,
};

/**
 * Valid command options
 *  [-p | --port] port to listen on, default 3000
 *  [-h | --help] display help info
 *
 * @param args Array of arguments
 * @returns Command parsing result
 */
export function processCommand (args: string[]): CommandResult {
  const values: Options = {};
  const errors = [];

  for (const arg of args) {
    const [key, value] = arg.split ('=');
    switch (key) {
      case '-p':
      case '--port':
        values.p = value;
        break;
      case '-h':
      case '--help':
        values.h = true;
        break;
      default:
        errors.push (`Error: Invalid option (${key})`);
    }
  }

  // validate arguments
  let port = 0;
  if (values.p) {
    const t = Number (values.p);
    if (Number.isInteger (t) && (t > 0 && t < 65536)) {
      port = t;
    } else {
      errors.push (`Invalid port number (${values.p}). Must be integer between 0 and 65535`);
      port = 0;
    }
  } else {
    port = 3000;
  }

  let help = false;
  if (values.h) {
    help = true;
  }

  // if help not an argument, output list of errors
  if ((!values.h) && (errors.length > 0)) {
    for (const error of errors) {
      console.log (error);
    }
  }

  // if help argument or errors, output usage message
  if (values.h || (errors.length > 0)) {
    console.log (
      `Usage: node pollster.js [-p=port] [-h]
    -p or --port      Port number to listen on. Default: 3000
    -h or --help      This message.`
    );
  }

  return ({
    code: errors.length === 0 ? 0 : 1,
    exit: errors.length > 0 || help,
    port,
  });
}
