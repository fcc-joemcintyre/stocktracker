import { Application } from 'express';
import { deregisterStock, registerStock } from './listener.js';

/**
 * Initialize routes.
 * @param app Express instance
 */
export function init (app: Application): void {
  app.put ('/api/stocks/:symbol', registerStock);
  app.delete ('/api/stocks/:symbol', deregisterStock);
}
