"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const index_route_1 = __importDefault(require("../routes/index.route"));
const logger_middleware_1 = require("./logger.middleware");
const logger = new logger_middleware_1.Logger();
exports.default = (app) => {
    // Logging middleware
    app.use((0, morgan_1.default)("combined"));
    // CORS middleware
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH"],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    // Configuration setup (dotenv)
    if (process.env.NODE_ENV !== 'production')
        (0, dotenv_1.configDotenv)();
    // Body parsing middleware
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    // Security middleware
    app.use((0, helmet_1.default)());
    // Mounting routes
    app.use(logger.log, index_route_1.default);
};
