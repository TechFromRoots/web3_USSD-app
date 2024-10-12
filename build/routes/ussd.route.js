"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ussd_controller_1 = __importDefault(require("../controllers/ussd.controller"));
const router = express_1.default.Router();
const { ussd } = new ussd_controller_1.default();
// ussd gateway
router.post("/", ussd);
exports.default = router;
