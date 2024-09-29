import { Request, Response, NextFunction } from 'express';
import pino from "pino";

export default pino({
  level: 'info',
});

class Logger {
  constructor() { this.log };

  /**@desc Logs request events on server console */
  log(req: Request, res: Response, next: NextFunction) {
    let date = new Date;
    const timestamp = date.toString();

    console.warn(`[${req.method}] - ${req.protocol}://${req.headers.host}${req.originalUrl} [${req.ip}][${timestamp}]`);
    next();
  }
};

export { Logger };