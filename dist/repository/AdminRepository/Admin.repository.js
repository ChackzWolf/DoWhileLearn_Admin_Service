"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const Admin_schema_1 = __importStar(require("../../schemas/Admin.schema"));
const enums_1 = require("../../common/enums/enums");
const Base_repository_1 = require("../BaseRepository/Base.repository");
class AdminRepository extends Base_repository_1.BaseRepository {
    constructor() {
        super(Admin_schema_1.default);
    }
    async findByEmail(email) {
        try {
            const admin = await this.findOne({ email });
            console.log(admin, 'email in adminRepository');
            return admin;
        }
        catch (err) {
            console.error(`Error finding admin by email: ${err}`);
            return null;
        }
    }
    async updateWallet(amount) {
        const admin = await this.findByEmail("admin@gmail.com");
        if (admin) {
            console.log('admin.wallet before');
            admin.wallet += amount;
            console.log('admin.wallet after');
            const updatedWallet = await admin?.save();
            console.log(updatedWallet, 'updated wallet');
            if (!updatedWallet) {
                throw Error;
            }
            return { success: true };
        }
    }
    async passwordChange(adminId, newPassword) {
        try {
            const admin = await this.findById(adminId);
            console.log(admin, 'admin data from repo');
            if (!admin) {
                return { message: 'Admin not found!', success: false, status: enums_1.StatusCode.NotFound };
            }
            // Ensure password is hashed before saving (if necessary)
            admin.password = newPassword;
            console.log(admin, 'updated admin data from repo');
            await admin.save(); // Save the updated admin with the new password
            console.log('updated');
            return { message: 'Password updated successfully!', success: true, status: enums_1.StatusCode.OK };
        }
        catch (error) {
            console.log(error);
            throw new Error("Admin not found");
        }
    }
    async storeOTP(email, otp) {
        try {
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            // Use findOneAndUpdate to either update or create the OTP entry
            const otpEntry = await Admin_schema_1.Otp.findOneAndUpdate({ email }, // Find the entry with the same email
            { otp, expiresAt }, // Update the OTP and expiration time
            { new: true, upsert: true } // Options: return the updated document and create if it doesn't exist
            );
            console.log(otpEntry, 'otpentry');
            return otpEntry._id;
        }
        catch (error) {
            throw new Error("User not found");
        }
    }
    async updateStoredOTP(otpId, otp) {
        try {
            const otpEntry = await Admin_schema_1.Otp.findOneAndUpdate({ _id: otpId }, // Find by otpId
            { otp }, // Update the OTP and expiration time
            { new: true, upsert: true } // Return updated doc, create if not exists
            );
            if (!otpEntry) {
                throw new Error('Failed to update or create OTP entry.');
            }
            return otpEntry;
        }
        catch (error) {
            console.error('Error updating OTP entry:', error);
            throw error; // Optionally rethrow the error for higher-level handling
        }
    }
    async verifyOTP(email, otp) {
        const otpEntry = await Admin_schema_1.Otp.findOne({ email, otp, expiresAt: { $gt: new Date() } });
        return otpEntry !== null;
    }
}
exports.AdminRepository = AdminRepository;
exports.default = AdminRepository;
