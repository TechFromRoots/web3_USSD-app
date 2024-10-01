import { Document, ObjectId } from "mongoose";

export default interface IUser extends Document {
    _id: ObjectId;
    phoneNumber: number;
    address: string;
    pin?: string | undefined | null;
}