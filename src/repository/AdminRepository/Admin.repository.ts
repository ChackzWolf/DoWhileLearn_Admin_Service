// adminRepository.ts
import { IAdminRepository } from "../interfaces/IRepositroy.interfaces";
import AdminModel, {Otp, OTPInterface} from "../../schemas/Admin.schema";
import { IAdmin } from "../../entities/admin.entity";
import { StatusCode } from "../../common/enums/enums";
import { BaseRepository } from "../BaseRepository/Base.repository";
import { ObjectId } from "mongodb";


class adminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor() {
      super(AdminModel);
    }


    async findByEmail(email: string): Promise<IAdmin | null> {
        try {
            const admin = await this.findOne({ email })
            console.log(admin, 'email in adminRepository');
            return admin;
        } catch (err) {
            console.error(`Error finding admin by email: ${err}`);
            return null;
        }
    }
    async updateWallet(amount:number):Promise<{success:boolean} | undefined>{
      const admin:IAdmin | null = await this.findByEmail("admin@gmail.com")
      if(admin){
        console.log('admin.wallet before')
        admin.wallet += amount;
        console.log('admin.wallet after')
        const updatedWallet = await admin?.save()
        console.log(updatedWallet, 'updated wallet')
        if(!updatedWallet){
          throw Error
        }
        return {success:true};
      }
    }

    async passwordChange(adminId:string,newPassword:string):Promise<{message:string,success:boolean,status:number}>{
        try{
          const admin: IAdmin | null = await this.findById(adminId);
          console.log(admin,'admin data from repo')
          if (!admin) {
            return { message: 'Admin not found!', success: false, status: StatusCode.NotFound };
          }
          // Ensure password is hashed before saving (if necessary)
          admin.password = newPassword
          console.log(admin,'updated admin data from repo')
          await admin.save(); // Save the updated admin with the new password
          console.log('updated')
          return { message: 'Password updated successfully!', success: true, status: StatusCode.OK }; 
        } catch (error:unknown) {
          console.log(error)
          throw new Error("Admin not found");
        }
      }
      async storeOTP(email: string, otp: string):Promise<ObjectId>{ 
        try {
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            
            // Use findOneAndUpdate to either update or create the OTP entry
            const otpEntry = await Otp.findOneAndUpdate(
                { email }, // Find the entry with the same email
                { otp, expiresAt }, // Update the OTP and expiration time
                { new: true, upsert: true } // Options: return the updated document and create if it doesn't exist
            );
    
            console.log(otpEntry, 'otpentry');
            return otpEntry._id as ObjectId;
        } catch (error: unknown) {
          throw new Error("User not found");
        } 
    }


    async updateStoredOTP(otpId: string, otp: string):Promise<OTPInterface | null>{
      try {
        const otpEntry = await Otp.findOneAndUpdate(
          { _id:otpId }, // Find by otpId
          { otp }, // Update the OTP and expiration time
          { new: true, upsert: true } // Return updated doc, create if not exists
        );
        
        if (!otpEntry) {
          throw new Error('Failed to update or create OTP entry.');
        }
        
        return otpEntry;
      } catch (error) {
        console.error('Error updating OTP entry:', error);
        throw error; // Optionally rethrow the error for higher-level handling
      }
    }

      async verifyOTP(email:string, otp:string):Promise<boolean> {
        const otpEntry = await Otp.findOne({ email, otp, expiresAt: { $gt: new Date() } });
        return otpEntry !== null;
      }
}
export default adminRepository;
