import { IAdminRepository } from "../../Interfaces/IRepositories/IRepositroy.interfaces";
import { OTPInterface } from "../../Schemas/Admin.schema";
import { IAdmin } from "../../Interfaces/Models/IAdmin";
import { BaseRepository } from "../BaseRepository/Base.repository";
import { ObjectId } from "mongodb";
declare class adminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor();
    findByEmail(email: string): Promise<IAdmin | null>;
    updateWallet(amount: number): Promise<{
        success: boolean;
    } | undefined>;
    passwordChange(adminId: string, newPassword: string): Promise<{
        message: string;
        success: boolean;
        status: number;
    }>;
    storeOTP(email: string, otp: string): Promise<ObjectId>;
    updateStoredOTP(otpId: string, otp: string): Promise<OTPInterface | null>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
}
export default adminRepository;
