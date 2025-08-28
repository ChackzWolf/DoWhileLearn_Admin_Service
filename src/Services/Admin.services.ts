import dotenv from "dotenv"
import createToken from "../utils/activation.token";
import { IAdminService } from "../interfaces/IServices/IService.interfaces";
import { AdminLoginDTO, AdminLoginResponseService } from "../interfaces/DTOs/Admin.dtos";
import { StatusCode } from "../interfaces/Enums/Enums";
import { generateOTP } from "../utils/generateOTP";
import { SendVerificationMail } from "../utils/sendEmail";
import { kafkaConfig } from "../configs/Kafka.configs/Kafka.config";
import { IAdminRepository } from "../interfaces/IRepositories/IRepositroy.interfaces";
import { Types } from "mongoose";
import { OrderEventData } from "../interfaces/events";


dotenv.config();




export class AdminService implements IAdminService {

    private adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    async adminLogin(loginData: AdminLoginDTO): Promise<AdminLoginResponseService> {
        try {
            const { email, password } = loginData;
            const adminData = await this.adminRepository.findByEmail(email);
            if (adminData) {
                const checkPassword = await adminData.comparePassword(password);
                if (checkPassword) {
                    console.log(adminData, 'kkkkkkkkk')
                    const { refreshToken, accessToken } = createToken(adminData)
                    return { success: true, message: "Admin login successful.", adminData, refreshToken, accessToken, status: StatusCode.Accepted }
                } else {
                    return { success: false, message: "Invalid password.", status: StatusCode.NotAcceptable}
                }
            } else {
                return { success: false, message: "Invalid email.", status: StatusCode.NotAcceptable }
            }

        } catch (error) {
            return { success: false, message: "An error occured while loggin in.", status: StatusCode.InternalServerError };
        }
    }

    async resetPassword(data: { adminId: string, password: string }): Promise<{ message: string, success: boolean, status: number }> {
        try {
            console.log(data, 'data from respon')
            const { adminId, password } = data;
            const response = await this.adminRepository.passwordChange(adminId, password);
            return response
        } catch (error) {
            return { message: 'error occured in service while changing password', success: false, status: StatusCode.NotModified }
        }
    }

    async sendEmailOtp(data: { email: string }): Promise<{ success: boolean, message: string, status: number, email?: string, otpId?: Types.ObjectId, adminId?: Types.ObjectId }> {
        try {
            const email = data.email;
            const emailExists = await this.adminRepository.findByEmail(email);
            if (!emailExists) {
                console.log("email not found triggered")
                return { success: false, message: "Email not found", status: StatusCode.NotFound };
            }
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            await SendVerificationMail(email, otp)
            console.log('1')
            const otpId = await this.adminRepository.storeOTP(email, otp);
            console.log('2')
            return { message: 'An OTP has send to your email address.', success: true, status: StatusCode.Found, email, otpId, adminId: emailExists._id };
        } catch (error) {
            return { message: 'error occured in sending OTP.', success: false, status: StatusCode.Conflict }
        }
    }

    async resendEmailOtp(data: { email: string, otpId: string }): Promise<{ success: boolean, status: number, message: string }> {
        try {
            console.log('trig resend')
            const { email, otpId } = data;
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);


            await SendVerificationMail(email, otp)


            const updateStoredOTP = await this.adminRepository.updateStoredOTP(otpId, otp);
            if (!updateStoredOTP) {
                return { success: false, status: StatusCode.NotFound, message: "Time expired. try again later." }
            }
            console.log(updateStoredOTP, 'stored otp')
            return { success: true, status: StatusCode.Accepted, message: "OTP has resend" };
        } catch (error) {
            console.log(error, "error")
            return { success: false, status: StatusCode.Conflict, message: "Error occured while resending OTP." };
        }
    }

    async resetPasswordVerifyOTP(data: { email: string, enteredOTP: string }): Promise<{ success: boolean, message: string, status: number, email: string, adminId?: Types.ObjectId }> {
        try {
            const { email, enteredOTP } = data;
            const response = await this.adminRepository.verifyOTP(email, enteredOTP)
            const admin = await this.adminRepository.findByEmail(email);
            if (response && admin) {
                return { success: true, message: 'Email has been verified successfuly.', status: StatusCode.Accepted, email, adminId: admin._id }
            }
            return { success: false, message: 'Entered wrong OTP.', status: StatusCode.NotAcceptable, email }
        } catch (error) {
            return { success: false, message: "Something went wrong.", status: StatusCode.FailedDependency, email: data.email }
        }
    }

    async handleOrderSuccess(paymentEvent: OrderEventData): Promise<void> {
        try {
            console.log(paymentEvent.adminShare, "this is admin share amount")
            const moneyToAdd = parseInt(paymentEvent.adminShare);
            const udpated = await this.adminRepository.updateWallet(moneyToAdd);
            if (!udpated?.success) {
                throw new Error(" not updated. error occuururur.")
            }
            await kafkaConfig.sendMessage('admin.response', {
                success: true,
                service: 'admin-service',
                status: 'COMPLETED',
                transactionId: paymentEvent.transactionId
            });
        } catch (error: any) {
            await kafkaConfig.sendMessage('admin.response', {
                ...paymentEvent,
                service: 'admin-service',
                status: 'FAILED',
                error: error.message
            });
        }
    }

    async handleOrderTransactionFail(failedPaymentEvent: OrderEventData): Promise<void> {
        const moneyToSubtract = parseInt(failedPaymentEvent.adminShare) * -1;
        const updated = await this.adminRepository.updateWallet(moneyToSubtract);
        if (!updated?.success) {
            throw Error("role back failed. update is not success.")
        }
        console.log('rollbacked ', moneyToSubtract)
        await kafkaConfig.sendMessage('rollback-completed', {
            transactionId: failedPaymentEvent.transactionId,
            service: 'admin-service'
        });
    }
}  