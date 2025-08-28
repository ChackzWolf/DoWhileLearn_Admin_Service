import * as grpc from '@grpc/grpc-js';
import { KafkaMessage } from 'kafkajs';
import { IAdminService } from "../interfaces/IServices/IService.interfaces";
import { LoginRequest, LoginResponse, OTPResponse, ResendOtpEmail, ResendOtpResponse, ResetPasswordRequest, ResetPasswordResponse, SendOtpResponse, TestResponse, VerifyOTPResetPasswordRequest } from '../contracts/admin.types';
export declare class AdminController {
    private adminService;
    constructor(adminService: IAdminService);
    start(): Promise<void>;
    routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void>;
    handleMessage(message: KafkaMessage): Promise<void>;
    handleRollback(message: KafkaMessage): Promise<void>;
    Login(call: grpc.ServerUnaryCall<LoginRequest, LoginResponse>, callback: grpc.sendUnaryData<LoginResponse>): Promise<void>;
    resetPassword(call: grpc.ServerUnaryCall<ResetPasswordRequest, ResetPasswordResponse>, callback: grpc.sendUnaryData<ResetPasswordResponse>): Promise<void>;
    sendOtpToEmail(call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, SendOtpResponse>, callback: grpc.sendUnaryData<SendOtpResponse>): Promise<void>;
    resendOtpToEmail(call: grpc.ServerUnaryCall<ResendOtpEmail, ResendOtpResponse>, callback: grpc.sendUnaryData<ResendOtpResponse>): Promise<void>;
    VerifyEnteredOTP(call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, OTPResponse>, callback: grpc.sendUnaryData<OTPResponse>): Promise<void>;
    test(_call: grpc.ServerUnaryCall<null, TestResponse>, callback: grpc.sendUnaryData<TestResponse>): void;
}
