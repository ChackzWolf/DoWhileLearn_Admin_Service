import { IAdmin } from "../models/AdminModel";

export interface IAdminService {

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
