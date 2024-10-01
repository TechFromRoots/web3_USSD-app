import { Document } from "mongoose";

export default interface IUser extends Document {
    phoneNumber: number;
    address: string;
    pin?: string | undefined | null;
}