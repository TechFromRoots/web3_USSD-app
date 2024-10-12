"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = exports.MAXAGE = exports.DATABASES = exports.BASEPATH = exports.JWT_SECRET = exports.PORT = exports.DB = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.DB = {
    url: process.env.DB_URI
};
exports.PORT = process.env.PORT || 9871;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.BASEPATH = "/api/v1";
exports.DATABASES = {
    USER: "User"
};
exports.MAXAGE = 3 * 24 * 60 * 60;
exports.MESSAGES = {
    DATABASE: {
        CONNECTED: "Connection to database has been established successfully",
        ERROR: "Unable to connect to database."
    },
    INVALID_ID: "Id doesn't exists.",
    NOT_ID: "Not a valid object Id.",
    UNEXPECTED_ERROR: "An unexpected error occured"
};
