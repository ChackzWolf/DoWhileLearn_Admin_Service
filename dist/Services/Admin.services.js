"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const Admin_repository_1 = __importDefault(require("../Repository/AdminRepository/Admin.repository"));
const dotenv_1 = __importDefault(require("dotenv"));
const activation_token_1 = __importDefault(require("../Utils/activation.token"));
const Enums_1 = require("../Interfaces/Enums/Enums");
const generateOTP_1 = require("../Utils/generateOTP");
const sendEmail_1 = require("../Utils/sendEmail");
const Kafka_config_1 = require("../Configs/Kafka.configs/Kafka.config");
dotenv_1.default.config();
const repository = new Admin_repository_1.default();
class AdminService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async adminLogin(loginData) {
        try {
            const { email, password } = loginData;
            const adminData = await this.adminRepository.findByEmail(email);
            if (adminData) {
                const checkPassword = await adminData.comparePassword(password);
                if (checkPassword) {
                    console.log(adminData, 'kkkkkkkkk');
                    const { refreshToken, accessToken } = (0, activation_token_1.default)(adminData);
                    return { success: true, message: "Admin login successful.", adminData, refreshToken, accessToken };
                }
                else {
                    return { success: false, message: "Invalid password." };
                }
            }
            else {
                return { success: false, message: "Invalid email." };
            }
        }
        catch (error) {
            return { success: false, message: "An error occured while loggin in." };
        }
    }
    async resetPassword(data) {
        try {
            console.log(data, 'data from respon');
            const { adminId, password } = data;
            const response = await this.adminRepository.passwordChange(adminId, password);
            console.log(response, 'repon from service');
            return response;
        }
        catch (error) {
            return { message: 'error occured in service while changing password', success: false, status: Enums_1.StatusCode.NotModified };
        }
    }
    async sendEmailOtp(data) {
        try {
            const email = data.email;
            const emailExists = await this.adminRepository.findByEmail(email);
            if (!emailExists) {
                console.log("email not found triggered");
                return { success: false, message: "Email not found", status: Enums_1.StatusCode.NotFound };
            }
            let otp = (0, generateOTP_1.generateOTP)();
            console.log(`OTP : [ ${otp} ]`);
            await (0, sendEmail_1.SendVerificationMail)(email, otp);
            console.log('1');
            const otpId = await this.adminRepository.storeOTP(email, otp);
            console.log('2');
            return { message: 'An OTP has send to your email address.', success: true, status: Enums_1.StatusCode.Found, email, otpId, adminId: emailExists._id };
        }
        catch (error) {
            return { message: 'error occured in sending OTP.', success: false, status: Enums_1.StatusCode.Conflict };
        }
    }
    async resendEmailOtp(data) {
        try {
            console.log('trig resend');
            const { email, otpId } = data;
            let otp = (0, generateOTP_1.generateOTP)();
            console.log(`OTP : [ ${otp} ]`);
            await (0, sendEmail_1.SendVerificationMail)(email, otp);
            const updateStoredOTP = await this.adminRepository.updateStoredOTP(otpId, otp);
            if (!updateStoredOTP) {
                return { success: false, status: Enums_1.StatusCode.NotFound, message: "Time expired. try again later." };
            }
            console.log(updateStoredOTP, 'stored otp');
            return { success: true, status: Enums_1.StatusCode.Accepted, message: "OTP has resend" };
        }
        catch (error) {
            console.log(error, "error");
            return { success: false, status: Enums_1.StatusCode.Conflict, message: "Error occured while resending OTP." };
        }
    }
    async resetPasswordVerifyOTP(data) {
        try {
            const { email, enteredOTP } = data;
            const response = await this.adminRepository.verifyOTP(email, enteredOTP);
            const admin = await this.adminRepository.findByEmail(email);
            if (response && admin) {
                return { success: true, message: 'Email has been verified successfuly.', status: Enums_1.StatusCode.Accepted, email, adminId: admin._id };
            }
            return { success: false, message: 'Entered wrong OTP.', status: Enums_1.StatusCode.NotAcceptable, email };
        }
        catch (error) {
            return { success: false, message: "Something went wrong.", status: Enums_1.StatusCode.FailedDependency, email: data.email };
        }
    }
    async handleOrderSuccess(paymentEvent) {
        try {
            console.log(paymentEvent.adminShare, "this is admin share amount");
            const moneyToAdd = parseInt(paymentEvent.adminShare);
            const udpated = await this.adminRepository.updateWallet(moneyToAdd);
            if (!udpated?.success) {
                throw new Error(" not updated. error occuururur.");
            }
            await Kafka_config_1.kafkaConfig.sendMessage('admin.response', {
                success: true,
                service: 'admin-service',
                status: 'COMPLETED',
                transactionId: paymentEvent.transactionId
            });
        }
        catch (error) {
            await Kafka_config_1.kafkaConfig.sendMessage('admin.response', {
                ...paymentEvent,
                service: 'admin-service',
                status: 'FAILED',
                error: error.message
            });
        }
    }
    async handleOrderTransactionFail(failedPaymentEvent) {
        const moneyToSubtract = parseInt(failedPaymentEvent.adminShare) * -1;
        const updated = await this.adminRepository.updateWallet(moneyToSubtract);
        if (!updated?.success) {
            throw Error("role back failed. update is not success.");
        }
        console.log('rollbacked ', moneyToSubtract);
        await Kafka_config_1.kafkaConfig.sendMessage('rollback-completed', {
            transactionId: failedPaymentEvent.transactionId,
            service: 'admin-service'
        });
    }
}
exports.AdminService = AdminService;
