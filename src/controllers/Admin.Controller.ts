import { AdminService } from "../useCase/Use.Case";
import * as grpc from '@grpc/grpc-js';

const adminService = new AdminService()


export class AdminController {
 
    async Login(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>{
        try{
            console.log('trigerererere')
            const data = call.request;
            
            const response = await adminService.adminLogin(data);
            console.log(response, 'response')
            callback(null, response);
        }catch(err){
            callback(err as grpc.ServiceError)
        }
    }
}