import * as grpc from '@grpc/grpc-js';
import { OTPResponse, TestResponse, LoginRequest, LoginResponse, ResendOtpEmail, SendOtpResponse, ResendOtpResponse, ResetPasswordRequest, ResetPasswordResponse, VerifyOTPResetPasswordRequest } from '../../contracts/admin.types';
import { IAdminService } from '../../services/Interfaces/IService.interfaces';
export declare class AdminController {
    private adminService;
    constructor(adminService: IAdminService);
    Login(call: grpc.ServerUnaryCall<LoginRequest, LoginResponse>, callback: grpc.sendUnaryData<LoginResponse>): Promise<void>;
    resetPassword(call: grpc.ServerUnaryCall<ResetPasswordRequest, ResetPasswordResponse>, callback: grpc.sendUnaryData<ResetPasswordResponse>): Promise<void>;
    sendOtpToEmail(call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, SendOtpResponse>, callback: grpc.sendUnaryData<SendOtpResponse>): Promise<void>;
    resendOtpToEmail(call: grpc.ServerUnaryCall<ResendOtpEmail, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void>;
    VerifyEnteredOTP(call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, OTPResponse>, callback: grpc.sendUnaryData<OTPResponse>): Promise<void>;
    test(_call: grpc.ServerUnaryCall<null, TestResponse>, callback: grpc.sendUnaryData<TestResponse>): void;
}
