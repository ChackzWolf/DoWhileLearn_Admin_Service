import { IAdmin } from "../models/AdminModel";

export interface IAdminService {
    adminRegister(adminData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<{
        success: boolean; 
        message: string;
        tempId?: string;
        email?: string;
    }>;

    adminLogin(loginData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        token?: string;
    }>;

    VerifyOtp(passedData: {
        enteredOTP: string;
        email: string;
        tempId: string;
    }): Promise<{
        success: boolean;
        message: string;
        adminData?: IAdmin;
    }>;

    ResendOTP(passedData: {
        email: string;
        tempId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
