import { Document } from "mongoose";
export interface IAdmin extends Document {
    firstName:string;
    lastName:string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}