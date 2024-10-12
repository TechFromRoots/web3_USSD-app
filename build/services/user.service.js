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
const user_model_1 = __importDefault(require("../models/user.model"));
const base_repository_1 = __importDefault(require("../repositories/base.repository"));
const UserRepository = new base_repository_1.default(user_model_1.default);
class UserService {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield UserRepository.create(user);
            return yield UserRepository.findOne({ _id: createdUser.id }, "-__v");
        });
    }
    findOne(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserRepository.findOne(param, "-__v");
        });
    }
    editById(id, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserRepository.updateById(id, { $set: obj }, { new: true });
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserRepository.countDocuments();
        });
    }
}
exports.default = UserService;
