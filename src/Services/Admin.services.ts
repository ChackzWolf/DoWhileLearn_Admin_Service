import adminRepository from "../Repository/AdminRepository";
import dotenv from "dotenv"
import createToken from "../Utils/Activation.token";
import { IAdminService } from "../Interfaces/IServices/IService.interfaces";
import { AdminLoginDTO, AdminLoginResponseService } from "../Interfaces/DTOs/Admin.dtos";
dotenv.config();



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
    
}  