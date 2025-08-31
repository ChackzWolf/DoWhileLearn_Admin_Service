import * as grpc from '@grpc/grpc-js';
import {
  OTPResponse,
  TestResponse,
  LoginRequest,
  LoginResponse,
  ResendOtpEmail,
  SendOtpResponse,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyOTPResetPasswordRequest
} from '../../contracts/admin.types';
import { IAdminService } from '../../services/Interfaces/IService.interfaces';
import { IAdminGrpcController } from './interfaces/IAdmin-grpc.controller';

export class AdminController implements IAdminGrpcController{
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async Login(
    call: grpc.ServerUnaryCall<LoginRequest, LoginResponse>,
    callback: grpc.sendUnaryData<LoginResponse>
  ): Promise<void> {
    try {
      const response = await this.adminService.adminLogin(call.request);
      callback(null, response);
    } catch (err) {
      callback(err as grpc.ServiceError);
    }
  }

  async resetPassword(
    call: grpc.ServerUnaryCall<ResetPasswordRequest, ResetPasswordResponse>,
    callback: grpc.sendUnaryData<ResetPasswordResponse>
  ): Promise<void> {
    try {
      const response = await this.adminService.resetPassword(call.request);
      callback(null, response);
    } catch (err) {
      callback(err as grpc.ServiceError);
    }
  }

  async sendOtpToEmail(
    call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, SendOtpResponse>,
    callback: grpc.sendUnaryData<SendOtpResponse>
  ): Promise<void> {
    try {
      const response = await this.adminService.sendEmailOtp(call.request);
      callback(null, response);
    } catch (err) {
      callback(err as grpc.ServiceError);
    }
  }

  async resendOtpToEmail(
    call: grpc.ServerUnaryCall<ResendOtpEmail, ResendOtpResponse>,
    callback: grpc.sendUnaryData<ResendOtpResponse>
  ): Promise<void> {
    try {
      const response = await this.adminService.resendEmailOtp(call.request);
      callback(null, response);
    } catch (err) {
      callback(err as grpc.ServiceError);
    }
  }

  async VerifyEnteredOTP(
    call: grpc.ServerUnaryCall<VerifyOTPResetPasswordRequest, OTPResponse>,
    callback: grpc.sendUnaryData<OTPResponse>
  ): Promise<void> {
    try {
      const response = await this.adminService.resetPasswordVerifyOTP(call.request);
      callback(null, response);
    } catch (err) {
      callback(err as grpc.ServiceError);
    }
  }

  test(
    _call: grpc.ServerUnaryCall<null, TestResponse>,
    callback: grpc.sendUnaryData<TestResponse>
  ): void {
    callback(null, { success: true });
  }
}
