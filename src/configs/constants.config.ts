import { configDotenv } from "dotenv";
configDotenv();

export const DB = {
    url: process.env.DB_URI
}

export const PORT = process.env.PORT || 9871;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BASEPATH = "/api/v1";
export const DATABASES = {
    USER: "User"
};
export const MAXAGE = 3 * 24 * 60 * 60;
export const MESSAGES = {
    DATABASE: {
        CONNECTED: "Connection to database has been established successfully",
        ERROR: "Unable to connect to database."
    },
    INVALID_ID: "Id doesn't exists.",
    NOT_ID: "Not a valid object Id.",
    UNEXPECTED_ERROR: "An unexpected error occured"
}