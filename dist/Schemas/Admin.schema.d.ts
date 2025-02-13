import mongoose, { Document, Types } from "mongoose";
import { IAdmin } from "../Interfaces/Models/IAdmin";
export interface ITempAdmin extends Document {
    adminData: IAdmin;
    otp: string;
    createdAt: Date;
    _id: Types.ObjectId;
}
export interface OTPInterface extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
}
export declare const Otp: mongoose.Model<OTPInterface, {}, {}, {}, mongoose.Document<unknown, {}, OTPInterface> & OTPInterface & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const TempAdmin: mongoose.Model<ITempAdmin, {}, {}, {}, mongoose.Document<unknown, {}, ITempAdmin> & ITempAdmin & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
declare const AdminModel: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin> & IAdmin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default AdminModel;
