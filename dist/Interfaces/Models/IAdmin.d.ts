import { Document, Types } from "mongoose";
export interface IAdmin extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    wallet: number;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}
