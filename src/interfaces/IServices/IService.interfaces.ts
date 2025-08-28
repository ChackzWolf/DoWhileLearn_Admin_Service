import { Types } from "mongoose";
import { AdminLoginDTO, AdminLoginResponseService } from "../DTOs/Admin.dtos";
import { OrderEventData } from "../events";

export interface IAdminService {
    adminLogin(loginData: AdminLoginDTO): Promise<AdminLoginResponseService>
    resetPassword(data: { adminId: string, password: string }): Promise<{ message: string, success: boolean, status: number }>
    sendEmailOtp(data: { email: string }): Promise<{ success: boolean, message: string, status: number, email?: string, otpId?: Types.ObjectId, adminId?: Types.ObjectId }>
    resendEmailOtp(data: { email: string, otpId: string }): Promise<{ success: boolean, status: number, message: string }>
    resetPasswordVerifyOTP(data: { email: string, enteredOTP: string }): Promise<{ success: boolean, message: string, status: number, email: string, adminId?: Types.ObjectId }>
    handleOrderSuccess(paymentEvent: OrderEventData): Promise<void>
    handleOrderTransactionFail(failedPaymentEvent: OrderEventData): Promise<void>
}
