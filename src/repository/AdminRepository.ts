// adminRepository.ts
import { IAdminRepository } from "../interfaces/IAdminRepositroy";
import AdminModel, { IAdmin, ITempAdmin, TempAdmin } from "../models/AdminModel";
import dotenv from "dotenv";

dotenv.config();

class adminRepository implements IAdminRepository {
    
    async findByEmail(email: string): Promise<IAdmin | null> {
        try {
            const admin = await AdminModel.findOne({ email }).exec(); //.exec() method ensures that the query returns a promise.
            console.log(admin, 'email in adminRepository');
            return admin;
        } catch (err) {
            console.error(`Error finding admin by email: ${err}`);
            return null;
        }
    }
}
export default adminRepository;
