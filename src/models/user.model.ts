import { model, Schema } from "mongoose";
import { DATABASES } from "../configs/constants.config";
import IUser from "../interfaces/user.interface";

const userSchema = new Schema<IUser>({
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    pin: {
        type: String,
        required: false
    }
}, {
    strict: true,
    timestamps: true,
    versionKey: false
});

const User = model(DATABASES.USER, userSchema, DATABASES.USER);
export default User;