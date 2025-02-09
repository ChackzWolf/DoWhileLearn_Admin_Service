import mongoose, { Document, Schema,Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAdmin } from "../Interfaces/Models/IAdmin";
import { configs } from "../Configs/ENV_configs/ENV.configs";

export interface ITempAdmin extends Document {
    adminData: IAdmin;
    otp: string;
    createdAt: Date;
    _id: Types.ObjectId; // This is the correct type for MongoDB _id
}

export interface OTPInterface extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
  }

const AdminSchema: Schema <IAdmin> = new Schema({
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    wallet: {
        type:Number, 
        default: 0
    }
})

const TempAdminSchema: Schema <ITempAdmin> = new Schema({
    adminData: {
        type: Object,
        require: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type:Date,
        default: Date.now,
        expires: 900 // expires after 15 minutes
    }
}
,
{
    timestamps: true,
})

const otpSchema:Schema<OTPInterface> = new Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

// Hash password
AdminSchema.pre<IAdmin>("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password || "", 10); 
    next();
});

// sign access token
AdminSchema.methods.SignAccessToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      configs.JWT_SECRET || "",
      {
        expiresIn: configs.JWT_EXPIRATION_TIME,
      }
    );
  };



// sign refresh token
AdminSchema.methods.SignRefreshToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      configs.REFRESH_TOKEN_SECRET,
      {
        expiresIn: configs.REFRESH_TOKEN_EXPIRATION_TIME,
      }
    );
};

// compare password
AdminSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};


export const Otp = mongoose.model<OTPInterface>("setOTP",otpSchema)
export const TempAdmin = mongoose.model<ITempAdmin>("TempAdminData",TempAdminSchema)
const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel; 