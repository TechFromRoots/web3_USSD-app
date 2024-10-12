"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_config_1 = require("../configs/constants.config");
const userSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    walletDetails: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    pin: {
        type: String,
        required: false,
    },
}, {
    strict: true,
    timestamps: true,
    versionKey: false,
});
const User = (0, mongoose_1.model)(constants_config_1.DATABASES.USER, userSchema, constants_config_1.DATABASES.USER);
exports.default = User;
