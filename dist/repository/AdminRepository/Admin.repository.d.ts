import { IAdminRepository } from "../interfaces/IRepositroy.interfaces";
import { OTPInterface } from "../../schemas/Admin.schema";
import { IAdmin } from "../../entities/admin.entity";
import { BaseRepository } from "../BaseRepository/Base.repository";
import { ObjectId } from "mongodb";
export declare class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
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
export default AdminRepository;
