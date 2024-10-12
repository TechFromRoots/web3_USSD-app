"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const pino_1 = __importDefault(require("pino"));
exports.default = (0, pino_1.default)({
    level: 'info',
});
class Logger {
    constructor() { this.log; }
    ;
    /**@desc Logs request events on server console */
    log(req, res, next) {
        let date = new Date;
        const timestamp = date.toString();
        console.warn(`[${req.method}] - ${req.protocol}://${req.headers.host}${req.originalUrl} [${req.ip}][${timestamp}]`);
        next();
    }
}
exports.Logger = Logger;
;
