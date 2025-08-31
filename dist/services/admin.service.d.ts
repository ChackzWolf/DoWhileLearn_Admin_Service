import { IAdminService } from "./Interfaces/IService.interfaces";
import { IAdminRepository } from "../repository/interfaces/IRepositroy.interfaces";
import { OrderEventData } from "../contracts/events";
import { ResendOtpResponse, ResetPasswordResponse } from "../contracts/admin.types";
import { IAdminAuthService } from "./types/admin-auth.service.types";
import { EmailData, ResendOtpData, AdminLoginDTO, ResetPasswordData, SendEmailOtpResponse, resetPasswordOtpData, AdminLoginResponseService, ResetPasswordVerifyOTPData } from "./types/admin-service.types";
export declare class AdminService implements IAdminService {
    private adminRepository;
    private adminAuth;
    constructor(adminRepository: IAdminRepository, adminAuth: IAdminAuthService);
    adminLogin(loginData: AdminLoginDTO): Promise<AdminLoginResponseService>;
    resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse>;
    sendEmailOtp(data: EmailData): Promise<SendEmailOtpResponse>;
    resendEmailOtp(data: ResendOtpData): Promise<ResendOtpResponse>;
    resetPasswordVerifyOTP(data: resetPasswordOtpData): Promise<ResetPasswordVerifyOTPData>;
    handleOrderSuccess(paymentEvent: OrderEventData): Promise<void>;
    handleOrderTransactionFail(failedPaymentEvent: OrderEventData): Promise<void>;
}
