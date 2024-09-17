import adminRepository from "../repository/AdminRepository";
import  {IAdmin, ITempAdmin, TempAdmin} from "../models/AdminModel";
import dotenv from "dotenv"
import { generateOTP } from "../utils/GenerateOTP";
import { SendVerificationMail } from "../utils/SendEmail";
import createToken from "../utils/Activation.token";
import { IAdminService } from "../interfaces/IAdminService";
dotenv.config();

interface Admin{
    firstName:string;
    lastName: string; 
    email: string;
    password: string;
}

interface VerifyOtpData{
    enteredOTP:string;
    email:string;
    tempId:string
}



const repository = new adminRepository()
 

export class AdminService{
    

    async VerifyOtp(passedData: VerifyOtpData): Promise<{success:boolean, message:string, adminData?:any, accessToken?:string, refreshToken?:string}>{
        try {
            console.log('ive vannarnu', passedData);
            const tempAdmin: ITempAdmin | null = await TempAdmin.findById(passedData.tempId);
            
            if (!tempAdmin) {
                return { success: false, message: "Temp admin not found." };
            }
    
            if (tempAdmin.otp !== passedData.enteredOTP) {
                return { success: false, message: "Invalid OTP." };
            }
            
            const createAdmin: IAdmin | null = await repository.createAdmin(tempAdmin.adminData);
    
            if (!createAdmin) {
                throw new Error("Failed to create admin.");
            }
    
            console.log( createAdmin, 'create adminrr')
            const {accessToken, refreshToken} = createToken(createAdmin);
            return { success: true, message: "Admin has been registered.", adminData: createToken, accessToken, refreshToken };
    
        } catch (err) { 
            console.error("Error in VerifyOtp:", err);
            return { success: false, message: "An error occurred while verifying OTP." };
        }
    }



    async ResendOTP(passedData : VerifyOtpData):Promise<{success: boolean, message:string}> {
        try{
            const {email,tempId} = passedData;
            let newOTP = generateOTP();
            console.log(` ressend OTP : [   ${newOTP}   ]`);

            const updatedTempAdmin = await TempAdmin.findByIdAndUpdate(tempId,{otp:newOTP},{new:true})

            if(!updatedTempAdmin){
                console.log('failed to send otp')
                return { success: false, message: "Register time has expaired. Try registering again"}
            }else{
                await SendVerificationMail(email,newOTP)

                return {success: true, message:"OTP has been resent"}; 
            } 
        }catch{
            return {success: false, message: "An error occured while Resending OTP"}
        }
    }
    
    async adminLogin(loginData: { email: string; password: string; }): Promise<{ success: boolean; message: string; adminData?: IAdmin ,accessToken?:string, refreshToken?:string }> {
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
    
} 