import { IAdminService } from "../Interfaces/IServices/IService.interfaces";
import { AdminLoginDTO, AdminLoginResponseService } from "../Interfaces/DTOs/Admin.dtos";
import { StatusCode } from "../Interfaces/Enums/Enums";
import { IAdminRepository } from "../Interfaces/IRepositories/IRepositroy.interfaces";
export interface OrderEventData {
    userId: string;
    tutorId: string;
    courseId: string;
    transactionId: string;
    title: string;
    thumbnail: string;
    price: string;
    adminShare: string;
    tutorShare: string;
    paymentStatus: boolean;
    timestamp: Date;
    status: string;
}
export declare class AdminService implements IAdminService {
    private adminRepository;
    constructor(adminRepository: IAdminRepository);
    adminLogin(loginData: AdminLoginDTO): Promise<AdminLoginResponseService>;
    resetPassword(data: {
        adminId: string;
        password: string;
    }): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    sendEmailOtp(data: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: StatusCode;
        email?: undefined;
        otpId?: undefined;
        adminId?: undefined;
    } | {
        message: string;
        success: boolean;
        status: StatusCode;
        email: string;
        otpId: import("bson").ObjectId;
        adminId: unknown;
    }>;
    resendEmailOtp(data: {
        email: string;
        otpId: string;
    }): Promise<{
        success: boolean;
        status: StatusCode;
        message: string;
    }>;
    resetPasswordVerifyOTP(data: {
        email: string;
        enteredOTP: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: StatusCode;
        email: string;
        adminId: unknown;
    } | {
        success: boolean;
        message: string;
        status: StatusCode;
        email: string;
        adminId?: undefined;
    }>;
    handleOrderSuccess(paymentEvent: OrderEventData): Promise<void>;
    handleOrderTransactionFail(failedPaymentEvent: OrderEventData): Promise<void>;
}
