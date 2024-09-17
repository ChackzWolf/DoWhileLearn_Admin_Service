import { AdminService } from "../useCase/Use.Case";


const adminService = new AdminService()


export class AdminController {
 
    async VerifyOtp(call: any, callback: any) {
        try{
            const data = call.request;
            const response = await adminService.VerifyOtp(data);
            console.log(response, 'response')
            callback(null, response);
        }catch(err){
            console.error(err)
        } 
    } 

    async ResendOtp(call:any, callback:any) { 
        try{ 
            const data = call.request;
            const response = await adminService.ResendOTP(data);
            callback(null,response);
        }catch(err){
            callback(err) 
        } 
    } 
  
    async Login(call:any, callback:any){
        try{
            console.log('trigerererere')
            const data = call.request;
            
            const response = await adminService.adminLogin(data);
            console.log(response, 'response')
            callback(null, response);
        }catch(err){
            callback(err)
        }
    }
}