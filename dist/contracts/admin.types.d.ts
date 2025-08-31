import { Types } from "mongoose";
import { IAdmin } from "../entities/admin.entity";
export interface EmptyRequest {
}
export interface TestResponse {
    success: boolean;
}
export interface VerifyOTPResetPasswordRequest {
    email: string;
    otpId: string;
    enteredOTP: string;
}
export interface ResendOtpEmail {
    otpId: string;
    email: string;
}
export interface ResendOtpResponse {
    success: boolean;
    status: number;
    message: string;
}
export interface ResetPasswordRequest {
    adminId: string;
    password: string;
}
export interface ResetPasswordResponse {
    success: boolean;
    status: number;
    message: string;
}
export interface SendOtpEmail {
    email: string;
}
export interface SendOtpResponse {
    message: string;
    success: boolean;
    status: number;
    email?: string;
    adminId?: Types.ObjectId;
    otpId?: Types.ObjectId;
}
export interface OTPRequest {
    email: string;
    enteredOTP: string;
    tempId: string;
}
export interface OTPResponse {
    success: boolean;
    message: string;
    status: number;
    adminId?: Types.ObjectId;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    success: boolean;
    adminData?: IAdmin;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
}
export interface AdminData {
    email: string;
    password: string;
    _id: string;
}
