"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const networkCarrierChecker_util_1 = require("../utils/networkCarrierChecker.util");
class BillService {
    getSupportedBills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supportedBills = yield axios_1.default.get("https://api.flutterwave.com/v3/top-bill-categories", {
                    params: {
                        country: "NG",
                    },
                    headers: {
                        Authorization: process.env.FLUTTERWAVE_SECRET,
                    },
                });
                return supportedBills.data;
            }
            catch (error) { }
        });
    }
    getBillCategory(billType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryInfo = yield axios_1.default.get(`https://api.flutterwave.com/v3/bills/${billType}/billers`, {
                    params: {
                        country: "NG",
                    },
                    headers: {
                        Authorization: process.env.FLUTTERWAVE_SECRET,
                    },
                });
                console.log(categoryInfo.data);
                return categoryInfo.data;
            }
            catch (error) { }
        });
    }
    buyAirtime(phoneNumber, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carrier = (0, networkCarrierChecker_util_1.getCarrier)(phoneNumber);
                const payLoad = {
                    country: "NG",
                    customer_id: `${phoneNumber}`,
                    amount: Number(amount),
                };
                console.log(carrier);
                switch (carrier) {
                    case "MTN NIGERIA":
                        try {
                            const mtnAirtime = yield axios_1.default.post(`https://api.flutterwave.com/v3/billers/BIL099/items/AT099/payment`, payLoad, {
                                headers: {
                                    Authorization: process.env.FLUTTERWAVE_SECRET,
                                },
                            });
                            console.log(mtnAirtime.data);
                            return mtnAirtime.data.status;
                        }
                        catch (error) {
                            console.log(error);
                            break;
                        }
                    case "GLO NIGERIA":
                        try {
                            const gloAirtime = yield axios_1.default.post(`https://api.flutterwave.com/v3/billers/BIL102/items/AT102/payment`, payLoad, {
                                headers: {
                                    Authorization: process.env.FLUTTERWAVE_SECRET,
                                },
                            });
                            console.log(gloAirtime.data);
                            return gloAirtime.data.status;
                        }
                        catch (error) {
                            break;
                        }
                    case "AIRTEL NIGERIA":
                        try {
                            const airtelAirtime = yield axios_1.default.post(`https://api.flutterwave.com/v3/billers/BIL100/items/AT100/payment`, payLoad, {
                                headers: {
                                    Authorization: process.env.FLUTTERWAVE_SECRET,
                                },
                            });
                            console.log(airtelAirtime.data);
                            return airtelAirtime.data.status;
                        }
                        catch (error) {
                            break;
                        }
                    case "9MOBILE NIGERIA":
                        try {
                            const etisalatAirtime = yield axios_1.default.post(`https://api.flutterwave.com/v3/billers/BIL103/items/AT103/payment`, payLoad, {
                                headers: {
                                    Authorization: process.env.FLUTTERWAVE_SECRET,
                                },
                            });
                            console.log(etisalatAirtime.data);
                            return etisalatAirtime.data.status;
                        }
                        catch (error) {
                            break;
                        }
                    default:
                        console.log("nothing");
                        break;
                }
            }
            catch (error) { }
        });
    }
}
exports.default = BillService;
// const bill = new BillService().buyAirtime("07064350087", "1500");
