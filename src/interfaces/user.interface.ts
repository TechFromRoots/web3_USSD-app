import { Document, ObjectId } from "mongoose";

export default interface IUser extends Document {
  _id: ObjectId;
  phoneNumber: number;
  address: string;
  walletDetails: string;
  pin?: string | undefined | null;
}
