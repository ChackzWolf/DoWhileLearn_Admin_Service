import AdminModel, {IAdmin,ITempAdmin,TempAdmin} from "../models/AdminModel";
import dotenv from "dotenv";

dotenv.config();



class adminRepository {
    
    async findByEmail (email: string): Promise<IAdmin | null>{
        try {
            const admin = await AdminModel.findOne({ email }).exec(); //.exec() method ensures that the query returns a promise.
            console.log(admin, 'email in adminRepository')
            return admin;
        } catch (err) {
            console.error(`Error finding admin by email: ${err}`);
            return null;
        }
    }
    
    async createTempAdmin(tempAdminData: Partial<ITempAdmin>): Promise<ITempAdmin | null>{
        try {
            const { adminData, otp, createdAt } = tempAdminData;
            
            const createdTempData = new TempAdmin({
                adminData,
                otp,
                createdAt: createdAt || new Date()
            });
            const savedAdmin = await createdTempData.save();
            return savedAdmin;
        } catch (err) {
            console.error("Error creating temporary admin data", err);
            return null;
        }
    }


    async createAdmin(adminData: Partial<IAdmin>): Promise<IAdmin | null>{
        try {
            const { firstName, lastName, email, password } = adminData ;
            const createdAdmin = new AdminModel({
                firstName,
                lastName,
                email,
                password,
            });
            const savedAdmin = await createdAdmin.save();
            return savedAdmin;
        } catch (err) {
            console.error("Error creating admin:", err);
            return null;
        }
    }

};

export default adminRepository