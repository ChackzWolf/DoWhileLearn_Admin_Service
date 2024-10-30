import adminRepository from "../Repository/AdminRepository/Admin.repository";
import dotenv from "dotenv"
import createToken from "../Utils/Activation.token";
import { IAdminService } from "../Interfaces/IServices/IService.interfaces";
import { AdminLoginDTO, AdminLoginResponseService } from "../Interfaces/DTOs/Admin.dtos";
import { StatusCode } from "../Interfaces/Enums/Enums";
import { generateOTP } from "../Utils/GenerateOTP";
import { SendVerificationMail } from "../Utils/SendEmail";
import { kafkaConfig } from "../Configs/Kafka.configs/Kafka.config";
dotenv.config();

  // types/events.ts
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
    paymentStatus:boolean;
    timestamp: Date;
    status: string;
  }

const repository = new adminRepository()
 
 
export class AdminService implements IAdminService{
    
    async adminLogin(loginData: AdminLoginDTO): Promise<AdminLoginResponseService> {
        try {
            const {email, password} = loginData;
            const adminData = await repository.findByEmail(email);
            if(adminData){
                const checkPassword = await adminData.comparePassword(password);
                if(checkPassword){
                    console.log(adminData,'kkkkkkkkk')
                    const {refreshToken, accessToken} = createToken(adminData)
                    return {success:true, message: "Admin login successful.", adminData, refreshToken, accessToken}
                }else {
                    return { success: false, message: "Invalid password."}
                } 
            }else{
                return {success: false , message: "Invalid email."}
            } 
            
        } catch (error) {
            return { success:false, message: "An error occured while loggin in."};
        }
    }

    async resetPassword(data: {adminId:string, password:string}){
        try {
            console.log(data,'data from respon')
            const {adminId,password} = data;
            const response = await repository.passwordChange(adminId, password);
            console.log(response,'repon from service')
            return response
        } catch (error) {
            return {message:'error occured in service while changing password', success:false, status: StatusCode.NotModified}
        }
    }
 
    async sendEmailOtp (data: {email:string}){
        try {
            const email = data.email; 
            const emailExists = await repository.findByEmail(email);
            if(!emailExists){
                console.log("email not found triggered")
                return {success: false, message: "Email not found", status:StatusCode.NotFound };
            }
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);
            await SendVerificationMail(email,otp)
            console.log('1')
            const otpId = await repository.storeOTP(email,otp);
            console.log('2')
            return {message: 'An OTP has send to your email address.', success:true, status: StatusCode.Found,email, otpId, adminId:emailExists._id};
        } catch (error) {
            return {message:'error occured in sending OTP.', success:false, status: StatusCode.Conflict}
        }
    }

    async resendEmailOtp (data: {email: string,otpId:string}) {
        try {
            console.log('trig resend')
            const {email, otpId} = data;
            let otp = generateOTP();
            console.log(`OTP : [ ${otp} ]`);


            await SendVerificationMail(email,otp) 


            const updateStoredOTP = await repository.updateStoredOTP(otpId,otp);
            if(!updateStoredOTP){
                return {success:false, status: StatusCode.NotFound, message:"Time expired. try again later."}
            }
            console.log(updateStoredOTP,'stored otp')
            return {success:true,status : StatusCode.Accepted, message : "OTP has resend"};
        } catch (error) {
            console.log(error, "error")
            return {success:false, status: StatusCode.Conflict, message: "Error occured while resending OTP."};
        }
    }

    async resetPasswordVerifyOTP(data: {email:string,enteredOTP:string}){
        try { 
            const {email,enteredOTP} = data;
            const response = await repository.verifyOTP(email,enteredOTP)
            const admin = await repository.findByEmail(email);
            if(response && admin){
                return {success:true, message: 'Email has been verified successfuly.',status:StatusCode.Accepted,email,adminId:admin._id}
            }
            return {success:false, message: 'Entered wrong OTP.', status:StatusCode.NotAcceptable,email}
        } catch (error) {
            return {success:false, message: "Something went wrong.",status:StatusCode.FailedDependency, email:data.email} 
        }
    }

    async handleOrderSuccess(paymentEvent:OrderEventData){
        try {
            console.log(paymentEvent.adminShare, "this is admin share amount")
             const moneyToAdd = parseInt(paymentEvent.adminShare);
             const udpated = await repository.updateWallet(moneyToAdd);
             if(!udpated?.success){
                throw new Error(" not updated. error occuururur.")
             }
             await kafkaConfig.sendMessage('success.order.update', {
                success: true,
                service: 'ADMIN_SERVICE',
                transactionId: paymentEvent.transactionId
              });
        } catch (error:any) {
            await kafkaConfig.sendMessage('transaction-failed', {
                ...paymentEvent,
                service: 'ADMIN_SERVICE',
                status: 'FAILED',
                error: error.message
              });
        }
    }

    async handleOrderTransactionFail(failedPaymentEvent:OrderEventData){
        console.log('rolebacked');
        const moneyToSubstract = parseInt(failedPaymentEvent.adminShare);
        const updated = await repository.updateWallet(moneyToSubstract* -1);
        if(!updated?.success){
            throw Error("role back failed. update is not success.")
        }
        console.log('role backed ', moneyToSubstract)
        await kafkaConfig.sendMessage('rollback-completed', {
            transactionId: failedPaymentEvent.transactionId,
            service: 'ADMIN_SERVICE'
        });
    }
}  