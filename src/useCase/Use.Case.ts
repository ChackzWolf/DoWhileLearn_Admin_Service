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