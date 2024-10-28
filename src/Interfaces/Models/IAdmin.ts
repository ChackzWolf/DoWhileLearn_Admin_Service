import { Document } from "mongoose";
export interface IAdmin extends Document {
    email: string;
    password: string;
    wallet:number;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}