import { IAdmin } from "../../entities/admin.entity";
import { Types } from "mongoose";
export interface AdminLoginDTO {
    email: string;
    password: string;
}
export interface AdminLoginResponse {
    success: boolean;
    adminData: IAdmin;
    message: string;
    status: number;
    accessToken: string;
    refreshToken: string;
    _id: string;
}
export interface AdminLoginResponseService {
    status: number;
    success: boolean;
    message: string;
    adminData?: IAdmin;
    refreshToken?: string;
    accessToken?: string;
}
export interface ResetPasswordData {
    adminId: string;
    password: string;
}
export interface ResetPasswordResponse {
    message: string;
    success: boolean;
    status: number;
}
export interface EmailData {
    email: string;
}
export interface SendEmailOtpResponse {
    success: boolean;
    message: string;
    status: number;
    email?: string;
    otpId?: Types.ObjectId;
    adminId?: Types.ObjectId;
}
export interface ResendOtpData {
    email: string;
    otpId: string;
}
export interface ResendOtpResponse {
    success: boolean;
    status: number;
    message: string;
}
export interface resetPasswordOtpData {
    email: string;
    enteredOTP: string;
}
export interface ResetPasswordVerifyOTPData {
    success: boolean;
    message: string;
    status: number;
    email: string;
    adminId?: Types.ObjectId;
}
