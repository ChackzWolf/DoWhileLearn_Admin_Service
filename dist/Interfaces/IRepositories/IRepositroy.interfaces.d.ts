import { ObjectId } from "mongodb";
import { OTPInterface } from "../../Schemas/Admin.schema";
import { IAdmin } from "../Models/IAdmin";
export interface IAdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>;
    passwordChange(adminId: string, newPassword: string): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    updateStoredOTP(otpId: string, otp: string): Promise<OTPInterface | null>;
    storeOTP(email: string, otp: string): Promise<ObjectId>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
    updateWallet(amount: number): Promise<{
        success: boolean;
    } | undefined>;
}
