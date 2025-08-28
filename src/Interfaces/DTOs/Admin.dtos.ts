import { IAdmin } from "../Models/IAdmin";

export interface AdminLoginDTO {
    email :string;
    password :string;
}

export interface AdminLoginResponse {
    success :boolean;
    adminData :IAdmin;
    message : string;
    status : number;
    accessToken : string;
    refreshToken :string;
    _id : string ;
}
/// response for IService
export interface AdminLoginResponseService {
    status:number
    success:boolean;
    message:string;
    adminData?:IAdmin;
    refreshToken?:string;
    accessToken?:string;
}