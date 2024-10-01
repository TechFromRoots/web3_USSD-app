import { ObjectId } from "mongoose";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";
import BaseRepository from "../repositories/base.repository";
const UserRepository = new BaseRepository(User);

export default class UserService {
    async create(user: Partial<IUser>) {
        const createdUser = await UserRepository.create(user);
        return await UserRepository.findOne({ _id: createdUser.id}, "-__v");
    }

    async findOne(param: {}) {
        return await UserRepository.findOne(param, "-__v");
    }

    async editById(id: ObjectId, obj: Partial<IUser>) {
        return await UserRepository.updateById(id, { $set: obj }, { new: true });
    }

    async count() {
        return await UserRepository.countDocuments();
    }
}